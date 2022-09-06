## Live Development Cross-Device Compatibility

To validate for the correct view and interactiveity with the different devices for the users, the use of `browserstack` and `lambdatest` has been incorporated:

- [browserstack](https://live.browserstack.com/)
- [lambdatest](https://accounts.lambdatest.com/billing/plans)

## ⚡ Databases & Data

The platform uses the [`Firebase v9`](https://firebase.google.com/docs/database/web/read-and-write#web-version-9) and `HasuraDB` (w/ PostgreSQL & GraphQL)

*if the `deployment` to `Heroku` is necessary, use the following [`guide`](https://hasura.io/docs/latest/graphql/core/deployment/deployment-guides/heroku.html)

## ✨ Data Caching

The `scores-platform` uses [`redis`](https://redis.io/download) for `caching` of the API DATA for the correct implementation of faster responses and waiting times for the user.
Currently deployed on [upstash](https://docs.upstash.com/redis) - `Free-tier` model of the application.

*example-upstash-redis-sveltekit [blog-upstash](https://blog.upstash.com/svelte-with-serverless-redis)

*[npm-package-ioredis](https://github.com/luin/ioredis)

The app `chaching` works using the `Hasura Events` Trigger, which sends out a `POST` request to a designated `endpoint` to update the `redis` cache accordingly, using the latest changed & updated data.
For more information on `this` can be read [here](https://hasura.io/docs/latest/graphql/core/event-triggers/create-trigger.html)

---

*[example-using-node-js](https://medium.com/dsckiit/how-to-cache-json-data-in-redis-75016e4a2100)

*future-correction: deployment on a `docker-image` instance with the application as one sinlge image.

*alternative-solution-include the use of `service-workers` and `node-cache`, as per solution example [reddit-thread](https://www.reddit.com/r/sveltejs/comments/p3v280/caching_for_load_function_in_sveltekit/h8vw2l3/)

## 🔎 Front-end Metrics Services

**Website Healthiness**

- [Google-Mobile-Friendliness-Check](https://search.google.com/test/mobile-friendly/result?id=ubORB42h3SuKWcAlkAQssw)
- [Website-Speed-PingDom](https://tools.pingdom.com/)
- [GT-Metrix](https://gtmetrix.com/)
- [Dot-com-tools](https://www.dotcom-tools.com/)
- [web-measure-google](https://web.dev/measure/)
- [Page InSight](pagespeed.web.dev)

- [svelte-implemenatation](https://github.com/imbolc/sapper-google-analytics)
- [alt.google-analytics](https://www.npmjs.com/package/@analytics/google-analytics)

**SEO Check**

- [seo-browser.com](https://www.seo-browser.com/)
- [seobility.net](https://www.seobility.net/en/seocheck/)
- [totheweb.com](https://totheweb.com/learning_center/tools-search-engine-simulator/)

## 📂 Project `NPM Packages`

- [svelte-content-loader](https://github.com/PaulMaly/svelte-content-loader)
- [graphql-request](https://www.npmjs.com/package/graphql-request)
- [color-thief](https://lokeshdhakar.com/projects/color-thief/)
- [sveltejs/adapter-node](https://www.npmjs.com/package/@sveltejs/adapter-node)
- [sveltejs/kit](https://www.npmjs.com/package/@sveltejs/kit)

### Converting `PNG` to `WEBP`

- ⭐ [cloud-convert](https://cloudconvert.com/png-to-webp)

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
- [localstorage vs. cookies](https://stackoverflow.com/questions/7799728/localstorage-vs-cookies-performance)

### 🕸 CSP Guides:

- ⭐ [csp-cheat-sheet](https://scotthelme.co.uk/csp-cheat-sheet/#script-src)
- [sveltekit-csp-config](https://kit.svelte.dev/docs/configuration#csp)
- [sveltekit-csp-config-github](https://github.com/sveltejs/kit/issues/93)
- [GOOGLE-CSP](https://developers.google.com/tag-platform/tag-manager/web/csp)
- [YANDEX-CSP](https://yandex.com/support/metrica/code/install-counter-csp.html)
- [google-analytics-js-and-content-security-policy-stackoverflow](https://stackoverflow.com/questions/30939809/google-analytics-js-and-content-security-policy)
- [web.dev/strict-csp](https://web.dev/strict-csp/)
- [refused-to-load-the-script-because-it-violates-the-following-content-security-po](https://stackoverflow.com/questions/31211359/refused-to-load-the-script-because-it-violates-the-following-content-security-po)
- [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [what-s-the-purpose-of-the-html-nonce-attribute-for-script-and-style-elements](https://stackoverflow.com/questions/42922784/what-s-the-purpose-of-the-html-nonce-attribute-for-script-and-style-elements)
- [inline_code_is_considered_harmful](https://developers.google.com/web/fundamentals/security/csp/#inline_code_is_considered_harmful)
- [csp-google-cover](https://developers.google.com/web/fundamentals/security/csp?utm_source=devtools#inline_code_is_considered_harmful)
- [mozilla-csp-cover](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [strict-dynamic](https://web.dev/strict-csp/?utm_source=devtools#why-a-strict-csp-is-recommended-over-allowlist-csps)
- [csp-understand-blog](https://www.troyhunt.com/locking-down-your-website-scripts-with-csp-hashes-nonces-and-report-uri/)
- [hash-vs-nonce-blog](https://stackoverflow.com/questions/43108890/whitelisting-inline-script-with-csp-sha-256-in-firefox)
- [example-use-csp-blog](https://www.dumky.net/posts/using-gtm-with-a-content-security-policy-csp-and-impress-your-devops-team-in-the-process/)
- [blog-on-csp](https://help.branch.io/developers-hub/docs/implement-content-security-protocol-csp)
- [strict-dynamic-example-inject](https://stackoverflow.com/questions/59848978/strict-dynamic-is-present-so-host-based-whitelisting-is-disabled)

**Hash:**

- [hash-example](https://content-security-policy.com/hash/)
- [hash-example-code](https://codepen.io/BranchWebSDK/pen/RwRqLmv)

### 📂 Text Compression:

- ⭐[Gzip compression with Node.js](https://medium.com/@victor.valencia.rico/gzip-compression-with-node-js-cc3ed74196f9)
- [GZIP-TEST](https://sitechecker.pro/gzip-test/)

### Heroku

- [understanding Procfile](https://devcenter.heroku.com/articles/procfile)

### Redis

- [cannot put EXPIRATION on Nested Keyspace Redis](https://stackoverflow.com/questions/56279920/how-to-put-a-ttl-expiration-on-an-hset)
- [use HLEN to obtain number of keys inside a key space]

### 🔁 Node.js Concurrency

- ⭐ [bull npm](https://www.npmjs.com/package/bull)
- [bull docs](https://optimalbits.github.io/bull/)
- ⭐ [heroku blog bull w/ throng](https://devcenter.heroku.com/articles/node-redis-workers)
- [heroku blog bull w/ throng example](https://github.com/heroku-examples/node-workers-example)
- [heroku deployment bull](https://stackoverflow.com/questions/67528225/how-to-make-a-redis-bull-queue-in-a-node-js-environment-thats-deployed-to-her)
- [cluster, CPU worker deployment (like throng)](https://www.npmjs.com/package/cluster)
- [throng, cluster-based NodeJS apps](https://www.npmjs.com/package/throng)
- [throng, GitHub](https://github.com/hunterloftis/throng)
- [heroku dyno types](https://devcenter.heroku.com/articles/dyno-types)
- [dyno usage](https://devcenter.heroku.com/articles/optimizing-dyno-usage)
- [throng Heroku handling](https://github.com/marcosdemelo/throng-on-heroku)
- [enabling concurrency | heroku](https://devcenter.heroku.com/articles/node-concurrency#enabling-concurrency-in-your-app)
- [bull example full | stackoverflow](https://stackoverflow.com/questions/49301282/how-to-pass-full-request-or-response-in-redis-bull-queue)
- [heroku error-pages | heroku](https://devcenter.heroku.com/articles/error-pages#customize-pages)

**Notes**

`Free` `Hobby` `Standard-x1` dyno's only support up to `1` clustering worker per app. Thus, increasing the scaling of the applciation to `>1` (ie: `web` app) will not be allowed.
Similarly, the use of the `worker` attachement of the Heroku App will be cahrged depending on the `dyno` type used by the `worker`.

Higher rank pricing Heroku Apps need to be purchased to enable the use of the appliaction higher `clustering` and `worker` capabilities.

### JSON to Types

- [quicktype](https://app.quicktype.io/)

### Different Environements

- [different environments](https://stackoverflow.com/questions/71901036/how-to-use-different-environments-with-env-files-in-nodejs)

### Code Snippets

- Use the `VITE_` server-side TOKENS

    ```
    // ... example of importing variables from `.env`
    // console.info(import.meta.env.VITE_MY_VARIABLE);
    ```

    [example-1-env-var](https://www.reddit.com/r/sveltejs/comments/mek8rc/svelte_kit_environment_variables/)
    [example-2-env-var](https://dev.to/danawoodman/storing-environment-variables-in-sveltekit-2of3)

- Setting time-outs in JS

  https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235

### Making changes to the `app.html`:

1. Please make the necessary changes to the `sveltekit.config.js` and then,
2. Delete the `svelte-kit` folder respectively and do `npm run dev` to apply the necessary changes

## 💠 Miscellaneous

### Heroku:

```
heroku logs --remote heroku-dev --tail --dyno web
```
to view logs of a particualr type in the console, for a particular app


### GitHub Flow:

```
//the branch you want to overwrite
git checkout email 

//reset to the new branch
git reset --hard origin/staging

// push to remote
git push -f
```

### Other:

- [sveltekit-awesome](https://github.com/janosh/awesome-svelte-kit)

### Saving TABS:

- https://stackoverflow.com/questions/51312095/save-terminal-tabs-to-saved-workspace-vscode/68540643#68540643

### Update Caching at once Powershell Script:

```
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/pages_and_seo/cache-seo-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/navbar/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/footer/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/featured_match/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/featured_betting_sites/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/best_goalscorer/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/league_list/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/leagues_table/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/seo_block/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/tournaments/league_info/cache-data-update.json';
Invoke-RestMethod -Method "POST" -Uri 'https://betarena-scores-platform.herokuapp.com/api/tournaments_standings/cache-data-update.json';
```