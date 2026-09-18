"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { EVENT, SECTIONS } from "@/lib/content"

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>("top")

  /**
   * Scroll spy. Whichever section occupies the band just under the header wins,
   * which matches what a reader considers "where I am" better than raw
   * intersection ratios do on sections of very different heights.
   */
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id)

    const pick = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - 80 <= 0) current = id
      }
      setActive(current)
    }

    pick()
    window.addEventListener("scroll", pick, { passive: true })
    window.addEventListener("resize", pick)
    return () => {
      window.removeEventListener("scroll", pick)
      window.removeEventListener("resize", pick)
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#23283a] bg-[#0B0E14]/92 backdrop-blur">
      <nav aria-label="Main" className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="#top"
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFE500]"
          >
            <Image
              src="/images/th-logo.png"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] object-contain"
              priority
            />
            <span className="th-display-tight text-[17px] text-[#F8F9FA]">
              ThunderHacks <span className="text-[#FFE500]">{EVENT.edition}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => {
              const isActive = active === s.id
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "relative rounded-sm px-3 py-2 text-[15px] transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE500]",
                    isActive
                      ? "text-[#F8F9FA]"
                      : "text-[#9ca3af] hover:text-[#F8F9FA]",
                  ].join(" ")}
                >
                  {s.label}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-0.5 bg-[#FFE500]"
                    />
                  ) : null}
                </a>
              )
            })}
            <LoginButton className="ml-3" />
          </div>

          <button
            type="button"
            className="rounded-sm p-2 text-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE500] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open ? (
          <div id="mobile-nav" className="border-t border-[#23283a] py-3 md:hidden">
            <ul className="flex flex-col">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-sm px-3 py-2.5 text-[15px] text-[#9ca3af] hover:text-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE500]"
                  >
                    {s.label}
                  </a>
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

function LoginButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/login"
      className={`inline-flex items-center justify-center rounded-md border border-[#23283a] px-4 py-2 text-[15px] text-[#F8F9FA] transition-colors hover:border-[#FFE500] hover:text-[#FFE500] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE500] ${className}`}
    >
      Log in
    </Link>
  )
}
