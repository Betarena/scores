// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Server Hooks (a.k.a SvelteKit Middleware)                              ◼️
// ### https://kit.svelte.dev/docs/hooks#server-hooks                         ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import { v4 as uuid } from '@lukeed/uuid';
import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import cookie from 'cookie';

import { dlog, dlogv2 } from '$lib/utils/debug';
import { platfrom_lang_ssr } from '$lib/utils/platform-functions';

import type { Handle, HandleServerError, RequestEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 💠 MISC.

// ### [🐞]
Sentry.init
(
  {
    dsn: process.env.VITE_SENTRY_URL,
    tracesSampleRate: 1,
    release: `v.${process.env?.npm_package_version}`,
    environment: process.env.SENTRY_ENVIRONMENT,
  }
);
// ### [🐞]
Sentry.setTags
(
  {
    location: 'server'
  }
);

// ### [🐞]
dlog
(
  `🚏 checkpoint [H] ➤ src/hooks.server.ts`,
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
 *  📌 obtains the current translation as a `hook.server.ts` method/function.
 * @param { RequestEvent < Partial < Record < string, string > > > } event
 *  Target `Event`.
 * @returns { string }
 *  Target `language`.
 */
function getLang
(
  event: RequestEvent < Partial < Record < string, string > > >
): string
{

  const lang: string = platfrom_lang_ssr
  (
    event?.route.id,
    // @ts-ignore
    // FIXME: event.error does not exist in a hook
    event?.error,
    event?.params?.lang,
  );

  // ### [🐞]
  dlog
  (
    `HOOKS | getLang: ${lang}`,
    true
  );

  return lang;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 Custom `Error` handle logic.
 *  NOTE:
 *  kept as an example.
 * @param param0
 *  `_inherited_types_`
 * @returns
 */
const customErrorHandler: HandleServerError = async (
  {
    error,
    event
  }
  ) =>
  {
    console.error("❌ An error occurred on the server side:", error, event);
    return;
  }
;

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

    // ◼️◼️◼️ NOTE:
    // ◼️◼️◼️ attempt to identify user IP from 'request',
    // ◼️◼️◼️ to preload data from 'server'.
    // ◼️◼️◼️ SEE:
    // ◼️◼️◼️ https://github.com/sveltejs/kit/issues/4873
    // const clientAddress = !prerendering ? await event.clientAddress : ''; // incorrect-IP
    // const clientAddressv2 = !prerendering ? event : '' // no-working

    // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
    // IMPORTANT                            ◼️
    // 📌 Before 'endpoint' call/execute    ◼️
    // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

    // ◼️◼️◼️ NOTE:
    // ◼️◼️◼️ getting cookies from request headers.
    const cookies: Record < string, string > = cookie.parse
    (
      event.request.headers.get('cookie') ?? ''
    );

    // ◼️◼️◼️ NOTE:
    // ◼️◼️◼️ assign 'locals' context from 'cookie'
    // ◼️◼️◼️ or, load defaults.
    const defaultLocals =
    {
      userid: uuid(),
      lang: 'en',
      theme: 'Light',
      // ### NOTE:
      // ### attempt to identify user IP from 'request',
      // ### to preload data from 'server'.
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
    };
    event.locals.user = cookies?.betarenaCOOKIE ?? defaultLocals;

    // ◼️◼️◼️ NOTE:
    // ◼️◼️◼️ assign 'locals' context from 'cookie'
    // ◼️◼️◼️ or, load defaults.
    event.locals.betarenaUser = cookies?.betarenaCookieLoggedIn ?? null;

    // ◼️◼️◼️ TODO:
    // ◼️◼️◼️ [?]
    // ◼️◼️◼️ SEE:
    // ◼️◼️◼️ https://github.com/sveltejs/kit/issues/1046
    // if (event.url.searchParams.has('_method')) {
    // 	event.method = event.url.searchParams.get('_method').toUpperCase();
    // }

    // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
    // IMPORTANT                            ◼️
    // 📌 Actual 'endpoint' call/execute    ◼️
    // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

    // ◼️◼️◼️ NOTE:
    // ◼️◼️◼️ past use with cookies-template
    // const response = await resolve(event);

    // ◼️◼️◼️ NOTE:
    // ◼️◼️◼️ new with response of <html lang...>
    // ◼️◼️◼️ SEE:
    // ◼️◼️◼️ https://github.com/sveltejs/kit/issues/3091
    const response = await resolve
    (
      event,
      {
        transformPageChunk:
        (
          {
            html
          }
        ): string =>
          html.replace
          (
            '%lang%',
            getLang(event)
          )
      }
    );

    // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
    // IMPORTANT                            ◼️
    // 📌 After 'endpoint' call/execute     ◼️
    // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

    // ◼️◼️◼️ CHECK
    // ◼️◼️◼️ for first time user visiting app, set cookie.
    if (!cookies.betarenaCOOKIE)
    {
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
    }

    // ◼️◼️◼️ [🐞]
    dlogv2
    (
      `🚏 checkpoint [H] ➤ src/hooks.server.ts handle(..)`,
      [
        `🔹 [var] ➤ event.url ${event?.url}`,
        `🔹 [var] ➤ event?.locals?.user ${event?.locals?.user}`,
        `🔹 [var] ➤ event?.locals?.betarenaUser ${event?.locals?.betarenaUser}`,
      ],
      true
    );

    return response;
  }
);

// ◼️◼️◼️ NOTE:
// ◼️◼️◼️ using Sentry with Custom Error Handler.
// export const handleError: HandleServerError = Sentry.handleErrorWithSentry(customErrorHandler);
// ◼️◼️◼️ or, alternatively,
export const handleError: HandleServerError = Sentry.handleErrorWithSentry();

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]