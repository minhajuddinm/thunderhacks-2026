"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { EVENT } from "@/lib/content"
import { LightningLink } from "@/components/ui/lightning-link"

/**
 * The one signature scroll moment on the page. The two campuses start apart and
 * close together as the band scrolls into view, with the connector between them
 * drawing in. It is the argument the whole site makes, made physically: two
 * places, one competition. Everything else on the page stays still.
 */
export function CampusesSection() {
  const ref = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const leftX = useTransform(scrollYProgress, [0, 1], ["-14%", "0%"])
  const rightX = useTransform(scrollYProgress, [0, 1], ["14%", "0%"])
  const linkScale = useTransform(scrollYProgress, [0.25, 1], [0, 1])

  const [brampton, sault] = EVENT.campuses

  return (
    <section
      ref={ref}
      id="campuses"
      aria-label="Campuses"
      className="scroll-mt-16 overflow-hidden border-b border-[var(--rule)] bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative grid grid-cols-1 items-stretch gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-0">
          <motion.div
            style={reduce ? undefined : { x: leftX }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative pt-8 md:pr-12"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 md:right-12"
              style={{ background: "var(--brampton)" }}
            />
            <p className="text-sm text-muted-foreground">{brampton.region}</p>
            <h3 className="th-display mt-2 text-[clamp(1.5rem,4vw,2.25rem)] text-foreground">
              {brampton.full}
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {brampton.blurb}
            </p>
          </motion.div>

          <div
            aria-hidden="true"
            className="hidden w-16 items-stretch justify-center md:flex"
          >
            <LightningLink />
          </div>

          <motion.div
            style={reduce ? undefined : { x: rightX }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative pt-8 md:pl-12"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 md:left-12"
              style={{ background: "var(--sault)" }}
            />
            <p className="text-sm text-muted-foreground">{sault.region}</p>
            <h3 className="th-display mt-2 text-[clamp(1.5rem,4vw,2.25rem)] text-foreground">
              {sault.full}
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {sault.blurb}
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="th-display-tight mt-12 text-center text-[clamp(1.1rem,2.6vw,1.6rem)] text-foreground"
        >
          Same three days. Same prize pool. One judging panel.
        </motion.p>
      </div>
    </section>
  )
}
