// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Client Hooks (a.k.a SvelteKit Middleware)                                      │
// │ > 🔗 read-more :|: https://kit.svelte.dev/docs/hooks#server-hooks                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { v4 as uuid } from '@lukeed/uuid';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import cookie from 'cookie';

import { ERROR_CODE_INVALID, PAGE_INVALID_MSG, dlog, dlogv2 } from '$lib/utils/debug';
import { platfrom_lang_ssr } from '$lib/utils/platform-functions';

import type { Handle, HandleServerError } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 💠 MISC.

// ╭─────
// │ CHECK
// │ > disabling of Sentry on localhost
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

// #endregion ➤ 💠 MISC.

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Custom `Error` handle logic.
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
  console.error('❌ An error occurred on the server side:', error, event);

  let errorMsg: string = 'Whoops!';
  let errorCode: string;

  if (event.route.id == null)
  {
    errorMsg = PAGE_INVALID_MSG;
    errorCode = ERROR_CODE_INVALID.toString();
  }

  return {
    message: errorMsg,
    errorId: errorCode,
  }
}

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE [SVELTE]

export const handle: Handle = sequence
(
  /* [1] Step */ Sentry.sentryHandle(),
  /* [2] Step */ async (
    {
      event,
      resolve
    }
  ): Promise < Response > =>
  {
    // ╭─────
    // │ NOTE:
    // │ > attempt to identify user IP from 'request',
    // │ > to preload data from 'server'.
    // │ > 🔗 read-more :|: https://github.com/sveltejs/kit/issues/4873
    // ╰─────
    // const clientAddress = !prerendering ? await event.clientAddress : ''; // incorrect-IP
    // const clientAddressv2 = !prerendering ? event : '' // no-working

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ IMPORTANT                                                                        │
    // │ 📌 Before 'endpoint' call/execute                                                │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    const
      /**
       * @description
       *  📣 obtaining cookies from request headers.
       */
      cookies: Record < string, string >
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
          theme: 'Light',
          // ╭─────
          // │ NOTE:
          // │ > attempt to identify user IP from 'request',
          // │ > to preload data from 'server'.
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

    event.locals.user = cookies.betarenaCOOKIE ?? defaultLocals;

    // ╭─────
    // │ NOTE:
    // │ > assign 'locals' context from 'cookie' or, load defaults.
    // ╰─────
    event.locals.betarenaUser = cookies.betarenaCookieLoggedIn ?? null;

    // 🔗 read-more :|: https://github.com/sveltejs/kit/issues/1046
    // if (event.url.searchParams.has('_method')) {
    // 	event.method = event.url.searchParams.get('_method').toUpperCase();
    // }

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ IMPORTANT                                                                        │
    // │ 📌 Actual 'endpoint' call/execute                                                │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    // ╭─────
    // │ NOTE:
    // │ > past use with cookies-template
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
    // │ IMPORTANT                                                                        │
    // │ 📌 After 'endpoint' call/execute                                                 │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    // ╭─────
    // │ CHECK
    // │ > for first time user visiting app, set cookie.
    // ╰─────
    if (!cookies.betarenaCOOKIE)
      response.headers.set
      (
        'Set-Cookie',
        cookie.serialize
        (
          'betarenaCOOKIE',
          JSON.stringify(event.locals.user),
          {
            path: '/',
            httpOnly: true,
            /* 1 week */ maxAge: 60 * 60 * 24 * 7
          }
        )
      );
    ;

    // [🐞]
    dlogv2
    (
      '🚏 checkpoint [H] ➤ src/hooks.server.ts handle(..)',
      [
        `🔹 [var] ➤ event.url ▓▓ ${event.url}`,
        `🔹 [var] ➤ event.route.id ▓▓ ${event.route.id}`,
        `🔹 [var] ➤ event.url.origin ▓▓ ${event.url.origin}`,
        `🔹 [var] ➤ event.locals.user ▓▓ ${event.locals.user}`,
        `🔹 [var] ➤ event.locals.betarenaUser ▓▓ ${event.locals.betarenaUser}`,
      ],
      true
    );

    return response;
  }
);

// ╭─────
// │ NOTE:
// │ > using Sentry with Custom Error Handler.
// ╰─────
export const handleError: HandleServerError = Sentry.handleErrorWithSentry(customErrorHandler);
// ╭─────
// │ NOTE:
// │ > or, alternatively:
// ╰─────
// export const handleError: HandleServerError = Sentry.handleErrorWithSentry();

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
