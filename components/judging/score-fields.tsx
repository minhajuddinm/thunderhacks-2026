"use client"

import { useState } from "react"
import type { Criterion } from "@/lib/judging"

/**
 * A slider and a number box for each line, kept in step, with the running
 * total underneath. The slider is there because judging happens on a phone in
 * a noisy room.
 */
export function ScoreFields({ streamKey, criteria }: { streamKey: string; criteria: Criterion[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(criteria.map((c) => [c.key, ""]))
  )

  const max = criteria.reduce((sum, c) => sum + c.max, 0)
  const total = criteria.reduce((sum, c) => sum + (Number(values[c.key]) || 0), 0)
  const answered = criteria.every((c) => values[c.key] !== "")

  const set = (key: string, v: string) => setValues((old) => ({ ...old, [key]: v }))

  return (
    <div className="space-y-5">
      {criteria.map((c) => {
        const id = `${streamKey}_${c.key}`
        const v = values[c.key]
        return (
          <div key={c.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label htmlFor={id} className="text-[15px] text-foreground">
                {c.label}
              </label>
              <span className="text-sm text-muted-foreground">
                <span className="th-display text-lg text-foreground">{v === "" ? "–" : v}</span>
                {" / "}
                {c.max}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={c.max}
                step={1}
                value={v === "" ? 0 : Number(v)}
                onChange={(e) => set(c.key, e.target.value)}
                aria-label={`${c.label} slider`}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--raised)] accent-[var(--bolt)]"
              />
              <input
                id={id}
                name={`score_${c.key}`}
                type="number"
                min={0}
                max={c.max}
                step={1}
                required
                inputMode="numeric"
                value={v}
                onChange={(e) => set(c.key, e.target.value)}
                className="w-20 shrink-0 rounded-md border border-[var(--rule)] bg-[var(--raised)] px-3 py-2 text-center text-[15px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
              />
            </div>
          </div>
        )
      })}

      <div className="flex items-baseline justify-between border-t border-[var(--rule)] pt-4">
        <span className="text-[15px] text-muted-foreground">
          {answered ? "Total" : "Score every line"}
        </span>
        <span className="th-display text-2xl text-[var(--bolt)]">
          {total} <span className="text-base text-muted-foreground">/ {max}</span>
        </span>
      </div>
    </div>
  )
}
