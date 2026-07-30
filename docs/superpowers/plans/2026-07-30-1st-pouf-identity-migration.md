# 1st-Pouf Identity Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `1st-Pouf` under matching GitHub, website, internal package, portfolio, and shadcn registry identities without breaking existing install URLs.

**Architecture:** Treat `https://1st-pouf.worksonmy.dev` and `https://github.com/moji2002/1st-pouf` as the canonical public addresses. Keep compatibility-sensitive `pouf` file paths and CSS identifiers unchanged, preserve the old website host with a path-preserving permanent redirect, regenerate registry payloads from their source, and submit the verified live namespace to shadcn only after publication.

**Tech Stack:** Bun workspaces, shadcn CLI, Astro, React, Vercel, GitHub CLI, pnpm, Next.js portfolio.

## Global Constraints

- Product display name is exactly `1st-Pouf`.
- Registry source name is exactly `1st-pouf`.
- shadcn namespace is exactly `@1st-pouf`.
- Canonical GitHub repository is `https://github.com/moji2002/1st-pouf`.
- Canonical product website is `https://1st-pouf.worksonmy.dev`.
- Internal workspace packages use `@1st-pouf/*`.
- Keep registry targets under `components/pouf/*`.
- Keep existing `pouf` CSS variables, utility names, item slugs, and portfolio route.
- Preserve `pouf.worksonmy.dev` as a path-preserving permanent redirect.
- Stay on the existing `main` branch in both user repositories.
- Do not stage or modify the portfolio's pre-existing `tsconfig.tsbuildinfo` change.

---

### Task 1: Move authored source to the canonical domain and GitHub URL

**Files:**
- Modify: `www/src/data/site.ts`
- Modify: `registry.json`
- Modify: `vercel.json`
- Modify: `README.md`
- Modify: `LAUNCH.md`
- Modify: `scripts/check-block-deps.ts`
- Modify: `scripts/set-origin.ts`
- Modify: `www/astro.config.mjs`
- Modify: `www/public/robots.txt`
- Modify: `www/src/layouts/Site.astro`
- Modify: `www/src/pages/index.astro`
- Modify: `npm-stub/package.json`
- Modify: `npm-stub/README.md`
- Modify: `npm-stub/PUBLISH.md`
- Modify: `docs/HANDOFF.md`
- Modify: `shadcn-directory-entry.json`
- Modify: `../this.is-a.dev/content/projects/pouf.mdx`

**Interfaces:**
- Consumes: the approved canonical identity in the global constraints.
- Produces: authored source with one canonical host and GitHub repository URL.

- [ ] **Step 1: Run the repository origin migration helper**

Run:

```bash
bun scripts/set-origin.ts https://1st-pouf.worksonmy.dev
```

Expected: `www/src/data/site.ts` changes once and every old absolute registry dependency in `registry.json` changes to the new origin.

- [ ] **Step 2: Update remaining authored public addresses**

Use targeted patches so all product links become:

```text
https://1st-pouf.worksonmy.dev
https://github.com/moji2002/1st-pouf
git+https://github.com/moji2002/1st-pouf.git
```

Keep old-domain text only in the compatibility redirect and migration documentation.

- [ ] **Step 3: Add the path-preserving old-domain redirect**

Add this entry to `vercel.json`:

```json
{
  "source": "/:path*",
  "destination": "https://1st-pouf.worksonmy.dev/:path*",
  "permanent": true,
  "has": [
    {
      "type": "header",
      "key": "host",
      "value": "pouf.worksonmy.dev"
    }
  ]
}
```

This keeps `/r/button.json` and every existing deep link working after the canonical-domain migration.

- [ ] **Step 4: Verify authored address consistency**

Run:

```bash
rg -n 'github\.com/moji2002/pouf|https://pouf\.worksonmy\.dev' \
  --glob '!node_modules/**' \
  --glob '!www/dist/**' \
  --glob '!www/public/r/**' \
  . ../this.is-a.dev/content/projects/pouf.mdx
```

Expected: matches only for the intentional old-host redirect and migration history.

- [ ] **Step 5: Check formatting**

Run:

```bash
git diff --check
git -C ../this.is-a.dev diff --check
```

Expected: both commands exit successfully.

### Task 2: Regenerate and verify the registry, product site, and portfolio

**Files:**
- Regenerate: `www/public/r/*.json`
- Regenerate locally: `www/dist/**` (ignored build output)

