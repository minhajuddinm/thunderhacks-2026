"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { sendJoinRequest } from "@/app/teams/actions"
import { Users, Crown, Loader2, CheckCircle, ChevronRight } from "lucide-react"

interface TeamMember {
  id: string
  full_name: string
  is_leader: boolean
}

interface Team {
  id: string
  team_name: string
  looking_for_members: boolean
  max_members: number
  team_members: TeamMember[]
}

export function TeamCard({ team }: { team: Team }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const memberCount = team.team_members.length
  const spotsLeft = team.max_members - memberCount
  const isFull = spotsLeft <= 0
  const canJoin = team.looking_for_members && !isFull

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("teamId", team.id)

    const result = await sendJoinRequest(formData)

    setLoading(false)
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || "Failed to send request.")
    }
  }

  return (
    <>
      {/* Team Preview Card - Clickable */}
      <Card 
        className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer"
        onClick={() => setDetailsOpen(true)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-foreground">{team.team_name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4" />
                {memberCount} / {team.max_members} members
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {canJoin ? (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Open
                </Badge>
              ) : isFull ? (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Full
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Closed
                </Badge>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click to view team details {canJoin && "and request to join"}
          </p>
        </CardContent>
      </Card>

      {/* Team Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">{team.team_name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {memberCount} / {team.max_members} members
              {canJoin && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 ml-2">
                  {spotsLeft} spot{spotsLeft > 1 ? "s" : ""} available
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Team Members</h4>
              <div className="space-y-2">
                {team.team_members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg"
                  >
                    {member.is_leader && <Crown className="h-4 w-4 text-yellow-500" />}
                    <span className="text-foreground">{member.full_name}</span>
                    {member.is_leader && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        Leader
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {canJoin ? (
              <Button 
                className="w-full" 
                onClick={() => {
                  setDetailsOpen(false)
                  setJoinOpen(true)
                }}
              >
                Request to Join Team
              </Button>
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">
                {isFull ? "This team is full" : "This team is not accepting new members"}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Request Dialog */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Join {team.team_name}</DialogTitle>
            <DialogDescription>
              Send a request to join this team. The team leader will review your request.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-foreground font-medium">Request Sent!</p>
              <p className="text-sm text-muted-foreground mt-1">
                The team leader will contact you if accepted.
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setJoinOpen(false)
                  setSuccess(false)
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="requesterName">Your Name *</Label>
                <Input id="requesterName" name="requesterName" required placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requesterEmail">Your Email *</Label>
                <Input
                  id="requesterEmail"
                  name="requesterEmail"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell the team a bit about yourself..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setJoinOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Send Request
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
