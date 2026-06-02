import { createClient } from '@supabase/supabase-js'

// ─── Production domain ────────────────────────────────────────────────────────
export const SITE_URL = 'https://www.stlmirror.in'

// ─── Supabase Configuration ──────────────────────────────────────────────────
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
export const SUPABASE_URL = rawUrl ? new URL(rawUrl).origin : ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// ─── Admin Gate ───────────────────────────────────────────────────────────────
// Add or remove emails from this list to control who has admin privileges.
export const ADMIN_EMAILS = [
  'krishnabhosale265@gmail.com',
  'bgmloverhub@gmail.com',
]

export const isAdminEmail = (email) =>
  typeof email === 'string' &&
  ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase().trim())

// ─── Client Init Check ────────────────────────────────────────────────────────
const isConfigured =
  SUPABASE_URL &&
  SUPABASE_URL !== 'your_supabase_url_here' &&
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here'

if (!isConfigured) {
  console.warn(
    '⚠️  STL_Mirror: Supabase credentials not configured.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

// ─── Supabase Client ──────────────────────────────────────────────────────────
let supabase

try {
  if (isConfigured) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  } else {
    // Stub client — returns empty results without throwing
    const noopFn = () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    const chainable = () => {
      const obj = {
        select: () => obj, insert: () => obj, update: () => obj, delete: () => obj,
        upsert: () => obj, eq: () => obj, neq: () => obj, in: () => obj, or: () => obj,
        ilike: () => obj, order: () => obj, limit: () => obj, range: () => obj,
        single: noopFn, then: (resolve) => resolve({ data: null, error: null, count: 0 }),
      }
      return obj
    }
    supabase = {
      from: () => chainable(),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: (cb) => {
          cb('INITIAL_SESSION', null)
          return { data: { subscription: { unsubscribe: () => {} } } }
        },
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured. Add credentials to .env' } }),
        signOut: () => Promise.resolve({}),
        getUser: () => Promise.resolve({ data: { user: null } }),
      },
      rpc: () => Promise.resolve({ data: null, error: null }),
    }
  }
} catch (err) {
  console.error('Supabase init error:', err)
}

export { supabase, isConfigured }

