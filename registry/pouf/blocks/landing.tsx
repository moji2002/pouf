import { useState } from 'react'
import { Navbar } from '../navbar'
import { Footer } from '../footer'
import { CTA } from '../cta'
import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow, Highlight } from '../text'
import { Button } from '../Button'
import { Blob, Badge } from '../media'
import { Segmented } from '../Segmented'
import { Icon } from '../Icon'

const brand = (<><Blob icon="target" tone="purple" size="sm" />Nimbus</>)

const FEATURES = [
  { icon: 'live', tone: 'yellow', title: 'Fast by default', body: 'Ships in milliseconds, scales to millions. No config required.' },
  { icon: 'lock', tone: 'mint', title: 'Secure', body: 'End-to-end encryption and SSO on every plan.' },
  { icon: 'sparkle', tone: 'pink', title: 'Delightful', body: 'The details your team will actually enjoy using.' },
] as const

const PLANS = [
  {
    name: 'Starter',
    monthly: 0,
    description: 'For prototypes and tiny teams.',
    tone: 'blue',
    featured: false,
    features: ['3 projects', 'Community support', 'Preview deployments'],
  },
  {
    name: 'Scale',
    monthly: 24,
    description: 'For teams shipping every week.',
    tone: 'purple',
    featured: true,
    features: ['Unlimited projects', 'Team permissions', 'Priority support'],
  },
  {
    name: 'Company',
    monthly: 68,
    description: 'For growing organizations.',
    tone: 'mint',
    featured: false,
    features: ['SAML SSO', 'Audit logs', 'Dedicated success lead'],
  },
] as const

type Billing = 'monthly' | 'annual'

/** A complete marketing route: responsive navbar and footer, hero, product
 * proof, feature and pricing sections, working annual billing, and CTAs that
 * navigate to real sections instead of dead `#` links. */
