"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Zap } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [skills, setSkills] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      setUserEmail(user.email || "")
      
      // Pre-fill name from Google if available
      if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name)
      }

      // Check if profile already completed
      const { data: profile } = await supabase
        .from("profiles")
        .select("questionnaire_completed")
        .eq("id", user.id)
        .single()

      if (profile?.questionnaire_completed) {
        router.push("/dashboard")
        return
      }

      setCheckingAuth(false)
    }

    checkUser()
  }, [supabase, router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!fullName.trim()) {
      setError("Please enter your full name")
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError("Not authenticated")
        setLoading(false)
        return
      }

      // Upsert profile data
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          dietary_restrictions: dietaryRestrictions.trim() || null,
          skills: skills.trim() || null,
          questionnaire_completed: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "id"
        })

      if (upsertError) {
        throw upsertError
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/th-logo.png"
                alt="ThunderHacks"
                width={80}
                height={80}
                style={{ width: '80px', height: 'auto' }}
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us a bit about yourself to finish setting up your ThunderHacks account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  type="text"
                  placeholder="e.g., Python, React, UI/UX Design (optional)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  List your technical skills, separated by commas
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dietary">Dietary Restrictions</Label>
                <Input
                  id="dietary"
                  type="text"
                  placeholder="e.g., Vegetarian, Gluten-free (optional)"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
