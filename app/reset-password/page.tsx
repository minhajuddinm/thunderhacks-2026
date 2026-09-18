import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Set a new password | ThunderHacks II",
  robots: { index: false, follow: false },
}

export default async function ResetPasswordPage() {
  // Following the emailed link creates a session. No session means the link
  // was already used, has expired, or somebody came here directly.
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <AuthShell
        title="That link has expired"
        lead="Reset links last an hour and work once. Ask for a fresh one and it will arrive in a moment."
      >
        <Link
          href="/forgot-password"
          className="inline-block rounded-md bg-[var(--bolt)] px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
        >
          Send a new link
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Set a new password"
      lead={`Signed in as ${user.email}. Choose a new password and we will take you to your dashboard.`}
    >
      <ResetPasswordForm />
    </AuthShell>
  )
}
