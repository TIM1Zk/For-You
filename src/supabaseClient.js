import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn("Supabase VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing. Local mock fallback is active.")
  // Mock client to prevent crashes during local development/testing without .env variables
  supabaseInstance = {
    from: () => ({
      select: () => ({
        in: () => ({
          order: () => Promise.resolve({ data: [], error: null })
        }),
        not: () => ({
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: {}, error: null })
        })
      }),
      delete: () => ({
        match: () => Promise.resolve({ data: null, error: null })
      })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: {}, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => Promise.resolve({ data: null, error: null })
      })
    }
  }
}

export const supabase = supabaseInstance;
