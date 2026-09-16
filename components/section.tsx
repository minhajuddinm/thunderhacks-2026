import type { CSSProperties, ReactNode } from "react"
import { FadeIn } from "@/components/motion/fade-in"

/**
 * Bands come in three tones so the page has rhythm instead of one flat slab of
 * dark from top to bottom. Tone is applied by overriding the colour tokens on
 * the section itself, so everything inside keeps using the same class names.
 */
export type Tone = "dark" | "raised" | "bolt"

const TONES: Record<Tone, { style: CSSProperties; className: string }> = {
  dark: { style: {}, className: "bg-background" },
  raised: {
    style: { "--rule": "#272d40" } as CSSProperties,
    className: "bg-[#12161f]",
  },
  bolt: {
    /*
     * Tailwind's theme is declared `inline`, so utilities emit
     * `color: var(--foreground)` directly. Overriding --foreground and
     * --muted-foreground here is what actually re-tones everything inside.
     */
    style: {
      "--foreground": "#0A0D13",
      "--muted-foreground": "#3A3222",
      "--background": "#FFE500",
      "--rule": "rgba(10,13,19,0.22)",
      "--bolt": "#4B1D9E",
      "--raised": "rgba(10,13,19,0.06)",
    } as CSSProperties,
    className: "bg-[#FFE500]",
  },
}

export function Section({
  id,
  title,
  lead,
  children,
  tone = "dark",
  className = "",
}: {
  id?: string
  title: string
  lead?: string
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  const t = TONES[tone]
  return (
    <section
      id={id}
      style={t.style}
      className={`scroll-mt-16 border-b border-[var(--rule)] py-20 sm:py-28 ${t.className} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="th-rule mb-6 w-16" aria-hidden="true" />
        <h2 className="th-display text-[clamp(1.75rem,5vw,2.75rem)] text-foreground">
          {title}
        </h2>
        {lead ? (
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            {lead}
          </p>
        ) : null}
        <div className="mt-12">
          <FadeIn>{children}</FadeIn>
        </div>
      </div>
    </section>
  )
}
