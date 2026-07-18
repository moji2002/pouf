import * as RAccordion from '@radix-ui/react-accordion'
import * as RTabs from '@radix-ui/react-tabs'
import * as RCollapse from '@radix-ui/react-collapsible'
import clsx from 'clsx'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from './Icon'
import { toneClass, type Tone } from './tone'

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

interface Tab {
  value: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  tone?: Tone
}

/** Panel switching in the Segmented voice: each trigger IS a small clay button
 * and the active one is pressed in. Tabs and Segmented are the same control at
 * different altitudes — one swaps a panel, the other a value — so giving tabs
 * a second visual language (the underline rail this replaces) made the UI
 * claim they were different things. */
export function Tabs({ tabs, value, onChange, tone = 'blue' }: TabsProps) {
  return (
    <RTabs.Root className="clay-tabs" value={value} onValueChange={onChange}>
      <RTabs.List className="clay-tabs__list">
        {tabs.map((t) => (
          <RTabs.Trigger
            key={t.value}
            value={t.value}
            className={clsx('clay-btn', 'clay-btn--sm', 'clay-tabs__trigger', toneClass(tone))}
          >
            {t.label}
          </RTabs.Trigger>
        ))}
      </RTabs.List>
      <AnimatePresence mode="wait">
        {tabs.map(
          (t) =>
            t.value === value && (
              <RTabs.Content
                key={t.value}
                value={t.value}
                className="clay-tabs__content"
                forceMount
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {t.content}
                </motion.div>
              </RTabs.Content>
            ),
        )}
      </AnimatePresence>
    </RTabs.Root>
  )
}

/* ------------------------------------------------------------------ */
/* Accordion                                                           */
/* ------------------------------------------------------------------ */

interface AccordionItem {
  value: string
  title: string
  children: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  defaultValue?: string
}

/** Plain Radix + the CSS keyframes, no framer-motion. The motion build kept
 * every panel forceMounted with `animate="open"` hard-coded, so nothing ever
 * told a closed panel to close: all three sat expanded forever. Radix already
 * mounts content on open and holds it through the exit animation — the CSS
 * clay-accordion-down/up keyframes are the whole choreography. */
export function Accordion({ items, defaultValue }: AccordionProps) {
  return (
    <RAccordion.Root
      className="clay-accordion"
      type="single"
      defaultValue={defaultValue as string}
      collapsible
    >
      {items.map((item) => (
        <RAccordion.Item key={item.value} value={item.value} className="clay-accordion__item">
          <RAccordion.Header>
            <RAccordion.Trigger className="clay-accordion__trigger">
              <span className="clay-accordion__title">{item.title}</span>
              <span className="clay-accordion__chevron">
                <Icon name="expand" size="sm" />
              </span>
            </RAccordion.Trigger>
          </RAccordion.Header>
          <RAccordion.Content className="clay-accordion__content">
            <div className="clay-accordion__body">{item.children}</div>
          </RAccordion.Content>
        </RAccordion.Item>
      ))}
    </RAccordion.Root>
  )
}

/* ------------------------------------------------------------------ */
/* Collapsible                                                         */
/* ------------------------------------------------------------------ */

interface CollapsibleProps {
  children: ReactNode
  trigger: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Collapsible({ children, trigger, open: controlledOpen, onOpenChange: controlledOnOpen }: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? controlledOnOpen : setInternalOpen

  return (
    <RCollapse.Root open={open} onOpenChange={setOpen}>
      <RCollapse.Trigger asChild>
        <button type="button" className="clay-collapsible__trigger">
          {trigger}
        </button>
      </RCollapse.Trigger>
      <RCollapse.Content className="clay-collapsible__content" forceMount>
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0.9, 0.3, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div className="clay-collapsible__body">{children}</div>
        </motion.div>
      </RCollapse.Content>
    </RCollapse.Root>
  )
}
