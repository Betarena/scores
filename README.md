<!--
▓▓ Betarena Branding
-->

<h1
  align="left"
>
  <a
    href="https://github.com/dec0dOS/amazing-github-template"
  >
    <img
      src="https://user-images.githubusercontent.com/20924663/148760091-dea6a851-1aa9-4dbb-ac29-59f2ce2ad493.png" alt="Logo"
    />
  </a>
</h1>

<!--
▓▓ Repository badge(s)
-->

![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

[![DeepSource](https://deepsource.io/gh/Betarena/scores.svg/?label=active+issues&token=fz7n_ybCLUD7T9tvU2qY6yoU)](https://deepsource.io/gh/Betarena/scores/?ref=repository-badge)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

---

<details open="open">
<summary>Table of Contents</summary>

- [Betarena Scores Platform](#betarena-scores-platform)
  - [About](#about)
- [⚙ Development](#-development)
  - [Built With](#built-with)
  - [Dev Environment](#dev-environment)
  - [Production Environment](#production-environment)
- [Error Logging](#error-logging)
- [Project Overview](#project-overview)
- [🚦 Roadmap](#-roadmap)
- [🛠 Contributing](#-contributing)
- [💗 Support](#-support)
- [📌 License](#-license)
</details>

## Betarena Scores Platform

### About

> We are building the first open-source live results and statistics platform with community involvement features for data insertion. The project includes a blockchain component that will allow participants to receive rewards based on their participation and also to stake the future Token of the platform.

## ⚙ Development

Check for the `origin/dev` environment version live on `Heroku` -> [betarena-scores-platform.herokuapp.com](https://betarena-scores-platform.herokuapp.com/).
A more rigorous development link and `application` is being utilized for the development of the platform on a separate `Heroku` instance -> [scores-testing-app.herokuapp.com](https://scores-testing-app.herokuapp.com/).

### Built With

This project is dependent on the following libraries and technologies:

- [`svelte`]()
- [`sveltekit`]()
- [`color-thief`]()
- [`svelte-seo`](https://github.com/artiebits/svelte-seo#svelte-seo-options)
- [`graphql-request`](https://www.npmjs.com/package/graphql-request)

`@apollo-client` does not work correctly with `sveltekit` [1](https://github.com/timhall/svelte-apollo/issues/97)
**solution**: using `graphql-request` instead.

### Dev Environment

> There are a few ways in which you can start working with development, all listed below:

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

---

**First time working on a `SvelteKit` Project ?**

View our guide to `sveltekit` project and how to get started with a few links and recommendations:

- [a-beginners-guide-to-sveltekit](https://www.sitepoint.com/a-beginners-guide-to-sveltekit/)
- [using .env with sveltekit-vite](https://dev.to/danawoodman/storing-environment-variables-in-sveltekit-2of3)

## Error Logging

Sentry is used for efficient error logging. Supercharing the existing deployment of `Sentry` using `SourceMaps`.

> **Note**
> For more information, please see:
> - [🔗 Sentry | Human Readable StackTraces](https://docs.sentry.io/product/sentry-basics/integrate-frontend/upload-source-maps/)
> - [🔗 Sentry | Sourcemaps upload (via CLI)](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/cli/)
> - [🔗 Sentry | Sourcemaps upload (Vite)](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/)
> - [🔗 Sentry | Sourcemaps upload (TypeScript)](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/typescript/)
> - [🔗 Heroku | Headless Mode](https://help.heroku.com/5I11S48T/i-need-to-log-in-to-the-cli-without-a-browser)
> - [🔗 StackOverflow | Heroku Headless Mode](https://stackoverflow.com/questions/67852200/heroku-cli-login-error-code-mfa-required)
> - [🔗 Sentry | CI/CD Github Actions](https://github.com/marketplace/actions/sentry-release)
> - [🔗 Sentry | NPM Command-Line Interface](https://www.npmjs.com/package/@sentry/cli)

- [🔗 Sentry | Betarena - Sourcemaps](https://betarena.sentry.io/settings/projects/scores-platform/source-maps/release-bundles/)
- [🔗 ⭐️ Sentry | SvelteKit Plugin](https://docs.sentry.io/platforms/javascript/guides/sveltekit)
- [🔗 Sentry | SvelteKit YouTube](https://www.youtube.com/watch?v=u41-MtPGH04)
- [🔗 SvelteKit | Official Docs. Hooks](https://kit.svelte.dev/docs/hooks#shared-hooks)

## Project Overview

![image](https://user-images.githubusercontent.com/20924663/148798416-adb51cf8-6f91-472b-9225-73b43999d320.png)

https://whimsical.com/betarena-scores-platform-BBTYhFnk4Fxk3JcoZyjAHw

## 🚦 Roadmap

See the open issues for a list of proposed features (and known issues).

- Top Feature Requests (Add your votes using the 👍 reaction)
- Top Bugs (Add your votes using the 👍 reaction)
- Newest Bugs

## 🛠 Contributing

**Do you wish to contribute to the project ? 🚀🥳**

First off, thanks for taking the time to contribute! Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are greatly appreciated.

Please try to create bug reports that are:

- __Reproducible__. Include steps to reproduce the problem.
- __Specific__. Include as much detail as possible: which version, what environment, etc.
- __Unique__. Do not duplicate existing opened issues.
- __Scoped__ to a Single Bug. One bug per report.

Please adhere to this project's code of conduct.

Please visit the [discussions-contributing-guide](https://github.com/Betarena/scores/discussions/122) for more information on how to get started on contributing to the project and repository.

## 💗 Support

Reach out to the maintainer at one of the following places:

[GitHub discussions](https://github.com/Betarena/scores/discussions)

The email which is located in GitHub profile - [add-email]

## 📌 License

This project is licensed under the MIT license. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.
