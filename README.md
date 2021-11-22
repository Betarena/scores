![example workflow](https://github.com/Betarena/scores/actions/workflows/docker-image.yml/badge.svg)

# scores
### Betarena Scores Platform

### About

We are building the first open-source live results and statistics platform with community involvement features for data insertion. The project includes a blockchain component that will allow participants to receive rewards based on their participation and also to stake the future Token of the platform.

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.