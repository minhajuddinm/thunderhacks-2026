"use client"

import Image from "next/image"
import { AuthButtons } from "@/components/auth/auth-buttons"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { CalendarDays, MapPin } from "lucide-react"
import { Countdown } from "@/components/countdown"
import { StormField } from "@/components/ui/storm-field"
import { EVENT } from "@/lib/content"

/**
 * The one orchestrated motion moment on the site: a single page-load sequence.
 * Everything below the fold is static.
 */
export function HeroSection() {
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
  }

  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <section id="top" className="relative overflow-hidden border-b border-[var(--rule)] pt-16">
      <StormField />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-4xl px-5 pb-20 pt-14 text-center sm:px-8 sm:pb-24 sm:pt-20"
      >
        <motion.div variants={item} className="flex justify-center">
          <Image
            src="/images/th-logo.png"
            alt=""
            width={200}
            height={200}
            className="h-32 w-32 object-contain sm:h-44 sm:w-44"
            priority
          />
        </motion.div>

        <motion.h1
          variants={item}
          className="th-display mt-6 text-[clamp(1.9rem,7.5vw,5rem)] text-foreground"
        >
          ThunderHacks {EVENT.edition}
        </motion.h1>

        {/* The OLG mark alone, without the tagline, reads as a sponsor credit. */}
        <motion.p
          variants={item}
          className="mt-4 inline-flex items-center gap-3 border-t-2 border-[var(--bolt)] pt-3 text-sm uppercase tracking-[0.14em] text-muted-foreground sm:text-[15px]"
        >
          <span>Powered by</span>
          <Image
            src="/images/sponsors/olg-mark.png"
            alt="OLG"
            width={184}
            height={150}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </motion.p>

        <motion.p
          variants={item}
          className="th-display-tight mx-auto mt-6 max-w-xl text-pretty text-2xl text-foreground sm:text-3xl"
        >
          {EVENT.tagline}
        </motion.p>

        <motion.p
          variants={item}
          className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground"
        >
          {EVENT.subtitle}, running on both campuses at once.
        </motion.p>

        <motion.ul
          variants={item}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[15px]"
        >
          <li className="flex items-center gap-2 text-foreground">
            <CalendarDays
              className="h-[18px] w-[18px] text-muted-foreground"
              aria-hidden="true"
            />
            {EVENT.datesLabel}
          </li>
          {EVENT.campuses.map((campus) => (
            <li key={campus.key} className="flex items-center gap-2 text-foreground">
              <MapPin
                className="h-[18px] w-[18px]"
                aria-hidden="true"
                style={{
                  color:
                    campus.key === "brampton"
                      ? "var(--brampton)"
                      : "var(--sault)",
                }}
              />
              {campus.name}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={item} className="mx-auto mt-10 max-w-lg">
          <p className="th-display-tight mb-3 text-lg text-foreground sm:text-xl">
            {EVENT.countdownLabel}
          </p>
          <Countdown targetISO={EVENT.startsAtISO} />
        </motion.div>

        <motion.div variants={item} className="mt-9">
          <AuthButtons variant="hero" />
        </motion.div>
      </motion.div>
    </section>
  )
}
