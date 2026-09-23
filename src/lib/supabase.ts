import { createClient } from '@supabase/supabase-js';

// Cliente: Proyecto Principal
const mainUrl = process.env.NEXT_PUBLIC_SUPABASE_MAIN_URL || '';
const mainKey = process.env.NEXT_PUBLIC_SUPABASE_MAIN_ANON_KEY || '';

export const supabaseMain = createClient(mainUrl, mainKey);

// En caso de que queden referencias al cliente viejo, redirigirlas al principal
export const supabase = supabaseMain;
