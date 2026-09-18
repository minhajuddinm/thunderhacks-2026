"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isRegistrationOpen } from "@/lib/registration-server"

export type ActionState = { error: string } | null

/** Where the reset link should come back to, when the request carries no origin. */
function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return "https://thunderhacks.algomau.ca"
}

function readForm(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    fullName: String(formData.get("full_name") ?? "").trim(),
    program: String(formData.get("program") ?? "").trim(),
    year: Number(formData.get("year_of_study") ?? 0),
    school: String(formData.get("school") ?? ""),
  }
}

export async function signUpAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const f = readForm(formData)

  // Checked here as well as in the database. The database is what actually
  // stops an early POST; this just gives a civil message in the form.
  if (!(await isRegistrationOpen())) {
    return { error: "Registration has not opened yet." }
  }

  if (f.fullName.length < 2) return { error: "Enter your full name." }
  if (f.program.length < 2) return { error: "Enter your programme." }
  if (!Number.isInteger(f.year) || f.year < 1 || f.year > 7) {
    return { error: "Choose your year of study." }
  }
  if (!["algoma", "sault_college", "both"].includes(f.school)) {
    return { error: "Choose your school." }
  }
  if (f.password.length < 8) {
    return { error: "Use a password of at least 8 characters." }
  }

  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signUp({
    email: f.email,
    password: f.password,
  })

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "That email already has an account. Log in instead." }
    }
    return { error: error.message }
  }

  // With email confirmation off, signUp returns a session. If it does not, the
  // setting is still on and the account cannot be used yet, so say so plainly
  // rather than dropping the person on a broken dashboard.
  if (!data.session) {
    return {
      error:
        "Your account was created but could not be signed in. Contact alcoms@algomau.ca.",
    }
  }

  const { error: rpcError } = await supabase.rpc("complete_registration", {
    p_full_name: f.fullName,
    p_program: f.program,
    p_year: f.year,
    p_school: f.school,
  })

  if (rpcError) return { error: rpcError.message }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const f = readForm(formData)
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: f.email,
    password: f.password,
  })

  if (error) return { error: "That email and password do not match." }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function signOutAction() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/")
}

/**
 * Send a reset link. The reply is deliberately the same whether or not the
 * address has an account, so this cannot be used to find out who is
 * registered. The link lands on /auth/callback, which swaps the code for a
 * session and forwards to /reset-password.
 */
export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()

  if (!email.includes("@")) {
    return { error: "Enter the email address you registered with." }
  }

  const origin = (await headers()).get("origin") ?? siteOrigin()
  const supabase = await getSupabaseServerClient()

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  redirect("/forgot-password?sent=1")
}

/**
 * Set a new password. Reachable only with the session the reset link created,
 * so possession of a live link is what authorises the change.
 */
export async function updatePasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm_password") ?? "")

  if (password.length < 8) {
    return { error: "Use a password of at least 8 characters." }
  }
  if (password !== confirm) {
    return { error: "The two passwords do not match." }
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "That reset link has expired. Ask for a new one and try again.",
    }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
