import { useState } from 'react'
import { Card, RowCard } from '../surface'
import { Stack, Row } from '../layout'
import { Text, Eyebrow } from '../text'
import { Metric } from '../readout'
import { Blob, Badge } from '../media'
import { Segmented } from '../Segmented'
import { Icon } from '../Icon'

const CITIES = [
  {
    id: 'lisbon',
    name: 'Lisbon',
    humidity: '41%',
    wind: '12 km/h',
    uv: 'High',
    forecast: [
      { day: 'Mon', hi: 24, lo: 16, icon: 'sun', tone: 'yellow' as const, condition: 'Sunny' },
      { day: 'Tue', hi: 21, lo: 15, icon: 'cloud', tone: 'blue' as const, condition: 'Cloudy' },
      { day: 'Wed', hi: 19, lo: 14, icon: 'rain', tone: 'blue' as const, condition: 'Showers' },
      { day: 'Thu', hi: 23, lo: 15, icon: 'sun', tone: 'yellow' as const, condition: 'Sunny' },
      { day: 'Fri', hi: 26, lo: 17, icon: 'sun', tone: 'orange' as const, condition: 'Hot & sunny' },
    ],
  },
  {
    id: 'oslo',
    name: 'Oslo',
    humidity: '68%',
    wind: '18 km/h',
    uv: 'Low',
    forecast: [
      { day: 'Mon', hi: 9, lo: 3, icon: 'cloud', tone: 'blue' as const, condition: 'Overcast' },
      { day: 'Tue', hi: 7, lo: 2, icon: 'rain', tone: 'blue' as const, condition: 'Rain' },
      { day: 'Wed', hi: 11, lo: 4, icon: 'sun', tone: 'yellow' as const, condition: 'Clear' },
      { day: 'Thu', hi: 8, lo: 1, icon: 'cloud', tone: 'blue' as const, condition: 'Windy' },
      { day: 'Fri', hi: 10, lo: 3, icon: 'rain', tone: 'blue' as const, condition: 'Showers' },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    humidity: '55%',
    wind: '9 km/h',
    uv: 'Extreme',
    forecast: [
      { day: 'Mon', hi: 41, lo: 29, icon: 'sun', tone: 'orange' as const, condition: 'Scorching' },
      { day: 'Tue', hi: 40, lo: 28, icon: 'sun', tone: 'orange' as const, condition: 'Sunny' },
      { day: 'Wed', hi: 39, lo: 27, icon: 'sun', tone: 'yellow' as const, condition: 'Hazy sun' },
      { day: 'Thu', hi: 42, lo: 30, icon: 'sun', tone: 'orange' as const, condition: 'Scorching' },
      { day: 'Fri', hi: 38, lo: 27, icon: 'cloud', tone: 'blue' as const, condition: 'Dusty' },
    ],
  },
]

const HOUR_LABELS = ['6am', '9am', 'Noon', '3pm', '6pm', '9pm']
// Fraction of the day's hi/lo spread at each label — a plausible-looking curve
// without hand-authoring per-hour data for every city and day.
const HOUR_CURVE = [0.1, 0.5, 0.9, 1, 0.65, 0.25]

function hoursFor(day: { hi: number; lo: number; icon: string }) {
  return HOUR_LABELS.map((t, i) => ({
    t,
    temp: Math.round(day.lo + (day.hi - day.lo) * HOUR_CURVE[i]!),
    // Night bookends read cloudier than the daytime icon, even on a sunny day.
    icon: i === 0 || i === HOUR_LABELS.length - 1 ? (day.icon === 'sun' ? 'cloud' : day.icon) : day.icon,
  }))
}

const toF = (c: number) => Math.round((c * 9) / 5 + 32)

/** An example weather widget: a city and unit picker, current conditions, an
 * hourly strip, and a five-day forecast. Picking a city swaps every figure on
 * the card; picking a forecast day re-centres the conditions and hourly strip
 * on that day instead of today. */
export function WeatherBlock() {
  const [unit, setUnit] = useState('c')
  const [cityId, setCityId] = useState(CITIES[0]!.id)
  const [dayIndex, setDayIndex] = useState(0)

  const city = CITIES.find((c) => c.id === cityId)!
  const day = city.forecast[dayIndex]!
  const hours = hoursFor(day)
  const t = (c: number) => (unit === 'f' ? `${toF(c)}°` : `${c}°`)

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Stack gap={4}>
        <Card>
          <Stack gap={5}>
            <Row justify="between" align="top">
              <Stack gap={1}>
                <Row gap={2} wrap={false}>
                  <Icon name="pin" size="sm" />
                  <Eyebrow>{city.name}</Eyebrow>
                </Row>
                <Row gap={3} wrap={false}>
                  <Blob icon={day.icon as never} tone={day.tone} />
                  <span style={{ fontSize: 60, fontWeight: 900, letterSpacing: -3, color: 'var(--ink)', lineHeight: 1 }}>{t(day.hi)}</span>
                </Row>
                <Text muted>{dayIndex === 0 ? 'Now' : day.day} — {day.condition}, low {t(day.lo)}</Text>
              </Stack>
              <Stack gap={2}>
                <Segmented label="City" value={cityId} onChange={setCityId} options={CITIES.map((c) => ({ value: c.id, label: c.name }))} />
                <Segmented
                  label="Units"
                  value={unit}
                  onChange={setUnit}
                  options={[{ value: 'c', label: '°C' }, { value: 'f', label: '°F' }]}
                />
              </Stack>
            </Row>

            <Row gap={3}>
              <Metric label="Humidity" value={city.humidity} />
              <Metric label="Wind" value={city.wind} />
              <Metric label="UV index" value={city.uv} num={false} />
            </Row>
          </Stack>
        </Card>

        <Card variant="tight">
          <Stack gap={3}>
            <Eyebrow>Hourly — {dayIndex === 0 ? 'today' : day.day}</Eyebrow>
            <Row gap={2}>
              {hours.map((h) => (
                <Stack key={h.t} gap={2}>
                  <Text size="sm" muted>{h.t}</Text>
                  <Row justify="center"><Icon name={h.icon as never} /></Row>
                  <Row justify="center"><Text num>{t(h.temp)}</Text></Row>
                </Stack>
              ))}
            </Row>
          </Stack>
        </Card>

        <Card variant="tight">
          <Stack gap={3}>
            <Row justify="between">
              <Eyebrow>5-day forecast</Eyebrow>
              {dayIndex > 0 && <Badge tone="blue">Viewing {day.day}</Badge>}
            </Row>
            <Stack gap={2}>
              {city.forecast.map((f, i) => (
                <RowCard key={f.day} selected={i === dayIndex} onClick={() => setDayIndex(i)}>
                  <Row justify="between" wrap={false}>
                    <Row gap={3} wrap={false}>
                      <Blob icon={f.icon as never} tone={f.tone} size="sm" />
                      <Text>{f.day}</Text>
                    </Row>
                    <Row gap={3} wrap={false}>
                      <Text num>{t(f.hi)}</Text>
                      <Text num muted>{t(f.lo)}</Text>
                    </Row>
                  </Row>
                </RowCard>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}
