import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client must only be used server-side, never exposed to frontend
export const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key from env
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ?? ""
);
