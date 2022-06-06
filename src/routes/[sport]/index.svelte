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

		// [ℹ] return to HOMEPAGE (/ <en>)
		return {
			status: 302,
			redirect: '/'
		};

	}
</script>