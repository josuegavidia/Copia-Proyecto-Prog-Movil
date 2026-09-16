export type Language = 'es' | 'en';

export interface TranslationSchema {
  common: {
    coins: string;
    cancel: string;
    confirm: string;
    close: string;
    save: string;
    loading: string;
    error: string;
    success: string;
    claim: string;
    claimed: string;
    locked: string;
    unlocked: string;
    progress: string;
    totalCards: string;
    of: string;
  };
  navigation: {
    squad: string;
    packs: string;
    games: string;
    collection: string;
    coach: string;
  };
  header: {
    rookieManager: string;
    cloudSynced: string;
    syncing: string;
    offlineMode: string;
    syncError: string;
    achievements: string;
    trophies: string;
  };
  profile: {
    title: string;
    rookieBadge: string;
    managerBadge: string;
    language: string;
    spanish: string;
    english: string;
    cloudSaved: string;
    cloudDesc: string;
    localSaved: string;
    localDesc: string;
    syncButton: string;
    signOutButton: string;
    trophyRoom: string;
  };
  collection: {
    title: string;
    searchPlaceholder: string;
    recycleDuplicates: string;
    noDuplicates: string;
    recycleConfirmTitle: string;
    recycleConfirmDesc: string;
    eastConf: string;
    westConf: string;
    teams: string;
    legends: string;
    allCards: string;
    collected: string;
    missing: string;
  };
  achievements: {
    modalTitle: string;
    modalSubtitle: string;
    allTab: string;
    teamsTab: string;
    collectionTab: string;
    careerTab: string;
    gameplayTab: string;
    completed: string;
    claimReward: string;
    rewardClaimed: string;
    progressSummary: string;
    unlockedTrophies: string;
    congratulations: string;
    rewardEarned: string;
  };
  packs: {
    title: string;
    freePack: string;
    freeIn: string;
    openPack: string;
    cost: string;
  };
}
