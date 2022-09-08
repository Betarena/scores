<svelte:head>
    <script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
</svelte:head>
<script>
	import { getStores, navigating, page, session, updated } from '$app/stores';
  import { browser, dev } from '$app/environment';
  import { onMount } from 'svelte';

  // export let page
  export let id

  onMount(async() => {
    if (browser) {
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || []
        window.gtag = function gtag() {
            window.dataLayer.push(arguments)
        }
        window.gtag("js", new Date())
        window.gtag("config", id, { 'send_page_view': false })
      }
    }
  })
  // ...
  $: {
    if (typeof gtag !== "undefined"){
      window.gtag("config", id, {
        page_path: $page.url.pathname,
      });
    }
  }
</script>
