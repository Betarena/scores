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
  export async function load({url, params, fetch}) {

      // ... redirect-accordingly-https;
      // if (!dev && url.protocol != 'https:') {
      //   return {
      //     status: 301,
      //     redirect: 'https://' + url.host + url.pathname
      //   };
      // }

      // ... DEBUGGING;
      if (dev) console.debug('ℹ loading navbar!, \n ℹ footer cache-data!');

      // ... get-response for header data;
      const response_header = await fetch('/api/navbar/cache-data.json', {
        method: 'GET',
      }).then(r => r.json());

      // ... get-response for footer data;
      const response_footer = await fetch('/api/footer/data.json', {
        method: 'GET',
      }).then(r => r.json());

      const response_seo_page = await fetch('/api/page_seo/cache-seo.json', {
        method: 'GET'
      }).then((r) => r.json());

      // ... return, RESPONSE DATA for THIS PAGE;
      if (response_header && 
          response_footer) {
          return {
              status: 200,
              props: {
                  HEADER_TRANSLATION_DATA: response_header,
                  FOOTER_TRANSLATION_DATA: response_footer,
                  PAGE_DATA_SEO: response_seo_page
              }
          }
      }

      // ... otherwise, return ERROR;
      return {
          status: 400,
          error: new Error(`/page-preloading-error`)
      }
  }
</script>

<!-- ===================
  COMPONENT JS - BASIC 
  [TypeScript Written]
=================== -->

<script lang="ts">
	import { getStores, navigating, page, session, updated } from '$app/stores';
  import { browser, dev } from '$app/env';
  import { onMount } from 'svelte';
  // import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
  // import GoogleAnalytics from "sapper-google-analytics/GoogleAnalytics.svelte"

  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { fixtureVote } from '$lib/store/vote_fixture';

  // ... page-components
  import Footer from '$lib/components/footer/_Footer.svelte';
  import Header from '$lib/components/header/_Header.svelte';
  import OfflineAlert from '$lib/components/_Offline_alert.svelte';
  import SplashScreen from '$lib/components/_Splash_screen.svelte';
  import PlatformAlert from '$lib/components/_Platform_alert.svelte';
  import EmailSubscribe from '$lib/components/_Email_subscribe.svelte';
  import GoogleAnalytics from '$lib/components/_GoogleAnalytics.svelte';

  import * as Sentry from "@sentry/browser";
  import { BrowserTracing } from "@sentry/tracing";

  import '../app.css';

  // const { session } = getStores();

  // ... load in SEO-DATA for Header, Footer TYPES;
  import type { Header_Translation_Response, Header_Translation } from '$lib/models/navbar/types';
  import type { Footer_Data } from '$lib/models/footer/types'
  import type { Hasura_Complete_Pages_SEO } from '$lib/models/page_seo/types';

  export let HEADER_TRANSLATION_DATA: Header_Translation_Response;
  export let FOOTER_TRANSLATION_DATA: Footer_Data;
  export let PAGE_DATA_SEO: Hasura_Complete_Pages_SEO;

  // ... https://stackoverflow.com/questions/4723213/detect-http-or-https-then-force-https-in-javascript
  // $: if (!dev && browser && location.protocol !== 'https:') {
  //   location.replace(`https:${location.href.substring(location.protocol.length)}`);
  // }

  let ga_measurment_id = "UA-60160331-9"  // ... your analytics id
  // console.log('page', $page);
    
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

  // ... on client-side-rendering;
  if (browser) {
      // ... kickstart the .localStorage();
      fixtureVote.useLocalStorage();
      userBetarenaSettings.useLocalStorage();

      // ... kickstart offline-badge on info;
      window.addEventListener('offline', toggleOfflineAlert);
      window.addEventListener('online', toggleOfflineAlert);
  }

  // ... HIDE/SHOW offline ALERT BADGE;
  let offlineMode: boolean = false;
  // ...
  async function toggleOfflineAlert() {
      if (dev) console.debug('🔴 your internet connection has changed!');
      offlineMode = !offlineMode;
  }
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- ... ℹ head content 
  -->
  {#if PAGE_DATA_SEO}
    <!-- ... ℹ content here 
    -->
    {#each PAGE_DATA_SEO.scores_hreflang_dev as item}
      <!-- ... ℹ content here 
      -->
      {#if item.link == null}
        <!-- content here -->
        <link rel="alternate" hreflang={item.hreflang} href="https://scores.betarena.com/" />
      {:else}
        <link rel="alternate" hreflang={item.hreflang} href="https://scores.betarena.com/{item.link}" />
      {/if}
    {/each}
  {/if}
</svelte:head>


<!-- ===================
  COMPONENT HTML
=================== -->

{#if !dev}
  <!-- content here -->
  <!-- <GoogleAnalytics properties={['UA-60160331-9']} /> -->
  <GoogleAnalytics 
    id={ga_measurment_id}
    />
{/if}


{#if offlineMode}
  <OfflineAlert />
{/if}

<PlatformAlert {HEADER_TRANSLATION_DATA} />

<SplashScreen />

<EmailSubscribe />

<Header {HEADER_TRANSLATION_DATA} />

<main class:dark-background={$userBetarenaSettings.theme == 'Dark'}>
  <slot />
  <Footer {FOOTER_TRANSLATION_DATA} />
</main>

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
