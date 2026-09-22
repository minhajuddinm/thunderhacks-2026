"use client"

import { useActionState, useState } from "react"
import { signUpAction, type ActionState } from "@/app/auth/actions"
import { SCHOOLS, YEARS, yearLabel } from "@/lib/registration"
import { EventFields } from "./event-fields"
import {
  AltAction,
  ErrorLink,
  Field,
  FormError,
  SubmitButton,
  inputClass,
} from "./auth-shell"

export function SignupForm({ allowOther = false }: { allowOther?: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    signUpAction,
    null
  )
  const [school, setSchool] = useState("")
  const [campus, setCampus] = useState("")

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-5">
      {/*
        Someone who already registered lands here by habit, so the error
        carries the two things they might actually want.
      */}
      <FormError message={state?.error}>
        {state?.code === "email_taken" ? (
          <>
            <ErrorLink href="/login">Log in</ErrorLink>
            {", or "}
            <ErrorLink href="/forgot-password">reset your password</ErrorLink>
            {" if you have forgotten it."}
          </>
        ) : null}
      </FormError>

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
            {SCHOOLS.filter((s) => allowOther || s.value !== "other").map((s) => (
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

      <EventFields school={school} campus={campus} onCampus={setCampus} />

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

      </form>

      <AltAction
        lead="Already registered?"
        href="/login"
        label="Log in"
      />
    </div>
  )
}