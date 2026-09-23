import type { CSSProperties, ReactNode } from "react"
import { Section } from "@/components/section"
import { SPONSORS, type Sponsor } from "@/lib/content"

/**
 * Each tier wears its own metal, on the rule across the top of the card and on
 * the tier label. Chosen against the dark ground rather than by eye: contrast
 * is 11.2:1 for gold, 11.5:1 for silver, 7.2:1 for bronze. The gold is a warm
 * metallic, deliberately not the site's electric yellow, so it reads as a medal
 * instead of just the house accent. In-kind support is not a medal, so it takes
 * a cool teal that sits apart from the three.
 *
 * Applied through a --tier custom property so one set of static utility classes
 * covers all three; Tailwind cannot see class names built at runtime.
 */
const TIER_COLOUR: Record<Sponsor["tier"], string> = {
  Gold: "#F5C542",
  Silver: "#C8CFDA",
  Bronze: "#D89552",
  "In-kind": "#7FC7B8",
}

function tierStyle(sponsor: Sponsor): CSSProperties {
  return { ["--tier" as string]: TIER_COLOUR[sponsor.tier] }
}

function TierBar() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-1 bg-[var(--tier)]"
    />
  )
}

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
  const style = tierStyle(sponsor)
  const shared =
    "block transition duration-200 ease-out motion-reduce:transition-none " +
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--tier)]"

  if (!sponsor.url) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={`${className} ${shared} hover:-translate-y-1 hover:border-[var(--tier)] hover:shadow-lg hover:shadow-black/40 focus-visible:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0`}
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
  const inKind = SPONSORS.filter((s) => s.tier === "In-kind")

  return (
    <Section
      id="sponsors"
      tone="raised"
      title="Sponsors"
      lead="ThunderHacks II runs because these organisations back it, with money, with prizes, and with their people."
    >
      {gold.map((sponsor) => (
        <SponsorCard
          key={sponsor.name}
          sponsor={sponsor}
          className="relative mx-auto max-w-3xl border border-[var(--rule)] bg-background p-8 text-center sm:p-12"
        >
          <TierBar />
          <span className="block text-sm text-[var(--tier)]">
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
          className="relative mx-auto mt-8 max-w-2xl border border-[var(--rule)] p-8 text-center"
        >
          <TierBar />
          <span className="block text-sm text-[var(--tier)]">
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
            className="relative border border-[var(--rule)] p-7 text-center"
          >
            <TierBar />
            <span className="block text-sm text-[var(--tier)]">
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

      {inKind.length > 0 ? (
        <>
          <h3 className="th-display-tight mx-auto mt-14 max-w-3xl text-lg text-foreground">
            In-kind support
          </h3>
          <p className="mx-auto mt-2 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            Backing ThunderHacks II with people, programming and resources instead of cash.
          </p>
          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            {inKind.map((sponsor) => (
              <SponsorCard
                key={sponsor.name}
                sponsor={sponsor}
                className="relative border border-[var(--rule)] p-7 text-center"
              >
                <TierBar />
                <span className="block text-sm text-[var(--tier)]">{sponsor.tierLabel}</span>
                <h3 className="th-display-tight mt-2 text-xl text-foreground">{sponsor.name}</h3>
                <span className="mt-6 flex justify-center">
                  <LogoSlot sponsor={sponsor} />
                </span>
              </SponsorCard>
            ))}
          </div>
        </>
      ) : null}
    </Section>
  )
}
