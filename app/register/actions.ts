"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

function generateTeamCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function registerIndividual(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const data = {
    full_name: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string || null,
    school: "Algoma University",
    dietary_restrictions: formData.get("dietaryRestrictions") as string || null,
    looking_for_team: formData.get("lookingForTeam") === "true",
    skills: formData.get("skills") as string || null,
  }

  const { error } = await supabase.from("individuals").insert(data)

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "This email is already registered." }
    }
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function registerTeam(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const teamName = formData.get("teamName") as string
  const lookingForMembers = formData.get("lookingForMembers") === "true"
  const teamCode = generateTeamCode()

  // Create team
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      team_name: teamName,
      team_code: teamCode,
      looking_for_members: lookingForMembers,
    })
    .select()
    .single()

  if (teamError) {
    if (teamError.code === "23505") {
      return { success: false, error: "A team with this name already exists." }
    }
    return { success: false, error: teamError.message }
  }

  // Add team leader
  const leaderData = {
    team_id: team.id,
    full_name: formData.get("leaderName") as string,
    email: formData.get("leaderEmail") as string,
    phone: formData.get("leaderPhone") as string || null,
    school: "Algoma University",
    dietary_restrictions: formData.get("leaderDietary") as string || null,
    is_leader: true,
  }

  const { error: leaderError } = await supabase
    .from("team_members")
    .insert(leaderData)

  if (leaderError) {
    // Rollback team creation
    await supabase.from("teams").delete().eq("id", team.id)
    if (leaderError.code === "23505") {
      return { success: false, error: "This email is already registered." }
    }
    return { success: false, error: leaderError.message }
  }

  return { success: true, teamCode }
}

export async function joinTeamByCode(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const teamCode = (formData.get("teamCode") as string).toUpperCase()

  // Find team
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id, team_name, max_members")
    .eq("team_code", teamCode)
    .single()

  if (teamError || !team) {
    return { success: false, error: "Invalid team code. Please check and try again." }
  }

  // Check team size
  const { count } = await supabase
    .from("team_members")
    .select("*", { count: "exact", head: true })
    .eq("team_id", team.id)

  if (count && count >= team.max_members) {
    return { success: false, error: "This team is already full." }
  }

  // Add member
  const memberData = {
    team_id: team.id,
    full_name: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string || null,
    school: "Algoma University",
    dietary_restrictions: formData.get("dietaryRestrictions") as string || null,
    is_leader: false,
  }

  const { error: memberError } = await supabase
    .from("team_members")
    .insert(memberData)

  if (memberError) {
    if (memberError.code === "23505") {
      return { success: false, error: "This email is already registered." }
    }
    return { success: false, error: memberError.message }
  }

  return { success: true, teamName: team.team_name }
}
