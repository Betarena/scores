# ⚙️ Development Setup

**This section (markdown)** explains on how to get a developer up and running, to get started working on _this_ project.

> [!TIP]
> For any help with an issue or inability to get the project setup for development, _**get in touch with a Betarea team member!**_

> [!TIP]
> If you use `VsCode`, it is recommended that you install the extensions recommended for _this_ project, found in the `.vscode/extension.json` directory for `VsCode`.

## 🛠️ Scores Development Environment

There are a few ways in which you can start working with development, all of which are listed below:

### 1.a 🔻 Install / Validate Software Requirements

It is expected that you have the following software installed on your local machine, prior to continuing with the setup:

- `node v16.17.0` & `npm v8.19.1`
  - https://nodejs.org/en
- `make v4.4.1`
  - windows :|: https://community.chocolatey.org/packages/make
  - macos :|: https://formulae.brew.sh/formula/make#default
- `nvm (any version, preferrably @latest)`
  - https://github.com/nvm-sh/nvm
- `git (any version, preferrably @latest)`
  - windows :|: https://community.chocolatey.org/packages/git.install
  - macos :|: https://formulae.brew.sh/formula/git#default
- `heroku (any version, preferrably @latest)`
  - https://devcenter.heroku.com/articles/heroku-cli

If you believe to have the above software requirements, please run the following command in the project root `(./)`, to validate everyhting is in order:

> [!NOTE]
> Tested on `MacOS` and `Windows` compatability.

> [!CAUTION]
> Please use a `Bash`, `Zsh`, `MSYS2-Bash` shell `(a.k.a Bourne Shell)`.
>
> **In addition,** when developing on `Windows`, please enable the commented line in `.npmrc` for `script-shell`.

```bash
make setup-main-check
```

- If you got all green checks (✅) for each of the performed software checks, then you are good to go.
- If you got some errors (❌), please check the respective error messages to address the issue.

> [!NOTE]
> It can be the case that you get a single `❌` error for `NodeJs` check, however, this can be ignored, if the `NVM` check is successful `✅`.

And that is it! **Setup is complete**, development is ready to begin.

### 1.b 🎡 Run Project

If everything went well in the previous steps, you should now be able to access the deployed project on your `localhost`.

For this, run the following command (👇). This command will take care of `setup` and using the local instance of `@betarena/scores-lib` (_given it has been independently correctly setup, and available_).

```bash
make dev-local-start-1-click
```

> [!IMPORTANT]
> If you are developing together with `@betarena/scores-lib` (located somewhere in a different `diretory` on your local machine), please read respective project documentation for `@betarena/scores-lib/.docs/core.*` on the setup for local development, to work with `scores` (_this_) project.
>
> You can obtain the `@betarena/scores-lib` from [here](https://github.com/Betarena/scores-lib).

### 1.c 🚀 Deploy Project to Live

You have made some changes and want to show case them to the rest of the team for respective feedback ?

Do the following:

```bash
make heroku-target-deploy-branch-current env=dev
```

Enjoy your code being deployed on [betarena-scores-platform.herokuapp.com](https://betarena-scores-platform.herokuapp.com/)

### 1.e ✅ Done

**📣 Happy coding!**
