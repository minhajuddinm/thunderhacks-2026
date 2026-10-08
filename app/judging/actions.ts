"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { clearJudge, readJudge, readScores, writeJudge, type Criterion } from "@/lib/judging"

export type JudgeState = { error?: string } | null

export async function judgeSignInAction(
  _prev: JudgeState,
  formData: FormData
): Promise<JudgeState> {
  const id = String(formData.get("judge_id") ?? "")
  const code = String(formData.get("code") ?? "").trim()
  if (!id) return { error: "Pick your name." }
  if (!code) return { error: "Type the code you were given." }

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.rpc("judging_open", {
    p_judge_id: id,
    p_code: code,
  })
  if (error) return { error: error.message }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return { error: "That code is not right." }

  await writeJudge(id, code)
  redirect("/judging/teams")
}

export async function judgeSignOutAction() {
  await clearJudge()
  redirect("/judging")
}

export async function saveScoreAction(formData: FormData) {
  const judge = await readJudge()
  const teamId = String(formData.get("team_id") ?? "")
  if (!judge) redirect("/judging")
  const back = `/judging/teams/${teamId}`

  let scores: Record<string, number>
  try {
    const criteria = JSON.parse(String(formData.get("criteria") ?? "[]")) as Criterion[]
    scores = readScores(formData, criteria)
  } catch (e) {
    redirect(`${back}?error=${encodeURIComponent((e as Error).message)}`)
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.rpc("judging_save", {
    p_judge_id: judge.id,
    p_code: judge.code,
    p_team_id: teamId,
    p_stream_key: String(formData.get("stream_key") ?? ""),
    p_scores: scores,
    p_comment: String(formData.get("comment") ?? ""),
  })

  revalidatePath("/judging/teams")
  revalidatePath(back)
  if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`)
  redirect(`${back}?saved=1`)
}
