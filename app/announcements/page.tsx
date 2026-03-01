import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Info, AlertTriangle, PartyPopper } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AnnouncementForm } from "@/components/announcement-form"

export const metadata = {
  title: "Announcements | ThunderHacks 2026",
  description: "Stay up to date with the latest announcements from ThunderHacks 2026.",
}

const ADMIN_EMAIL = "alcoms@algomau.ca"

type Announcement = {
  id: string
  created_at: string
  title: string
  content: string
  category: string
}

const categoryConfig: Record<string, { icon: typeof Bell; color: string; bgColor: string }> = {
  general: { icon: Bell, color: "text-primary", bgColor: "bg-primary/10" },
  update: { icon: Info, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  urgent: { icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" },
  event: { icon: PartyPopper, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default async function AnnouncementsPage() {
  const supabase = await getSupabaseServerClient()

  // Check if the current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === ADMIN_EMAIL

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              Stay Updated
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Announcements
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Important updates and news from the ThunderHacks team
            </p>
          </div>
        </section>

        {/* Announcements Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Admin Form - Only visible to admin */}
            {isAdmin && <AnnouncementForm />}

            {/* Announcements List */}
            <div className="space-y-6">
              {error && (
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="p-6">
                    <p className="text-red-500">Failed to load announcements. Please try again later.</p>
                  </CardContent>
                </Card>
              )}

              {announcements && announcements.length === 0 && (
                <Card className="bg-card border-border">
                  <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Announcements Yet</h3>
                    <p className="text-muted-foreground">
                      Check back soon for updates from the ThunderHacks team!
                    </p>
                  </CardContent>
                </Card>
              )}

              {announcements && announcements.map((announcement: Announcement) => {
                const config = categoryConfig[announcement.category] || categoryConfig.general
                const IconComponent = config.icon
                
                return (
                  <Card key={announcement.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <IconComponent className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-foreground">{announcement.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <CardDescription>{formatDate(announcement.created_at)}</CardDescription>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {announcement.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
