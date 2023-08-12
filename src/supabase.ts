"use client";

import { Database } from "@/types/database"
import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// const supabaseUrl = process.env.NEXT_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_SUPABASE_KEY;

const supabaseUrl = "https://dmrexxbhqdfpgkwbjjsh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcmV4eGJocWRmcGdrd2JqanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE1MjY1OTQsImV4cCI6MjAwNzEwMjU5NH0.Cu_2CCq7vKO8VTPIWy8usbgai1iBQ0MZvno99yxcGpQ";
if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
if (!supabaseKey) throw new Error('Missing SUPABASE_KEY');
// const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
//     auth: {
//         persistSession: true,
//         storage: 
//     }
// });

const supabase = createClientComponentClient({
    supabaseUrl,
    supabaseKey,
});

export default supabase;