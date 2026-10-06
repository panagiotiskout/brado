import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://placeholder.local",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder",
  );
}