**Interfaces:**
- Consumes: canonical source URLs from Task 1.
- Produces: installable registry payloads and builds that reference the new public identity.

- [ ] **Step 1: Rebuild the registry payloads**

Run:

```bash
bun run registry:build
```

Expected: 71 items build successfully under `www/public/r`.

- [ ] **Step 2: Run registry validation**

Run:

```bash
bunx --bun shadcn@4.16.0 registry validate ./registry.json
bun scripts/check-registry-readiness.ts
```

Expected: official validation passes all 71 items and readiness reports namespace `@1st-pouf`.

- [ ] **Step 3: Run repository checks**

Run:

```bash
bun install --frozen-lockfile
bun run typecheck
bun test
bun run check:deps
```

Expected: frozen install has no lockfile changes, TypeScript passes, 17 unit tests pass, and every block declares its imports.

- [ ] **Step 4: Build both websites**

Run:

```bash
bun run --cwd www build
pnpm --dir ../this.is-a.dev run build
```

Expected: Astro builds 63 pages and Next.js builds 30 pages including `/projects/pouf`.

- [ ] **Step 5: Verify generated address parity**

Run:

```bash
rg -n 'https://pouf\.worksonmy\.dev|github\.com/moji2002/pouf' \
  www/public/r www/dist \
  --glob '*.json' --glob '*.html' --glob '*.txt' --glob '*.xml'
```

Expected: no old canonical addresses remain.

### Task 3: Publish and rename the 1st-Pouf GitHub repository

**Files:**
- Modify Git metadata: `.git/config` remote URL

**Interfaces:**
- Consumes: verified source from Task 2 and the authenticated `moji2002` GitHub account.
- Produces: public repository `moji2002/1st-pouf` containing the verified source.

- [ ] **Step 1: Verify GitHub authentication**

Run:

```bash
gh auth status
```

If authentication is invalid, run:

```bash
gh auth login -h github.com --web
```

Continue only when `moji2002` is the active authenticated account.

- [ ] **Step 2: Inspect commit hooks before staging**

Run:

```bash
git config --get core.hooksPath
find .git/hooks -maxdepth 1 -type f -perm -111 -print
```

If an active hook stashes or modifies the worktree, stop and obtain separate approval before committing.

- [ ] **Step 3: Commit the product repository changes**

Stage only the reviewed 1st-Pouf repository files, then run:

```bash
git commit -m "feat: publish 1st-Pouf registry identity"
git push origin main
```

Expected: the verified source is public at the old repository address before the rename.

- [ ] **Step 4: Rename the GitHub repository**

Run:

```bash
gh repo rename -R moji2002/pouf 1st-pouf
git remote set-url origin https://github.com/moji2002/1st-pouf.git
```

Expected: `gh repo view moji2002/1st-pouf` succeeds and `git remote -v` shows only the new address.

- [ ] **Step 5: Commit and publish the portfolio reference**

In `../this.is-a.dev`, stage only `content/projects/pouf.mdx`:

```bash
git add content/projects/pouf.mdx
git commit -m "content: rename project to 1st-Pouf"
git push origin main
```

Expected: `tsconfig.tsbuildinfo` remains modified but unstaged and untouched.

### Task 4: Publish the canonical domain and preserve the old host

**Files:**
- Consume: `.vercel/project.json`
- Consume: `vercel.json`

**Interfaces:**
- Consumes: public `moji2002/1st-pouf` main branch and linked Vercel project `pouf`.
- Produces: a production deployment at the new canonical host with a permanent old-host redirect.

- [ ] **Step 1: Verify Vercel authentication and project linkage**

Run:

```bash
vercel whoami
vercel project inspect pouf
```

Expected: authentication succeeds and the linked project ID matches `.vercel/project.json`.

- [ ] **Step 2: Attach the new custom domain**

Run:

```bash
vercel domains add 1st-pouf.worksonmy.dev
```

If Vercel reports missing DNS, add this Cloudflare record:

```text
Type: CNAME
Name: 1st-pouf
Target: cname.vercel-dns.com
Proxy: DNS only
```

- [ ] **Step 3: Deploy the verified source**

Run:

```bash
vercel --prod
```

Expected: production deployment completes and both custom hosts are attached to the project.

- [ ] **Step 4: Verify canonical and compatibility endpoints**

Run:

```bash
curl -fsSI https://1st-pouf.worksonmy.dev/r/button.json
curl -fsSI https://pouf.worksonmy.dev/r/button.json
curl -fsSL https://1st-pouf.worksonmy.dev/r/registry.json
```

