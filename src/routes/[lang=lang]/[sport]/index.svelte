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