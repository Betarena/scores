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
    url, 
    params, 
    fetch
  }) {

    // [ℹ] IMPORTANT!
    const response_valid_url = await fetch(
      `/api/pages_and_seo/cache-seo.json?url=`+url.pathname, 
      {
			  method: 'GET'
		  }
    ).then((r) => r.json());

    const urlLang: string = params.lang == undefined || !response_valid_url ? 'en' : params.lang

    const response_header = await fetch(`/api/navbar/cache-data.json?lang=`+urlLang, {
      method: 'GET',
    }).then(r => r.json());

    const response_footer = await fetch(`/api/footer/cache-data.json?lang=`+urlLang, {
      method: 'GET',
    }).then(r => r.json());

    /**
     * [ℹ] =================
     * [ℹ] further API FETCH enhancing via bundeling requests;
    */

    /*
    const urls = [
      '/api/navbar/cache-data.json?lang='+urlLang,
      `/api/footer/cache-data.json?lang=`+urlLang
    ];

    const promises = urls.map((url) =>
      fetch(url)
      .then((response) => response.json())
    );

    const data = await Promise.all(promises);

    if (dev) console.log("pre-load() data: ", data)

    const response_header = data[0]
    const response_footer = data[1]

    */

    // [ℹ] validate, & return DATA [always]
    if (response_header && 
        response_footer) {

      return {
        status: 200,
        cache: {
          "maxage": 3600,
          "private": false
        },
        props: {
          HEADER_TRANSLATION_DATA: response_header,
          FOOTER_TRANSLATION_DATA: response_footer,
        }
      }
      
    }
    // [ℹ] otherwise, ERROR;
    return {
      status: 400,
      error: new Error(`Uh-oh! There has been an /{__layout} page preloading error`)
    }
  }

</script>


<!-- ===================
  COMPONENT JS - BASIC 
  [TypeScript Written]
=================== -->


<script lang="ts">

  // [ℹ] svelte/+kit
	import { getStores, navigating, page, session, updated } from '$app/stores';
  import { browser, dev } from '$app/env';
  import { onMount } from 'svelte';

  // [ℹ] stores
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { fixtureVote } from '$lib/store/vote_fixture';

  // [ℹ] page-components

  /*
    [v1] - Testing with Standard Imports (client-side)
  */

    import Footer from '$lib/components/footer/_Footer.svelte';
    import Header from '$lib/components/header/_Header.svelte';
    import OfflineAlert from '$lib/components/_Offline_alert.svelte';
    import SplashScreen from '$lib/components/_Splash_screen.svelte';
    import PlatformAlert from '$lib/components/_Platform_alert.svelte';
    import EmailSubscribe from '$lib/components/_Email_subscribe.svelte';
    import GoogleAnalytics from '$lib/components/_GoogleAnalytics.svelte';

  /*
    [v2] - Testing with Dynamic Imports (client-side)
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
  
  // [ℹ] other
  import * as Sentry from "@sentry/browser";
  import { BrowserTracing } from "@sentry/tracing";

  import '../app.css';

  // [ℹ] load in SEO-DATA for Header, Footer TYPES;
  import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/navbar/types';
  import type { Cache_Single_Lang_Footer_Translation_Response } from '$lib/models/footer/types'

  export let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;
  export let FOOTER_TRANSLATION_DATA: Cache_Single_Lang_Footer_Translation_Response;

  // [🐛] debug;
	$: if (dev) console.debug('HEADER $page: ', $page);

  let ga_measurment_id = "UA-60160331-9"  // ... GoogleAnalytics ID
    
  // ... ℹ SENTRY CODE-SNIPPET; [PRODUCTION-ONLY]
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

  // [ℹ] HIDE/SHOW offline ALERT BADGE;
  let offlineMode: boolean = false;
  // [ℹ] method:
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
      {#if HEADER_TRANSLATION_DATA.scores_header_translations.lang != 'en'}
        <a
          sveltekit:prefetch
          href={$page.url.origin + '/' + HEADER_TRANSLATION_DATA.scores_header_translations.lang}>
          <p>{$page.url.origin + '/' + HEADER_TRANSLATION_DATA.scores_header_translations.lang}</p>
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
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links.latest_news}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links.about_us}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links.betting_tips}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links.privacy}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links.social_networks}</p>
      <p>{FOOTER_TRANSLATION_DATA.scores_footer_links.terms}</p>
      <!-- [ℹ] nav-links-social-links
      - ->
      {#each FOOTER_TRANSLATION_DATA.scores_footer_links.social_networks as social_network}
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
  <!-- <OfflineAlert /> -->
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
  <!-- <Footer {FOOTER_TRANSLATION_DATA} /> -->
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
