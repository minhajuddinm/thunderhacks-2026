"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { REGISTRATION_OPENS_LABEL, registrationOpensAt } from "@/lib/registration"

/**
 * The Register and Log in buttons.
 *
 * They start dead on every render and only become links once the visitor's
 * own clock has passed the opening time. A page served from cache can
 * therefore never show them live early, which is the direction that matters.
 * The database refuses early registrations regardless, so this is presentation
 * rather than enforcement.
 */
export function AuthButtons({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "nav"
  className?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const opensAt = registrationOpensAt().getTime()
    const check = () => Date.now() >= opensAt
    if (check()) {
      setOpen(true)
      return
    }
    const id = setInterval(() => {
      if (check()) {
        setOpen(true)
        clearInterval(id)
      }
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  if (variant === "nav") {
    return open ? (
      <Link href="/login" className={`${NAV_LIVE} ${className}`}>
        Log in
      </Link>
    ) : (
      <span className={`inline-flex flex-col items-center ${className}`}>
        <span
          role="button"
          aria-disabled="true"
          aria-describedby="auth-availability-nav"
          className={NAV_DEAD}
        >
          Log in
        </span>
        <span id="auth-availability-nav" className="sr-only">
          Opens {REGISTRATION_OPENS_LABEL}
        </span>
      </span>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        {open ? (
          <>
            <Link href="/signup" className={HERO_PRIMARY_LIVE}>
              Register
            </Link>
            <Link href="/login" className={HERO_SECONDARY_LIVE}>
              Log in
            </Link>
          </>
        ) : (
          <>
            <span role="button" aria-disabled="true" aria-describedby="auth-availability" className={HERO_PRIMARY_DEAD}>
              Register
            </span>
            <span role="button" aria-disabled="true" aria-describedby="auth-availability" className={HERO_SECONDARY_DEAD}>
              Log in
            </span>
          </>
        )}
      </div>
      <p id="auth-availability" className="mt-3 text-sm text-muted-foreground">
        {open ? "Registration is open." : REGISTRATION_OPENS_LABEL}
      </p>
    </>
  )
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"

const NAV_LIVE =
  `inline-flex items-center justify-center rounded-md border border-[#23283a] px-4 py-2 text-[15px] text-[#F8F9FA] transition-colors hover:border-[#FFE500] hover:text-[#FFE500] ${FOCUS}`
const NAV_DEAD =
  "inline-flex w-full items-center justify-center rounded-md border border-[#23283a] px-4 py-2 text-[15px] text-[#6b7280] cursor-not-allowed select-none"

const HERO_PRIMARY_LIVE =
  `w-full rounded-md border border-[var(--bolt)]/40 bg-[var(--bolt)]/10 px-7 py-3 text-center font-semibold text-[var(--bolt)] transition-colors hover:bg-[var(--bolt)]/20 ${FOCUS} sm:w-auto`
const HERO_PRIMARY_DEAD =
  "w-full rounded-md border border-[var(--rule)] px-7 py-3 text-center font-semibold text-muted-foreground cursor-not-allowed select-none sm:w-auto"

const HERO_SECONDARY_LIVE =
  `w-full rounded-md border border-[var(--rule)] px-7 py-3 text-center font-semibold text-foreground transition-colors hover:border-[var(--bolt)] hover:text-[var(--bolt)] ${FOCUS} sm:w-auto`
const HERO_SECONDARY_DEAD =
  "w-full rounded-md border border-[var(--rule)] px-7 py-3 text-center font-semibold text-muted-foreground cursor-not-allowed select-none sm:w-auto"
