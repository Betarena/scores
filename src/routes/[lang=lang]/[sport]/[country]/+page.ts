import {
  error,
  redirect
} from '@sveltejs/kit';

/** 
 * @type {import('./$types').PageLoad} 
 */
export async function load ({
  url,
  params,
  fetch
}) {

  /**
   * [ℹ] Ensure URL Check Existance; 
   */

  const response_valid_url = await fetch(
    `/api/cache/_main_/pages_and_seo?url=${url.pathname}`, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  // [ℹ] validate URL existance;
  if (!response_valid_url) {
    // [ℹ] otherwise, ERROR;
    throw error(404, `Uh-oh! This page does not exist!`);
  }

  const {
    lang,
  } = params

  // [ℹ] return to HOMEPAGE (w/ correct lang)
  throw redirect(302, `/${lang}`);
}