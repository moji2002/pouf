import { useRef, useState, type FormEvent } from 'react'
import { Button } from '../Button'
import { Empty } from '../feedback'
import { Footer } from '../footer'
import { Field, Input, Textarea } from '../Input'
import { Grid, Row, Stack } from '../layout'
import { Badge, Blob } from '../media'
import { Navbar } from '../navbar'
import { Progress } from '../progress'
import { Card, RowCard } from '../surface'
import { Eyebrow, Heading, Text } from '../text'

interface Service {
  id: string
  name: string
  description: string
  duration: string
  price: number
  icon: 'sparkle' | 'smile' | 'wand'
  tone: 'purple' | 'pink' | 'mint'
}

const SERVICES: Service[] = [
  { id: 'consult', name: 'First consultation', description: 'A calm 45-minute session to map goals and next steps.', duration: '45 min', price: 90, icon: 'sparkle', tone: 'purple' },
  { id: 'followup', name: 'Follow-up session', description: 'Keep the momentum with a focused working session.', duration: '30 min', price: 65, icon: 'smile', tone: 'mint' },
  { id: 'workshop', name: 'Team workshop', description: 'A hands-on session for up to 6 people.', duration: '90 min', price: 240, icon: 'wand', tone: 'pink' },
]

const DAYS = ['2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06']
const TIMES = ['09:30', '11:00', '14:00', '16:30']
const dateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const formatDay = (iso: string) => dateFormatter.format(new Date(`${iso}T12:00:00`))

/** A complete booking route: site chrome, service/date selection, contact
 * details, review, and a confirmation state. */
