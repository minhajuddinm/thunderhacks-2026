"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const categories = [
  { value: "general", label: "General" },
  { value: "update", label: "Update" },
  { value: "urgent", label: "Urgent" },
  { value: "event", label: "Event" },
]

export function AnnouncementForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Check auth status
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log("[v0] Auth check - User:", user?.email, "Error:", authError?.message)
      
      if (!user) {
        throw new Error("You must be logged in to post announcements")
      }
      
      console.log("[v0] Attempting insert with user:", user.id)
      
      const { error: insertError, data: insertData } = await supabase
        .from("announcements")
        .insert({
          title,
          content,
          category,
        })
        .select()

      console.log("[v0] Insert result - Error:", insertError?.message, insertError?.code, insertError?.details, "Data:", insertData)

      if (insertError) {
        throw insertError
      }

      setSuccess(true)
      setTitle("")
      setContent("")
      setCategory("general")
      router.refresh()
    } catch (err) {
      console.error("[v0] Announcement error:", err)
      setError(err instanceof Error ? err.message : "Failed to post announcement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-primary/20 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <PlusCircle className="h-5 w-5 text-primary" />
          Post New Announcement
        </CardTitle>
        <CardDescription>
          Create an announcement that will be visible to all participants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement here..."
              required
              className="bg-background min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-500">Announcement posted successfully!</p>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Announcement"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
