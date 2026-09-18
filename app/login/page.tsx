import type { Metadata } from "next"
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

export default async function LoginPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect("/dashboard")

  const open = await isRegistrationOpen()

  return (
    <AuthShell
      title="Log in"
      lead={
        open
          ? undefined
          : `Registration for ThunderHacks II opens at ${REGISTRATION_OPENS_LABEL}.`
      }
    >
      <LoginForm canSignUp={open} />
    </AuthShell>
  )
}
