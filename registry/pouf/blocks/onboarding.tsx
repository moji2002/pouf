import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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

interface OnboardingValues {
  name: string
  workspace: string
  plan: string
}

/** An example onboarding wizard: a progress bar, per-step forms, and
 * back/next navigation — each step's answer is held in state that outlives
 * the step, so paging back and forth (or finishing) never loses what was
 * typed. The finish screen recaps every answer to prove it. */
export function OnboardingBlock() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const {
    control,
    clearErrors,
    reset: resetForm,
    trigger,
    watch,
    formState: { errors },
  } = useForm<OnboardingValues>({
    defaultValues: { name: '', workspace: '', plan: 'solo' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const { name, workspace, plan } = watch()

  const pct = done ? 100 : ((step + 1) / STEPS.length) * 100

  async function goNext() {
    const field = step === 0 ? 'name' : step === 1 ? 'workspace' : undefined
    if (field && !(await trigger(field, { shouldFocus: true }))) return
    if (step === STEPS.length - 1) setDone(true)
    else setStep((s) => s + 1)
  }

  function goBack() {
    clearErrors()
    setStep((s) => Math.max(0, s - 1))
  }

  function reset() {
    setStep(0)
    resetForm()
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
            <form
              onSubmit={(event) => {
                event.preventDefault()
                void goNext()
              }}
              noValidate
            >
              {step === 0 && (
                <Stack gap={4}>
                  <Heading level={2}>Welcome to 1st-Pouf</Heading>
                  <Field label="Your name" error={errors.name?.message}>
                    {(id, describedBy) => (
                      <Controller
                        name="name"
                        control={control}
                        rules={{ validate: (value) => value.trim().length > 0 || 'Tell us what to call you.' }}
                        render={({ field }) => (
                          <Input
                            ref={field.ref}
                            id={id}
                            name={field.name}
                            describedBy={describedBy}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Ada Lovelace…"
                            autoComplete="name"
                            invalid={!!errors.name}
                            required
                          />
                        )}
                      />
                    )}
                  </Field>
                </Stack>
              )}
              {step === 1 && (
                <Stack gap={4}>
                  <Heading level={2}>Name your workspace</Heading>
                  <Field label="Workspace" hint="You can change this later." error={errors.workspace?.message}>
                    {(id, describedBy) => (
                      <Controller
                        name="workspace"
                        control={control}
                        rules={{
                          validate: (value) => value.trim().length > 0 || 'Pick a name for your workspace.',
                        }}
                        render={({ field }) => (
                          <Input
                            ref={field.ref}
                            id={id}
                            name={field.name}
                            describedBy={describedBy}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Acme…"
                            autoComplete="organization"
                            invalid={!!errors.workspace}
                            required
                          />
                        )}
                      />
                    )}
                  </Field>
                </Stack>
              )}
              {step === 2 && (
                <Stack gap={4}>
                  <Heading level={2}>How will you use it?</Heading>
                  <Controller
                    name="plan"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup label="Plan" value={field.value} onChange={field.onChange} options={PLAN_OPTIONS} />
                    )}
                  />
                </Stack>
              )}
              <div style={{ marginTop: 24 }}>
                <Row wrap={false}>
                  <Button variant="quiet" disabled={step === 0} onClick={goBack}>Back</Button>
                  <Spacer />
                  {step < STEPS.length - 1 ? (
                    <Button type="submit">Continue</Button>
                  ) : (
                    <Button type="submit" tone="mint">Finish</Button>
                  )}
                </Row>
              </div>
            </form>
          )}

          {done ? (
            <Button variant="quiet" onClick={reset}>Start over</Button>
          ) : null}
        </Stack>
      </Card>
    </div>
  )
}
