"use client"

import { createBrowserClient } from "@supabase/ssr"

// Use globalThis to ensure true singleton across module reloads
const globalForSupabase = globalThis as typeof globalThis & {
  supabaseBrowserClient?: ReturnType<typeof createBrowserClient>
}

export function getSupabaseBrowserClient() {
  if (globalForSupabase.supabaseBrowserClient) {
    return globalForSupabase.supabaseBrowserClient
  }

  globalForSupabase.supabaseBrowserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return globalForSupabase.supabaseBrowserClient
}
