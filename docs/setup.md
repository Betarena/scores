## ⚙️ Development

**This section (markdown)** focuses on how to get a new developer up and running, to get started with the development of _this_ project.

> **Note**
> This project uses 2 separate `live` versions hosted and connected to `Heroku`.
> - [betarena-scores-platform.herokuapp.com](https://betarena-scores-platform.herokuapp.com/)

### 🛠️ Scores Development (Local) Environment

There are a few ways in which you can start working with development, all of which are listed below:

#### 1. Via `Local Dev`

> **Warning**
> It is expected that you have `node`, `npm` and `make` installed on your machine.

##### 2.a Install Dependencies

In order to get started with `local` development, please do the following steps:

```bash
npm install # (or `pnpm install` or `yarn`)
```

##### 2.b Configure DotEnv (secrets)

We are using `dotenv` to obtain the latest and most up-to-date secrets.

```bash
make dotenv-secrets-setup
```

> **Note**
> If this is your first time setup with `dotenv-vault` (you can check this by seeing if you have the `.env.me` and/or `.env.vault`
> in the project `(root)`, please follow the command-line for
> prompts provided by `dotenv` on the next steps. In the end, you should have a `.env.me` and
> a `.env.vault` in your project `(root)`.

##### 2.c Run Project

If everything went well in the previous steps, you should now be able to access the deployed project on your `localhost`.

```bash
make dev-local-deploy
```

##### 2.c Run Project (Altetnative)

Alternatively, if you are developing against `@betarena/scores-lib`, located somewhere on your local machine, then you can run:

```bash
make dev-local-dev-1-click-spin
```