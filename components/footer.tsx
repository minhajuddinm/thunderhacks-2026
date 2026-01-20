import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/thunderhacks-logo.png"
                alt="Thunder Hacks Logo"
                width={48}
                height={48}
              />
              <div>
                <div className="font-bold text-foreground">Thunder Hacks 2026</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Join us for an exciting weekend of innovation, learning, and collaboration at Algoma University.
            </p>
            
            {/* ALCOMS Credit Section */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-4 mb-3">
                <a 
                  href="https://alcoms.ca" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#00D4FF]/30 hover:border-[#00D4FF] transition-colors">
                    <Image
                      src="/images/alcoms-logo.jpg"
                      alt="ALCOMS - Algoma University Computer Society"
                      width={56}
                      height={56}
                      className="object-cover scale-125"
                    />
                  </div>
                </a>
                <div>
                  <p className="text-sm font-medium text-foreground">Organized & Hosted by</p>
                  <a 
                    href="https://alcoms.ca" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#00D4FF] hover:text-[#00D4FF]/80 font-semibold transition-colors"
                  >
                    ALCOMS
                  </a>
                </div>
              </div>
              <p className="text-muted-foreground text-xs max-w-sm">
                Thunder Hacks is organized and hosted by the Algoma University Computer Science Society (ALCOMS).
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register" className="hover:text-foreground transition-colors">Register</Link></li>
              <li><Link href="/teams" className="hover:text-foreground transition-colors">Teams</Link></li>
              <li><Link href="/prizes" className="hover:text-foreground transition-colors">Prizes</Link></li>
              <li><Link href="/event" className="hover:text-foreground transition-colors">Event Details</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Algoma University</li>
              <li>Brampton, ON</li>
              <li>
                <a href="mailto:alcoms@algomau.ca" className="hover:text-foreground transition-colors">
                  alcoms@algomau.ca
                </a>
              </li>
              <li>
                <a href="https://alcoms.ca" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  alcoms.ca
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Thunder Hacks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
