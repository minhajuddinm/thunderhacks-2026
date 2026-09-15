import { Section } from "@/components/section"
import { ABOUT } from "@/lib/content"

export function AboutSection() {
  return (
    <Section id="about" title={ABOUT.heading} lead={ABOUT.intro}>
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
  )
}
