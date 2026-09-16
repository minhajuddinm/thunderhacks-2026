"use client"

import { useEffect, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import {
  getStoredPreference,
  playThunder,
  setThunderEnabled,
} from "@/lib/thunder"

/**
 * Sound is off until asked for. The AudioContext is built inside this click,
 * which is what autoplay policy requires, and the choice is remembered per
 * browser. Turning it on plays one strike so the reader knows it worked.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = getStoredPreference()
    if (stored) {
      // A stored "on" still needs a gesture before audio will play, so the
      // button shows as on and the context wakes on the reader's first click.
      setOn(true)
      setThunderEnabled(true)
    }
  }, [])

  if (!mounted) return null

  const toggle = () => {
    const next = !on
    setOn(next)
    setThunderEnabled(next)
    if (next) playThunder(true)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-[#23283a] bg-[#0B0E14]/90 px-3.5 py-2.5 text-sm text-[#9ca3af] backdrop-blur transition-colors hover:text-[#F8F9FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE500]"
    >
      {on ? (
        <Volume2 className="h-4 w-4 text-[#FFE500]" aria-hidden="true" />
      ) : (
        <VolumeX className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{on ? "Thunder on" : "Thunder off"}</span>
    </button>
  )
}
