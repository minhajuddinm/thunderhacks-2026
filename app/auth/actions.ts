"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isRegistrationOpen } from "@/lib/registration-server"

export type ActionState = { error: string } | null

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
