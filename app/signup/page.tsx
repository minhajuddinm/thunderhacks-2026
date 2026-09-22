import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignupForm } from "@/components/auth/signup-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { REGISTRATION_OPENS_LABEL } from "@/lib/registration"
import { isRegistrationOpen } from "@/lib/registration-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Register | ThunderHacks II",
  description:
    "Register for ThunderHacks II, October 14-16 2026, at Algoma University's Brampton and Sault Ste. Marie campuses.",
}

export default async function SignupPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect("/dashboard")

  if (!(await isRegistrationOpen())) {
    return (
      <AuthShell
        title="Registration opens soon"
        lead={`Sign-ups open at ${REGISTRATION_OPENS_LABEL}. Come back then and it will take about a minute.`}
        footer={
          <>
            Already have an account from a previous edition?{" "}
            <Link href="/login" className="text-[var(--bolt)] underline underline-offset-4">
              Log in
            </Link>
            .
          </>
        }
      >
        <Link
          href="/"
          className="inline-block rounded-md border border-[var(--rule)] px-6 py-3 font-semibold text-foreground transition-colors hover:border-[var(--bolt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
        >
          Back to the event
        </Link>
      </AuthShell>
    )
  }

  // The form only offers "Another school" while an admin has it switched on.
  // The database enforces the same rule, so this is presentation only.
  const [{ data: allowOther }, { data: capacity }] = await Promise.all([
    supabase.rpc("other_schools_allowed"),
    supabase.rpc("capacity_state"),
  ])
  const cap = (Array.isArray(capacity) ? capacity[0] : capacity) as
    | { capacity: number; taken: number; spots_left: number; is_full: boolean }
    | null

  return (
    <AuthShell
      title="Register"
      lead={
        cap?.is_full
          ? `All ${cap.capacity} spots are taken. You can still sign up and we hold your place on the waitlist, in the order people register.`
          : "One account per person. You can create or join a team afterwards."
      }
    >
      <SignupForm allowOther={allowOther === true} />
    </AuthShell>
  )
}
