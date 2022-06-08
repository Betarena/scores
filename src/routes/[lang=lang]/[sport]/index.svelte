<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    -> pre-loading `{sport}-page data;
=================
-->
<script lang="ts" context="module">

	/** 
	 * @type {import('@sveltejs/kit').Load} 
	*/
	export async function load({ 
    url, 
    params, 
    fetch
  }) {

    const response_seo_page = await fetch('/api/pages_and_seo/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());

    // [ℹ] validate URL existance;
    if (!response_seo_page.scores_urls_dev.urlsArr.includes(url.pathname)) {

      // [ℹ] otherwise, ERROR;
      return {
        status: 404,
        error: new Error("Uh-oh! This page does not exist!")
      }
    }

    let { 
      lang,
      sport,
    } = params

		// [ℹ] return to HOMEPAGE (w/ correct lang)
		return {
			status: 302,
			redirect: `/${lang}`
		};

	}
</script>