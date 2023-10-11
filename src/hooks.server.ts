// #region ➤ 📦 Package Imports

import { v4 as uuid } from '@lukeed/uuid';
import cookie from 'cookie';

import { dlog } from '$lib/utils/debug';
import { platfrom_lang_ssr } from '$lib/utils/platform-functions';

import type { Handle, RequestEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

/**
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
		event?.error, // FIXME: event.error does not exist in a hook
		event?.params?.lang
	);

  // [🐞]
	dlog
  (
    `HOOKS | getLang: ${lang}`,
    true
  );

	return lang;
}

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE [SVELTE]

export const handle: Handle = async (
  {
    event,
    resolve
  }
): Promise < Response > =>
{

  // [🐞]
  dlog
  (
    `🚏 checkpoint ➤ src/hooks.server.ts handle`,
    true
  );

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ event.url ${event?.url}`,
    true
  );

  // ### NOTE:
  // ### attempt to identify user IP from 'request',
  // ### to preload data from 'server'.
	// ### SEE:
  // ### https://github.com/sveltejs/kit/issues/4873
	// const clientAddress = !prerendering ? await event.clientAddress : ''; // incorrect-IP
	// const clientAddressv2 = !prerendering ? event : '' // no-working

  // ### IMPORTANT
  // ### before 'endpoint' call/execute.
  // ### IMPORTANT

	// ### NOTE:
  // ### getting cookies from request headers.
	const cookies: Record < string, string > = cookie.parse
  (
		event.request.headers.get('cookie') ?? ''
	);

	// ### NOTE:
	// ### assign 'locals' context from 'cookie'
	// ### or, load defaults.
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

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ event?.locals?.user ${event?.locals?.user}`,
    true
  );

	// ### NOTE:
	// ### assign 'locals' context from 'cookie'
	// ### or, load defaults.
	event.locals.betarenaUser = cookies?.betarenaCookieLoggedIn ?? null;

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ event?.locals?.betarenaUser ${event?.locals?.betarenaUser}`,
    true
  );

	// ### TODO:
  // ### [?]
  // ### SEE:
  // ### https://github.com/sveltejs/kit/issues/1046
	// if (event.url.searchParams.has('_method')) {
	// 	event.method = event.url.searchParams.get('_method').toUpperCase();
	// }

  // ### IMPORTANT
  // ### actual 'endpoint' call/execute.
  // ### IMPORTANT

	// ### NOTE:
	// ### past use with cookies-template
	// const response = await resolve(event);

	// ### NOTE:
	// ### new with response of <html lang...>
  // ### SEE:
	// ### https://github.com/sveltejs/kit/issues/3091
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

  // ### IMPORTANT
	// ### after 'endpoint' call
  // ### IMPORTANT

  // ### CHECK
  // ### first time user visit app, set a cookie.
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
					maxAge: 60 * 60 * 24 * 7 // 1 week
				}
			)
		);
	}

	return response;
};

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]