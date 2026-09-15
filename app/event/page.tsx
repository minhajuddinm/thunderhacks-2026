import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { PageHeader, Section } from "@/components/section"
import { ScheduleSection } from "@/components/sections/schedule-section"
import { CampusesSection } from "@/components/sections/campuses-section"
import { Footer } from "@/components/footer"
import { ABOUT, EVENT } from "@/lib/content"

export const metadata: Metadata = {
  title: "Event | ThunderHacks II",
  description:
    "ThunderHacks II runs October 14-16, 2026 across Algoma University's Brampton and Sault Ste. Marie campuses. Schedule, format and what to expect.",
}

export default function EventPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main">
        <PageHeader
          title="The event"
          lead={`${EVENT.datesLabel}. ${EVENT.hoursLabel}.`}
        />
        <CampusesSection />
        <ScheduleSection id="schedule" />

        <Section id="format" title={ABOUT.heading} lead={ABOUT.intro}>
          <dl className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {ABOUT.blocks.map((block) => (
              <div
                key={block.title}
                className="border-t border-[var(--rule)] py-6"
              >
                <dt className="th-display-tight text-lg text-foreground">
                  {block.title}
                </dt>
                <dd className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                  {block.body}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
