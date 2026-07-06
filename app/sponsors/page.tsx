import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SponsorsSection } from "@/components/sections/sponsors-section"
import { RecapSection } from "@/components/sections/recap-section"

export const metadata = {
  title: "Sponsors | ThunderHacks II | Fall 2026",
  description:
    "Sponsor ThunderHacks II. Bronze, Silver, and Gold packages put your brand in front of student builders across Algoma University's Brampton and Sault Ste. Marie campuses.",
}

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        <SponsorsSection />
        <RecapSection />
      </main>

      <Footer />
    </div>
  )
}
