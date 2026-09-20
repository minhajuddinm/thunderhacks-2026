"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { signUpAction, type ActionState } from "@/app/auth/actions"
import { SCHOOLS, YEARS, yearLabel } from "@/lib/registration"
import { Field, FormError, SubmitButton, inputClass } from "./auth-shell"

export function SignupForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    signUpAction,
    null
  )
  const [school, setSchool] = useState("")

  return (
    <form action={action} className="space-y-5">
      <FormError message={state?.error} />

      <Field label="Full name">
        <input
          name="full_name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field label="Programme" hint="For example Computer Science, or Business">
        <input
          name="program"
          type="text"
          required
          minLength={2}
          maxLength={80}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Year of study">
          <select name="year_of_study" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Choose
            </option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {yearLabel(y)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="School">
          <select
            name="school"
            required
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Choose
            </option>
            {SCHOOLS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {school === "other" ? (
        <Field label="Which school?" hint="The name you would put on a form">
          <input
            name="school_other"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="organization"
            className={inputClass}
          />
        </Field>
      ) : null}

      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <Field label="Password" hint="At least 8 characters">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      <SubmitButton pending={pending}>Create account</SubmitButton>

      <p className="text-[15px] text-muted-foreground">
        Already registered?{" "}
        <Link href="/login" className="text-[var(--bolt)] underline underline-offset-4">
          Log in
        </Link>
      </p>
    </form>
  )
}
