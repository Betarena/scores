<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Code Format   // V.8.0                                                         │
│ ➤ Status        // 🔒 LOCKED                                                     │
│ ➤ Author(s)     // @migbash                                                      │
│ ➤ Maintainer(s) // @migbash                                                      │
│ ➤ Created on    // <date-created>                                                │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ BETARENA (Module)
│ |: Scores Main Layout Component
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import * as Sentry from '@sentry/sveltekit';

  import { post } from '$lib/api/utils.js';
  import
    {
      routeIdContent,
      routeIdPageCompetitions,
      routeIdPageProfile,
      routeIdPageProfileArticleCreation,
      routeIdPageProfileEditArticle,
      routeIdPageProfilePublication,
      routeIdScores,
    } from '$lib/constants/paths.js';
  import { scoresAdminStore } from '$lib/store/admin.js';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { dlog, dlogv2 } from '$lib/utils/debug';
  import { mainDeepLinkCheck } from '$lib/utils/deeplink.js';
  import { isPWA, viewportChangeV2 } from '$lib/utils/device.js';
  import { setUserGeoLocation } from '$lib/utils/geo.js';
  import { initializeTopLevelConsoleController } from '$lib/utils/subscribtion.js';

  import AuthMain from '$lib/components/_main_/auth/Widget.svelte';
  import FooterWidget from '$lib/components/_main_/footer/v2/Footer.Widget.svelte';
  import HeaderRedesigned from '$lib/components/_main_/header_redisigned/HeaderRedesigned.svelte';
  import MobileMenu from '$lib/components/_main_/mobile-menu/MobileMenu.svelte';
  import SplashScreen from '$lib/components/misc/Splash-Screen.svelte';
  import DevInfoBox from '$lib/components/misc/admin/Dev-Info-Box.svelte';
  import ModalError from '$lib/components/misc/modal/Modal-Error.svelte';
  import ModalMain from '$lib/components/misc/modal/ModalMain.svelte';
  import ToastAuth from '$lib/components/misc/toast/Toast-Auth/Toast-Auth.svelte';
  import InfoMessages from '$lib/components/ui/infomessages/InfoMessages.svelte';

  import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';

  // import '@betarena/ad-engine';
  // import WidgetAdEngine from '@betarena/ad-engine/src/lib/Widget-AdEngine.svelte';
  import WidgetAdEngine from '@betarena/ad-engine';

  // ╭─────
  // │ WARNING:
  // │ Disable, if Dynamic Import is Enabled.
  // ╰─────
  // import OfflineAlert from '$lib/components/Offline-Alert.svelte';
  // import PlatformAlert from '$lib/components/Platform-Alert.svelte';
  // import EmailSubscribe from '$lib/components/Email-Subscribe.svelte';

  // ╭─────
  // │ NOTE:
  // │ moved to static/
  // ╰─────
  // import '../app.css';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   *  📣 Component `Type`.
   */
  type IDynamicComponentMap =
    | 'OfflineAlertDynamic'
    | 'PlatformAlertDynamic'
    | 'EmailSubscribeDynamic'
  ;

  const
    /**
     * @description
     *  📣 Dynamic import variable condition
     */
    useDynamicImport = true,
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true],
    /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicComponentMap = new Map<IDynamicComponentMap, any>()
  ;

  $: ({ currentPageRouteId, currentActiveModal, currentActiveToast, globalState, serverLang } = { ...$sessionStore });
  $: ({ theme } = { ...$userBetarenaSettings });
  $: ({ username, lang, competition_number } = { ...$userBetarenaSettings.user?.scores_user_data });
  $: ({ uid, email } = { ...$userBetarenaSettings.user?.firebase_user_data });

  $: ispwa = globalState.has('IsPWA');

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: navbarTranslationData = ($page.data.B_NAV_T ?? {}) as
    | B_NAV_T
    | null
    | undefined
  ;
  $: deepReactListenStore1 = JSON.stringify($sessionStore);
  $: deepReactListenStore2 = JSON.stringify($userBetarenaSettings);

  $: $sessionStore.serverLang = $page.data.langParam as string;
  $: if (browser) $sessionStore.page = $page;
  $: isInitliazed = false;

  $: [VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1]]
    = viewportChangeV2
    (
      $sessionStore.windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0]
    )
  ;

  onMount(() => {
    $sessionStore.deviceType       = $page.data.deviceType as 'mobile' | 'tablet' | 'desktop';
    $sessionStore.fixturesTodayNum = navbarTranslationData?.scores_header_fixtures_information?.football ?? 0;
    $sessionStore.userAgent        = $page.data.userAgent as string ?? navigator.userAgent;
  })


  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @author
   *  @migbash
   * @summary
   *  [🐞]
   * @description
   *  📣 Debug Helper
   * @param reactDebug
   */
  function _DEBUG_
  (
    reactDebug: 'Option1' | 'Option2' | 'Option3' | 'Option4'
  ): void
  {
    const
      /**
       * @description
       */
      prefix: string = '🚏 checkpoint [R] ➤ src/routes/(scores)/layout.svelte'
    ;
    // [🐞]
    if (reactDebug == 'Option1')
      dlog(`${prefix} if_COD_1`, true);
    else if (reactDebug == 'Option2')
      dlog(`${prefix} if_COD_2`, true);
    else if (reactDebug == 'Option3')
      dlog(`${prefix} if_COD_3`, true);
    else
      dlog(`${prefix} if_R_CS43`, true);
    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Updates **Betarena User** for their `Firestore` and `CRISP` data.
   * @return { Promise < void > }
   */
  async function updateFirestoreAndCrisp
  (
  ): Promise < void >
  {
    if (!browser || $userBetarenaSettings.user == undefined)
      return;
    ;

    await post
    (
      `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}${import.meta.env.VITE_FIREBASE_FUNCTIONS_F_1}`,
      {
        user_uids: [$userBetarenaSettings.user.firebase_user_data?.uid],
      }
    );

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // ╭─────
  // │ > 🔥 Instant critical data initialization.
  // ╰─────
  $: if (browser && !isInitliazed)
  {
    _DEBUG_('Option1');
    isInitliazed = true;
    userBetarenaSettings.useLocalStorage(serverLang);
    scoresAdminStore.useLocalStorage();
    mainDeepLinkCheck();
  }

  // ╭─────
  // │ NOTE: CRITICAL
  // │ │: Hijack the 'console' object.
  // ╰─────
  $: if (browser && document)
    initializeTopLevelConsoleController();
  ;

  // ╭─────
  // │ > 🔥 (3rd Party) Intercom Logic [show/hide]
  // ╰─────
  // $: if (
  //   (browser && currentPageRouteId == "ProfilePage") ||
  //   currentPageRouteId == "CompetitionPage"
  // ) {
  //   const intercom: HTMLElement = document.getElementsByClassName(
  //     "intercom-lightweight-app"
  //   )[0] as unknown as HTMLElement;
  //   if (intercom != undefined) intercom.style.display = "unset";
  // } else if (browser && !currentPageRouteId) {
  //   const intercom: HTMLElement = document.getElementsByClassName(
  //     "intercom-lightweight-app"
  //   )[0] as unknown as HTMLElement;
  //   if (intercom != undefined) intercom.style.display = "none";
  // }
  $: if (browser && $page.route.id == routeIdPageProfile)
  {
    const
      /**
       * @description
       */
      intercom: HTMLElement = document.getElementsByClassName('intercom-lightweight-app')[0] as unknown as HTMLElement
    ;

    if (intercom != undefined)
      intercom.style.display = 'unset';
    ;
  }
  else if (browser)
  {
    const
      /**
       * @description
       */
      intercom: HTMLElement = document.getElementsByClassName('intercom-lightweight-app')[0] as unknown as HTMLElement
    ;

    if (intercom != undefined)
      intercom.style.display = 'none';
    ;
  }

  // ╭─────
  // │ > 🔥 (3rd Party) Intercom Data Persistance [show/hide]
  // ╰─────
  $: if (browser && (deepReactListenStore1 || deepReactListenStore2))
  {
    _DEBUG_('Option4');
    window.intercomSettings = {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'yz9qn6p3',
      name: username ?? '',
      email: email ?? `${uid}-unkown@gmail.com`,
      uid,
      lang: lang ?? 'en',
      competition_number: competition_number ?? 0,
    };

    // [🐞]
    Sentry.setContext
    (
      '📸 Data',
      {
        ...userBetarenaSettings.extractUserDataSnapshot(),
      }
    );
  }

  $: if (browser)
    window.Intercom
    (
      'update',
      {
        hide_default_launcher: currentPageRouteId != 'ProfilePage',
      }
    );
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // beforeNavigate
  // (
  //   async (): Promise<void> =>
  //   {
  //     if (!browser) return;

  //     // ╭─────
  //     // │ NOTE: IMPORTANT
  //     // │ |: Resetting the `live_odds_fixture_target` to `null`.
  //     // ╰─────
  //     $sessionStore.live_odds_fixture_target = null;

  //     /*
  //       await firebaseAppDelete();
  //       for (const iterator of $sessionStore?.firebaseListeners ?? [])
  //         iterator();
  //       $sessionStore.firebaseListeners = []
  //       for (const iterator of $sessionStore?.grapqhQlWebSockets ?? [])
  //         iterator();
  //       $sessionStore.grapqhQlWebSockets = []
  //     */

  //     return;
  //   }
  // );

  onMount
  (
    async (
    ): Promise < void > =>
    {
      // initSentry();

      // ╭─────
      // │ NOTE:
      // │ |: Dynamic Import Logic
      // ╰─────
      if (useDynamicImport)
      {
        dynamicComponentMap.set
        (
          'OfflineAlertDynamic',
          (
            await import
            (
              '$lib/components/misc/banner/Banner-Offline-Alert.svelte'
            )
          ).default
        );

        dynamicComponentMap.set
        (
          'PlatformAlertDynamic',
          (
            await import
            (
              '$lib/components/misc/banner/Banner-Offline-Alert.svelte'
            )
          ).default
        );

        dynamicComponentMap.set
        (
          'EmailSubscribeDynamic',
          (
            await import
            (
              '$lib/components/misc/modal/Modal-Email-Subscribe.svelte'
            )
          ).default
        );
      }

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ ➤ |: Set initial values of 'windowWidth'.
      // ╰─────
      sessionStore.updateData
      (
        [
          [
            'windowWidth', document.documentElement.clientWidth
          ]
        ]
      );

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: Check if the current device is a PWA.
      // ╰─────
      if (isPWA())
        $sessionStore.globalState.add('IsPWA');
      else
        $sessionStore.globalState.delete('IsPWA');
      ;

      setUserGeoLocation(navbarTranslationData!);

      const
        /**
         * @description
         */
        adminSet = $page.url.searchParams.get('admin')
      ;

      if (adminSet)
        scoresAdminStore.toggleAdminState(adminSet == 'true' ? true : false);
      ;

      return;
    }
  );

  onMount
  (
    () =>
    {
      if ('serviceWorker' in navigator)
        navigator.serviceWorker
          .register('/progressier.js')
          .then
          (
            (
              registration
            ) =>
            {
              // [🐞]
              // eslint-disable-next-line no-console
              console.log
              (
                'Service Worker registered with scope:',
                registration.scope
              );
            }
          )
          .catch
          (
            (
              error
            ) =>
            {
              // [🐞]
              // eslint-disable-next-line no-console
              console.error
              (
                'Service Worker registration failed:',
                error
              );
            }
          );
      ;
    }
  );

  afterNavigate
  (
    async (
      e
    ): Promise < void > =>
    {
      if (!browser) return;

      sessionStore.updateData
      (
        [
          [
            'routeId', $page.route.id
          ]
        ]
      );

      // [🐞]
      dlogv2
      (
        '🚏 checkpoint ➤ src/routes/+layout.svelte afterNavigate(..)',
        [`🔹 [var] ➤ e.from :|: ${JSON.stringify(e)}`],
        true
      );

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💉 Svelte Injection Tags                                                         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<svelte:head>
  <!--
  HELPDESK PLUGIN
  -->

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
    </!-->
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
    </!-->
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
    </!-->

  <script>
    // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/yz9qn6p3'
    (function () {
      var w = window;
      var ic = w.Intercom;
      if (typeof ic === "function") {
        ic("reattach_activator");
        ic("update", w.intercomSettings);
      } else {
        var d = document;
        var i = function () {
          i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
          i.q.push(args);
        };
        w.Intercom = i;
        var l = function () {
          var s = d.createElement("script");
          s.type = "text/javascript";
          s.async = true;
          s.src = "https://widget.intercom.io/widget/yz9qn6p3";
          var x = d.getElementsByTagName("script")[0];
          x.parentNode.insertBefore(s, x);
        };
        if (document.readyState === "complete") {
          l();
        } else if (w.attachEvent) {
          w.attachEvent("onload", l);
        } else {
          w.addEventListener("load", l, false);
        }
      }
    })();
  </script>
</svelte:head>

<svelte:document
  on:visibilitychange=
  {
    () =>
    {
      if (!document.hidden)
      {
        // [🐞]
        dlog('🔵 user is active', true);
        $sessionStore.isUserActive = true;
        updateFirestoreAndCrisp();
        return;
      }
      $sessionStore.isUserActive = false;
      return;
    }
  }
/>

<svelte:window
  on:resize=
  {
    () =>
    {
      sessionStore.updateData
      (
        [
          [
            'windowWidth',
            document.documentElement.clientWidth
          ],
        ]
      );
      if (isPWA())
        $sessionStore.globalState.add('IsPWA');
      else
        $sessionStore.globalState.delete('IsPWA');
      return;
    }
  }
/>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  class="app-wrapper"
  id="app-root-layout"
  class:dark-mode={theme == 'Dark'}
  class:light-mode={theme == 'Light'}
  class:page-content={$page.route.id === routeIdContent}
  data-page-id={currentPageRouteId}
  data-mode={ispwa ? 'pwa' : 'web'}
>
  {#key $page.route.id}
    <WidgetAdEngine
      authorId={$page.data.dataArticle?.author?.id}
      authorArticleTagIds={$page.data.dataArticle?.article?.tags}
      isDarkTheme={theme == 'Dark'}
      strTranslationTarget={lang ?? 'en'}
    />
  {/key}

  <SplashScreen />

  {#if currentActiveModal == 'Auth_Modal'}
    <AuthMain />
  {/if}

  {#if currentActiveToast != null}
    <ToastAuth />
  {/if}

  {#if $scoresAdminStore.admin}
    <DevInfoBox />
  {/if}

  {#if currentActiveModal == 'GeneralPlatform_Error'}
    <ModalError />
  {/if}

  {#if useDynamicImport}
    <svelte:component this={dynamicComponentMap.get('OfflineAlertDynamic')} />
  {:else}
    <!-- <OfflineAlert /> -->
  {/if}

  {#if useDynamicImport}
    <svelte:component this={dynamicComponentMap.get('PlatformAlertDynamic')} />
  {:else}
    <!-- <PlatformAlert /> -->
  {/if}

  {#if useDynamicImport}
    <svelte:component this={dynamicComponentMap.get('EmailSubscribeDynamic')} />
  {:else}
    <!-- <EmailSubscribe /> -->
  {/if}

  {#if ![routeIdPageProfileArticleCreation, routeIdPageProfileEditArticle].includes($page.route.id )}
     <HeaderRedesigned />
  {/if}

  <main
    class:dark-background={theme == 'Dark'}
    class:dark-mode={theme == 'Dark'}
    class:light-mode={theme == 'Light'}
    class:standard={currentPageRouteId == null }
    class:page-competition={currentPageRouteId == 'CompetitionPage'}
    class:page-profile={currentPageRouteId == 'ProfilePage'}
    class:page-authors={currentPageRouteId == 'AuthorsPage' || currentPageRouteId == "Standard"}
    class:page-content={$page.route.id === routeIdContent}
    class:mobile={VIEWPORT_MOBILE_INIT[1]}
    class:tablet={VIEWPORT_TABLET_INIT[1]}
  >
    <slot />
    {#if (!ispwa && ![routeIdPageProfileArticleCreation, routeIdPageProfileEditArticle].includes($page.route.id || '')) || [routeIdPageProfile, routeIdPageProfilePublication].includes($page.route.id || '')}
      <FooterWidget />
    {/if}
  </main>

  {#if (VIEWPORT_MOBILE_INIT[1] || VIEWPORT_TABLET_INIT[1]) && [routeIdScores, routeIdPageCompetitions, routeIdContent].includes($page.route.id || '')}
    <MobileMenu
      mobile={VIEWPORT_MOBILE_INIT[1]}
      tablet={VIEWPORT_TABLET_INIT[1]}
    />
  {/if}

  <InfoMessages />

  <ModalMain />
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  [data-page-id="AuthorsPage"][data-mode="pwa"] {
    background-color: var(--bg-color);
  }

  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    &.page-content {
      background-color: var(--bg-color);
    }

    &[data-page-id="Standard"],
    &[data-page-id="CompetitionPage"] {
      background-color: red;
      &.light-mode {
        background-color: var(--whitev2);
      }
    }
  }

  main {
    /* 📌 position */
    position: relative;
    z-index: 0;
    margin: 0 auto;
    flex-grow: 1;
    /* 🎨 style */
    width: 100%;
    max-width: 100%;

    &.standard {
      &::before {
        /* 📌 position */
        position: absolute;
        z-index: -1;
        top: -5px;
        /* 🎨 style */
        content: "";
        display: inline-block;
        width: 100%;
        height: 435px;
        background-image: url("/assets/svg/header-background.svg");
        background-repeat: no-repeat;
        background-size: cover;
        background-origin: border-box;
        background-position: top;
      }
    }

    &.page-competition::before {
      /* 🎨 style */
      display: none;
    }

    &.page-profile::before {
      /* 🎨 style */
      height: 611px;
    }

    &.page-content {
      display: flex;
      overflow: visible;
      justify-content: space-between;
      max-width: 1265px;
      width: 100%;
      margin: auto;
      padding: 26px 34px;
      padding-top: 32px;
      gap: 34px;

      &.tablet {
        flex-direction: column;
        gap: 0;
        overflow: hidden;
        padding: 0;
      }
      &.mobile {
        padding: 0;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media screen and (min-width: 768px) {
    main {
      &.standard {
        &::before {
          /* 🎨 style */
          height: 495px;
        }
      }

      &.page-profile::before {
        /* 🎨 style */
        height: 611px;
      }
    }
  }

  @media screen and (min-width: 1024px) {
    main {
      /* 🎨 style */
      overflow: hidden;

      &.standard {
        &::before {
          /* 📌 position */
          top: calc(100vw / -5.5) !important;
          /* 🎨 style */
          height: 100%;
          background-size: contain !important;
        }
      }

      &.page-profile {
        /* 🎨 style */
        overflow: visible;
      }

      &.page-profile::before {
        /* 🎨 style */
        top: 0 !important;
        height: 10%; /*  939px :: 25% */
        background-size: cover !important;
      }
    }
  }

</style>
