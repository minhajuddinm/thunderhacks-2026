import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { RECAP } from "@/lib/content"
import { Trophy, Medal, Award } from "lucide-react"

const PLACE_META = [
  { icon: Trophy, color: "text-yellow-400", ring: "border-yellow-400/40", glow: "hover:shadow-yellow-400/20" },
  { icon: Medal, color: "text-slate-300", ring: "border-slate-300/40", glow: "hover:shadow-slate-300/20" },
  { icon: Award, color: "text-amber-600", ring: "border-amber-600/40", glow: "hover:shadow-amber-600/20" },
]

export function RecapSection() {
  const sponsorItems = RECAP.pastSponsors.map((s) => ({
    key: s.name,
    content: (
      <div className="flex h-16 w-56 items-center justify-center rounded-xl border border-border bg-card/70 px-6 backdrop-blur-sm">
        <span className="text-lg font-semibold text-foreground">{s.name}</span>
      </div>
    ),
  }))

  return (
    <section id="recap" className="border-y border-border bg-card/20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            {RECAP.subheading}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">{RECAP.heading}</h2>
          <p className="text-lg text-muted-foreground">{RECAP.intro}</p>
        </Reveal>

        {/* Stats */}
        <RevealGroup className="mx-auto mb-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {RECAP.stats.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="rounded-xl border border-border/50 bg-card/40 p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-black text-[#FFEA00] sm:text-3xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Winners */}
        <h3 className="mb-8 text-center text-xl font-semibold text-foreground">Inaugural Winners</h3>
        <RevealGroup className="mb-16 grid gap-6 md:grid-cols-3">
          {RECAP.winners.map((winner, i) => {
            const meta = PLACE_META[i]
            const Icon = meta.icon
            return (
              <RevealItem key={winner.place}>
                <Card
                  className={`group h-full border-2 bg-card ${meta.ring} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${meta.glow}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background/60">
                      <Icon className={`h-7 w-7 ${meta.color}`} />
                    </div>
                    <div className={`mb-4 text-lg font-bold ${meta.color}`}>{winner.place}</div>
                    <ul className="space-y-1">
                      {winner.members.map((member) => (
                        <li key={member} className="text-sm text-muted-foreground">
                          {member}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </RevealItem>
            )
          })}
        </RevealGroup>

        {/* Past sponsors */}
        <h3 className="mb-8 text-center text-xl font-semibold text-foreground">
          Thanks to Our Inaugural Sponsors
        </h3>
        <InfiniteMovingCards items={sponsorItems} speed="slow" />
      </div>
    </section>
  )
}
