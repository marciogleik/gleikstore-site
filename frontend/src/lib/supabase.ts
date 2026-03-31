import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oflocwxemmxczvskpxyg.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_WbSX8Ur4q5p9L9MFH6rZ1g_EAcvQqYQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
