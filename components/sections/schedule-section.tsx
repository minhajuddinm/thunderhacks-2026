import { Section } from "@/components/section"
import { SCHEDULE, SCHEDULE_NOTE } from "@/lib/content"

export function ScheduleSection({ id = "event" }: { id?: string }) {
  return (
    <Section id={id} title="Schedule" lead={SCHEDULE_NOTE}>
      <div className="grid grid-cols-1 gap-px bg-[var(--rule)] md:grid-cols-3">
        {SCHEDULE.map((day) => (
          <div key={day.key} className="bg-background px-0 py-6 md:px-6">
            <p className="text-sm text-muted-foreground">{day.weekday}</p>
            <h3 className="th-display mt-1 text-2xl text-foreground">
              {day.date}
            </h3>
            <p className="mt-1 text-sm text-[var(--bolt)]">{day.label}</p>

            <ol className="mt-5">
              {day.items.map((item, i) => (
                <li
                  key={`${day.key}-${i}`}
                  className="border-t border-[var(--rule)] py-3"
                >
                  <div className="text-sm text-muted-foreground">
                    {item.time}
                  </div>
                  <div className="mt-0.5 text-[15px] text-foreground">
                    {item.title}
                  </div>
                  {item.detail ? (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.detail}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Section>
  )
}
