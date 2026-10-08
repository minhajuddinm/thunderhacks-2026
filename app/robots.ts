import type { MetadataRoute } from "next"

/**
 * The public pages are fair game. Everything behind a sign-in, and the judging
 * portal, stays out of search results. The judging pages also send noindex of
 * their own, since robots.txt is a request rather than a lock.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/judging", "/admin", "/dashboard", "/event-details", "/profile"],
      },
    ],
  }
}
