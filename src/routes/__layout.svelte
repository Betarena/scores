<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { amp, browser, dev, mode, prerendering } from '$app/env';

  import { userBetarenaSettings } from '$lib/store/user-settings'
  import { fixtureVote } from '$lib/store/vote_fixture'

	import Footer from '$lib/components/footer/Footer.svelte'
	import Header from '$lib/components/header/Header.svelte'
  import OfflineAlert from '$lib/components/Offline_alert.svelte'
  import SplashScreen from '$lib/components/Splash_screen.svelte';

	import '../app.css'
    
  // ... kickstart the .localStorage();
  // ... kickstart the .localStorage();
  // ... kickstart offline-badge on info;
  if (browser) {
    fixtureVote.useLocalStorage()
		userBetarenaSettings.useLocalStorage()
    
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

<SplashScreen />

<Header />

<main class:dark-background={$userBetarenaSettings.theme == 'Dark'}>
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
    /* overflow: hidden; */
    /* 
    make sure the initial page height is always full-device-height as a minumim */
    /* min-height: 100vh; */
  } main::before {
    content: "";
    display: inline-block;
    width: 100%;
    height: 435px;
    background-image: url(/src/lib/header-background.svg);
    background-repeat: no-repeat;
    background-size: cover;
    background-origin: border-box;
    background-position: top;
    position: absolute;
    top: -5px;
    z-index: -1;
  }

  /* 
  RESPONSIVE FOR TABLET (&+) [768px] */
  @media screen and (min-width: 768px) {
    main::before {
      height: 495px;
    }
  }

  /* 
  RESPONSIVE FOR TABLET (&+) [768px] */
  @media screen and (min-width: 1024px) {
    main::before {
      height: 100%;
      background-size: contain !important;
      top: calc(100vw / -5.5) !important;
    }
  }
</style>
