"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, MapPin, Zap } from "lucide-react"

function LightningBolt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

interface Particle {
  id: number
  left: number
  top: number
  delay: number
  duration: number
}

function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate particles only on the client to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-[#7000FF]/40 rounded-full animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      {/* Larger glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#7000FF]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9333ea]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#FFEA00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF]/10 via-[#0B0E14] to-[#FFEA00]/5" />
      
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(112,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(112,0,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/th-logo.png"
            alt="ThunderHacks"
            width={180}
            height={180}
            className="drop-shadow-2xl"
            priority
          />
        </div>

        {/* Main Title - THUNDER HACKS 2026 */}
        <div className="flex justify-center items-center gap-3 mb-2">
          <LightningBolt className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFEA00] animate-pulse" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground uppercase">
            ThunderHacks
          </h1>
          <LightningBolt className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFEA00] animate-pulse" />
        </div>
        
        {/* Year */}
        <div className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-[#7000FF] via-[#9333ea] to-[#FFEA00] bg-clip-text text-transparent">
          2026
        </div>

        {/* Tagline - smaller */}
        <p className="text-lg sm:text-xl lg:text-2xl font-medium text-muted-foreground mb-6 tracking-wide">
          Spark Innovation. Strike Fast.
        </p>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Join Algoma University&apos;s premier hackathon. Build. Collaborate. Compete.
        </p>

        {/* Key Details */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#7000FF]/30">
            <Calendar className="h-5 w-5 text-[#9333ea]" />
            <span className="text-foreground font-medium">March 14-15, 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#7000FF]/30">
            <MapPin className="h-5 w-5 text-[#9333ea]" />
            <span className="text-foreground font-medium">Brampton, ON</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FFEA00]/30">
            <Zap className="h-5 w-5 text-[#FFEA00]" />
            <span className="text-foreground font-medium">$1,750 in Prizes</span>
          </div>
        </div>

        {/* Stats with electric styling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12">
          {[
            { value: "2", label: "Days" },
            { value: "$1.7K+", label: "In Prizes" },
            { value: "100+", label: "Hackers" },
            { value: "20+", label: "Projects" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-3xl sm:text-4xl font-black text-[#FFEA00]">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Discord CTA */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-[#5865F2]/30 p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg className="h-8 w-8 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
            <h3 className="text-lg font-bold text-foreground">Join our Discord</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with other hackers, find teammates, and get the latest updates!
          </p>
          <a
            href="https://discord.gg/BrcNTdjaJK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#5865F2] text-white font-semibold rounded-lg hover:bg-[#4752C4] transition-colors"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
            Join Discord Server
          </a>
        </div>
      </div>
    </section>
  )
}
