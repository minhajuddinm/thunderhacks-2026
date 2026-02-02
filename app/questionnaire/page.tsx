"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Zap } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "nut-allergy", label: "Nut Allergy" },
]

const skillOptions = [
  { id: "frontend", label: "Frontend Development" },
  { id: "backend", label: "Backend Development" },
  { id: "mobile", label: "Mobile Development" },
  { id: "ml-ai", label: "Machine Learning / AI" },
  { id: "ui-ux", label: "UI/UX Design" },
  { id: "data-science", label: "Data Science" },
  { id: "cloud", label: "Cloud / DevOps" },
  { id: "blockchain", label: "Blockchain" },
  { id: "game-dev", label: "Game Development" },
  { id: "hardware", label: "Hardware / IoT" },
]



export default function QuestionnairePage() {
  const [phone, setPhone] = useState("")
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [otherDietary, setOtherDietary] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [otherSkills, setOtherSkills] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Check if questionnaire already completed
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

    checkAuth()
  }, [router, supabase])

  const handleDietaryChange = (id: string, checked: boolean) => {
    setSelectedDietary(prev => 
      checked ? [...prev, id] : prev.filter(item => item !== id)
    )
  }

  const handleSkillChange = (id: string, checked: boolean) => {
    setSelectedSkills(prev => 
      checked ? [...prev, id] : prev.filter(item => item !== id)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Not authenticated")
      setLoading(false)
      return
    }

    // Compile dietary restrictions
    const dietaryRestrictions = [
      ...selectedDietary.map(id => dietaryOptions.find(d => d.id === id)?.label || id),
      ...(otherDietary ? [otherDietary] : [])
    ].join(", ")

    // Compile skills
    const skills = [
      ...selectedSkills.map(id => skillOptions.find(s => s.id === id)?.label || id),
      ...(otherSkills ? [otherSkills] : [])
    ].join(", ")

    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single()

    let profileError;
    
    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from("profiles")
        .update({
          phone: phone || null,
          dietary_restrictions: dietaryRestrictions || null,
          skills: skills || null,
          questionnaire_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
      profileError = error
    } else {
      // Create new profile if it doesn't exist
      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split("@")[0],
          phone: phone || null,
          dietary_restrictions: dietaryRestrictions || null,
          skills: skills || null,
          questionnaire_completed: true,
        })
      profileError = error
    }

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    // Force a hard navigation to ensure fresh data is fetched
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
        <Card className="max-w-2xl mx-auto bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/th-logo.png"
                alt="ThunderHacks"
                width={80}
                height={80}
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us a bit more about yourself to help us make ThunderHacks 2026 amazing for you!
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll only use this for important event updates
                </p>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-3">
                <Label>Dietary Restrictions</Label>
                <p className="text-sm text-muted-foreground">
                  Let us know so we can accommodate your needs during meals
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={selectedDietary.includes(option.id)}
                        onCheckedChange={(checked) => handleDietaryChange(option.id, checked as boolean)}
                      />
                      <Label htmlFor={option.id} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Other dietary restrictions..."
                  value={otherDietary}
                  onChange={(e) => setOtherDietary(e.target.value)}
                />
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label>Skills & Interests</Label>
                <p className="text-sm text-muted-foreground">
                  This helps teams find members with complementary skills
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {skillOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={selectedSkills.includes(option.id)}
                        onCheckedChange={(checked) => handleSkillChange(option.id, checked as boolean)}
                      />
                      <Label htmlFor={option.id} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <Textarea
                  placeholder="Other skills, technologies, or interests..."
                  value={otherSkills}
                  onChange={(e) => setOtherSkills(e.target.value)}
                  rows={2}
                />
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
