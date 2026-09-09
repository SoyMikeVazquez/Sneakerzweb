import { createClient } from '@supabase/supabase-js';

// Cliente 1: Proyecto Auxiliar (Lecturas simples)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente 2: Proyecto Principal (Registros complejos)
const mainUrl = process.env.NEXT_PUBLIC_SUPABASE_MAIN_URL || '';
const mainKey = process.env.NEXT_PUBLIC_SUPABASE_MAIN_ANON_KEY || '';

export const supabaseMain = createClient(mainUrl, mainKey);
