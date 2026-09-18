import type { ReactNode } from "react"

export function Panel({
  title,
  lead,
  children,
  className = "",
}: {
  title: string
  lead?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`border border-[var(--rule)] bg-[var(--raised)] p-6 sm:p-7 ${className}`}>
      <h2 className="th-display text-xl text-foreground sm:text-2xl">{title}</h2>
      {lead ? (
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{lead}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded border border-dashed border-[var(--rule)] px-4 py-6 text-center text-[15px] text-muted-foreground">
      {children}
    </p>
  )
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-md bg-[var(--bolt)] px-4 py-2 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
    >
      {children}
    </button>
  )
}

export function QuietButton({
  children,
  danger = false,
}: {
  children: ReactNode
  danger?: boolean
}) {
  return (
    <button
      type="submit"
      className={`rounded-md border px-4 py-2 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)] ${
        danger
          ? "border-[#7f1d1d] text-[#fca5a5] hover:border-[#b91c1c]"
          : "border-[var(--rule)] text-foreground hover:border-[var(--bolt)]"
      }`}
    >
      {children}
    </button>
  )
}

export function PersonLine({
  name,
  program,
  year,
  school,
  badge,
}: {
  name: string
  program: string
  year: number
  school: string
  badge?: string
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="th-display-tight text-[15px] text-foreground">{name}</span>
        {badge ? (
          <span className="text-xs text-[var(--bolt)]">{badge}</span>
        ) : null}
      </div>
      <div className="text-sm text-muted-foreground">
        {program} · Year {year} · {school}
      </div>
    </div>
  )
}