Expected: the new endpoint returns `200`, the old endpoint redirects permanently while preserving `/r/button.json`, and the live catalog name is `1st-pouf`.

### Task 5: Verify clean Vite/React and Next.js consumers

**Files:**
- Create temporarily: `/private/tmp/1st-pouf-consumers-*/vite-app`
- Create temporarily: `/private/tmp/1st-pouf-consumers-*/next-app`

**Interfaces:**
- Consumes: the live registry at `https://1st-pouf.worksonmy.dev/r/{name}.json`.
- Produces: two clean production builds proving that a new consumer can install and render 1st-Pouf.

- [ ] **Step 1: Scaffold clean consumer projects**

Create a new directory with `mktemp -d`, then run:

```bash
bunx create-vite@latest vite-app --template react-ts
bun create next-app@latest next-app --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-bun --yes
```

- [ ] **Step 2: Initialize shadcn and install 1st-Pouf**

Run in each consumer:

```bash
bunx --bun shadcn@4.16.0 init --defaults
bunx --bun shadcn@4.16.0 add https://1st-pouf.worksonmy.dev/r/button.json --yes
```

Expected: `Button.tsx`, `tone.ts`, and `pouf.css` land under `components/pouf`, and required npm dependencies are installed.

- [ ] **Step 3: Render the installed component**

In the Vite app, import `@fontsource-variable/nunito`, `components/pouf/pouf.css`, and `Button` from the installed source, then render:

```tsx
<Button tone="purple">Vite + 1st-Pouf</Button>
```

In the Next.js root layout, import the font and `pouf.css`; in the home page render:

```tsx
<Button tone="mint">Next.js + 1st-Pouf</Button>
```

- [ ] **Step 4: Build both consumers**

Run:

```bash
bun run --cwd vite-app build
bun run --cwd next-app build
```

Expected: both production builds exit successfully with no missing imports, CSS, types, or server/client-boundary errors.

- [ ] **Step 5: Verify rendered output in a browser**

Serve both production builds locally and use Playwright to assert that each page contains its expected button label and that the installed button has `display: inline-flex` plus a non-transparent pastel background.

Expected: both runtime checks pass.

### Task 6: Submit `@1st-pouf` to the shadcn registry directory

**Files:**
- Consume: `shadcn-directory-entry.json`
- Modify in a temporary fork checkout: `apps/v4/registry/directory.json`

**Interfaces:**
- Consumes: the publicly reachable canonical registry from Task 4.
- Produces: an upstream pull request to `shadcn-ui/ui` adding `@1st-pouf`.

- [ ] **Step 1: Confirm the namespace is not already present**

Run:

```bash
gh search code '"@1st-pouf"' --repo shadcn-ui/ui
```

Expected: no existing directory entry or open conflicting submission.

- [ ] **Step 2: Create an isolated fork checkout and PR branch**

Use a new `mktemp -d` directory, then run:

```bash
gh repo fork shadcn-ui/ui --clone --default-branch-only
git -C ui switch -c registry/1st-pouf
```

This branch exists only in the temporary upstream checkout and does not alter either user repository's branch.

- [ ] **Step 3: Insert the approved directory object first**

Copy the exact object from `shadcn-directory-entry.json` into the first position of the array in:

```text
apps/v4/registry/directory.json
```

Do not alter any existing registry object.

- [ ] **Step 4: Install and run upstream validation**

Run from the temporary `ui` checkout:

```bash
pnpm install --frozen-lockfile
pnpm validate:registries
```

Expected: upstream registry validation exits successfully.

- [ ] **Step 5: Commit, push, and open the pull request**

Run:

```bash
git add apps/v4/registry/directory.json
git commit -m "registry: add @1st-pouf"
git push -u origin registry/1st-pouf
gh pr create \
  --repo shadcn-ui/ui \
  --base main \
  --head moji2002:registry/1st-pouf \
  --title "registry: add @1st-pouf" \
  --body "Adds the 1st-Pouf React component registry. The registry is open source, schema-valid, flat, and publicly available at https://1st-pouf.worksonmy.dev/r/{name}.json."
```

Expected: GitHub returns the upstream pull-request URL.

- [ ] **Step 6: Inspect submitted checks**

Run:

```bash
gh pr checks --repo shadcn-ui/ui --watch
```

Expected: all required checks reach a passing state, or any failure is reported with its exact log and remediation.
