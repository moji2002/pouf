import { Tabs, Accordion, Collapsible } from '../disclosure'
import { Card } from '../surface'
import { Field, Input } from '../Input'
import { Text } from '../text'
import type { Demo } from './types'

export const tabsDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Tabs
          value="first"
          onChange={() => {}}
          tabs={[
            { value: 'first', label: 'Positions', content: <Text>Open position content goes here.</Text> },
            { value: 'second', label: 'History', content: <Text>Closed trade history.</Text> },
            { value: 'third', label: 'Notes', content: <Text size="sm" muted>No notes yet.</Text> },
          ]}
        />
      </span>
    ) },
  { id: 'second-selected', render: () => (
      <Tabs
        value="second"
        onChange={() => {}}
        tabs={[
          { value: 'first', label: 'Positions', content: <Text>Open position content goes here.</Text> },
          { value: 'second', label: 'History', content: <Text>Closed trade history.</Text> },
        ]}
      />
    ) },
]

export const accordionDemos: Demo[] = [
  { id: 'default', render: () => (
      <Accordion
        items={[
          { value: 'risk', title: 'Risk controls', children: <Text size="sm">Maximum drawdown: 5%. Circuit breaker: 3 consecutive losses.</Text> },
          { value: 'sizing', title: 'Position sizing', children: <Text size="sm">Fixed fractional at 2% per trade. Max 3 concurrent positions.</Text> },
          { value: 'hours', title: 'Hours', children: <Text size="sm">24/7. Pause during announcements at operator discretion.</Text> },
        ]}
      />
    ) },
  { id: 'expanded', render: () => (
      <Accordion
        defaultValue="risk"
        items={[
          { value: 'risk', title: 'Risk controls', children: <Text size="sm">Maximum drawdown: 5%. Circuit breaker: 3 consecutive losses.</Text> },
          { value: 'sizing', title: 'Position sizing', children: <Text size="sm">Fixed fractional at 2% per trade.</Text> },
        ]}
      />
    ) },
]

const collapsibleTrigger = <Text muted>Show advanced settings</Text>
const collapsibleBody = (
  <Card variant="tight">
    <Field label="Slippage tolerance">
      {(id, d) => <Input id={id} describedBy={d} value="0.5" onChange={() => {}} />}
    </Field>
  </Card>
)

export const collapsibleDemos: Demo[] = [
  { id: 'closed', states: ['hover'], render: () => (
      <span data-subject>
        <Collapsible trigger={collapsibleTrigger}>{collapsibleBody}</Collapsible>
      </span>
    ) },
  // Collapsible exposes a controlled `open` prop — no simulation needed.
  { id: 'open', render: () => (
      <Collapsible open onOpenChange={() => {}} trigger={collapsibleTrigger}>
        {collapsibleBody}
      </Collapsible>
    ) },
]
