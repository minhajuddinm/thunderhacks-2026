import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { campusLabel, schoolLabel, REGISTRATION_OPENS_LABEL } from "@/lib/registration"
import { isRegistrationOpen } from "@/lib/registration-server"
import { SCHEDULE, SCHEDULE_NOTE, EVENT } from "@/lib/content"
import { signOutAction } from "@/app/auth/actions"
import {
  createTeamAction,
  inviteAction,
  leaveTeamAction,
  requestToJoinAction,
  respondAction,
  cancelRequestAction,
} from "./actions"
import { Empty, Panel, PersonLine, PrimaryButton, QuietButton } from "@/components/dashboard/ui"
import { inputClass } from "@/components/auth/auth-shell"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { title: "Dashboard | ThunderHacks II" }

type Search = { searchParams: Promise<{ error?: string }> }

/**
 * PostgREST returns an embedded to-one relation as an object, but returns an
 * array whenever it cannot prove the relation is unique. Both shapes are
 * legal, so normalise rather than assume; guessing wrong here silently
 * renders "Unknown" instead of somebody's name.
 */
function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

type PersonRow = {
  full_name: string
  program: string
  year_of_study: number
  school: string
  school_other: string | null
}
type TeamRow = { id: string; name: string; leader_id: string }
type MemberRow = { profile_id: string; joined_at: string; profiles: PersonRow | PersonRow[] | null }
type RequestRow = { id: string; profile_id: string; profiles: PersonRow | PersonRow[] | null }
type ThreadRow = { id: string; kind: string; team_id: string; teams: { name: string } | { name: string }[] | null }

