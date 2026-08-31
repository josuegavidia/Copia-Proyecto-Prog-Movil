import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';

export interface ManagerProfile {
  id: string;
  user_id?: string;
  username: string;
  email?: string;
  coins: number;
  total_packs_opened: number;
  created_at?: string;
  avatar_url?: string;
}

interface LocalAccount {
  id: string;
  email: string;
  password: string;
  username: string;
}

const SESSION_KEY = '@nba_session_v5';
const ACCOUNTS_KEY = '@nba_accounts_v5';
const GUEST_KEY = '@nba_is_guest_v5';

export const AuthService = {
  // Check if Supabase connection is available
  isConfigured: (): boolean => {
    return isSupabaseConfigured();
  },

  // Get active session
  getSession: async () => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session) return data.session;
      }
      const localSession = await AsyncStorage.getItem(SESSION_KEY);
      return localSession ? JSON.parse(localSession) : null;
    } catch (e) {
      console.warn('AuthService.getSession error:', e);
      return null;
    }
  },

  // Get current user object
  getCurrentUser: async () => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.getUser();
        if (!error && data?.user) return data.user;
      }
      const session = await AuthService.getSession();
      return session?.user || null;
    } catch {
      return null;
    }
  },

  // Check if user is in guest mode
  isGuest: async (): Promise<boolean> => {
    try {
      const isGuest = await AsyncStorage.getItem(GUEST_KEY);
      return isGuest === 'true';
    } catch {
      return false;
    }
  },

  // Set guest mode
  setGuestMode: async (enabled: boolean): Promise<void> => {
    try {
      if (enabled) {
        await AsyncStorage.setItem(GUEST_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(GUEST_KEY);
      }
    } catch (e) {
      console.error('Failed to set guest mode', e);
    }
  },

  // Sign up with Email & Password
  signUp: async (email: string, password: string, username: string = 'NBA Manager') => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim() || 'NBA Manager';

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { username: cleanUsername },
          },
        });
        if (error) throw error;
        if (data.session) {
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
        }
        return data;
      } catch (err: any) {
        console.warn('Supabase signup error, falling back to local storage:', err);
      }
    }

    // Local Accounts Storage
    const existingRaw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    const accounts: LocalAccount[] = existingRaw ? JSON.parse(existingRaw) : [];

    const existing = accounts.find((a) => a.email === cleanEmail);
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    const newAccount: LocalAccount = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      password,
      username: cleanUsername,
    };

    accounts.push(newAccount);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

    const sessionObj = {
      user: {
        id: newAccount.id,
        email: newAccount.email,
        user_metadata: { username: newAccount.username },
      },
      access_token: `token-${newAccount.id}`,
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
    await AuthService.setGuestMode(false);
    return sessionObj;
  },

  // Sign in with Email & Password
  signIn: async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        if (data.session) {
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
          await AuthService.setGuestMode(false);
          return data;
        }
      } catch (err: any) {
        console.warn('Supabase signin failed, checking local accounts:', err);
      }
    }

    // Check Local Accounts
    const existingRaw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    const accounts: LocalAccount[] = existingRaw ? JSON.parse(existingRaw) : [];

    const matched = accounts.find(
      (a) => a.email === cleanEmail && a.password === password
    );

    if (!matched) {
      throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña o crea una cuenta nueva.');
    }

    const sessionObj = {
      user: {
        id: matched.id,
        email: matched.email,
        user_metadata: { username: matched.username },
      },
      access_token: `token-${matched.id}`,
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
    await AuthService.setGuestMode(false);
    return sessionObj;
  },

  // Sign Out
  signOut: async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      await AsyncStorage.removeItem(SESSION_KEY);
      await AsyncStorage.removeItem(GUEST_KEY);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  },

  // Get Manager Profile
  getProfile: async (): Promise<ManagerProfile> => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        return {
          id: user.id || 'manager-1',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'Rookie Manager',
          email: user.email,
          coins: 500,
          total_packs_opened: 0,
        };
      }

      return {
        id: 'empty-manager',
        username: 'Rookie Manager',
        coins: 500,
        total_packs_opened: 0,
      };
    } catch (e) {
      return {
        id: 'empty-manager',
        username: 'Rookie Manager',
        coins: 500,
        total_packs_opened: 0,
      };
    }
  },
};
