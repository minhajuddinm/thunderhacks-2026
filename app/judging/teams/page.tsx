import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { readJudge, type TeamRow } from "@/lib/judging"
import { campusLabel } from "@/lib/registration"
import { Empty } from "@/components/dashboard/ui"
import { JudgingHeader, Pill, Progress } from "@/components/judging/judging-chrome"

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
      <JudgingHeader judgeName={me?.judge_name} />

      <main id="main" className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.75rem)] text-foreground">
          {me?.judge_name ? `${me.judge_name.split(" ")[0]}, here are the teams` : "Teams"}
        </h1>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Open a team when they present. Score the overall criteria first, then add any sponsor
          stream they entered.
        </p>

        {me?.is_open === false ? (
          <p className="mt-5 rounded-md border border-[#92400e] bg-[#2a1f0f] px-4 py-3 text-[15px] text-[#fbbf24]">
            Judging is closed. Nothing more can be saved.
          </p>
        ) : null}

        <Progress done={done} total={teams.length} />

        {teams.length === 0 ? (
          <div className="mt-8">
            <Empty>No teams yet.</Empty>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {teams.map((t) => (
              <li key={t.team_id}>
                <Link
                  href={`/judging/teams/${t.team_id}`}
                  className={`flex h-full flex-col justify-between gap-3 rounded-lg border bg-[var(--raised)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--bolt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)] motion-reduce:hover:translate-y-0 ${
                    t.main_done ? "border-[#14532d]" : "border-[var(--rule)]"
                  }`}
                >
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="th-display-tight text-[17px] text-foreground">
                        {t.team_name}
                      </span>
                      {t.main_done ? <Pill tone="done">Scored</Pill> : <Pill tone="todo">To do</Pill>}
                    </span>
                    <span className="mt-2 block text-[15px] leading-relaxed text-muted-foreground">
                      {t.members ?? "No members"}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>{campusLabel(t.campus)}</span>
                    <span className="text-[var(--bolt)]">
                      {t.done_streams ? t.done_streams : "Open to score"}
                    </span>
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
