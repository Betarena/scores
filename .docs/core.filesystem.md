## 📝 About

**This** section contains further information on how the `project` is currently structured, and what the general structure should be followed.

#### `.husky/`

related to `commitlint.config.cjs`.

Provides **strict** guidelines for as to _how_ commit messages should be formatted and written.

#### `Makefile`

Used to store and speed up development flow, by providing **make targets** for executing commands more effortlesly. The _Makefile_ is also used for _stashing_ commands for possible furutre usecase.

#### `Procfile`

Used by `Heroku` to manage deployment and the respective `Heroku Dyno` configuration.

read-more:
- https://devcenter.heroku.com/articles/procfile

#### `openapi.yaml`

Contains definitions for the available `endpoints` that _this_ project provides following the Swagger/OpenAPI `^3.0.X` standard.

#### `tsconfig.json`

Contains the `configuration` used for the TypeScript employed in the project.

#### `.eslint.yaml`

Contains the `configuration` of the accepted style, structure, format of _this_ project code.

#### `.env.vault`

Used by `dotenv` for project secrets management.

read-more:
- https://www.dotenv.org/docs
- https://www.dotenv.org/docs/security/env-vault

#### `.deepsource.toml`

Used by `Deepsource`.

read-more:
- https://deepsource.com/

#### `.dockerignore` & `docker/`

Cotains a combination of both `docker-compose` and `Dockerfile`'s used for deployment in the respective environemnts.

Implied filename structure: `<envrionment>.docker-compose.yaml`.

#### `src/`

Main project sourcecode using `SvelteJs` with `SvelteKit`.

#### `static/`

As the implies, _this_ directory should contain files that are _static_, that will require very/no major change and/or need to be available globally.