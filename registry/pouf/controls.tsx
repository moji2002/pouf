import * as RSelect from '@radix-ui/react-select'
import * as RSwitch from '@radix-ui/react-switch'
import * as RTooltip from '@radix-ui/react-tooltip'
import * as RAlert from '@radix-ui/react-alert-dialog'
import * as RDialog from '@radix-ui/react-dialog'
import * as RPopover from '@radix-ui/react-popover'
import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from './Button'
import { Icon } from './Icon'
import { inputClasses } from './Input'
import { Row, Stack } from './layout'
import { Heading, Text } from './text'
import type { Tone } from './tone'

/* Radix supplies the behaviour (focus traps, typeahead, escape handling,
 * aria wiring); pouf.css supplies the skin. We never restyle Radix inline —
 * each part gets a pouf class, so a token change reaches inside the overlays
 * exactly like it reaches the page. */

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  id?: string
  describedBy?: string
  placeholder?: string
  disabled?: boolean
  label?: string
}

export function Select({ value, onChange, options, id, describedBy, placeholder, disabled, label }: SelectProps) {
  return (
    <RSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
      <RSelect.Trigger
        id={id}
        className={`${inputClasses()} flex flex-row items-center flex-wrap min-w-0 gap-[var(--gap,var(--s4))] justify-between`}
        aria-describedby={describedBy}
        aria-label={label}
      >
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon>
          <Icon name="expand" size="sm" />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content className="pouf-popover pouf-popover--select" position="popper" sideOffset={8}>
          <RSelect.Viewport>
            {options.map((o) => (
              <RSelect.Item key={o.value} value={o.value} className="pouf-option">
                <RSelect.ItemText>{o.label}</RSelect.ItemText>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  )
}

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  describedBy?: string
  disabled?: boolean
  label?: string
}

export function Switch({ checked, onChange, id, describedBy, disabled, label }: SwitchProps) {
  return (
    <RSwitch.Root
      id={id}
      className={[
        'pouf-switch group w-[60px] h-[34px] rounded-pill bg-bg border-none p-[3px] cursor-pointer',
        'cushion-field flex-none [transition:background_160ms_ease]',
        'data-[state=checked]:bg-mint disabled:opacity-50 disabled:cursor-not-allowed',
      ].join(' ')}
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      aria-describedby={describedBy}
      aria-label={label}
    >
      <RSwitch.Thumb className={[
          'pouf-switch__thumb block w-7 h-7 rounded-[50%] bg-surface',
          '[box-shadow:inset_0_-3px_0_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.9),0_4px_8px_rgba(58,46,92,0.2)]',
          '[transition:transform_160ms_cubic-bezier(0.2,0.9,0.3,1.3)] [transform:translateX(0)]',
          'group-data-[state=checked]:[transform:translateX(26px)]',
        ].join(' ')} />
    </RSwitch.Root>
  )
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RTooltip.Provider delayDuration={300}>{children}</RTooltip.Provider>
}

/** Tooltip owns its anchor rather than asChild-ing onto its child.
 *
 * `asChild` clones the child and merges handlers, aria-* and a ref onto it. No
 * pouf primitive can receive any of that: they take closed prop lists and
 * forward no ref, which is the same rule that guarantees no primitive accepts a
 * className. So `<RTooltip.Trigger asChild>{children}</RTooltip.Trigger>`
 * dropped every prop on the floor and the tooltip never opened — on anything.
 * It looked fine because the one call site that mattered had
 * hand-wrapped its Switch in a raw <span>, which is what actually made it work.
 *
 * Anchoring here instead of forwarding props in Button/Switch also handles the
 * case prop-forwarding cannot: a disabled control fires no pointer events at
 * all (HTML, not Radix), so only an element *around* it can carry the hover.
 *
 * Known limit: Radix puts aria-describedby on the trigger, which is now this
 * span rather than the control. The tip is a supplementary visual affordance —
 * controls carry their own accessible names via `label` — but a screen reader
 * focusing the child will not hear the tip. Fixing that properly means opening
 * the primitives' prop surface, which trades a real guarantee for a small win.
 * Covered by the gallery snapshot gate, including the disabled case.
 */
export function Tooltip({ tip, children }: { tip: string; children: ReactNode }) {
  return (
    <RTooltip.Root>
      <RTooltip.Trigger asChild>
        <span className="pouf-tip-anchor">{children}</span>
      </RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content className="pouf-tooltip" sideOffset={8}>
          {tip}
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  )
}

interface DialogProps {
  /** The element that opens it. */
  trigger: ReactNode
  title: string
  description?: string
  children: ReactNode
  /** Controlled open state — needed when the dialog must close in response to
   *  something inside it (picking an item), not just the close button. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  size?: 'md' | 'lg'
}

/** A plain modal (Radix Dialog), distinct from Confirm (Radix AlertDialog).
 *
 * The distinction is behavioural, not cosmetic: an alert dialog is for a
 * decision with consequences — it takes focus assertively and cannot be
 * dismissed by clicking outside. This one is for browsing, so it dismisses
 * easily. Using AlertDialog to show a plain list would train the user to
 * dismiss the same chrome that later asks them to confirm something destructive.
 */
export function Dialog({ trigger, title, description, children, open, onOpenChange, size = 'md' }: DialogProps) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Trigger asChild>{trigger}</RDialog.Trigger>
      <RDialog.Portal>
        {/* Enter AND exit are CSS animations keyed off Radix's data-state. Radix's
            own Presence keeps the node mounted until the [data-state='closed']
            animation finishes, so the close animates without framer — and without
            framer's inline transform, the CSS translate(-50%,-50%) centring holds
            through both. (prefers-reduced-motion is honoured globally in pouf.css.) */}
        <RDialog.Overlay className="pouf-overlay" />
        <RDialog.Content className={size === 'lg' ? 'pouf-dialog pouf-dialog--lg' : 'pouf-dialog'}>
          <Stack gap={4}>
            <div className="pouf-dialog__head">
              <Stack gap={1}>
                <RDialog.Title asChild>
                  <div>
                    <Heading level={3}>{title}</Heading>
                  </div>
                </RDialog.Title>
                {description && (
                  <RDialog.Description asChild>
                    <div>
                      <Text size="sm" muted>
                        {description}
                      </Text>
                    </div>
                  </RDialog.Description>
                )}
              </Stack>
              <RDialog.Close asChild>
                <Button variant="quiet" size="sm" label="Close">
                  <Icon name="close" size="sm" />
                </Button>
              </RDialog.Close>
            </div>
            <div className="pouf-dialog__body">{children}</div>
          </Stack>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  )
}

interface ConfirmProps {
  children: ReactNode
  title: string
  body: string
  /** Must name the outcome, not agree with a question: "Close 3 positions",
   *  never "Yes"/"OK". */
  confirmLabel: string
  /** Must name the opposite outcome: "Keep positions open", never "Cancel".
   *  Required, because a sensible default here does not exist — only the caller
   *  knows what NOT doing the thing means. */
  cancelLabel: string
  onConfirm: () => void
  tone?: Tone
  loading?: boolean
  /** The specific records this will affect — symbols, sizes, live P&L. */
  details?: ReactNode
}

/** Every irreversible action routes through here — delete an account, empty a
 * trash, revoke a key, disconnect an integration. Radix gives the focus trap
 * and escape handling.
 *
 * The API is shaped by NN/g's confirmation-dialog guidance, which is why it
 * looks stricter than a typical confirm:
 *   - Yes/No is banned by construction: both labels are required strings, so a
 *     caller cannot ship "Are you sure? [Yes] [No]" without deliberately typing
 *     something worse than the alternative.
 *   - `details` exists because "Delete all items?" is not answerable. "Delete
 *     Invoice #1042 and Invoice #1043 (both paid)" is.
 *   - Cancel is the default focus and sits away from confirm (Fitts, inverted):
 *     the safe option should be the easy one to hit.
 * Confirmation is used here only because undo is genuinely impossible. Overusing
 * it would train the user to click through, which is the failure mode NN/g warns of.
 */
export function Confirm({
  children,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  tone = 'orange',
  loading,
  details,
}: ConfirmProps) {
  return (
    <RAlert.Root>
      <RAlert.Trigger asChild>{children}</RAlert.Trigger>
      <RAlert.Portal>
        {/* Enter/exit via Radix data-state CSS animations — same reasoning as Dialog. */}
        <RAlert.Overlay className="pouf-overlay" />
        <RAlert.Content className="pouf-dialog">
          <Stack gap={4}>
            <RAlert.Title asChild>
              <div>
                <Heading level={3}>{title}</Heading>
              </div>
            </RAlert.Title>
            <RAlert.Description asChild>
              <div>
                <Text muted>{body}</Text>
              </div>
            </RAlert.Description>
            {details}
            <Row gap={3} justify="end">
              <RAlert.Cancel asChild>
                <Button variant="quiet" size="sm">
                  {cancelLabel}
                </Button>
              </RAlert.Cancel>
              <RAlert.Action asChild>
                <Button tone={tone} size="sm" onClick={onConfirm} loading={loading}>
                  {confirmLabel}
                </Button>
              </RAlert.Action>
            </Row>
          </Stack>
        </RAlert.Content>
      </RAlert.Portal>
    </RAlert.Root>
  )
}

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  /** The ids fetched from the provider. `[]` is a valid working state, not an error:
   *  an endpoint with no /models leaves this empty and the field must still work. */
  options: string[]
  loading?: boolean
  /** Why the list is missing. Rendered inside the popover; never blocks typing. */
  error?: string
  /** Fired on open — the caller uses it to trigger the lazy fetch. */
  onOpen?: () => void
  id?: string
  describedBy?: string
  placeholder?: string
  mono?: boolean
  /** Accessible name when the control is not wrapped in Field. */
  label?: string
}

