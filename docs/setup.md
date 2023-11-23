## ⚙️ Development

**This section (markdown)** focuses on how to get a new developer up and running, to get started with the development of _this_ project.

> **Note**
> This project uses 2 separate `live` versions hosted and connected to `Heroku`.
> - [betarena-scores-platform.herokuapp.com](https://betarena-scores-platform.herokuapp.com/)

### Dev Environment

> There are a few ways in which you can start working with development, all of which are listed below:

1. ⭐️ [Preferred]

Using `GitHub | Codespaces`. To get started simply launch the
`dev` branch and once the `codespace` has successfully loaded
check for `node` and `npm` to match those in the `package.json > engines`.
If versions do not match, run the following commands:

```
npm install -g npm@8.19.1
npm install
```

---

2. `Local Dev`

Clone the latest `main` branch and begin development:

```bash
npm install (or `pnpm install` or `yarn`)
```

and start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

---

3. `Docker DEV`

If you do not have the supported/defined `node` and `npm` versions
installed on your local machine, you can opt to use the configured `Docker`
DEV environment.

For this you will need:
  - `Docker Desktop` downloaded on your local machine,
  - `Makefile` (or `Node`)

```bash
make dev-docker-start

# OR if no Make installed
npm run docker-dev-up
```

`NOTE:` 🔥 Hot-reload enabled for `Docker DEV`

### Production Environment

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
