import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tyepalmkwoxcqzizkknx.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_iYyOgT614bAR15DR-kPwAg_UsGe6IFd";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
