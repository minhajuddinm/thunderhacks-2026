"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

/**
 * Opacity only, once, on entry. Deliberately not a slide: fade-and-slide-up on
 * every block is the generic reveal, and the page already has one real scroll
 * moment in the campuses band. This is here to soften the arrival of long
 * content, not to be the effect people notice.
 */
export function FadeIn({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
