import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { CAMPUSES, SCHOOLS, YEARS, campusLabel, schoolLabel, yearLabel } from "@/lib/registration"
import { signOutAction } from "@/app/auth/actions"
import { inputClass } from "@/components/auth/auth-shell"
import { Empty, Panel, PrimaryButton, QuietButton } from "@/components/dashboard/ui"
import { CopyEmails } from "@/components/admin/copy-emails"
import {
  removeParticipantAction,
  setOtherSchoolsAction,
  updateParticipantAction,
} from "./actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin | ThunderHacks II",
  robots: { index: false, follow: false },
}

type Row = {
  id: string
  full_name: string
  email: string
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
}

type Removed = {
  id: number
  full_name: string | null
  email: string | null
  school: string | null
  school_other: string | null
  removed_at: string
  removed_by: string | null
  reason: string | null
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

export default async function AdminPage({ searchParams }: Search) {
  const { ok, error } = await searchParams
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (isAdmin !== true) redirect("/dashboard")

  const [{ data: rows }, { data: removed }, { data: othersOpen }] = await Promise.all([
    supabase.rpc("admin_list_participants"),
    supabase.rpc("admin_list_removed"),
    supabase.rpc("other_schools_allowed"),
  ])

  const people = (rows ?? []) as unknown as Row[]
  const gone = (removed ?? []) as unknown as Removed[]
  const bySchool = (s: string) => people.filter((p) => p.school === s).length
  const teams = new Set(people.map((p) => p.team_id).filter(Boolean)).size
  const emails = people.map((p) => p.email).filter(Boolean)
  const byCampus = (c: string) => people.filter((p) => p.campus === c).length
  const unanswered = people.filter((p) => !p.campus || !p.media_consent_at)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/th-logo.png" alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
            <span className="th-display-tight text-[16px] text-foreground">
              ThunderHacks <span className="text-[var(--bolt)]">II</span>{" "}
              <span className="text-muted-foreground">Admin</span>
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
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.75rem)] text-foreground">Participants</h1>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Registered", people.length],
            ["Algoma", bySchool("algoma")],
            ["Sault College", bySchool("sault_college")],
            ["Other schools", bySchool("other")],
            ["Brampton", byCampus("brampton")],
            ["Sault Ste. Marie", byCampus("sault_ste_marie")],
            ["Still to answer", unanswered.length],
            ["Teams", teams],
          ].map(([label, n]) => (
            <div key={label} className="border border-[var(--rule)] bg-[var(--raised)] px-4 py-3">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="th-display mt-1 text-2xl text-foreground">{n}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel
            title="Other schools"
            lead={
              othersOpen
                ? "Open. Anyone can pick Another school on the signup form."
                : "Closed. The form only offers Algoma University and Sault College."
            }
          >
            <form action={setOtherSchoolsAction}>
              <input type="hidden" name="allow" value={othersOpen ? "false" : "true"} />
              {othersOpen ? (
                <QuietButton danger>Close to other schools</QuietButton>
              ) : (
                <PrimaryButton>Open to other schools</PrimaryButton>
              )}
            </form>
          </Panel>

          <Panel title="Email" lead="Click an address below to email one person. To email everyone, copy all and paste into Bcc so nobody sees the others.">
            {emails.length ? <CopyEmails emails={emails} /> : <Empty>No one to email yet.</Empty>}
          </Panel>

          <Panel
            title="Still to answer campus and photo consent"
            lead="These people registered before the two questions were added. They are asked the next time they open the dashboard."
          >
            {unanswered.length ? (
              <div className="space-y-3">
                <CopyEmails emails={unanswered.map((p) => p.email).filter(Boolean)} />
                <ul className="space-y-1 text-[15px] text-muted-foreground">
                  {unanswered.map((p) => (
                    <li key={p.id}>
                      <span className="text-foreground">{p.full_name}</span> ·{" "}
                      <a href={`mailto:${p.email}`} className="break-all underline underline-offset-4">{p.email}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Empty>Everyone has answered.</Empty>
            )}
          </Panel>
        </div>

        <section className="mt-10">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">Everyone registered</h2>
          {people.length === 0 ? (
            <div className="mt-4">
              <Empty>No registrations yet.</Empty>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {people.map((p) => {
                const isMe = p.id === user.id
                return (
                  <li key={p.id} className="border border-[var(--rule)] bg-[var(--raised)] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="th-display-tight text-[17px] text-foreground">
                          {p.full_name}
                          {isMe ? <span className="ml-2 text-sm text-muted-foreground">(you)</span> : null}
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
                        <p className="mt-1 text-[15px] text-muted-foreground">
                          Campus: {campusLabel(p.campus)} · Photo consent:{" "}
                          {p.media_consent_at ? `yes, ${when(p.media_consent_at)}` : <span className="text-[#fbbf24]">not yet</span>}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {p.team_name ? `${p.is_leader ? "Leads" : "In"} ${p.team_name}` : "No team"} · registered {when(p.registered_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <details className="group w-full sm:w-auto">
                        <summary className="cursor-pointer list-none rounded-md border border-[var(--rule)] px-4 py-2 text-[15px] text-foreground hover:border-[var(--bolt)]">
                          Edit
                        </summary>
                        <form action={updateParticipantAction} className="mt-4 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                          <input type="hidden" name="profile_id" value={p.id} />
                          <label className="block sm:col-span-2">
                            <span className="text-sm text-muted-foreground">Full name</span>
                            <input name="full_name" defaultValue={p.full_name} required minLength={2} maxLength={80} className={`mt-1 ${inputClass}`} />
                          </label>
                          <label className="block sm:col-span-2">
                            <span className="text-sm text-muted-foreground">Programme</span>
                            <input name="program" defaultValue={p.program} required minLength={2} maxLength={80} className={`mt-1 ${inputClass}`} />
                          </label>
                          <label className="block">
                            <span className="text-sm text-muted-foreground">Year</span>
                            <select name="year_of_study" defaultValue={String(p.year_of_study)} className={`mt-1 ${inputClass}`}>
                              {YEARS.map((y) => (
                                <option key={y} value={y}>{yearLabel(y)}</option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-sm text-muted-foreground">School</span>
                            <select name="school" defaultValue={p.school} className={`mt-1 ${inputClass}`}>
                              {SCHOOLS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-sm text-muted-foreground">Campus</span>
                            <select name="campus" defaultValue={p.campus ?? ""} className={`mt-1 ${inputClass}`}>
                              <option value="">{p.campus ? "Keep current" : "Not given"}</option>
                              {CAMPUSES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                              ))}
                            </select>
                          </label>
                          <label className="block sm:col-span-2">
                            <span className="text-sm text-muted-foreground">School name (only used for Another school)</span>
                            <input name="school_other" defaultValue={p.school_other ?? ""} maxLength={80} className={`mt-1 ${inputClass}`} />
                          </label>
                          <div className="sm:col-span-2">
                            <PrimaryButton>Save changes</PrimaryButton>
                          </div>
                        </form>
                      </details>

                      {isMe ? null : (
                        <details className="w-full sm:w-auto">
                          <summary className="cursor-pointer list-none rounded-md border border-[#7f1d1d] px-4 py-2 text-[15px] text-[#fca5a5] hover:border-[#b91c1c]">
                            Remove
                          </summary>
                          <form action={removeParticipantAction} className="mt-4 max-w-xl space-y-3">
                            <input type="hidden" name="profile_id" value={p.id} />
                            <input type="hidden" name="full_name" value={p.full_name} />
                            <p className="text-[15px] text-muted-foreground">
                              This deletes {p.full_name}&apos;s account and takes them out of any team. If they lead a team, it passes to the next member.
                              Their details are kept in the removed list below.
                            </p>
                            <label className="block">
                              <span className="text-sm text-muted-foreground">Reason (optional, only you see it)</span>
                              <input name="reason" maxLength={200} className={`mt-1 ${inputClass}`} placeholder="e.g. Not at Algoma or Sault College" />
                            </label>
                            <label className="flex items-center gap-2 text-[15px] text-foreground">
                              <input type="checkbox" name="confirm" value="yes" required className="h-4 w-4" />
                              Yes, remove {p.full_name}
                            </label>
                            <QuietButton danger>Remove permanently</QuietButton>
                          </form>
                        </details>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="th-display text-xl text-foreground sm:text-2xl">Removed</h2>
          {gone.length === 0 ? (
            <div className="mt-4">
              <Empty>Nobody removed.</Empty>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {gone.map((r) => (
                <li key={r.id} className="border-t border-[var(--rule)] pt-2 text-[15px] text-muted-foreground">
                  <span className="text-foreground">{r.full_name ?? "Unknown"}</span>
                  {r.email ? (
                    <>
                      {" · "}
                      <a href={`mailto:${r.email}`} className="underline underline-offset-4">{r.email}</a>
                    </>
                  ) : null}
                  {" · "}
                  {r.school ? schoolLabel(r.school, r.school_other) : "No profile"} · removed {when(r.removed_at)}
                  {r.reason ? ` · ${r.reason}` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
