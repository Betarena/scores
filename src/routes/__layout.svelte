<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { amp, browser, dev, mode, prerendering } from '$app/env';

  import { langSelect } from '$lib/store/lang-select'

	import Footer from '$lib/components/footer/Footer.svelte'
	import Header from '$lib/components/header/Header.svelte'
  import OfflineAlert from '$lib/components/Offline_alert.svelte';

	import '../app.css'
    
  // ... kickstart the .localStorage();
  // ... kickstart offline-badge on info;
  if (browser) {
		langSelect.useLocalStorage()
    window.addEventListener('offline', toggleOfflineAlert)
    window.addEventListener('online', toggleOfflineAlert)
  }

  // ... HIDE/SHOW offline ALERT BADGE;
  let offlineMode: boolean = false

  function toggleOfflineAlert() { 
    if (dev) console.debug('-- your connection has changed! --')
    offlineMode = !offlineMode
  }
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if offlineMode}
   <OfflineAlert />
{/if}

<Header />

<main>
	<slot />
</main>

<Footer />

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
	main {
        /* 
        so nothing exceeds the main-page-boundries */
        position: relative;
        z-index: 0;
        margin: 0 auto;
        width: 100%;
        overflow: hidden;
        /* 
        make sure the initial page height is always full-device-height as a minumim */
        /* min-height: 100vh; */
    }
</style>
