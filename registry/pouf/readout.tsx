import type { ReactNode } from 'react'
import { Card } from './surface'
import { Blob } from './media'
import { Text } from './text'
import type { IconLike } from './Icon'
import type { Tone } from './tone'

/** A headline figure on its own cushion.
 *
 * This existed twice, verbatim — `StatTile` in one screen and `Stat` in
 * another — and the copies had already drifted apart: one took the full Tone,
 * the other narrowed it to four. Divergent copies of one idea is the thing a
 * design system exists to stop, so it lives here now. It takes the full Tone;
 * the narrowed signature was the drift, not the intent.
 *
 * The tile leads with its own icon and tone because the block it replaced put
 * four unadorned numbers on one card, where "0", "0 / 0" and "+$0.00" all
 * carried identical weight and nothing said which one you actually came for.
 */
export function Stat({ label, value, icon, tone }: { label: string; value: string; icon: IconLike; tone: Tone }) {
  return (
    <Card variant="tight">
      <div className="pouf-stat flex items-center gap-(--s3)">
        <Blob tone={tone} size="sm" icon={icon} />
        <div className="pouf-stat__text flex flex-col gap-[2px] min-w-0">
          <span className="pouf-stat__label text-[12px] font-extrabold tracking-[1.4px] uppercase text-muted whitespace-nowrap">
            {label}
          </span>
          {/* dir="auto" for the same reason Text sets it: a value can be a
              non-Latin string (a person's name in a "top contributor" tile). */}
          <span
            className='pouf-stat__value text-[26px] font-black leading-[1.05] tracking-[-0.5px] text-ink [font-variant-numeric:tabular-nums] [font-feature-settings:"tnum"]'
            dir="auto"
          >
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
   * `{p.reviews > 0 ? `${pct}%` : '—'}` with the comment "A satisfaction score
   * over zero reviews is not 0% — it's unknown." Any site that forgot printed
   * "0%", which reads as "everybody hated it" — a real number, and the opposite
   * of the truth. The caller still decides *whether* a value is known; only that
   * answer needs domain knowledge. What is uniform, and therefore belongs here,
   * is how unknown looks. */
  value: ReactNode | null
  /** Tabular figures, so digits line up down a column. On by default: a metric
   *  is a number unless it isn't (a plan name, a region). */
  num?: boolean
  mono?: boolean
}

/** A labelled readout: small muted label, value beneath.
 *
 * A readout is atomic: "−$24.75" must never break after the minus, and a
 * two-line label reads as two metrics — hence nowrap; the ROW wraps whole
 * metrics instead. Inside a Row ([.pouf-row>&]) metrics divide the spare
 * width evenly (a KPI strip) but never below one-line content. */
export function Metric({ label, value, num = true, mono }: MetricProps) {
  return (
    <div className="pouf-metric flex flex-col gap-(--s1) min-w-0 whitespace-nowrap [.pouf-row>&]:flex-[1_1_0] [.pouf-row>&]:min-w-max">
      <Text size="sm" muted>
        {label}
      </Text>
      <Text num={num} mono={mono}>
        {value ?? '—'}
      </Text>
    </div>
  )
}