export function LandingBlock() {
  const [billing, setBilling] = useState<Billing>('monthly')

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="max-w-[1120px] mx-auto p-(--s5) max-[620px]:p-(--s3)">
      <Stack gap={6}>
        <Navbar
          brand={brand}
          links={[
            { label: 'Features', href: '#features', active: true },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Customers', href: '#customers' },
          ]}
          actions={
            <Button size="sm" onClick={() => scrollTo('pricing')}>Start free</Button>
          }
        />

        <Grid cols="sidebar" gap={5}>
          <Stack gap={4}>
            <Badge tone="yellow">New — global edge network</Badge>
            <Heading level={1}>Ship <Highlight>faster</Highlight>, sleep better.</Heading>
            <Text muted>
              The deployment platform for teams that care about speed without
              wanting another infrastructure hobby.
            </Text>
            <Row gap={2}>
              <Button size="lg" onClick={() => scrollTo('pricing')}>Start free</Button>
              <Button size="lg" variant="quiet" onClick={() => scrollTo('customers')}>
                See customer results
              </Button>
            </Row>
            <Text size="sm" muted>No credit card · Deploy your first project in two minutes</Text>
          </Stack>

          <Card>
            <Stack gap={4}>
              <Row justify="between">
                <Stack gap={1}>
                  <Eyebrow>Production</Eyebrow>
                  <Heading level={3}>nimbus-app</Heading>
                </Stack>
                <Badge tone="mint">Live</Badge>
              </Row>
              <Grid cols={2}>
                <Stack gap={1}>
                  <Text size="sm" muted>Deploy</Text>
                  <Text num>8.2s</Text>
                </Stack>
                <Stack gap={1}>
                  <Text size="sm" muted>Regions</Text>
                  <Text num>34</Text>
                </Stack>
                <Stack gap={1}>
                  <Text size="sm" muted>Uptime</Text>
                  <Text num>99.99%</Text>
                </Stack>
                <Stack gap={1}>
                  <Text size="sm" muted>Requests</Text>
                  <Text num>1.8M</Text>
                </Stack>
              </Grid>
              <Row gap={2} wrap={false}>
                <Blob icon="ok" tone="mint" size="sm" />
                <Text size="sm">Deployed from main 26 seconds ago</Text>
              </Row>
            </Stack>
          </Card>
        </Grid>

        <section id="features">
          <Stack gap={4}>
            <Stack gap={1}>
              <Eyebrow>One calm platform</Eyebrow>
              <Heading level={2}>Everything between push and production</Heading>
              <Text muted>Preview, review, deploy, observe, and roll back from one place.</Text>
            </Stack>
            <Grid cols={3}>
              {FEATURES.map((f) => (
                <Card key={f.title}>
                  <Stack gap={3}>
                    <Blob icon={f.icon} tone={f.tone} />
                    <Heading level={3}>{f.title}</Heading>
                    <Text size="sm" muted>{f.body}</Text>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>
        </section>

        <section id="customers">
          <Card>
            <Grid cols="sidebar">
              <Stack gap={3}>
                <Eyebrow>Customer story</Eyebrow>
                <Heading level={2}>From Friday freezes to daily shipping.</Heading>
                <Text muted>
                  “Nimbus cut our deploy pipeline from 22 minutes to under one.
                  The team stopped scheduling releases and started shipping.”
                </Text>
                <Text size="sm">Maya Bloom · VP Engineering at Orbit</Text>
              </Stack>
              <Stack gap={3}>
                <Row gap={2} wrap={false}>
                  <Blob icon="up" tone="mint" size="sm" />
                  <Stack gap={1}>
                    <Text num>18×</Text>
                    <Text size="sm" muted>more deployments</Text>
                  </Stack>
                </Row>
                <Row gap={2} wrap={false}>
                  <Blob icon="down" tone="blue" size="sm" />
                  <Stack gap={1}>
                    <Text num>41%</Text>
                    <Text size="sm" muted>lower infra spend</Text>
                  </Stack>
                </Row>
              </Stack>
            </Grid>
          </Card>
        </section>

        <section id="pricing">
          <Stack gap={4}>
            <Row justify="between" align="top">
              <Stack gap={1}>
                <Eyebrow>Simple pricing</Eyebrow>
                <Heading level={2}>Start small. Keep your options.</Heading>
                <Text muted>Every plan includes global deploys, previews, and analytics.</Text>
              </Stack>
              <Segmented
                label="Billing period"
                value={billing}
                onChange={setBilling}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'annual', label: 'Annual · save 20%' },
                ]}
              />
            </Row>

            <Grid cols={3}>
              {PLANS.map((plan) => {
                const price = billing === 'annual'
                  ? Math.round(plan.monthly * 0.8)
                  : plan.monthly
                return (
                  <Card key={plan.name}>
                    <Stack gap={4}>
                      <Row justify="between">
                        <Heading level={3}>{plan.name}</Heading>
                        {plan.featured ? <Badge tone="yellow">Most popular</Badge> : null}
                      </Row>
                      <Stack gap={1}>
                        <Heading level={2}>{price === 0 ? 'Free' : `$${price}`}</Heading>
                        <Text size="sm" muted>
                          {price === 0 ? 'forever' : `per seat / month, billed ${billing}`}
                        </Text>
                      </Stack>
                      <Text size="sm" muted>{plan.description}</Text>
                      <Stack gap={2}>
                        {plan.features.map((feature) => (
                          <Row key={feature} gap={2} wrap={false}>
                            <Icon name="ok" size="sm" />
                            <Text size="sm">{feature}</Text>
                          </Row>
                        ))}
                      </Stack>
                      <Button block tone={plan.tone}>
                        {plan.monthly === 0 ? 'Create workspace' : `Choose ${plan.name}`}
                      </Button>
                    </Stack>
                  </Card>
                )
              })}
            </Grid>
          </Stack>
        </section>

        <CTA
          tone="purple"
          title="Ready when you are."
          description="Join 4,000+ teams that deploy on Nimbus every day."
          action={
            <>
              <Button size="lg" onClick={() => scrollTo('pricing')}>Get started</Button>
              <Button size="lg" variant="quiet" onClick={() => scrollTo('customers')}>Read the story</Button>
            </>
          }
        />

        <Footer
          brand={brand}
          tagline="The platform your team ships on."
          columns={[
            { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Customers', href: '#customers' }] },
            { title: 'Company', links: [{ label: 'About', href: '#customers' }, { label: 'Blog', href: '#customers' }, { label: 'Careers', href: '#customers' }] },
            { title: 'Legal', links: [{ label: 'Privacy', href: '#pricing' }, { label: 'Terms', href: '#pricing' }] },
          ]}
          note="© 2026 Nimbus, Inc. Replace the sample links and plan actions with your routes and billing adapter."
        />
      </Stack>
    </div>
  )
}
