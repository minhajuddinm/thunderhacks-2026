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
                src="/images/th-logo.png"
                alt="ThunderHacks Logo"
                width={48}
                height={48}
                className="w-[48px] h-auto"
              />
              <div>
                <div className="font-bold text-foreground">ThunderHacks 2026</div>
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
                  <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-[#7000FF]/30 hover:border-[#7000FF] transition-colors">
                    <Image
                      src="/images/alcoms-logo.png"
                      alt="ALCOMS - Algoma University Computer Society"
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </a>
                <div>
                  <p className="text-sm font-medium text-foreground">Organized & Hosted by</p>
                  <a 
                    href="https://alcoms.ca" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#FFEA00] hover:text-[#FFEA00]/80 font-semibold transition-colors"
                  >
                    ALCOMS
                  </a>
                </div>
              </div>
              <p className="text-muted-foreground text-xs max-w-sm">
                ThunderHacks is organized and hosted by the Algoma University Computer Science Society (ALCOMS).
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
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
          <p>&copy; {new Date().getFullYear()} ThunderHacks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
