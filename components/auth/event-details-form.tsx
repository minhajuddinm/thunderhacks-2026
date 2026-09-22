"use client"

import { useActionState, useState } from "react"
import { completeEventDetailsAction, type ActionState } from "@/app/auth/actions"
import { EventFields } from "./event-fields"
import { FormError, SubmitButton } from "./auth-shell"

export function EventDetailsForm({
  school,
  campus: initial,
  phone,
}: {
  school: string
  campus: string
  phone: string
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    completeEventDetailsAction,
    null
  )
  const [campus, setCampus] = useState(initial)

  return (
    <form action={action} className="space-y-5">
      <FormError message={state?.error} />
      <EventFields school={school} campus={campus} onCampus={setCampus} phone={phone} />
      <SubmitButton pending={pending}>Save and continue</SubmitButton>
    </form>
  )
}
