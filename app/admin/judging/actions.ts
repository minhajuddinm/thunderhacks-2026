"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { readScores, type Criterion } from "@/lib/judging"

async function run(fn: string, args: Record<string, unknown>, ok: string) {
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.rpc(fn, args)
  revalidatePath("/admin/judging")
  if (error) redirect(`/admin/judging?error=${encodeURIComponent(error.message)}`)
  redirect(`/admin/judging?ok=${encodeURIComponent(ok)}`)
}

export async function setTeamJudgingAction(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (isAdmin !== true) redirect("/dashboard")

  const enabled = String(formData.get("enabled"))
  if (enabled !== "true" && enabled !== "false") {
    redirect("/admin/judging?error=Choose%20whether%20the%20team%20can%20be%20judged.")
  }
  const { error } = await supabase.rpc("admin_set_judging_team", {
    p_team_id: String(formData.get("team_id") ?? ""),
    p_enabled: enabled === "true",
  })
  if (error) redirect(`/admin/judging?error=${encodeURIComponent(error.message)}`)
  revalidatePath("/admin/judging")
  revalidatePath("/judging/teams", "layout")
  redirect(`/admin/judging?ok=${encodeURIComponent(enabled === "true" ? "Team added to judging." : "Team removed from judging. Registration and saved scores are unchanged.")}`)
}

export async function updateScoreAction(formData: FormData) {
  let scores: Record<string, number>
  try {
    const criteria = JSON.parse(String(formData.get("criteria") ?? "[]")) as Criterion[]
    scores = readScores(formData, criteria)
  } catch (e) {
    redirect(`/admin/judging?error=${encodeURIComponent((e as Error).message)}`)
  }
  // Keep the CBN entry answer the judge gave, which is not a scored line.
  const mvp = String(formData.get("mvp_ok") ?? "")
  if (mvp === "yes" || mvp === "no") scores.mvp_ok = mvp === "yes" ? 1 : 0
  await run(
    "admin_judging_update",
    {
      p_score_id: String(formData.get("score_id")),
      p_scores: scores,
      p_comment: String(formData.get("comment") ?? ""),
    },
    "Score updated."
  )
}

export async function regenerateJudgeCodeAction(formData: FormData) {
  const name = String(formData.get("full_name") ?? "that judge")
  await run(
    "admin_judging_regenerate_code",
    { p_judge_id: String(formData.get("judge_id")) },
    `${name} has a new code. Read it off the list and give it to them.`
  )
}

export async function setJudgingSettingsAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim()
  await run("admin_judging_settings", { p_code: code || null, p_is_open: null }, "Code saved.")
}

export async function setJudgingOpenAction(formData: FormData) {
  const open = String(formData.get("open")) === "true"
  await run(
    "admin_judging_settings",
    { p_code: null, p_is_open: open },
    open ? "Judging is open." : "Judging is closed."
  )
}

export async function addJudgeAction(formData: FormData) {
  await run(
    "admin_judging_add_judge",
    {
      p_full_name: String(formData.get("full_name") ?? "").trim(),
      p_title: String(formData.get("title") ?? "").trim() || null,
    },
    "Judge added."
  )
}

export async function setJudgeActiveAction(formData: FormData) {
  const active = String(formData.get("active")) === "true"
  await run(
    "admin_judging_set_judge_active",
    { p_judge_id: String(formData.get("judge_id")), p_active: active },
    active ? "Judge turned on." : "Judge turned off."
  )
}

export async function deleteScoreAction(formData: FormData) {
  await run(
    "admin_judging_delete_score",
    { p_score_id: String(formData.get("score_id")) },
    "Score cleared."
  )
}

export async function resetTeamAction(formData: FormData) {
  const name = String(formData.get("team_name") ?? "that team")
  await run(
    "admin_judging_reset_team",
    { p_team_id: String(formData.get("team_id")) },
    `Cleared every score for ${name}.`
  )
}

export async function resetAllAction(formData: FormData) {
  await run(
    "admin_judging_reset_all",
    { p_confirm: String(formData.get("confirm") ?? "") },
    "Every score cleared."
  )
}

export async function deleteJudgeAction(formData: FormData) {
  const name = String(formData.get("full_name") ?? "that judge")
  await run(
    "admin_judging_delete_judge",
    { p_judge_id: String(formData.get("judge_id")) },
    `${name} removed.`
  )
}