/** A typeable select: pick from the provider's list, or type an id it doesn't offer.
 *
 * The one pouf primitive with hand-rolled keyboard nav, because Radix ships no
 * combobox and Select cannot take arbitrary text. Radix Popover still supplies the
 * parts that are easy to get wrong — portalling, escape, outside-click, focus return
 * to the trigger — so only the arrow/enter handling is ours.
 *
 * Typing is not a fallback bolted on for one edge case; it is the contract.
 * A source of options may not exist yet, may 404, may be unreachable, or may simply
 * not include the value the user needs. In every one of those cases this degrades
 * to the free-text input it replaced, which is why `error` never disables it.
 */
export function Combobox({
  value,
  onChange,
  options,
  loading,
  error,
  onOpen,
  id,
  describedBy,
  placeholder,
  mono,
  label,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listboxId = useId()
  const optionPrefix = useId()

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? options.filter((o) => o.toLowerCase().includes(q)) : options
  }, [options, query])

  const typed = query.trim()
  const canCreate = typed.length > 0 && !options.includes(typed)
  const createIndex = shown.length
  const optionCount = shown.length + (canCreate ? 1 : 0)
  const activeIndex = optionCount > 0 ? Math.min(active, optionCount - 1) : -1
  const activeOptionId =
    activeIndex < 0
      ? undefined
      : activeIndex === createIndex && canCreate
        ? `${optionPrefix}-create`
        : `${optionPrefix}-${activeIndex}`

  const commit = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const max = optionCount - 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (max >= 0) setActive((i) => Math.min(i + 1, max))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (canCreate && activeIndex === createIndex) commit(typed)
      else if (shown[activeIndex] !== undefined) commit(shown[activeIndex])
    }
  }

  return (
    <RPopover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) {
          setQuery('')
          setActive(0)
          onOpen?.()
        }
      }}
    >
      <RPopover.Trigger asChild>
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-describedby={describedBy}
          aria-label={label}
          className={clsx(
            inputClasses({ mono }),
            /* Row's layout, inlined: the trigger borrowed .pouf-row classes,
             * which no longer exist as CSS rules after layout.tsx migrated. */
            'flex flex-row items-center flex-wrap min-w-0 gap-[var(--gap,var(--s4))] justify-between',
          )}
        >
          <span className={clsx(!value && 'pouf-combobox__placeholder')}>{value || placeholder}</span>
          <Icon name="expand" size="sm" />
        </button>
      </RPopover.Trigger>
      <RPopover.Portal>
        <RPopover.Content className="pouf-popover pouf-popover--combobox" sideOffset={8} align="start">
          <input
            className={inputClasses({ mono })}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Search, or type a value…"
            role="combobox"
            aria-label={label ? `Search ${label}` : 'Search options'}
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <div className="pouf-combobox__list" id={listboxId} role="listbox" aria-busy={loading || undefined}>
            {loading && <div className="pouf-combobox__note" role="status" aria-live="polite">Loading options…</div>}
            {!loading && error && <div className="pouf-combobox__note" role="status" aria-live="polite">{error}</div>}
            {!loading &&
              shown.map((o, i) => (
                <button
                  key={o}
                  id={`${optionPrefix}-${i}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={o === value}
                  // Set by hand because these rows are plain buttons, not Radix Select
                  // items — this is what lets them reuse .pouf-option's existing skin
                  // (pouf.css nav-link section) instead of duplicating it.
                  data-highlighted={i === active ? '' : undefined}
                  data-state={o === value ? 'checked' : undefined}
                  // .pouf-option already supplies flex/align/gap; only the
                  // right-pushed check needs justify-between (+ wrap/min-w-0).
                  className="pouf-option flex-wrap min-w-0 justify-between"
                  onClick={() => commit(o)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span>{o}</span>
                  {o === value && <Icon name="ok" size="sm" />}
                </button>
              ))}
            {canCreate && (
              <button
                type="button"
                id={`${optionPrefix}-create`}
                role="option"
                tabIndex={-1}
                aria-selected={false}
                data-highlighted={active === createIndex ? '' : undefined}
                className="pouf-option"
                onClick={() => commit(typed)}
                onMouseEnter={() => setActive(createIndex)}
              >
                Use “{typed}”
              </button>
            )}
            {!loading && !error && shown.length === 0 && !canCreate && (
              <div className="pouf-combobox__note">No models offered — type an id.</div>
            )}
          </div>
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  )
}
