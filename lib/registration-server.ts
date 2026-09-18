import "server-only"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { registrationOpensAt } from "@/lib/registration"

/**
 * Whether registration has opened, asked of the database so there is a single
 * source of truth. Falls back to the constant if the call fails, which keeps a
 * transient database hiccup from accidentally opening the gate early.
 *
 * Kept apart from lib/registration.ts because that file's constants are
 * imported by client components, and this one reaches for next/headers.
 */
export async function isRegistrationOpen(): Promise<boolean> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.rpc("registration_is_open")
    if (error) throw error
    return data === true
  } catch {
    return Date.now() >= registrationOpensAt().getTime()
  }
}
