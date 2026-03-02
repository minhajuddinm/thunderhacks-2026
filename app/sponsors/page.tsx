import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Sponsor tiers - Platinum, Gold, Food (no Silver)
const sponsors = {
  platinum: [
    {
      id: 1,
      name: "Shield Identity",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SHIELD%20IDENTITY%20Side%20Logo-QiUEhUByRFTn5OnwQmXo2ahOK5EGJN.png",
      description: "Leading provider of identity verification and security solutions. Shield Identity protects digital identities with cutting-edge authentication technology.",
      website: "https://shield-identity.com/",
    },
  ],
  gold: [
    {
      id: 2,
      name: "Digital Move",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DMIT-gm7czS1ojr5I0B6d9IvxsGZg1I9flo.png",
      description: "Driving digital transformation for businesses worldwide. Digital Move helps organizations embrace innovative technology solutions.",
      website: "https://digital-move.com/",
    },
  ],
  food: [
    {
      id: 3,
      name: "Circuit Revival",
      logo: "/placeholder-logo.svg",
      description: "Proud catering partner of ThunderHacks 2026. Circuit Revival keeps our hackers fueled with delicious meals throughout the event.",
      website: "https://algomau.ca",
    },
  ],
}

const tierColors = {
  platinum: "bg-gradient-to-r from-slate-300 to-slate-100 text-slate-900",
  gold: "bg-gradient-to-r from-yellow-400 to-amber-300 text-amber-900",
  food: "bg-gradient-to-r from-orange-400 to-red-400 text-white",
}

const tierBorders = {
  platinum: "border-slate-400/50 hover:border-slate-300",
  gold: "border-yellow-500/50 hover:border-yellow-400",
  food: "border-orange-400/50 hover:border-orange-300",
}

const tierShadows = {
  platinum: "hover:shadow-slate-400/20",
  gold: "hover:shadow-yellow-400/20",
  food: "hover:shadow-orange-400/20",
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

        {/* Platinum Sponsor - Shield Identity */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className={tierColors.platinum}>Platinum Sponsor</Badge>
            </div>
            <div className="max-w-2xl mx-auto">
              {sponsors.platinum.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-card border-2 ${tierBorders.platinum} transition-all hover:shadow-xl ${tierShadows.platinum}`}>
                    <CardContent className="p-10 flex flex-col items-center text-center">
                      <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center mb-6 p-4">
                        <Image
                          src={sponsor.logo}
                          alt={sponsor.name}
                          width={140}
                          height={140}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{sponsor.name}</h3>
                      <p className="text-muted-foreground text-lg">{sponsor.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Gold Sponsor - Digital Move */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className={tierColors.gold}>Gold Sponsor</Badge>
            </div>
            <div className="max-w-xl mx-auto">
              {sponsors.gold.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-card border-2 ${tierBorders.gold} transition-all hover:shadow-lg ${tierShadows.gold}`}>
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="w-36 h-36 bg-white rounded-lg flex items-center justify-center mb-4 p-3">
                        <Image
                          src={sponsor.logo}
                          alt={sponsor.name}
                          width={120}
                          height={120}
                          className="object-contain"
                        />
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

        {/* Food Sponsor - Circuit Revival */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className={tierColors.food}>Food & Catering Partner</Badge>
            </div>
            <div className="max-w-xl mx-auto">
              {sponsors.food.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className={`bg-card border-2 ${tierBorders.food} transition-all hover:shadow-lg ${tierShadows.food}`}>
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
