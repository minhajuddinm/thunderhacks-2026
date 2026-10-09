"use client"

import { useState, type CSSProperties } from "react"
import type { Criterion } from "@/lib/judging"

/**
 * A slider and a number box for each line, kept in step, with the running
 * total underneath. The slider is there because judging happens on a phone in
 * a noisy room. The track is drawn by .th-range in globals.css, filled from
 * --th-range-pct, because appearance-none removes the native one.
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
    <div className="space-y-6">
      {criteria.map((c) => {
        const id = `${streamKey}_${c.key}`
        const v = values[c.key]
        const n = v === "" ? 0 : Number(v)
        const pct = c.max > 0 ? Math.min(100, Math.max(0, (n / c.max) * 100)) : 0
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
            {c.hint ? (
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{c.hint}</p>
            ) : null}
            <div className="mt-2 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <input
                  type="range"
                  min={0}
                  max={c.max}
                  step={1}
                  value={n}
                  onChange={(e) => set(c.key, e.target.value)}
                  aria-label={`${c.label} slider`}
                  className="th-range"
                  style={{ "--th-range-pct": `${pct}%` } as CSSProperties}
                />
                <div className="th-range-ticks mt-0.5 text-[11px] text-muted-foreground">
                  <span>0</span>
                  <span>{c.max}</span>
                </div>
              </div>
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
                className="w-20 shrink-0 self-start rounded-md border border-[var(--rule)] bg-[var(--raised)] px-3 py-2 text-center text-[15px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
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