export function BookingBlock() {
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(SERVICES[0]!.id)
  const [day, setDay] = useState(DAYS[0]!)
  const [time, setTime] = useState(TIMES[0]!)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState<'name' | 'email' | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const service = SERVICES.find((item) => item.id === serviceId) ?? SERVICES[0]!

  const saveDetails = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Add your name and a complete email before reviewing the booking.')
      setErrorField('name')
      nameRef.current?.focus()
      return
    }
    if (!email.includes('@')) {
      setError('Add your name and a complete email before reviewing the booking.')
      setErrorField('email')
      emailRef.current?.focus()
      return
    }
    setError('')
    setErrorField(null)
    setStep(3)
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: 24 }}>
      <Stack gap={6}>
        <Navbar
          brand={<><Blob icon="calendar" tone="purple" size="sm" /> Soft Hours</>}
          links={[
            { label: 'Services', href: '#services', active: true },
            { label: 'About', href: '#about' },
            { label: 'FAQ', href: '#faq' },
          ]}
          actions={<Badge tone="mint">Accepting bookings</Badge>}
        />

        <Grid cols="sidebar" gap={6}>
          <Stack gap={4}>
            <Eyebrow>Book a session</Eyebrow>
            <Heading level={1}>Make time for the work that matters.</Heading>
            <Text muted>
              Pick a service and a time. You’ll see every detail before anything is confirmed.
            </Text>
            <Card variant="tight">
              <Stack gap={2}>
                <Text size="sm" muted>Simple promise</Text>
                <Text>No payment today. Reschedule free up to 24 hours before your session.</Text>
              </Stack>
            </Card>
          </Stack>

          <Card>
            {confirmed ? (
              <Stack gap={5}>
                <Empty icon="ok" title="You’re booked">
                  {formatDay(day)} at {time}. A confirmation is on its way to {email}.
                </Empty>
                <Card variant="tight">
                  <Stack gap={2}>
                    <Badge tone={service.tone}>{service.duration}</Badge>
                    <Heading level={3}>{service.name}</Heading>
                    <Text muted>{moneyFormatter.format(service.price)} · {name}</Text>
                  </Stack>
                </Card>
                <Button
                  block
                  variant="quiet"
                  onClick={() => {
                    setConfirmed(false)
                    setStep(0)
                  }}
                >
                  Book another session
                </Button>
              </Stack>
            ) : (
              <Stack gap={5}>
                <Stack gap={2}>
                  <Row justify="between">
                    <Text size="sm" muted>Step {step + 1} of 4</Text>
                    <Badge tone="blue">{Math.round(((step + 1) / 4) * 100)}%</Badge>
                  </Row>
                  <Progress value={step + 1} max={4} label="Booking progress" />
                </Stack>

                {step === 0 ? (
                  <Stack gap={3}>
                    <Heading level={2}>Choose a service</Heading>
                    {SERVICES.map((item) => (
                      <RowCard
                        key={item.id}
                        selected={item.id === serviceId}
                        onClick={() => setServiceId(item.id)}
                      >
                        <Row justify="between" wrap={false} align="top">
                          <Row gap={3} wrap={false} align="top">
                            <Blob icon={item.icon} tone={item.tone} size="sm" />
                            <Stack gap={1}>
                              <Text>{item.name}</Text>
                              <Text size="sm" muted>{item.description}</Text>
                            </Stack>
                          </Row>
                          <Stack gap={1}>
                            <Text num>{moneyFormatter.format(item.price)}</Text>
                            <Text size="sm" muted>{item.duration}</Text>
                          </Stack>
                        </Row>
                      </RowCard>
                    ))}
                    <Row justify="end"><Button onClick={() => setStep(1)}>Choose a time</Button></Row>
                  </Stack>
                ) : null}

                {step === 1 ? (
                  <Stack gap={4}>
                    <Heading level={2}>Choose a time</Heading>
                    <Grid cols={2} gap={3}>
                      {DAYS.map((item) => (
                        <RowCard key={item} selected={item === day} onClick={() => setDay(item)}>
                          <Text>{formatDay(item)}</Text>
                        </RowCard>
                      ))}
                    </Grid>
                    <Grid cols={2} gap={3}>
                      {TIMES.map((item) => (
                        <RowCard key={item} selected={item === time} onClick={() => setTime(item)}>
                          <Text num>{item}</Text>
                        </RowCard>
                      ))}
                    </Grid>
                    <Row justify="between">
                      <Button variant="quiet" onClick={() => setStep(0)}>Back</Button>
                      <Button onClick={() => setStep(2)}>Add your details</Button>
                    </Row>
                  </Stack>
                ) : null}

                {step === 2 ? (
                  <form onSubmit={saveDetails} noValidate>
                    <Stack gap={4}>
                      <Heading level={2}>Your details</Heading>
                      <Field label="Name" error={errorField === 'name' ? error : undefined}>
                        {(id, describedBy) => (
                          <Input
                            ref={nameRef}
                            id={id}
                            name="name"
                            value={name}
                            onChange={(value) => { setName(value); setError(''); setErrorField(null) }}
                            describedBy={describedBy}
                            invalid={errorField === 'name'}
                            autoComplete="name"
                            placeholder="Ada Lovelace…"
                          />
                        )}
                      </Field>
                      <Field label="Email" error={errorField === 'email' ? error : undefined}>
                        {(id, describedBy) => (
                          <Input
                            ref={emailRef}
                            id={id}
                            name="email"
                            type="email"
                            value={email}
                            onChange={(value) => { setEmail(value); setError(''); setErrorField(null) }}
                            describedBy={describedBy}
                            invalid={errorField === 'email'}
                            autoComplete="email"
                            spellCheck={false}
                            placeholder="ada@example.com…"
                          />
                        )}
                      </Field>
                      <Field label="Anything we should know?" hint="Optional">
                        {(id, describedBy) => (
                          <Textarea
                            id={id}
                            name="notes"
                            value={notes}
                            onChange={setNotes}
                            describedBy={describedBy}
                            autoComplete="off"
                            placeholder="Accessibility needs, context, or a goal…"
                            rows={4}
                          />
                        )}
                      </Field>
                      <Row justify="between">
                        <Button variant="quiet" onClick={() => setStep(1)}>Back</Button>
                        <Button type="submit">Review booking</Button>
                      </Row>
                    </Stack>
                  </form>
                ) : null}

                {step === 3 ? (
                  <Stack gap={4}>
                    <Heading level={2}>Review your booking</Heading>
                    <Card variant="tight">
                      <Stack gap={3}>
                        <Row justify="between"><Text muted>Service</Text><Text>{service.name}</Text></Row>
                        <Row justify="between"><Text muted>Date</Text><Text>{formatDay(day)}</Text></Row>
                        <Row justify="between"><Text muted>Time</Text><Text num>{time}</Text></Row>
                        <Row justify="between"><Text muted>Total</Text><Text num>{moneyFormatter.format(service.price)}</Text></Row>
                      </Stack>
                    </Card>
                    <Text size="sm" muted>Confirmation will be sent to {email}.</Text>
                    <Row justify="between">
                      <Button variant="quiet" onClick={() => setStep(2)}>Edit details</Button>
                      <Button tone="mint" onClick={() => setConfirmed(true)}>Confirm booking</Button>
                    </Row>
                  </Stack>
                ) : null}
              </Stack>
            )}
          </Card>
        </Grid>

        <Footer
          brand="Soft Hours"
          tagline="Thoughtful sessions for teams and founders."
          columns={[
            { title: 'Explore', links: [{ label: 'Services', href: '#services' }, { label: 'About', href: '#about' }] },
            { title: 'Support', links: [{ label: 'FAQ', href: '#faq' }, { label: 'Contact', href: '#contact' }] },
          ]}
          note="© 2026 Soft Hours. Example booking template."
        />
      </Stack>
    </div>
  )
}
