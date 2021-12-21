# Live Dev Environment

Check for the `origin/dev` environmnet version live on `Heroku` -> [betarena-scores-platform.herokuapp.com](https://betarena-scores-platform.herokuapp.com/).
A more rigorous development link and `application` is being utilized for the development of the platform on a separate `Heroku` instance -> [scores-testing-app.herokuapp.com](https://scores-testing-app.herokuapp.com/).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

## Live Development Cross-Device Compatibility

To validate for the correct view and interactiveity with the different devices for the users, the use of `browserstack` and `lambdatest` has been incorporated:

- [browserstack](https://live.browserstack.com/)
- [lambdatest](https://accounts.lambdatest.com/billing/plans)

## Databases & Data

The platform uses the [`Firebase v9`](https://firebase.google.com/docs/database/web/read-and-write#web-version-9) and `HasuraDB` (w/ PostgreSQL)

*if the `deployment` to `Heroku` is necessary, use the following [`guide`](https://hasura.io/docs/latest/graphql/core/deployment/deployment-guides/heroku.html)

## Further Validation Metrics

- [Google-Mobile-Friendliness-Check](https://search.google.com/test/mobile-friendly/result?id=ubORB42h3SuKWcAlkAQssw)
- [Website-Speed-PingDom](https://tools.pingdom.com/)

## SEO-CHECK

- [seo-browser.com](https://www.seo-browser.com/)
- [seobility.net](https://www.seobility.net/en/seocheck/)
- [totheweb.com](https://totheweb.com/learning_center/tools-search-engine-simulator/)

### `NPM Packages`

- [svelte-content-loader](https://github.com/PaulMaly/svelte-content-loader)
- [graphql-request](https://www.npmjs.com/package/graphql-request)
- [color-thief](https://lokeshdhakar.com/projects/color-thief/)

### Converting `PNG` to `WEBP`

-  [cloud-convert](https://cloudconvert.com/png-to-webp)

### `Svelte` and `SvelteKit` Hints / Tips / Fixes

- [auto-redirect-page-URL](https://www.reddit.com/r/sveltejs/comments/p28oht/how_to_redirect_to_a_url_in_svelte_kit/)
- *discontinued-use-of-`@apollo-client` [init-@apollo-client](https://stackoverflow.com/questions/67135169/how-to-initialize-apolloclient-in-sveltekit-to-work-on-both-ssr-and-client-side)
- [deploy-to-heroku](https://dev.to/nostro/deploying-to-heroku-with-sveltekit-3350)

### Common Development Issues

- [js-issues-outline-gist](https://gist.github.com/0bie/5c43e1e53d9f47a7ba6f65732dc027e9)
- [docker-deployment-node-ENONT-issue](https://coderoad.ru/62950447/NPM-%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C-%D1%87%D1%82%D0%BE-%D1%82%D0%BE-%D0%B8%D0%B7-github-%D0%B2-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80-docker-%D0%BD%D0%B5-%D1%83%D0%B4%D0%B0%D0%B5%D1%82%D1%81%D1%8F)
- [heroku-npm-and-node-deployment-1](https://devcenter.heroku.com/articles/nodejs-support#package-installation)
- [heroku-npm-and-node-deployment-2](https://devcenter.heroku.com/articles/troubleshooting-node-deploys)
- ~~[from VIRTUAL BOX]~~ using W2DSL now
- [heroku-docker-deployment](https://devcenter.heroku.com/articles/build-docker-images-heroku-yml#heroku-yml-overview)
- [docker-ize-svelte-kit-app-1](https://myrmod.de/posts/how-to-host-a-sveltekit-project-with-docker-https)
- [docker-ize-svelte-kit-app-2](https://blog.alexanderwolf.tech/how-to-dockerize-your-sveltekit-app/)
- [docker-ize-svelte-kit-app-3](https://www.youtube.com/watch?v=2hKPVRCOgdM)
- [**unresolved**-hasura-slow](https://github.com/hasura/graphql-engine/issues/6448)
- [optimizing-Hasura-DB-INDEXING-JSON-1](https://itectec.com/database/postgresql-using-gin-to-index-a-json-column/)
- [optimizing-Hasura-DB-INDEXING-JSON-2](https://hasura.io/docs/latest/graphql/core/databases/postgres/queries/performance.html)
- [optimizing-Hasura-DB-INDEXING-JSON-3](https://stackoverflow.com/questions/48372397/what-is-the-purpose-of-defining-an-operator-class-when-defining-index-in-postgre)
- [optimizing-Hasura-DB-INDEXING-JSON-4](https://www.postgresql.org/docs/9.4/datatype-json.html)

### Code Snippets

- Use the `VITE_` server-side TOKENS

    ```
    // ... example of importing variables from `.env`
    // console.info(import.meta.env.VITE_MY_VARIABLE);
    ```

    [example-1-env-var](https://www.reddit.com/r/sveltejs/comments/mek8rc/svelte_kit_environment_variables/)
    [example-2-env-var](https://dev.to/danawoodman/storing-environment-variables-in-sveltekit-2of3)