import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Initialize the Supabase client
// You can import `supabase` from this module to interact with Supabase (Database, Auth, Storage)
export const supabase = createClient(supabaseUrl, supabaseKey);
