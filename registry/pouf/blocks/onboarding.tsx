import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Field, Input } from '../Input'
import { RadioGroup } from '../radiogroup'
import { Button } from '../Button'
import { Progress } from '../progress'

const STEPS = ['Account', 'Workspace', 'Preferences']

/** An example onboarding wizard: a progress bar, per-step forms, and
 * back/next navigation. */
export function OnboardingBlock() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [workspace, setWorkspace] = useState('')
  const [plan, setPlan] = useState('solo')

  const pct = ((step + 1) / STEPS.length) * 100

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={5}>
          <Stack gap={2}>
            <Eyebrow>Step {step + 1} of {STEPS.length} · {STEPS[step]}</Eyebrow>
            <Progress value={pct} tone="mint" label="Setup progress" />
          </Stack>

          {step === 0 && (
            <Stack gap={4}>
              <Heading level={2}>Welcome to Pouf</Heading>
              <Field label="Your name">
                {(id, describedBy) => <Input id={id} describedBy={describedBy} value={name} onChange={setName} placeholder="Ada Lovelace" />}
              </Field>
            </Stack>
          )}
          {step === 1 && (
            <Stack gap={4}>
              <Heading level={2}>Name your workspace</Heading>
              <Field label="Workspace" hint="You can change this later.">
                {(id, describedBy) => <Input id={id} describedBy={describedBy} value={workspace} onChange={setWorkspace} placeholder="acme" />}
              </Field>
            </Stack>
          )}
          {step === 2 && (
            <Stack gap={4}>
              <Heading level={2}>How will you use it?</Heading>
              <RadioGroup
                label="Plan"
                value={plan}
                onChange={setPlan}
                options={[
                  { value: 'solo', label: 'Just me' },
                  { value: 'team', label: 'With a team' },
                  { value: 'org', label: 'Whole organization' },
                ]}
              />
            </Stack>
          )}

          <Row wrap={false}>
            <Button variant="quiet" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
            <Spacer />
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Continue</Button>
            ) : (
              <Button tone="mint" onClick={() => {}}>Finish</Button>
            )}
          </Row>
        </Stack>
      </Card>
    </div>
  )
}
