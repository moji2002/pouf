import clsx from 'clsx'
import { toneClass, type Tone } from './tone'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: SegmentedOption<T>[]
  /** Names the group for a screen reader — "Showing", "Mode". Required: a bare
   *  set of buttons announces no reason for existing. */
  label: string
  tone?: Tone
}

/** A mutually-exclusive choice: paper vs live, and similar.
 *
 * Replaces a row of Buttons that signalled selection with `tone={mode === m ?
 * 'purple' : 'blue'}` and nothing else. That was wrong twice over: colour was
 * the only carrier of which option was active (WCAG 2.2 SC 1.4.1, Level A), and
 * with no aria-pressed a screen reader announced two identical buttons and no
 * current state.
 *
 * The selected segment is pressed IN — translateY plus the active shadow. That
 * is depth, not hue, so it survives greyscale and any colour vision; and it is
 * the system's existing vocabulary for "engaged", being exactly what every
 * clay-btn already does on :active. RowCard sets the precedent for aria-pressed
 * as the selection signal.
 *
 * Generic in T so `<Segmented value={mode} .../>` keeps the union ('paper' |
 * 'live') end to end — passing an option this control cannot produce is a
 * compile error, not a runtime surprise.
 */
export function Segmented<T extends string>({ value, onChange, options, label, tone = 'blue' }: SegmentedProps<T>) {
  return (
    <div className="clay-seg" role="group" aria-label={label}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            className={clsx('clay-btn', 'clay-btn--sm', toneClass(tone), on && 'clay-seg__item--on')}
            aria-pressed={on}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
