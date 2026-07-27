import { useRef, useState, type FormEvent } from 'react'
import { Button } from '../Button'
import { Select } from '../controls'
import { Empty } from '../feedback'
import { Field, Input, Textarea } from '../Input'
import { Grid, Row, Stack } from '../layout'
import { Badge, Blob } from '../media'
import { Card } from '../surface'
import { Eyebrow, Heading, Text } from '../text'

const TOPICS = [
  { value: 'project', label: 'Start a project' },
  { value: 'support', label: 'Product support' },
  { value: 'press', label: 'Press & partnerships' },
]

interface FormState {
  name: string
  email: string
  topic: string
  message: string
}

const EMPTY_FORM: FormState = { name: '', email: '', topic: 'project', message: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** A drop-in contact section with inline validation and a submitted state. */
export function ContactBlock() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Add your name so the reply has somewhere to land.'
    if (!EMAIL_PATTERN.test(form.email)) next.email = 'Enter a complete email, like you@example.com.'
    if (form.message.trim().length < 20) next.message = 'Share at least 20 characters so the team can help.'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      setSubmitted(true)
      return
    }
    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else messageRef.current?.focus()
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: 24 }}>
      <Grid cols="sidebar" gap={6}>
        <Stack gap={5}>
          <Stack gap={3}>
            <Badge tone="mint">Usually replies in 1 day</Badge>
            <Eyebrow>Contact the studio</Eyebrow>
            <Heading level={1}>Tell us what you’re making.</Heading>
            <Text muted>
              A useful first note is enough. Share the goal, the tricky part, and when you want to ship.
            </Text>
          </Stack>
          <Card variant="tight" motion="tilt-left">
            <Row gap={3} wrap={false} align="top">
              <Blob icon="mail" tone="blue" size="sm" />
              <Stack gap={1}>
                <Text>Prefer email?</Text>
                <Text size="sm" muted>hello@example.com</Text>
              </Stack>
            </Row>
          </Card>
          <Card variant="tight" motion="tilt-right">
            <Row gap={3} wrap={false} align="top">
              <Blob icon="clock" tone="yellow" size="sm" />
              <Stack gap={1}>
                <Text>Thoughtful, not instant</Text>
                <Text size="sm" muted>Every message is read by a person, Monday–Friday.</Text>
              </Stack>
            </Row>
          </Card>
        </Stack>

        <Card>
          {submitted ? (
            <Stack gap={4}>
              <Empty icon="send" title="Message sent">
                Thanks, {form.name.trim()}. A reply will go to {form.email}.
              </Empty>
              <Button
                block
                variant="quiet"
                onClick={() => {
                  setForm(EMPTY_FORM)
                  setSubmitted(false)
                }}
              >
                Send another message
              </Button>
            </Stack>
          ) : (
            <form onSubmit={submit} noValidate>
              <Stack gap={4}>
                <Field label="Name" error={errors.name}>
                  {(id, describedBy) => (
                    <Input
                      ref={nameRef}
                      id={id}
                      name="name"
                      value={form.name}
                      onChange={(value) => update('name', value)}
                      describedBy={describedBy}
                      invalid={!!errors.name}
                      autoComplete="name"
                      placeholder="Ada Lovelace…"
                    />
                  )}
                </Field>
                <Field label="Email" error={errors.email}>
                  {(id, describedBy) => (
                    <Input
                      ref={emailRef}
                      id={id}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(value) => update('email', value)}
                      describedBy={describedBy}
                      invalid={!!errors.email}
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="ada@example.com…"
                    />
                  )}
                </Field>
                <Field label="What can we help with?">
                  {(id, describedBy) => (
                    <Select
                      id={id}
                      value={form.topic}
                      onChange={(value) => update('topic', value)}
                      options={TOPICS}
                      describedBy={describedBy}
                    />
                  )}
                </Field>
                <Field label="Message" error={errors.message} hint="A few sentences is plenty.">
                  {(id, describedBy) => (
                    <Textarea
                      ref={messageRef}
                      id={id}
                      name="message"
                      value={form.message}
                      onChange={(value) => update('message', value)}
                      describedBy={describedBy}
                      invalid={!!errors.message}
                      autoComplete="off"
                      placeholder="We’re building…"
                      rows={6}
                    />
                  )}
                </Field>
                <Button block type="submit">Send message</Button>
              </Stack>
            </form>
          )}
        </Card>
      </Grid>
    </div>
  )
}
