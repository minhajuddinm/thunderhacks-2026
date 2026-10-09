import "server-only"
import { cookies } from "next/headers"

export const JUDGE_COOKIE = "th_judge"

export type Criterion = { key: string; label: string; max: number; hint?: string }
export type Stream = {
  id: string
  key: string
  name: string
  blurb: string | null
  is_main: boolean
  criteria: Criterion[]
}
export type TeamRow = {
  team_id: string
  team_name: string
  campus: string | null
  members: string | null
  done_streams: string | null
  main_done: boolean
}
export type SavedScore = {
  score_id: string
  stream_id: string
  stream_key: string
  stream_name: string
  criteria: Criterion[]
  scores: Record<string, number>
  comment: string | null
  total: number
  max_total: number
  submitted_at: string
}

/**
 * Who the judge is and the code they typed, kept in an httpOnly cookie. The
 * code is the credential: every judging function in the database checks it
 * again, so a cookie on its own proves nothing.
 */
export async function readJudge(): Promise<{ id: string; code: string } | null> {
  const raw = (await cookies()).get(JUDGE_COOKIE)?.value
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { id?: string; code?: string }
    if (!parsed.id || !parsed.code) return null
    return { id: parsed.id, code: parsed.code }
  } catch {
    return null
  }
}

export async function writeJudge(id: string, code: string) {
  ;(await cookies()).set(JUDGE_COOKIE, JSON.stringify({ id, code }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/judging",
    maxAge: 60 * 60 * 12,
  })
}

export async function clearJudge() {
  ;(await cookies()).delete(JUDGE_COOKIE)
}

/** Reads the posted number for one criterion, as the database expects it. */
export function readScores(formData: FormData, criteria: Criterion[]) {
  const scores: Record<string, number> = {}
  for (const c of criteria) {
    const raw = String(formData.get(`score_${c.key}`) ?? "").trim()
    if (raw === "") throw new Error(`Give a score for ${c.label}.`)
    const n = Number(raw)
    if (!Number.isFinite(n) || n < 0 || n > c.max) {
      throw new Error(`${c.label} has to be between 0 and ${c.max}.`)
    }
    scores[c.key] = n
  }
  return scores
}
