<!-- ===================
  COMPONENT SCRIPT 
=================== -->
<script lang="ts">
  
	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog } from '$lib/utils/debug';
	import { initSportbookData, platfrom_lang_ssr } from '$lib/utils/platform-functions.js';
	import * as Sentry from '@sentry/browser';
	import { BrowserTracing } from '@sentry/tracing';

	import EmailSubscribe from '$lib/components/_Email_subscribe.svelte';
	import OfflineAlert from '$lib/components/_Offline_alert.svelte';
	import PlatformAlert from '$lib/components/_Platform_alert.svelte';
	import SplashScreen from '$lib/components/_Splash_screen.svelte';
	import Footer from '$lib/components/_main_/footer/_Footer.svelte';
	import Header from '$lib/components/_main_/header/Header.svelte';
	import Navbar from '$lib/components/page/profile/Navbar.svelte';

	import type { Cache_Single_Lang_Footer_Translation_Response } from '$lib/models/_main_/footer/types';
	import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/_main_/navbar/types';

  // NOTE: moved to static/
	// import '../app.css';
	
	const VALID_PROFILE_PAGE_URL: string[] = [
		'/u/dashboard',
		'/u/settings'
	];

	let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;
	let FOOTER_TRANSLATION_DATA: Cache_Single_Lang_Footer_Translation_Response;

	$: HEADER_TRANSLATION_DATA = $page.data.HEADER_TRANSLATION_DATA;
	$: FOOTER_TRANSLATION_DATA = $page.data.FOOTER_TRANSLATION_DATA;

	// [ℹ] SENTRY CODE-SNIPPET; [PRODUCTION-ONLY]
	onMount(async () => {
		if (!dev) {
			Sentry.init({
				dsn: 'https://847e94f5884c4185809a4cee44769d8b@o1009217.ingest.sentry.io/6275655',
				integrations: [
          new BrowserTracing(),
          new Sentry.Replay()
        ],

        // NOTE: browser-tracing;

				// Set tracesSampleRate to 1.0 to capture 100%
				// of transactions for performance monitoring.
				// We recommend adjusting this value in production
				tracesSampleRate: 1.0,
        
        // NOTE: replay-session;
        
        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,
        // If the entire session is not sampled, use the below sample rate to sample
        // sessions when an error occurs.
        replaysOnErrorSampleRate: 1.0,
			});
		}
	});

	// [ℹ] on client-side-rendering;
	if (browser) 
  {
		userBetarenaSettings.useLocalStorage();
		window.addEventListener
    (
			'offline',
			toggleOfflineAlert
		);
		window.addEventListener
    (
			'online',
			toggleOfflineAlert
		);
	}

	// [ℹ] hide/show offline alert
	let offlineMode: boolean = false;
	async function toggleOfflineAlert() {
		dlog(
			'🔴 your internet connection has changed!',
			true
		);
		offlineMode = !offlineMode;
	}

  /**
   * @summary
   * IMPORTANT
   * [MAIN] 
   * [REACTIVE]
   * @description 
   * ➨ listens to change in "server" language;
  */
	$: serverSideLang = platfrom_lang_ssr
  (
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);
  $: if (serverSideLang)
  {
    sessionStore.updateServerLang
    (
      serverSideLang
    );
  }

  /**
   * @summary
   * IMPORTANT
   * [MAIN] 
   * [REACTIVE]
   * @description 
   * ➨ listens to change in "country_bookmaker";
  */
  $: if ($userBetarenaSettings?.country_bookmaker) 
  {
    initSportbookData
    (
      $userBetarenaSettings?.country_bookmaker
    )
  }
  
</script>

<!-- ===================
  COMPONENT HTML
=================== -->

<SplashScreen />

{#if offlineMode}
	<OfflineAlert />
{/if}

<PlatformAlert {HEADER_TRANSLATION_DATA} />
<EmailSubscribe />

{#if !VALID_PROFILE_PAGE_URL.includes($page?.url?.pathname)}
	<Header {HEADER_TRANSLATION_DATA} />
{/if}

<main
	class:dark-background={$userBetarenaSettings.theme == 'Dark'}
>
	{#if VALID_PROFILE_PAGE_URL.includes($page?.url?.pathname)}
		<Navbar />
	{/if}
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
	}
	main::before {
		content: '';
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
  RESPONSIVE FOR TABLET (&+) [768px] 
  */
	@media screen and (min-width: 768px) {
		main::before {
			height: 495px;
		}
	}

	/* 
  RESPONSIVE FOR TABLET (&+) [768px] 
  */
	@media screen and (min-width: 1024px) {
		main::before {
			height: 100%;
			background-size: contain !important;
			top: calc(100vw / -5.5) !important;
		}
	}
</style>
