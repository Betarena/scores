// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format // V.8.0                                           │
// │ ➤ Status // 🔒 LOCKED                                                            │
// │ ➤ Author(s) // @migbash                                                          │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │:│ Client Hooks (a.k.a SvelteKit Middleware)                                      │
// │:│ 🔗 read-more :|: https://kit.svelte.dev/docs/hooks#server-hooks                │
// │:│ NOTE: | WARNING:                                                               │
// │:│ only applicable to load(..) lifecycle logic in +page[.server].ts files         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { v4 as uuid } from '@lukeed/uuid';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import cookie from 'cookie';

import { ERROR_CODE_INVALID, LOG_PREFIX_HOOKS_S, PAGE_INVALID_MSG, dlog, errlog, log_v3 } from '$lib/utils/debug';
import { platfrom_lang_ssr } from '$lib/utils/platform-functions';

import { parseObject } from '$lib/utils/string.2.js';
import type { Handle, HandleServerError } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 💠 MISCELLANEOUS

// ╭─────
// │ CHECK:
// │ |: disabling of Sentry on localhost
// ╰─────
if (process.env.VITE_SENTRY_ENVIRONMENT != 'local')
{
  // [🐞]
  Sentry.init
  (
    {
      dsn: process.env.VITE_SENTRY_URL,
      tracesSampleRate: 1,
      release: `v.${process.env.npm_package_version}`,
      environment: process.env.SENTRY_ENVIRONMENT,
    }
  );
  // [🐞]
  Sentry.setTags
  (
    {
      location: 'server'
    }
  );
}

// [🐞]
dlog
(
  '🚏 checkpoint [H] ➤ src/hooks.server.ts',
  true
);

// #endregion ➤ 💠 MISCELLANEOUS

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Custom `Error` handle logic.
 *  NOTE:
 *  kept as an example.
 * @param param0
 *  `_inherited_types_`
 * @returns { HandleServerError }
 */
const customErrorHandler: HandleServerError = async (
  {
    error,
    event
  }
): Promise < App.Error > =>
{
  // [🐞]
  errlog
  (
    `${LOG_PREFIX_HOOKS_S} \n ${error} \n ${JSON.stringify(event)}`,
  );

  // [🐞]
  // eslint-disable-next-line no-console
  // console.trace(error);

  let
    /**
     * @description
     * 📣 Error Message.
     */
    message = 'Whoops!',
    /**
     * @description
     * 📣 Error Code.
     */
    errorId = 'x1'
  ;

  if (event.route.id == null)
  {
    message = PAGE_INVALID_MSG;
    errorId = ERROR_CODE_INVALID.toString();
  }

  return {
    message,
    errorId,
  }
}

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE [SVELTE]

