import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CampusesSection } from "@/components/sections/campuses-section"
import { AboutSection } from "@/components/sections/about-section"
import { ScheduleSection } from "@/components/sections/schedule-section"
import { PrizesSection } from "@/components/sections/prizes-section"
import { SponsorsSection } from "@/components/sections/sponsors-section"
import { RecapSection } from "@/components/sections/recap-section"
import { FaqSection } from "@/components/sections/faq-section"
import { Footer } from "@/components/footer"
import { EVENT, CONTACT, TICKER } from "@/lib/content"
import { Ticker } from "@/components/ui/ticker"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main">
        <HeroSection />
        <Ticker items={[...TICKER]} />
        <CampusesSection />
        <AboutSection />
        <PrizesSection />
        <SponsorsSection />
        <ScheduleSection />
        <RecapSection />
        <FaqSection />

        <section className="border-b border-[var(--rule)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="th-rule mb-6 w-16" aria-hidden="true" />
            <h2 className="th-display max-w-2xl text-[clamp(1.75rem,5vw,3rem)] text-foreground">
              Three days, two campuses, one competition.
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              {EVENT.registrationOpensLabel} through this site. Until then, read
              the challenge tracks and work out who you want on your team.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#prizes"
                className="rounded-md bg-[var(--bolt)] px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
              >
                See the prizes
              </a>
              <Link
                href={`mailto:${CONTACT.email}`}
                className="rounded-md border border-[var(--rule)] px-6 py-3 font-semibold text-foreground transition-colors hover:border-[var(--bolt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
              >
                Sponsor ThunderHacks
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
