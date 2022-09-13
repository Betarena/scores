<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->


<script lang="ts">
  import { dev } from '$app/environment';
  import { page } from '$app/stores';

</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->


<svelte:head>
  <title>{$page.error.message}</title>
</svelte:head>


<!-- ===================
	COMPONENT HTML
=================== -->


<section 
  id='error-page'>

  <div>
    <h1
      class="s-42 color-primary text-center">
      {$page.status}
    </h1>
    <h1 class="s-22 color-black text-center">
      {$page.error.message}
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