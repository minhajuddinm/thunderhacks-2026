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
    <div className={`inline-flex items-center justify-center rounded-lg bg-white ${tall ? "px-7 py-5" : "px-5 py-4"}`}>
      {img}
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
