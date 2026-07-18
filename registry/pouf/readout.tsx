import type { ReactNode } from 'react'
import { Card } from './surface'
import { Blob } from './media'
import { Text } from './text'
import type { IconName } from './Icon'
import type { Tone } from './tone'

/** A headline figure on its own cushion.
 *
 * This existed twice, verbatim — `StatTile` in performance.tsx and `Stat` in
 * overview.tsx — and the copies had already drifted apart: one took the full
 * Tone, the other narrowed it to four. Divergent copies of one idea is the
 * thing a design system exists to stop, so it lives here now. It takes the full
 * Tone; the narrowed signature was the drift, not the intent.
 *
 * The tile leads with its own icon and tone because the block it replaced put
 * four unadorned numbers on one card, where "0", "0 / 0" and "+$0.00" all
 * carried identical weight and nothing said which answered "am I making money".
 */
export function Stat({ label, value, icon, tone }: { label: string; value: string; icon: IconName; tone: Tone }) {
  return (
    <Card variant="tight">
      <div className="pouf-stat">
        <Blob tone={tone} size="sm" icon={icon} />
        <div className="pouf-stat__text">
          <span className="pouf-stat__label">{label}</span>
          {/* dir="auto" for the same reason Text sets it: a value can be a
              non-Latin string (a channel name in a "top source" tile). */}
          <span className="pouf-stat__value" dir="auto">
            {value}
          </span>
        </div>
      </div>
    </Card>
  )
}

interface MetricProps {
  label: string
  /** `null` means UNKNOWN, and renders as an em-dash — never as 0.
   *
   * This is the whole reason the component exists. The pattern it replaces was
   * hand-written at ~34 sites, each re-deriving the rule, e.g.
   * `{c.trades > 0 ? `${pct}%` : '—'}` with the comment "A win rate over zero
   * closed trades is not 0% — it's unknown." Any site that forgot printed "0%",
   * which reads as "this channel always loses" — a real number, and the
   * opposite of the truth. The caller still decides *whether* a value is known;
   * only that answer needs domain knowledge. What is uniform, and therefore
   * belongs here, is how unknown looks. */
  value: ReactNode | null
  /** Tabular figures, so digits line up down a column. On by default: a metric
   *  is a number unless it isn't (sizing mode, exchange name). */
  num?: boolean
  mono?: boolean
}

/** A labelled readout: small muted label, value beneath. Carries its own class
 * so a Row of metrics reads as a KPI strip (see .pouf-metric in pouf.css). */
export function Metric({ label, value, num = true, mono }: MetricProps) {
  return (
    <div className="pouf-metric">
      <Text size="sm" muted>
        {label}
      </Text>
      <Text num={num} mono={mono}>
        {value ?? '—'}
      </Text>
    </div>
  )
}
