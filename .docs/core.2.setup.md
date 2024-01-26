# ⚙️ Development Setup

**This section (markdown)** explains on how to get a developer up and running, to get started working on _this_ project.

> [!TIP]
> For any help with an issue or inability to get the project setup for development, _**get in touch with a Betarea team member!**_

> [!TIP]
> If you use `VsCode`, it is recommended that you install the extensions recommended for _this_ project, found in the `.vscode/extension.json` directory for `VsCode`.

## 🛠️ Scores Development Environment

There are a few ways in which you can start working with development, all of which are listed below:

### 1.a 🔻 Install / Validate Software Requirements

> [!IMPORTANT]
> It is expected that you have the following software installed on your local machine, prior to continuing with the setup:
> - `node v16.17.0` & `npm v8.19.1`
>   - https://nodejs.org/en
> - `make v4.4.1`
>   - (windows) https://community.chocolatey.org/packages/make
>   - (macos) https://formulae.brew.sh/formula/make#default
> - `nvm (any version, preferrably @latetes)`
>   - https://github.com/nvm-sh/nvm
> - `git (any version, preferrably @latetes)`
>   - (windows) https://community.chocolatey.org/packages/git.install
>   - (macos) https://formulae.brew.sh/formula/git#default
> - `heroku (any version, preferrably @latetes)`

If you believe to have the above software requirements, please run the following command in the project root `./` using a (`Bash`, `Zsh`, `MSYS2-Bash` ) shell, to validate everyhting is in order:

```bash
make setup-main-check
```

- If you got all green checks (✅) for each of the performed software checks, then you are good to go.
- If you got some errors (❌), please check the respective error messages to address the issue.

And that is it, setup it complete, development is ready to begin.

### 1.b 🎡 Run Project

If everything went well in the previous steps, you should now be able to access the deployed project on your `localhost`.

```bash
make dev-local-deploy
```

### 1.c 🎡 Run Project (Alternative with `@betarena/scores-lib`)

Alternatively, if you are developing against `@betarena/scores-lib` (located somewhere on your local machine).

If you do not yet have the `@betarens/scores-lib`, simply clone it from https://github.com/Betarena/scores-lib and place it anywhere on your local machine, although preferrably somwhere close by _this_ project.

Then, you can run the following command to include the local `scores-lib` as the package to be used for development, as well as kickstart the previously executed command as a batch:

> [!IMPORTANT]
> Prior to running the below (👇) command, please read respective documentation for `@betarena/scores-lib/.docs/*` on setup the project up for local development.

```bash
make dev-local-1-click-start
```

### 1.d 🚀 Deploy Project to Live

You have made some changes and want to show case them to the rest of the team for respective feedback ? Do the following:

```bash
make heroku-target-deploy-branch-current env=dev
```

Enjoy your code being deployed on [betarena-scores-platform.herokuapp.com](https://betarena-scores-platform.herokuapp.com/)

### 1.e ✅ Done

**📣 Happy coding!**
