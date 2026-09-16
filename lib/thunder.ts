/**
 * Synthesised thunder.
 *
 * No audio file and no licensing: a burst of filtered noise with a long decay
 * reads as thunder, and a short band-passed crack on top reads as a close
 * strike. Everything here is generated in the browser at play time.
 *
 * Audio is off until the reader turns it on, and the AudioContext is only
 * constructed inside that click, which is what browser autoplay policy wants.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = false
let noiseBuffer: AudioBuffer | null = null

const STORAGE_KEY = "th-thunder-audio"

function makeNoise(context: AudioContext): AudioBuffer {
  const seconds = 3
  const length = context.sampleRate * seconds
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)
  // Brown-ish noise: smoother and lower than white, closer to a real rumble.
  let last = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.2
  }
  return buffer
}

/** Called from the toggle, inside the user's click. */
export function setThunderEnabled(next: boolean) {
  enabled = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off")
  } catch {
    // Private windows and blocked site data both throw here. Not important.
  }

  if (!next) return
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = 0.28
    master.connect(ctx.destination)
    noiseBuffer = makeNoise(ctx)
  }
  void ctx.resume()
}

export function getStoredPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on"
  } catch {
    return false
  }
}

export function isThunderEnabled() {
  return enabled
}

/**
 * @param near  A strike the reader triggered. Louder, with a crack on top and
 *              almost no delay. Ambient strikes roll in from further away.
 */
export function playThunder(near = false) {
  if (!enabled || !ctx || !master || !noiseBuffer) return
  if (ctx.state === "suspended") void ctx.resume()

  const now = ctx.currentTime
  // Distant thunder arrives after its flash. Close thunder is near-instant.
  const delay = near ? 0.04 : 0.25 + Math.random() * 0.7

  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  src.playbackRate.value = near ? 1 : 0.75

  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.setValueAtTime(near ? 900 : 420, now + delay)
  lp.frequency.exponentialRampToValueAtTime(90, now + delay + 2.2)
  lp.Q.value = 0.7

  const body = ctx.createGain()
  const peak = near ? 1 : 0.55
  body.gain.setValueAtTime(0.0001, now + delay)
  body.gain.exponentialRampToValueAtTime(peak, now + delay + (near ? 0.02 : 0.12))
  body.gain.exponentialRampToValueAtTime(0.0001, now + delay + (near ? 2.4 : 3.0))

  src.connect(lp)
  lp.connect(body)
  body.connect(master)
  src.start(now + delay)
  src.stop(now + delay + 3.2)

  if (!near) return

  // The crack: a brief high burst that only happens when it lands close.
  const crack = ctx.createBufferSource()
  crack.buffer = noiseBuffer
  crack.playbackRate.value = 1.8

  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.setValueAtTime(2600, now + delay)
  bp.frequency.exponentialRampToValueAtTime(700, now + delay + 0.28)
  bp.Q.value = 1.1

  const cg = ctx.createGain()
  cg.gain.setValueAtTime(0.0001, now + delay)
  cg.gain.exponentialRampToValueAtTime(0.6, now + delay + 0.012)
  cg.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45)

  crack.connect(bp)
  bp.connect(cg)
  cg.connect(master)
  crack.start(now + delay)
  crack.stop(now + delay + 0.6)
}
