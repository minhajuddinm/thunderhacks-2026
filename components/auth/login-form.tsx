"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signInAction, type ActionState } from "@/app/auth/actions"
import { Field, FormError, SubmitButton, inputClass } from "./auth-shell"

export function LoginForm({ canSignUp }: { canSignUp: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    signInAction,
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

      <Field label="Password">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      <SubmitButton pending={pending}>Log in</SubmitButton>

      {canSignUp ? (
        <p className="text-[15px] text-muted-foreground">
          No account yet?{" "}
          <Link href="/signup" className="text-[var(--bolt)] underline underline-offset-4">
            Register
          </Link>
        </p>
      ) : null}
    </form>
  )
}
