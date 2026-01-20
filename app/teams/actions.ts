"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getTeams() {
  const supabase = await getSupabaseServerClient()

  const { data: teams, error } = await supabase
    .from("teams")
    .select(`
      id,
      team_name,
      team_code,
      looking_for_members,
      max_members,
      created_at,
      team_members (
        id,
        full_name,
        is_leader
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching teams:", error)
    return []
  }

  return teams
}

export async function getIndividualsLookingForTeam() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("individuals")
    .select("id, full_name, skills, school")
    .eq("looking_for_team", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching individuals:", error)
    return []
  }

  return data
}

export async function sendJoinRequest(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const data = {
    team_id: formData.get("teamId") as string,
    requester_name: formData.get("requesterName") as string,
    requester_email: formData.get("requesterEmail") as string,
    message: formData.get("message") as string || null,
  }

  // Check if request already exists
  const { data: existing } = await supabase
    .from("join_requests")
    .select("id")
    .eq("team_id", data.team_id)
    .eq("requester_email", data.requester_email)
    .eq("status", "pending")
    .single()

  if (existing) {
    return { success: false, error: "You already have a pending request for this team." }
  }

  const { error } = await supabase.from("join_requests").insert(data)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
