"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isRegistrationOpen } from "@/lib/registration-server"

export type ActionState =
  | { error: string; code?: "email_taken" | "bad_credentials" }
  | null

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
    schoolOther: String(formData.get("school_other") ?? "").trim(),
    campus: String(formData.get("campus") ?? ""),
    mediaConsent: String(formData.get("media_consent") ?? "") === "yes",
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
  if (!Number.isInteger(f.year) || f.year < 1 || f.year > 4) {
    return { error: "Choose your year of study." }
  }
  if (!["algoma", "sault_college", "other"].includes(f.school)) {
    return { error: "Choose your school." }
  }
  if (f.school === "other" && f.schoolOther.length < 2) {
    return { error: "Tell us which school you are at." }
  }
  if (f.school === "sault_college") f.campus = "sault_ste_marie"
  if (!["brampton", "sault_ste_marie"].includes(f.campus)) {
    return { error: "Choose the campus you will attend." }
  }
  if (!f.mediaConsent) {
    return { error: "You need to agree to photos and video to take part." }
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
    // Supabase answers 422 user_already_exists whether or not the password
    // matches, so this is the same message either way.
    const already =
      error.message.toLowerCase().includes("already registered") ||
      (error as { code?: string }).code === "user_already_exists"
    if (already) {
      return {
        error: "That email already has an account.",
        code: "email_taken",
      }
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
    p_school_other: f.school === "other" ? f.schoolOther : null,
    p_campus: f.campus,
    p_media_consent: true,
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

  // Supabase returns the same invalid_credentials for a wrong password and
  // for an address with no account, so the message cannot claim to know which.
  if (error) {
    return {
      error: "That email and password do not match.",
      code: "bad_credentials",
    }
  }

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
    redirectTo: `${origin}/auth/reset-callback`,
  })

  redirect("/forgot-password?sent=1")
}

/** The two questions existing registrants answer once. */
export async function completeEventDetailsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const campus = String(formData.get("campus") ?? "")
  const consent = String(formData.get("media_consent") ?? "") === "yes"
  if (!["brampton", "sault_ste_marie"].includes(campus)) {
    return { error: "Choose the campus you will attend." }
  }
  if (!consent) {
    return { error: "You need to agree to photos and video to take part." }
  }
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.rpc("complete_event_details", {
    p_campus: campus,
    p_media_consent: true,
  })
  if (error) return { error: error.message }
  revalidatePath("/dashboard")
  redirect("/dashboard")
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
