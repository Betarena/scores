import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** @type {import('./$types').PageLoad} */
export async function load ({
  url, 
  params, 
  fetch,
  setHeaders
}): PageLoad {

  // [ℹ] critical
  const response_valid_url = await fetch (
    `/api/cache/pages_and_seo?url=`+url.pathname, 
    {
      method: 'GET'
    }
  ).then((r) => r.json())

  const urlLang: string = 
    params.lang == undefined || 
    !response_valid_url 
      ? 'en' 
      : params.lang

  const response_header = await fetch (
    `/api/cache/navbar?lang=`+urlLang, 
    {
      method: 'GET'
    }
  ).then(r => r.json())

  const response_footer = await fetch (
    `/api/cache/footer?lang=`+urlLang, 
    {
      method: 'GET',
    }
  ).then(r => r.json())

  /**
   * [ℹ] =================
   * [ℹ] further API FETCH enhancing via bundeling requests;
  */

  /*
    const urls = [
      '/api/cache/navbar/cache-data.json?lang='+urlLang,
      `/api/cache/footer/cache-data.json?lang=`+urlLang
    ];

    const promises = urls.map((url) =>
      fetch(url)
      .then((response) => response.json())
    );

    const data = await Promise.all(promises);

    if (dev) console.log("pre-load() data: ", data)

    const response_header = data[0]
    const response_footer = data[1]
  */

  if (
    response_header &&
    response_footer) {
      
    setHeaders({
      'cache-control': 'public, max-age=3600'
    });

    return {
      HEADER_TRANSLATION_DATA: response_header,
      FOOTER_TRANSLATION_DATA: response_footer
    }
  }
  
  throw error(400, `Uh-oh! There has been an /{__layout} page preloading error`);
}