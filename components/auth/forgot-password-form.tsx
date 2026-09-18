"use client"

import { useActionState } from "react"
import { requestPasswordResetAction, type ActionState } from "@/app/auth/actions"
import { Field, FormError, SubmitButton, inputClass } from "./auth-shell"

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    requestPasswordResetAction,
    null
  )

  return (
    <form action={action} className="space-y-5">
      <FormError message={state?.error} />

      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <SubmitButton pending={pending}>Send me a reset link</SubmitButton>
    </form>
  )
}
