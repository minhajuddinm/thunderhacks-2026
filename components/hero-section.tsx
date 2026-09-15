"use client"

import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { CalendarDays, MapPin } from "lucide-react"
import { Countdown } from "@/components/countdown"
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
    <section className="relative overflow-hidden border-b border-[var(--rule)] pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 0%, rgba(139,59,255,0.20) 0%, transparent 70%)",
        }}
      />

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

        <motion.p
          variants={item}
          className="mt-4 inline-flex items-center gap-2.5 border-t-2 border-[var(--bolt)] pt-2.5 text-sm text-foreground sm:text-base"
        >
          {EVENT.presentedBy}
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
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              disabled
              aria-describedby="auth-availability"
              className="w-full cursor-not-allowed rounded-md border border-[var(--bolt)]/40 bg-[var(--bolt)]/10 px-7 py-3 font-semibold text-[var(--bolt)] sm:w-auto"
            >
              Log in
            </button>
            <button
              type="button"
              disabled
              aria-describedby="auth-availability"
              className="w-full cursor-not-allowed rounded-md border border-[var(--rule)] px-7 py-3 font-semibold text-muted-foreground sm:w-auto"
            >
              Sign up
            </button>
          </div>
          <p
            id="auth-availability"
            className="mt-3 text-sm text-muted-foreground"
          >
            {EVENT.registrationOpensLabel}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
