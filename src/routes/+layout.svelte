<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { fixtureVote } from '$lib/store/vote_fixture';
	import { dlog, initSentry } from '$lib/utils/debug';
	import { setUserGeoLocation } from '$lib/utils/platform-functions.js';

	import type { Cache_Single_Lang_Footer_Translation_Response } from '$lib/models/_main_/footer/types';
	import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/_main_/navbar/types';

	import EmailSubscribe from '$lib/components/_Email_subscribe.svelte';
	import OfflineAlert from '$lib/components/_Offline_alert.svelte';
	import PlatformAlert from '$lib/components/_Platform_alert.svelte';
	import SplashScreen from '$lib/components/_Splash_screen.svelte';
	import Footer from '$lib/components/_main_/footer/_Footer.svelte';
	import Header from '$lib/components/_main_/header/Header.svelte';
	import Navbar from '$lib/components/page/profile/Navbar.svelte';

	// import '../app.css';
	
	const VALID_PROFILE_PAGE_URL: string[] = 
  [
		'/u/dashboard',
		'/u/settings'
	];

	let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;
	let FOOTER_TRANSLATION_DATA: Cache_Single_Lang_Footer_Translation_Response;

	let offlineMode: boolean = false;

	$: HEADER_TRANSLATION_DATA = $page.data.HEADER_TRANSLATION_DATA;
	$: FOOTER_TRANSLATION_DATA = $page.data.FOOTER_TRANSLATION_DATA;

  /**
   * @summary [HELPER]
   * @description simple "offline" event
   * listener function declaration;
   */
	function toggleOfflineAlert
  (
  ) 
  {
		offlineMode = !offlineMode;
    // [🐞]
		dlog
    (
			'🔴 your internet connection has changed!',
			true
		);
	}

  onMount
  (
    async () => 
    {
      initSentry()
	  }
  );

	$: if (browser) 
  {
		fixtureVote.useLocalStorage();
		userBetarenaSettings.useLocalStorage();

    setUserGeoLocation
    (
      HEADER_TRANSLATION_DATA
    );

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
  
</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

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

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	main 
  {
		position: relative;
		z-index: 0;
		margin: 0 auto;
		width: 100%;
	}
	main::before 
  {
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
  =============
  RESPONSIVNESS 
  =============
  */

	@media screen 
    and (min-width: 768px) 
  {
		main::before 
    {
			height: 495px;
		}
	}

	@media screen
    and (min-width: 1024px) 
  {
		main::before 
    {
			height: 100%;
			background-size: contain !important;
			top: calc(100vw / -5.5) !important;
		}
	}

</style>
