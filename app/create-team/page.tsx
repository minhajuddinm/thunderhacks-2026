"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft, Zap, Users } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"


function generateTeamCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("")
  const [lookingForMembers, setLookingForMembers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkAuth = async () => {
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
      setCheckingAuth(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!userId) {
      setError("Not authenticated")
      setLoading(false)
      return
    }

    const teamCode = generateTeamCode()

    // Create the team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        team_name: teamName,
        team_code: teamCode,
        looking_for_members: lookingForMembers,
        owner_id: userId,
      })
      .select()
      .single()

    if (teamError) {
      if (teamError.code === "23505") {
        setError("A team with this name already exists. Please choose a different name.")
      } else {
        setError(teamError.message)
      }
      setLoading(false)
      return
    }

    // Add the creator to the team
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ team_id: team.id })
      .eq("id", userId)

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    // Use hard redirect to ensure fresh page load
    window.location.href = "/dashboard"
  }

  if (checkingAuth) {
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
        <div className="max-w-lg mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Create a Team</CardTitle>
              <CardDescription>
                Start your team for ThunderHacks II and invite others to join!
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    type="text"
                    placeholder="The Thunderbolts"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    maxLength={50}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lookingForMembers"
                    checked={lookingForMembers}
                    onCheckedChange={(checked) => setLookingForMembers(checked as boolean)}
                  />
                  <Label htmlFor="lookingForMembers" className="font-normal cursor-pointer">
                    Looking for team members (visible in Browse Teams)
                  </Label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Create Team
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
