import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// Supabase pauses a free project after a week without activity. A weekly
// read keeps it awake; the query is cheap and touches no user data.
export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
      .from("event_settings")
      .select("id")
      .limit(1)

    if (error) throw error
    return NextResponse.json({ ok: true, at: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    )
  }
}
