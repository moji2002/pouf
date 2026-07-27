import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Card } from '../surface'
import { Stack, Row } from '../layout'
import { Heading, Text } from '../text'
import { Field, Input } from '../Input'
import { Button } from '../Button'
import { Separator } from '../separator'
import { Blob } from '../media'
import { Empty } from '../feedback'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LoginValues {
  email: string
  password: string
}

const DEFAULT_VALUES: LoginValues = { email: '', password: '' }

/** A centered auth card with real validation (inline errors, not just red
 * borders), a password field that toggles to plain text, and a magic-link
 * fallback with its own validated email step and a "check your inbox"
 * confirmation. Wire `handleSignIn`/`handleSendMagicLink` to your backend —
 * the client-side checks are real, the network call is yours. */
export function LoginBlock() {
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [magicSent, setMagicSent] = useState(false)
  const {
    control,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })
  const email = useWatch({ control, name: 'email' })

  const submit = handleSubmit((values) => {
    if (mode === 'magic') {
      setMagicSent(true)
      return
    }
    // Validation passed — hand values.email / values.password to your auth API.
  })

  function switchToMagic() {
    setMode('magic')
    setMagicSent(false)
    clearErrors()
  }

  function switchToPassword() {
    setMode('password')
    clearErrors()
  }

  const emailField = (
    <Field label="Email" error={errors.email?.message}>
      {(id, describedBy) => (
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required.',
            pattern: {
              value: EMAIL_RE,
              message: 'Enter a valid email address.',
            },
          }}
          render={({ field }) => (
            <Input
              ref={field.ref}
              id={id}
              name={field.name}
              describedBy={describedBy}
              type="email"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              invalid={!!errors.email}
            />
          )}
        />
      )}
    </Field>
  )

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <form onSubmit={submit} noValidate>
          <Card>
            <Stack gap={5}>
              <Stack gap={3}>
                <Blob icon={mode === 'magic' ? 'mail' : 'lock'} tone="purple" />
                <Stack gap={1}>
                  <Heading level={2}>{mode === 'magic' ? 'Sign in with email' : 'Welcome back'}</Heading>
                  <Text size="sm" muted>
                    {mode === 'magic' ? "We'll email you a one-time sign-in link." : 'Sign in to your Pouf account.'}
                  </Text>
                </Stack>
              </Stack>

              {mode === 'magic' ? (
                magicSent ? (
                  <Stack gap={3}>
                    <div role="status" aria-live="polite">
                      <Empty icon="mail" title="Check your inbox">
                        We sent a sign-in link to {email}. It expires in 15 minutes.
                      </Empty>
                    </div>
                    <Button block variant="quiet" onClick={() => setMagicSent(false)}>Use a different email</Button>
                  </Stack>
                ) : (
                  <Stack gap={4}>
                    {emailField}
                    <Button block type="submit" loading={isSubmitting}>Send magic link</Button>
                  </Stack>
                )
              ) : (
                <Stack gap={4}>
                  {emailField}
                  <Field label="Password" error={errors.password?.message}>
                    {(id, describedBy) => (
                      <Row gap={2} wrap={false}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Controller
                            name="password"
                            control={control}
                            shouldUnregister
                            rules={{
                              required: 'Password is required.',
                              minLength: {
                                value: 8,
                                message: 'Use at least 8 characters.',
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                ref={field.ref}
                                id={id}
                                name={field.name}
                                describedBy={describedBy}
                                type={showPassword ? 'text' : 'password'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                                invalid={!!errors.password}
                              />
                            )}
                          />
                        </div>
                        <Button variant="quiet" onClick={() => setShowPassword((s) => !s)}>
                          {showPassword ? 'Hide' : 'Show'}
                        </Button>
                      </Row>
                    )}
                  </Field>
                  <Button block type="submit" loading={isSubmitting}>Sign in</Button>
                </Stack>
              )}

              <Separator />
              {mode === 'password' ? (
                <Button block variant="quiet" onClick={switchToMagic}>Continue with a magic link</Button>
              ) : (
                <Button block variant="quiet" onClick={switchToPassword}>Back to password sign-in</Button>
              )}
              <Row justify="center">
                <Text size="sm" muted>New here? Create an account.</Text>
              </Row>
            </Stack>
          </Card>
        </form>
      </div>
    </div>
  )
}
