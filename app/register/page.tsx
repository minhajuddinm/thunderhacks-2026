import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Countdown } from "@/components/countdown"
import { Reveal } from "@/components/motion/reveal"
import { EVENT, CONTACT } from "@/lib/content"
import { CalendarClock, Linkedin, Mail } from "lucide-react"

export const metadata = {
  title: "Registration | ThunderHacks II | Fall 2026",
  description:
    "Registration for ThunderHacks II is starting soon. October 14-16, 2026 across Algoma University's Brampton and Sault Ste. Marie campuses.",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden pt-16">
        <AuroraBackground />

        <Reveal className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#7000FF]/30 bg-card/50 px-4 py-2 backdrop-blur-sm">
            <CalendarClock className="h-4 w-4 text-[#FFEA00]" />
            <span className="text-sm font-medium text-foreground">{EVENT.datesLabel}</span>
          </div>

          <h1 className="mb-4 text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Registration
            <span className="block bg-gradient-to-r from-[#7000FF] via-[#9333ea] to-[#FFEA00] bg-clip-text text-transparent">
              Starting Soon
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Sign-ups for ThunderHacks II open shortly on Devpost. {EVENT.tagline} Follow {CONTACT.org}
            {" "}so you are the first to know when registration goes live.
          </p>

          <div className="mb-10">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Hacking starts in
            </p>
            <Countdown targetISO={EVENT.startsAtISO} />
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-colors hover:bg-accent/90"
            >
              <Linkedin className="h-5 w-5" />
              Follow for Updates
            </a>
            <a
              href={`mailto:${CONTACT.email}?subject=ThunderHacks II Registration`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#7000FF]/40 bg-primary/10 px-8 py-4 font-semibold text-foreground transition-colors hover:bg-primary/20"
            >
              <Mail className="h-5 w-5" />
              Email {CONTACT.org}
            </a>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  )
}
