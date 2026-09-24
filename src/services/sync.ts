import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';
import { StorageService, createAllCollectionCards } from './storage';
import { AuthService } from './auth';
import { UserCard, SquadLineup, CustomCoach } from '../types';
import { NBA_PLAYERS_DATA } from '../data/nbaPlayers';

export type SyncStatus = 'SYNCED' | 'SYNCING' | 'LOCAL_ONLY' | 'ERROR';

type SyncListener = (status: SyncStatus, lastSyncedAt?: Date) => void;

class SyncManager {
  private status: SyncStatus = 'LOCAL_ONLY';
  private lastSyncedAt: Date | null = null;
  private listeners: Set<SyncListener> = new Set();
  private syncTimeout: ReturnType<typeof setTimeout> | null = null;

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
      const isGuest = await AuthService.isGuest();
      if (isGuest) {
        this.setStatus('LOCAL_ONLY');
        return false;
      }

      const user = await AuthService.getCurrentUser();
      if (!user) {
        this.setStatus('LOCAL_ONLY');
        return false;
      }

      this.setStatus('SYNCING');

      // Ensure profile exists in Supabase
      await AuthService.ensureProfileExists(user);

      const coins = await StorageService.getCoins();
      const cards = await StorageService.getCards();
      const lineup = await StorageService.getLineup();
      const coaches = await StorageService.getCoaches();
      const teamName = await StorageService.getTeamName();
      const teamLogo = await StorageService.getTeamLogo();
      const teamAbbr = await StorageService.getTeamAbbr();
      const achievements = await StorageService.getClaimedAchievements();

      // 1. Sync Profile & Coins
      await supabase.from('profiles').upsert({
        id: user.id,
        coins,
        updated_at: new Date().toISOString(),
      });

      // 2. Sync Coaches
      if (coaches.length > 0) {
        const coachRows = coaches.map((c) => ({
          id: c.id,
          user_id: user.id,
          name: c.name,
          photo_uri: c.photoUri,
          team_affinity: c.teamAffinity,
          tactic: c.tactic,
          boost_offense: c.boostOffense,
          boost_defense: c.boostDefense,
          boost_chemistry: c.boostChemistry,
          signature_quote: c.signatureQuote || '',
          is_cutout: c.isCutout || false,
        }));

        await supabase.from('user_coaches').upsert(coachRows);
      }

      // 3. Sync User Cards
      if (cards.length > 0) {
        const cardRows = cards.map((c) => ({
          id: c.instanceId,
          user_id: user.id,
          player_id: c.playerId || c.player?.id || 'unknown',
          is_locked: c.isLocked || false,
          games_played: c.gamesPlayed || 0,
          obtained_at: c.obtainedAt || new Date().toISOString(),
        }));

        await supabase.from('user_cards').upsert(cardRows);
      }

      // 4. Sync Lineup
      const lineupRow = {
        user_id: user.id,
        team_name: teamName || 'My NBA Squad',
        team_abbr: teamAbbr || 'NBA',
        team_logo: teamLogo || null,
        coach_id: lineup.coach?.id || null,
        pg_card_id: lineup.pg?.instanceId || null,
        sg_card_id: lineup.sg?.instanceId || null,
        sf_card_id: lineup.sf?.instanceId || null,
        pf_card_id: lineup.pf?.instanceId || null,
        c_card_id: lineup.c?.instanceId || null,
        updated_at: new Date().toISOString(),
      };

      await supabase.from('user_lineups').upsert(lineupRow, { onConflict: 'user_id' });

      // 5. Sync Achievements
      if (achievements.length > 0) {
        const achievementRows = achievements.map((aid) => ({
          user_id: user.id,
          achievement_id: aid,
          claimed_at: new Date().toISOString(),
        }));
        await supabase.from('user_achievements').upsert(achievementRows, { onConflict: 'user_id,achievement_id' });
      }

