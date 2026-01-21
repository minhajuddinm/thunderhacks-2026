"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"
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

const createBrowserClient = getSupabaseBrowserClient;

export default function ProfilePage() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [otherDietary, setOtherDietary] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [otherSkills, setOtherSkills] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || "")
        setPhone(profile.phone || "")
        
        // Parse dietary restrictions
        if (profile.dietary_restrictions) {
          const dietaryList = profile.dietary_restrictions.split(", ")
          const knownDietary = dietaryList.filter((d: string) => 
            dietaryOptions.some(opt => opt.label === d)
          )
          const otherDietaryItems = dietaryList.filter((d: string) => 
            !dietaryOptions.some(opt => opt.label === d)
          )
          setSelectedDietary(knownDietary.map((d: string) => 
            dietaryOptions.find(opt => opt.label === d)?.id || ""
          ).filter(Boolean))
          setOtherDietary(otherDietaryItems.join(", "))
        }
        
        // Parse skills
        if (profile.skills) {
          const skillsList = profile.skills.split(", ")
          const knownSkills = skillsList.filter((s: string) => 
            skillOptions.some(opt => opt.label === s)
          )
          const otherSkillItems = skillsList.filter((s: string) => 
            !skillOptions.some(opt => opt.label === s)
          )
          setSelectedSkills(knownSkills.map((s: string) => 
            skillOptions.find(opt => opt.label === s)?.id || ""
          ).filter(Boolean))
          setOtherSkills(otherSkillItems.join(", "))
        }
      }

      setInitialLoading(false)
    }

    loadProfile()
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
    setSuccess(false)
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

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        dietary_restrictions: dietaryRestrictions || null,
        skills: skills || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

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
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information for Thunder Hacks 2026
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-500 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">
                      Profile updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

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
                </div>

                {/* Dietary Restrictions */}
                <div className="space-y-3">
                  <Label>Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {dietaryOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${option.id}`}
                          checked={selectedDietary.includes(option.id)}
                          onCheckedChange={(checked) => handleDietaryChange(option.id, checked as boolean)}
                        />
                        <Label htmlFor={`edit-${option.id}`} className="font-normal cursor-pointer">
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
                  <div className="grid grid-cols-2 gap-3">
                    {skillOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-skill-${option.id}`}
                          checked={selectedSkills.includes(option.id)}
                          onCheckedChange={(checked) => handleSkillChange(option.id, checked as boolean)}
                        />
                        <Label htmlFor={`edit-skill-${option.id}`} className="font-normal cursor-pointer">
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
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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
