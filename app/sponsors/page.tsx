import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { PageHeader, Section } from "@/components/section"
import { SponsorsSection } from "@/components/sections/sponsors-section"
import { Footer } from "@/components/footer"
import { SPONSOR_TIERS, SPONSOR_NOTE, CONTACT } from "@/lib/content"

export const metadata: Metadata = {
  title: "Sponsors | ThunderHacks II",
  description:
    "ThunderHacks II is powered by OLG, with Canadian Bank Note, Pollard Banknote and Gateway Casinos. Sponsorship packages from $1,000.",
}

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main">
        <PageHeader
          title="Sponsors"
          lead="ThunderHacks II reaches computer science students across the GTA and Northern Ontario at once."
        />
        <SponsorsSection />

        <Section
          id="packages"
          title="Packages"
          lead={SPONSOR_NOTE}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SPONSOR_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={[
                  "relative border p-7",
                  tier.featured
                    ? "border-[var(--bolt)] bg-[var(--raised)]"
                    : "border-[var(--rule)]",
                ].join(" ")}
              >
                {tier.highlight ? (
                  <p className="text-sm text-[var(--bolt)]">{tier.highlight}</p>
                ) : null}
                <h3 className="th-display mt-1 text-2xl text-foreground">
                  {tier.name}
                </h3>
                <p className="th-display mt-2 text-3xl text-foreground">
                  {tier.price}
                </p>
                {tier.inherits ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {tier.inherits}
                  </p>
                ) : null}
                <ul className="mt-4 space-y-2.5">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-2.5 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--bolt)]"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[17px] text-foreground">
            To sponsor, write to{" "}
            <a
              className="text-[var(--bolt)] underline underline-offset-4"
              href={`mailto:${CONTACT.email}`}
            >
              {CONTACT.email}
            </a>
            .
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
