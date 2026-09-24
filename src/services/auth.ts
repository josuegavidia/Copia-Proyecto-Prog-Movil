import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { supabase, isSupabaseConfigured } from './supabase';

// Ensure any in-flight auth sessions are completed properly
WebBrowser.maybeCompleteAuthSession();

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

const SESSION_KEY = '@nba_session_v7';
const ACCOUNTS_KEY = '@nba_accounts_v7';
const GUEST_KEY = '@nba_is_guest_v7';

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
          await AuthService.setGuestMode(false);
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

  // Sign in with Social OAuth (Google, Apple, Facebook)
  signInWithOAuth: async (provider: 'google' | 'apple' | 'facebook') => {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'Supabase no está configurado. Por favor verifica las credenciales EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.'
      );
    }

    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'nbasquadbuilder',
        path: 'auth/callback',
      });
      console.log('🔗 [OAuth] Redirect URL generada:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });

      if (error) throw error;
      if (!data?.url) {
        throw new Error(`No se pudo obtener la URL de autenticación de ${provider}.`);
      }

      // Open in-app WebBrowser session
      const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (authResult.type === 'success' && authResult.url) {
        const rawUrl = authResult.url;
        const hashPart = rawUrl.includes('#') ? rawUrl.split('#')[1] : '';
        const queryPart = rawUrl.includes('?') ? rawUrl.split('?')[1]?.split('#')[0] : '';
        const combined = [hashPart, queryPart].filter(Boolean).join('&');

        const params: Record<string, string> = {};
        combined.split('&').forEach((pair) => {
          const [k, v] = pair.split('=');
          if (k && v) {
            params[decodeURIComponent(k)] = decodeURIComponent(v);
          }
        });

        if (params.error || params.error_description) {
          throw new Error(params.error_description || params.error || 'Error en la autenticación social.');
        }

        // Implicit grant tokens
        if (params.access_token && params.refresh_token) {
          const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (sessionErr) throw sessionErr;
          if (sessionData.session) {
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData.session));
            await AuthService.setGuestMode(false);
            return sessionData.session;
          }
        }

        // PKCE grant code
        if (params.code) {
          const { data: sessionData, error: sessionErr } = await supabase.auth.exchangeCodeForSession(params.code);
          if (sessionErr) throw sessionErr;
          if (sessionData.session) {
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData.session));
            await AuthService.setGuestMode(false);
            return sessionData.session;
          }
        }

        // Check active session from client
        const { data: activeSession } = await supabase.auth.getSession();
        if (activeSession?.session) {
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(activeSession.session));
          await AuthService.setGuestMode(false);
          return activeSession.session;
        }

        throw new Error(`No se pudo completar la sesión con ${provider}.`);
      } else if (authResult.type === 'cancel' || authResult.type === 'dismiss') {
        throw new Error('Inicio de sesión cancelado.');
      } else {
        throw new Error('No se pudo autenticar con el navegador.');
      }
    } catch (err: any) {
      console.warn(`Supabase ${provider} OAuth error:`, err);
      throw err;
    }
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

  // Ensure profile row exists in Supabase DB (creates it if deleted or on new OAuth signup)
  ensureProfileExists: async (user: any): Promise<any> => {
    if (!isSupabaseConfigured() || !user?.id) return null;
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!existing) {
        const username =
          user.user_metadata?.full_name ||
          user.user_metadata?.username ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'NBA Manager';

        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null;

        const { data: inserted, error: insertErr } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            username,
            avatar_url: avatarUrl,
            coins: 1500,
            total_packs_opened: 0,
            three_point_high_score: 0,
            seasons_won: 0,
            updated_at: new Date().toISOString(),
          })
          .select()
          .maybeSingle();

        if (insertErr) {
          console.warn('ensureProfileExists insert warning:', insertErr);
        }

        // Also ensure an initial lineup row exists for foreign key references
        try {
          await supabase.from('user_lineups').upsert(
            {
              user_id: user.id,
              team_name: 'Mi Franquicia',
              team_abbr: 'LAL',
            },
            { onConflict: 'user_id' }
          );
        } catch {}

        return inserted || null;
      }
      return existing;
    } catch (err) {
      console.warn('ensureProfileExists error:', err);
      return null;
    }
  },

  // Get Manager Profile
  getProfile: async (): Promise<ManagerProfile> => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        let dbProfile: any = null;
        if (isSupabaseConfigured()) {
          try {
            dbProfile = await AuthService.ensureProfileExists(user);
          } catch {
            // Profile trigger or fallback
          }
        }

        const username =
          dbProfile?.username ||
          user.user_metadata?.full_name ||
          user.user_metadata?.username ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'NBA Manager';

        const avatarUrl =
          dbProfile?.avatar_url ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          undefined;

        return {
          id: user.id || 'manager-1',
          username,
          email: user.email,
          avatar_url: avatarUrl,
          coins: typeof dbProfile?.coins === 'number' ? dbProfile.coins : 1500,
          total_packs_opened: dbProfile?.total_packs_opened ?? 0,
          created_at: dbProfile?.created_at || user.created_at,
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

