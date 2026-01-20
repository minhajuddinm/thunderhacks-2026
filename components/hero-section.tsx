"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#00D4FF]/40 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
      {/* Larger glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00D4FF]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7000FF]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#FFEA00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/10 via-[#0B0E14] to-[#7000FF]/10" />
      
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/thunderhacks-logo.png"
            alt="Thunder Hacks"
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
            Thunder Hacks
          </h1>
          <LightningBolt className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFEA00] animate-pulse" />
        </div>
        
        {/* Year */}
        <div className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-[#00D4FF] via-[#7000FF] to-[#FFEA00] bg-clip-text text-transparent">
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
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#00D4FF]/30">
            <Calendar className="h-5 w-5 text-[#00D4FF]" />
            <span className="text-foreground font-medium">March 14-15, 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#00D4FF]/30">
            <MapPin className="h-5 w-5 text-[#00D4FF]" />
            <span className="text-foreground font-medium">Brampton, ON</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FFEA00]/30">
            <Zap className="h-5 w-5 text-[#FFEA00]" />
            <span className="text-foreground font-medium">$1,250 in Prizes</span>
          </div>
        </div>

        {/* Prominent Register Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button asChild size="lg" className="text-lg px-10 py-7 font-bold bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0B0E14] shadow-lg shadow-[#00D4FF]/30 hover:shadow-[#00D4FF]/50 transition-all hover:scale-105">
            <Link href="/register">
              <Zap className="mr-2 h-5 w-5" />
              Register Now
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-7 bg-transparent border-2 border-[#7000FF] text-foreground hover:bg-[#7000FF]/20 transition-all">
            <Link href="/teams">Find a Team</Link>
          </Button>
        </div>

        {/* Stats with electric styling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {[
            { value: "2", label: "Days" },
            { value: "$1.2K+", label: "In Prizes" },
            { value: "100+", label: "Hackers" },
            { value: "20+", label: "Projects" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-3xl sm:text-4xl font-black text-[#00D4FF]">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
