# Launch checklist

Everything in this repo is built and verified. What remains are the steps only
you can do — they need your accounts and a domain purchase. Do them in order.

## 1. Register the domain

- Buy **pouf.dev** (confirmed unregistered as of 2026-07-18). `pouf-ui.com` is a
  fallback if you prefer.
- Don't point DNS yet — wait until GitHub Pages is live (step 4) so you have the
  target records.

## 2. Create the GitHub repo

```bash
# create an empty repo "pouf" under github.com/moji2002 in the GitHub UI, then:
cd ~/Documents/pouf
git remote add origin git@github.com:moji2002/pouf.git
git push -u origin main          # ← run this yourself; I never push for you
```

If you'd rather not use an org, any owner works — just update the URLs in
`README.md`, `registry.json` (`homepage`), the site footer/header links, and
the npm stub's `repository`.

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
# in a fresh throwaway React + Tailwind v4 app with a components.json:
npx shadcn@latest add https://pouf.dev/r/button.json
# → src/components/pouf/{pouf.css,tone.ts,Button.tsx} land, and <Button/> renders cushioned.
```

If that works, Pouf is live.

---

### What's already done (no action needed)

- Component library migrated to Tailwind v4, verified pixel-identical by the snapshot gate.
- 39-item shadcn registry, install proven end-to-end into a fresh Vite app.
- pouf.dev site (landing + 33 component docs + changelog), builds 36 static pages.
- CI (`ci.yml`) runs typecheck, tests, the platform-stable gate, registry build, and site build on every PR.
- MIT license; visual-language attribution to novusgfx/retro-design-system (MIT) in README + `pouf.css` banner.
