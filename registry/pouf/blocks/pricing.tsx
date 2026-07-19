import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow, Highlight } from '../text'
import { Badge, Dot } from '../media'
import { Button } from '../Button'
import { Icon } from '../Icon'

interface Plan {
  name: string
  price: string
  cadence: string
  blurb: string
  features: string[]
  cta: string
  tone: 'purple' | 'mint' | 'blue'
  featured?: boolean
}

const PLANS: Plan[] = [
  { name: 'Free', price: '$0', cadence: '/mo', blurb: 'For weekend projects.', tone: 'blue', cta: 'Start free', features: ['1 project', 'Community support', 'Core components'] },
  { name: 'Pro', price: '$12', cadence: '/mo', blurb: 'For serious builders.', tone: 'purple', featured: true, cta: 'Go Pro', features: ['Unlimited projects', 'Priority support', 'Every component', 'Example templates', 'Early features'] },
  { name: 'Team', price: '$40', cadence: '/mo', blurb: 'For the whole studio.', tone: 'mint', cta: 'Start a team', features: ['Everything in Pro', 'Shared workspace', 'SSO & roles', 'Audit log'] },
]

function Feature({ text }: { text: string }) {
  return (
    <Row gap={2} wrap={false}>
      <span style={{ display: 'inline-flex', flex: 'none', width: 22, height: 22, borderRadius: 999, alignItems: 'center', justifyContent: 'center', background: 'var(--mint)', color: 'var(--ink)' }}>
        <Icon name="ok" size="sm" />
      </span>
      <Text size="sm">{text}</Text>
    </Row>
  )
}

/** An example pricing page: three plans, one featured, with feature checklists.
 * All Pouf primitives. */
export function PricingBlock() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <Stack gap={6}>
        <Stack gap={2}>
          <Eyebrow>Pricing</Eyebrow>
          <Heading level={1}>Pick a <Highlight>cushion</Highlight></Heading>
          <Text muted>Simple plans. Cancel anytime.</Text>
        </Stack>

        <Grid cols={3}>
          {PLANS.map((p) => (
            <Card variant={p.featured ? 'default' : 'tight'}>
              <Stack gap={4}>
                <Row justify="between">
                  <Row gap={2} wrap={false}>
                    <Dot tone={p.tone} />
                    <Heading level={3}>{p.name}</Heading>
                  </Row>
                  {p.featured && <Badge tone="yellow">Popular</Badge>}
                </Row>
                <Row gap={1} wrap={false}>
                  <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1, color: 'var(--ink)' }}>{p.price}</span>
                  <Text muted>{p.cadence}</Text>
                </Row>
                <Text size="sm" muted>{p.blurb}</Text>
                <Stack gap={2}>
                  {p.features.map((f) => <Feature key={f} text={f} />)}
                </Stack>
                <Button block tone={p.tone} variant={p.featured ? 'solid' : 'quiet'} onClick={() => {}}>{p.cta}</Button>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </div>
  )
}
