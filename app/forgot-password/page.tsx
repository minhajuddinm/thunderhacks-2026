import type { Metadata } from "next"
import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Reset your password | ThunderHacks II",
  robots: { index: false, follow: false },
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const sent = (await searchParams).sent === "1"

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        lead="If that address has a ThunderHacks account, a reset link is on its way. The link is good for one hour."
        footer={
          <>
            Nothing arrived? Look in your spam folder, then{" "}
            <Link
              href="/forgot-password"
              className="text-[var(--bolt)] underline underline-offset-4"
            >
              try again
            </Link>
            .
          </>
        }
      >
        <Link
          href="/login"
          className="inline-block rounded-md border border-[var(--rule)] px-6 py-3 font-semibold text-foreground transition-colors hover:border-[var(--bolt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
        >
          Back to log in
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Reset your password"
      lead="Give us the address you registered with and we will send you a link to set a new password."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-[var(--bolt)] underline underline-offset-4">
            Log in
          </Link>
          .
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
