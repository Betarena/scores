# Architecture — scores

> Repo-specific boundaries. System-wide architecture lives in `docs/ai/playbook/architecture.md`.

## Ownership
- SvelteKit frontend app (SSR pages/routes)
- UI, theming, and performance optimizations
- Integrations with backend services (via existing clients)

## Boundaries
- Prefer SSR over client JS.
- Do not change API contracts unless explicitly requested.
- Follow existing caching and image-loading patterns.

## Out of scope
- Backend business logic
- Cache key/TTL logic (handled elsewhere)
