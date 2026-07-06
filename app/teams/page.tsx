import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TeamCard } from "@/components/team-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTeams, getIndividualsLookingForTeam } from "./actions"
import { Users, User, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Teams | ThunderHacks 2025",
  description: "Browse all registered teams and individuals looking for teams at ThunderHacks 2025.",
}

export const dynamic = "force-dynamic"

export default async function TeamsPage() {
  const [teams, individuals] = await Promise.all([
    getTeams(),
    getIndividualsLookingForTeam(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All Registered Teams
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse all registered teams. Click on a team to see members and request to join if they have spots available.
            </p>
            <Button asChild className="mt-4">
              <Link href="/register">
                Register Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* All Teams Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Teams</h2>
              <Badge variant="secondary">{teams.length} teams</Badge>
            </div>

            {teams.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No teams have registered yet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Be the first to{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      create a team
                    </Link>
                    !
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Individuals Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Individuals Looking for Teams</h2>
              <Badge variant="secondary">{individuals.length} people</Badge>
            </div>

            {individuals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {individuals.map((person) => (
                  <Card key={person.id} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-foreground">{person.full_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{person.school}</p>
                      {person.skills && (
                        <div className="flex flex-wrap gap-1">
                          {person.skills.split(",").slice(0, 3).map((skill: string) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs border-border text-muted-foreground"
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="py-12 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No individuals are currently looking for teams.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Looking for a team?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Register as an individual
                    </Link>
                    !
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
