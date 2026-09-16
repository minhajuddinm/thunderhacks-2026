"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A running strip of the hard facts. It pauses on hover and for readers who
 * prefer reduced motion, where it falls back to a plain wrapped list.
 */
export function Ticker({ items }: { items: string[] }) {
  const [reduce, setReduce] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduce(mq.matches)
    const on = () => setReduce(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  if (reduce) {
    return (
      <div className="border-y border-[var(--rule)] bg-[#12161f] py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-1 px-5 text-sm text-muted-foreground sm:px-8">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    )
  }

  const run = [...items, ...items]

  return (
    <div
      ref={ref}
      className="th-marquee-paused group relative overflow-hidden border-y border-[var(--rule)] bg-[#12161f] py-3"
      aria-label={items.join(". ")}
    >
      <div
        className="th-marquee flex w-max items-center gap-8 whitespace-nowrap will-change-transform"
        style={{ ["--marquee-duration" as string]: "38s" }}
        aria-hidden="true"
      >
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="th-display-tight text-[15px] text-foreground">
              {item}
            </span>
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--bolt)]"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  )
}
