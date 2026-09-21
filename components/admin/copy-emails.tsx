"use client"

import { useState } from "react"

/** Copies every address, comma-separated, ready to paste into Bcc. */
export function CopyEmails({ emails }: { emails: string[] }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(emails.join(", "))
          setDone(true)
          setTimeout(() => setDone(false), 2500)
        } catch {
          window.prompt("Copy these addresses:", emails.join(", "))
        }
      }}
      className="rounded-md border border-[var(--rule)] px-4 py-2 text-[15px] text-foreground transition-colors hover:border-[var(--bolt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
    >
      {done ? `Copied ${emails.length} addresses` : `Copy all ${emails.length} emails`}
    </button>
  )
}
