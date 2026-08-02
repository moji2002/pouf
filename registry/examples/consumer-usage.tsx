import { renderToStaticMarkup } from 'react-dom/server'
import { Button } from '../pouf/Button'
import { Stack } from '../pouf/layout'
import { Card } from '../pouf/surface'
import { Heading, Text } from '../pouf/text'

/**
 * A tiny consumer-shaped example: import the same public component files the
 * registry installs, compose them in an application component, and render the
 * result without depending on 1st-Pouf's gallery or test harness.
 */
function SavePanel() {
  return (
    <Card motion="lift">
      <Stack gap={3}>
        <Heading level={2}>Profile ready</Heading>
        <Text muted>Your public changes are ready to publish.</Text>
        <Button tone="mint" type="button">
          Publish profile
        </Button>
      </Stack>
    </Card>
  )
}

const markup = renderToStaticMarkup(<SavePanel />)

console.log('Rendered a consumer-facing 1st-Pouf composition:')
console.log(markup)
