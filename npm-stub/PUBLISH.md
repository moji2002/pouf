# Publishing the name-reservation stub

This reserves `pouf-ui` on npm so no one else takes it. It ships no code.

```bash
cd npm-stub
npm login              # your npm account
npm publish --access public
```

That's it. Do NOT bump the version or add code here — the real distribution is
the registry at pouf.worksonmy.dev, consumed via `npx shadcn add`.
