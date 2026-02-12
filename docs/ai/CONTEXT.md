# AI Context — scores

Playbook: Betarena/company-ai-playbook@v1.0.5

## Order of authority
1) This file: `docs/ai/CONTEXT.md`
2) Playbook: `docs/ai/playbook/*`
3) Existing repo patterns (search before inventing)

## Non-negotiables
- No UI redesign unless explicitly requested.
- Prefer readability over diff size, but keep scope tight.
- No refactors unless explicitly asked.
- Avoid new client-side JS if SSR is enough.
- New deps only if lightweight + justified; ask if unsure.
- Use semantic tokens by default; palette tokens only when needed.
- Keep `.safe-top` / `.safe-bottom` utilities (do not remove).
- Follow existing image loading/perf rules (Core Web Vitals).
- Accessibility required for interactive UI (keyboard + aria).
- Never log secrets/PII. Redact.

## Required workflow
1) Locate patterns (cite 2–3 file paths)
2) Plan + affected files
3) Implement minimal diffs
4) Add/adjust tests when behavior changes
5) Verification checklist (commands)

## If info is missing
If run/infra details are missing, ask. Do not guess.
