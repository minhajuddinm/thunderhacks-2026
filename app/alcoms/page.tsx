import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { campusLabel, phoneLabel, schoolLabel, yearLabel } from "@/lib/registration"
import { signOutAction } from "@/app/auth/actions"
import { Empty, Panel, QuietButton } from "@/components/dashboard/ui"
import { CopyEmails } from "@/components/admin/copy-emails"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "ALCOMS | ThunderHacks II",
  robots: { index: false, follow: false },
}

type Row = {
  id: string
  full_name: string
  email: string
  phone: string | null
  program: string
  year_of_study: number
  school: string
  school_other: string | null
  team_id: string | null
  team_name: string | null
  is_leader: boolean
  registered_at: string
  campus: string | null
  media_consent_at: string | null
  status: string
  is_admin: boolean
}

type Standing = {
  place: number | null
  team_id: string
  team_name: string
  campus: string | null
  members: string | null
  scored: boolean
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

export default async function AlcomsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: role } = await supabase.rpc("staff_role")
  if (role !== "alcoms" && role !== "admin") redirect("/dashboard")

  const [{ data: rows }, { data: board }, { data: capacity }] = await Promise.all([
    supabase.rpc("admin_list_participants"),
    supabase.rpc("staff_leaderboard"),
    supabase.rpc("capacity_state"),
  ])

  const people = (rows ?? []) as unknown as Row[]
  const standings = (board ?? []) as unknown as Standing[]
  const bySchool = (s: string) => people.filter((p) => p.school === s).length
  const byCampus = (c: string) => people.filter((p) => p.campus === c).length
  const waiting = people.filter((p) => p.status === "waitlist")
  const unanswered = people.filter((p) => !p.campus || !p.media_consent_at)
  const noTeam = people.filter((p) => !p.team_id && p.status === "confirmed" && !p.is_admin)
  const cap = (Array.isArray(capacity) ? capacity[0] : capacity) as
    | { capacity: number; taken: number; spots_left: number; is_full: boolean }
    | null

  // Teams, built from the same list, so this page needs no extra read.
  const teams = new Map<string, { name: string; names: string[]; leader: string | null }>()
  for (const p of people) {
    if (!p.team_id || !p.team_name) continue
    const t = teams.get(p.team_id) ?? { name: p.team_name, names: [], leader: null }
    t.names.push(p.full_name)
    if (p.is_leader) t.leader = p.full_name
    teams.set(p.team_id, t)
  }
  const teamList = [...teams.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name))
  const ranked = standings.filter((s) => s.scored)
  const unranked = standings.filter((s) => !s.scored)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/th-logo.png" alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
            <span className="th-display-tight text-[16px] text-foreground">
              ThunderHacks <span className="text-[var(--bolt)]">II</span>{" "}
              <span className="text-muted-foreground">ALCOMS</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-md border border-[var(--rule)] px-4 py-2 text-[15px] text-foreground transition-colors hover:border-[var(--bolt)]"
            >
              Dashboard
            </Link>
            <form action={signOutAction}>
              <QuietButton>Log out</QuietButton>
            </form>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.75rem)] text-foreground">ALCOMS view</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">
          Everything here is read only. Registrations, teams and the standing order, kept current.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Registered", people.length],
            ["Spots taken", cap ? `${cap.taken} of ${cap.capacity}` : "-"],
            ["Spots left", cap ? cap.spots_left : "-"],
            ["Waitlist", waiting.length],
            ["Algoma", bySchool("algoma")],
            ["Sault College", bySchool("sault_college")],
            ["Other schools", bySchool("other")],
            ["Brampton", byCampus("brampton")],
            ["Sault Ste. Marie", byCampus("sault_ste_marie")],
            ["Still to answer", unanswered.length],
            ["Teams", teamList.length],
            ["No team yet", noTeam.length],
          ].map(([label, n]) => (
            <div key={label} className="border border-[var(--rule)] bg-[var(--raised)] px-4 py-3">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="th-display mt-1 text-2xl text-foreground">{n}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-10">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">Leaderboard</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
            The standing order on the Overall criteria, from every judge who has scored a team
            so far. It moves as judging goes on and is final only once every judge is done.
          </p>
          {ranked.length === 0 ? (
            <div className="mt-4">
              <Empty>Nothing judged yet.</Empty>
            </div>
          ) : (
            <ol className="mt-4 space-y-2">
              {ranked.map((s) => (
                <li
                  key={s.team_id}
                  className="flex items-start gap-4 border border-[var(--rule)] bg-[var(--raised)] px-5 py-4"
                >
                  <span className="th-display w-10 shrink-0 text-2xl text-[var(--bolt)]">
                    {s.place}
                  </span>
                  <span className="min-w-0">
                    <span className="th-display-tight block text-[17px] text-foreground">
                      {s.team_name}
                    </span>
                    <span className="mt-1 block text-[15px] text-muted-foreground">
                      {s.campus === "mixed" ? "Both campuses" : campusLabel(s.campus)}
                      {s.members ? ` · ${s.members}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}
          {unranked.length ? (
            <p className="mt-4 text-[15px] text-muted-foreground">
              Not scored yet: {unranked.map((s) => s.team_name).join(", ")}.
            </p>
          ) : null}
        </section>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Email" lead="Click an address to email one person. To email everyone, copy all and paste into Bcc.">
            {people.length ? (
              <CopyEmails emails={people.map((p) => p.email).filter(Boolean)} />
            ) : (
              <Empty>No one to email yet.</Empty>
            )}
          </Panel>

          <Panel title="Waitlist" lead="In the order they registered.">
            {waiting.length ? (
              <ol className="space-y-1 text-[15px] text-muted-foreground">
                {waiting.map((p, i) => (
                  <li key={p.id}>
                    {i + 1}. <span className="text-foreground">{p.full_name}</span> ·{" "}
                    <a href={`mailto:${p.email}`} className="break-all underline underline-offset-4">{p.email}</a>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty>Nobody is waiting.</Empty>
            )}
          </Panel>

          <Panel title="Still to answer campus and photo consent" lead="They are asked again the next time they open the dashboard.">
            {unanswered.length ? (
              <ul className="space-y-1 text-[15px] text-muted-foreground">
                {unanswered.map((p) => (
                  <li key={p.id}>
                    <span className="text-foreground">{p.full_name}</span> ·{" "}
                    <a href={`mailto:${p.email}`} className="break-all underline underline-offset-4">{p.email}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>Everyone has answered.</Empty>
            )}
          </Panel>

          <Panel title="No team yet" lead="Confirmed people who are not in a team.">
            {noTeam.length ? (
              <ul className="space-y-1 text-[15px] text-muted-foreground">
                {noTeam.map((p) => (
                  <li key={p.id}>
                    <span className="text-foreground">{p.full_name}</span> ·{" "}
                    <a href={`mailto:${p.email}`} className="break-all underline underline-offset-4">{p.email}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>Everyone is in a team.</Empty>
            )}
          </Panel>
        </div>

        <section className="mt-10">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">Teams</h2>
          {teamList.length === 0 ? (
            <div className="mt-4">
              <Empty>No teams yet.</Empty>
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {teamList.map(([id, t]) => (
                <li key={id} className="border border-[var(--rule)] bg-[var(--raised)] p-5">
                  <p className="th-display-tight text-[17px] text-foreground">{t.name}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    {t.names.length} {t.names.length === 1 ? "member" : "members"}
                    {t.leader ? ` · led by ${t.leader}` : ""}
                  </p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    {[...t.names].sort((a, b) => a.localeCompare(b)).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">Everyone registered</h2>
          {people.length === 0 ? (
            <div className="mt-4">
              <Empty>No registrations yet.</Empty>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {people.map((p) => (
                <li key={p.id} className="border border-[var(--rule)] bg-[var(--raised)] p-5">
                  <p className="th-display-tight text-[17px] text-foreground">
                    {p.full_name}
                    {p.status === "waitlist" ? (
                      <span className="ml-2 rounded border border-[#92400e] px-1.5 py-0.5 align-middle text-xs text-[#fbbf24]">
                        Waitlist
                      </span>
                    ) : null}
                    {p.is_admin ? (
                      <span className="ml-2 rounded border border-[var(--rule)] px-1.5 py-0.5 align-middle text-xs text-muted-foreground">
                        ALCOMS
                      </span>
                    ) : null}
                    {p.school === "other" ? (
                      <span className="ml-2 rounded border border-[#92400e] px-1.5 py-0.5 align-middle text-xs text-[#fbbf24]">
                        Other school
                      </span>
                    ) : null}
                  </p>
                  <a
                    href={`mailto:${p.email}`}
                    className="mt-1 block break-all text-[15px] text-[var(--bolt)] underline underline-offset-4"
                  >
                    {p.email}
                  </a>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    {p.program} · {yearLabel(p.year_of_study)} · {schoolLabel(p.school, p.school_other)}
                  </p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{phoneLabel(p.phone)}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Campus: {campusLabel(p.campus)} · Photo consent:{" "}
                    {p.media_consent_at ? `yes, ${when(p.media_consent_at)}` : <span className="text-[#fbbf24]">not yet</span>}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.team_name ? `${p.is_leader ? "Leads" : "In"} ${p.team_name}` : "No team"} · registered{" "}
                    {when(p.registered_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
