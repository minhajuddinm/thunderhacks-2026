import { Section } from "@/components/section"
import { PRIZES } from "@/lib/content"

export function PrizesSection() {
  return (
    <Section id="prizes" tone="bolt" title={PRIZES.heading} lead={PRIZES.intro}>
      <p className="th-display text-4xl text-[var(--bolt)] sm:text-5xl">
        {PRIZES.poolLabel}
      </p>

      <ol className="mt-10 max-w-3xl">
        {PRIZES.main.map((prize) => (
          <li
            key={prize.place}
            className="grid grid-cols-[3rem_1fr] items-baseline gap-x-5 border-t border-[var(--rule)] py-6 sm:grid-cols-[4rem_8rem_1fr]"
          >
            <span className="th-display text-xl text-muted-foreground">
              {prize.place}
            </span>
            <span className="th-display col-start-2 text-2xl text-foreground sm:text-3xl">
              {prize.amount}
            </span>
            <span className="col-span-2 text-[15px] leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-3">
              {prize.description}
            </span>
          </li>
        ))}
      </ol>

      <h3 className="th-display-tight mt-14 text-lg text-foreground">
        Sponsored challenge tracks
      </h3>
      <ul className="mt-4 max-w-3xl">
        {PRIZES.sponsorTrack.map((track) => (
          <li
            key={track.tier}
            className="grid grid-cols-1 items-baseline gap-x-5 gap-y-1 border-t border-[var(--rule)] py-6 sm:grid-cols-[10rem_8rem_1fr]"
          >
            <span className="text-[15px] text-muted-foreground">
              {track.tier}
            </span>
            <span className="th-display text-2xl text-foreground">
              {track.amount}
            </span>
            <span className="text-[15px] leading-relaxed text-muted-foreground">
              {track.description}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="th-display-tight mt-14 text-lg text-foreground">
        {PRIZES.gameJam.heading}
      </h3>
      <ul className="mt-4 max-w-3xl">
        <li className="grid grid-cols-1 items-baseline gap-x-5 gap-y-1 border-t border-[var(--rule)] py-6 sm:grid-cols-[10rem_8rem_1fr]">
          <span className="text-[15px] text-muted-foreground">{PRIZES.gameJam.tier}</span>
          <span className="th-display text-2xl text-foreground">{PRIZES.gameJam.amount}</span>
          <span className="text-[15px] leading-relaxed text-muted-foreground">
            {PRIZES.gameJam.description}
          </span>
        </li>
      </ul>
    </Section>
  )
}
