import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { readJudge, type SavedScore, type Stream, type TeamRow } from "@/lib/judging"
import { campusLabel } from "@/lib/registration"
import { inputClass } from "@/components/auth/auth-shell"
import { PrimaryButton } from "@/components/dashboard/ui"
import { JudgingHeader, Pill } from "@/components/judging/judging-chrome"
import { ScoreFields } from "@/components/judging/score-fields"
import { saveScoreAction } from "../../actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Score a team | ThunderHacks II",
  robots: { index: false, follow: false },
}

type Params = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; saved?: string }>
}

/** One set of criteria, with a comment box, saved in a single go. */
function ScoreForm({
  teamId,
  stream,
  label,
}: {
  teamId: string
  stream: Stream
  label: string
}) {
  return (
    <form action={saveScoreAction} className="space-y-4">
      <input type="hidden" name="team_id" value={teamId} />
      <input type="hidden" name="stream_key" value={stream.key} />
      <input type="hidden" name="criteria" value={JSON.stringify(stream.criteria)} />

      <ScoreFields streamKey={stream.key} criteria={stream.criteria} />

      <label className="block">
        <span className="text-sm text-muted-foreground">Comments</span>
        <textarea
          name="comment"
          rows={4}
          maxLength={2000}
          className={`mt-1 ${inputClass}`}
          placeholder="What stood out, what let it down."
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <PrimaryButton>{label}</PrimaryButton>
        <span className="text-sm text-muted-foreground">Saved once, so check it first.</span>
      </div>
    </form>
  )
}

function SavedBlock({ s }: { s: SavedScore }) {
  return (
    <div className="border border-[var(--rule)] bg-[var(--raised)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="th-display-tight flex items-center gap-2 text-[17px] text-foreground">
          {s.stream_name} <Pill tone="done">Saved</Pill>
        </h3>
        <span className="th-display text-xl text-[var(--bolt)]">
          {s.total} / {s.max_total}
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-[15px] text-muted-foreground">
        {s.criteria.map((c) => (
          <li key={c.key} className="flex justify-between gap-3 border-t border-[var(--rule)] pt-1">
            <span>{c.label}</span>
            <span className="text-foreground">
              {s.scores[c.key]} / {c.max}
            </span>
          </li>
        ))}
      </ul>
      {s.comment ? (
        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground">
          {s.comment}
        </p>
      ) : null}

    </div>
  )
}

export default async function JudgeTeamPage({ params, searchParams }: Params) {
  const { id } = await params
  const { error, saved } = await searchParams
  const judge = await readJudge()
  if (!judge) redirect("/judging")

  const supabase = await getSupabaseServerClient()
  const [{ data: open }, { data: teamRows }, { data: streamRows }, { data: scoreRows }] = await Promise.all([
    supabase.rpc("judging_open", { p_judge_id: judge.id, p_code: judge.code }),
    supabase.rpc("judging_teams", { p_judge_id: judge.id, p_code: judge.code }),
    supabase.rpc("judging_streams_list", { p_judge_id: judge.id, p_code: judge.code }),
    supabase.rpc("judging_team_scores", {
      p_judge_id: judge.id,
      p_code: judge.code,
      p_team_id: id,
    }),
  ])

  const me = (Array.isArray(open) ? open[0] : open) as { judge_name: string } | null
  const judgeName = me?.judge_name ?? null
  const team = ((teamRows ?? []) as unknown as TeamRow[]).find((t) => t.team_id === id)
  if (!team) redirect("/judging/teams")

  const streams = (streamRows ?? []) as unknown as Stream[]
  const savedScores = (scoreRows ?? []) as unknown as SavedScore[]
  const savedKeys = new Set(savedScores.map((s) => s.stream_key))
  const main = streams.find((s) => s.is_main)
  const extras = streams.filter((s) => !s.is_main && !savedKeys.has(s.key))
  const mainSaved = main ? savedKeys.has(main.key) : false

  return (
    <div className="min-h-screen bg-background">
      <JudgingHeader judgeName={judgeName} showBack />

      <main id="main" className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        {error ? (
          <p role="alert" className="mb-6 rounded-md border border-[#7f1d1d] bg-[#2a1214] px-4 py-3 text-[15px] text-[#fca5a5]">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p role="status" className="mb-6 rounded-md border border-[#14532d] bg-[#0f2418] px-4 py-3 text-[15px] text-[#86efac]">
            Saved.
          </p>
        ) : null}

        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.5rem)] text-foreground">
          {team.team_name}
        </h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          {campusLabel(team.campus)} · {team.members ?? "No members"}
        </p>

        {savedScores.length > 0 ? (
          <div className="mt-8 space-y-4">
            {savedScores.map((s) => (
              <SavedBlock key={s.score_id} s={s} />
            ))}
          </div>
        ) : null}

        {main && !mainSaved ? (
          <section className="mt-8 border border-[var(--rule)] bg-[var(--raised)] p-6 sm:p-7">
            <h2 className="th-display text-xl text-foreground sm:text-2xl">{main.name}</h2>
            {main.blurb ? (
              <p className="mt-2 text-[15px] text-muted-foreground">{main.blurb}</p>
            ) : null}
            <div className="mt-6">
              <ScoreForm teamId={id} stream={main} label="Save this score" />
            </div>
          </section>
        ) : null}

        {mainSaved && extras.length > 0 ? (
          <section className="mt-8">
            <h2 className="th-display text-xl text-foreground sm:text-2xl">
              Did this team enter a sponsor stream?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Add one for each stream they entered and score it on that stream&apos;s criteria.
            </p>
            <div className="mt-5 space-y-3">
              {extras.map((s) => (
                <details key={s.key} className="border border-[var(--rule)] bg-[var(--raised)]">
                  <summary className="cursor-pointer list-none px-5 py-4 text-[15px] text-foreground hover:text-[var(--bolt)]">
                    + {s.name}
                  </summary>
                  <div className="border-t border-[var(--rule)] px-5 py-5">
                    {s.blurb ? (
                      <p className="mb-4 text-[15px] text-muted-foreground">{s.blurb}</p>
                    ) : null}
                    <ScoreForm teamId={id} stream={s} label={`Save ${s.name} score`} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {mainSaved && extras.length === 0 ? (
          <p className="mt-8 text-[15px] text-muted-foreground">
            Everything is scored for this team.
          </p>
        ) : null}

        <div className="mt-10">
          <Link
            href="/judging/teams"
            className="rounded-md border border-[var(--rule)] px-5 py-2.5 text-[15px] text-foreground transition-colors hover:border-[var(--bolt)]"
          >
            Back to teams
          </Link>
        </div>
      </main>
    </div>
  )
}
