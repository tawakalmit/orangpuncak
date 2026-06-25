import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL ?? '';
const PUBLIC_SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Supabase client. Bila env belum diisi, `supabase` bernilai null dan
 * lapisan data otomatis memakai seed lokal (lihat src/lib/data).
 */
export const hasSupabase =
	!!PUBLIC_SUPABASE_URL &&
	!!PUBLIC_SUPABASE_ANON_KEY &&
	PUBLIC_SUPABASE_URL.startsWith('http');

export const supabase: SupabaseClient | null = hasSupabase
	? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
	: null;
