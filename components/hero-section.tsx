"use client"

import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { Calendar, MapPin, Zap } from "lucide-react"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Countdown } from "@/components/countdown"
import { EVENT } from "@/lib/content"

function LightningBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function HeroSection() {
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.05 },
    },
  }

  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <AuroraBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <motion.div variants={item} className="mb-6 flex justify-center">
          <Image
            src="/images/th-logo.png"
            alt="ThunderHacks II"
            width={160}
            height={160}
            className="drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.div variants={item} className="mb-2 flex items-center justify-center gap-3">
          <LightningBolt className="h-8 w-8 text-[#FFEA00] sm:h-10 sm:w-10" />
          <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            ThunderHacks
          </h1>
          <LightningBolt className="h-8 w-8 text-[#FFEA00] sm:h-10 sm:w-10" />
        </motion.div>

        <motion.div
          variants={item}
          className="mb-4 bg-gradient-to-r from-[#7000FF] via-[#9333ea] to-[#FFEA00] bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl lg:text-8xl"
        >
          II
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mx-auto mb-3 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg lg:text-xl"
        >
          {EVENT.subtitle}
        </motion.p>

        {/* Format tagline */}
        <motion.p
          variants={item}
          className="mb-8 text-xl font-black uppercase tracking-wide text-[#FFEA00] sm:text-2xl lg:text-3xl"
        >
          {EVENT.tagline}
        </motion.p>

        {/* Key details */}
        <motion.div variants={item} className="mb-8 flex flex-wrap justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#7000FF]/30 bg-card/50 px-4 py-2 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-[#9333ea]" />
            <span className="font-medium text-foreground">{EVENT.datesLabel}</span>
          </div>
          {EVENT.campuses.map((campus) => (
            <div
              key={campus.name}
              className="flex items-center gap-2 rounded-full border border-[#7000FF]/30 bg-card/50 px-4 py-2 backdrop-blur-sm"
            >
              <MapPin className="h-5 w-5 text-[#9333ea]" />
              <span className="font-medium text-foreground">
                {campus.name} <span className="text-muted-foreground">({campus.region})</span>
              </span>
            </div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div variants={item} className="mb-10">
          <p className="mb-4 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <Zap className="h-4 w-4 text-[#FFEA00]" />
            Hacking starts in
          </p>
          <Countdown targetISO={EVENT.startsAtISO} />
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={EVENT.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-colors hover:bg-accent/90"
          >
            Register Now
          </a>
          <a
            href="#sponsors"
            className="inline-flex items-center justify-center rounded-lg border border-[#7000FF]/40 bg-primary/10 px-8 py-4 font-semibold text-foreground transition-colors hover:bg-primary/20"
          >
            View Sponsor Packages
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
