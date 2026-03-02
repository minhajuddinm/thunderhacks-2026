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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Stay Updated
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">Announcements</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Important updates and information about ThunderHacks 2026.
            </p>
          </div>

          {isAdmin && <AnnouncementForm />}

          <div className="space-y-6">
            {error && (
              <Card className="border-red-500/20">
                <CardContent className="pt-6">
                  <p className="text-red-500">Failed to load announcements. Please try again later.</p>
                </CardContent>
              </Card>
            )}

            {!error && (!announcements || announcements.length === 0) && (
              <Card className="border-muted">
                <CardContent className="pt-6 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No announcements yet. Check back later!</p>
                </CardContent>
              </Card>
            )}

            {announcements?.map((announcement: Announcement) => {
              const config = categoryConfig[announcement.category] || categoryConfig.general
              const IconComponent = config.icon

              return (
                <Card key={announcement.id} className="border-border hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <IconComponent className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground">{announcement.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
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
      </main>

      <Footer />
    </div>
  )
}
