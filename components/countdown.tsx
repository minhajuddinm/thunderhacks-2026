"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now())
  const seconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  }
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

/**
 * Live countdown to the event start.
 * Renders skeletons until mounted (avoids hydration mismatch) and flips each
 * digit group on tick. Flip is replaced by a plain value under reduced motion.
 */
export function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime()
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setMounted(true)
    setTime(getTimeLeft(target))
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ]

  if (!mounted) {
    return (
      <div className="flex justify-center gap-3 sm:gap-4" aria-hidden="true">
        {units.map((u) => (
          <Skeleton key={u.label} className="h-20 w-16 sm:h-24 sm:w-20" />
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex justify-center gap-3 sm:gap-4"
      role="timer"
      aria-label={`Countdown to ThunderHacks II: ${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds remaining`}
    >
      {units.map((unit) => (
        <FlipUnit key={unit.label} value={unit.value} label={unit.label} />
      ))}
    </div>
  )
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion()
  const display = pad(value)

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-xl border border-[#7000FF]/30 bg-card/60 backdrop-blur-sm sm:h-24 sm:w-20">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-border/60" />
        {reduce ? (
          <span className="text-3xl font-black tabular-nums text-foreground sm:text-4xl">
            {display}
          </span>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute text-3xl font-black tabular-nums text-foreground sm:text-4xl"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
        {label}
      </span>
    </div>
  )
}
