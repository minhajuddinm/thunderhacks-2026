"use client"

import { useEffect, useState } from "react"

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

const pad = (n: number) => n.toString().padStart(2, "0")

/**
 * Live countdown to the opening. Renders a stable placeholder until mounted so
 * the server and client markup match, then ticks once a second. No entrance
 * animation: the number changing is the motion.
 */
export function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime()
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft(target))
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const units = [
    { label: "days", value: time?.days },
    { label: "hours", value: time?.hours },
    { label: "minutes", value: time?.minutes },
    { label: "seconds", value: time?.seconds },
  ]

  const announcement = time
    ? `${time.days} days, ${time.hours} hours, ${time.minutes} minutes and ${time.seconds} seconds until ThunderHacks II opens`
    : "Loading countdown"

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={announcement}
      className="grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--rule)]"
    >
      {units.map((unit, i) => (
        <div
          key={unit.label}
          className="relative bg-[var(--raised)] px-3 py-4 text-center sm:px-6 sm:py-5"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5"
            style={{
              background: i < 2 ? "var(--brampton)" : "var(--sault)",
            }}
          />
          <div className="th-display text-3xl tabular-nums text-foreground sm:text-5xl">
            {unit.value === undefined ? "--" : pad(unit.value)}
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  )
}
