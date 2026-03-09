import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Clock,
  Wifi,
  Utensils,
  HelpCircle,
  ArrowRight,
} from "lucide-react"

const faqs = [
  {
    q: "What is ThunderHacks?",
    a: "ThunderHacks is a 2-day hackathon where participants come together to build innovative projects.",
  },
  {
    q: "Who can participate?",
    a: "ThunderHacks is open to students, developers, and anyone interested in technology.",
  },
  {
    q: "Do I need to know how to code?",
    a: "While coding skills are helpful, beginners are welcome. We offer workshops to get you started.",
  },
]

export const metadata = {
  title: "Event Details | ThunderHacks 2026",
  description: "Everything you need to know about ThunderHacks 2026 - schedule, venue, and FAQs.",
}

const schedule = [
  {
    day: "Day 1 - Saturday, March 14",
    events: [
      { time: "11:00 AM", event: "Opening Ceremony", desc: "Welcome and event kickoff" },
      { time: "1:00 PM", event: "Lunch", desc: "Fuel up for the journey ahead" },
      { time: "3:00 PM", event: "Gaming Tournament", desc: "Compete in our gaming tournament" },
      { time: "5:00 PM", event: "Dinner", desc: "Take a break and recharge" },
    ],
  },
  {
    day: "Day 2 - Sunday, March 15",
    events: [
      { time: "11:00 AM", event: "Breakfast", desc: "Morning fuel and continue hacking" },
      { time: "12:00 PM", event: "Project Submission", desc: "Code freeze - submit your project!" },
      { time: "1:00 PM", event: "Presentations", desc: "Demo your project to judges" },
      { time: "3:00 PM", event: "Closing Ceremony & Lunch", desc: "Winners announced and farewell" },
    ],
  },
]

export default function EventPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              2-Day Hackathon
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Event Details
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about ThunderHacks 2026.
              Mark your calendar and get ready for an amazing experience!
            </p>
          </div>

          {/* Event Info Cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <Calendar className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Date</h3>
                <p className="text-muted-foreground">March 14-15, 2026</p>
                <p className="text-sm text-muted-foreground">Saturday - Sunday</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Venue</h3>
                <p className="text-muted-foreground">Algoma University</p>
                <p className="text-sm text-muted-foreground">24 Queen St E, Brampton, ON</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                <p className="text-muted-foreground">8 AM - 10 PM</p>
                <p className="text-sm text-muted-foreground">Both days (no overnight)</p>
              </CardContent>
            </Card>
          </div>

          {/* Amenities */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">What We Provide</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {[
                { icon: Wifi, label: "High-Speed WiFi" },
                { icon: Utensils, label: "Free Meals" },
              ].map((item) => (
                <Card key={item.label} className="bg-card/50 border-border">
                  <CardContent className="pt-6 text-center">
                    <item.icon className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Schedule */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Schedule</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {schedule.map((day) => (
                <Card key={day.day} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">{day.day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.events.map((event) => (
                        <div key={event.time + event.event} className="flex gap-4">
                          <div className="text-sm font-mono text-primary w-20 shrink-0">
                            {event.time}
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

          {/* FAQ Link */}
          <section className="mb-16">
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center">
                <HelpCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Have Questions?</h2>
                <p className="text-muted-foreground mb-4">
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
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-12 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Join?</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Registration is open! Secure your spot at ThunderHacks 2026 today.
                </p>
                <Button asChild size="lg">
                  <Link href="/register">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
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
