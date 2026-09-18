"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Every team action is a thin call to a database function. The rules (one team
 * per person, four members, only the leader approves) live there, so these do
 * no checking of their own beyond reading the form.
 *
 * On failure we bounce back to the dashboard with the database's own message
 * in the query string, which keeps each button a plain form with no client
 * state to wire up.
 */
async function run(fn: string, args: Record<string, unknown>) {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.rpc(fn, args)

  revalidatePath("/dashboard")

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`)
  }
  redirect("/dashboard")
}

export async function createTeamAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  if (name.length < 2) {
    redirect(`/dashboard?error=${encodeURIComponent("Give your team a name.")}`)
  }
  await run("create_team", { p_name: name })
}

export async function requestToJoinAction(formData: FormData) {
  await run("request_to_join", { p_team_id: String(formData.get("team_id")) })
}

export async function inviteAction(formData: FormData) {
  await run("invite_to_team", { p_profile_id: String(formData.get("profile_id")) })
}

export async function respondAction(formData: FormData) {
  await run("respond_to_request", {
    p_request_id: String(formData.get("request_id")),
    p_accept: String(formData.get("accept")) === "true",
  })
}

export async function cancelRequestAction(formData: FormData) {
  await run("cancel_request", { p_request_id: String(formData.get("request_id")) })
}

export async function leaveTeamAction() {
  await run("leave_team", {})
}
