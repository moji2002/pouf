import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Field, Input, Textarea } from '../Input'
import { Button } from '../Button'
import { Switch, TooltipProvider } from '../controls'
import { Slider } from '../slider'
import { RadioGroup } from '../radiogroup'
import { Tabs } from '../disclosure'
import { Separator } from '../separator'

/** An example settings screen: tabbed sections of Pouf form controls with a
 * sticky save bar. Wire the values to your store; the layout is yours to edit. */
export function SettingsBlock() {
  const [tab, setTab] = useState('profile')
  const [name, setName] = useState('Ada Lovelace')
  const [bio, setBio] = useState('Building puffy interfaces.')
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [density, setDensity] = useState('comfortable')
  const [volume, setVolume] = useState([60])

  const profile = (
    <Stack gap={4}>
      <Field label="Display name">
        {(id, describedBy) => <Input id={id} describedBy={describedBy} value={name} onChange={setName} />}
      </Field>
      <Field label="Bio" hint="A sentence or two.">
        {(id, describedBy) => <Textarea id={id} describedBy={describedBy} value={bio} onChange={setBio} />}
      </Field>
      <Field label="Density">
        {() => (
          <RadioGroup
            label="Density"
            value={density}
            onChange={setDensity}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
        )}
      </Field>
    </Stack>
  )

  const notifications = (
    <Stack gap={4}>
      <Row justify="between">
        <Stack gap={1}>
          <Text>Email notifications</Text>
          <Text size="sm" muted>Product news and account activity.</Text>
        </Stack>
        <Switch checked={emailNotif} onChange={setEmailNotif} label="Email notifications" />
      </Row>
      <Separator />
      <Row justify="between">
        <Stack gap={1}>
          <Text>Push notifications</Text>
          <Text size="sm" muted>Sent to your devices in real time.</Text>
        </Stack>
        <Switch checked={pushNotif} onChange={setPushNotif} label="Push notifications" />
      </Row>
      <Separator />
      <Stack gap={2}>
        <Text>Alert volume</Text>
        <Slider value={volume} onChange={setVolume} label="Alert volume" />
      </Stack>
    </Stack>
  )

  return (
    <TooltipProvider>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
        <Card>
          <Stack gap={5}>
            <Stack gap={1}>
              <Eyebrow>Account</Eyebrow>
              <Heading level={2}>Settings</Heading>
            </Stack>
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'profile', label: 'Profile', content: profile },
                { value: 'notifications', label: 'Notifications', content: notifications },
              ]}
            />
            <Row justify="end" gap={2}>
              <Button variant="quiet" onClick={() => {}}>Cancel</Button>
              <Button tone="mint" onClick={() => {}}>Save changes</Button>
            </Row>
          </Stack>
        </Card>
      </div>
    </TooltipProvider>
  )
}
