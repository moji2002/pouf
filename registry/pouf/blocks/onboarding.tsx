import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Field, Input } from '../Input'
import { RadioGroup } from '../radiogroup'
import { Button } from '../Button'
import { Progress } from '../progress'

const STEPS = ['Account', 'Workspace', 'Preferences']

const PLAN_OPTIONS = [
  { value: 'solo', label: 'Just me' },
  { value: 'team', label: 'With a team' },
  { value: 'org', label: 'Whole organization' },
]

interface StepErrors {
  name?: string
  workspace?: string
}

/** An example onboarding wizard: a progress bar, per-step forms, and
 * back/next navigation — each step's answer is held in state that outlives
 * the step, so paging back and forth (or finishing) never loses what was
 * typed. The finish screen recaps every answer to prove it. */
export function OnboardingBlock() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [workspace, setWorkspace] = useState('')
  const [plan, setPlan] = useState('solo')
  const [errors, setErrors] = useState<StepErrors>({})
  const [done, setDone] = useState(false)

  const pct = done ? 100 : ((step + 1) / STEPS.length) * 100

  function validateStep(): boolean {
    if (step === 0 && !name.trim()) {
      setErrors({ name: 'Tell us what to call you.' })
      return false
    }
    if (step === 1 && !workspace.trim()) {
      setErrors({ workspace: 'Pick a name for your workspace.' })
      return false
    }
    setErrors({})
    return true
  }

  function goNext() {
    if (!validateStep()) return
    if (step === STEPS.length - 1) setDone(true)
    else setStep((s) => s + 1)
  }

  function goBack() {
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }

  function reset() {
    setStep(0)
    setName('')
    setWorkspace('')
    setPlan('solo')
    setErrors({})
    setDone(false)
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={5}>
          <Stack gap={2}>
            <Eyebrow>{done ? 'All set' : `Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`}</Eyebrow>
            <Progress value={pct} tone="mint" label="Setup progress" />
          </Stack>

          {done ? (
            <Stack gap={4}>
              <Heading level={2}>You're all set, {name}</Heading>
              <Text muted>Nothing you typed on the way here was lost — here's what we kept.</Text>
              <Stack gap={2}>
                <Row justify="between" wrap={false}>
                  <Text size="sm" muted>Workspace</Text>
                  <Text size="sm">{workspace}</Text>
                </Row>
                <Row justify="between" wrap={false}>
                  <Text size="sm" muted>Plan</Text>
                  <Text size="sm">{PLAN_OPTIONS.find((o) => o.value === plan)?.label}</Text>
                </Row>
              </Stack>
            </Stack>
          ) : (
            <>
              {step === 0 && (
                <Stack gap={4}>
                  <Heading level={2}>Welcome to Pouf</Heading>
                  <Field label="Your name" error={errors.name}>
                    {(id, describedBy) => (
                      <Input
                        id={id}
                        describedBy={describedBy}
                        value={name}
                        onChange={(v) => {
                          setName(v)
                          if (errors.name) setErrors({})
                        }}
                        placeholder="Ada Lovelace"
                        invalid={!!errors.name}
                      />
                    )}
                  </Field>
                </Stack>
              )}
              {step === 1 && (
                <Stack gap={4}>
                  <Heading level={2}>Name your workspace</Heading>
                  <Field label="Workspace" hint="You can change this later." error={errors.workspace}>
                    {(id, describedBy) => (
                      <Input
                        id={id}
                        describedBy={describedBy}
                        value={workspace}
                        onChange={(v) => {
                          setWorkspace(v)
                          if (errors.workspace) setErrors({})
                        }}
                        placeholder="acme"
                        invalid={!!errors.workspace}
                      />
                    )}
                  </Field>
                </Stack>
              )}
              {step === 2 && (
                <Stack gap={4}>
                  <Heading level={2}>How will you use it?</Heading>
                  <RadioGroup label="Plan" value={plan} onChange={setPlan} options={PLAN_OPTIONS} />
                </Stack>
              )}
            </>
          )}

          {done ? (
            <Button variant="quiet" onClick={reset}>Start over</Button>
          ) : (
            <Row wrap={false}>
              <Button variant="quiet" disabled={step === 0} onClick={goBack}>Back</Button>
              <Spacer />
              {step < STEPS.length - 1 ? (
                <Button onClick={goNext}>Continue</Button>
              ) : (
                <Button tone="mint" onClick={goNext}>Finish</Button>
              )}
            </Row>
          )}
        </Stack>
      </Card>
    </div>
  )
}
