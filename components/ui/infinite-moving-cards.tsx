"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Item = {
  key: string
  content: ReactNode
}

/**
 * Infinite marquee inspired by Aceternity UI's Infinite Moving Cards (MIT).
 * The track is duplicated once and translated 50%, producing a seamless loop.
 * Animation is CSS-only (.th-marquee) and pauses under prefers-reduced-motion.
 */
export function InfiniteMovingCards({
  items,
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items: Item[]
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}) {
  const duration = speed === "fast" ? "20s" : speed === "normal" ? "30s" : "44s"

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        // Fade the edges so cards slide in and out smoothly.
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        pauseOnHover && "th-marquee-paused",
        className,
      )}
    >
      <ul
        className="th-marquee flex w-max flex-nowrap items-stretch gap-4"
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <li key={`${item.key}-${i}`} aria-hidden={i >= items.length} className="shrink-0">
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
