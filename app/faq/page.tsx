import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HelpCircle, Mail, ArrowRight } from "lucide-react"
import { EVENT, CONTACT } from "@/lib/content"

export const metadata = {
  title: "FAQ | ThunderHacks II | Fall 2026",
  description:
    "Frequently asked questions about ThunderHacks II. Dates, campuses, eligibility, teams, prizes, and what to bring.",
}

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is ThunderHacks II?",
        a: "ThunderHacks II is the scaled-up second edition of Algoma University's flagship hackathon. It runs as a three-day daytime competition across two campuses at once: Brampton in the GTA and Sault Ste. Marie in Northern Ontario. The tagline says it best: 3 Days. 2 Campuses. 1 Competition.",
      },
      {
        q: "Who can participate?",
        a: "ThunderHacks II is open to Algoma University students at both the Brampton and Sault Ste. Marie campuses, plus Sault College students at the Sault Ste. Marie campus. You don't need to be a computer science major. Builders, designers, and business students are all welcome.",
      },
      {
        q: "Is there a cost to participate?",
        a: "No. ThunderHacks is free to participate in. We provide meals, snacks, and swag at no cost. Bring your laptop and your ideas.",
      },
      {
        q: "When and where is ThunderHacks II?",
        a: "ThunderHacks II takes place October 14-16, 2026, running 9:00 AM to 8:00 PM each day. It happens simultaneously at Algoma University's Brampton campus (GTA) and Sault Ste. Marie campus (Northern Ontario).",
      },
    ],
  },
  {
    category: "Format & Judging",
    questions: [
      {
        q: "How does a two-campus hackathon work?",
        a: "Both campuses run in parallel over the same three days. Workshops and talks are hosted in person at one campus and streamed to the other. Judging is combined across both campuses into one unified competition, with virtual coordination on the final day so every team competes on equal footing.",
      },
      {
        q: "Is this an overnight hackathon?",
        a: "No. ThunderHacks II is a daytime event. Each of the three days runs from 9:00 AM to 8:00 PM, so you head home in the evening and return the next morning.",
      },
      {
        q: "How many people are expected?",
        a: "We are projecting 50 to 60 participants across both campuses.",
      },
      {
        q: "How are projects judged?",
        a: "Projects are judged on innovation, technical execution, design and user experience, and real-world impact. Silver and Gold sponsors also judge their own sponsored problem statement tracks.",
      },
    ],
  },
  {
    category: "Teams & Registration",
    questions: [
      {
        q: "How do I register?",
        a: "Registration opens on Devpost. Head to our registration link to sign up as an individual or with a team.",
      },
      {
        q: "Do I need a team?",
        a: "You can participate solo or in a team. Don't have a team yet? Register anyway and team up at the event.",
      },
      {
        q: "What should I bring?",
        a: "Bring your laptop, charger, any hardware you plan to use, and a positive attitude. We provide food, drinks, workspace, and WiFi.",
      },
    ],
  },
  {
    category: "Prizes",
    questions: [
      {
        q: "What are the prizes?",
        a: "The main prize pool is $3,000: $1,250 for 1st place, $1,000 for 2nd, and $750 for 3rd, awarded in the overall track. On top of that, sponsor track prizes are awarded per sponsored problem statement: $750 for each Gold track and $500 for each Silver track. See the Prizes page for details.",
      },
      {
        q: "Do I get to keep my project?",
        a: "Yes. You retain full ownership of everything you build at ThunderHacks II, and we encourage you to keep developing it afterward.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              Got Questions?
            </Badge>
            <div className="mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">FAQ</h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to know about ThunderHacks II. Can&apos;t find your answer? Reach
              out to us.
            </p>
          </div>

          {/* FAQ sections */}
          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={faq.q}
                      value={`${section.category}-${index}`}
                      className="rounded-lg border border-border bg-card/50 px-4"
                    >
                      <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <Card className="mt-12 border-border bg-card">
            <CardContent className="py-8 text-center">
              <Mail className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h2 className="mb-2 text-xl font-bold text-foreground">Still have questions?</h2>
              <p className="mx-auto mb-4 max-w-md text-muted-foreground">
                Can&apos;t find the answer you&apos;re looking for? Reach out to our team.
              </p>
              <Button asChild variant="outline">
                <a href={`mailto:${CONTACT.email}`}>
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Register CTA */}
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="py-8 text-center">
              <h2 className="mb-2 text-xl font-bold text-foreground">Ready to hack?</h2>
              <p className="mb-4 text-muted-foreground">Join us at ThunderHacks II.</p>
              <Button asChild>
                <a href={EVENT.registerUrl} target="_blank" rel="noopener noreferrer">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
