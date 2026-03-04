import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const errorParam = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  
  // Handle OAuth errors from provider
  if (errorParam) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || errorParam)}`)
  }
  
  if (code) {
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
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(`${origin}/login?error=Could not get user`)
    }
    
    // Check if profile exists and is complete
    const { data: profile } = await supabase
      .from("profiles")
      .select("questionnaire_completed")
      .eq("id", user.id)
      .single()

    const forwardedHost = request.headers.get("x-forwarded-host")
    const isLocalEnv = process.env.NODE_ENV === "development"
    
    // If no profile or profile not complete, redirect to onboarding
    // If profile exists and complete, redirect to dashboard
    const redirectPath = (profile && profile.questionnaire_completed) ? "/dashboard" : "/onboarding"
    
    const redirectUrl = isLocalEnv 
      ? `${origin}${redirectPath}`
      : forwardedHost 
        ? `https://${forwardedHost}${redirectPath}`
        : `${origin}${redirectPath}`
    
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(`${origin}/login?error=No code provided`)
}
