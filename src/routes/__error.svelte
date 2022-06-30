<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    - pre-loading HEADER DATA;
================= -->


<script lang="ts" context="module">

  /** 
   * @type {import('@sveltejs/kit').Load} 
  */
  export async function load({ 
    error, 
    status, 
    url, 
    params, 
    fetch
  }) {

    // [ℹ] __error.svelte PROPS;
    return {
      props: {
        status: status,
        error: error.message
      }
    };
    
  }
</script>


<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->


<script lang="ts">
  import { dev } from "$app/env";

  export let status: string;
  export let error: string;
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->


<svelte:head>
  <title>{error}</title>
</svelte:head>


<!-- ===================
	COMPONENT HTML
=================== -->


<section 
  id='error-page'>

  <div>
    <h1
      class="s-42 color-primary text-center">
      {status}
    </h1>
    <h1 class="s-22 color-black text-center">
      {error}
    </h1>
  </div>

</section>


<!-- ===================
	COMPONENT STYLE
=================== -->


<style>
  section#error-page {
    display: grid;
    max-width: 1430px;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
	}
</style>