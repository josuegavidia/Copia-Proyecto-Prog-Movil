import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { SoundService } from '../services/sound';
import { AuthService } from '../services/auth';
import { SyncService } from '../services/sync';
import { UserCard, SquadLineup, CustomCoach } from '../types';

interface SquadContextType {
  coins: number;
  cards: UserCard[];
  lineup: SquadLineup;
  coaches: CustomCoach[];
  isAuth: boolean;
  isGuest: boolean;
  isLoading: boolean;
  profileModalVisible: boolean;
  setProfileModalVisible: (visible: boolean) => void;
  loadLocalData: () => Promise<void>;
  updateLineup: (newLineup: SquadLineup) => Promise<void>;
  addCards: (newCards: UserCard[]) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  earnCoins: (amount: number) => Promise<void>;
  addCoach: (newCoach: CustomCoach) => Promise<void>;
  logout: () => Promise<void>;
  setAuthSuccess: () => Promise<void>;
  setGuestSuccess: () => Promise<void>;
}

const SquadContext = createContext<SquadContextType | undefined>(undefined);

export const SquadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState(500);
  const [cards, setCards] = useState<UserCard[]>([]);
  const [lineup, setLineup] = useState<SquadLineup>({
    pg: null,
    sg: null,
    sf: null,
    pf: null,
    c: null,
    coach: null,
  });
  const [coaches, setCoaches] = useState<CustomCoach[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const loadLocalData = async () => {
    try {
      const loadedCoins = await StorageService.getCoins();
      const loadedCards = await StorageService.getCards();
      const loadedLineup = await StorageService.getLineup();
      const loadedCoaches = await StorageService.getCoaches();

      const uniqueMap = new Map<string, UserCard>();
      loadedCards.forEach((c) => {
        if (!uniqueMap.has(c.instanceId)) {
          uniqueMap.set(c.instanceId, c);
        }
      });
      const uniqueCards = Array.from(uniqueMap.values());

      setCoins(loadedCoins);
      setCards(uniqueCards);
      setLineup(loadedLineup);
      setCoaches(loadedCoaches);
    } catch (e) {
      console.warn('Error loading squad data:', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await SoundService.init();
        await StorageService.initApp();

        const session = await AuthService.getSession();
        if (session) {
          setIsAuth(true);
          await loadLocalData();
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        console.warn('Init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const updateLineup = async (newLineup: SquadLineup) => {
    setLineup(newLineup);
    await StorageService.saveLineup(newLineup);
    if (isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
  };

  const addCards = async (newCards: UserCard[]) => {
    const updated = [...cards, ...newCards];
    setCards(updated);
    await StorageService.setCards(updated);
    if (isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
  };

  const spendCoins = async (amount: number): Promise<boolean> => {
    if (coins < amount) return false;
    const newCoins = coins - amount;
    setCoins(newCoins);
    await StorageService.setCoins(newCoins);
    if (isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
    return true;
  };

  const earnCoins = async (amount: number) => {
    const newCoins = coins + amount;
    setCoins(newCoins);
    await StorageService.setCoins(newCoins);
    if (isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
  };

  const addCoach = async (newCoach: CustomCoach) => {
    const updated = [newCoach, ...coaches.filter((c) => c.id !== newCoach.id)];
    setCoaches(updated);
    await StorageService.saveCoach(newCoach);
    if (isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
  };

  const logout = async () => {
    await AuthService.signOut();
    setIsAuth(false);
  };

  const setAuthSuccess = async () => {
    setIsAuth(true);
    await loadLocalData();
  };

  const setGuestSuccess = async () => {
    setIsAuth(true);
    await loadLocalData();
  };

  return (
    <SquadContext.Provider
      value={{
        coins,
        cards,
        lineup,
        coaches,
        isAuth,
        isGuest,
        isLoading,
        profileModalVisible,
        setProfileModalVisible,
        loadLocalData,
        updateLineup,
        addCards,
        spendCoins,
        earnCoins,
        addCoach,
        logout,
        setAuthSuccess,
        setGuestSuccess,
      }}
    >
      {children}
    </SquadContext.Provider>
  );
};

export const useSquad = () => {
  const context = useContext(SquadContext);
  if (!context) {
    throw new Error('useSquad must be used within a SquadProvider');
  }
  return context;
};
