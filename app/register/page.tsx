import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RegistrationForm } from "@/components/registration-form"

export const metadata = {
  title: "Register | Thunder Hacks 2025",
  description: "Register for Thunder Hacks 2025 - Join as an individual or create/join a team.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Register for Thunder Hacks 2025
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us for an exciting weekend of innovation. Register as an individual, 
              create a new team, or join an existing team with a code.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
