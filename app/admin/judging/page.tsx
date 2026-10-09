import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { inputClass } from "@/components/auth/auth-shell"
import { Empty, Panel, PrimaryButton, QuietButton } from "@/components/dashboard/ui"
import type { Criterion } from "@/lib/judging"
import {
  addJudgeAction,
  deleteScoreAction,
  resetAllAction,
  resetTeamAction,
  setJudgeActiveAction,
  setJudgingOpenAction,
  setJudgingSettingsAction,
  updateScoreAction,
} from "./actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Judging | Admin | ThunderHacks II",
  robots: { index: false, follow: false },
}

type Score = {
  score_id: string
  judge_id: string
  judge_name: string
  team_id: string
  team_name: string
  stream_key: string
  stream_name: string
  criteria: Criterion[]
  scores: Record<string, number>
  comment: string | null
  total: number
  max_total: number
  submitted_at: string
  edited_by_admin_at: string | null
}
type Judge = {
  id: string
  full_name: string
  title: string | null
  is_active: boolean
  saved: number
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

type Search = { searchParams: Promise<{ ok?: string; error?: string }> }

export default async function AdminJudgingPage({ searchParams }: Search) {
  const { ok, error } = await searchParams
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (isAdmin !== true) redirect("/dashboard")

  const [{ data: scoreRows }, { data: judgeRows }, { data: settingRows }] = await Promise.all([
    supabase.rpc("admin_judging_overview"),
    supabase.rpc("admin_judging_judges"),
    supabase.rpc("admin_judging_code"),
  ])

  const scores = (scoreRows ?? []) as unknown as Score[]
  const judges = (judgeRows ?? []) as unknown as Judge[]
  const settings = (Array.isArray(settingRows) ? settingRows[0] : settingRows) as
    | { access_code: string; is_open: boolean }
    | null

  // Grouped by team, so a team's scores from every judge sit together.
  const teams = new Map<string, { name: string; rows: Score[] }>()
  for (const s of scores) {
    const entry = teams.get(s.team_id) ?? { name: s.team_name, rows: [] }
    entry.rows.push(s)
    teams.set(s.team_id, entry)
  }
  const leaderboard = [...teams.entries()]
    .map(([id, t]) => {
      const main = t.rows.filter((r) => r.stream_key === "overall")
      const avg = main.length
        ? main.reduce((sum, r) => sum + Number(r.total), 0) / main.length
        : 0
      return { id, name: t.name, rows: t.rows, judges: main.length, avg }
    })
    .sort((a, b) => b.avg - a.avg || a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <span className="th-display-tight text-[16px] text-foreground">
            ThunderHacks <span className="text-[var(--bolt)]">II</span>{" "}
            <span className="text-muted-foreground">Judging</span>
          </span>
          <Link
            href="/admin"
            className="rounded-md border border-[var(--rule)] px-4 py-2 text-[15px] text-foreground transition-colors hover:border-[var(--bolt)]"
          >
            Participants
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {error ? (
          <p role="alert" className="mb-6 rounded-md border border-[#7f1d1d] bg-[#2a1214] px-4 py-3 text-[15px] text-[#fca5a5]">
            {error}
          </p>
        ) : null}
        {ok ? (
          <p role="status" className="mb-6 rounded-md border border-[#14532d] bg-[#0f2418] px-4 py-3 text-[15px] text-[#86efac]">
            {ok}
          </p>
        ) : null}

        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.75rem)] text-foreground">Judging</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Judges reach this at /judging. The page is not linked anywhere on the site.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel
            title="Code and status"
            lead={
              settings?.is_open
                ? "Judging is open. Judges need this code to start."
                : "Judging is closed. Nothing more can be saved."
            }
          >
            <form action={setJudgingSettingsAction} className="flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="text-sm text-muted-foreground">Judging code</span>
                <input
                  name="code"
                  defaultValue={settings?.access_code ?? ""}
                  maxLength={40}
                  className={`mt-1 w-48 ${inputClass}`}
                />
              </label>
              <PrimaryButton>Save code</PrimaryButton>
            </form>
            <form action={setJudgingOpenAction} className="mt-5">
              <input type="hidden" name="open" value={settings?.is_open ? "false" : "true"} />
              {settings?.is_open ? (
                <QuietButton danger>Close judging</QuietButton>
              ) : (
                <PrimaryButton>Open judging</PrimaryButton>
              )}
            </form>
          </Panel>

          <Panel title="Judges" lead="Only active judges show on the sign-in page.">
            {judges.length === 0 ? (
              <Empty>No judges yet.</Empty>
            ) : (
              <ul className="space-y-2">
                {judges.map((j) => (
                  <li
                    key={j.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-2"
                  >
                    <span className="min-w-0">
                      <span className="th-display-tight text-[15px] text-foreground">
                        {j.full_name}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {j.title ? `${j.title} · ` : ""}
                        {j.saved} saved
                        {j.is_active ? "" : " · off"}
                      </span>
                    </span>
                    <form action={setJudgeActiveAction}>
                      <input type="hidden" name="judge_id" value={j.id} />
                      <input type="hidden" name="active" value={j.is_active ? "false" : "true"} />
                      <QuietButton>{j.is_active ? "Turn off" : "Turn on"}</QuietButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <form action={addJudgeAction} className="mt-5 flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="text-sm text-muted-foreground">Name</span>
                <input name="full_name" required maxLength={80} className={`mt-1 ${inputClass}`} />
              </label>
              <label className="block">
                <span className="text-sm text-muted-foreground">Title (optional)</span>
                <input name="title" maxLength={80} className={`mt-1 ${inputClass}`} />
              </label>
              <PrimaryButton>Add judge</PrimaryButton>
            </form>
          </Panel>
        </div>

        <section className="mt-10">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">Standings</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Average of the overall scores, across the judges who have scored that team.
          </p>
          {leaderboard.length === 0 ? (
            <div className="mt-4">
              <Empty>No scores yet.</Empty>
            </div>
          ) : (
            <ol className="mt-4 space-y-5">
              {leaderboard.map((t, i) => (
                <li key={t.id} className="border border-[var(--rule)] bg-[var(--raised)] p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="th-display-tight text-[17px] text-foreground">
                      {i + 1}. {t.name}
                    </span>
                    <span className="flex flex-wrap items-center gap-4">
                      <span className="th-display text-xl text-[var(--bolt)]">
                        {t.avg.toFixed(1)}
                        <span className="ml-2 text-sm text-muted-foreground">
                          from {t.judges} {t.judges === 1 ? "judge" : "judges"}
                        </span>
                      </span>
                      <form action={resetTeamAction}>
                        <input type="hidden" name="team_id" value={t.id} />
                        <input type="hidden" name="team_name" value={t.name} />
                        <button
                          type="submit"
                          className="rounded-md border border-[#7f1d1d] px-3 py-1.5 text-sm text-[#fca5a5] transition-colors hover:border-[#b91c1c]"
                        >
                          Reset team
                        </button>
                      </form>
                    </span>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {t.rows.map((r) => (
                      <li key={r.score_id} className="border-t border-[var(--rule)] pt-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-[15px] text-foreground">
                            {r.stream_name} · {r.judge_name}
                          </span>
                          <span className="text-[15px] text-muted-foreground">
                            {r.total} / {r.max_total} · {when(r.submitted_at)}
                            {r.edited_by_admin_at ? ` · changed ${when(r.edited_by_admin_at)}` : ""}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {r.criteria
                            .map((c) => `${c.label} ${r.scores[c.key]}/${c.max}`)
                            .join(" · ")}
                        </p>
                        {r.comment ? (
                          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground">
                            {r.comment}
                          </p>
                        ) : null}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <form action={deleteScoreAction}>
                            <input type="hidden" name="score_id" value={r.score_id} />
                            <button
                              type="submit"
                              className="rounded-md border border-[#7f1d1d] px-3 py-1.5 text-sm text-[#fca5a5] transition-colors hover:border-[#b91c1c]"
                            >
                              Clear this score
                            </button>
                          </form>
                        </div>

                        <details className="mt-3">
                          <summary className="inline-block cursor-pointer list-none rounded-md border border-[var(--rule)] px-3 py-1.5 text-sm text-foreground hover:border-[var(--bolt)]">
                            Change
                          </summary>
                          <form action={updateScoreAction} className="mt-4 max-w-xl space-y-3">
                            <input type="hidden" name="score_id" value={r.score_id} />
                            <input
                              type="hidden"
                              name="criteria"
                              value={JSON.stringify(r.criteria)}
                            />
                            <ul className="space-y-2">
                              {r.criteria.map((c) => (
                                <li
                                  key={c.key}
                                  className="flex flex-wrap items-center justify-between gap-3"
                                >
                                  <label
                                    htmlFor={`${r.score_id}_${c.key}`}
                                    className="text-[15px] text-foreground"
                                  >
                                    {c.label}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      out of {c.max}
                                    </span>
                                  </label>
                                  <input
                                    id={`${r.score_id}_${c.key}`}
                                    name={`score_${c.key}`}
                                    type="number"
                                    min={0}
                                    max={c.max}
                                    step={1}
                                    required
                                    defaultValue={r.scores[c.key]}
                                    className={`${inputClass} w-24`}
                                  />
                                </li>
                              ))}
                            </ul>
                            <label className="block">
                              <span className="text-sm text-muted-foreground">Comments</span>
                              <textarea
                                name="comment"
                                rows={3}
                                maxLength={2000}
                                defaultValue={r.comment ?? ""}
                                className={`mt-1 ${inputClass}`}
                              />
                            </label>
                            <PrimaryButton>Save change</PrimaryButton>
                          </form>
                        </details>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="mt-12 border border-[#7f1d1d] bg-[#1b1012] p-6 sm:p-7">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">Start over</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Clears every score from every judge, for test runs before the day. Type RESET to
            confirm. There is no undo.
          </p>
          <form action={resetAllAction} className="mt-5 flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="text-sm text-muted-foreground">Type RESET</span>
              <input
                name="confirm"
                required
                autoComplete="off"
                placeholder="RESET"
                className={`mt-1 w-40 ${inputClass}`}
              />
            </label>
            <button
              type="submit"
              className="rounded-md border border-[#7f1d1d] px-4 py-2 text-[15px] text-[#fca5a5] transition-colors hover:border-[#b91c1c]"
            >
              Clear every score
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
