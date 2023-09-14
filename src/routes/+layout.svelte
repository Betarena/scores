<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, initSentry } from '$lib/utils/debug';
	import { initSportbookData, platfrom_lang_ssr, setUserGeoLocation } from '$lib/utils/platform-functions.js';

	import Footer from '$lib/components/_main_/footer/Footer.svelte';
	import Header from '$lib/components/_main_/header/Header.svelte';

	import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';

  // import SplashScreen from '$lib/components/Splash-Screen.svelte';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
	// import OfflineAlert from '$lib/components/Offline-Alert.svelte';
	// import PlatformAlert from '$lib/components/Platform-Alert.svelte';
	// import EmailSubscribe from '$lib/components/Email-Subscribe.svelte';

  // ### NOTE:
  // ### moved to static/
	// import '../app.css';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

	let
    /** */
    B_NAV_T: B_NAV_T,
    /** */
	  offlineMode: boolean = false,
    /** */
    OfflineAlertDynamic: any,
    /** */
    PlatformAlertDynamic: any,
    /** */
    EmailSubscribeDynamic: any,
    /** */
    isRouteCompetitions: boolean
  ;

	$: B_NAV_T = $page.data?.B_NAV_T ?? { };
  $: serverSideLang = platfrom_lang_ssr
  (
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);
  $: isRouteCompetitions = $page?.route?.id.includes('/[[lang=lang]]/[competitions=competitions]');
  $: isProfilePage = $page?.route?.id == '/u/[view]/[lang=lang]';

  $: console.log('🟥 isRouteCompetitions', isRouteCompetitions)
  $: console.log('🟥 isProfilePage', isProfilePage)

  $sessionStore.deviceType = $page.data?.deviceType;
  // @ts-ignore
  $sessionStore.fixturesTodayNum = parseInt(B_NAV_T?.scores_header_fixtures_information?.football)

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🔹 HELPER
   *
   * @description
   * 📌 method to `toggle` internet connection state.
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

  /**
   * @description
   * TODO: DOC:
   */
  function kickstartEventListen
  (
  ): void
  {
    // ### NOTE:
    // ### listen to changes in 'window.offline'.
    window.addEventListener
    (
			'offline',
			toggleOfflineAlert
		);

    // ### NOTE:
    // ### listen to changes in 'window.online'.
		window.addEventListener
    (
			'online',
			toggleOfflineAlert
		);
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @summary
   * 🔥 REACTIVE
   *
   * @description
   * TODO: DOC:
   */
	$: if (browser)
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ layout.svelte if_COD_1`,
      true
    );

		userBetarenaSettings.useLocalStorage();

    setUserGeoLocation
    (
      B_NAV_T
    );

    kickstartEventListen();
	}

  /**
   * @summary
   * 🔥 REACTIVE
   *
   * @description
   * 📌 listens to changes in platform language.
  */
  $: if (serverSideLang)
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ layout.svelte if_COD_2`,
      true
    );

    sessionStore.updateServerLang
    (
      serverSideLang
    );
  }

  /**
   * @summary
   * 🔥 REACTIVE
   *
   * @description
   * 📌 listens to change in platform `bookmaker geo-country`.
  */
  $: if ($userBetarenaSettings?.country_bookmaker)
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ layout.svelte if_COD_3`,
      true
    );

    initSportbookData
    (
      $userBetarenaSettings?.country_bookmaker
    );
  }

  /**
   * TODO: DOC:
  */
  // $: if (browser && (isRouteCompetitions || isProfilePage))
  // {
  //   const helpdesk: HTMLElement = document?.getElementsByClassName('crisp-client')?.[0] as unknown as HTMLElement;
  //   if (helpdesk != undefined)
  //     helpdesk.style.display = "unset";
  //   ;
  // }
  // else if (browser && !isRouteCompetitions && !isProfilePage)
  // {
  //   const helpdesk: HTMLElement = document?.getElementsByClassName('crisp-client')?.[0] as unknown as HTMLElement;
  //   if (helpdesk != undefined)
  //     helpdesk.style.display = "none";
  //   ;
  // }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @description
   * TODO: DOC:
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {
      initSentry();

      if (useDynamicImport)
      {
        OfflineAlertDynamic = (await import('$lib/components/Offline-Alert.svelte')).default;
        PlatformAlertDynamic = (await import('$lib/components/Platform-Alert.svelte')).default;
        EmailSubscribeDynamic = (await import('$lib/components/Email-Subscribe.svelte')).default;
      }
	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<svelte:head>
  <!--
  HELPDESK PLUGIN
  -->
  {#if isRouteCompetitions || isProfilePage}
    <script type="text/javascript">
      window.$crisp=[];
      window.CRISP_WEBSITE_ID="cb59b31a-b48f-42d5-a24b-e4cf5bac0222";
      (function()
      {
        d=document;
        s=d.createElement("script");
        s.src="https://client.crisp.chat/l.js";
        s.async=1;
        d.getElementsByTagName("head")[0].appendChild(s);
      }
      )();
    </script>
  {/if}
</svelte:head>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

<!-- <SplashScreen /> -->

{#if offlineMode}

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={OfflineAlertDynamic}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
	<!-- <OfflineAlert /> -->

{/if}

<!--
### NOTE:
### Dynamic Svelte Component Import
### WARNING:
### Disable, if Standard Import is Enabled.
-->
<svelte:component
  this={PlatformAlertDynamic}
/>

<!--
### NOTE:
### Standard Svelte Component Import
### WARNING:
### Disable, if Dynamic Import is Enabled.
-->
<!-- <PlatformAlert /> -->

<!--
### NOTE:
### Dynamic Svelte Component Import
### WARNING:
### Disable, if Standard Import is Enabled.
-->
<svelte:component
  this={EmailSubscribeDynamic}
/>

<!--
### NOTE:
### Standard Svelte Component Import
### WARNING:
### Disable, if Dynamic Import is Enabled.
-->
<!-- <EmailSubscribe /> -->

<Header />

<main
	class:dark-background={$userBetarenaSettings.theme == 'Dark'}
  class:before-display-none={isRouteCompetitions}
>

	<slot />

	<Footer />

</main>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

	main
  {
    /* 📌 position */
		position: relative;
		z-index: 0;
		margin: 0 auto;
    /* 🎨 style */
		width: 100%;
	}
	main::before
  {
    /* 📌 position */
		position: absolute;
		z-index: -1;
		top: -5px;
    /* 🎨 style */
		content: '';
		display: inline-block;
		width: 100%;
		height: 435px;
		background-image: url('/assets/svg/header-background.svg');
		background-repeat: no-repeat;
		background-size: cover;
		background-origin: border-box;
		background-position: top;
	}
  main.before-display-none::before
  {
    /* 🎨 style */
    display: none;
  }

	/*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media screen
  and (min-width: 768px)
  {
		main::before
    {
      /* 🎨 style */
			height: 495px;
		}
	}

	@media screen
  and (min-width: 1024px)
  {
    main
    {
      overflow: hidden;
    }
		main::before
    {
      /* 📌 position */
			top: calc(100vw / -5.5) !important;
      /* 🎨 style */
			height: 100%;
			background-size: contain !important;
		}
	}

</style>