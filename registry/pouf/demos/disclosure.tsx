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
            { value: 'first', label: 'Projects', content: <Text>Active project content goes here.</Text> },
            { value: 'second', label: 'History', content: <Text>Archived history.</Text> },
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
          { value: 'first', label: 'Projects', content: <Text>Active project content goes here.</Text> },
          { value: 'second', label: 'History', content: <Text>Archived history.</Text> },
        ]}
      />
    ) },
]

export const accordionDemos: Demo[] = [
  { id: 'default', render: () => (
      <Accordion
        items={[
          { value: 'risk', title: 'Autosave', children: <Text size="sm">Saves every 30 seconds. Keeps the last 10 versions.</Text> },
          { value: 'sizing', title: 'Layout density', children: <Text size="sm">Comfortable by default. Compact fits more rows.</Text> },
          { value: 'hours', title: 'Support hours', children: <Text size="sm">Mon–Fri, 9–6 CET. Weekend replies are best effort.</Text> },
        ]}
      />
    ) },
  { id: 'expanded', render: () => (
      <Accordion
        defaultValue="risk"
        items={[
          { value: 'risk', title: 'Autosave', children: <Text size="sm">Saves every 30 seconds. Keeps the last 10 versions.</Text> },
          { value: 'sizing', title: 'Layout density', children: <Text size="sm">Comfortable by default.</Text> },
        ]}
      />
    ) },
]

const collapsibleTrigger = <Text muted>Show advanced settings</Text>
const collapsibleBody = (
  <Card variant="tight">
    <Field label="Autosave delay (s)">
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
