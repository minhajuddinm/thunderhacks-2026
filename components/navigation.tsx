"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { EVENT } from "@/lib/content"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/prizes", label: "Prizes" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/event", label: "Event" },
  { href: "/faq", label: "FAQ" },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--rule)] bg-background/90 backdrop-blur">
      <nav aria-label="Main" className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--bolt)]"
          >
            <Image
              src="/images/th-logo.png"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] object-contain"
              priority
            />
            <span className="th-display-tight text-[17px] text-foreground">
              ThunderHacks{" "}
              <span className="text-[var(--bolt)]">{EVENT.edition}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative rounded-sm px-3 py-2 text-[15px] transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {link.label}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-0.5 bg-[var(--bolt)]"
                    />
                  ) : null}
                </Link>
              )
            })}

            <LoginButton className="ml-3" />
          </div>

          <button
            type="button"
            className="rounded-sm p-2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="border-t border-[var(--rule)] py-3 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-sm px-3 py-2.5 text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <LoginButton className="mt-3 w-full" />
          </div>
        ) : null}
      </nav>
    </header>
  )
}

/**
 * Login is deliberately disabled until accounts ship. It stays visible so the
 * nav does not change shape later, and the reason is given rather than implied.
 */
function LoginButton({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <button
        type="button"
        disabled
        aria-describedby="login-availability"
        className="w-full cursor-not-allowed rounded-md border border-[var(--rule)] px-4 py-2 text-[15px] text-muted-foreground opacity-70"
      >
        Log in
      </button>
      <span id="login-availability" className="sr-only">
        {EVENT.registrationOpensLabel}
      </span>
    </span>
  )
}
