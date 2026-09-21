"use client"

import { useEffect, useRef } from "react"
import { playThunder } from "@/lib/thunder"

type Bolt = { pts: [number, number][]; born: number; life: number }

/**
 * Click in the hero and lightning strikes where you clicked.
 *
 * Sits over the whole viewport but never intercepts anything: the canvas is
 * pointer-events-none and the listener is passive, so buttons, links and the
 * FAQ accordions all behave normally. It only draws when there is a live bolt,
 * so an idle page costs nothing.
 */
export function ClickLightning() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let running = true
    const bolts: Bolt[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const makeBolt = (ex: number, ey: number): Bolt => {
      const pts: [number, number][] = []
      const sx = ex + (Math.random() - 0.5) * w * 0.35
      const steps = 16
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const spread = (1 - t) * 70 + 6
        pts.push([
          sx + (ex - sx) * t + (Math.random() - 0.5) * spread,
          -20 + (ey + 20) * t + (Math.random() - 0.5) * 16,
        ])
      }
      return { pts, born: performance.now(), life: 460 }
    }

    const loop = (now: number) => {
      if (!running) return
      if (bolts.length === 0) {
        ctx.clearRect(0, 0, w, h)
        raf = 0
        return
      }
      raf = requestAnimationFrame(loop)
      ctx.clearRect(0, 0, w, h)

      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]
        const age = now - b.born
        if (age > b.life) {
          bolts.splice(i, 1)
          continue
        }
        const k = 1 - age / b.life

        if (age < 110) {
          ctx.fillStyle = `rgba(255,229,0,${0.07 * (1 - age / 110)})`
          ctx.fillRect(0, 0, w, h)
        }

        ctx.save()
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.shadowBlur = 22
        ctx.shadowColor = "rgba(255,229,0,0.95)"
        ctx.strokeStyle = `rgba(255,229,0,${0.9 * k})`
        ctx.lineWidth = 2.6
        ctx.beginPath()
        ctx.moveTo(b.pts[0][0], b.pts[0][1])
        for (const [px, py] of b.pts.slice(1)) ctx.lineTo(px, py)
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.strokeStyle = `rgba(255,255,255,${0.75 * k})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      }
    }

    const onDown = (e: PointerEvent) => {
      // Only the hero strikes. Further down the page a flash over the text
      // makes it hard to read, so clicks there do nothing.
      const hero = document.getElementById("top")
      if (!hero || !(e.target instanceof Node) || !hero.contains(e.target)) return
      bolts.push(makeBolt(e.clientX, e.clientY))
      if (bolts.length > 3) bolts.shift()
      playThunder(true)
      if (!raf) raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("pointerdown", onDown, { passive: true })

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  )
}
