import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star, Zap, Brain, Palette, Heart } from "lucide-react"

export const metadata = {
  title: "Prizes | Thunder Hacks 2026",
  description: "Up to $1,250 in prizes across multiple categories at Thunder Hacks 2026.",
}

const mainPrizes = [
  {
    place: "1st Place",
    prize: "$750",
    description: "Grand prize for the overall best project",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  {
    place: "2nd Place",
    prize: "$250",
    description: "Runner-up for outstanding innovation",
    icon: Award,
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30",
  },
  {
    place: "3rd Place",
    prize: "$150",
    description: "Third place for exceptional work",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/30",
  },
]

const categoryPrizes = [
  {
    category: "Most Creative",
    prize: "$100",
    description: "For the most creative and original solution to a problem.",
    icon: Brain,
  },
]

export default function PrizesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Up to $1,250 in Prizes
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Prizes & Awards
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compete for amazing prizes across multiple categories. 
              Every great project has a chance to win!
            </p>
          </div>

          {/* Main Prizes */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Main Prizes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mainPrizes.map((prize, index) => (
                <Card
                  key={prize.place}
                  className={`bg-card border-2 ${prize.borderColor} relative overflow-hidden ${
                    index === 0 ? "md:-mt-4 md:scale-105" : ""
                  }`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${prize.bgColor}`} />
                  <CardHeader className="text-center pb-2">
                    <div className={`mx-auto mb-4 p-4 rounded-full ${prize.bgColor}`}>
                      <prize.icon className={`h-10 w-10 ${prize.color}`} />
                    </div>
                    <CardTitle className="text-foreground">{prize.place}</CardTitle>
                    <div className={`text-4xl font-bold ${prize.color}`}>{prize.prize}</div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription>{prize.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Category Prizes */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Category Prizes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {categoryPrizes.map((prize) => (
                <Card key={prize.category} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <prize.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground">{prize.category}</CardTitle>
                          <div className="text-2xl font-bold text-primary">{prize.prize}</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{prize.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Judging Criteria */}
          <section>
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-center">Judging Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  {[
                    { label: "Innovation", value: "25%", desc: "Originality and creativity" },
                    { label: "Technical", value: "25%", desc: "Code quality and complexity" },
                    { label: "Design", value: "25%", desc: "UI/UX and presentation" },
                    { label: "Impact", value: "25%", desc: "Potential real-world value" },
                  ].map((criteria) => (
                    <div key={criteria.label}>
                      <div className="text-3xl font-bold text-primary mb-1">{criteria.value}</div>
                      <div className="font-medium text-foreground">{criteria.label}</div>
                      <div className="text-sm text-muted-foreground">{criteria.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
