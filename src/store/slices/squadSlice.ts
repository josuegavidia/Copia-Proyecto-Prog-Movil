import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../services/storage';
import { SoundService } from '../../services/sound';
import { AuthService } from '../../services/auth';
import { SyncService } from '../../services/sync';
import { UserCard, SquadLineup, CustomCoach } from '../../types';
import { CareerStats } from '../../data/achievements';
import { Language } from '../../i18n/types';

export interface SquadState {
  coins: number;
  cards: UserCard[];
  lineup: SquadLineup;
  coaches: CustomCoach[];
  isAuth: boolean;
  isGuest: boolean;
  isLoading: boolean;
  profileModalVisible: boolean;
  achievementsModalVisible: boolean;
  language: Language;
  claimedAchievements: string[];
  careerStats: CareerStats;
}

const initialState: SquadState = {
  coins: 500,
  cards: [],
  lineup: {
    pg: null,
    sg: null,
    sf: null,
    pf: null,
    c: null,
    coach: null,
  },
  coaches: [],
  isAuth: false,
  isGuest: false,
  isLoading: true,
  profileModalVisible: false,
  achievementsModalVisible: false,
  language: 'es',
  claimedAchievements: [],
  careerStats: {
    daysLoggedIn: 1,
    hasCoachPhoto: false,
    seasonsWon: 0,
    totalPacksOpened: 0,
    threePointHighScore: 0,
  },
};

// Async Thunks
export const initApp = createAsyncThunk('squad/initApp', async () => {
  try {
    await SoundService.init();
    await StorageService.initApp();

    // Record login day
    const loginDays = await StorageService.recordDailyLogin();
    const loadedLang = await StorageService.getLanguage();
    const loadedClaimed = await StorageService.getClaimedAchievements();
    const loadedCareer = await StorageService.getCareerStats();

    const session = await AuthService.getSession();
    if (session) {
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

      return {
        isAuth: true,
        coins: loadedCoins,
        cards: uniqueCards,
        lineup: loadedLineup,
        coaches: loadedCoaches,
        language: loadedLang,
        claimedAchievements: loadedClaimed,
        careerStats: { ...loadedCareer, daysLoggedIn: loginDays },
      };
    }

    // Guest / Local mode
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

    return {
      isAuth: false,
      coins: loadedCoins,
      cards: Array.from(uniqueMap.values()),
      lineup: loadedLineup,
      coaches: loadedCoaches,
      language: loadedLang,
      claimedAchievements: loadedClaimed,
      careerStats: { ...loadedCareer, daysLoggedIn: loginDays },
    };
  } catch (err) {
    console.warn('Init error in Redux:', err);
    return { isAuth: false };
  }
});

export const loadLocalData = createAsyncThunk('squad/loadLocalData', async () => {
  const loadedCoins = await StorageService.getCoins();
  const loadedCards = await StorageService.getCards();
  const loadedLineup = await StorageService.getLineup();
  const loadedCoaches = await StorageService.getCoaches();
  const loadedLang = await StorageService.getLanguage();
  const loadedClaimed = await StorageService.getClaimedAchievements();
  const loadedCareer = await StorageService.getCareerStats();

  const uniqueMap = new Map<string, UserCard>();
  loadedCards.forEach((c) => {
    if (!uniqueMap.has(c.instanceId)) {
      uniqueMap.set(c.instanceId, c);
    }
  });
  const uniqueCards = Array.from(uniqueMap.values());

  return {
    coins: loadedCoins,
    cards: uniqueCards,
    lineup: loadedLineup,
    coaches: loadedCoaches,
    language: loadedLang,
    claimedAchievements: loadedClaimed,
    careerStats: loadedCareer,
  };
});

export const setAppLanguage = createAsyncThunk(
  'squad/setAppLanguage',
  async (lang: Language) => {
    await StorageService.setLanguage(lang);
    return lang;
  }
);

export const claimAchievementReward = createAsyncThunk(
  'squad/claimAchievementReward',
  async ({ id, rewardCoins }: { id: string; rewardCoins: number }, { getState }) => {
    const state = getState() as { squad: SquadState };
    const updatedClaimed = await StorageService.claimAchievement(id);
    const newCoins = state.squad.coins + rewardCoins;
    await StorageService.setCoins(newCoins);

    if (state.squad.isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }

    return {
      claimedAchievements: updatedClaimed,
      coins: newCoins,
    };
  }
);

