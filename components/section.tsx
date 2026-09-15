import type { ReactNode } from "react"

/**
 * Standard band. The heading sits on a two-colour rule that stands for the two
 * campuses, which is the structural device carried through the whole site.
 */
export function Section({
  id,
  title,
  lead,
  children,
  className = "",
}: {
  id?: string
  title: string
  lead?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`border-b border-[var(--rule)] py-16 sm:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="th-rule mb-6 w-16" aria-hidden="true" />
        <h2 className="th-display text-[clamp(1.6rem,4.5vw,2.25rem)] text-foreground">
          {title}
        </h2>
        {lead ? (
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            {lead}
          </p>
        ) : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

export function PageHeader({
  title,
  lead,
}: {
  title: string
  lead?: string
}) {
  return (
    <header className="border-b border-[var(--rule)] pt-28 pb-12 sm:pt-32 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="th-rule mb-6 w-16" aria-hidden="true" />
        <h1 className="th-display text-[clamp(2rem,6.5vw,3.75rem)] text-foreground">
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  )
}
