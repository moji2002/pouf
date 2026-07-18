/** Pure math for the clay NumberInput (spinbutton). String in, string out:
 * the component keeps the operator's typing verbatim, and stepping must never
 * smuggle float noise ("1.6000000000000001") into the field. Steps are UI
 * increments (0.1, 0.5, 1…) — steps that stringify in scientific notation
 * (< 1e-6) are out of scope. */

export interface StepOpts {
  step: number
  min?: number
  max?: number
  /** Integer multiplier (PageUp/PageDown = 10). Applied inside so the
   *  rounding precision stays the step's own — 10 × 0.07 is 0.7000000000000001
   *  as a float, and deriving decimals from THAT would leak the noise. */
  mult?: number
}

const decimalsOf = (n: number): number => {
  const s = String(n)
  const i = s.indexOf('.')
  return i === -1 ? 0 : s.length - i - 1
}

/** Decimals the operator has actually typed ("1.55" → 2, "1." → 0). */
const typedDecimals = (raw: string): number => {
  const i = raw.indexOf('.')
  return i === -1 ? 0 : raw.length - i - 1
}

/** Keep only characters a decimal underway can contain: digits, one leading
 * minus, one dot. Runs on every change, so pasted junk dies here too. */
export function sanitizeNumeric(raw: string): string {
  let out = ''
  let seenDot = false
  for (const ch of raw) {
    if (ch >= '0' && ch <= '9') out += ch
    else if (ch === '-' && out === '') out += ch
    else if (ch === '.' && !seenDot) {
      seenDot = true
      out += ch
    }
  }
  return out
}

/** One stepper press / arrow key: ± mult × step, clamped to [min, max],
 * rounded to the finer of the step's and the typed value's precision so the
 * result is exact for the increments this UI uses. Empty or unparseable
 * text steps TO min ?? 0 rather than past it. */
export function stepValue(current: string, dir: 1 | -1, { step, min, max, mult = 1 }: StepOpts): string {
  const parsed = Number.parseFloat(current)
  let next = Number.isFinite(parsed) ? parsed + dir * mult * step : (min ?? 0)
  if (min !== undefined && next < min) next = min
  if (max !== undefined && next > max) next = max
  const places = Math.max(decimalsOf(step), typedDecimals(current))
  let out = next.toFixed(places)
  // toFixed pads ("1.60") and can print "-0.0" for float dust below zero.
  if (out.includes('.')) out = out.replace(/0+$/, '').replace(/\.$/, '')
  if (out.startsWith('-') && Number(out) === 0) out = out.slice(1)
  return out
}

/** At rest the field holds a canonical number or nothing: "1." → "1",
 * lone "-"/"." → "", out-of-range → the nearest bound. */
export function normalizeOnBlur(raw: string, { min, max }: { min?: number; max?: number }): string {
  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed)) return ''
  let v = parsed
  if (min !== undefined && v < min) v = min
  if (max !== undefined && v > max) v = max
  return String(v)
}
