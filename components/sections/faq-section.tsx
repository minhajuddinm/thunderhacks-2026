import { Section } from "@/components/section"
import { FAQS } from "@/lib/content"

/**
 * Native details/summary. It is keyboard accessible and searchable in-page
 * without shipping any JavaScript for it.
 */
export function FaqSection({
  limit,
  id = "faq",
}: {
  limit?: number
  id?: string
}) {
  const items = limit ? FAQS.slice(0, limit) : FAQS

  return (
    <Section id={id} title="Questions">
      <div className="max-w-3xl">
        {items.map((faq) => (
          <details
            key={faq.q}
            className="group border-t border-[var(--rule)] py-5"
          >
            <summary className="th-display-tight flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--bolt)]">
              {faq.q}
              <span
                aria-hidden="true"
                className="shrink-0 text-xl text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  )
}
