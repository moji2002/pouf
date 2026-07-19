import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row } from '../layout'
import { Heading, Text } from '../text'
import { Field, Input } from '../Input'
import { Button } from '../Button'
import { Separator } from '../separator'
import { Blob } from '../media'

/** An example auth screen composed entirely from Pouf primitives. Drop it in,
 * wire `onSubmit` to your backend, and restyle by editing — it's yours. */
export function LoginBlock() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Card>
          <Stack gap={5}>
            <Stack gap={3}>
              <Blob icon="target" tone="purple" />
              <Stack gap={1}>
                <Heading level={2}>Welcome back</Heading>
                <Text size="sm" muted>Sign in to your Pouf account.</Text>
              </Stack>
            </Stack>

            <Field label="Email">
              {(id, describedBy) => (
                <Input id={id} describedBy={describedBy} type="text" value={email} onChange={setEmail} placeholder="you@example.com" />
              )}
            </Field>
            <Field label="Password">
              {(id, describedBy) => (
                <Input id={id} describedBy={describedBy} type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              )}
            </Field>

            <Button block onClick={() => {}}>Sign in</Button>
            <Separator />
            <Button block variant="quiet" onClick={() => {}}>Continue with a magic link</Button>
            <Row justify="center">
              <Text size="sm" muted>New here? Create an account.</Text>
            </Row>
          </Stack>
        </Card>
      </div>
    </div>
  )
}
