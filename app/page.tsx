import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Lightbulb, Trophy, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Join ThunderHacks?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience an unforgettable weekend of innovation, learning, and networking 
              with fellow tech enthusiasts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Code,
                title: "Build & Create",
                description: "Turn your ideas into reality with 24 hours of focused development time.",
              },
              {
                icon: Users,
                title: "Collaborate",
                description: "Work with talented peers and form lasting connections in the tech community.",
              },
              {
                icon: Lightbulb,
                title: "Learn & Grow",
                description: "Attend workshops, get mentorship, and expand your technical skills.",
              },
              {
                icon: Trophy,
                title: "Win Prizes",
                description: "Compete for up to $1,250 in prizes across multiple categories.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Hack?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sign in with your @algomau.ca email to register and join a team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/30"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/80 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
