/* The one place the public origin is written down.
 *
 * Every install command the site prints has to resolve to wherever the site is
 * actually served from, and there are three separate places that used to spell
 * the host out by hand: these helpers, five `.astro` pages with literal
 * `npx shadcn@latest add https://…` strings, and the prefix-stripping in
 * `blocks/[slug].astro`. A domain move that only updates the helpers half-lands
 * — component pages print the new URL, the homepage keeps printing the old one,
 * and `npx shadcn add` 404s for whoever copied the wrong one.
 *
 * `registry.json` is the one unavoidable duplicate: shadcn fetches it as data
 * and resolves `registryDependencies` from the absolute URLs inside it, so it
 * carries its own copies. `bun scripts/set-origin.ts <origin>` rewrites both
 * this constant and that file together.
 */
export const SITE_ORIGIN = 'https://1st-pouf.worksonmy.dev'

/** Host without the scheme — for display, not for building URLs. */
export const SITE_HOST = SITE_ORIGIN.replace(/^https?:\/\//, '')

/** Absolute URL of one registry item, the thing shadcn actually fetches. */
export function registryUrl(slug: string): string {
  return `${SITE_ORIGIN}/r/${slug}.json`
}

/** The command a reader copies to install one item. */
export function installCommand(slug: string): string {
  return `npx shadcn@latest add ${registryUrl(slug)}`
}

/** Inverse of `registryUrl` — turns a `registryDependencies` entry back into a slug. */
export function slugFromRegistryUrl(url: string): string {
  return url.replace(`${SITE_ORIGIN}/r/`, '').replace('.json', '')
}
