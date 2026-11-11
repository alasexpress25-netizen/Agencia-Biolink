import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};

export const SUPABASE_URL: string = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY: string = env.VITE_SUPABASE_ANON_KEY || '';
// Identificador de este cliente (fila de la tabla "sites"). Uno distinto por cada BioLink vendido.
export const SITE_ID: string = env.VITE_SITE_ID || 'default';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: `biolink-auth-${SITE_ID}`,
      },
    })
  : null;
