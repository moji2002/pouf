import { Stack, Row, Spacer, Grid, Shell, Sidebar } from '../layout'
import { Text } from '../text'
import { Card } from '../surface'
import { Badge } from '../media'
import type { Demo } from './types'

export const stackDemos: Demo[] = [
  { id: 'default', render: () => (
      <Stack>
        <Text>First line</Text>
        <Text>Second line</Text>
        <Text>Third line</Text>
      </Stack>
    ) },
  { id: 'tight-gap', render: () => (
      <Stack gap={1}>
        <Text size="sm">Tight</Text>
        <Text size="sm">stack</Text>
      </Stack>
    ) },
  { id: 'loose-gap', render: () => (
      <Stack gap={6}>
        <Text>Loose</Text>
        <Text>stack</Text>
      </Stack>
    ) },
  // Spacer folded in here — meaningless as its own demo.
  { id: 'spacer', render: () => (
      <Card variant="tight">
        <Row wrap={false}>
          <Text>Pinned left</Text>
          <Spacer />
          <Badge tone="info">Pinned right</Badge>
        </Row>
      </Card>
    ) },
]

export const rowDemos: Demo[] = [
  { id: 'default', render: () => (
      <Row>
        <Text>One</Text>
        <Text>Two</Text>
        <Text>Three</Text>
      </Row>
    ) },
  { id: 'between', render: () => (
      <Row justify="between" wrap={false}>
        <Text>Left</Text>
        <Text>Right</Text>
      </Row>
    ) },
  { id: 'center', render: () => (
      <Row justify="center">
        <Badge>Centered</Badge>
      </Row>
    ) },
  { id: 'top-align', render: () => (
      <Row align="top">
        <Text size="sm" muted>Label</Text>
        <Stack gap={1}>
          <Text>Line one</Text>
          <Text>Line two</Text>
        </Stack>
      </Row>
    ) },
]

export const gridDemos: Demo[] = [
  { id: 'cols-2', render: () => (
      <Grid cols={2}>
        <Card variant="tight"><Text>A</Text></Card>
        <Card variant="tight"><Text>B</Text></Card>
      </Grid>
    ) },
  { id: 'cols-3', render: () => (
      <Grid cols={3}>
        <Card variant="tight"><Text>A</Text></Card>
        <Card variant="tight"><Text>B</Text></Card>
        <Card variant="tight"><Text>C</Text></Card>
      </Grid>
    ) },
  { id: 'cols-4', render: () => (
      <Grid cols={4}>
        <Card variant="tight"><Text>A</Text></Card>
        <Card variant="tight"><Text>B</Text></Card>
        <Card variant="tight"><Text>C</Text></Card>
        <Card variant="tight"><Text>D</Text></Card>
      </Grid>
    ) },
]

export const shellDemos: Demo[] = [
  { id: 'default', render: () => (
      <Shell>
        <Text>Shell content area.</Text>
      </Shell>
    ) },
]

export const sidebarDemos: Demo[] = [
  { id: 'default', render: () => (
      <Sidebar>
        <Stack gap={2}>
          <Text>Overview</Text>
          <Text muted>Settings</Text>
        </Stack>
      </Sidebar>
    ) },
]
