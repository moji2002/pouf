import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Card } from '../surface'
import { Shell, Sidebar, Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Field, Input, Textarea } from '../Input'
import { Button } from '../Button'
import { Switch, TooltipProvider } from '../controls'
import { Slider } from '../slider'
import { RadioGroup } from '../radiogroup'
import { Tabs } from '../disclosure'
import { Separator } from '../separator'
import { Badge, Blob } from '../media'
import { NavLink } from '../NavLink'
import { BottomNav, type NavItem } from '../BottomNav'

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/inbox', label: 'Inbox', icon: 'mail', tone: 'blue' },
  { href: '/board', label: 'Board', icon: 'log', tone: 'mint' },
  { href: '/messages', label: 'Messages', icon: 'comment', tone: 'pink' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/settings'

/** Every value the form owns, in one object — so "has anything changed?" is a
 *  single comparison against the last saved copy rather than six `useState`
 *  flags that drift out of sync the moment a seventh field is added. */
interface Settings {
  name: string
  bio: string
  emailNotif: boolean
  pushNotif: boolean
  density: string
  volume: number
}

const INITIAL: Settings = {
  name: 'Ada Lovelace',
  bio: 'Building puffy interfaces.',
  emailNotif: true,
  pushNotif: false,
  density: 'comfortable',
  volume: 60,
}

/** An example settings screen: app shell, tabbed sections of Pouf form
 * controls, and a save bar that only wakes up when something actually
 * changed — Cancel restores the last saved values, Save commits them. */
export function SettingsBlock() {
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState<Settings>(INITIAL)
  const [justSaved, setJustSaved] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<Settings>({ defaultValues: INITIAL })
  const form = useWatch({ control })

  const save = handleSubmit((values) => {
    setSaved(values)
    reset(values)
    setJustSaved(true)
  })

  function changed<T>(onChange: (value: T) => void) {
    return (value: T) => {
      onChange(value)
      setJustSaved(false)
    }
  }

  const profile = (
    <Stack gap={4}>
      <Field label="Display name">
        {(id, describedBy) => (
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                ref={field.ref}
                id={id}
                name={field.name}
                describedBy={describedBy}
                value={field.value}
                onChange={changed(field.onChange)}
                onBlur={field.onBlur}
                autoComplete="name"
              />
            )}
          />
        )}
      </Field>
      <Field label="Bio" hint="A sentence or two.">
        {(id, describedBy) => (
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <Textarea
                ref={field.ref}
                id={id}
                name={field.name}
                describedBy={describedBy}
                value={field.value}
                onChange={changed(field.onChange)}
                onBlur={field.onBlur}
              />
            )}
          />
        )}
      </Field>
      <Field label="Density">
        {() => (
          <Controller
            name="density"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Density"
                value={field.value}
                onChange={changed(field.onChange)}
                options={[
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'compact', label: 'Compact' },
                ]}
              />
            )}
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
        <Controller
          name="emailNotif"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={changed(field.onChange)}
              label="Email notifications"
            />
          )}
        />
      </Row>
      <Separator />
      <Row justify="between">
        <Stack gap={1}>
          <Text>Push notifications</Text>
          <Text size="sm" muted>Sent to your devices in real time.</Text>
        </Stack>
        <Controller
          name="pushNotif"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={changed(field.onChange)}
              label="Push notifications"
            />
          )}
        />
      </Row>
      <Separator />
      <Stack gap={2}>
        <Row justify="between">
          <Text>Alert volume</Text>
          <Text size="sm" muted num>{form.volume}</Text>
        </Row>
        <Controller
          name="volume"
          control={control}
          render={({ field }) => (
            <Slider
              value={[field.value]}
              onChange={(value) => changed(field.onChange)(value[0] ?? 0)}
              label="Alert volume"
            />
          )}
        />
      </Stack>
    </Stack>
  )

  return (
    <TooltipProvider>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="target" tone="purple" size="sm" />
            <Heading level={3}>Acme</Heading>
          </Row>
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} currentPath={HERE} icon={item.icon} tone={item.tone}>
              {item.label}
            </NavLink>
          ))}
        </Sidebar>

        <Stack gap={5}>
          <Row justify="between">
            <Stack gap={1}>
              <Eyebrow>Account</Eyebrow>
              <Heading level={1}>Settings</Heading>
            </Stack>
            {isDirty ? (
              <Badge tone="yellow">Unsaved changes</Badge>
            ) : justSaved ? (
              <Badge tone="mint">Saved</Badge>
            ) : null}
          </Row>

          <Card>
            <form onSubmit={save}>
              <Stack gap={5}>
                <Tabs
                  value={tab}
                  onChange={setTab}
                  tabs={[
                    { value: 'profile', label: 'Profile', content: profile },
                    { value: 'notifications', label: 'Notifications', content: notifications },
                  ]}
                />
                <Separator />
                <Row justify="between">
                  <Text size="sm" muted>
                    {isDirty ? 'You have unsaved changes.' : 'Everything is up to date.'}
                  </Text>
                  <Row gap={2} wrap={false}>
                    <Button
                      variant="quiet"
                      disabled={!isDirty}
                      onClick={() => {
                        reset(saved)
                        setJustSaved(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" tone="mint" disabled={!isDirty}>
                      Save changes
                    </Button>
                  </Row>
                </Row>
              </Stack>
            </form>
          </Card>
          <Spacer />
        </Stack>
      </Shell>
      <BottomNav primary={NAV.slice(0, 4)} groups={[{ title: 'App', items: NAV }]} currentPath={HERE} />
    </TooltipProvider>
  )
}
