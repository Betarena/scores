# Frontend Standards (Betarena)

## Non-negotiables
- **No UI redesign** unless explicitly requested.
- Prefer **readability over diff size**, but keep scope tight.
- **No refactors** unless explicitly requested.
- **Avoid new client JS** if SSR + progressive enhancement is enough.
- **New dependencies** allowed only if lightweight and justified; ask first if unsure.

## Theming + tokens (mandatory)
- `html, body` must use tokenized fallback pattern:
  - `background-color: var(--colors-background-bg-primary, var(--colors-gray-dark-mode-950));`
- “Common tokens” live in `:root`.
- Theme overrides live in theme classes:
  - `.dark-mode { --colors-background-bg-primary: var(--colors-gray-dark-mode-950); }`
  - `.light-mode { ... }`
- Theme classes are applied via:
  - `body` and, in some cases, component boundaries:
    - footer is **always** `.dark-mode`
    - `.app-wrapper` applies theme class in `layout.root.svelte`
- Components should use **semantic tokens** by default (e.g. `--colors-background-bg-primary`).
- Raw palette tokens (`--colors-gray-*`) are allowed **only when needed** (brand color, red/error states, etc). Prefer semantic tokens first.

## Safe areas
- Utility classes exist for future use (defined in `layout.scss`):
  - `.safe-top { padding-top: env(safe-area-inset-top); }`
  - `.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }`
- Do not remove these classes even if unused.

## Performance
- Keep hydration low; do not introduce client-only patterns when SSR works.
- Follow existing image loading rules (eager/lazy/fetchpriority) and Core Web Vitals best practices already used in the repo.
- Avoid adding large runtime dependencies; prefer existing utilities.

## Accessibility
- Any interactive UI must support:
  - keyboard navigation
  - aria labels/roles where needed
