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

    return {
      status: 200
    }

	}
</script>


<!-- ===================
	COMPONENT HTML
=================== -->


<section 
  id='country-page'>
  
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->


<style>
  section#country-page {
    display: grid;
    max-width: 1430px;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
	}
</style>