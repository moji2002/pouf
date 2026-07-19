import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Metric } from '../readout'
import { Blob, Badge } from '../media'
import { Icon } from '../Icon'

const FORECAST = [
  { day: 'Mon', hi: '24°', lo: '16°', icon: 'sun', tone: 'yellow' as const },
  { day: 'Tue', hi: '21°', lo: '15°', icon: 'cloud', tone: 'blue' as const },
  { day: 'Wed', hi: '19°', lo: '14°', icon: 'rain', tone: 'blue' as const },
  { day: 'Thu', hi: '23°', lo: '15°', icon: 'sun', tone: 'yellow' as const },
  { day: 'Fri', hi: '26°', lo: '17°', icon: 'sun', tone: 'orange' as const },
]

const HOURS = [
  { t: 'Now', temp: '24°', icon: 'sun' },
  { t: '2pm', temp: '25°', icon: 'sun' },
  { t: '4pm', temp: '23°', icon: 'cloud' },
  { t: '6pm', temp: '21°', icon: 'cloud' },
  { t: '8pm', temp: '19°', icon: 'rain' },
]

/** An example weather widget: current conditions, an hourly strip, and a
 * five-day forecast. */
export function WeatherBlock() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Stack gap={4}>
        <Card>
          <Stack gap={5}>
            <Row justify="between" align="top">
              <Stack gap={1}>
                <Row gap={2} wrap={false}>
                  <Icon name="pin" size="sm" />
                  <Eyebrow>Lisbon</Eyebrow>
                </Row>
                <Row gap={3} wrap={false}>
                  <Blob icon="sun" tone="yellow" />
                  <span style={{ fontSize: 60, fontWeight: 900, letterSpacing: -3, color: 'var(--ink)', lineHeight: 1 }}>24°</span>
                </Row>
                <Text muted>Sunny — feels like 26°</Text>
              </Stack>
              <Badge tone="mint">Clear</Badge>
            </Row>

            <Row gap={3}>
              <Metric label="Humidity" value="41%" />
              <Metric label="Wind" value="12 km/h" />
              <Metric label="UV index" value="High" num={false} />
            </Row>
          </Stack>
        </Card>

        <Card variant="tight">
          <Stack gap={3}>
            <Eyebrow>Hourly</Eyebrow>
            <Row gap={2}>
              {HOURS.map((h) => (
                <Stack key={h.t} gap={2}>
                  <Text size="sm" muted>{h.t}</Text>
                  <Row justify="center"><Icon name={h.icon as never} /></Row>
                  <Row justify="center"><Text num>{h.temp}</Text></Row>
                </Stack>
              ))}
            </Row>
          </Stack>
        </Card>

        <Card variant="tight">
          <Stack gap={3}>
            <Eyebrow>5-day forecast</Eyebrow>
            <Stack gap={2}>
              {FORECAST.map((f) => (
                <Row key={f.day} justify="between" wrap={false}>
                  <Row gap={3} wrap={false}>
                    <Blob icon={f.icon as never} tone={f.tone} size="sm" />
                    <Text>{f.day}</Text>
                  </Row>
                  <Row gap={3} wrap={false}>
                    <Text num>{f.hi}</Text>
                    <Text num muted>{f.lo}</Text>
                  </Row>
                </Row>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}
