"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Thin wrappers. Every rule, including "only admins", is enforced inside the
 * database functions, so nothing here is trusted to decide who may do what.
 */
async function run(fn: string, args: Record<string, unknown>, ok: string) {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.rpc(fn, args)
  revalidatePath("/admin")
  revalidatePath("/dashboard")
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`)
  redirect(`/admin?ok=${encodeURIComponent(ok)}`)
}

export async function updateParticipantAction(formData: FormData) {
  const school = String(formData.get("school") ?? "")
  await run(
    "admin_update_participant",
    {
      p_profile_id: String(formData.get("profile_id")),
      p_full_name: String(formData.get("full_name") ?? "").trim(),
      p_program: String(formData.get("program") ?? "").trim(),
      p_year: Number(formData.get("year_of_study")),
      p_school: school,
      p_school_other: school === "other" ? String(formData.get("school_other") ?? "").trim() : null,
      p_campus: String(formData.get("campus") ?? "") || null,
      p_phone: String(formData.get("phone") ?? "").trim() || null,
    },
    `Saved ${String(formData.get("full_name") ?? "").trim()}.`
  )
}

export async function removeParticipantAction(formData: FormData) {
  const name = String(formData.get("full_name") ?? "that person")
  if (String(formData.get("confirm") ?? "") !== "yes") {
    redirect(`/admin?error=${encodeURIComponent(`Tick the box to confirm removing ${name}.`)}`)
  }
  await run(
    "admin_remove_participant",
    {
      p_profile_id: String(formData.get("profile_id")),
      p_reason: String(formData.get("reason") ?? "").trim() || null,
    },
    `Removed ${name}.`
  )
}

export async function setStatusAction(formData: FormData) {
  const status = String(formData.get("status") ?? "")
  const name = String(formData.get("full_name") ?? "that person")
  await run(
    "admin_set_status",
    { p_profile_id: String(formData.get("profile_id")), p_status: status },
    status === "confirmed" ? `${name} has a spot.` : `${name} moved to the waitlist.`
  )
}

export async function setCapacityAction(formData: FormData) {
  const capacity = Number(formData.get("capacity"))
  await run("admin_set_capacity", { p_capacity: capacity }, `Cap set to ${capacity}.`)
}

export async function setOtherSchoolsAction(formData: FormData) {
  const allow = String(formData.get("allow")) === "true"
  await run(
    "admin_set_other_schools",
    { p_allow: allow },
    allow ? "Other schools can now register." : "Other schools are closed."
  )
}
