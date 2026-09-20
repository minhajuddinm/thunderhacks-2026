"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signInAction, type ActionState } from "@/app/auth/actions"
import {
  AltAction,
  ErrorLink,
  Field,
  FormError,
  SubmitButton,
  inputClass,
} from "./auth-shell"

export function LoginForm({ canSignUp }: { canSignUp: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    signInAction,
    null
  )

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-5">
        {/*
          Supabase cannot tell a wrong password from an address that has no
          account, so a failed login offers both ways out instead of guessing
          which one the person needs.
        */}
        <FormError message={state?.error}>
          {state?.code === "bad_credentials" ? (
            <>
              <ErrorLink href="/forgot-password">Reset your password</ErrorLink>
              {canSignUp ? (
                <>
                  {", or "}
                  <ErrorLink href="/signup">register</ErrorLink>
                  {" if you have not yet."}
                </>
              ) : (
                "."
              )}
            </>
          ) : null}
        </FormError>

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

        <p className="text-[15px] text-muted-foreground">
          <Link
            href="/forgot-password"
            className="text-[var(--bolt)] underline underline-offset-4"
          >
            Forgotten your password?
          </Link>
        </p>
      </form>

      {canSignUp ? (
        <AltAction
          lead="No account yet? Registering takes about a minute."
          href="/signup"
          label="Register"
        />
      ) : null}
    </div>
  )
}
