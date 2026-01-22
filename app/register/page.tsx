"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // User is logged in, redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        // User is not logged in, redirect to login
        window.location.href = "/login"
      }
    }

    checkAuth()
  }, [supabase])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
