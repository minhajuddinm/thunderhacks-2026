import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"

async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component
          }
        },
      },
    }
  )
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, teams(*)")
    .eq("id", user.id)
    .single()

  // If questionnaire not completed, redirect to questionnaire
  if (profile && !profile.questionnaire_completed) {
    redirect("/questionnaire")
  }

  // Get team info if user is in a team
  let team = null
  let teamMembers: Array<{ id: string; full_name: string; email: string }> = []
  let joinRequests: Array<{ id: string; requester_id: string; status: string; profiles: { full_name: string; email: string; skills: string } }> = []
  
  if (profile?.team_id) {
    const { data: teamData } = await supabase
      .from("teams")
      .select("*")
      .eq("id", profile.team_id)
      .single()
    
    team = teamData

    // Get team members
    const { data: members } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("team_id", profile.team_id)
    
    teamMembers = members || []

    // Get pending join requests for this team
    const { data: requests } = await supabase
      .from("join_requests")
      .select("id, requester_id, status, profiles!join_requests_requester_id_fkey(full_name, email, skills)")
      .eq("team_id", profile.team_id)
      .eq("status", "pending")
    
    joinRequests = (requests || []) as typeof joinRequests
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <DashboardContent 
          profile={profile} 
          team={team} 
          teamMembers={teamMembers}
          joinRequests={joinRequests}
        />
      </main>
      
      <Footer />
    </div>
  )
}
