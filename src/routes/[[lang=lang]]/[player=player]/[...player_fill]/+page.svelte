<!-- ===================
	COMPONENT JS - BASIC 
=================== -->
<script lang="ts">
	import { page } from "$app/stores";
	import Layout from "$lib/components/page/player/Layout.svelte";

  console.log('$page.data', $page.data)
</script>

<!-- ===================
	COMPONENT HTML
=================== -->
<Layout />