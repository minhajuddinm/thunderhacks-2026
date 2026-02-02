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

export const metadata = {
  title: "FAQ | ThunderHacks 2026",
  description: "Frequently asked questions about ThunderHacks 2026 - registration, teams, what to bring, and more.",
}

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is ThunderHacks?",
        a: "ThunderHacks is Algoma University's premier hackathon event where students come together to build innovative projects over two days. It's a great opportunity to learn, collaborate, and compete for prizes!",
      },
      {
        q: "Who can participate?",
        a: "ThunderHacks is open to all university students. You don't need to be a computer science major - we welcome students from all disciplines! Whether you're a designer, business student, or engineer, there's a place for you.",
      },
      {
        q: "Is there a cost to participate?",
        a: "ThunderHacks is completely free! We provide meals, snacks, and swag at no cost to participants. All you need to bring is your laptop and enthusiasm.",
      },
      {
        q: "When and where is ThunderHacks 2026?",
        a: "ThunderHacks 2026 takes place on March 14-15, 2026 at Algoma University, 24 Queen St E, Brampton, ON. The venue is open from 8 AM to 10 PM both days (no overnight stay).",
      },
    ],
  },
  {
    category: "Teams & Registration",
    questions: [
      {
        q: "Do I need a team?",
        a: "You can participate solo or in a team of up to 4 members. Don't have a team? Register as an individual and find teammates on our Teams page! Many great friendships and collaborations have started at hackathons.",
      },
      {
        q: "How do I register?",
        a: "Head to our Register page and fill out the form. You can register as an individual looking for a team, create a new team, or join an existing team using a team code.",
      },
      {
        q: "Can I join a team after registering individually?",
        a: "Yes! Visit our Teams page to browse teams looking for members and send a join request. Team leaders can approve your request, and you'll be added to their team.",
      },
      {
        q: "What's the maximum team size?",
        a: "Teams can have a maximum of 4 members. This ensures fair competition and allows everyone to contribute meaningfully to their project.",
      },
    ],
  },
  {
    category: "The Event",
    questions: [
      {
        q: "What should I bring?",
        a: "Bring your laptop, charger, any hardware you want to use, and a positive attitude! We'll provide food, drinks, workspace, and WiFi. Don't forget any specific tools or equipment for your project idea.",
      },
      {
        q: "What can I build?",
        a: "Anything! Web apps, mobile apps, hardware projects, AI/ML solutions, games - the sky's the limit. Projects must be started during the hackathon, but you can come with ideas and do prior research.",
      },
      {
        q: "Will there be WiFi and power outlets?",
        a: "Yes! High-speed WiFi will be available throughout the venue, and there will be plenty of power outlets for charging your devices.",
      },
      {
        q: "What about food?",
        a: "We provide free meals (breakfast, lunch, and dinner) as well as snacks throughout the event. If you have dietary restrictions, let us know during registration and we'll accommodate you.",
      },
      {
        q: "Is this an overnight hackathon?",
        a: "No, ThunderHacks is NOT an overnight event. The venue is open from 8 AM to 10 PM on both days. You'll need to leave at 10 PM on Saturday and return on Sunday morning to continue working.",
      },
    ],
  },
  {
    category: "Projects & Judging",
    questions: [
      {
        q: "How are projects judged?",
        a: "Projects are judged on innovation, technical complexity, design/user experience, and presentation. Our panel of judges includes industry professionals and faculty members.",
      },
      {
        q: "Can I use existing code or templates?",
        a: "You can use open-source libraries, frameworks, and APIs, but your core project must be built during the hackathon. Pre-written code specific to your project idea is not allowed.",
      },
      {
        q: "What are the prizes?",
        a: "We're offering up to $1,250 in prizes! First place wins $750, second place $250, third place $150, and there's a $100 prize for Most Creative. Check our Prizes page for more details.",
      },
      {
        q: "Do I get to keep my project?",
        a: "Absolutely! You retain full ownership of everything you create at ThunderHacks. We encourage you to continue developing your projects after the event.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Got Questions?
            </Badge>
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                FAQ
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about ThunderHacks 2026.
              Can't find your answer? Reach out to us!
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={faq.q}
                      value={`${section.category}-${index}`}
                      className="border border-border rounded-lg px-4 bg-card/50"
                    >
                      <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <Card className="mt-12 bg-card border-border">
            <CardContent className="py-8 text-center">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Still have questions?</h2>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Can't find the answer you're looking for? Reach out to our team.
              </p>
              <Button asChild variant="outline">
                <a href="mailto:alcoms@algomau.ca">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Register CTA */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="py-8 text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">Ready to hack?</h2>
              <p className="text-muted-foreground mb-4">
                Join us at ThunderHacks 2026!
              </p>
              <Button asChild>
                <Link href="/register">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
