import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EVENT } from "@/lib/content"
import {
  Calendar,
  MapPin,
  Clock,
  Wifi,
  Utensils,
  Car,
  HelpCircle,
  ArrowRight,
  Users,
} from "lucide-react"

export const metadata = {
  title: "Event Details | ThunderHacks II | Fall 2026",
  description:
    "Everything you need to know about ThunderHacks II. October 14-16, 2026, running 9:00 AM to 8:00 PM daily across the Brampton and Sault Ste. Marie campuses.",
}

const schedule = [
  {
    day: "Day 1, Wednesday, October 14",
    events: [
      { phase: "Morning", event: "Check-in & Opening Ceremony", desc: "Welcome and kickoff, broadcast to both campuses" },
      { phase: "Midday", event: "Hacking Begins", desc: "Teams form and start building" },
      { phase: "Afternoon", event: "Sponsor Problem Statements", desc: "Dive into sponsored challenge tracks" },
      { phase: "Evening", event: "Day 1 Wraps at 8:00 PM", desc: "Daytime format, no overnight stay" },
    ],
  },
  {
    day: "Day 2, Thursday, October 15",
    events: [
      { phase: "Morning", event: "Doors Open & Building Continues", desc: "Pick up where you left off" },
      { phase: "Midday", event: "Workshops & Tech Talks", desc: "In person at one campus, streamed to the other" },
      { phase: "Afternoon", event: "Mentorship & Office Hours", desc: "Get unstuck with help from mentors" },
      { phase: "Evening", event: "Day 2 Wraps at 8:00 PM", desc: "Rest up for the final push" },
    ],
  },
  {
    day: "Day 3, Friday, October 16",
    events: [
      { phase: "Morning", event: "Final Build & Code Freeze", desc: "Last hours to polish and submit" },
      { phase: "Midday", event: "Project Submissions", desc: "Submit before the deadline" },
      { phase: "Afternoon", event: "Combined Judging", desc: "One unified competition with virtual coordination" },
      { phase: "Evening", event: "Closing Ceremony & Awards", desc: "Winners announced across both campuses" },
    ],
  },
]

export default function EventPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              3-Day Hackathon
            </Badge>
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Event Details
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {EVENT.tagline} Everything you need to know about ThunderHacks II.
            </p>
          </div>

          {/* Info cards */}
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <Calendar className="mx-auto mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-1 font-semibold text-foreground">Dates</h3>
                <p className="text-muted-foreground">{EVENT.datesLabel}</p>
                <p className="text-sm text-muted-foreground">Wednesday to Friday</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <MapPin className="mx-auto mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-1 font-semibold text-foreground">Two Campuses</h3>
                <p className="text-muted-foreground">Brampton (GTA)</p>
                <p className="text-sm text-muted-foreground">Sault Ste. Marie (Northern Ontario)</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <Clock className="mx-auto mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-1 font-semibold text-foreground">Hours</h3>
                <p className="text-muted-foreground">9:00 AM to 8:00 PM</p>
                <p className="text-sm text-muted-foreground">Daily, no overnight stay</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <Users className="mx-auto mb-3 h-10 w-10 text-primary" />
                <h3 className="mb-1 font-semibold text-foreground">Who Can Join</h3>
                <p className="text-muted-foreground">Algoma students, both campuses</p>
                <p className="text-sm text-muted-foreground">Plus Sault College at the SSM campus</p>
              </CardContent>
            </Card>
          </div>

          {/* Amenities */}
          <section className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">What We Provide</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                { icon: Wifi, label: "High-Speed WiFi" },
                { icon: Utensils, label: "Meals & Snacks" },
                { icon: Car, label: "On-Campus Facilities" },
              ].map((item) => (
                <Card key={item.label} className="border-border bg-card/50">
                  <CardContent className="pt-6 text-center">
                    <item.icon className="mx-auto mb-2 h-8 w-8 text-accent" />
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Schedule */}
          <section className="mb-16">
            <h2 className="mb-3 text-center text-2xl font-bold text-foreground">Schedule at a Glance</h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground">
              A high-level look at the three days. The detailed hour-by-hour schedule will be
              published closer to the event.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {schedule.map((day) => (
                <Card key={day.day} className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base text-foreground">{day.day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.events.map((event) => (
                        <div key={event.phase + event.event} className="flex gap-4">
                          <div className="w-20 shrink-0 font-mono text-sm text-primary">
                            {event.phase}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{event.event}</div>
                            <div className="text-sm text-muted-foreground">{event.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ link */}
          <section className="mb-16">
            <Card className="border-border bg-card">
              <CardContent className="py-8 text-center">
                <HelpCircle className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h2 className="mb-2 text-xl font-bold text-foreground">Have Questions?</h2>
                <p className="mb-4 text-muted-foreground">
                  Check out our FAQ page for answers to common questions.
                </p>
                <Button asChild variant="outline">
                  <Link href="/faq">
                    View FAQ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-12 text-center">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to Join?</h2>
                <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                  Secure your spot at ThunderHacks II. Registration opens on Devpost.
                </p>
                <Button asChild size="lg">
                  <a href={EVENT.registerUrl} target="_blank" rel="noopener noreferrer">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
