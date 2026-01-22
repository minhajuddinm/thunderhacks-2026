"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  dietary_restrictions: string | null
  skills: string | null
  questionnaire_completed: boolean
  team_id: string | null
  teams?: Team | null
}

interface Team {
  id: string
  team_name: string
  team_code: string
  looking_for_members: boolean
}

interface TeamMember {
  id: string
  full_name: string
  email: string
}

interface JoinRequest {
  id: string
  requester_id: string
  status: string
  profiles: {
    full_name: string
    email: string
    skills: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      const supabase = getSupabaseBrowserClient()
      
      // Check auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push("/login")
        return
      }

      // Get profile (use explicit foreign key to avoid ambiguity)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*, teams!profiles_team_id_fkey(*)")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist
        router.push("/questionnaire")
        return
      }

      if (profileError) {
        setError(`Failed to load profile: ${profileError.message}`)
        setLoading(false)
        return
      }

      if (profileData && !profileData.questionnaire_completed) {
        router.push("/questionnaire")
        return
      }

      setProfile(profileData)

      // Get team info if user is in a team
      if (profileData?.team_id) {
        const { data: teamData } = await supabase
          .from("teams")
          .select("*")
          .eq("id", profileData.team_id)
          .single()
        
        setTeam(teamData)

        // Get team members
        const { data: members } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("team_id", profileData.team_id)
        
        setTeamMembers(members || [])

        // Get pending join requests for this team
        const { data: requests } = await supabase
          .from("join_requests")
          .select("id, requester_id, status, profiles!join_requests_requester_id_fkey(full_name, email, skills)")
          .eq("team_id", profileData.team_id)
          .eq("status", "pending")
        
        setJoinRequests((requests || []) as JoinRequest[])
      }

      setLoading(false)
    }

    loadDashboard()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Unable to load profile</h1>
            <p className="text-muted-foreground mb-4">{error || "There was an error loading your profile."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
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