export const handle: Handle = sequence
(
  /* Step [1] */
  Sentry.sentryHandle(),
  /* Step [2] */
  async (
    {
      event,
      resolve
    }
  ): Promise < Response > =>
  {
    // ╭─────
    // │ NOTE:
    // │ > attempt to identify user IP from 'request' (server-side)
    // │ > 🔗 read-more :|: https://github.com/sveltejs/kit/issues/4873
    // ╰─────
    // const clientAddress = !prerendering ? await event.clientAddress : ''; // incorrect-IP
    // const clientAddressv2 = !prerendering ? event : '' // no-working

    if (event.url.pathname == '/api/misc/debug')
      return await resolve(event);
    ;

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ IMPORTANT WARNING:                                                               │
    // │ |: Before 'endpoint' call/execute (below)                                        │
    // │ |: Executed after to 'layout.server.ts'                                          │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    const
      // [🐞]
      t0 = performance.now(),
      /**
       * @description
       *  📣 obtaining cookies from request headers.
       */
      cookies
        = cookie.parse
        (
          event.request.headers.get('cookie') ?? ''
        ),
      /**
       * @description
       *  📣 assign 'locals' context from 'cookie' or, load defaults.
       */
      defaultLocals
        = {
          userid: uuid(),
          lang: 'en',
          theme: 'Dark',
          // ╭─────
          // │ NOTE:
          // │ |: attempt to identify user IP from 'request',
          // │ |: to preload data from 'server'.
          // ╰─────
          /*
            originIP:
              event.request.headers['x-forwarded-for']
              || event.request.socket.remoteAddress
              || null
            originIP: clientAddress,
            geoPos:
              !prerendering
                ? (await getUserLocationFromIP(clientAddress))
                : '',
          */
        }
    ;

    // [🐞]
    // console.log('cookies', cookies);

    event.locals.user = cookies.betarenaScoresCookie ?? defaultLocals;

    // ╭─────
    // │ NOTE:
    // │ |: assign 'locals' context from 'cookie' or, load defaults.
    // ╰─────
    event.locals.betarenaUser = cookies.betarenaCookieLoggedIn ?? null;

    if (event.locals.betarenaUser)
      event.locals.uid = JSON.parse(event.locals.user)['user-uid'];
    ;

    // 🔗 read-more :|: https://github.com/sveltejs/kit/issues/1046
    // if (event.url.searchParams.has('_method')) {
    // 	event.method = event.url.searchParams.get('_method').toUpperCase();
    // }

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ IMPORTANT WARNING:                                                               │
    // │ |: Actual 'endpoint' call/execute (below)                                        │
    // │ |: Executed after to 'layout.server.ts'                                          │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    // ╭─────
    // │ NOTE:
    // │ |: past use with cookies-template
    // ╰─────
    // const response = await resolve(event);

    const
      /**
       * @description
       *  📣 new with response of <html lang...>
       * @see https://github.com/sveltejs/kit/issues/3091
       */
      response
        = await resolve
        (
          event,
          {
            transformPageChunk:
            (
              {
                html
              }
            ): string =>
            {
              return html.replace
              (
                '%lang%',
                platfrom_lang_ssr
                (
                  event.route.id,
                  // @ts-expect-error
                  // ╭─────
                  // │ FIXME:
                  // │ > event.error does not exist in a hook
                  // ╰─────
                  event.error,
                  event.params.lang,
                )
              )
            }
          }
        )
    ;

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ IMPORTANT WARNING:                                                               │
    // │ |: After 'endpoint' call/execute                                                 │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    // [🐞]
    // console.log('cookies.betarenaScoresCookie', cookies.betarenaScoresCookie);

    // ╭─────
    // │ CHECK:
    // │ |: for first time user visiting app, set cookie.
    // ╰─────
    if (!cookies.betarenaScoresCookie)
    {
      // [🐞]
      dlog
      (
        '🚏 checkpoint ➤ betarenaScoresCookie not found!',
        true
      );

      response.headers.set
      (
        'Set-Cookie',
        cookie.serialize
        (
          'betarenaScoresCookie',
          JSON.stringify(event.locals.user),
          {
            path: '/',
            // httpOnly: true,
            /* 1 week */ maxAge: 60 * 60 * 24 * 7
          }
        )
      );
    }

    // [🐞]
    log_v3
    (
      {
        strGroupName: `🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) | in ${((performance.now() - t0) / 1000).toFixed(5)} sec`,
        msgs:
        [
          // ` 🔹 [var] ➤ event :: ${JSON.stringify(event.url.pathname)}`,
          // ` 🔹 [var] ➤ event.route.id :: ${event.route.id}`,
          // ` 🔹 [var] ➤ event.url.origin :: ${event.url.origin}`,
          `🔹 [var] ➤ event.url :: ${event.url}`,
          `${parseObject(event.locals) != '{}' ? `🔹 [var] ➤ event.locals :: ${parseObject(event.locals)}` : '[EMPTY]'}`
        ],
      }
    );

    return response;
  }
);

// ╭─────
// │ NOTE:
// │ |: using Sentry with Custom Error Handler.
// ╰─────
export const handleError: HandleServerError = Sentry.handleErrorWithSentry(customErrorHandler);
// ╭─────
// │ NOTE:
// │ |: or, alternatively:
// ╰─────
// export const handleError: HandleServerError = Sentry.handleErrorWithSentry();

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
