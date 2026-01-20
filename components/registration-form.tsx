"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { registerIndividual, registerTeam, joinTeamByCode } from "@/app/register/actions"
import { CheckCircle, Loader2, User, Users, UserPlus } from "lucide-react"

export function RegistrationForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ type: string; message: string; teamCode?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleIndividualSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await registerIndividual(formData)

    setLoading(false)
    if (result.success) {
      setSuccess({ type: "individual", message: "You have been registered successfully!" })
    } else {
      setError(result.error || "Registration failed. Please try again.")
    }
  }

  async function handleTeamSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await registerTeam(formData)

    setLoading(false)
    if (result.success) {
      setSuccess({
        type: "team",
        message: "Your team has been registered!",
        teamCode: result.teamCode,
      })
    } else {
      setError(result.error || "Registration failed. Please try again.")
    }
  }

  async function handleJoinSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await joinTeamByCode(formData)

    setLoading(false)
    if (result.success) {
      setSuccess({
        type: "join",
        message: `You have joined team "${result.teamName}"!`,
      })
    } else {
      setError(result.error || "Failed to join team. Please try again.")
    }
  }

  if (success) {
    return (
      <Card className="max-w-md mx-auto bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Registration Complete!</h3>
            <p className="text-muted-foreground mb-4">{success.message}</p>
            {success.teamCode && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-2">Share this code with your teammates:</p>
                <p className="text-2xl font-mono font-bold text-primary">{success.teamCode}</p>
              </div>
            )}
            <Button onClick={() => setSuccess(null)} variant="outline">
              Register Another
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="individual" className="max-w-2xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="individual" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Individual</span>
        </TabsTrigger>
        <TabsTrigger value="team" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Create Team</span>
        </TabsTrigger>
        <TabsTrigger value="join" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Join Team</span>
        </TabsTrigger>
      </TabsList>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <TabsContent value="individual">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Individual Registration</CardTitle>
            <CardDescription>
              Register as an individual participant. You can find a team later or work solo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIndividualSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <Input id="dietaryRestrictions" name="dietaryRestrictions" placeholder="Vegetarian, Gluten-free, etc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills/Interests</Label>
                <Input id="skills" name="skills" placeholder="Python, React, Machine Learning, etc." />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="lookingForTeam" name="lookingForTeam" value="true" defaultChecked />
                <Label htmlFor="lookingForTeam" className="text-sm font-normal">
                  I&apos;m looking for a team to join
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Register as Individual
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="team">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Create a Team</CardTitle>
            <CardDescription>
              Register your team and get a code to share with your teammates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTeamSubmit} className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Team Information</h4>
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input id="teamName" name="teamName" required placeholder="Code Crusaders" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lookingForMembers" name="lookingForMembers" value="true" defaultChecked />
                  <Label htmlFor="lookingForMembers" className="text-sm font-normal">
                    Looking for additional team members
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Team Leader (Your Information)</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="leaderName">Full Name *</Label>
                    <Input id="leaderName" name="leaderName" required placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaderEmail">Email *</Label>
                    <Input id="leaderEmail" name="leaderEmail" type="email" required placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leaderPhone">Phone</Label>
                  <Input id="leaderPhone" name="leaderPhone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leaderDietary">Dietary Restrictions</Label>
                  <Input id="leaderDietary" name="leaderDietary" placeholder="Vegetarian, Gluten-free, etc." />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Team
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="join">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Join a Team</CardTitle>
            <CardDescription>
              Have a team code? Enter it below to join an existing team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamCode">Team Code *</Label>
                <Input
                  id="teamCode"
                  name="teamCode"
                  required
                  placeholder="ABC123"
                  className="text-center text-lg font-mono uppercase tracking-wider"
                  maxLength={6}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="joinFullName">Full Name *</Label>
                  <Input id="joinFullName" name="fullName" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinEmail">Email *</Label>
                  <Input id="joinEmail" name="email" type="email" required placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinPhone">Phone</Label>
                <Input id="joinPhone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDietary">Dietary Restrictions</Label>
                <Input id="joinDietary" name="dietaryRestrictions" placeholder="Vegetarian, Gluten-free, etc." />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Join Team
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
