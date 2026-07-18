import { useEffect, useRef } from 'react'
import { Select, Switch, Tooltip, TooltipProvider, Confirm, Dialog, Combobox } from '../controls'
import { Field } from '../Input'
import { Button } from '../Button'
import { Row, Stack } from '../layout'
import { RowCard } from '../surface'
import { Text } from '../text'
import { simulateOpen } from './interact'
import type { Demo } from './types'

/* ---------------------------------------------------------------- Select */

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function SelectOpen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { simulateOpen(ref.current?.querySelector('button')) }, [])
  return (
    <div ref={ref}>
      <Field label="Fruit">
        {(id, d) => <Select id={id} describedBy={d} value="apple" onChange={() => {}} options={fruitOptions} />}
      </Field>
    </div>
  )
}

export const selectDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Field label="Fruit">
          {(id, d) => <Select id={id} describedBy={d} value="apple" onChange={() => {}} options={fruitOptions} />}
        </Field>
      </span>
    ) },
  { id: 'placeholder', render: () => (
      <Field label="Fruit">
        {(id, d) => (
          <Select id={id} describedBy={d} value="" onChange={() => {}} options={fruitOptions} placeholder="Choose a fruit" />
        )}
      </Field>
    ) },
  { id: 'disabled', render: () => (
      <Field label="Fruit">
        {(id, d) => <Select id={id} describedBy={d} value="apple" onChange={() => {}} options={fruitOptions} disabled />}
      </Field>
    ) },
  { id: 'open', render: () => <SelectOpen /> },
]

/* ---------------------------------------------------------------- Switch */

export const switchDemos: Demo[] = [
  { id: 'on', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Row gap={2} wrap={false}>
          <Switch checked onChange={() => {}} label="Notifications" />
          <Text size="sm">Notifications</Text>
        </Row>
      </span>
    ) },
  { id: 'off', render: () => (
      <Row gap={2} wrap={false}>
        <Switch checked={false} onChange={() => {}} label="Notifications" />
        <Text size="sm">Notifications</Text>
      </Row>
    ) },
  { id: 'disabled', render: () => (
      <Row gap={2} wrap={false}>
        <Switch checked={false} onChange={() => {}} disabled label="Busy switch" />
        <Text size="sm" muted>Busy switch</Text>
      </Row>
    ) },
]

/* --------------------------------------------------------------- Tooltip */

// Radix's Tooltip.Root requires an ancestor Tooltip.Provider (it does not
// fall back to a default one) — the real app mounts one at the shell root,
// so each demo below supplies its own.
export const tooltipDemos: Demo[] = [
  { id: 'trigger', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <TooltipProvider>
          <Tooltip tip="Cushions compress when pressed.">
            <Button tone="blue" size="sm">Hover me</Button>
          </Tooltip>
        </TooltipProvider>
      </span>
    ) },
  // The anchor-owns-the-hover design's pinning case: a disabled control fires
  // no pointer events at all, so only the element around it can carry it.
  { id: 'disabled-child', render: () => (
      <TooltipProvider>
        <Tooltip tip="Paused while a write is in flight.">
          <Switch checked={false} onChange={() => {}} disabled label="Busy switch" />
        </Tooltip>
      </TooltipProvider>
    ) },
]

/* --------------------------------------------------------------- Confirm */

const confirmDetails = (
  <Stack gap={2}>
    <RowCard>
      <Row justify="between" wrap={false}>
        <Text size="sm">Apple · 0.4</Text>
        <Text size="sm" num>+$31.20</Text>
      </Row>
    </RowCard>
    <RowCard>
      <Row justify="between" wrap={false}>
        <Text size="sm">Banana · 2.1</Text>
        <Text size="sm" num>−$8.05</Text>
      </Row>
    </RowCard>
  </Stack>
)

function ConfirmOpen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { simulateOpen(ref.current?.querySelector('button')) }, [])
  return (
    <div ref={ref}>
      <Confirm
        title="Remove 2 items?"
        body="Both items are removed immediately. This cannot be undone."
        confirmLabel="Remove 2 items"
        cancelLabel="Keep items"
        onConfirm={() => {}}
        details={confirmDetails}
      >
        <Button tone="orange" size="sm">Confirm dialog</Button>
      </Confirm>
    </div>
  )
}

export const confirmDemos: Demo[] = [
  { id: 'trigger', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Confirm
          title="Remove 2 items?"
          body="Both items are removed immediately. This cannot be undone."
          confirmLabel="Remove 2 items"
          cancelLabel="Keep items"
          onConfirm={() => {}}
          details={confirmDetails}
        >
          <Button tone="orange" size="sm">Confirm dialog</Button>
        </Confirm>
      </span>
    ) },
  { id: 'open', render: () => <ConfirmOpen /> },
]

/* ---------------------------------------------------------------- Dialog */

export const dialogDemos: Demo[] = [
  { id: 'trigger', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Dialog
          trigger={<Button tone="blue" size="sm">Open dialog</Button>}
          title="Pick a fruit"
          description="Dismisses on outside click — nothing here is destructive."
        >
          <Stack gap={2}>
            <RowCard onClick={() => {}}><Text>Apple</Text></RowCard>
            <RowCard onClick={() => {}}><Text>Banana</Text></RowCard>
          </Stack>
        </Dialog>
      </span>
    ) },
  { id: 'open', render: () => (
      <Dialog
        open
        onOpenChange={() => {}}
        trigger={<Button tone="blue" size="sm">Open dialog</Button>}
        title="Pick a fruit"
        description="Dismisses on outside click — nothing here is destructive."
      >
        <Stack gap={2}>
          <RowCard onClick={() => {}}><Text>Apple</Text></RowCard>
          <RowCard onClick={() => {}}><Text>Banana</Text></RowCard>
        </Stack>
      </Dialog>
    ) },
  { id: 'large', render: () => (
      <Dialog
        open
        onOpenChange={() => {}}
        size="lg"
        trigger={<Button tone="blue" size="sm">Open dialog</Button>}
        title="A larger dialog"
      >
        <Text size="sm" muted>The size=&quot;lg&quot; variant.</Text>
      </Dialog>
    ) },
]

/* -------------------------------------------------------------- Combobox */

const modelOptions = ['deepseek-chat', 'deepseek-reasoner', 'gpt-4o-mini']

function ComboboxOpen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { simulateOpen(ref.current?.querySelector('button')) }, [])
  return (
    <div ref={ref}>
      <Field label="Model">
        {(id, d) => (
          <Combobox id={id} describedBy={d} value="deepseek-chat" onChange={() => {}} options={modelOptions} mono placeholder="deepseek-chat" />
        )}
      </Field>
    </div>
  )
}

export const comboboxDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Field label="Model">
          {(id, d) => (
            <Combobox id={id} describedBy={d} value="deepseek-chat" onChange={() => {}} options={modelOptions} mono placeholder="deepseek-chat" />
          )}
        </Field>
      </span>
    ) },
  // The empty-list case is the contract, not a degradation: an endpoint that
  // offers no list must still let you type an id.
  { id: 'no-options', render: () => (
      <Field label="Model (no list offered)">
        {(id, d) => (
          <Combobox
            id={id}
            describedBy={d}
            value=""
            onChange={() => {}}
            options={[]}
            error="This endpoint has no model list — type one."
            mono
            placeholder="type an id"
          />
        )}
      </Field>
    ) },
  { id: 'open', render: () => <ComboboxOpen /> },
]
