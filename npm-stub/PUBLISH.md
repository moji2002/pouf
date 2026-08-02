# Maintaining the name-reservation stub

This reserves `pouf-ui` on npm and redirects visitors to 1st-Pouf. It ships no code and must never present itself as an installable library.

Publish a new `0.0.x` version only when its redirect or package metadata needs correcting:

```bash
cd npm-stub
npm pack --dry-run
npm publish --access public
```

The real distribution is the registry at `1st-pouf.worksonmy.dev`, consumed via `npx shadcn add`.
