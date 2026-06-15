# Lighthouse Mobile Baseline

Run before/after mobile transformation to track performance.

## Command

With the production server running on port 3000:

```bash
bun run build
bun run start
# In another terminal (requires lighthouse CLI: bun add -d lighthouse)
bunx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,best-practices --output=json --output-path=./docs/lighthouse-home.json
```

Repeat for: `/packages`, `/weather`, `/dashboard`, `/admin`, `/booking/[slug]`.

## Targets (post-transformation)

| URL | Performance | Accessibility | LCP | CLS |
|-----|-------------|---------------|-----|-----|
| `/` | 90+ | 90+ | <2.5s | <0.1 |
| `/packages` | 90+ | 90+ | <2.5s | <0.1 |
| `/weather` | 85+ | 90+ | <2.5s | <0.1 |
| `/dashboard` | 80+ | 90+ | <3s | <0.1 |
| `/admin` | 80+ | 90+ | <3s | <0.1 |

## Pre-transformation notes (code review)

- No route-level code splitting on home sections
- Large public gallery assets in `/public`
- Weather page client-fetches external APIs on mount
- Admin/auth pages lack skeleton loading states
- `sharp` optional peer may limit image optimisation locally

Re-run Lighthouse after Phase 2 optimisations to populate measured scores.
