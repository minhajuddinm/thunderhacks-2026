import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/section"
import { FaqSection } from "@/components/sections/faq-section"
import { Footer } from "@/components/footer"
import { CONTACT } from "@/lib/content"

export const metadata: Metadata = {
  title: "FAQ | ThunderHacks II",
  description:
    "Who can enter ThunderHacks II, what it costs, team sizes, food, wifi, judging, and how to sign up.",
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main">
        <PageHeader
          title="Questions"
          lead="If something is not answered here, write to us and we will add it."
        />
        <FaqSection />
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-[17px] text-foreground">
              Still stuck? Email{" "}
              <a
                className="text-[var(--bolt)] underline underline-offset-4"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
