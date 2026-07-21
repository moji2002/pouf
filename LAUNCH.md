# Launch checklist

Everything in this repo is built and verified. What remains are the steps only
you can do — they need your accounts and a domain purchase. Do them in order.

## 1. Register the domain

- Buy **pouf.dev**.
- **Confirm availability at the registrar first.** An earlier revision of this
  file claimed "confirmed unregistered as of 2026-07-18"; that check has since
  expired, and it could not be re-verified from the dev sandbox (`whois` there
  silently falls back to IANA and answers about the `.dev` TLD itself rather
  than the domain, which reads as a false "taken"). Trust the registrar, not a
  local `whois`.
- `.dev` is on the HSTS preload list, so HTTPS is mandatory — fine here, since
  GitHub Pages issues the certificate in step 4.
- Don't point DNS yet — wait until GitHub Pages is live (step 4) so you have the
  target records.

### If you ever change the domain

The string `pouf.dev` appears ~849 times, but only **four** are authored; the
rest are generated and follow automatically:

| File | What |
|---|---|
| `registry.json` | `homepage`, plus every `registryDependencies` URL |
| `www/src/data/blocks.ts:64` | `blockInstall()` |
| `www/src/data/manifest.ts:66` | `componentInstall()` |
| `www/src/data/manifest.ts:70` | `installCommand()` |

Also `www/public/CNAME` (currently `pouf.dev`). Change those, then rebuild the
registry and the site. **Never sed `www/public/r/**` — it is build output.**

## 2. Create the GitHub repo

```bash
# create an empty repo "pouf" under github.com/moji2002 in the GitHub UI, then:
cd ~/Documents/pouf
git remote add origin git@github.com:moji2002/pouf.git
git push -u origin main          # ← run this yourself; I never push for you
```

Any other owner works too — if you move it (e.g. to an org later), update the
links in `README.md`, the site header/footer in `www/src/layouts/Site.astro`,
and `npm-stub/package.json`'s `repository`. GitHub redirects the old URL and
carries stars/issues across, so this is reversible.

## 3. Enable GitHub Pages

- Repo → **Settings → Pages → Source: GitHub Actions**.
- The push in step 2 triggers `.github/workflows/deploy.yml`, which builds the
  registry JSON + the Astro site and deploys `www/dist`. The `www/public/CNAME`
  file already pins `pouf.dev`.

## 4. Point DNS at Pages

Per [GitHub's apex-domain docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site):

- `A` records for `pouf.dev` → `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153`
- `AAAA` records → `2606:50c0:8000::153`, `2606:50c0:8001::153`,
  `2606:50c0:8002::153`, `2606:50c0:8003::153`
- (If you use `www`, add a `CNAME` → `moji2002.github.io`.)
- Back in Settings → Pages, set the custom domain to `pouf.dev` and enable
  **Enforce HTTPS** once the cert provisions.

## 5. Reserve the npm name

```bash
cd npm-stub
npm login
npm publish --access public      # ships only a README pointing at pouf.dev
```

See `npm-stub/PUBLISH.md`.

## 6. Verify the whole loop from a clean machine

```bash
# in a fresh throwaway React 19 + Tailwind v4 app with a components.json:
npx shadcn@latest add https://pouf.dev/r/button.json
# → components/pouf/{pouf.css,tone.ts,Button.tsx} land, and <Button/> renders cushioned.
```

If that works, Pouf is live.

---

## Nothing here requires registering with shadcn

`shadcn add <url>` installs from **any** public URL — no signup, no approval.
The registry schema is already satisfied (`$schema`, `name`, `homepage`,
`items`).

Two optional extras, neither of them blocking:

- **Registry index (namespace).** Submitting an open-source registry to
  shadcn's index gets you `npx shadcn@latest add @pouf/dashboard` instead of a
  full URL, plus discoverability via `shadcn search`. Requirements: open
  source, public, valid schema, flat layout (`/registry.json` and
  `/<item>.json` at the root), and no `content` in the source `files` array.
  Pouf meets all of these — `registry.json` carries only `path`/`type`/`target`;
  the `content` inlining happens in the **build output**, which is expected and
  is how a one-command install avoids cloning the repo.
- **A public GitHub repo with `registry.json` at the root is itself a valid
  registry.** So `moji2002/pouf` can serve installs even before DNS is live —
  the domain is not a launch blocker, only a nicer URL.

---

### What's already done (no action needed)

- 38 components, 12 blocks, 6 templates — all migrated to Tailwind v4 and held
  pixel-stable by the 168-demo snapshot gate.
- 61-item shadcn registry; install proven end-to-end into a fresh Vite app.
- The site builds 25 static pages plus `/llms.txt`: landing, single components
  page with per-component prop tables, blocks, templates, docs, theme
  customizer, changelog.
- Dark mode (`<html data-theme="dark">`), ⌘K command palette, and generated
  props tables.
- CI (`ci.yml`) runs typecheck, tests, the platform-stable gate, registry build,
  and site build on every PR.
- Local checks beyond CI: `bun run check:deps` (every block declares what it
  imports), `bun run audit:responsive` (no overflow / small targets / overlaps),
  and Playwright behaviour suites for templates (10/10) and blocks (16/16).
- MIT license; visual-language attribution to novusgfx/retro-design-system (MIT)
  in README + `pouf.css` banner.
