"use client"

import { useEffect, useRef, useState } from "react"

/**
 * The link between the two campuses, drawn as a bolt rather than a line. It
 * draws itself in when the band arrives, then re-strikes every few seconds.
 * Under reduced motion it renders once, static.
 */
export function LightningLink({
  vertical = true,
}: {
  vertical?: boolean
}) {
  const [path, setPath] = useState("")
  const [flash, setFlash] = useState(0)
  const reduceRef = useRef(false)

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const make = () => {
      const segs = 9
      const pts: string[] = []
      for (let i = 0; i <= segs; i++) {
        const t = i / segs
        const along = t * 100
        const off = i === 0 || i === segs ? 50 : 50 + (Math.random() - 0.5) * 34
        pts.push(vertical ? `${off},${along}` : `${along},${off}`)
      }
      setPath("M" + pts.join(" L"))
    }

    make()
    if (reduceRef.current) return

    const id = setInterval(() => {
      make()
      setFlash((f) => f + 1)
    }, 4200)
    return () => clearInterval(id)
  }, [vertical])

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <linearGradient
          id="th-bolt-grad"
          x1="0"
          y1="0"
          x2={vertical ? "0" : "1"}
          y2={vertical ? "1" : "0"}
        >
          <stop offset="0%" stopColor="#8B3BFF" />
          <stop offset="100%" stopColor="#FFE500" />
        </linearGradient>
      </defs>
      {path ? (
        <path
          key={flash}
          d={path}
          fill="none"
          stroke="url(#th-bolt-grad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="th-bolt-draw"
        />
      ) : null}
    </svg>
  )
}
