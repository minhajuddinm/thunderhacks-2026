import { permanentRedirect } from "next/navigation"

/**
 * This used to be a standalone page. The site is one page now, so anything
 * already linking to /event (sponsor emails, posts) lands on the right section
 * instead of a 404.
 */
export default function Page() {
  permanentRedirect("/#event")
}
