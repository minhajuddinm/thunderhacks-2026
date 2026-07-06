import { cn } from "@/lib/utils"

/**
 * Aurora background inspired by Aceternity UI (MIT).
 * Pure CSS animation (see .th-aurora in globals.css) so it adds no JS to the
 * bundle and automatically stops under prefers-reduced-motion.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="th-aurora absolute -inset-[20%] opacity-70 blur-2xl" />
      {/* Subtle grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(112,0,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(112,0,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Vignette so foreground text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />
    </div>
  )
}
