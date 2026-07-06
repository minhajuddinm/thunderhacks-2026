import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { Card3D } from "@/components/ui/card-3d"
import { PRIZES } from "@/lib/content"
import { Trophy, Medal, Award, Target } from "lucide-react"

const MAIN_META = [
  { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/40" },
  { icon: Medal, color: "text-slate-300", bg: "bg-slate-300/10", border: "border-slate-300/40" },
  { icon: Award, color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/40" },
]

export function PrizesSection() {
  return (
    <section id="prizes" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            {PRIZES.poolLabel}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Prizes & Awards</h2>
          <p className="text-lg text-muted-foreground">
            One unified competition, judged across both campuses. Compete for the overall pool and
            for sponsor-backed track prizes.
          </p>
        </Reveal>

        {/* Main prize pool */}
        <h3 className="mb-8 text-center text-xl font-semibold text-foreground">
          Main Prize Pool (Overall Track)
        </h3>
        <RevealGroup className="mb-16 grid gap-6 md:grid-cols-3">
          {PRIZES.main.map((prize, i) => {
            const meta = MAIN_META[i]
            const Icon = meta.icon
            return (
              <RevealItem key={prize.place}>
                <Card3D className="h-full">
                  <Card
                    className={`relative h-full overflow-hidden border-2 bg-card ${meta.border} ${
                      i === 0 ? "md:-mt-3" : ""
                    }`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 ${meta.bg}`} />
                    <CardContent className="p-8 text-center">
                      <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${meta.bg}`}>
                        <Icon className={`h-8 w-8 ${meta.color}`} />
                      </div>
                      <div className="mb-1 font-semibold text-foreground">{prize.place}</div>
                      <div className={`mb-3 text-4xl font-black ${meta.color}`}>{prize.amount}</div>
                      <p className="text-sm text-muted-foreground">{prize.description}</p>
                    </CardContent>
                  </Card>
                </Card3D>
              </RevealItem>
            )
          })}
        </RevealGroup>

        {/* Sponsor track prizes */}
        <h3 className="mb-8 text-center text-xl font-semibold text-foreground">
          Sponsor Track Prizes
        </h3>
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {PRIZES.sponsorTrack.map((prize) => (
            <RevealItem key={prize.tier}>
              <Card className="h-full border-border bg-card transition-colors hover:border-primary/50">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h4 className="font-semibold text-foreground">{prize.tier}</h4>
                      <span className="text-xl font-black text-primary">{prize.amount}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{prize.description}</p>
                  </div>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-center text-sm text-muted-foreground">{PRIZES.poolLabel}.</p>
      </div>
    </section>
  )
}
