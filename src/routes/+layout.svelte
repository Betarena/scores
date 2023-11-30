<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

  import { post } from '$lib/api/utils.js';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { dlog } from '$lib/utils/debug';
  import { initSportbookData, platfrom_lang_ssr, setUserGeoLocation } from '$lib/utils/platform-functions.js';
  import * as Sentry from '@sentry/sveltekit';

	import Footer from '$lib/components/_main_/footer/Footer.svelte';
	import Header from '$lib/components/_main_/header/Header.svelte';

	import DevInfoBox from '$lib/components/misc/Dev-Info-Box.svelte';
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

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true,
    /** @description */
    targetAppEnv: string = import.meta.env?.VITE_ENV_TARGET
  ;

	let
    /** @description TODO: DOC: */
    B_NAV_T: B_NAV_T,
    /** @description TODO: DOC: */
	  offlineMode: boolean = false,
    /** @description TODO: DOC: */
    OfflineAlertDynamic: any,
    /** @description TODO: DOC: */
    PlatformAlertDynamic: any,
    /** @description TODO: DOC: */
    EmailSubscribeDynamic: any,
    /** @description TODO: DOC: */
    deepReactListenIsRouteCompetitions: boolean,
    /** @description (listen) value for change comparison of client bookmaker change */
    currentBookmaker: string = $sessionStore?.serverLang
  ;

	$: B_NAV_T = $page.data?.B_NAV_T ?? { };
  $: deepReactListenServerSideLang = platfrom_lang_ssr
  (
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);
  $: deepReactListenIsRouteCompetitions = $page?.route?.id?.includes('/[[lang=lang]]/[competitions=competitions]');
  $: deepReactListenIsProfilePage = $page?.route?.id == '/u/[view]/[lang=lang]';
  $: deepReactListenBookmakerChng = $userBetarenaSettings?.country_bookmaker;

  $sessionStore.deviceType = $page.data?.deviceType;
  // @ts-ignore
  $sessionStore.fixturesTodayNum = parseInt(B_NAV_T?.scores_header_fixtures_information?.football)

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'methods' that are to be     ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. function (..)                                                 ◼️
  // ### 2. async function (..)                                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 method to `toggle` internet connection state.
   */
	function toggleOfflineAlert
  (
  ): void
  {
		offlineMode = !offlineMode;
    // ### [🐞]
		dlog
    (
			'🔴 your internet connection has changed!',
			true
		);
	}

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 Kickstart `_this_` page event listeners.
   * @returns { void }
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

    // ### NOTE:
    // ### listen to changes in 'document.visibility'.
    document.addEventListener
    (
      'visibilitychange',
      async function
      (
      ): Promise < void >
      {
        if (!document.hidden)
        {
          dlog('🔵 user is active', true)
          updateFirestoreAndCrisp();
        }
      }
    );
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 Updates **Betarena User** for their `Firestore` and `CRISP` data.
   * @returns { Promise < void > }
  */
  async function updateFirestoreAndCrisp
  (
  ): Promise < void >
  {
    if (!browser || $userBetarenaSettings?.user == undefined) return;

    await post
    (
      `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}${import.meta.env.VITE_FIREBASE_FUNCTIONS_F_1}`,
      {
        user_uids: [$userBetarenaSettings?.user?.firebase_user_data?.uid]
      }
    );
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _initial platform load_ has changed to `client`.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `browser`- **kicker**
   */
	$: if (browser)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ src/layout.svelte if_COD_1`,
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
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _initial platform language_ has changed.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `deepReactListenServerSideLang`- **kicker** (via deepListen)
   */
  $: if (deepReactListenServerSideLang)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ src/layout.svelte if_COD_2`,
      true
    );

    sessionStore.updateServerLang
    (
      deepReactListenServerSideLang
    );
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _platform bookmaker_ changes.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `deepReactListenServerSideLang`- **kicker** (via deepListen)
   */
  $: if_COD_3 =
    browser
  ;
  $: if (if_COD_3 && deepReactListenBookmakerChng != currentBookmaker)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ src/layout.svelte if_COD_3`,
      true
    );

    initSportbookData
    (
      $userBetarenaSettings?.country_bookmaker
    );
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _route / endpoint_ changes.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `browser`- **kicker**
   *  - `deepReactListenIsRouteCompetitions`- **kicker** (via deepListen)
   *  - `deepReactListenIsProfilePage`- **kicker** (via deepListen)
   */
  $: if (browser && (deepReactListenIsRouteCompetitions || deepReactListenIsProfilePage))
  {
    const intercom: HTMLElement = document?.getElementsByClassName('intercom-lightweight-app')?.[0] as unknown as HTMLElement;
    if (intercom != undefined)
      intercom.style.display = "unset";
    ;
  }
  else if (browser && !deepReactListenIsRouteCompetitions && !deepReactListenIsProfilePage)
  {
    const intercom: HTMLElement = document?.getElementsByClassName('intercom-lightweight-app')?.[0] as unknown as HTMLElement;
    if (intercom != undefined)
      intercom.style.display = "none";
    ;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _stores_ data changes.
   * @description
   *  **WARNING:**
   *  **triggered by changes in:**
   *  - `browser`- **kicker**
   *  - `$userBetarenaSettings`- **kicker**
   *  - `$sessionStore`- **kicker**
  */
  $: if (browser && ($userBetarenaSettings || $sessionStore))
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ src/layout.svelte if_R_CS43`,
      true
    );

    window.intercomSettings =
    {
      api_base: "https://api-iam.intercom.io"
      , app_id: "yz9qn6p3"
      , name: $userBetarenaSettings?.user?.scores_user_data?.username
      , email: $userBetarenaSettings?.user?.firebase_user_data?.email ?? `${$userBetarenaSettings?.user?.firebase_user_data?.uid}-unkown@gmail.com`
      , uid: $userBetarenaSettings?.user?.firebase_user_data?.uid
      , lang: $userBetarenaSettings?.user?.scores_user_data?.lang
      // , created_at: new Date().getTime()?.toString()
      , competition_number: $userBetarenaSettings?.user?.scores_user_data?.competition_number
    };

    // ### [🐞]
    Sentry.setContext
    (
      "📸 Data",
      {
        ...userBetarenaSettings.extractUserDataSnapshot()
      }
    );
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    async (
    ): Promise < void > =>
    {
      // initSentry();

      if (useDynamicImport)
      {
        OfflineAlertDynamic = (await import('$lib/components/Offline-Alert.svelte')).default;
        PlatformAlertDynamic = (await import('$lib/components/Platform-Alert.svelte')).default;
        EmailSubscribeDynamic = (await import('$lib/components/Email-Subscribe.svelte')).default;
      }
	  }
  );

  beforeNavigate
  (
    async (
    ): Promise < void > =>
    {
      // ▓▓ IMPORTANT
      $sessionStore.live_odds_fixture_target = null;

      // await firebaseAppDelete();

      // for (const iterator of $sessionStore?.firebaseListeners ?? [])
      //   iterator();
      // //
      // $sessionStore.firebaseListeners = []

      // for (const iterator of $sessionStore?.grapqhQlWebSockets ?? [])
      //   iterator();
      // //
      // $sessionStore.grapqhQlWebSockets = []
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### SVELTE INJECTION TAGS                                                              ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<svelte:head>
  <!--
  HELPDESK PLUGIN
  -->
  {#if deepReactListenIsRouteCompetitions || deepReactListenIsProfilePage}
    <!-- <script type="text/javascript">
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
    </script> -->
    <script>
      // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/yz9qn6p3'
      (
        function()
        {
          var w=window;
          var ic=w.Intercom;
          if (typeof ic==="function")
          {
            ic('reattach_activator');
            ic('update',w.intercomSettings);
          }
          else
          {
            var d=document;
            var i=function()
            {
              i.c(arguments);
            };
            i.q=[];
            i.c=function(args)
            {
              i.q.push(args);
            };
            w.Intercom=i;
            var l=function()
            {
              var s=d.createElement('script');
              s.type='text/javascript';
              s.async=true;
              s.src='https://widget.intercom.io/widget/yz9qn6p3';
              var x=d.getElementsByTagName('script')[0];
              x.parentNode.insertBefore(s,x);
            };
            if (document.readyState==='complete')
            {
              l();
            }
            else if ( w.attachEvent )
            {
              w.attachEvent('onload',l);
            }
            else
            {
              w.addEventListener('load',l,false);
            }
          }
        }
      )();
    </script>
  {/if}
</svelte:head>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class=styles                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!-- <SplashScreen /> -->

{#if targetAppEnv == '.env.local'}
  <DevInfoBox />
{/if}

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
<!-- <EmailSubscribe /> -->

<Header />

<main
	class:dark-background={$userBetarenaSettings.theme == 'Dark'}
  class:before-display-none={deepReactListenIsRouteCompetitions}
  class:profile-page={deepReactListenIsProfilePage}
>

	<slot />

	<Footer />

</main>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

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
  main.profile-page::before
  {
    /* 🎨 style */
		height: 611px;
  }

	/*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	@media screen
  and (min-width: 768px)
  {
		main::before
    {
      /* 🎨 style */
			height: 495px;
    }

    main.profile-page::before
    {
      /* 🎨 style */
			height: 611px;
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
    main.profile-page::before
    {
      /* 🎨 style */
      top: 0 !important;
      height: 35%; /*  939px :: 25% */
      background-size: cover !important;
    }
	}

</style>