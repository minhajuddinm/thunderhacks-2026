import { Section } from "@/components/section"
import { SPONSORS, type Sponsor } from "@/lib/content"

/**
 * Logos are not in yet. Each sponsor renders a slot at the size its logo will
 * occupy, so nothing moves when the files land in /public/images/sponsors and
 * the logo path is set in content.ts.
 */
function LogoSlot({ sponsor, tall }: { sponsor: Sponsor; tall?: boolean }) {
  if (sponsor.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className={`${tall ? "max-h-28" : "max-h-16"} w-auto object-contain`}
      />
    )
  }
  return (
    <div
      className={`flex ${
        tall ? "h-28" : "h-16"
      } w-full ${tall ? "max-w-sm" : "max-w-[240px]"} items-center justify-center rounded border border-dashed border-[var(--rule)] text-sm text-muted-foreground`}
    >
      Logo to come
    </div>
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
        <div
          key={sponsor.name}
          className="relative mx-auto max-w-3xl border border-[var(--rule)] bg-background p-8 text-center sm:p-12"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--bolt)]"
          />
          <p className="text-sm text-[var(--bolt)]">{sponsor.tierLabel}</p>
          <h3 className="th-display mt-2 text-[clamp(1.75rem,5vw,2.5rem)] text-foreground">
            {sponsor.name}
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {sponsor.blurb}
          </p>
          <div className="mt-8 flex justify-center">
            <LogoSlot sponsor={sponsor} tall />
          </div>
        </div>
      ))}

      {silver.map((sponsor) => (
        <div
          key={sponsor.name}
          className="mx-auto mt-8 max-w-2xl border border-[var(--rule)] p-8 text-center"
        >
          <p className="text-sm text-muted-foreground">{sponsor.tierLabel}</p>
          <h3 className="th-display mt-2 text-[clamp(1.4rem,3.6vw,2rem)] text-foreground">
            {sponsor.name}
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {sponsor.blurb}
          </p>
          <div className="mt-7 flex justify-center">
            <LogoSlot sponsor={sponsor} />
          </div>
        </div>
      ))}

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
        {bronze.map((sponsor) => (
          <div
            key={sponsor.name}
            className="border border-[var(--rule)] p-7 text-center"
          >
            <p className="text-sm text-muted-foreground">{sponsor.tierLabel}</p>
            <h3 className="th-display-tight mt-2 text-xl text-foreground">
              {sponsor.name}
            </h3>
            <div className="mt-6 flex justify-center">
              <LogoSlot sponsor={sponsor} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
