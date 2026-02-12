# Release & Version Control (Betarena)

## Source of truth
This follows our boilerplate rules:
- https://github.com/Betarena/boilerplate/blob/main/.github/version-control.md

## Branching
- `main` + feature branches.

## CI gates
- All CI must pass before merge:
  - lint
  - typecheck
  - tests
  - build

## Versioning
- Semantic versioning.
- Version is bumped automatically by CI (no manual bumping unless explicitly required).

## Pull requests
- Keep PRs scoped and reviewable.
- Changes that affect contracts must include:
  - updated docs
  - updated tests
  - coordinated client updates (when applicable)
