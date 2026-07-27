import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Navbar } from '../navbar'
import { Footer } from '../footer'
import { Card } from '../surface'
import { Stack, Row, Grid, Spacer } from '../layout'
import { Heading, Text, Eyebrow, Highlight } from '../text'
import { Button } from '../Button'
import { Field, Input } from '../Input'
import { Segmented } from '../Segmented'
import { Empty } from '../feedback'
import { Badge, Blob } from '../media'
import { Icon } from '../Icon'

type Category = 'all' | 'desk' | 'travel' | 'home'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Exclude<Category, 'all'>
  tone: 'purple' | 'pink' | 'blue' | 'mint' | 'yellow' | 'orange'
  icon: 'sparkle' | 'music' | 'clock' | 'home' | 'drop' | 'cart'
  badge?: string
}

interface SearchForm {
  query: string
}

const PRODUCTS: Product[] = [
  {
    id: 'cloud-lamp',
    name: 'Cloud lamp',
    description: 'A soft desk light with three warm settings.',
    price: 68,
    category: 'desk',
    tone: 'yellow',
    icon: 'sparkle',
    badge: 'Bestseller',
  },
  {
    id: 'focus-timer',
    name: 'Focus timer',
    description: 'A silent, tactile timer for deep-work sessions.',
    price: 42,
    category: 'desk',
    tone: 'purple',
    icon: 'clock',
  },
  {
    id: 'pocket-speaker',
    name: 'Pocket speaker',
    description: 'Big sound, tiny body, twelve-hour battery.',
    price: 84,
    category: 'travel',
    tone: 'pink',
    icon: 'music',
    badge: 'New',
  },
  {
    id: 'weekend-bag',
    name: 'Weekend bag',
    description: 'A roomy carry-on made from recycled canvas.',
    price: 116,
    category: 'travel',
    tone: 'blue',
    icon: 'cart',
  },
  {
    id: 'soft-vase',
    name: 'Soft vase',
    description: 'A playful ceramic home for small bouquets.',
    price: 54,
    category: 'home',
    tone: 'mint',
    icon: 'home',
  },
  {
    id: 'rain-carafe',
    name: 'Rain carafe',
    description: 'Hand-blown glass with a comfortable rounded grip.',
    price: 72,
    category: 'home',
    tone: 'orange',
    icon: 'drop',
  },
]

const money = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const brand = (
  <>
    <Blob icon="sparkle" tone="yellow" size="sm" />
    Lumo
  </>
)

/** A complete storefront route: responsive site chrome, merchandising,
 * category and search filters, an empty state, a working bag, quantity
 * controls, totals, and an order-complete state. Search is wired with React
 * Hook Form; the Pouf controls themselves stay library-neutral. */
