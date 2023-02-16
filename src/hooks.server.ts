import { v4 as uuid } from '@lukeed/uuid';
import cookie from 'cookie';

import { dlog } from '$lib/utils/debug';
import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
import type {
  Handle,
  RequestEvent
} from '@sveltejs/kit';

/**
 * @description
 * DOC: REF: [3]
 * @param param0
 * @returns
 */
export const handle: Handle = async ({
	event,
	resolve
}) => {
	// https://github.com/sveltejs/kit/issues/4873
	// const clientAddress = !prerendering ? await event.clientAddress : ''; // incorrect-IP
	// const clientAddressv2 = !prerendering ? event : '' // no-working

	// -----------------
	// [ℹ] before endpoint call
	// -----------------

	// [ℹ] getting cookies from request headers
	// [ℹ] all requests have cookies on them
	const cookies = cookie.parse(
		event.request.headers.get('cookie') || ''
	);

	// [ℹ] assign "locals" context from "cookie"
	// [ℹ] or, load defaults
	event.locals.user = cookies.betarenaCOOKIE || {
		userid: uuid(),
		// originIP: event.request.headers['x-forwarded-for'] ||
		//   event.request.socket.remoteAddress ||
		//   null
		// originIP: clientAddress,
		// geoPos: !prerendering ? (await getUserLocationFromIP(clientAddress)) : '',
		lang: 'en',
		theme: 'Light'
	};
	dlog(event?.locals?.user);

  // [ℹ] assign "locals" context from "cookie"
	// [ℹ] or, load defaults
	event.locals.betarenaUser = cookies.betarenaCookieLoggedIn || null;
	dlog(event?.locals?.betarenaUser);

	// TODO: https://github.com/sveltejs/kit/issues/1046
	// if (event.url.searchParams.has('_method')) {
	// 	event.method = event.url.searchParams.get('_method').toUpperCase();
	// }

	// -----------------
	// [ℹ] endpoint call
	// -----------------

	// [ℹ] past use with cookies-template
	// const response = await resolve(event);
	// [ℹ] new with response of <html lang...>
	// DOC: https://github.com/sveltejs/kit/issues/3091
	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%lang%', get_lang(event))
	});

	// -----------------
	// [ℹ] after endpoint call
	// -----------------

	// [ℹ] if this is the first time the user has visited this app,
	if (!cookies.betarenaCOOKIE) {
		// [ℹ] set a cookie so that we recognise them when they return
		response.headers.set(
			'Set-Cookie',
			cookie.serialize(
				'betarenaCOOKIE', // 'name'
				JSON.stringify(event.locals.user), // 'value'
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

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	return event?.locals?.user
		? {
				user: {
					// [ℹ] only include properties needed client-side —
					// [ℹ] exclude anything else attached to the user
					// [ℹ] like access tokens etc
					userid: event.locals.user.userid,
					originIP: event.locals.user.originIP,
					geoPos: event.locals.user.geoPos,
					lang: event.locals.user.lang,
					theme: event.locals.user.theme
				}
		  }
		: {};
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSignedInUser(event) {
	return event?.locals?.betarenaUser
		? true
		: false
  ;
}

/**
 * @description obtains the current platform translation
 * as a hook.server.ts method/function
 * @param {RequestEvent<Partial<Record<string, string>>>} event
 * @returns {string} language
 */
function get_lang(
	event: RequestEvent<Partial<Record<string, string>>>
): string {
	const lang = platfrom_lang_ssr(
		event?.route.id,
		event?.error, // FIXME: event.error does not exist in a hook
		event?.params?.lang
	);
	dlog(`HOOKS | get_lang: ${lang}`, true);
	return lang;
}
