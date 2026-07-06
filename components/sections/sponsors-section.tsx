import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { SPONSOR_TIERS, SPONSOR_NOTE, CONTACT, type SponsorTier } from "@/lib/content"
import { Check, Crown } from "lucide-react"

const TIER_STYLE: Record<string, { accent: string; glow: string; badge: string }> = {
  Bronze: {
    accent: "text-amber-600",
    glow: "hover:shadow-[0_0_40px_-8px_rgba(217,119,6,0.35)]",
    badge: "bg-amber-600/15 text-amber-500",
  },
  Silver: {
    accent: "text-slate-300",
    glow: "hover:shadow-[0_0_40px_-8px_rgba(203,213,225,0.35)]",
    badge: "bg-slate-300/15 text-slate-200",
  },
  Gold: {
    accent: "text-[#FFEA00]",
    glow: "hover:shadow-[0_0_50px_-6px_rgba(255,234,0,0.45)]",
    badge: "bg-[#FFEA00]/15 text-[#FFEA00]",
  },
}

function TierCard({ tier }: { tier: SponsorTier }) {
  const style = TIER_STYLE[tier.name]

  const inner = (
    <Card
      className={`relative flex h-full flex-col overflow-hidden bg-card transition-shadow duration-300 ${
        tier.featured ? "rounded-2xl border-0" : `border-2 border-border ${style.glow}`
      }`}
    >
      {tier.featured && (
        <div className="th-shimmer pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40" />
      )}
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2">
            <h3 className={`text-2xl font-black ${style.accent}`}>{tier.name}</h3>
            {tier.featured && <Crown className="h-5 w-5 text-[#FFEA00]" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{tier.price}</span>
          </div>
          {tier.highlight && (
            <Badge className={`mt-3 ${style.badge}`} variant="secondary">
              {tier.highlight}
            </Badge>
          )}
          {tier.inherits && (
            <p className="mt-3 text-sm font-medium text-muted-foreground">{tier.inherits}</p>
          )}
        </div>

        <ul className="flex-1 space-y-3">
          {tier.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${style.accent}`} />
              <span className="text-sm leading-relaxed text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${CONTACT.email}?subject=ThunderHacks II ${tier.name} Sponsorship`}
          className={`mt-6 inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-colors ${
            tier.featured
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "border border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20"
          }`}
        >
          Become a {tier.name} Sponsor
        </a>
      </CardContent>
    </Card>
  )

  return (
    <RevealItem className="h-full">
      {tier.featured ? (
        <div className="th-beam h-full rounded-2xl p-[2px] lg:-mt-4 lg:mb-4">{inner}</div>
      ) : (
        inner
      )}
    </RevealItem>
  )
}

export function SponsorsSection() {
  return (
    <section id="sponsors" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            Sponsor ThunderHacks II
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Sponsorship Packages</h2>
          <p className="text-lg text-muted-foreground">
            Back the next generation of builders across Northern Ontario and the GTA. Every tier puts
            your brand in front of student talent at both campuses.
          </p>
        </Reveal>

        <RevealGroup className="grid items-stretch gap-6 lg:grid-cols-3" stagger={0.14}>
          {SPONSOR_TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </RevealGroup>

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">{SPONSOR_NOTE}</p>
          <a
            href={`mailto:${CONTACT.email}?subject=ThunderHacks II Custom Sponsorship`}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Talk to the {CONTACT.org} Team
          </a>
        </Reveal>
      </div>
    </section>
  )
}
