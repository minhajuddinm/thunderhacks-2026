import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { Empty } from "@/components/dashboard/ui"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { readJudge } from "@/lib/judging"
import { JudgeSignInForm } from "./sign-in-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Judging | ThunderHacks II",
  robots: { index: false, follow: false },
}

type Judge = { id: string; full_name: string; title: string | null }

export default async function JudgingPage() {
  const judge = await readJudge()
  if (judge) redirect("/judging/teams")

  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.rpc("judging_judges")
  const judges = (data ?? []) as unknown as Judge[]

  return (
    <AuthShell
      title="Judging"
      lead="Pick your name and type the code you were given. Scores are saved once, so take your time."
    >
      {judges.length === 0 ? (
        <Empty>No judges set up yet.</Empty>
      ) : (
        <JudgeSignInForm judges={judges} />
      )}
    </AuthShell>
  )
}
