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
  { value: "both", label: "Both" },
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

export const YEARS = [1, 2, 3, 4, 5, 6, 7] as const

export function yearLabel(year: number): string {
  if (year >= 5) return `Year ${year}+`
  return `Year ${year}`
}
