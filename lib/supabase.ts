import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (lazy initialization)
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// For backward compatibility (lazy - only created when accessed)
let _client: ReturnType<typeof createClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    if (typeof window === 'undefined') {
      // During SSR/build, return a no-op
      return () => {};
    }
    if (!_client) {
      _client = getSupabaseClient();
    }
    const value = (_client as any)[prop];
    return typeof value === 'function' ? value.bind(_client) : value;
  },
});

// Server-side Supabase client
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey);
};