export const recordCoachPhotoCreated = createAsyncThunk(
  'squad/recordCoachPhotoCreated',
  async () => {
    const updated = await StorageService.updateCareerStats((prev) => ({
      ...prev,
      hasCoachPhoto: true,
    }));
    return updated;
  }
);

export const recordSeasonWon = createAsyncThunk(
  'squad/recordSeasonWon',
  async () => {
    const updated = await StorageService.updateCareerStats((prev) => ({
      ...prev,
      seasonsWon: (prev.seasonsWon || 0) + 1,
    }));
    return updated;
  }
);

export const incrementPacksOpened = createAsyncThunk(
  'squad/incrementPacksOpened',
  async (count: number = 1) => {
    const updated = await StorageService.updateCareerStats((prev) => ({
      ...prev,
      totalPacksOpened: (prev.totalPacksOpened || 0) + count,
    }));
    return updated;
  }
);

export const updateLineup = createAsyncThunk(
  'squad/updateLineup',
  async (newLineup: SquadLineup, { getState }) => {
    await StorageService.saveLineup(newLineup);
    const state = getState() as { squad: SquadState };
    if (state.squad.isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
    return newLineup;
  }
);

export const addCards = createAsyncThunk(
  'squad/addCards',
  async (newCards: UserCard[], { getState, dispatch }) => {
    const state = getState() as { squad: SquadState };
    const updated = [...state.squad.cards, ...newCards];
    await StorageService.setCards(updated);
    // Track packs count increment
    dispatch(incrementPacksOpened(1));
    if (state.squad.isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
    return updated;
  }
);

export const recycleDuplicates = createAsyncThunk(
  'squad/recycleDuplicates',
  async (recycledCoins: number, { getState }) => {
    const state = getState() as { squad: SquadState };
    const seenPlayerIds = new Set<string>();
    const uniqueCards: UserCard[] = [];

    state.squad.cards.forEach((card) => {
      const pid = card.player?.id || card.playerId;
      if (!seenPlayerIds.has(pid)) {
        seenPlayerIds.add(pid);
        uniqueCards.push(card);
      }
    });

    const newCoins = state.squad.coins + recycledCoins;
    await StorageService.setCards(uniqueCards);
    await StorageService.setCoins(newCoins);

    if (state.squad.isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }

    return { uniqueCards, newCoins };
  }
);

export const spendCoins = createAsyncThunk(
  'squad/spendCoins',
  async (amount: number, { getState, rejectWithValue }) => {
    const state = getState() as { squad: SquadState };
    if (state.squad.coins < amount) {
      return rejectWithValue('Fondos insuficientes');
    }
    const newCoins = state.squad.coins - amount;
    await StorageService.setCoins(newCoins);
    if (state.squad.isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
    return newCoins;
  }
);

export const earnCoins = createAsyncThunk(
  'squad/earnCoins',
  async (amount: number, { getState }) => {
    const state = getState() as { squad: SquadState };
    const newCoins = state.squad.coins + amount;
    await StorageService.setCoins(newCoins);
    if (state.squad.isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
    return newCoins;
  }
);

export const addCoach = createAsyncThunk(
  'squad/addCoach',
  async (newCoach: CustomCoach, { getState, dispatch }) => {
    const state = getState() as { squad: SquadState };
    const updated = [newCoach, ...state.squad.coaches.filter((c) => c.id !== newCoach.id)];
    await StorageService.saveCoach(newCoach);
    if (newCoach.photoUri) {
      dispatch(recordCoachPhotoCreated());
    }
    if (state.squad.isAuth) {
      SyncService.pushLocalToCloud().catch(console.warn);
    }
    return updated;
  }
);

export const logout = createAsyncThunk('squad/logout', async () => {
  await AuthService.signOut();
});

export const setAuthSuccess = createAsyncThunk(
  'squad/setAuthSuccess',
  async (_, { dispatch }) => {
    await dispatch(loadLocalData());
    return true;
  }
);

export const setGuestSuccess = createAsyncThunk(
  'squad/setGuestSuccess',
  async (_, { dispatch }) => {
    await dispatch(loadLocalData());
    return true;
  }
);

export const squadSlice = createSlice({
  name: 'squad',
  initialState,
  reducers: {
    setProfileModalVisible: (state, action: PayloadAction<boolean>) => {
      state.profileModalVisible = action.payload;
    },
    setAchievementsModalVisible: (state, action: PayloadAction<boolean>) => {
      state.achievementsModalVisible = action.payload;
    },
    setCoins: (state, action: PayloadAction<number>) => {
      state.coins = action.payload;
    },
    setCards: (state, action: PayloadAction<UserCard[]>) => {
      state.cards = action.payload;
    },
    setLineupState: (state, action: PayloadAction<SquadLineup>) => {
      state.lineup = action.payload;
    },
    setCoachesState: (state, action: PayloadAction<CustomCoach[]>) => {
      state.coaches = action.payload;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // initApp
      .addCase(initApp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initApp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuth = !!action.payload.isAuth;
          if (action.payload.coins !== undefined) state.coins = action.payload.coins;
          if (action.payload.cards !== undefined) state.cards = action.payload.cards;
          if (action.payload.lineup !== undefined) state.lineup = action.payload.lineup;
          if (action.payload.coaches !== undefined) state.coaches = action.payload.coaches;
          if (action.payload.language) state.language = action.payload.language;
          if (action.payload.claimedAchievements) state.claimedAchievements = action.payload.claimedAchievements;
          if (action.payload.careerStats) state.careerStats = action.payload.careerStats;
        }
      })
      .addCase(initApp.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
      })
      // loadLocalData
      .addCase(loadLocalData.fulfilled, (state, action) => {
        state.coins = action.payload.coins;
        state.cards = action.payload.cards;
        state.lineup = action.payload.lineup;
        state.coaches = action.payload.coaches;
        if (action.payload.language) state.language = action.payload.language;
        if (action.payload.claimedAchievements) state.claimedAchievements = action.payload.claimedAchievements;
        if (action.payload.careerStats) state.careerStats = action.payload.careerStats;
      })
      // setAppLanguage
      .addCase(setAppLanguage.fulfilled, (state, action) => {
        state.language = action.payload;
      })
      // claimAchievementReward
      .addCase(claimAchievementReward.fulfilled, (state, action) => {
        state.claimedAchievements = action.payload.claimedAchievements;
        state.coins = action.payload.coins;
      })
      // recordCoachPhotoCreated
      .addCase(recordCoachPhotoCreated.fulfilled, (state, action) => {
        if (action.payload) state.careerStats = action.payload;
      })
      // recordSeasonWon
      .addCase(recordSeasonWon.fulfilled, (state, action) => {
        if (action.payload) state.careerStats = action.payload;
      })
      // incrementPacksOpened
      .addCase(incrementPacksOpened.fulfilled, (state, action) => {
        if (action.payload) state.careerStats = action.payload;
      })
      // updateLineup
      .addCase(updateLineup.fulfilled, (state, action) => {
        state.lineup = action.payload;
      })
      // addCards
      .addCase(addCards.fulfilled, (state, action) => {
        state.cards = action.payload;
      })
      // recycleDuplicates
      .addCase(recycleDuplicates.fulfilled, (state, action) => {
        state.cards = action.payload.uniqueCards;
        state.coins = action.payload.newCoins;
      })
      // spendCoins
      .addCase(spendCoins.fulfilled, (state, action) => {
        state.coins = action.payload;
      })
      // earnCoins
      .addCase(earnCoins.fulfilled, (state, action) => {
        state.coins = action.payload;
      })
      // addCoach
      .addCase(addCoach.fulfilled, (state, action) => {
        state.coaches = action.payload;
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuth = false;
      })
      // setAuthSuccess & setGuestSuccess
      .addCase(setAuthSuccess.fulfilled, (state) => {
        state.isAuth = true;
      })
      .addCase(setGuestSuccess.fulfilled, (state) => {
        state.isAuth = true;
      });
  },
});

export const {
  setProfileModalVisible,
  setAchievementsModalVisible,
  setCoins,
  setCards,
  setLineupState,
  setCoachesState,
  setIsAuth,
} = squadSlice.actions;

export default squadSlice.reducer;
