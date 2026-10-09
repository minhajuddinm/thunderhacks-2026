import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { judgeSignOutAction } from "@/app/judging/actions"

/**
 * Every judging page carries the same bar: who you are signed in as, a way
 * back to the team list, and a way out if you picked the wrong name.
 */
export function JudgingHeader({
  judgeName,
  showBack = false,
}: {
  judgeName?: string | null
  showBack?: boolean
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--rule)] bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/th-logo.png"
            alt=""
            width={26}
            height={26}
            className="h-[26px] w-[26px] object-contain"
          />
          <span className="th-display-tight text-[15px] text-foreground">
            ThunderHacks <span className="text-[var(--bolt)]">II</span>{" "}
            <span className="text-muted-foreground">Judging</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showBack ? (
            <Link
              href="/judging/teams"
              className="rounded-md border border-[var(--rule)] px-3 py-1.5 text-sm text-foreground transition-colors hover:border-[var(--bolt)]"
            >
              All teams
            </Link>
          ) : null}
          {judgeName ? (
            <span className="flex items-center gap-2 rounded-full border border-[var(--bolt)] bg-[var(--bolt)]/10 px-3 py-1.5 text-sm text-foreground">
              <span
                aria-hidden="true"
                className="grid h-5 w-5 place-items-center rounded-full bg-[var(--bolt)] text-[11px] font-bold text-black"
              >
                {judgeName.trim().charAt(0).toUpperCase()}
              </span>
              {judgeName}
            </span>
          ) : null}
          <form action={judgeSignOutAction}>
            <button
              type="submit"
              className="rounded-md border border-[var(--rule)] px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-[#b91c1c] hover:text-[#fca5a5]"
            >
              Not you? Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export function Progress({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between text-[15px]">
        <span className="text-muted-foreground">
          {done} of {total} teams scored
        </span>
        <span className="th-display text-xl text-[var(--bolt)]">{pct}%</span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--raised)]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[var(--bolt)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function Pill({
  tone = "quiet",
  children,
}: {
  tone?: "quiet" | "done" | "todo"
  children: ReactNode
}) {
  const styles = {
    quiet: "border-[var(--rule)] text-muted-foreground",
    done: "border-[#14532d] bg-[#0f2418] text-[#86efac]",
    todo: "border-[var(--bolt)] text-[var(--bolt)]",
  }[tone]
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs ${styles}`}>{children}</span>
  )
}
