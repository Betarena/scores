## About

**This** section contains further information on how the `project` is currently structured, and what the general structure should be followed.

#### `.husky/`

related `commitlint.config.cjs`.

Provides **strict** guidelines for as to _how_ commit messages should be formatted and written.

#### `Makefile`

#### `Procfile`

Used by `Heroku`.

read-more https://devcenter.heroku.com/articles/procfile

#### `openapi.yaml`

Contains definitions for the available `endpoints` that _this_ project provides following the Swagger/OpenAPI `^3.0.X` standard.

#### `tsconfig.json`

#### `.eslint.yaml`

#### `.env.vault`

#### `.deepsource.toml`

#### `.dockerignore` & `docker/`

#### `src/`

#### `static/`

As the implies, _this_ directory should contain files that are _static_, that will require very/no major change and/or need to be available globally.