export default async function DashboardPage({ searchParams }: Search) {
  const { error: errorMessage } = await searchParams
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  // An account from the March edition has no ThunderHacks II profile.
  if (!profile) {
    const open = await isRegistrationOpen()
    return (
      <main id="main" className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.5rem)] text-foreground">
          You are not registered for ThunderHacks II
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
          Your account works, but ThunderHacks II needs its own registration so we
          know your programme, year and school.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {open ? (
            <Link
              href="/signup"
              className="rounded-md bg-[var(--bolt)] px-6 py-3 font-semibold text-black"
            >
              Register now
            </Link>
          ) : (
            <p className="text-[15px] text-muted-foreground">
              Registration opens at {REGISTRATION_OPENS_LABEL}.
            </p>
          )}
          <form action={signOutAction}>
            <QuietButton>Log out</QuietButton>
          </form>
        </div>
      </main>
    )
  }
  // Registered before campus and photo consent were asked: answer first.
  if (!profile.campus || !profile.media_consent_at) redirect("/event-details")


  const { data: membership } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("profile_id", user.id)
    .maybeSingle()

  const teamId = membership?.team_id ?? null

  const [{ data: teams }, { data: participants }] = await Promise.all([
    supabase.from("teams_overview").select("*").order("created_at"),
    supabase.from("participants").select("*").order("full_name"),
  ])

  let myTeam: TeamRow | null = null
  let members: MemberRow[] = []
  let incoming: RequestRow[] = []

  if (teamId) {
    const [{ data: t }, { data: m }] = await Promise.all([
      supabase.from("teams").select("id, name, leader_id").eq("id", teamId).maybeSingle(),
      supabase
        .from("team_members")
        .select("profile_id, joined_at, profiles(full_name, program, year_of_study, school, school_other)")
        .eq("team_id", teamId)
        .order("joined_at"),
    ])
    myTeam = (t as unknown as TeamRow | null) ?? null
    members = (m ?? []) as unknown as MemberRow[]

    if (myTeam && myTeam.leader_id === user.id) {
      const { data: reqs } = await supabase
        .from("team_requests")
        .select("id, profile_id, profiles(full_name, program, year_of_study, school, school_other)")
        .eq("team_id", teamId)
        .eq("kind", "request")
        .eq("status", "pending")
      incoming = (reqs ?? []) as unknown as RequestRow[]
    }
  }

  // Threads that concern me personally: invites to answer, requests I sent.
  const { data: myThreads } = await supabase
    .from("team_requests")
    .select("id, kind, team_id, teams(name)")
    .eq("profile_id", user.id)
    .eq("status", "pending")

  const threads = (myThreads ?? []) as unknown as ThreadRow[]
  const invites = threads.filter((t) => t.kind === "invite")
  const sent = threads.filter((t) => t.kind === "request")

  const leaderId = myTeam?.leader_id ?? null
  const isLeader = leaderId === user.id
  const maxSize = teams?.[0]?.max_team_size ?? 4
  const teamFull = members.length >= maxSize
  // A waitlist place is not a spot at the event, so those people are not in
  // the roster others build teams from.
  const waitlisted = profile.status === "waitlist"
  const roster = (participants ?? []).filter((p) => p.status !== "waitlist")
  const unteamed = roster.filter((p) => !p.team_id && p.id !== user.id)
  const { data: isAdmin } = await supabase.rpc("is_admin")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/th-logo.png" alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
            <span className="th-display-tight text-[16px] text-foreground">
              ThunderHacks <span className="text-[var(--bolt)]">II</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {profile.full_name}
            </span>
            {isAdmin === true ? (
              <Link
                href="/admin"
                className="rounded-md border border-[var(--bolt)] px-4 py-2 text-[15px] text-[var(--bolt)] transition-colors hover:bg-[var(--bolt)]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
              >
                Admin
              </Link>
            ) : null}
            <form action={signOutAction}>
              <QuietButton>Log out</QuietButton>
            </form>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {errorMessage ? (
          <p
            role="alert"
            className="mb-8 rounded-md border border-[#7f1d1d] bg-[#2a1214] px-4 py-3 text-[15px] text-[#fca5a5]"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.75rem)] text-foreground">
          {profile.full_name.split(" ")[0]},{" "}
          {waitlisted ? "you are on the waitlist" : "you are registered"}
        </h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          {profile.program} · Year {profile.year_of_study} ·{" "}
          {schoolLabel(profile.school, profile.school_other)} · {campusLabel(profile.campus)} campus
        </p>

        {waitlisted ? (
          <div className="mt-6 border border-[#92400e] bg-[#2a1f0f] px-5 py-4">
            <p className="th-display-tight text-[16px] text-[#fbbf24]">
              Every spot is taken right now
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#fde68a]">
              Your details are saved and you are in line in the order you registered. We
              email you at {user.email} if a place comes free, and team building opens for
              you then. Nothing else to do for now.
            </p>
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ---------------------------------------------------- my team -- */}
          <Panel
            title={myTeam ? myTeam.name : "Your team"}
            lead={
              myTeam
                ? `${members.length} of ${maxSize} places filled.${isLeader ? " You are the team leader." : ""}`
                : "You are not in a team yet. Create one, or ask to join one below."
            }
            className="lg:row-span-2"
          >
            {waitlisted ? (
              <Empty>Team building opens once you have a spot.</Empty>
            ) : myTeam ? (
              <>
                <ul className="space-y-3">
                  {members.map((m) => (
                    <li key={m.profile_id} className="border-t border-[var(--rule)] pt-3">
                      <PersonLine
                        name={one(m.profiles)?.full_name ?? "Unknown"}
                        program={one(m.profiles)?.program ?? ""}
                        year={one(m.profiles)?.year_of_study ?? 0}
                        school={schoolLabel(one(m.profiles)?.school ?? "", one(m.profiles)?.school_other)}
                        badge={m.profile_id === leaderId ? "Leader" : undefined}
                      />
                    </li>
                  ))}
                </ul>

                {isLeader ? (
                  <div className="mt-7">
                    <h3 className="th-display-tight text-[15px] text-foreground">
                      Requests to join
                    </h3>
                    {incoming.length === 0 ? (
                      <p className="mt-3 text-[15px] text-muted-foreground">
                        Nobody is waiting.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-3">
                        {incoming.map((r) => (
                          <li
                            key={r.id}
                            className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3"
                          >
                            <PersonLine
                              name={one(r.profiles)?.full_name ?? "Unknown"}
                              program={one(r.profiles)?.program ?? ""}
                              year={one(r.profiles)?.year_of_study ?? 0}
                              school={schoolLabel(one(r.profiles)?.school ?? "", one(r.profiles)?.school_other)}
                            />
                            <span className="flex gap-2">
                              <form action={respondAction}>
                                <input type="hidden" name="request_id" value={r.id} />
                                <input type="hidden" name="accept" value="true" />
                                <PrimaryButton>Approve</PrimaryButton>
                              </form>
                              <form action={respondAction}>
                                <input type="hidden" name="request_id" value={r.id} />
                                <input type="hidden" name="accept" value="false" />
                                <QuietButton>Decline</QuietButton>
                              </form>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}

                <form action={leaveTeamAction} className="mt-8">
                  <QuietButton danger>
                    {isLeader && members.length === 1 ? "Disband team" : "Leave team"}
                  </QuietButton>
                </form>
              </>
            ) : (
              <>
                <form action={createTeamAction} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={40}
                    placeholder="Team name"
                    className={inputClass}
                    aria-label="Team name"
                  />
                  <PrimaryButton>Create team</PrimaryButton>
                </form>

                {invites.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="th-display-tight text-[15px] text-foreground">
                      You have been invited
                    </h3>
                    <ul className="mt-3 space-y-3">
                      {invites.map((t) => (
                        <li
                          key={t.id}
                          className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3"
                        >
                          <span className="th-display-tight text-[15px] text-foreground">
                            {one(t.teams)?.name ?? "A team"}
                          </span>
                          <span className="flex gap-2">
                            <form action={respondAction}>
                              <input type="hidden" name="request_id" value={t.id} />
                              <input type="hidden" name="accept" value="true" />
                              <PrimaryButton>Accept</PrimaryButton>
                            </form>
                            <form action={respondAction}>
                              <input type="hidden" name="request_id" value={t.id} />
                              <input type="hidden" name="accept" value="false" />
                              <QuietButton>Decline</QuietButton>
                            </form>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {sent.length > 0 ? (
                  <div className="mt-8">
                    <h3 className="th-display-tight text-[15px] text-foreground">
                      Requests you have sent
                    </h3>
                    <ul className="mt-3 space-y-3">
                      {sent.map((t) => (
                        <li
                          key={t.id}
                          className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3"
                        >
                          <span className="text-[15px] text-muted-foreground">
                            Waiting on {one(t.teams)?.name ?? "a team"}
                          </span>
                          <form action={cancelRequestAction}>
                            <input type="hidden" name="request_id" value={t.id} />
                            <QuietButton>Withdraw</QuietButton>
                          </form>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </Panel>

          {/* ----------------------------------------------------- teams -- */}
          <Panel title="Teams" lead={`${teams?.length ?? 0} so far.`}>
            {!teams || teams.length === 0 ? (
              <Empty>No teams yet. Be the first.</Empty>
            ) : (
              <ul className="space-y-3">
                {teams.map((t) => (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3"
                  >
                    <div className="min-w-0">
                      <div className="th-display-tight text-[15px] text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Led by {t.leader_name} · {t.member_count} of {t.max_team_size}
                      </div>
                    </div>
                    {!teamId && !waitlisted && t.has_space ? (
                      <form action={requestToJoinAction}>
                        <input type="hidden" name="team_id" value={t.id} />
                        <QuietButton>Ask to join</QuietButton>
                      </form>
                    ) : !t.has_space ? (
                      <span className="text-sm text-muted-foreground">Full</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* ---------------------------------------------- participants -- */}
          <Panel
            title="Participants"
            lead={`${roster.length} with a spot.${
              isLeader && !teamFull ? " Invite anyone without a team." : ""
            }`}
          >
            {roster.length === 0 ? (
              <Empty>Nobody has registered yet.</Empty>
            ) : (
              <ul className="max-h-96 space-y-3 overflow-y-auto pr-1">
                {roster.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3"
                  >
                    <PersonLine
                      name={p.full_name}
                      program={p.program}
                      year={p.year_of_study}
                      school={schoolLabel(p.school, p.school_other)}
                      badge={p.team_name ?? undefined}
                    />
                    {isLeader && !teamFull && !p.team_id && p.id !== user.id ? (
                      <form action={inviteAction}>
                        <input type="hidden" name="profile_id" value={p.id} />
                        <QuietButton>Invite</QuietButton>
                      </form>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {isLeader && !teamFull && unteamed.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Everyone registered is already in a team.
              </p>
            ) : null}
          </Panel>
        </div>

        {/* ------------------------------------------------------ timeline -- */}
        <section className="mt-10 border border-[var(--rule)] bg-[var(--raised)] p-6 sm:p-7">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">
            {EVENT.datesLabel}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {SCHEDULE_NOTE}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-px bg-[var(--rule)] md:grid-cols-3">
            {SCHEDULE.map((day) => (
              <div key={day.key} className="bg-[var(--raised)] p-0 md:p-5">
                <p className="text-sm text-muted-foreground">{day.weekday}</p>
                <h3 className="th-display mt-1 text-xl text-foreground">{day.date}</h3>
                <p className="mt-1 text-sm text-[var(--bolt)]">{day.label}</p>
                <ol className="mt-4">
                  {day.items.map((item, i) => (
                    <li key={`${day.key}-${i}`} className="border-t border-[var(--rule)] py-2.5">
                      <div className="text-sm text-muted-foreground">{item.time}</div>
                      <div className="text-[15px] text-foreground">{item.title}</div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
