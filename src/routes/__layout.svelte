<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    - pre-loading HEADER DATA;
================= -->

<script lang="ts" context="module">

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({url, params, fetch}) {
      // ... DEBUGGING;
      if (dev) console.debug('-- obtaining translations! --');

      // ... get-response for header data;
      const response_header = await fetch('/api/navbar/data.json', {
        method: 'GET',
      }).then(r => r.json());

      // ... get-response for footer data;
      const response_footer = await fetch('/api/footer/data.json', {
        method: 'GET',
      }).then(r => r.json());

      // ... return, RESPONSE DATA for THIS PAGE;
      if (response_header) {
          return {
              status: 200,
              props: {
                  HEADER_TRANSLATION_DATA: response_header,
                  FOOTER_TRANSLATION_DATA: response_footer
              }
          }
      }

      // ... otherwise, ERROR;
      return {
          status: 400,
          error: new Error(`/ page-preloading-error`)
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
  const { session } = getStores();

  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { fixtureVote } from '$lib/store/vote_fixture';

  // ... page-components
  import Footer from '$lib/components/footer/_Footer.svelte';
  import Header from '$lib/components/header/_Header.svelte';
  import OfflineAlert from '$lib/components/_Offline_alert.svelte';
  import SplashScreen from '$lib/components/_Splash_screen.svelte';

  import '../app.css';

  import type { Header_Translation_Response, Header_Translation } from '$lib/model/scores_header_translations';
  import type { Footer_Data } from '$lib/model/footer'

  export let HEADER_TRANSLATION_DATA: Header_Translation_Response;
  export let FOOTER_TRANSLATION_DATA: Footer_Data;

  // ... on client-side-rendering;
  if (browser) {

      // ... kickstart the .localStorage();
      fixtureVote.useLocalStorage();
      userBetarenaSettings.useLocalStorage();

      // ... kickstart offline-badge on info;
      window.addEventListener('offline', toggleOfflineAlert);
      window.addEventListener('online', toggleOfflineAlert);
  }

  // ... DEBUGGING;
  // $: if ($session) console.log('session', $session)
  // $: if ($userBetarenaSettings) console.log('$userBetarenaSettings', $userBetarenaSettings)

  // ... HIDE/SHOW offline ALERT BADGE;
  let offlineMode: boolean = false;

  async function toggleOfflineAlert() {
      if (dev) console.debug('-- your connection has changed! --');
      offlineMode = !offlineMode;
  }
</script>

<!-- ===================
  COMPONENT HTML
=================== -->

{#if offlineMode}
  <OfflineAlert />
{/if}

<SplashScreen />

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
