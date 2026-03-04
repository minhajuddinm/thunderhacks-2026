"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/prizes", label: "Prizes" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/event", label: "Event" },
  { href: "/announcements", label: "Announcements" },
  { href: "/faq", label: "FAQ" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ? { email: user.email || "" } : null)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email || "" } : null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/th-logo.png"
              alt="ThunderHacks Logo"
              width={40}
              height={40}
              className="h-auto"
            />
            <span className="font-bold text-lg text-foreground">hunderHacks</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            
            {!loading && (
              user ? (
                <Button asChild className="ml-4">
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <Button asChild className="ml-4">
                  <Link href="/login">Login</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {!loading && (
                user ? (
                  <Button asChild className="mt-2">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="mt-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
