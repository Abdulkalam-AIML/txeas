import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tyepalmkwoxcqzizkknx.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_iYyOgT614bAR15DR-kPwAg_UsGe6IFd";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (typeof window !== "undefined") {
    if (!browserClient) {
      browserClient = createBrowserClient(supabaseUrl, supabaseKey);
    }
    return browserClient;
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
};

export const getSupabaseClient = createClient;