      this.setStatus('SYNCED');
      return true;
    } catch (e) {
      console.warn('Sync to cloud error (will retry automatically):', e);
      this.setStatus('ERROR');
      return false;
    }
  }

  // Descargar datos de la nube a local al iniciar sesión
  public async pullCloudToLocal(): Promise<{
    coins: number;
    cards: UserCard[];
    lineup: SquadLineup;
    coaches: CustomCoach[];
  } | null> {
    if (!isSupabaseConfigured()) {
      this.setStatus('LOCAL_ONLY');
      const coins = await StorageService.getCoins();
      const cards = await StorageService.getCards();
      const lineup = await StorageService.getLineup();
      const coaches = await StorageService.getCoaches();
      return { coins, cards, lineup, coaches };
    }

    try {
      const isGuest = await AuthService.isGuest();
      if (isGuest) {
        this.setStatus('LOCAL_ONLY');
        const coins = await StorageService.getCoins();
        const cards = await StorageService.getCards();
        const lineup = await StorageService.getLineup();
        const coaches = await StorageService.getCoaches();
        return { coins, cards, lineup, coaches };
      }

      const user = await AuthService.getCurrentUser();
      if (!user) return null;

      // Ensure active storage user is set to this specific user ID
      StorageService.setActiveUser(user.id);

      // Ensure Profile exists in Supabase DB
      const profile = await AuthService.ensureProfileExists(user);

      // 1. Fetch Profile & Coins
      if (profile && typeof profile.coins === 'number') {
        await StorageService.setCoins(profile.coins);
      } else {
        await StorageService.setCoins(1500);
      }

      // 2. Fetch User Cards
      const { data: cloudCards } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', user.id);

      let reconstructedCards: UserCard[] = [];
      if (cloudCards && cloudCards.length > 0) {
        const playerMap = new Map(NBA_PLAYERS_DATA.map((p) => [p.id, p]));
        reconstructedCards = cloudCards
          .map((row: any) => {
            const player = playerMap.get(row.player_id);
            if (!player) return null;
            return {
              instanceId: row.id,
              playerId: row.player_id,
              player,
              obtainedAt: row.obtained_at,
              isLocked: row.is_locked,
              gamesPlayed: row.games_played || 0,
            };
          })
          .filter(Boolean) as UserCard[];
        await StorageService.setCards(reconstructedCards);
      } else {
        // Nueva cuenta o sin cartas aún en la nube
        await StorageService.setCards([]);
      }

      // 3. Fetch User Coaches
      const { data: cloudCoaches } = await supabase
        .from('user_coaches')
        .select('*')
        .eq('user_id', user.id);

      let reconstructedCoaches: CustomCoach[] = [];
      if (cloudCoaches && cloudCoaches.length > 0) {
        reconstructedCoaches = cloudCoaches.map((row: any) => ({
          id: row.id,
          name: row.name,
          photoUri: row.photo_uri,
          teamAffinity: row.team_affinity,
          tactic: row.tactic,
          boostOffense: row.boost_offense,
          boostDefense: row.boost_defense,
          boostChemistry: row.boost_chemistry,
          signatureQuote: row.signature_quote || '',
          createdAt: row.created_at || new Date().toISOString(),
          isCutout: row.is_cutout || false,
          cutoutShape: row.cutout_shape || 'bust',
        }));
        await StorageService.saveAllCoaches(reconstructedCoaches);
      } else {
        await StorageService.saveAllCoaches([]);
      }

      // 4. Fetch Lineup
      const { data: cloudLineup } = await supabase
        .from('user_lineups')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cloudLineup) {
        const cardMap = new Map(reconstructedCards.map((c) => [c.instanceId, c]));
        const coachMap = new Map(reconstructedCoaches.map((c) => [c.id, c]));

        const lineup: SquadLineup = {
          pg: cloudLineup.pg_card_id ? cardMap.get(cloudLineup.pg_card_id) || null : null,
          sg: cloudLineup.sg_card_id ? cardMap.get(cloudLineup.sg_card_id) || null : null,
          sf: cloudLineup.sf_card_id ? cardMap.get(cloudLineup.sf_card_id) || null : null,
          pf: cloudLineup.pf_card_id ? cardMap.get(cloudLineup.pf_card_id) || null : null,
          c: cloudLineup.c_card_id ? cardMap.get(cloudLineup.c_card_id) || null : null,
          coach: cloudLineup.coach_id ? coachMap.get(cloudLineup.coach_id) || null : null,
        };
        await StorageService.saveLineup(lineup);

        if (cloudLineup.team_name) await StorageService.setTeamName(cloudLineup.team_name);
        if (cloudLineup.team_logo) await StorageService.setTeamLogo(cloudLineup.team_logo);
        if (cloudLineup.team_abbr) await StorageService.setTeamAbbr(cloudLineup.team_abbr);
      } else {
        await StorageService.saveLineup({
          pg: null,
          sg: null,
          sf: null,
          pf: null,
          c: null,
          coach: null,
        });
      }

      // 5. Fetch Achievements
      const { data: cloudAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (cloudAchievements && cloudAchievements.length > 0) {
        await StorageService.saveClaimedAchievements(cloudAchievements.map((a: any) => a.achievement_id));
      } else {
        await StorageService.saveClaimedAchievements([]);
      }

      const coins = await StorageService.getCoins();
      const cards = await StorageService.getCards();
      const lineup = await StorageService.getLineup();
      const coaches = await StorageService.getCoaches();

      this.setStatus('SYNCED');
      return { coins, cards, lineup, coaches };
    } catch (err) {
      console.warn('pullCloudToLocal error, falling back to local storage:', err);
      const coins = await StorageService.getCoins();
      const cards = await StorageService.getCards();
      const lineup = await StorageService.getLineup();
      const coaches = await StorageService.getCoaches();
      return { coins, cards, lineup, coaches };
    }
  }
}

export const SyncService = new SyncManager();

