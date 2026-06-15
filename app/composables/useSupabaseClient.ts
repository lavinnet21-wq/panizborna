import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export function useSupabaseClient() {
  const config = useRuntimeConfig();
  const url = config.public.supabaseUrl;
  const key = config.public.supabasePublishableKey;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  const client = useState<SupabaseClient | null>("supabase-client", () => null);

  if (!client.value) {
    client.value = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client.value;
}
