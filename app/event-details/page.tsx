import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { EventDetailsForm } from "@/components/auth/event-details-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Two more questions | ThunderHacks II",
  robots: { index: false, follow: false },
}

/**
 * Anyone registered before campus and photo consent were asked for lands
 * here once, before their dashboard.
 */
export default async function EventDetailsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, school, campus, media_consent_at")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) redirect("/dashboard")
  if (profile.campus && profile.media_consent_at) redirect("/dashboard")

  const first = String(profile.full_name ?? "").split(" ")[0]

  return (
    <AuthShell
      title="Two more questions"
      lead={`${first ? `${first}, w` : "W"}e now need to know which campus you will be at, and your agreement to photos and video. It takes ten seconds, and then you are back to your dashboard.`}
    >
      <EventDetailsForm school={String(profile.school)} campus={String(profile.campus ?? "")} />
    </AuthShell>
  )
}
