/**
 * Registration opens 8:00am Eastern on Monday 21 September 2026.
 *
 * The database holds the authoritative value in event_settings and
 * complete_registration() refuses before it, so this constant is only for
 * rendering. If the two ever disagree the database wins and the form call
 * simply fails, which is the safe direction.
 */
export const REGISTRATION_OPENS_ISO = "2026-09-21T08:00:00-04:00"

export function registrationOpensAt(): Date {
  return new Date(REGISTRATION_OPENS_ISO)
}

export const REGISTRATION_OPENS_LABEL = "8:00am on Monday 21 September"

export const SCHOOLS = [
  { value: "algoma", label: "Algoma University" },
  { value: "sault_college", label: "Sault College" },
  { value: "other", label: "Another school" },
] as const

export type SchoolValue = (typeof SCHOOLS)[number]["value"]

/**
 * Somebody who picked "Another school" typed their own, so show that instead
 * of a label that tells the organisers nothing.
 */
export function schoolLabel(value: string, other?: string | null): string {
  if (value === "other") return other?.trim() || "Another school"
  return SCHOOLS.find((s) => s.value === value)?.label ?? value
}

export const YEARS = [1, 2, 3, 4] as const

export function yearLabel(year: number): string {
  return `Year ${year}`
}

export const CAMPUSES = [
  { value: "brampton", label: "Brampton" },
  { value: "sault_ste_marie", label: "Sault Ste. Marie" },
] as const

export function campusLabel(value: string | null | undefined): string {
  return CAMPUSES.find((c) => c.value === value)?.label ?? "Not given"
}

/** Shown beside the tick box. Kept here so the signup form and the
 * two-question page always show the same words. */
export const MEDIA_CONSENT_TEXT =
  "I agree that ALCOMS may photograph and film me during ThunderHacks II, and that ALCOMS, Algoma University and the event's sponsors may use those photos and videos online, on social media and in promotional material."

export const MEDIA_CONSENT_NOTE =
  "If you want a particular photo of you taken down afterwards, email alcoms@algomau.ca."

export const PHONE_HINT = "A number we can reach you on during the event, e.g. (647) 740-6963."

/**
 * Numbers are stored as ten digits, or + and the country code for anyone
 * outside Canada and the US. Shown back in the shape people expect.
 */
export function phoneLabel(value: string | null | undefined): string {
  const v = (value ?? "").trim()
  if (!v) return "Not given"
  if (/^[0-9]{10}$/.test(v)) return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`
  return v
}
