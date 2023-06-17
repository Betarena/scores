<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog, initSentry } from '$lib/utils/debug';
	import { initSportbookData, platfrom_lang_ssr, setUserGeoLocation } from '$lib/utils/platform-functions.js';

	import EmailSubscribe from '$lib/components/Email-Subscribe.svelte';
	import OfflineAlert from '$lib/components/Offline-Alert.svelte';
	import PlatformAlert from '$lib/components/Platform-Alert.svelte';
	import SplashScreen from '$lib/components/Splash-Screen.svelte';
	import Footer from '$lib/components/_main_/footer/Footer.svelte';
	import Header from '$lib/components/_main_/header/Header.svelte';
	import Navbar from '$lib/components/page/profile/Navbar.svelte';

  // #endregion ➤ [MAIN] Package Imports

  // #region ➤ [VARIABLES]

  // NOTE: moved to static/
	// import '../app.css';

	const VALID_PROFILE_PAGE_URL: string[] =
  [
		'/u/dashboard',
		'/u/settings'
	];

	let HEADER_TRANSLATION_DATA: any;
	let FOOTER_TRANSLATION_DATA: any;

	let offlineMode: boolean = false;

	$: HEADER_TRANSLATION_DATA = $page.data.HEADER_TRANSLATION_DATA;
	$: FOOTER_TRANSLATION_DATA = $page.data.FOOTER_TRANSLATION_DATA;

  // #endregion ➤ [VARIABLES]

  // #region ➤ [METHODS]

  /**
   * @summary
   * [HELPER]
   * @description
   * ➨ simple "offline" event listener function declaration;
   */
	function toggleOfflineAlert
  (
  ): void
  {
		offlineMode = !offlineMode;
    // [🐞]
		dlog
    (
			'🔴 your internet connection has changed!',
			true
		);
	}

  // #endregion ➤ [METHODS]

  // #region ➤ [REACTIVIY] [METHODS]

	$: if (browser)
  {
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

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  onMount
  (
    async () =>
    {
      initSentry()
	  }
  );

  // #endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

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
	<Header WIDGET_T_DATA={HEADER_TRANSLATION_DATA} />
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
