<!-- ===================
  COMPONENT JS - BASIC 
  [TypeScript Written]
=================== -->

<script lang="ts">
	import { getStores, navigating, page, updated } from '$app/stores';
  import { browser, dev } from '$app/env';
  import { onMount } from 'svelte';

  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { fixtureVote } from '$lib/store/vote_fixture';

  import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/navbar/types';
  import type { Cache_Single_Lang_Footer_Translation_Response } from '$lib/models/footer/types'
	import type { PageData } from './$types';

  // [ℹ] session replacement


	export let data: PageData;

  // [🐛] debug;
  let disableDev = true;
  if (dev && !disableDev) console.log(`data`, data);
	if (dev && !disableDev) console.debug('$page: ', $page);

  /*
    [v1]
    Standard Imports (client-side)
  */

  import Footer from '$lib/components/footer/_Footer.svelte';
  import Header from '$lib/components/header/_Header.svelte';
  import OfflineAlert from '$lib/components/_Offline_alert.svelte';
  import SplashScreen from '$lib/components/_Splash_screen.svelte';
  import PlatformAlert from '$lib/components/_Platform_alert.svelte';
  import EmailSubscribe from '$lib/components/_Email_subscribe.svelte';
  // import GoogleAnalytics from '$lib/components/_GoogleAnalytics.svelte';

  /*
    [v2] 
    Dynamic Imports (client-side)
  */

  /*
    let Footer;
    let Header;
    let OfflineAlert;
    let SplashScreen;
    let PlatformAlert;
    let EmailSubscribe;
    let GoogleAnalytics;

    onMount(async () => {
      Footer = (await import('$lib/components/footer/_Footer.svelte')).default;
      Header = (await import('$lib/components/header/_Header.svelte')).default;
      OfflineAlert = (await import('$lib/components/_Offline_alert.svelte')).default;
      SplashScreen = (await import('$lib/components/_Splash_screen.svelte')).default;
      PlatformAlert = (await import('$lib/components/_Platform_alert.svelte')).default;
      EmailSubscribe = (await import('$lib/components/_Email_subscribe.svelte')).default;
      GoogleAnalytics = (await import('$lib/components/_GoogleAnalytics.svelte')).default;
    });
  */
  
  import * as Sentry from "@sentry/browser";
  import { BrowserTracing } from "@sentry/tracing";

  import '../app.css';

  let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response = data.HEADER_TRANSLATION_DATA;
  let FOOTER_TRANSLATION_DATA: Cache_Single_Lang_Footer_Translation_Response = data.FOOTER_TRANSLATION_DATA;

  let ga_measurment_id = "UA-60160331-9"  // ... GoogleAnalytics ID
    
  // [ℹ] SENTRY CODE-SNIPPET; [PRODUCTION-ONLY]
  onMount(async() => {
    if (!dev) {
      Sentry.init({
        dsn: "https://847e94f5884c4185809a4cee44769d8b@o1009217.ingest.sentry.io/6275655",
        integrations: [new BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
      });
    }
  })

  // [ℹ] on client-side-rendering;
  if (browser) {
    // [ℹ] kickstart the .localStorage();
    fixtureVote.useLocalStorage();
    userBetarenaSettings.useLocalStorage();
    // [ℹ] kickstart offline-badge on info;
    window.addEventListener('offline', toggleOfflineAlert);
    window.addEventListener('online', toggleOfflineAlert);
  }

  // [ℹ] hide/show offline alert
  let offlineMode: boolean = false;
  async function toggleOfflineAlert() {
    if (dev) console.debug('🔴 your internet connection has changed!');
    offlineMode = !offlineMode;
  }
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- https://github.com/sveltejs/kit/issues/3091 -->
  <html lang="{
    $page.params.lang === undefined || 
    $page.error 
      ? 'en' 
      : $page.params.lang === 'br'
        ? 'pt-BR'
        : $page.params.lang
    }" 
  />
</svelte:head>

<!-- [ℹ] SEO-DATA-LOADED 
- ->
{#if !browser &&
      HEADER_TRANSLATION_DATA &&
      FOOTER_TRANSLATION_DATA}
  
  <div 
    id="seo-widget-container">

    <!-- [ℹ] HEADER SEO
    - ->
    <div>
      {#if HEADER_TRANSLATION_DATA.scores_header_translations_dev.lang != 'en'}
        <a
          sveltekit:prefetch
          href={$page.url.origin + '/' + HEADER_TRANSLATION_DATA.scores_header_translations_dev.lang}>
          <p>{$page.url.origin + '/' + HEADER_TRANSLATION_DATA.scores_header_translations_dev.lang}</p>
        </a>
      {:else}
        <a
          sveltekit:prefetch
          href={$page.url.origin}>
          <p>{$page.url.origin}</p>
        </a>
      {/if}
    </div>

    <!-- [ℹ] FOOTER SEO 
    - ->
    <div>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links_dev.latest_news}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links_dev.about_us}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links_dev.betting_tips}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links_dev.privacy}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links_dev.social_networks}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links_dev.terms}</p>
      <!-- [ℹ] nav-links-social-links
      - ->
      {#each FOOTER_TRANSLATION_DATA.scores_footer_links_dev.social_networks as social_network}
        <p>{social_network[1].toString().toLocaleLowerCase()}</p>
      {/each}
    </div>

  </div>
{/if}
-->

<!-- ===================
  COMPONENT HTML
=================== -->

{#if !dev}
  <!-- <GoogleAnalytics 
    id={ga_measurment_id}
  /> -->
  <!-- <svelte:component this={GoogleAnalytics} id={ga_measurment_id} /> -->
{/if}

{#if offlineMode}
  <svelte:component this={OfflineAlert} />
{/if}

<!-- <PlatformAlert {HEADER_TRANSLATION_DATA} /> -->
<!-- <SplashScreen /> -->
<!-- <EmailSubscribe /> -->
<!-- <Header {HEADER_TRANSLATION_DATA} /> -->

<svelte:component this={PlatformAlert} {HEADER_TRANSLATION_DATA} />
<svelte:component this={SplashScreen} />
<svelte:component this={EmailSubscribe} />
<svelte:component this={Header} {HEADER_TRANSLATION_DATA} />

<main class:dark-background={$userBetarenaSettings.theme == 'Dark'}>
  <slot />
  <svelte:component this={Footer} {FOOTER_TRANSLATION_DATA} />
</main>


<!-- ===================
	COMPONENT STYLE
=================== -->


<style>
  #seo-widget-container {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}
  
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
    background-image: url('/assets/svg/header-background.svg');
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
