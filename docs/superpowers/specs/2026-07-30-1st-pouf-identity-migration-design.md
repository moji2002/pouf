# 1st-Pouf Identity Migration

## Goal

Make `1st-Pouf` the intentional, consistent product identity across the source
repository, published registry, product website, and portfolio before submitting
the registry to shadcn.

## Canonical identity

- Product display name: `1st-Pouf`
- Registry source name: `1st-pouf`
- shadcn namespace: `@1st-pouf`
- GitHub repository: `https://github.com/moji2002/1st-pouf`
- Product website: `https://1st-pouf.worksonmy.dev`
- Internal workspace scope: `@1st-pouf/*`

## Migration behavior

The GitHub repository will be renamed from `pouf` to `1st-pouf`. GitHub's
repository redirect will preserve old repository links, while authored links,
package metadata, the local `origin` remote, the product site, and the portfolio
will use the new canonical URL.

The product site will move from `pouf.worksonmy.dev` to
`1st-pouf.worksonmy.dev`. The old domain must remain attached and redirect to
the new canonical domain so existing component-install URLs continue working.
Registry dependencies and new install commands will use the new domain.

Compatibility-sensitive code identifiers remain unchanged:

- Registry file targets stay under `components/pouf/*`.
- CSS variables and utility names containing `pouf` stay unchanged.
- Existing component and registry item slugs stay unchanged.
- The portfolio route may remain `/projects/pouf` unless its content system
  supports an explicit redirect for a renamed slug.

## Repository changes

Update all authored and generated references to the old GitHub URL and old
product domain. Regenerate the built registry rather than editing individual
payloads manually. Keep the shadcn directory object first in the proposed
upstream list and use `@1st-pouf` as its namespace.

## External operations

1. Publish the verified local source changes to `moji2002/pouf`.
2. Rename the GitHub repository to `moji2002/1st-pouf`.
3. Change the local `origin` remote to the new GitHub URL.
4. Configure `1st-pouf.worksonmy.dev` as the canonical production domain.
5. Retain `pouf.worksonmy.dev` as a redirect.
6. Verify the public registry from the new domain.
7. Fork `shadcn-ui/ui`, add the directory entry, run its registry validation,
   and open the upstream pull request.

External changes require valid GitHub and hosting authentication. If an
operation fails, stop before submission and report the exact account or DNS
action required; do not submit an entry that points at an unavailable URL.

## Verification

- Run the official shadcn registry validator against `registry.json`.
- Run the repository's directory-readiness, typecheck, dependency, and unit
  checks.
- Rebuild the registry and product website.
- Build the portfolio.
- Confirm the new GitHub repository and new domain are publicly reachable.
- Confirm an item can be fetched from
  `https://1st-pouf.worksonmy.dev/r/button.json`.
- Confirm the old domain redirects without breaking the item path.
- Run the upstream shadcn registry validation before opening the pull request.

