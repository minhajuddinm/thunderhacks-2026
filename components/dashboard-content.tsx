"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, UserPlus, LogOut, Settings, Check, X, Copy, CheckCircle, Shield, Bell } from "lucide-react"

const ADMIN_EMAIL = "alcoms@algomau.ca"

interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  dietary_restrictions: string | null
  skills: string | null
  team_id: string | null
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
  requester_name: string
  status: string
}

interface DashboardContentProps {
  profile: Profile
  team: Team | null
  teamMembers: TeamMember[]
  joinRequests: JoinRequest[]
}

export function DashboardContent({ profile, team, teamMembers, joinRequests }: DashboardContentProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const supabase = getSupabaseBrowserClient()
  const isAdmin = profile.email === ADMIN_EMAIL

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const copyTeamCode = () => {
    if (team?.team_code) {
      navigator.clipboard.writeText(team.team_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleJoinRequest = async (requestId: string, action: "approved" | "rejected") => {
    setLoading(requestId)
    setError(null)
    
    const request = joinRequests.find(r => r.id === requestId)
    if (!request) return

    if (action === "approved") {
      // Update the requester's profile to add them to the team
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ team_id: team?.id })
        .eq("id", request.requester_id)

      if (profileError) {
        setError(`Failed to add member to team: ${profileError.message}`)
        setLoading(null)
        return
      }
    }

    // Update the join request status
    const { error: requestError } = await supabase
      .from("join_requests")
      .update({ status: action })
      .eq("id", requestId)

    if (requestError) {
      setError(`Failed to update request: ${requestError.message}`)
      setLoading(null)
      return
    }

    setSuccess(`Request ${action}!`)
    setLoading(null)
    // Reload to show updated team members
    window.location.reload()
  }

  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave the team?")) return
    
    setLoading("leave")
    
    // Check if user is the team owner (last member leaves = delete team)
    const isOwner = teamMembers.length === 1
    
    // First, update the profile to remove team association
    const { error } = await supabase
      .from("profiles")
      .update({ team_id: null })
      .eq("id", profile.id)

    if (error) {
      setError("Failed to leave team")
      setLoading(null)
      return
    }

    // If user was the only member, delete the team from the database
    if (isOwner && team) {
      // Delete any pending join requests for this team
      await supabase
        .from("join_requests")
        .delete()
        .eq("team_id", team.id)
      
      // Delete the team itself
      await supabase
        .from("teams")
        .delete()
        .eq("id", team.id)
    }

    // Use hard redirect to ensure fresh page load
    window.location.href = "/dashboard"
  }

  // Admin Dashboard View
  if (isAdmin) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-primary" />
              <Badge className="bg-primary text-primary-foreground">Admin</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile.full_name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Post Announcements
              </CardTitle>
              <CardDescription>
                Create announcements visible to all registered participants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/announcements">Go to Announcements</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5 text-accent" />
                Browse Teams
              </CardTitle>
              <CardDescription>
                View all registered teams and their members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/teams">View All Teams</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Profile Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{profile.phone || "Not provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Regular User Dashboard View
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile.full_name}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">{success}</AlertDescription>
        </Alert>
      )}

      {/* Team Status */}
      {team ? (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {team.team_name}
                </CardTitle>
                <CardDescription>Your team for ThunderHacks 2026</CardDescription>
              </div>
              {team.looking_for_members && (
                <Badge className="bg-accent text-accent-foreground">Looking for Members</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Code */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Team Code:</span>
              <code className="font-mono font-bold text-primary">{team.team_code}</code>
              <Button variant="ghost" size="sm" onClick={copyTeamCode}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Team Members ({teamMembers.length}/4)</h3>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    {member.id === profile.id && (
                      <Badge variant="outline">You</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Join Requests */}
            {joinRequests.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Pending Join Requests</h3>
                <div className="space-y-2">
                  {joinRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/30">
                      <div>
                        <p className="font-medium text-foreground">{request.requester_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleJoinRequest(request.id, "approved")}
                          disabled={loading === request.id || teamMembers.length >= 4}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleJoinRequest(request.id, "rejected")}
                          disabled={loading === request.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="text-destructive hover:bg-destructive/10 bg-transparent" onClick={handleLeaveTeam} disabled={loading === "leave"}>
              Leave Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Plus className="h-5 w-5 text-accent" />
                Create a Team
              </CardTitle>
              <CardDescription>
                Start your own team and invite others to join using a unique team code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/create-team">Create Team</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <UserPlus className="h-5 w-5 text-primary" />
                Join a Team
              </CardTitle>
              <CardDescription>
                Browse teams looking for members or join with a team code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/browse-teams">Browse Teams</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{profile.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dietary Restrictions</p>
              <p className="font-medium text-foreground">{profile.dietary_restrictions || "None"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skills</p>
              <p className="font-medium text-foreground">{profile.skills || "Not specified"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
