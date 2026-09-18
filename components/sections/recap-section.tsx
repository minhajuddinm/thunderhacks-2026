/* eslint-disable @next/next/no-img-element */
import { Section } from "@/components/section"
import { RECAP, RECAP_PHOTOS } from "@/lib/content"

export function RecapSection() {
  const wide = RECAP_PHOTOS.find((p) => p.wide)
  const rest = RECAP_PHOTOS.filter((p) => !p.wide)

  return (
    <Section id="recap" title={RECAP.heading} lead={RECAP.intro}>
      <p className="th-display-tight text-lg text-foreground">
        {RECAP.subheading}
      </p>

      {/* Photos from the first edition. The group shot keeps its own wide row
          so nobody gets cropped out of the edges. */}
      <div className="mt-8 space-y-4">
        {wide ? (
          <img
            src={wide.src}
            alt={wide.alt}
            className="aspect-[16/9] w-full rounded object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {rest.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className="aspect-[4/3] w-full rounded object-cover"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-4">
        {RECAP.stats.map((stat) => (
          <li key={stat.label} className="bg-background px-5 py-6">
            <div className="th-display text-3xl text-foreground sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
          </li>
        ))}
      </ul>

      <h3 className="th-display-tight mt-12 text-lg text-foreground">Who won</h3>
      <ol className="mt-4 max-w-2xl">
        {RECAP.winners.map((winner) => (
          <li
            key={winner.place}
            className="flex flex-col gap-1 border-t border-[var(--rule)] py-4 sm:flex-row sm:gap-8"
          >
            <span className="th-display w-12 shrink-0 text-lg text-[var(--bolt)]">
              {winner.place}
            </span>
            <span className="text-[15px] text-muted-foreground">
              {winner.members.join(", ")}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-[15px] text-muted-foreground">
        Backed the first time by {RECAP.pastSponsors.join(", ")}.
      </p>
    </Section>
  )
}
