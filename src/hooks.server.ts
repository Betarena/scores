// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ │: Server Hooks (a.k.a SvelteKit Middleware)                                     │
// │ │: NOTE: | WARNING:                                                              │
// │ │: only applicable to 'load(..)' lifecycle logic in +page[.server].ts files      │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ │: 🔗 read-more :: https://kit.svelte.dev/docs/hooks#server-hooks                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { convertLocaleToLang } from '$lib/constants/instance.js';
import { getCookie } from '$lib/store/cookie.js';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import parserAccLang from 'accept-language-parser';
import chalk from 'chalk';
import cookie from 'cookie';

import { ERROR_CODE_INVALID, PAGE_INVALID_MSG, dlog, errlog, log_v3 } from '$lib/utils/debug';
import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
import { parseObject } from '$lib/utils/string.2.js';

import type { IBetarenaUserCookie } from '$lib/types/types.cookie.js';
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
  '🚏 checkpoint [H] ➤ src/hooks.server.ts'
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
 * @param input
 *  💠 **ALWAYS** `_inherited_types_`
 * @returns { HandleServerError }
 */
const customErrorHandler: HandleServerError = async (
  {
    error,
    event
  }
): Promise < App.Error > =>
{
  const
    /**
     * @description
     * 📝 Error message.
     */
    objError: App.Error
      = {
        message: 'Whoops!',
        errorId: 'x1',
      }
  ;

  // ╭─────
  // │ NOTE:
  // │ |: Skip unwanted logging bloat of 'error', if 'error' is due to 'Not found' page.
  // ╰─────
  if (error instanceof Error && error.message.includes('Not found:'))
    // [🐞]
    errlog
    (
      `🚏 checkpoint ➤ Hooks | src/hooks.server.ts customErrorHandler(..)\n${error.message}`,
    );
  else
    // [🐞]
    errlog
    (
      `🚏 checkpoint ➤ Hooks | src/hooks.server.ts customErrorHandler(..)\n${error}\n${parseObject(event)}`,
    );
  ;

  // [🐞]
  // eslint-disable-next-line no-console
  // console.trace(error);

  if (event.route.id == null)
  {
    objError.message = PAGE_INVALID_MSG;
    objError.errorId = ERROR_CODE_INVALID.toString();
  }

  return objError;
}

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE - [HOOKS]

