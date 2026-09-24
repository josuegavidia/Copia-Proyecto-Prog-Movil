import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AuthService, ManagerProfile } from '../services/auth';
import { StorageService } from '../services/storage';
import { SyncService } from '../services/sync';
import { useAppDispatch } from '../store/hooks';
import { setAuthSuccess, setGuestSuccess, logout as reduxLogout } from '../store/slices/squadSlice';

interface AuthContextType {
  user: ManagerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, username?: string) => Promise<any>;
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<any>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<ManagerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const guestStatus = await AuthService.isGuest();
      setIsGuest(guestStatus);

      if (guestStatus) {
        StorageService.setActiveUser('guest');
        setUser({
          id: 'guest-user',
          username: 'Guest Manager',
          coins: 500,
          total_packs_opened: 0,
        });
        dispatch(setGuestSuccess());
      } else {
        const session = await AuthService.getSession();
        if (session?.user) {
          StorageService.setActiveUser(session.user.id);
          await AuthService.ensureProfileExists(session.user);
          await SyncService.pullCloudToLocal();
          const profile = await AuthService.getProfile();
          setUser(profile);
          dispatch(setAuthSuccess());
        } else {
          StorageService.setActiveUser(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.warn('AuthContext: Failed to check auth status', error);
      StorageService.setActiveUser(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const session = await AuthService.signIn(email, password);
      if (session?.user) {
        StorageService.setActiveUser(session.user.id);
        await StorageService.initApp(session.user.id);
        await AuthService.ensureProfileExists(session.user);
        await SyncService.pullCloudToLocal();
      }
      const profile = await AuthService.getProfile();
      setUser(profile);
      setIsGuest(false);
      dispatch(setAuthSuccess());
      return session;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const signUp = useCallback(async (email: string, password: string, username: string = 'NBA Manager') => {
    setIsLoading(true);
    try {
      const session = await AuthService.signUp(email, password, username);
      if (session?.user) {
        StorageService.setActiveUser(session.user.id);
        await StorageService.initApp(session.user.id);
        await AuthService.ensureProfileExists(session.user);
        await SyncService.pullCloudToLocal();
      }
      const profile = await AuthService.getProfile();
      setUser(profile);
      setIsGuest(false);
      dispatch(setAuthSuccess());
      return session;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const signInAsGuest = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.setGuestMode(true);
      StorageService.setActiveUser('guest');
      await StorageService.initApp('guest');
      setIsGuest(true);
      setUser({
        id: 'guest-user',
        username: 'Guest Manager',
        coins: 500,
        total_packs_opened: 0,
      });
      dispatch(setGuestSuccess());
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    setIsLoading(true);
    try {
      const session = await AuthService.signInWithOAuth(provider);
      if (session?.user) {
        StorageService.setActiveUser(session.user.id);
        await StorageService.initApp(session.user.id);
        await AuthService.ensureProfileExists(session.user);
        await SyncService.pullCloudToLocal();
      }
      const profile = await AuthService.getProfile();
      setUser(profile);
      setIsGuest(false);
      dispatch(setAuthSuccess());
      return session;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      StorageService.setActiveUser(null);
      setUser(null);
      setIsGuest(false);
      dispatch(reduxLogout());
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await AuthService.getProfile();
      setUser(profile);
    } catch (error) {
      console.warn('Failed to refresh profile', error);
    }
  }, []);

  const isAuthenticated = useMemo(() => {
    return !!user || isGuest;
  }, [user, isGuest]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      isGuest,
      signIn,
      signUp,
      signInWithOAuth,
      signInAsGuest,
      signOut,
      refreshProfile,
    }),
    [user, isLoading, isAuthenticated, isGuest, signIn, signUp, signInWithOAuth, signInAsGuest, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
