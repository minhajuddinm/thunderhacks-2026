import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/section"
import { PrizesSection } from "@/components/sections/prizes-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Prizes | ThunderHacks II",
  description:
    "$4,500 in prizes at ThunderHacks II: $1,750 for first, $750 for second, $500 for third, plus $1,000 on the OLG track and $500 on the Canadian Bank Note track.",
}

export default function PrizesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main">
        <PageHeader
          title="Prizes"
          lead="Both campuses compete for the same prize pool, judged by one panel on the final day."
        />
        <PrizesSection />
      </main>
      <Footer />
    </div>
  )
}
