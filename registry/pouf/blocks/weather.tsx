import { Card } from '../surface'
import { Stack, Row } from '../layout'
import { Text, Eyebrow } from '../text'
import { Metric } from '../readout'

const FORECAST = [
  { day: 'Mon', hi: '24°', emoji: '☀️' },
  { day: 'Tue', hi: '21°', emoji: '⛅' },
  { day: 'Wed', hi: '19°', emoji: '🌧' },
  { day: 'Thu', hi: '23°', emoji: '☀️' },
  { day: 'Fri', hi: '26°', emoji: '☀️' },
]

/** An example weather widget: current conditions and a five-day forecast. */
export function WeatherBlock() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={5}>
          <Row justify="between" align="top">
            <Stack gap={1}>
              <Eyebrow>Lisbon · Now</Eyebrow>
              <Row gap={2} wrap={false}>
                <span style={{ fontSize: 56, lineHeight: 1 }}>☀️</span>
                <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, color: 'var(--ink)' }}>24°</span>
              </Row>
              <Text muted>Sunny · feels like 26°</Text>
            </Stack>
          </Row>

          <Row gap={3}>
            <Metric label="Humidity" value="41%" />
            <Metric label="Wind" value="12 km/h" />
            <Metric label="UV" value="High" num={false} />
          </Row>

          <Stack gap={2}>
            <Text size="sm" muted>5-day forecast</Text>
            <Row gap={2}>
              {FORECAST.map((f) => (
                <div key={f.day} style={{ flex: 1, textAlign: 'center', background: 'var(--surface)', borderRadius: 18, padding: '12px 4px', boxShadow: 'var(--pouf-row)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>{f.day}</div>
                  <div style={{ fontSize: 24, margin: '4px 0' }}>{f.emoji}</div>
                  <div style={{ fontWeight: 900, color: 'var(--ink)' }}>{f.hi}</div>
                </div>
              ))}
            </Row>
          </Stack>
        </Stack>
      </Card>
    </div>
  )
}
