import Link from "next/link"
import Image from "next/image"
import { Linkedin } from "lucide-react"
import { CONTACT, EVENT } from "@/lib/content"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Image src="/images/th-logo.png" alt="ThunderHacks II Logo" width={48} height={48} />
              <div>
                <div className="font-bold text-foreground">ThunderHacks II</div>
                <div className="text-xs text-muted-foreground">Fall 2026</div>
              </div>
            </div>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              Algoma University&apos;s flagship hackathon returns for its second edition. Three days,
              two campuses, one competition. {EVENT.datesLabel}.
            </p>

            {/* ALCOMS credit */}
            <div className="border-t border-border pt-6">
              <div className="mb-3 flex items-center gap-4">
                <a
                  href={CONTACT.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block flex-shrink-0"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-lg border-2 border-[#7000FF]/30 transition-colors hover:border-[#7000FF]">
                    <Image
                      src="/images/alcoms-logo.png"
                      alt="ALCOMS, Algoma University Computer Science Society"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </a>
                <div>
                  <p className="text-sm font-medium text-foreground">Organized &amp; Hosted by</p>
                  <a
                    href={CONTACT.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#FFEA00] transition-colors hover:text-[#FFEA00]/80"
                  >
                    {CONTACT.org}
                  </a>
                </div>
              </div>
              <p className="max-w-sm text-xs text-muted-foreground">
                ThunderHacks is organized and hosted by the {CONTACT.orgFull} ({CONTACT.org}).
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/prizes" className="transition-colors hover:text-foreground">
                  Prizes
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="transition-colors hover:text-foreground">
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/event" className="transition-colors hover:text-foreground">
                  Event Details
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{CONTACT.org}</li>
              <li>Brampton (GTA) &amp; Sault Ste. Marie (Northern Ontario)</li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} ThunderHacks II, Fall 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
