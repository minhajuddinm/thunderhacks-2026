"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Zap, CheckCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"


export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const supabase = getSupabaseBrowserClient()

  // Check if already logged in
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        window.location.href = "/dashboard"
      } else {
        setCheckingAuth(false)
      }
    })
  }, [supabase])

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate email domain
    if (!email.endsWith("@algomau.ca")) {
      setError("Only @algomau.ca email addresses are allowed to register.")
      setLoading(false)
      return
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                We've sent a confirmation link to <strong>{email}</strong>. 
                Please check your inbox and click the link to verify your account.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Link href="/login">
                <Button variant="outline">Back to Login</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/th-logo.png"
                alt="ThunderHacks"
                width={80}
                height={80}
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription>
              Join ThunderHacks 2026 at Algoma University
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@algomau.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Only @algomau.ca emails are accepted
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
