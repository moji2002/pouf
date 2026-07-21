import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row } from '../layout'
import { Heading, Text } from '../text'
import { Field, Input } from '../Input'
import { Button } from '../Button'
import { Separator } from '../separator'
import { Blob } from '../media'
import { Empty } from '../feedback'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormErrors {
  email?: string
  password?: string
}

/** A centered auth card with real validation (inline errors, not just red
 * borders), a password field that toggles to plain text, and a magic-link
 * fallback with its own validated email step and a "check your inbox"
 * confirmation. Wire `handleSignIn`/`handleSendMagicLink` to your backend —
 * the client-side checks are real, the network call is yours. */
export function LoginBlock() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [magicSent, setMagicSent] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function validateEmail(): boolean {
    if (!email.trim()) {
      setErrors((e) => ({ ...e, email: 'Email is required.' }))
      return false
    }
    if (!EMAIL_RE.test(email)) {
      setErrors((e) => ({ ...e, email: 'Enter a valid email address.' }))
      return false
    }
    setErrors((e) => ({ ...e, email: undefined }))
    return true
  }

  function handleSignIn() {
    const emailOk = validateEmail()
    let passwordOk = true
    if (!password) {
      setErrors((e) => ({ ...e, password: 'Password is required.' }))
      passwordOk = false
    } else if (password.length < 8) {
      setErrors((e) => ({ ...e, password: 'Use at least 8 characters.' }))
      passwordOk = false
    } else {
      setErrors((e) => ({ ...e, password: undefined }))
    }
    if (!emailOk || !passwordOk) return
    // Both checks passed — hand off to your auth API here.
  }

  function handleSendMagicLink() {
    if (!validateEmail()) return
    setMagicSent(true)
  }

  function switchToMagic() {
    setMode('magic')
    setMagicSent(false)
    setErrors({})
  }

  function switchToPassword() {
    setMode('password')
    setErrors({})
  }

  const emailField = (
    <Field label="Email" error={errors.email}>
      {(id, describedBy) => (
        <Input
          id={id}
          describedBy={describedBy}
          type="text"
          value={email}
          onChange={(v) => {
            setEmail(v)
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }))
          }}
          placeholder="you@example.com"
          invalid={!!errors.email}
        />
      )}
    </Field>
  )

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
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
                  <Empty icon="mail" title="Check your inbox">
                    We sent a sign-in link to {email}. It expires in 15 minutes.
                  </Empty>
                  <Button block variant="quiet" onClick={() => setMagicSent(false)}>Use a different email</Button>
                </Stack>
              ) : (
                <Stack gap={4}>
                  {emailField}
                  <Button block onClick={handleSendMagicLink}>Send magic link</Button>
                </Stack>
              )
            ) : (
              <Stack gap={4}>
                {emailField}
                <Field label="Password" error={errors.password}>
                  {(id, describedBy) => (
                    <Row gap={2} wrap={false}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Input
                          id={id}
                          describedBy={describedBy}
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(v) => {
                            setPassword(v)
                            if (errors.password) setErrors((e) => ({ ...e, password: undefined }))
                          }}
                          placeholder="••••••••"
                          invalid={!!errors.password}
                        />
                      </div>
                      <Button variant="quiet" onClick={() => setShowPassword((s) => !s)}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </Row>
                  )}
                </Field>
                <Button block onClick={handleSignIn}>Sign in</Button>
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
      </div>
    </div>
  )
}
