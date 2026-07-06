import { Card, CardContent } from "@/components/ui/card"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { ABOUT } from "@/lib/content"
import { MapPin, CalendarClock, Users, Scale } from "lucide-react"

const ICONS = [MapPin, CalendarClock, Users, Scale]

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">{ABOUT.heading}</h2>
          <p className="text-lg text-muted-foreground">{ABOUT.intro}</p>
        </Reveal>

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {ABOUT.blocks.map((block, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <RevealItem key={block.title}>
                <Card className="h-full border-border bg-card transition-colors hover:border-primary/50">
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-foreground">{block.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{block.body}</p>
                    </div>
                  </CardContent>
                </Card>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