export function StorefrontBlock() {
  const [category, setCategory] = useState<Category>('all')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [placed, setPlaced] = useState(false)
  const { control } = useForm<SearchForm>({ defaultValues: { query: '' } })
  const query = useWatch({ control, name: 'query' })

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return PRODUCTS.filter(
      (product) =>
        (category === 'all' || product.category === category) &&
        (!needle ||
          `${product.name} ${product.description} ${product.category}`
            .toLowerCase()
            .includes(needle)),
    )
  }, [category, query])

  const lines = PRODUCTS.filter((product) => (cart[product.id] ?? 0) > 0)
  const count = lines.reduce((total, product) => total + (cart[product.id] ?? 0), 0)
  const subtotal = lines.reduce(
    (total, product) => total + product.price * (cart[product.id] ?? 0),
    0,
  )
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8

  function changeQuantity(id: string, delta: number) {
    setPlaced(false)
    setCart((current) => {
      const next = Math.max(0, (current[id] ?? 0) + delta)
      if (next === 0) {
        const { [id]: _removed, ...rest } = current
        return rest
      }
      return { ...current, [id]: next }
    })
  }

  function scrollToShop() {
    scrollToSection('shop')
  }

  function scrollToSection(id: string) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="max-w-[1180px] mx-auto p-(--s5) max-[620px]:p-(--s3)">
      <Stack gap={6}>
        <Navbar
          brand={brand}
          links={[
            { label: 'Shop', href: '#shop', active: true },
            { label: 'Story', href: '#story' },
            { label: 'Shipping', href: '#shipping' },
          ]}
          actions={
            <Button size="sm" variant="quiet" onClick={() => scrollToSection('bag')}>
              <Icon name="cart" size="sm" />
              Bag ({count})
            </Button>
          }
        />

        <Grid cols="sidebar" gap={5}>
          <Stack gap={4}>
            <Eyebrow>Useful things, softer edges</Eyebrow>
            <Heading level={1}>
              Small objects. <Highlight>Big delight.</Highlight>
            </Heading>
            <Text muted>
              Thoughtful pieces for desks, homes, and weekends away. Free
              shipping over $100 and easy returns for 30 days.
            </Text>
            <Row gap={2}>
              <Button size="lg" onClick={scrollToShop}>Shop the collection</Button>
              <Button
                size="lg"
                variant="quiet"
                onClick={() => scrollToSection('story')}
              >
                Our story
              </Button>
            </Row>
          </Stack>

          <Card>
            <Stack gap={3}>
              <Blob icon="cart" tone="pink" />
              <Heading level={3}>The weekend edit</Heading>
              <Text size="sm" muted>
                Three light, durable pieces chosen for spontaneous trips.
              </Text>
              <Badge tone="mint">Ships today</Badge>
            </Stack>
          </Card>
        </Grid>

        <section id="shop">
          <Stack gap={4}>
            <Row justify="between" align="top">
              <Stack gap={1}>
                <Eyebrow>Collection</Eyebrow>
                <Heading level={2}>Find your new favorite</Heading>
              </Stack>
              <Segmented
                label="Product category"
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'desk', label: 'Desk' },
                  { value: 'travel', label: 'Travel' },
                  { value: 'home', label: 'Home' },
                ]}
              />
            </Row>

            <form role="search" onSubmit={(event) => event.preventDefault()}>
              <Field label="Search products">
                {(id, describedBy) => (
                  <Controller
                    name="query"
                    control={control}
                    render={({ field }) => (
                      <Input
                        ref={field.ref}
                        id={id}
                        name={field.name}
                        describedBy={describedBy}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Try “lamp” or “travel”…"
                        autoComplete="off"
                      />
                    )}
                  />
                )}
              </Field>
            </form>

            <Grid cols="sidebar" gap={5}>
              <div aria-live="polite">
                {visible.length === 0 ? (
                  <Card>
                    <Empty icon="search" title="No products found">
                      Try another word or choose a different category.
                    </Empty>
                  </Card>
                ) : (
                  <Grid cols={2} gap={4}>
                    {visible.map((product) => (
                      <Card key={product.id}>
                        <Stack gap={3}>
                          <Row justify="between" align="top">
                            <Blob icon={product.icon} tone={product.tone} />
                            {product.badge ? <Badge tone={product.tone}>{product.badge}</Badge> : null}
                          </Row>
                          <Stack gap={1}>
                            <Heading level={3}>{product.name}</Heading>
                            <Text size="sm" muted>{product.description}</Text>
                          </Stack>
                          <Row justify="between">
                            <Text num>{money(product.price)}</Text>
                            <Button
                              size="sm"
                              tone={product.tone}
                              onClick={() => changeQuantity(product.id, 1)}
                            >
                              Add to bag
                            </Button>
                          </Row>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                )}
              </div>

              <div id="bag">
                <Card>
                  <Stack gap={4}>
                    <Row justify="between">
                      <Heading level={3}>Your bag</Heading>
                      <Badge tone={count > 0 ? 'purple' : 'blue'}>{count} items</Badge>
                    </Row>

                    {lines.length === 0 ? (
                      <Empty icon="cart" title="Your bag is empty">
                        Add something you love. It will wait here for you.
                      </Empty>
                    ) : (
                      <Stack gap={3}>
                        {lines.map((product) => {
                          const quantity = cart[product.id] ?? 0
                          return (
                            <Row key={product.id} gap={2} wrap={false}>
                              <Blob icon={product.icon} tone={product.tone} size="sm" />
                              <Stack gap={1}>
                                <Text truncate>{product.name}</Text>
                                <Text size="sm" muted num>
                                  {money(product.price * quantity)}
                                </Text>
                              </Stack>
                              <Spacer />
                              <Row gap={1} wrap={false}>
                                <Button
                                  size="sm"
                                  variant="quiet"
                                  label={`Remove one ${product.name}`}
                                  onClick={() => changeQuantity(product.id, -1)}
                                >
                                  <Icon name="remove" size="sm" />
                                </Button>
                                <Text num>{quantity}</Text>
                                <Button
                                  size="sm"
                                  variant="quiet"
                                  label={`Add one ${product.name}`}
                                  onClick={() => changeQuantity(product.id, 1)}
                                >
                                  <Icon name="add" size="sm" />
                                </Button>
                              </Row>
                            </Row>
                          )
                        })}
                        <div className="pt-(--s3) [border-top:1px_solid_rgba(201,168,255,0.3)]">
                          <Stack gap={2}>
                            <Row justify="between">
                              <Text size="sm" muted>Subtotal</Text>
                              <Text size="sm" num>{money(subtotal)}</Text>
                            </Row>
                            <Row justify="between">
                              <Text size="sm" muted>Shipping</Text>
                              <Text size="sm" num>{shipping ? money(shipping) : 'Free'}</Text>
                            </Row>
                            <Row justify="between">
                              <Text>Total</Text>
                              <Text num>{money(subtotal + shipping)}</Text>
                            </Row>
                          </Stack>
                        </div>
                      </Stack>
                    )}

                    {placed ? <Badge tone="mint">Order reserved</Badge> : null}
                    <Button
                      block
                      tone="mint"
                      disabled={count === 0}
                      onClick={() => setPlaced(true)}
                    >
                      {placed ? 'Order ready for checkout' : 'Reserve order'}
                    </Button>
                    <Text size="sm" muted>
                      Taxes calculated at checkout. Secure payment connects in
                      your app.
                    </Text>
                  </Stack>
                </Card>
              </div>
            </Grid>
          </Stack>
        </section>

        <section id="story">
          <Grid cols={3}>
            <Card>
              <Stack gap={2}>
                <Blob icon="heart" tone="pink" size="sm" />
                <Heading level={3}>Made to keep</Heading>
                <Text size="sm" muted>Durable materials, repairable parts, honest guarantees.</Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Blob icon="sparkle" tone="yellow" size="sm" />
                <Heading level={3}>Small-batch</Heading>
                <Text size="sm" muted>Produced in careful runs instead of disposable seasons.</Text>
              </Stack>
            </Card>
            <Card>
              <Stack gap={2}>
                <Blob icon="users" tone="blue" size="sm" />
                <Heading level={3}>Human support</Heading>
                <Text size="sm" muted>Real replies from the people who know every product.</Text>
              </Stack>
            </Card>
          </Grid>
        </section>

        <div id="shipping">
          <Footer
            brand={brand}
            tagline="Good objects for ordinary days."
            columns={[
              { title: 'Shop', links: [{ label: 'Desk', href: '#shop' }, { label: 'Travel', href: '#shop' }, { label: 'Home', href: '#shop' }] },
              { title: 'Help', links: [{ label: 'Shipping', href: '#shipping' }, { label: 'Returns', href: '#shipping' }, { label: 'Contact', href: '#shipping' }] },
              { title: 'About', links: [{ label: 'Our story', href: '#story' }, { label: 'Materials', href: '#story' }] },
            ]}
            note="© 2026 Lumo Goods. Built for demonstration—replace the catalog and checkout adapter with yours."
          />
        </div>
      </Stack>
    </div>
  )
}
