import { Section } from "@/components/section"
import { SPONSORS, type Sponsor } from "@/lib/content"

/**
 * Logos are not in yet. Rather than hide the gap, each sponsor renders a
 * labelled slot at the size its logo will occupy, so the layout does not move
 * when the files land in /public/images/sponsors.
 */
function LogoSlot({ sponsor, tall }: { sponsor: Sponsor; tall?: boolean }) {
  if (sponsor.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className={`${tall ? "max-h-24" : "max-h-14"} w-auto object-contain`}
      />
    )
  }
  return (
    <div
      className={`flex ${
        tall ? "h-24" : "h-14"
      } w-full max-w-[220px] items-center justify-center rounded border border-dashed border-[var(--rule)] text-sm text-muted-foreground`}
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
      title="Sponsors"
      lead="ThunderHacks II runs because these organisations pay for it."
    >
      {gold.map((sponsor) => (
        <div
          key={sponsor.name}
          className="relative border border-[var(--rule)] bg-[var(--raised)] p-8 sm:p-10"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--bolt)]"
          />
          <p className="text-sm text-[var(--bolt)]">{sponsor.tierLabel}</p>
          <h3 className="th-display mt-2 text-3xl text-foreground sm:text-4xl">
            {sponsor.name}
          </h3>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {sponsor.blurb}
          </p>
          <div className="mt-7">
            <LogoSlot sponsor={sponsor} tall />
          </div>
        </div>
      ))}

      {silver.map((sponsor) => (
        <div
          key={sponsor.name}
          className="mt-6 border border-[var(--rule)] p-8"
        >
          <p className="text-sm text-muted-foreground">{sponsor.tierLabel}</p>
          <h3 className="th-display mt-2 text-2xl text-foreground sm:text-3xl">
            {sponsor.name}
          </h3>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {sponsor.blurb}
          </p>
          <div className="mt-6">
            <LogoSlot sponsor={sponsor} />
          </div>
        </div>
      ))}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {bronze.map((sponsor) => (
          <div key={sponsor.name} className="border border-[var(--rule)] p-7">
            <p className="text-sm text-muted-foreground">
              {sponsor.tierLabel}
            </p>
            <h3 className="th-display-tight mt-2 text-xl text-foreground">
              {sponsor.name}
            </h3>
            <div className="mt-5">
              <LogoSlot sponsor={sponsor} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
