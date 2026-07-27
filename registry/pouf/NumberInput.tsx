import { cva } from 'class-variance-authority'
import { inputClasses } from './Input'
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { Icon } from './Icon'
import { normalizeOnBlur, sanitizeNumeric, stepValue } from './numberinput-math'

interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  step?: number
  min?: number
  max?: number
  id?: string
  describedBy?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  label?: string
}

/** A spinbutton composite replacing <input type="number">: the native spinner
 * can only be hidden, never restyled, and its arrows are sub-touch-size.
 * Deliberately NOT role="spinbutton" — that role on a text input is unreliable
 * across screen readers (react-aria's documented finding), so this stays a
 * plain labelled textbox and the stepping lives in two labelled buttons.
 *
 * The buttons are tabIndex={-1}, like the native spinner's arrows: keyboard
 * users already have ArrowUp/Down, PageUp/Down (±10×step) and Home/End on the
 * field itself, so tabbing through them would be two stops of pure noise. */
/* The capsule carries the field chrome; the input inside goes bare and the
 * focus ring moves up here (focus-within) to wrap the whole control, steppers
 * included. Invalid outranks focus-within, matching the original :has() rule's
 * higher specificity. The capsule fades for disabled; the bare input suppresses
 * its own fade so the value doesn't double-blur. */
const capsule = cva('pouf-numberinput flex items-center gap-1 h-14 px-2 py-0 rounded-pill bg-bg', {
  variants: {
    invalid: {
      false: 'cushion-field focus-within:[box-shadow:var(--pouf-field-focus)]',
      true: '[box-shadow:var(--pouf-field),inset_0_0_0_3px_var(--orange)]',
    },
    disabled: { true: 'opacity-55' },
  },
  defaultVariants: { invalid: false },
})

/* A scaled-down control cushion: full --pouf-control's 16px drop would bleed
 * past the capsule and read as smudge, not lift. The mini's 5px floor lip
 * paints inside the box, so a geometrically centred icon reads low — same
 * optical trick as the blob's glyph. touch-action: rapid taps must step, not
 * double-tap-zoom. */
const stepper = [
  'pouf-numberinput__btn flex-none inline-flex items-center justify-center w-10 h-10 p-0 border-none',
  'rounded-pill bg-purple text-[var(--on-accent)] cursor-pointer',
  '[box-shadow:inset_0_-5px_0_rgba(0,0,0,0.12),inset_0_3px_0_rgba(255,255,255,0.4),0_3px_6px_rgba(58,46,92,0.18)]',
  '[transition:box-shadow_120ms_ease,transform_120ms_ease] [touch-action:manipulation] select-none',
  '[&_svg]:[transform:translateY(-1px)]',
  'enabled:active:[transform:translateY(1px)] enabled:active:cushion-control-active',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:cushion-control-active disabled:[transform:translateY(1px)]',
].join(' ')


export function NumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  id,
  describedBy,
  placeholder,
  invalid,
  disabled,
  label,
}: NumberInputProps) {
  // Hold-to-repeat reads through a ref: the timer callback outlives the render
  // that armed it, and stepping from a stale value would rubber-band.
  const latest = useRef({ value, step, min, max, onChange })
  latest.current = { value, step, min, max, onChange }
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stop = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }
  useEffect(() => stop, [])

  const fire = (dir: 1 | -1) => {
    const { value, step, min, max, onChange } = latest.current
    const next = stepValue(value, dir, { step, min, max })
    // Parked at a bound: stop the repeat rather than tick forever. Once the
    // button disables at the bound it swallows pointer events, so the
    // pointerup that would normally clear this timer never arrives.
    if (next === value) {
      stop()
      return
    }
    onChange(next)
  }

  const press = (dir: 1 | -1) => (e: PointerEvent<HTMLButtonElement>) => {
    // Native spinners never move focus; preventDefault keeps it that way and
    // suppresses long-press selection on touch.
    e.preventDefault()
    fire(dir)
    const tick = () => {
      fire(dir)
      timer.current = setTimeout(tick, 60)
    }
    timer.current = setTimeout(tick, 400)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const apply = (dir: 1 | -1, mult = 1) => {
      e.preventDefault()
      onChange(stepValue(value, dir, { step, min, max, mult }))
    }
    if (e.key === 'ArrowUp') apply(1)
    else if (e.key === 'ArrowDown') apply(-1)
    else if (e.key === 'PageUp') apply(1, 10)
    else if (e.key === 'PageDown') apply(-1, 10)
    else if (e.key === 'Home' && min !== undefined) {
      e.preventDefault()
      onChange(String(min))
    } else if (e.key === 'End' && max !== undefined) {
      e.preventDefault()
      onChange(String(max))
    }
  }

  const parsed = Number.parseFloat(value)
  const atMin = min !== undefined && Number.isFinite(parsed) && parsed <= min
  const atMax = max !== undefined && Number.isFinite(parsed) && parsed >= max

  return (
    <div className={capsule({ invalid: !!invalid, disabled: !!disabled })}>
      <button
        type="button"
        className={stepper}
        aria-label="Decrease"
        tabIndex={-1}
        disabled={disabled || atMin}
        onPointerDown={press(-1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
      >
        <Icon name="flat" />
      </button>
      <input
        id={id}
        className={inputClasses({ bare: true, mono: true, invalid: !!invalid })}
        value={value}
        onChange={(e) => onChange(sanitizeNumeric(e.target.value))}
        onBlur={() => onChange(normalizeOnBlur(value, { min, max }))}
        onKeyDown={onKeyDown}
        inputMode="decimal"
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={label}
      />
      <button
        type="button"
        className={stepper}
        aria-label="Increase"
        tabIndex={-1}
        disabled={disabled || atMax}
        onPointerDown={press(1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
      >
        <Icon name="add" />
      </button>
    </div>
  )
}
