import cookie from 'cookie';                // https://www.npmjs.com/package/cookie
import { v4 as uuid } from '@lukeed/uuid';  // https://www.npmjs.com/package/@lukeed/uuid
import type { Handle } from '@sveltejs/kit';
import { getUserLocationFromIP } from '$lib/geoJs/init';
import { prerendering } from '$app/environment';

// https://dev.to/krowemoh/sveltekit-hooks-2bii
// https://dev.to/kudadam/sveltekit-hooks-everything-you-need-to-know-3l39
// https://rodneylab.com/sveltekit-session-cookies/
// https://stackoverflow.com/questions/71105799/sveltekit-pass-data-from-server-to-browser
// https://github.com/sveltejs/kit/pull/3993
// https://stackoverflow.com/questions/69066169/how-to-implement-cookie-authentication-sveltekit-mongodb
// https://blog.logrocket.com/authentication-svelte-using-cookies/

export const handle: Handle = async ({ event, resolve }) => {

  // https://github.com/sveltejs/kit/issues/4873
  // const clientAddress = !prerendering ? await event.clientAddress : ''; // incorrect-IP
  // const clientAddressv2 = !prerendering ? event : '' // no-working
  
  // -----------------
  // [ℹ] before endpoint call

  // [ℹ] getting cookies from request headers - all requests have cookies on them
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

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
    theme: 'Light',
  };

  // [🐛] debug
  // console.log('event.locals.user', event.locals.user);

	// TODO https://github.com/sveltejs/kit/issues/1046
	// if (event.url.searchParams.has('_method')) {
	// 	event.method = event.url.searchParams.get('_method').toUpperCase();
	// }

  // -----------------
  // [ℹ] endpoint call

	const response = await resolve(event);

  // -----------------
  // [ℹ] after endpoint call

  // [ℹ] if this is the first time the user has visited this app,
	if (!cookies.betarenaCOOKIE) {
		// [ℹ] set a cookie so that we recognise them when they return
		response.headers.set('Set-Cookie', cookie.serialize(
      'betarenaCOOKIE', // 'name'
      JSON.stringify(event.locals.user),  // 'value'
      {
        path: '/',
			  httpOnly: true,
        maxAge: 60 * 60 * 24 * 7  // 1 week
		  }
    ));
	}

	return response;
};

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {

  return event?.locals?.user
  ? 
    {
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
  : 
    {};
}