export const handle: Handle = sequence
(
  /* ─── Step [1] ─── */
  Sentry.sentryHandle(),
  /* ─── Step [2] ─── */
  async (
    {
      event,
      resolve
    }
  ): Promise < Response > =>
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // START',
        msgs:
        [
          `🔹 [var] ➤ event.url :: ${event.url}`,
          `${parseObject(event.locals) != '{}' ? `🔹 [var] ➤ event.locals :: ${parseObject(event.locals)}` : '[EMPTY]'}`
        ],
      }
    );

    // ╭─────
    // │ NOTE:
    // │ |: debug server endpoint
    // ╰─────
    if (event.url.pathname == '/api/misc/debug')
      return await resolve(event);
    ;

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 🔄 LIFECYCLE - [1]                                                               │
    // ┣──────────────────────────────────────────────────────────────────────────────────┫
    // │ |: - Executes before calling 'endpoint'                                          │
    // │ |: - Executes after 'layout.server.ts'                                           │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    const
      // [🐞]
      t0 = performance.now(),
      // ╭─────
      // │ NOTE:
      // │ |: Destruct `object`.
      // ╰─────
      {
        request:
        {
          headers: mapHeaders
        }
      } = event,
      /**
       * @description
       * 📣 obtaining 'accept-language' from request headers.
       */
      listLanguages
        = parserAccLang.parse(mapHeaders.get('accept-language') ?? ''),
      /**
       * @description
       *  📣 obtaining cookies from request headers.
       */
      cookies
        = getCookie
        (
          mapHeaders.get('cookie')
        ),
      /**
       * @description
       *  📣 assign 'locals' context from 'cookie' or, load defaults.
       */
      objUserDefaultCookie: IBetarenaUserCookie
        = {
          uid: null,
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
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // INSIGHT',
        msgs:
        [
          `🔹 [var] ➤ listLanguages :: ${parseObject(listLanguages)}`,
          `🔹 [var] ➤ cookies :: ${parseObject(cookies)}`,
        ],
      }
    );

    event.locals.user = JSON.parse(cookies.betarenaScoresCookie ?? null) as IBetarenaUserCookie;

    // ╭─────
    // │ CHECK:
    // │ |: for new visitor, set default values.
    // ╰─────
    if (event.locals.user == undefined)
    {
      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // [1] - user cookie not found, setting cookie',
          msgs: [],
        }
      );

      event.locals.user = objUserDefaultCookie;
      event.locals.user.lang = convertLocaleToLang(`${listLanguages[0].code}-${listLanguages[0].region}`);
    }

    if (cookies.betarenaCookieLoggedIn)
      event.locals.uid = event.locals.user.uid;
    ;

    // 🔗 read-more :|: https://github.com/sveltejs/kit/issues/1046
    // if (event.url.searchParams.has('_method'))
    // {
    // 	event.method = event.url.searchParams.get('_method').toUpperCase();
    // }

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 🔄 LIFECYCLE - [2]                                                               │
    // ┣──────────────────────────────────────────────────────────────────────────────────┫
    // │ |: - Executes 'endpoint'                                                         │
    // │ |: - Executes after 'layout.server.ts'                                           │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    // ╭─────
    // │ NOTE:
    // │ |: [archive] past use with cookies-template
    // ╰─────
    // const response = await resolve(event);

    const
      /**
       * @description
       * 📣 Method Response (0)
       */
      methodRes0
        = platfrom_lang_ssr
        (
          event.route.id,
          // @ts-expect-error
          // ╭─────
          // │ FIXME:
          // │ > event.error does not exist in a hook
          // ╰─────
          event.error,
          event.params.lang,
        ),
      /**
       * @description
       *  📣 new with response of <html lang...>
       * @see https://github.com/sveltejs/kit/issues/3091
       */
      dataRes0
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
              return html
                .replace
                (
                  '%lang%',
                  event.locals.strLocaleOverride ?? methodRes0
                )
              ;
            }
          }
        )
    ;

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 🔄 LIFECYCLE - [3]                                                               │
    // ┣──────────────────────────────────────────────────────────────────────────────────┫
    // │ |: - Executes 'endpoint'                                                         │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    // ╭─────
    // │ CHECK:
    // │ |: new visitor, new cookie.
    // ╰─────
    if (!cookies.betarenaScoresCookie)
    {
      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // [2] - setting cookie',
          msgs:
          [
            `🔹 [var] ➤ event.locals.user :: ${parseObject(event.locals.user)}`,
            `🔹 [var] ➤ event.locals.strLocaleOverride :: ${event.locals.strLocaleOverride}`,
            `🔹 [var] ➤ event.url.pathname :: ${event.url.pathname}`,
          ],
        }
      );

      dataRes0.headers.set
      (
        'Set-Cookie',
        cookie.serialize
        (
          'betarenaScoresCookie',
          JSON.stringify(event.locals.user),
          {
            path: '/',
            // httpOnly: true,
            /* ─── 1 week ─── */
            maxAge: 60 * 60 * 24 * 7
          }
        )
      );
    }

    let
      /**
       * @description
       * 📝 Execution time.
       */
      strExecutionTime = ((performance.now() - t0) / 1000).toFixed(5)
    ;

    if (parseFloat(strExecutionTime) > 1)
      strExecutionTime = chalk.bgRed(`⚠️ ${strExecutionTime} sec`);
    else
      strExecutionTime = `${strExecutionTime} sec`;
    ;

    // [🐞]
    log_v3
    (
      {
        strGroupName: `🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // END (${strExecutionTime})`,
        msgs:
        [
          `🔹 [var] ➤ event.url :: ${event.url}`,
          `${parseObject(event.locals) != '{}' ? `🔹 [var] ➤ event.locals :: ${parseObject(event.locals)}` : '[EMPTY]'}`,
          // ╭─────
          // │ NOTE:
          // │ |: additional helpful logging.
          // ╰─────
          // `🔹 [var] ➤ event :: ${JSON.stringify(event.url.pathname)}`,
          // `🔹 [var] ➤ event.route.id :: ${event.route.id}`,
          // `🔹 [var] ➤ event.url.origin :: ${event.url.origin}`,
          // `🔹 [var] ➤ event :: ${event.request.headers.get('accept-language')}`,
        ],
      }
    );

    return dataRes0;
  }
);

// ╭─────
// │ NOTE:
// │ │: using Sentry with Custom Error Handler.
// ╰─────
export const handleError: HandleServerError = Sentry.handleErrorWithSentry(customErrorHandler);
// ╭─────
// │ NOTE:
// │ │: or, alternatively:
// ╰─────
// export const handleError: HandleServerError = Sentry.handleErrorWithSentry();

// #endregion ➤ 🔄 LIFECYCLE - [HOOKS]
