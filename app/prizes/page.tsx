import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PrizesSection } from "@/components/sections/prizes-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Prizes | ThunderHacks II | Fall 2026",
  description:
    "ThunderHacks II offers $3,000 in main prizes plus additional sponsor track prizes across a unified two-campus competition.",
}

export default function PrizesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        <PrizesSection />

        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-center text-foreground">Judging Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Innovation", value: "25%", desc: "Originality and creativity" },
                    { label: "Technical", value: "25%", desc: "Code quality and complexity" },
                    { label: "Design", value: "25%", desc: "UI/UX and presentation" },
                    { label: "Impact", value: "25%", desc: "Potential real-world value" },
                  ].map((criteria) => (
                    <div key={criteria.label}>
                      <div className="mb-1 text-3xl font-bold text-primary">{criteria.value}</div>
                      <div className="font-medium text-foreground">{criteria.label}</div>
                      <div className="text-sm text-muted-foreground">{criteria.desc}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Judging is combined across both campuses into one unified competition, with virtual
                  coordination on the final day.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
