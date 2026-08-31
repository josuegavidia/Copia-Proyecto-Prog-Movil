import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';
import { StorageService } from './storage';
import { AuthService } from './auth';
import { UserCard, SquadLineup, CustomCoach } from '../types';
import { NBA_PLAYERS_DATA } from '../data/nbaPlayers';

export type SyncStatus = 'SYNCED' | 'SYNCING' | 'LOCAL_ONLY' | 'ERROR';

type SyncListener = (status: SyncStatus, lastSyncedAt?: Date) => void;

class SyncManager {
  private status: SyncStatus = 'LOCAL_ONLY';
  private lastSyncedAt: Date | null = null;
  private listeners: Set<SyncListener> = new Set();
  private syncTimeout: NodeJS.Timeout | null = null;

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.status, this.lastSyncedAt || undefined);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setStatus(status: SyncStatus) {
    this.status = status;
    if (status === 'SYNCED') {
      this.lastSyncedAt = new Date();
    }
    this.listeners.forEach((l) => l(this.status, this.lastSyncedAt || undefined));
  }

  public getStatus(): SyncStatus {
    return this.status;
  }

  public getLastSyncedAt(): Date | null {
    return this.lastSyncedAt;
  }

  // Push local data to Supabase (debounced to avoid excessive writes)
  public schedulePush(delayMs: number = 1200) {
    if (!isSupabaseConfigured()) {
      this.setStatus('LOCAL_ONLY');
      return;
    }

    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    this.setStatus('SYNCING');
    this.syncTimeout = setTimeout(() => {
      this.pushLocalToCloud();
    }, delayMs);
  }

  // Sincronizar todos los datos locales a Supabase
  public async pushLocalToCloud(): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      this.setStatus('LOCAL_ONLY');
      return false;
    }

    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        this.setStatus('LOCAL_ONLY');
        return false;
      }

      this.setStatus('SYNCING');

      const coins = await StorageService.getCoins();
      const cards = await StorageService.getCards();
      const lineup = await StorageService.getLineup();
      const coaches = await StorageService.getCoaches();

      // 1. Sync Profile & Coins
      await supabase.from('profiles').upsert({
        id: user.id,
        user_id: user.id,
        coins,
      });

      // 2. Sync Coaches
      if (coaches.length > 0) {
        const coachRows = coaches.map((c) => ({
          id: c.id,
          user_id: user.id,
          name: c.name,
          photo_url: c.photoUri,
          team_affinity: c.teamAffinity,
          tactic: c.tactic,
          boost_offense: c.boostOffense,
          boost_defense: c.boostDefense,
          boost_chemistry: c.boostChemistry,
          signature_quote: c.signatureQuote || '',
        }));

        await supabase.from('user_coaches').upsert(coachRows);
      }

      // 3. Sync User Cards
      if (cards.length > 0) {
        const cardRows = cards.map((c) => ({
          user_id: user.id,
          player_id: c.playerId || c.player?.id || 'unknown',
          is_locked: c.isLocked || false,
          obtained_at: c.obtainedAt || new Date().toISOString(),
        }));

        await supabase.from('user_cards').upsert(cardRows);
      }

      // 4. Sync Lineup
      const lineupRow = {
        user_id: user.id,
        coach_id: lineup.coach?.id || null,
        pg_card_id: lineup.pg?.instanceId || null,
        sg_card_id: lineup.sg?.instanceId || null,
        sf_card_id: lineup.sf?.instanceId || null,
        pf_card_id: lineup.pf?.instanceId || null,
        c_card_id: lineup.c?.instanceId || null,
        updated_at: new Date().toISOString(),
      };

      await supabase.from('user_lineups').upsert(lineupRow, { onConflict: 'user_id' });

      this.setStatus('SYNCED');
      return true;
    } catch (e) {
      console.warn('Sync to cloud error (will retry automatically):', e);
      this.setStatus('ERROR');
      return false;
    }
  }

  // Descargar datos de la nube a local
  public async pullCloudToLocal(): Promise<{
    coins: number;
    cards: UserCard[];
    lineup: SquadLineup;
    coaches: CustomCoach[];
  } | null> {
    this.setStatus('LOCAL_ONLY');
    const coins = await StorageService.getCoins();
    const cards = await StorageService.getCards();
    const lineup = await StorageService.getLineup();
    const coaches = await StorageService.getCoaches();
    return { coins, cards, lineup, coaches };
  }
}

export const SyncService = new SyncManager();
