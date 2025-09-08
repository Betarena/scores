# Widget System — Concepts & Data Model

## TL;DR

- A **widget** is a versioned component you can embed in TipTap.
- An **install** is a permissioned instance of a widget version owned by a user.
- Content nodes reference installs: `{ widget_id, version, install_id, config }`.
- Widgets never query Hasura/Firestore directly; they go through the gateway.

## Core Entities

### `widgets.widget`
- **What**: Catalog entry (e.g., `ai-prediction`).
- **Why**: Ownership & governance.
- **Key fields**: 
  - `id`, `key`, `display_name`, `description`, `exec_mode`, `status`, `owner_id` (Firebase UID).

### `widgets.widget_version`
- **What**: Immutable release of a widget.
- **Why**: Rollbacks, predictable renders.
- **Key fields**: 
  - `id`, `widget_id`, `semver`, `status`, `created_at`, `created_by`.

### `widgets.user_widget_install`
- **What**: Capability anchor between a user and a widget version.
- **Why**: Scoping, rate-limiting, revocation, default config.
- **Key fields**: 
  - `id` (install_id), `user_id` (Firebase UID), `widget_id`, `version_id`, `config_json`, `resolved_scopes[]`, `enabled`.

> **Note**: We don't store `article_id` here. One install can be referenced by many articles.
> If you ever need the reverse map, use an optional join table `article_widget_ref(article_id, install_id)` on publish.

## Lifecycle

### Insert
1. Editor opens "Insert Widget" → selects widget + version, enters config.
2. Server creates `user_widget_install` (owner = current user) and returns `install_id`.
3. TipTap node is inserted:

```json
{
  "type": "widget",
  "attrs": {
    "widget_id": "ai-prediction",
    "version": "1.0.0",
    "install_id": "uw_…",
    "config": { "eventId": 19556440 },
    "layout": { "width": "container", "align": "center" }
  }
}
```

### Render (authoring)
- In the editor, the widget calls `/api/widget/graphql` with `install_id`.
- Gateway checks: session user owns the install, sets role `widget_user`, forwards to Hasura.

### Render (viewing)
- Page server mints a short-lived render token bound to `install_id`.
- Client widget calls gateway with `Authorization: Bearer <token>`.
- Gateway validates token, sets role `widget_view`, forwards to Hasura.

### Update / Disable
- Owner can update `config_json` or disable the install; all renders using that install are affected immediately.
- To change code, publish a new `widget_version` and update content to reference the new version.

## Ownership & Permissions

### `owner_id` on widgets
- Controls who can modify metadata and publish new versions.
- **RLS**: only `owner_id` (or platform admins) can update/delete the widget and create versions.

### `user_widget_install.user_id`
- Controls who can use that install in authoring contexts.
- **RLS**: only the installer can read/update their installs.

### Roles
- **`widget_user`**: minimal read permissions for author path.
- **`widget_view`**: even more restricted for viewer path (token-based).

Session/headers carry: `x-hasura-user-id`, `x-widget-install-id`, `x-widget-scopes`.

## Why not `article_id` on installs?

- **Reusability**: one install can be reused across many articles.
- **Isolation**: disable/limit a single install to affect all its usages.
- **Performance**: avoids hot, wide rows and write amplification.
- **Optional**: if you need reverse lookup, use `article_widget_ref` on publish, not in the core install.

## Gateway Contract (Widget SDK)

Widgets receive a tiny SDK:

```javascript
sdk.fetchGraphQL(query, variables) // proxies to /api/widget/graphql with install context
sdk.getContext() // theme/locale; no PII beyond allowed scopes
```

### Gateway responsibilities:
- Verify ownership (author) or validate render token (viewer).
- Attach Hasura headers: `x-hasura-role`, `x-hasura-user-id`, `x-widget-install-id`, `x-widget-scopes`.
- Enforce rate limits per `install_id`.

## Execution Modes

- **`component`** (now): internal Svelte components loaded via WidgetHost.
- **`iframe`** (future): third-party bundles via sandboxed iframe + postMessage, SRI, strict CSP, capability JWT.

## Operational Guidance

- **Versioning**: treat `widget_version` as immutable; publish new semver for changes.
- **Rollbacks**: switch the version in node attrs or re-insert with older version.
- **Scopes**: start with coarse scopes in `resolved_scopes[]`; refine as needed.
- **Telemetry**: log render, error, load_time with `install_id` (console now; endpoint later).

## FAQs

**Q: Why not store all config only in the node?**
> A: You can, but keeping a default in the install allows centralized changes or revocation without editing content.

**Q: Can multiple users share an install?**
> A: Keep installs per user for clear ownership and audit. If needed, add an `org_id` or share model later.

**Q: How do viewers get access without a session?**
> A: Short-lived render tokens bound to `install_id` + scopes; role `widget_view`.

**Q: How do we know which articles use an install?**
> A: Optional `article_widget_ref` populated on publish; otherwise derive by parsing content.

---

This model gives you: **safe-by-default data access**, **clean governance**, **easy rollback**, and **a path to third-party widgets** without rewriting the core.