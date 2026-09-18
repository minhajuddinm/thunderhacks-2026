"use client"

import { useActionState } from "react"
import { updatePasswordAction, type ActionState } from "@/app/auth/actions"
import { Field, FormError, SubmitButton, inputClass } from "./auth-shell"

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updatePasswordAction,
    null
  )

  return (
    <form action={action} className="space-y-5">
      <FormError message={state?.error} />

      <Field label="New password" hint="At least 8 characters.">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      <Field label="New password again">
        <input
          name="confirm_password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      <SubmitButton pending={pending}>Set my new password</SubmitButton>
    </form>
  )
}
