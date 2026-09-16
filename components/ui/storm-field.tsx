"use client"

import { useEffect, useRef } from "react"
import { playThunder } from "@/lib/thunder"

type Bolt = { pts: [number, number][]; born: number; life: number }

/**
 * Interactive storm behind the hero.
 *
 * Two things happen. A charged glow tracks the pointer with some lag, so the
 * background answers the reader's hand. And bolts strike on their own every few
 * seconds, or immediately wherever the reader clicks or taps.
 *
 * It is the one place on the site allowed to be loud. It stops drawing when the
 * tab is hidden or the hero is scrolled away, and it does not run at all for
 * readers who ask for reduced motion.
 */
export function StormField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let running = true

    // Pointer target and the lagging glow that chases it.
    const target = { x: 0.5, y: 0.35 }
    const glow = { x: 0.5, y: 0.35 }

    const bolts: Bolt[] = []
    let nextStrike = performance.now() + 1800

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    /** A jagged path from a start point, forking as it descends. */
    const makeBolt = (sx: number, sy: number, ex: number, ey: number): Bolt => {
      const pts: [number, number][] = [[sx, sy]]
      const steps = 14
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const spread = (1 - t) * 60 + 8
        pts.push([
          sx + (ex - sx) * t + (Math.random() - 0.5) * spread,
          sy + (ey - sy) * t + (Math.random() - 0.5) * 18,
        ])
      }
      return { pts, born: performance.now(), life: 420 }
    }

    const strike = (x?: number, y?: number, near = false) => {
      const ex = x ?? Math.random() * w
      const ey = y ?? h * (0.55 + Math.random() * 0.4)
      const sx = ex + (Math.random() - 0.5) * w * 0.3
      bolts.push(makeBolt(sx, -20, ex, ey))
      if (bolts.length > 4) bolts.shift()
      // Silent unless the reader has turned thunder on.
      playThunder(near)
    }

    const draw = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(draw)
      if (!visible) return

      ctx.clearRect(0, 0, w, h)

      // Charged glow, easing toward the pointer.
      glow.x += (target.x - glow.x) * 0.06
      glow.y += (target.y - glow.y) * 0.06
      const gx = glow.x * w
      const gy = glow.y * h
      const radius = Math.max(w, h) * 0.42
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius)
      g.addColorStop(0, "rgba(139,59,255,0.30)")
      g.addColorStop(0.45, "rgba(112,0,255,0.10)")
      g.addColorStop(1, "rgba(112,0,255,0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      if (now > nextStrike) {
        strike()
        nextStrike = now + 3200 + Math.random() * 4200
      }

      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        const age = now - b.born
        if (age > b.life) {
          bolts.splice(i, 1)
          continue
        }
        const k = 1 - age / b.life
        // Flash the sky briefly as the bolt lands.
        if (age < 90) {
          ctx.fillStyle = `rgba(255,229,0,${0.05 * (1 - age / 90)})`
          ctx.fillRect(0, 0, w, h)
        }
        ctx.save()
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.shadowBlur = 18
        ctx.shadowColor = "rgba(255,229,0,0.9)"
        ctx.strokeStyle = `rgba(255,229,0,${0.85 * k})`
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(b.pts[0][0], b.pts[0][1])
        for (const [px, py] of b.pts.slice(1)) ctx.lineTo(px, py)
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.strokeStyle = `rgba(255,255,255,${0.7 * k})`
        ctx.lineWidth = 0.9
        ctx.stroke()
        ctx.restore()
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.x = (e.clientX - rect.left) / rect.width
      target.y = (e.clientY - rect.top) / rect.height
    }

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      strike(e.clientX - rect.left, e.clientY - rect.top, true)
    }

    const onVisibility = () => {
      visible = !document.hidden
    }

    resize()
    raf = requestAnimationFrame(draw)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    canvas.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <>
      {/* Static fallback: always painted, so the hero is never a flat black box. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 60% at 50% 0%, rgba(139,59,255,0.22) 0%, transparent 72%)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
    </>
  )
}
