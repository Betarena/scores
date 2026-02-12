# Testing (Betarena)

This document defines minimum expectations for tests and verification.

## Non-negotiables
- Any behavior change requires a test (or a written reason why it cannot be tested).
- Bug fixes require a regression test when feasible.
- PRs must include a short verification checklist (commands + what was validated).

## Test levels
### Unit tests
- Pure functions, utilities, small modules.
- Fast and deterministic.

### Integration tests
- Service boundaries: DB access, cache layers, API clients, background jobs.
- Use test environments/emulators when supported.

### E2E / system verification
- Flows validated locally or in a dev/testing environment.
- Required when changes affect critical paths (auth, payments/credits, cache correctness, publishing flows, SEO/SSR behavior).

## What to include in PRs
- What changed
- What tests were added/updated
- How to verify locally (exact commands)
- If no tests were added: why, and what manual validation was done

## Avoid
- Flaky tests
- Over-mocking critical behavior (prefer real boundaries when possible)
- Large refactors “to make it testable” unless explicitly requested

## Verification checklist policy (STRICT)

### Default verification is read-only
Unless explicitly approved, verification steps MUST be read-only:
- build
- lint / format check
- typecheck
- unit tests that do not connect to persistent storage

### Write-capable verification is forbidden by default
Any step that can write to persistent storage requires explicit approval from a human and must include:
- the exact target environment (emulator/staging/prod)
- why writes are required
- what data may be modified
- rollback plan / how to revert

### Examples of write-capable steps (require approval)
- starting dev servers that connect to real databases/projects
- running migrations, seeds, resets, deletes, truncates
- running backfills, rebuilds, reindex/sync scripts
- executing background jobs (BullMQ/cron/workers) that populate or mutate data
- cache invalidation or regeneration routines that alter persistent stores