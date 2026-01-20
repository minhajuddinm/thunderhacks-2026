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
  Car,
  HelpCircle,
  ArrowRight,
} from "lucide-react"

export const metadata = {
  title: "Event Details | Thunder Hacks 2025",
  description: "Everything you need to know about Thunder Hacks 2025 - schedule, venue, and FAQs.",
}

const schedule = [
  {
    day: "Day 1 - Saturday, March 15",
    events: [
      { time: "8:00 AM", event: "Doors Open", desc: "Venue opens for participants" },
      { time: "9:00 AM", event: "Registration & Check-in", desc: "Get your badge and swag" },
      { time: "10:00 AM", event: "Opening Ceremony & Hacking Begins!", desc: "Welcome, rules overview, and start building" },
      { time: "12:00 PM", event: "Lunch", desc: "Fuel up for the journey ahead" },
      { time: "2:00 PM", event: "Workshop: Intro to AI", desc: "Learn AI basics with experts" },
      { time: "4:00 PM", event: "Workshop: UI/UX Design", desc: "Design tips for your project" },
      { time: "6:00 PM", event: "Dinner", desc: "Take a break and recharge" },
      { time: "8:00 PM", event: "Mini Games", desc: "Fun activities and networking" },
      { time: "10:00 PM", event: "Day 1 Ends", desc: "Venue closes - resume tomorrow!" },
    ],
  },
  {
    day: "Day 2 - Sunday, March 16",
    events: [
      { time: "8:00 AM", event: "Doors Open & Breakfast", desc: "Continue hacking!" },
      { time: "12:00 PM", event: "Lunch & Hacking Ends", desc: "Code freeze!" },
      { time: "12:30 PM", event: "Project Submissions", desc: "Submit your project" },
      { time: "1:00 PM", event: "Presentations", desc: "Demo your project to judges" },
      { time: "3:00 PM", event: "Deliberation Break", desc: "Judges evaluate projects" },
      { time: "4:00 PM", event: "Awards Ceremony", desc: "Winners announced!" },
      { time: "5:00 PM", event: "Closing & Networking", desc: "Thank you and goodbye" },
      { time: "10:00 PM", event: "Venue Closes", desc: "End of Thunder Hacks 2025" },
    ],
  },
]

const faqs = [
  {
    q: "Who can participate?",
    a: "Thunder Hacks is open to all university students. You don't need to be a computer science major - we welcome students from all disciplines!",
  },
  {
    q: "Do I need a team?",
    a: "You can participate solo or in a team of up to 4 members. Don't have a team? Register as an individual and find teammates on our Teams page!",
  },
  {
    q: "What should I bring?",
    a: "Bring your laptop, charger, any hardware you want to use, and a positive attitude! We'll provide food, drinks, and workspace.",
  },
  {
    q: "Is there a cost to participate?",
    a: "Thunder Hacks is completely free! We provide meals, snacks, and swag at no cost to participants.",
  },
  {
    q: "What can I build?",
    a: "Anything! Web apps, mobile apps, hardware projects, AI/ML solutions - the sky's the limit. Projects must be started during the hackathon.",
  },
  {
    q: "Will there be WiFi?",
    a: "Yes! High-speed WiFi will be available throughout the venue.",
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
              Everything you need to know about Thunder Hacks 2025.
              Mark your calendar and get ready for an amazing experience!
            </p>
          </div>

          {/* Event Info Cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <Calendar className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Date</h3>
                <p className="text-muted-foreground">March 15-16, 2025</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Wifi, label: "High-Speed WiFi" },
                { icon: Utensils, label: "Free Meals" },
                { icon: Car, label: "Free Parking" },
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

          {/* FAQs */}
          <section className="mb-16">
            <div className="flex items-center justify-center gap-3 mb-8">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq) => (
                <Card key={faq.q} className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-foreground">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{faq.a}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-12 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Join?</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Registration is open! Secure your spot at Thunder Hacks 2025 today.
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
