import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration: uses EXPO_PUBLIC environment variables or the project's production endpoint
const DEFAULT_SUPABASE_URL = 'https://ynypucsmhlnivgzcolwr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueXB1Y3NtaGxuaXZnemNvbHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MDA1OTYsImV4cCI6MjEwNTI3NjU5Nn0.C2nlE03Gzy-EfbQBGoW-H4NnojGsIrGjyyBPnJSruDo';

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  const url = SUPABASE_URL;
  const key = SUPABASE_ANON_KEY;
  return Boolean(url) && Boolean(key) && key.length > 20 && key !== 'public-anon-key-placeholder';
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
