import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY START:", supabaseAnonKey?.slice(0, 25));
console.log("SUPABASE KEY LENGTH:", supabaseAnonKey?.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
