import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ApiError } from '../services/api.ts'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) {
    return client
  }

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new ApiError('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  })

  return client
}

export function storageBucket(): string {
  const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET?.trim()

  return bucket ? bucket : 'portfolio'
}

export function storageBaseUrl(): string | undefined {
  return import.meta.env.VITE_SUPABASE_URL
}

export function bindSignal<T extends { abortSignal(signal: AbortSignal): T }>(
  query: T,
  signal?: AbortSignal,
): T {
  return signal ? query.abortSignal(signal) : query
}
