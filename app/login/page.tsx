import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { REGISTRATION_OPENS_LABEL } from "@/lib/registration"
import { isRegistrationOpen } from "@/lib/registration-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Log in | ThunderHacks II",
}

type Search = { searchParams: Promise<{ left?: string }> }

export default async function LoginPage({ searchParams }: Search) {
  const { left } = await searchParams
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect("/dashboard")

  // Nobody has an account before registration opens, so there is nothing to
  // log in to. Showing a live form would only invite failed attempts.
  if (!(await isRegistrationOpen())) {
    return (
      <AuthShell
        title="Not open yet"
        lead={`Accounts open at ${REGISTRATION_OPENS_LABEL}. Register then and you can log in straight away.`}
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

  return (
    <AuthShell
      title="Log in"
      lead={
        left
          ? "Your registration is cancelled and your account is gone. If a spot is still open you are welcome to register again."
          : undefined
      }
    >
      <LoginForm canSignUp />
    </AuthShell>
  )
}
