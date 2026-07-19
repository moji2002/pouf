import { Navbar } from '../navbar'
import { Footer } from '../footer'
import { CTA } from '../cta'
import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow, Highlight } from '../text'
import { Button } from '../Button'
import { Blob, Badge } from '../media'

const brand = (<><Blob icon="target" tone="purple" size="sm" />Nimbus</>)

const FEATURES = [
  { icon: 'live', tone: 'yellow', title: 'Fast by default', body: 'Ships in milliseconds, scales to millions. No config required.' },
  { icon: 'lock', tone: 'mint', title: 'Secure', body: 'End-to-end encryption and SSO on every plan.' },
  { icon: 'sparkle', tone: 'pink', title: 'Delightful', body: 'The details your team will actually enjoy using.' },
] as const

/** An example marketing landing page — Navbar, hero, features, CTA, and Footer,
 * showcasing the section primitives together. */
export function LandingBlock() {
  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: 24 }}>
      <Stack gap={6}>
        <Navbar
          brand={brand}
          links={[{ label: 'Features', href: '#', active: true }, { label: 'Pricing', href: '#' }, { label: 'Docs', href: '#' }]}
          actions={<><Button size="sm" variant="quiet">Log in</Button><Button size="sm">Sign up</Button></>}
        />

        <Stack gap={4}>
          <Row justify="center"><Badge tone="yellow">New — v2.0 is here</Badge></Row>
          <div style={{ textAlign: 'center' }}>
            <Heading level={1}>Ship <Highlight>faster</Highlight>, sleep better.</Heading>
          </div>
          <Row justify="center">
            <Text muted>The platform your team ships on. Deploy in seconds, scale without thinking.</Text>
          </Row>
          <Row justify="center" gap={2}>
            <Button size="lg">Start free</Button>
            <Button size="lg" variant="quiet">Book a demo</Button>
          </Row>
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

        <CTA
          tone="purple"
          title="Ready when you are."
          description="Join thousands of teams building on Nimbus."
          action={<><Button size="lg">Get started</Button><Button size="lg" variant="quiet">Talk to sales</Button></>}
        />

        <Footer
          brand={brand}
          tagline="The platform your team ships on."
          columns={[
            { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'Changelog', href: '#' }] },
            { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }] },
            { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
          ]}
          note="© 2026 Nimbus, Inc."
        />
      </Stack>
    </div>
  )
}
