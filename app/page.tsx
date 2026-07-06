import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { RecapSection } from "@/components/sections/recap-section"
import { PrizesSection } from "@/components/sections/prizes-section"
import { SponsorsSection } from "@/components/sections/sponsors-section"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/motion/reveal"
import { EVENT } from "@/lib/content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <RecapSection />
      <PrizesSection />
      <SponsorsSection />

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Ready to Build?</h2>
            <p className="mx-auto mb-8 max-w-xl text-xl text-muted-foreground">
              Join hackers from both campuses for three days of building, learning, and competing.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={EVENT.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-colors hover:bg-accent/90"
              >
                Register Now
              </a>
              <a
                href="#sponsors"
                className="inline-flex items-center justify-center rounded-lg border border-[#7000FF]/40 bg-primary/10 px-8 py-4 font-semibold text-foreground transition-colors hover:bg-primary/20"
              >
                View Sponsor Packages
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
