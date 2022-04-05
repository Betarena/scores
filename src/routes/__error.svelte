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
  export async function load({ error, status, url, params, fetch}) {
    // ... DEBUGGING;

    // ...
    return {
      props: {
        title: `${status}: ${error.message}`
      }
    };
  }
</script>

<!--  -->
<script lang="ts">
  import { dev } from "$app/env";

  export let title;
</script>

<!--  -->
<svelte:head>
  <!-- head content -->
  <title> title </title>
</svelte:head>

<!--  -->
<h1>{title}</h1>