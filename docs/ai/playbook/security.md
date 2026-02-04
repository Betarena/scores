# Security (Betarena)

This document defines non-negotiable security rules across all repos.

## Secrets
- Never commit secrets (API keys, private keys, service accounts, tokens).
- Never paste secrets into issues, PRs, logs, or screenshots.
- Secrets must live in `.env` files (not committed) or the approved secret manager for that service.
- If a secret is leaked:
  - rotate it immediately
  - invalidate tokens/sessions if relevant
  - scrub it from git history if required

## Authentication & Authorization
- AuthN/AuthZ behavior is part of the product contract.
- Do not change:
  - auth flows
  - permission checks
  - claims/roles
  unless explicitly requested.
- Always verify authorization server-side for protected actions.

## PII (Personally Identifiable Information)
Examples of PII: email, phone, IP when tied to user identity, payment/customer IDs, device identifiers, addresses.
Rules:
- Never log PII by default.
- If logging user-related data is required for debugging:
  - log minimal fields only
  - redact sensitive fields
  - avoid full object dumps
- Do not store PII outside approved storage locations for the service.

## Logging safety
- Logging must follow the Betarena debug message style (boilerplate snippets).
- Never log:
  - Authorization headers
  - cookies/session tokens
  - passwords
  - private keys
  - full request bodies unless explicitly required and redacted

## Dependency policy
- New dependencies are allowed only if lightweight and justified.
- Prefer existing dependencies and patterns.
- Avoid adding heavy runtime libraries to frontend.
- If in doubt: ask before adding.

## Data handling
- Validate inputs at boundaries (API endpoints, functions, webhooks).
- Fail closed on auth/authz (deny by default).
- Apply least-privilege access for service credentials.
