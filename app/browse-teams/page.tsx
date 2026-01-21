"use client"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"


import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Users, Search, UserPlus, CheckCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface Team {
  id: string
  name: string
  description: string | null
  team_code: string
  looking_for_members: boolean
  member_count: number
}

interface Profile {
  full_name: string
  skills: string | null
}

const Loading = () => null

export default function BrowseTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [teamCode, setTeamCode] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingTeamId, setLoadingTeamId] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [pendingRequests, setPendingRequests] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Check if user already has a team
      const { data: profile } = await supabase
        .from("profiles")
        .select("team_id, questionnaire_completed")
        .eq("id", user.id)
        .single()

      if (!profile?.questionnaire_completed) {
        router.push("/questionnaire")
        return
      }

      if (profile?.team_id) {
        router.push("/dashboard")
        return
      }

      setUserId(user.id)

      // Load teams that are looking for members
      const { data: teamsData } = await supabase
        .from("teams")
        .select("id, name, description, team_code, looking_for_members")
        .eq("looking_for_members", true)

      if (teamsData) {
        // Get member counts for each team
        const teamsWithCounts = await Promise.all(
          teamsData.map(async (team) => {
            const { count } = await supabase
              .from("profiles")
              .select("*", { count: "exact", head: true })
              .eq("team_id", team.id)
            
            return { ...team, member_count: count || 0 }
          })
        )
        setTeams(teamsWithCounts.filter(t => t.member_count < 4))
      }

      // Get user's pending requests
      const { data: requests } = await supabase
        .from("join_requests")
        .select("team_id")
        .eq("requester_id", user.id)
        .eq("status", "pending")

      if (requests) {
        setPendingRequests(requests.map(r => r.team_id))
      }

      setInitialLoading(false)
    }

    loadData()
  }, [router, supabase])

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!userId) {
      setError("Not authenticated")
      setLoading(false)
      return
    }

    const code = teamCode.toUpperCase().trim()

    // Find the team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, name")
      .eq("team_code", code)
      .single()

    if (teamError || !team) {
      setError("Invalid team code. Please check and try again.")
      setLoading(false)
      return
    }

    // Check team size
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("team_id", team.id)

    if ((count || 0) >= 4) {
      setError("This team is already full (max 4 members).")
      setLoading(false)
      return
    }

    // Check if already requested
    const { data: existingRequest } = await supabase
      .from("join_requests")
      .select("id, status")
      .eq("team_id", team.id)
      .eq("requester_id", userId)
      .single()

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        setError("You already have a pending request to join this team.")
      } else if (existingRequest.status === "rejected") {
        setError("Your previous request to join this team was declined.")
      }
      setLoading(false)
      return
    }

    // Create join request
    const { error: requestError } = await supabase
      .from("join_requests")
      .insert({
        team_id: team.id,
        requester_id: userId,
        status: "pending",
      })

    if (requestError) {
      setError(requestError.message)
      setLoading(false)
      return
    }

    setSuccess(`Request sent to join "${team.name}"! The team will review your request.`)
    setTeamCode("")
    setPendingRequests([...pendingRequests, team.id])
    setLoading(false)
  }

  const handleRequestToJoin = async (teamId: string, teamName: string) => {
    setError(null)
    setSuccess(null)
    setLoadingTeamId(teamId)

    if (!userId) {
      setError("Not authenticated")
      setLoadingTeamId(null)
      return
    }

    // Create join request
    const { error: requestError } = await supabase
      .from("join_requests")
      .insert({
        team_id: teamId,
        requester_id: userId,
        status: "pending",
      })

    if (requestError) {
      if (requestError.code === "23505") {
        setError("You already have a pending request to join this team.")
      } else {
        setError(requestError.message)
      }
      setLoadingTeamId(null)
      return
    }

    setSuccess(`Request sent to join "${teamName}"!`)
    setPendingRequests([...pendingRequests, teamId])
    setLoadingTeamId(null)
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Join a Team</h1>
            <p className="text-muted-foreground">
              Browse available teams or join with a team code
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Teams</TabsTrigger>
              <TabsTrigger value="code">Join with Code</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Teams List */}
              {filteredTeams.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No teams match your search" : "No teams are currently looking for members"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try creating your own team or join with a team code!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredTeams.map((team) => (
                    <Card key={team.id} className="bg-card border-border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-foreground">{team.name}</CardTitle>
                            {team.description && (
                              <CardDescription className="mt-1">{team.description}</CardDescription>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {team.member_count}/4 members
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardFooter>
                        {pendingRequests.includes(team.id) ? (
                          <Button disabled variant="outline" className="w-full bg-transparent">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Request Pending
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleRequestToJoin(team.id, team.name)}
                            disabled={loadingTeamId === team.id}
                            className="w-full"
                          >
                            {loadingTeamId === team.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <UserPlus className="mr-2 h-4 w-4" />
                            )}
                            Request to Join
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="code">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Join with Team Code</CardTitle>
                  <CardDescription>
                    Enter the 6-character code provided by your team leader
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleJoinByCode}>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="teamCode">Team Code</Label>
                      <Input
                        id="teamCode"
                        type="text"
                        placeholder="ABC123"
                        value={teamCode}
                        onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="font-mono text-lg tracking-widest text-center"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={loading || teamCode.length !== 6}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Request to Join
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export const unstable_getServerSession = async () => {
  return null
}

export const dynamic = "force-dynamic"

// Create a loading.tsx file in the same directory as the page that uses useSearchParams()
// The loading.tsx file should export a default Loading component that returns null.
