import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export function useSupabaseClient() {
  const config = useRuntimeConfig();
  const url = config.public.supabaseUrl;
  const key = config.public.supabasePublishableKey;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(url, key);
}
