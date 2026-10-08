"use client"

import { useActionState, useState } from "react"
import { judgeSignInAction, type JudgeState } from "./actions"
import { Field, FormError, SubmitButton, inputClass } from "@/components/auth/auth-shell"

type Judge = { id: string; full_name: string; title: string | null }

export function JudgeSignInForm({ judges }: { judges: Judge[] }) {
  const [state, action, pending] = useActionState<JudgeState, FormData>(judgeSignInAction, null)
  const [picked, setPicked] = useState("")

  return (
    <form action={action} className="space-y-6">
      <FormError message={state?.error} />

      <fieldset>
        <legend className="text-sm text-foreground">Who are you?</legend>
        <div className="mt-3 space-y-2">
          {judges.map((j) => (
            <label
              key={j.id}
              className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-[15px] transition-colors ${
                picked === j.id
                  ? "border-[var(--bolt)] text-foreground"
                  : "border-[var(--rule)] text-muted-foreground hover:border-[var(--bolt)]"
              }`}
            >
              <input
                type="radio"
                name="judge_id"
                value={j.id}
                checked={picked === j.id}
                onChange={() => setPicked(j.id)}
                className="h-4 w-4 accent-[var(--bolt)]"
                required
              />
              <span>
                <span className="th-display-tight text-foreground">{j.full_name}</span>
                {j.title ? (
                  <span className="block text-sm text-muted-foreground">{j.title}</span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Judging code" hint="Given to you by the organisers.">
        <input
          name="code"
          type="text"
          required
          autoComplete="off"
          autoCapitalize="characters"
          className={inputClass}
          placeholder="Code"
        />
      </Field>

      <SubmitButton pending={pending}>Start judging</SubmitButton>
    </form>
  )
}
