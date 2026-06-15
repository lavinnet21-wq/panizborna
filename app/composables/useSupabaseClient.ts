import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

let browserSupabaseClient: SupabaseClient | null = null;

export function useSupabaseClient() {
  const config = useRuntimeConfig();
  const url = config.public.supabaseUrl;
  const key = config.public.supabasePublishableKey;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  if (import.meta.server) {
    return createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  if (!browserSupabaseClient) {
    browserSupabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserSupabaseClient;
}
