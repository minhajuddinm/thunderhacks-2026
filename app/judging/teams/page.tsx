import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { readJudge, type TeamRow } from "@/lib/judging"
import { campusLabel } from "@/lib/registration"
import { Empty, QuietButton } from "@/components/dashboard/ui"
import { judgeSignOutAction } from "../actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Teams to judge | ThunderHacks II",
  robots: { index: false, follow: false },
}

export default async function JudgingTeamsPage() {
  const judge = await readJudge()
  if (!judge) redirect("/judging")

  const supabase = await getSupabaseServerClient()
  const [{ data: open }, { data: rows, error }] = await Promise.all([
    supabase.rpc("judging_open", { p_judge_id: judge.id, p_code: judge.code }),
    supabase.rpc("judging_teams", { p_judge_id: judge.id, p_code: judge.code }),
  ])
  if (error) redirect("/judging")

  const me = (Array.isArray(open) ? open[0] : open) as
    | { judge_name: string; is_open: boolean }
    | null
  const teams = (rows ?? []) as unknown as TeamRow[]
  const done = teams.filter((t) => t.main_done).length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <span className="th-display-tight text-[16px] text-foreground">
            ThunderHacks <span className="text-[var(--bolt)]">II</span>{" "}
            <span className="text-muted-foreground">Judging</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {me?.judge_name}
            </span>
            <form action={judgeSignOutAction}>
              <QuietButton>Finish</QuietButton>
            </form>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.75rem)] text-foreground">
          Teams
        </h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          {done} of {teams.length} scored.
          {me?.is_open === false ? " Judging is closed." : ""}
        </p>

        {teams.length === 0 ? (
          <div className="mt-8">
            <Empty>No teams yet.</Empty>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {teams.map((t) => (
              <li key={t.team_id}>
                <Link
                  href={`/judging/teams/${t.team_id}`}
                  className="flex flex-wrap items-center justify-between gap-3 border border-[var(--rule)] bg-[var(--raised)] p-5 transition-colors hover:border-[var(--bolt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
                >
                  <span className="min-w-0">
                    <span className="th-display-tight block text-[17px] text-foreground">
                      {t.team_name}
                    </span>
                    <span className="mt-1 block text-[15px] text-muted-foreground">
                      {campusLabel(t.campus)} · {t.members ?? "No members"}
                    </span>
                    {t.done_streams ? (
                      <span className="mt-1 block text-sm text-[var(--bolt)]">
                        Scored: {t.done_streams}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[15px] text-muted-foreground">
                    {t.main_done ? "Open" : "Score"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
