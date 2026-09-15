import { EVENT } from "@/lib/content"

/**
 * The organising idea of the site: one competition in two places. Brampton is
 * marked in purple, Sault Ste. Marie in yellow, and those two colours are
 * reused everywhere else to mean the same thing.
 */
export function CampusesSection() {
  return (
    <section
      id="campuses"
      className="border-b border-[var(--rule)]"
      aria-label="Campuses"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
        {EVENT.campuses.map((campus, i) => (
          <div
            key={campus.key}
            className={[
              "relative px-5 py-12 sm:px-8 sm:py-16",
              i === 0
                ? "border-b border-[var(--rule)] md:border-b-0 md:border-r"
                : "",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1"
              style={{
                background:
                  campus.key === "brampton"
                    ? "var(--brampton)"
                    : "var(--sault)",
              }}
            />
            <p className="text-sm text-muted-foreground">{campus.region}</p>
            <h3 className="th-display mt-2 text-2xl text-foreground sm:text-3xl">
              {campus.full}
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {campus.blurb}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
