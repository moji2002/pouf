import clsx from 'clsx'
import { type Tone } from './tone'
import { buttonClasses } from './Button'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: SegmentedOption<T>[]
  /** Names the group for a screen reader — "Showing", "View". Required: a bare
   *  set of buttons announces no reason for existing. */
  label: string
  tone?: Tone
}

/** A mutually-exclusive choice: grid vs list, draft vs live, and similar.
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
 * pouf-btn already does on :active. RowCard sets the precedent for aria-pressed
 * as the selection signal.
 *
 * Generic in T so `<Segmented value={view} .../>` keeps the union ('grid' |
 * 'list') end to end — passing an option this control cannot produce is a
 * compile error, not a runtime surprise.
 */
export function Segmented<T extends string>({ value, onChange, options, label, tone = 'blue' }: SegmentedProps<T>) {
  return (
    <div className="pouf-seg inline-flex gap-(--s2)" role="group" aria-label={label}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            className={clsx(buttonClasses({ size: 'sm', tone }), /* Pressed IN, not recoloured: depth is the system's word for engaged (SC
             * 1.4.1 — tone alone vanishes in greyscale). aria-pressed carries it. */
            'aria-pressed:[transform:translateY(2px)] aria-pressed:cushion-control-active')}
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
