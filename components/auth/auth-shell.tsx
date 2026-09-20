import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"

/** Shared frame for the signup and login pages. */
export function AuthShell({
  title,
  lead,
  children,
  footer,
}: {
  title: string
  lead?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16 sm:px-8"
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--bolt)]"
      >
        <Image
          src="/images/th-logo.png"
          alt=""
          width={34}
          height={34}
          className="h-[34px] w-[34px] object-contain"
        />
        <span className="th-display-tight text-[17px] text-foreground">
          ThunderHacks <span className="text-[var(--bolt)]">II</span>
        </span>
      </Link>

      <div className="mt-8 w-full max-w-md">
        <div className="th-rule mb-5 w-12" aria-hidden="true" />
        <h1 className="th-display text-[clamp(1.75rem,5vw,2.5rem)] text-foreground">
          {title}
        </h1>
        {lead ? (
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {lead}
          </p>
        ) : null}

        <div className="mt-8">{children}</div>

        {footer ? (
          <div className="mt-6 text-[15px] text-muted-foreground">{footer}</div>
        ) : null}
      </div>
    </main>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm text-foreground">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>
      ) : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

export const inputClass =
  "w-full rounded-md border border-[var(--rule)] bg-[var(--raised)] px-3.5 py-2.5 text-[15px] text-foreground " +
  "placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"

export function FormError({
  message,
  children,
}: {
  message?: string
  children?: ReactNode
}) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="rounded-md border border-[#7f1d1d] bg-[#2a1214] px-3.5 py-2.5 text-[15px] text-[#fca5a5]"
    >
      <p>{message}</p>
      {children ? <p className="mt-1.5">{children}</p> : null}
    </div>
  )
}

/** A link that stays readable against the error panel. */
export function ErrorLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-[#fecaca] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
    >
      {children}
    </Link>
  )
}

/** The big secondary action under a form, for the other thing people want. */
export function AltAction({
  lead,
  href,
  label,
}: {
  lead: string
  href: string
  label: string
}) {
  return (
    <div className="border-t border-[var(--rule)] pt-5">
      <p className="text-[15px] text-muted-foreground">{lead}</p>
      <Link
        href={href}
        className="mt-3 inline-block w-full rounded-md border border-[var(--rule)] px-6 py-3 text-center font-semibold text-foreground transition-colors hover:border-[var(--bolt)] hover:text-[var(--bolt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)] sm:w-auto sm:px-10"
      >
        {label}
      </Link>
    </div>
  )
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean
  children: ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--bolt)] px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bolt)]"
    >
      {pending ? "Working..." : children}
    </button>
  )
}
