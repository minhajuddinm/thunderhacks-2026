"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Users, ArrowLeft, Search, Crown, User } from "lucide-react"

interface TeamMember {
  id: string
  full_name: string
  skills: string | null
}

interface Team {
  id: string
  team_name: string
  looking_for_members: boolean
  members: TeamMember[]
}

export default function AllTeamsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [userTeamId, setUserTeamId] = useState<string | null>(null)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const loadData = async () => {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Check if user has completed questionnaire
      const { data: profile } = await supabase
        .from("profiles")
        .select("team_id, questionnaire_completed")
        .eq("id", user.id)
        .single()

      if (!profile?.questionnaire_completed) {
        router.push("/questionnaire")
        return
      }

      setUserTeamId(profile?.team_id || null)

      // Fetch all teams with their members
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("id, team_name, looking_for_members")
        .order("team_name", { ascending: true })

      if (teamsError) {
        console.error("[v0] Error fetching teams:", teamsError)
        setLoading(false)
        return
      }

      // Fetch members for each team
      const teamsWithMembers = await Promise.all(
        (teamsData || []).map(async (team) => {
          const { data: members } = await supabase
            .from("profiles")
            .select("id, full_name, skills")
            .eq("team_id", team.id)

          return {
            ...team,
            members: members || [],
          }
        })
      )

      setTeams(teamsWithMembers)
      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  const filteredTeams = teams.filter((team) =>
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some((member) =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading teams...</p>
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
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">All Teams</h1>
            <p className="text-muted-foreground">
              View all registered teams and their members. See who you will be competing against!
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams or members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{teams.length}</p>
                    <p className="text-sm text-muted-foreground">Total Teams</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {teams.reduce((acc, team) => acc + team.members.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Participants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teams List */}
          {filteredTeams.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No teams match your search"
                    : "No teams have registered yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTeams.map((team) => (
                <Card
                  key={team.id}
                  className={`bg-card border-border hover:border-primary/30 transition-colors cursor-pointer ${
                    team.id === userTeamId ? "ring-2 ring-primary/50" : ""
                  }`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground flex items-center gap-2">
                            {team.team_name}
                            {team.id === userTeamId && (
                              <Badge className="bg-primary/20 text-primary text-xs">
                                Your Team
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {team.members.length >= 4 ? (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            Full
                          </Badge>
                        ) : team.looking_for_members ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/20 text-green-400 border-green-500/30"
                          >
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            Closed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {team.members.slice(0, 4).map((member) => (
                        <Badge
                          key={member.id}
                          variant="outline"
                          className="bg-secondary/50 text-foreground"
                        >
                          {member.full_name}
                        </Badge>
                      ))}
                      {team.members.length > 4 && (
                        <Badge variant="outline" className="text-muted-foreground">
                          +{team.members.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Team Details Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl flex items-center gap-2">
              {selectedTeam?.team_name}
              {selectedTeam?.id === userTeamId && (
                <Badge className="bg-primary/20 text-primary text-xs">Your Team</Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {selectedTeam?.members.length} member
              {selectedTeam?.members.length !== 1 ? "s" : ""}
              {selectedTeam && selectedTeam.members.length < 4 && selectedTeam.looking_for_members && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-400 border-green-500/30 ml-2"
                >
                  {4 - selectedTeam.members.length} spot
                  {4 - selectedTeam.members.length > 1 ? "s" : ""} available
                </Badge>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Team Members</h4>
              <div className="space-y-3">
                {selectedTeam?.members.map((member, index) => (
                  <div
                    key={member.id}
                    className="bg-secondary/50 px-4 py-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                      <span className="font-medium text-foreground">{member.full_name}</span>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs ml-auto">
                          Leader
                        </Badge>
                      )}
                    </div>
                    {member.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.skills.split(",").slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs border-border text-muted-foreground"
                          >
                            {skill.trim()}
                          </Badge>
                        ))}
                        {member.skills.split(",").length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-border text-muted-foreground"
                          >
                            +{member.skills.split(",").length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
