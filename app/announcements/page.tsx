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

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Bell className="mr-1 h-3 w-3" />
              Stay Updated
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Announcements
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay up to date with the latest news and updates from ThunderHacks 2026.
            </p>
          </div>

          {/* Admin Form - Only visible to admin */}
          {isAdmin && <AnnouncementForm />}

          {/* Announcements List */}
          <div className="space-y-6">
            {error && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-destructive">Failed to load announcements. Please try again later.</p>
                </CardContent>
              </Card>
            )}

            {!error && announcements && announcements.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Announcements Yet</h3>
                  <p className="text-muted-foreground">
                    Check back soon for updates about ThunderHacks 2026!
                  </p>
                </CardContent>
              </Card>
            )}

            {!error && announcements && announcements.map((announcement: Announcement) => {
              const config = categoryConfig[announcement.category] || categoryConfig.general
              const Icon = config.icon

              return (
                <Card key={announcement.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-foreground">{announcement.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(announcement.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${config.bgColor} ${config.color} border-0`}
                      >
                        {announcement.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base whitespace-pre-wrap">
                      {announcement.content}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
