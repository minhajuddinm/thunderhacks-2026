import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Placeholder sponsor data - replace with real sponsors later
const sponsors = {
  platinum: [
    {
      id: 1,
      name: "TechCorp Industries",
      logo: "/placeholder-logo.svg",
      description: "Leading provider of enterprise software solutions",
      website: "https://example.com",
    },
    {
      id: 2,
      name: "CloudScale",
      logo: "/placeholder-logo.svg",
      description: "Cloud infrastructure and developer tools",
      website: "https://example.com",
    },
  ],
  gold: [
    {
      id: 3,
      name: "DevTools Pro",
      logo: "/placeholder-logo.svg",
      description: "Professional development tools and IDEs",
      website: "https://example.com",
    },
    {
      id: 4,
      name: "AI Solutions Inc",
      logo: "/placeholder-logo.svg",
      description: "Cutting-edge artificial intelligence solutions",
      website: "https://example.com",
    },
    {
      id: 5,
      name: "DataFlow Systems",
      logo: "/placeholder-logo.svg",
      description: "Big data analytics and processing",
      website: "https://example.com",
    },
  ],
  silver: [
    {
      id: 6,
      name: "StartupHub",
      logo: "/placeholder-logo.svg",
      description: "Incubator and accelerator for tech startups",
      website: "https://example.com",
    },
    {
      id: 7,
      name: "CyberSecure",
      logo: "/placeholder-logo.svg",
      description: "Cybersecurity solutions for modern businesses",
      website: "https://example.com",
    },
    {
      id: 8,
      name: "Green Tech",
      logo: "/placeholder-logo.svg",
      description: "Sustainable technology innovations",
      website: "https://example.com",
    },
    {
      id: 9,
      name: "Mobile First",
      logo: "/placeholder-logo.svg",
      description: "Mobile app development platform",
      website: "https://example.com",
    },
  ],
  community: [
    {
      id: 10,
      name: "Local Dev Meetup",
      logo: "/placeholder-logo.svg",
      description: "Community-driven developer events",
      website: "https://example.com",
    },
    {
      id: 11,
      name: "Code for Good",
      logo: "/placeholder-logo.svg",
      description: "Non-profit technology education",
      website: "https://example.com",
    },
    {
      id: 12,
      name: "Open Source Foundation",
      logo: "/placeholder-logo.svg",
      description: "Supporting open source projects",
      website: "https://example.com",
    },
  ],
}

const tierColors = {
  platinum: "bg-gradient-to-r from-slate-300 to-slate-100 text-slate-900",
  gold: "bg-gradient-to-r from-yellow-400 to-amber-300 text-amber-900",
  silver: "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-800",
  community: "bg-primary text-primary-foreground",
}

const tierBorders = {
  platinum: "border-slate-400/50 hover:border-slate-300",
  gold: "border-yellow-500/50 hover:border-yellow-400",
  silver: "border-gray-400/50 hover:border-gray-300",
  community: "border-primary/50 hover:border-primary",
}

export default function SponsorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Our Sponsors
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              ThunderHacks 2026 is made possible by the generous support of our sponsors. 
              Thank you for empowering the next generation of innovators!
            </p>
          </div>
        </section>

        {/* Platinum Sponsors */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className={tierColors.platinum}>Platinum Sponsors</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {sponsors.platinum.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-card border-2 ${tierBorders.platinum} transition-all hover:shadow-lg hover:shadow-slate-400/20`}>
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold text-muted-foreground">
                          {sponsor.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{sponsor.name}</h3>
                      <p className="text-muted-foreground">{sponsor.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Gold Sponsors */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className={tierColors.gold}>Gold Sponsors</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sponsors.gold.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-card border-2 ${tierBorders.gold} transition-all hover:shadow-lg hover:shadow-yellow-400/20`}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-3">
                        <span className="text-3xl font-bold text-muted-foreground">
                          {sponsor.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Silver Sponsors */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className={tierColors.silver}>Silver Sponsors</Badge>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {sponsors.silver.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-card border ${tierBorders.silver} transition-all hover:shadow-md`}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {sponsor.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{sponsor.name}</h3>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Community Partners */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className={tierColors.community}>Community Partners</Badge>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {sponsors.community.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-card border ${tierBorders.community} transition-all hover:shadow-md hover:shadow-primary/20`}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center mb-2">
                        <span className="text-xl font-bold text-muted-foreground">
                          {sponsor.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{sponsor.name}</h3>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Become a Sponsor CTA */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Interested in Sponsoring?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Join our mission to empower student innovators. Contact us to learn about sponsorship opportunities.
            </p>
            <a
              href="mailto:alcoms@algomau.ca"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
