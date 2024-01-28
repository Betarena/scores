# 🗂️ Filesystem

**This section (markdown)** contains further information on how the `project` is currently structured, it's files, and the general structure that should be followed.

## 🐙 Git-Related

### `.husky/*`

Provides **strict** guidelines for as to _how_ commit messages should be formatted and written.

## 🐳 Docker Related

### `.dockerignore` & `docker/*`

Cotains a combination of both `docker-compose` and `Dockerfile`'s used for deployment in the respective environemnts.

Implied filename structure: `<envrionment>.docker-compose.yaml`.

## 🟧 Javascript/Typescript/Svelte/SvelteKit Related

### `.eslint.yaml`

Contains the `configuration` of the accepted style, structure, format of _this_ project code.

### `tsconfig.json`

Contains the `configuration` used for the `TypeScript` employed in the project.

### `vite.config.ts`

Contains the `configuration` used `Vite`.

### `svelte.config.js`

Contains the `configuration` used `Svelte`.

### `.env.vault`

Used by `dotenv` for project secrets management.

- https://www.dotenv.org/docs
- https://www.dotenv.org/docs/security/env-vault

### `.nvmrc`

Used by the `NVM` pacakge manage for `NodeJs`.

### `src/*`

Main project sourcecode using `SvelteJs` (powered by `SvelteKit`).

#### ⭐️ Creating new `.svelte` components (a.k.a widgets) should be structured as follows:

```markdown
/lib/
  ---
  ↳ components/
    ---
    ↳ target-section-belongs-to/
      ---
      ↳ new-widget/
          | 📣 Contains respective new widget/component (1) assets, (2) component code, (3) preloaders, etc.
        ---
        ↳ .assets/
            | 📣 Contains respective assets used by THIS widget/component.
          ↳ *.png
          ↳ *.svg
        ---
        ↳ loaders/
            | 📣 Contains respective loaders.
        ---
        ↳ New-Widget-Widget.svelte
            | 📣 Is the MAIN entry point to the widget that is being created, think of it as the *handler*
            | for the widget, containing "data" getter for the widget, and showing loaders.
            | 📌 Check 'src/lib/components/page/profile/investor/Widget-Investor.svelte' for example.
        ---
        ↳ New-Widget-Main.svelte
            | 📣 Is the MAIN widget layout, design and logic, after the parent [...]-Widget.svelte has loaded all necessary
            | data and deemed it OK to show the widget.
            | THIS contains the overall MAIN widget UI and LOGIC. As well as, necessary child components.
        ---
        ↳ New-Widget-Loader.svelte
            | 📣 Is the MAIN widget loader layout, used for showing the widget outline and it's preloading-state. Used in
            | conjuction with the .svelte files in the laoders/ folder, containing .svg elements within.
            | Not always used, because some widgets do not have a pre-loader animation, in which case, this widget/component can be ignored.
```

> [!IMPORTANT]
> Widget **naming convention** should be that of the use of a hyphen `(-)` to separate naming of a widget as a equvalence for whiteapce `( )`.

> [!TIP]
> Use the `./.docs/.templates/Boilerplate.Widget.svelte` for quick-start and aid in attaining the desired project structure.

---

#### 🔗 Adding new endpoints

If there is an endpoint which does not yet exist, it needs to be created on the `server-side` aspect of **SvelteKit**.

To do this, create a new respective `+server.ts` route in the `src/api/<new-api-endpoint-name>/+server.ts` location.

> [!TIP]
> Check for existing files/endpoints created in the `src/api/*` for help on how to structure and create logic in said files.
>
> Use the `./.docs/.templates/Boilerplate.+server.ts` for quick-start and aid in attaining the desired project structure.

---

#### 🟦 New TypeScript Declarations

If there a need to create new types _(which will most definetly be the case, if you're working on a new `widget`)_, you need to do this via the `@betarena/scores-lib` internal library.

### `static/*`

As the implies, _this_ directory should contain files that are _static_, that will require very/no major change and/or need to be available globally.

## 💠 Other/Miscellanous

### `Makefile`

**🚀 The ignition/accelerator of _this_ project developemnt. 🚀**

Used to store and speed up development flow, by providing **make targets** for executing commands more effortlesly. The _Makefile_ is also used for _stashing_ commands for possible future usecase.

### `Procfile`

Used by `Heroku` to manage deployment and the respective `Heroku Dyno` configuration.

- https://devcenter.heroku.com/articles/procfile

### `openapi.yaml`

Contains definitions for the available `endpoints` that _this_ project provides following the Swagger/OpenAPI `^3.0.X` standard.

### `.deepsource.toml`

Used by `Deepsource`.

- https://deepsource.com/

### `CHANGELOG.md`

Generated automatically via `GitHub Actions`.

### `.vscode/*`

Used by `.vscode` to apply specific `settings` and most powerful feature: `snippets`.