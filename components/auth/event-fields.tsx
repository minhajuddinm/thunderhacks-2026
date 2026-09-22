"use client"

import { CAMPUSES, MEDIA_CONSENT_NOTE, MEDIA_CONSENT_TEXT, PHONE_HINT } from "@/lib/registration"
import { Field, inputClass } from "./auth-shell"

/**
 * Campus and photo consent, shared by the signup form and the page existing
 * registrants see once. Sault College students attend Sault Ste. Marie, so
 * Brampton is not offered to them.
 */
export function EventFields({
  school,
  campus,
  onCampus,
  phone,
}: {
  school: string
  campus: string
  onCampus: (v: string) => void
  phone?: string
}) {
  const saultOnly = school === "sault_college"
  const value = saultOnly ? "sault_ste_marie" : campus

  return (
    <>
      <Field
        label="Campus you will attend"
        hint={saultOnly ? "Sault College students attend the Sault Ste. Marie campus." : undefined}
      >
        <select
          name="campus"
          required
          value={value}
          onChange={(e) => onCampus(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Choose
          </option>
          {CAMPUSES.filter((c) => !saultOnly || c.value === "sault_ste_marie").map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Phone number" hint={PHONE_HINT}>
        <input
          name="phone"
          type="tel"
          required
          defaultValue={phone ?? ""}
          autoComplete="tel"
          maxLength={20}
          placeholder="(647) 740-6963"
          className={inputClass}
        />
      </Field>

      <div className="rounded-md border border-[var(--rule)] bg-[var(--raised)] p-4">
        <p className="text-sm text-foreground">Photos and video</p>
        <label className="mt-2 flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            name="media_consent"
            value="yes"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--bolt)]"
          />
          <span>{MEDIA_CONSENT_TEXT}</span>
        </label>
        <p className="mt-2 text-sm text-muted-foreground">
          This is required to take part. {MEDIA_CONSENT_NOTE}
        </p>
      </div>
    </>
  )
}
