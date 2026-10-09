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

export async function updateScoreAction(formData: FormData) {
  let scores: Record<string, number>
  try {
    const criteria = JSON.parse(String(formData.get("criteria") ?? "[]")) as Criterion[]
    scores = readScores(formData, criteria)
  } catch (e) {
    redirect(`/admin/judging?error=${encodeURIComponent((e as Error).message)}`)
  }
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
