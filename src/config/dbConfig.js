import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_DB_URL
const supabaseKey = process.env.NEXT_PUBLIC_DB_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;