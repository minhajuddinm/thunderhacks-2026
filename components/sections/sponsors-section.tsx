import type { ReactNode } from "react"
import { Section } from "@/components/section"
import { SPONSORS, type Sponsor } from "@/lib/content"

/**
 * Sponsor marks are shown as supplied. Reverse assets sit straight on the dark
 * page; the standard positive logos get a white plate, because they are navy
 * and near-black and would otherwise disappear. Recolouring a sponsor's mark to
 * suit our background is not something we do.
 */
function LogoSlot({ sponsor, tall }: { sponsor: Sponsor; tall?: boolean }) {
  const h = tall ? "h-24 sm:h-28" : "h-14 sm:h-16"

  if (!sponsor.logo) {
    return (
      <div
        className={`flex ${h} w-full ${
          tall ? "max-w-sm" : "max-w-[240px]"
        } items-center justify-center rounded border border-dashed border-[var(--rule)] text-sm text-muted-foreground`}
      >
        Logo to come
      </div>
    )
  }

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sponsor.logo}
      alt={`${sponsor.name} logo`}
      className={`${h} w-auto max-w-full object-contain`}
      loading="lazy"
      decoding="async"
    />
  )

  if (sponsor.onDark) return img

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-white ${
        tall ? "px-7 py-5" : "px-5 py-4"
      }`}
    >
      {img}
    </div>
  )
}

/**
 * The whole card is the link, so the click target is the full tile rather than
 * just the logo. It lifts on hover and on keyboard focus, and the lift is
 * dropped for anyone who asks for reduced motion. Opens in a new tab, since
 * leaving the page mid-registration is not what a reader wants.
 */
function SponsorCard({
  sponsor,
  className,
  children,
}: {
  sponsor: Sponsor
  className: string
  children: ReactNode
}) {
  const shared =
    "block transition duration-200 ease-out motion-reduce:transition-none " +
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--bolt)]"

  if (!sponsor.url) {
    return <div className={className}>{children}</div>
  }

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} ${shared} hover:-translate-y-1 hover:border-[var(--bolt)] hover:shadow-lg hover:shadow-black/40 focus-visible:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0`}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

export function SponsorsSection() {
  const gold = SPONSORS.filter((s) => s.tier === "Gold")
  const silver = SPONSORS.filter((s) => s.tier === "Silver")
  const bronze = SPONSORS.filter((s) => s.tier === "Bronze")

  return (
    <Section
      id="sponsors"
      tone="raised"
      title="Sponsors"
      lead="ThunderHacks II runs because these organisations pay for it."
    >
      {gold.map((sponsor) => (
        <SponsorCard
          key={sponsor.name}
          sponsor={sponsor}
          className="relative mx-auto max-w-3xl border border-[var(--rule)] bg-background p-8 text-center sm:p-12"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--bolt)]"
          />
          <span className="block text-sm text-[var(--bolt)]">
            {sponsor.tierLabel}
          </span>
          <h3 className="th-display mt-2 text-[clamp(1.75rem,5vw,2.5rem)] text-foreground">
            {sponsor.name}
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {sponsor.blurb}
          </p>
          <span className="mt-8 flex justify-center">
            <LogoSlot sponsor={sponsor} tall />
          </span>
        </SponsorCard>
      ))}

      {silver.map((sponsor) => (
        <SponsorCard
          key={sponsor.name}
          sponsor={sponsor}
          className="mx-auto mt-8 max-w-2xl border border-[var(--rule)] p-8 text-center"
        >
          <span className="block text-sm text-muted-foreground">
            {sponsor.tierLabel}
          </span>
          <h3 className="th-display mt-2 text-[clamp(1.4rem,3.6vw,2rem)] text-foreground">
            {sponsor.name}
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {sponsor.blurb}
          </p>
          <span className="mt-7 flex justify-center">
            <LogoSlot sponsor={sponsor} />
          </span>
        </SponsorCard>
      ))}

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
        {bronze.map((sponsor) => (
          <SponsorCard
            key={sponsor.name}
            sponsor={sponsor}
            className="border border-[var(--rule)] p-7 text-center"
          >
            <span className="block text-sm text-muted-foreground">
              {sponsor.tierLabel}
            </span>
            <h3 className="th-display-tight mt-2 text-xl text-foreground">
              {sponsor.name}
            </h3>
            <span className="mt-6 flex justify-center">
              <LogoSlot sponsor={sponsor} />
            </span>
          </SponsorCard>
        ))}
      </div>
    </Section>
  )
}
