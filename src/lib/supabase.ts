import { SupabaseClient, createClient } from "@supabase/supabase-js";
// eslint-disable-next-line import-x/no-unresolved
import "expo-sqlite/localStorage/install";

let supabaseClient: SupabaseClient | null = null;

const resolveConfig = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase configuration is missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return {
    url,
    publishableKey
  };
};

export const getSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, publishableKey } = resolveConfig();

  supabaseClient = createClient(url, publishableKey, {
    auth: {
      storage: globalThis.localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });

  return supabaseClient;
};
