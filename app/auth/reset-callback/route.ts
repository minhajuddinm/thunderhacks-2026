import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * Where password-reset emails land.
 *
 * This exists as its own route rather than reusing /auth/callback with a
 * ?next= parameter because Supabase matches the whole redirect URL, query
 * string included, against the allow list. A URL carrying ?next=/reset-password
 * matches no exact entry, so Supabase would quietly fall back to the Site URL
 * and drop the visitor on the home page with no way to set a password. A bare
 * path can be allow-listed exactly, with no wildcard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/forgot-password`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component; the middleware refreshes instead.
          }
        },
      },
    }
  )

  // A bad or spent code simply leaves no session, and /reset-password already
  // explains that case, so both outcomes go to the same place.
  await supabase.auth.exchangeCodeForSession(code)

  const host = request.headers.get("x-forwarded-host")
  const base =
    process.env.NODE_ENV === "development" || !host ? origin : `https://${host}`

  return NextResponse.redirect(`${base}/reset-password`)
}
