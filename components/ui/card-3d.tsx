"use client"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "motion/react"
import { useRef, useState, type ReactNode } from "react"

/**
 * Lightweight 3D tilt-on-hover card inspired by Aceternity UI's 3D Card (MIT).
 * Uses a pointer-driven CSS transform (no per-frame React state churn beyond the
 * transform string) and disables the tilt entirely under prefers-reduced-motion.
 */
export function Card3D({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode
  className?: string
  /** Max rotation in degrees. */
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [transform, setTransform] = useState<string>("")

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const rx = (-py * intensity).toFixed(2)
    const ry = (px * intensity).toFixed(2)
    setTransform(`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`)
  }

  function reset() {
    setTransform("")
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={cn("transition-transform duration-200 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  )
}
