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
  import * as Sentry from '@sentry/sveltekit';
  import { onDestroy, onMount } from 'svelte';

  import {
    routeIdContent,
    routeIdLogin,
    routeIdPageProfile,
    routeIdPageProfileArticleCreation,
    routeIdPageProfileEditArticle,
    routeIdPageProfilePublication,
    routeIdRegister,
    routeIdSearch
  } from '$lib/constants/paths.js';
  import { scoresAdminStore } from '$lib/store/admin.js';
  import { delCookie } from '$lib/store/cookie.js';
  import sessionStore from '$lib/store/session.js';
  import { initiateSubscribtions } from '$lib/store/subscribtions.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { dlogv2 } from '$lib/utils/debug';
  import { mainDeepLinkCheck } from '$lib/utils/deeplink.js';
  import { isPWA, viewportChangeV2 } from '$lib/utils/device.js';
  import { setUserGeoLocation } from '$lib/utils/geo.js';
  import { parseObject } from '$lib/utils/string.2.js';
  import { initializeTopLevelConsoleController } from '$lib/utils/subscribtion.js';

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
  import AndroidPwaBanner from '$lib/components/AndroidPWABanner.svelte';
  import { loginStore } from '$lib/components/section/login/login-store';
  import { auth } from '$lib/firebase/init';
  import history_store from '$lib/store/history.js';
  import { gotoSW } from '$lib/utils/sveltekitWrapper';
  import WidgetAdEngine from '@betarena/ad-engine';

  // ╭─────
  // │ WARNING:
  // │ |: Disable, if Dynamic Import is Enabled.
  // ╰─────
  // import OfflineAlert from '$lib/components/Offline-Alert.svelte';
  // import PlatformAlert from '$lib/components/Platform-Alert.svelte';
  // import EmailSubscribe from '$lib/components/Email-Subscribe.svelte';

  // ╭─────
  // │ NOTE:
  // │ |: moved to static/
  // ╰─────
  // import '../app.css';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 TYPES

  /**
   * @description
   *  📣 Component `Type`.
   */
   type IDynamicComponentMap =
    | 'OfflineAlertDynamic'
    | 'PlatformAlertDynamic'
    | 'EmailSubscribeDynamic'
  ;

  // #endregion ➤ 📌 TYPES

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

  const
    /**
     * @description
     * 📝 (required) component state object
     */
    objComponentStandardState
      = {
        /**
         * @description
         * 📝 Holds target `component(s)` of viewport configuration.
         */
        viewport:
          {
            mobile:
            {
              threshold: 575,
              state: true,
            },
            tablet:
            {
              threshold: 1160,
              state: true,
            }
          },
        /**
         * @description
         * 📝 Holds target `component(s)` of dynamic nature.
         */
        mapStrDebugPreifix: new Map
          <
            'beforeNavigate' | 'afterNavigate',
            string
          >
          (
            [
              [ 'beforeNavigate', '🚏 checkpoint ➤ src/routes/+layout.svelte beforeNavigate(..)' ],
              [ 'afterNavigate', '🚏 checkpoint ➤ src/routes/+layout.svelte afterNavigate(..)' ]
            ]
          ),
        /**
         * @description
         * 📝 Holds target `component(s)` of dynamic nature.
         */
        isDynamicImport: true,
        /**
         * @description
         *  📝 Holds target `component(s)` of dynamic nature.
         */
        mapComponentDynamicLoading: new Map < IDynamicComponentMap, any >()
      }
  ;
  /**
   * @description
   *  📝 Page unsubscribe to remove inside onDestroy.
   */
  let page_unsub: () => void;

  $: ({ currentPageRouteId, currentActiveModal, currentActiveToast, globalState, serverLang } = { ...$sessionStore });
  $: ({ theme } = { ...$userBetarenaSettings });
  $: ({ username, lang, competition_number, verified } = { ...$userBetarenaSettings.user?.scores_user_data });
  $: ({ uid, email } = { ...$userBetarenaSettings.user?.firebase_user_data });
  $: ({ route: { id: pageRouteId } } = $page);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: navbarTranslationData = ($page.data.B_NAV_T ?? {}) as
    | B_NAV_T
    | null
    | undefined
  ;
  $: deepReactListenStore1 = parseObject($sessionStore);
  $: deepReactListenStore2 = parseObject($userBetarenaSettings);

  $: $sessionStore.serverLang = $page.data.langParam as string;
  $: if (browser) $sessionStore.page = $page;
  $: isInitliazed = false;
  $: isInitializationFinished = false;

  $: [ objComponentStandardState.viewport.mobile.state, objComponentStandardState.viewport.tablet.state]
    = viewportChangeV2
    (
      $sessionStore.windowWidth,
      objComponentStandardState.viewport.mobile.threshold,
      objComponentStandardState.viewport.tablet.threshold
    )
  ;

  $sessionStore.deviceType = $page.data.deviceType as 'mobile' | 'tablet' | 'desktop';
  $sessionStore.userAgent  = $page.data.userAgent as string ?? navigator.userAgent;

  $: console.log("USER: ", $userBetarenaSettings.user, auth.currentUser)
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   */
  async function herlperPreMountInitialize
  (
  ): Promise < void >
  {
    isInitliazed = true;
    userBetarenaSettings.useLocalStorage(serverLang);
    scoresAdminStore.useLocalStorage();
    await mainDeepLinkCheck();
    isInitializationFinished= true
    return;
  }

  async function redirectToOnBoard(register = true) {
    const lang = $userBetarenaSettings.lang || $page.params.lang ;
    let path = "";
    if(lang && lang !== "en") {
      path += `/${lang}`
    }
    path += register ? "/register" : "/login";
    if(register && uid) {
      $loginStore.isExistedUser = true;
    }
    await gotoSW(path);
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
  // │ NOTE: IMPORTANT CRITICAL
  // │ │: [instant] [once]
  // │ │: Instant critical data initialization.
  // ╰─────
  $: if (browser && !isInitliazed)
    herlperPreMountInitialize();
  ;

  // ╭─────
  // │ NOTE: IMPORTANT CRITICAL
  // │ │: Hijack the 'console' object.
  // ╰─────
  $: if (browser && document)
    initializeTopLevelConsoleController();
  ;

  // ╭─────
  // │ NOTE: IMPORTANT CRITICAL
  // │ |: [3rd-party] Intercom Logic [show/hide]
  // ╰─────
  $: if (browser && pageRouteId == routeIdPageProfile)
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
       * 📝 HTLMElement instance of 'Intercom'
       */
      instanceIntercom = document.getElementsByClassName('intercom-lightweight-app')[0] as unknown as HTMLElement
    ;

    if (instanceIntercom)
      instanceIntercom.style.display = 'none';
    ;
  }

  // ╭─────
  // │ NOTE: IMPORTANT CRITICAL
  // │ |: [3rd-party] Intercom Data Persistance
  // ╰─────
  $: if (browser && (deepReactListenStore1 || deepReactListenStore2))
  {
    const intercomSettings
      = {
        api_base: 'https://api-iam.intercom.io',
        app_id: 'yz9qn6p3',
        name: username ?? '',
        email: email ?? `${uid}-unkown@gmail.com`,
        uid,
        lang: lang ?? 'en',
        competition_number: competition_number ?? 0,
      }
    ;
    window.intercomSettings = intercomSettings
    window.Intercom?.("boot", {
      ...intercomSettings,
      hide_default_launcher: true
    });

    page_unsub = page.subscribe(() => {
      window.Intercom?.('update', {
        hide_default_launcher: $sessionStore.currentPageRouteId !== "ProfilePage",
        last_request_at: Math.floor(Date.now() / 1000)
      })
    })
    // [🐞]
    Sentry.setContext
    (
      '📸 Data',
      {
        ...userBetarenaSettings.extractUserDataSnapshot(),
      }
    );
  }

  $: if (currentActiveModal === "Auth_Modal"&& ![routeIdLogin, routeIdRegister].includes(pageRouteId|| "")) {
    redirectToOnBoard(false);
  }


  $: if(![routeIdLogin, routeIdRegister].includes(pageRouteId|| "") && uid && !verified && isInitializationFinished) {
    redirectToOnBoard();
  }

  $: if (browser){
    // eslint-disable-next-line new-cap
    window.Intercom
    (
      'update',
      {
        hide_default_launcher: currentPageRouteId != 'ProfilePage',
      }
    );
    updateVh();
    window?.visualViewport?.addEventListener('resize', updateVh);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onDestroy(() => {
    if (!browser) return
    window?.visualViewport?.removeEventListener('resize', updateVh);
    page_unsub?.();
  })
  
  onMount
  (
    async (
    ): Promise < void > =>
    {

      // ╭─────
      // │ IMPORTANT CRITICAL
      // ╰─────
      initiateSubscribtions();

      if ('serviceWorker' in navigator)
        navigator.serviceWorker
          .register
          (
            '/progressier.js'
          )
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
          )
        ;
      ;

      // ╭─────
      // │ NOTE:
      // │ |: Dynamic Import Logic
      // ╰─────
      if (objComponentStandardState.isDynamicImport)
      {
        objComponentStandardState.mapComponentDynamicLoading.set
        (
          'OfflineAlertDynamic',
          (
            await import
            (
              '$lib/components/misc/banner/Banner-Offline-Alert.svelte'
            )
          ).default
        );

        objComponentStandardState.mapComponentDynamicLoading.set
        (
          'PlatformAlertDynamic',
          (
            await import
            (
              '$lib/components/misc/banner/Banner-Platform-Alert.svelte'
            )
          ).default
        );

        objComponentStandardState.mapComponentDynamicLoading.set
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
      // │ |: Set initial values of 'windowWidth'.
      // ╰─────
      sessionStore.updateData
      (
        [
          ['windowWidth', document.documentElement.clientWidth]
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

  beforeNavigate
  (
    async (
      _event
    ): Promise < void > =>
    {
      if (!browser) return;

      // [🐞]
      dlogv2
      (
        `${objComponentStandardState.mapStrDebugPreifix.get('beforeNavigate')} // START`,
        [
          `🔹 [var] ➤ _event :: ${JSON.stringify(_event)}`
        ]
      );

      if ($page.data.setState?.has('IsAnonymousNewBurner'))
      {
        // [🐞]
        dlogv2
        (
          `${objComponentStandardState.mapStrDebugPreifix.get('beforeNavigate')} // IsAnonymousNewBurner`,
          []
        );

        delCookie
        (
          'betarenaScoresCookie'
        );
      }

      return;
    }
  );


  beforeNavigate(({from}) => {
    if (!from) return;
    const {url} = from;
    $history_store.push(url.pathname);
  })

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
          ['routeId', pageRouteId]
        ]
      );

      // [🐞]
      dlogv2
      (
        '🚏 checkpoint ➤ src/routes/+layout.svelte afterNavigate(..)',
        [
          `🔹 [var] ➤ e.from :|: ${JSON.stringify(e)}`
        ]
      );

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

  function updateVh() {
    if (!browser) return;
    const vh = (window?.visualViewport?.height || window?.innerHeight) * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
  }

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💉 Svelte Injection Tags                                                         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<svelte:head>
  {#if theme === "Dark"}
  <meta
    name="theme-color"
    content="#1f1f1f"
    />
  {:else}
    <meta
      name="theme-color"
      content="#ffffff" />
  {/if}

  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  <script async src="//www.instagram.com/embed.js"></script>
  <script>
    // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/yz9qn6p3'
    (
      function ()
      {
        var w = window;
        var ic = w.Intercom;
        if (typeof ic === "function")
        {
          ic("reattach_activator");
          ic("update", w.intercomSettings);
        }
        else
        {
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
      }
    )();
  </script>
</svelte:head>

<svelte:document
  on:visibilitychange=
  {
    () =>
    {
      if (!document.hidden)
      {
        $sessionStore.isUserActive = true;
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
          ['windowWidth', document.documentElement.clientWidth],
        ]
      );

      if (isPWA())
        $sessionStore.globalState.add('IsPWA');
      else
        $sessionStore.globalState.delete('IsPWA');
      ;

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
  class:page-content={[routeIdContent, routeIdSearch].includes(pageRouteId || "")}
  data-page-id={currentPageRouteId}
  data-mode={globalState.has('IsPWA') ? 'pwa' : 'web'}
>
  {#key pageRouteId}
    <WidgetAdEngine
      authorId={$page.data.dataArticle?.author?.id}
      authorArticleTagIds={$page.data.dataArticle?.article?.tags}
      isDarkTheme={theme == 'Dark'}
      strTranslationTarget={lang ?? 'en'}
    />
  {/key}

  <SplashScreen />
<!--
  {#if currentActiveModal == 'Auth_Modal'}
    <AuthMain />
  {/if} -->

  {#if currentActiveToast != null}
    <ToastAuth />
  {/if}

  {#if $scoresAdminStore.admin}
    <DevInfoBox />
  {/if}

  {#if currentActiveModal == 'GeneralPlatform_Error'}
    <ModalError />
  {/if}

  {#if objComponentStandardState.isDynamicImport}
    <svelte:component
      this={objComponentStandardState.mapComponentDynamicLoading.get('OfflineAlertDynamic')}
    />
  {:else}
    <!-- <OfflineAlert /> -->
  {/if}

  {#if objComponentStandardState.isDynamicImport}
    <svelte:component
      this={objComponentStandardState.mapComponentDynamicLoading.get('PlatformAlertDynamic')}
    />
  {:else}
    <!-- <PlatformAlert /> -->
  {/if}

  {#if objComponentStandardState.isDynamicImport}
    <svelte:component
      this={objComponentStandardState.mapComponentDynamicLoading.get('EmailSubscribeDynamic')}
    />
  {:else}
    <!-- <EmailSubscribe /> -->
  {/if}

  {#if ![routeIdPageProfileArticleCreation, routeIdPageProfileEditArticle, routeIdSearch, routeIdLogin, routeIdRegister].includes(pageRouteId || "" ) || (pageRouteId === routeIdSearch && $sessionStore.viewportType !== "mobile") }
    <HeaderRedesigned />
  {/if}

  <main
    class:dark-mode={theme == 'Dark'}
    class:light-mode={theme == 'Light'}
    class:standard={currentPageRouteId == null }
    class:page-profile={currentPageRouteId == 'ProfilePage'}
    class:page-authors={currentPageRouteId == 'AuthorsPage' || currentPageRouteId == 'Standard' || pageRouteId === routeIdSearch }
    class:page-content={[routeIdContent, routeIdSearch].includes(pageRouteId || "")}
    class:mobile={objComponentStandardState.viewport.mobile.state}
    class:tablet={objComponentStandardState.viewport.tablet.state}
  >
    <slot />

    {#if
      (
        !globalState.has('IsPWA')
        && ![routeIdPageProfileArticleCreation, routeIdPageProfileEditArticle, routeIdLogin, routeIdRegister].includes(pageRouteId || '')
      )
      || [routeIdPageProfile, routeIdPageProfilePublication].includes(pageRouteId || '')
    }
      <FooterWidget />
    {/if}

  </main>
  <InfoMessages />
  <ModalMain />

  {#if
    (objComponentStandardState.viewport.mobile.state || objComponentStandardState.viewport.tablet.state)
    && ![routeIdSearch, routeIdPageProfile, routeIdPageProfileEditArticle, routeIdPageProfileArticleCreation, routeIdLogin, routeIdRegister].includes(pageRouteId || '')
  }
    <MobileMenu
      mobile={objComponentStandardState.viewport.mobile.state}
      tablet={objComponentStandardState.viewport.tablet.state}
    />
  {/if}


</div>

<AndroidPwaBanner />
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
    background-color: var(--colors-background-bg-primary);
  }

  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: calc(var(--vh)*100);
    &.page-content {
      background-color: var(--colors-background-bg-primary);
    }

    &[data-page-id="Standard"],
    &[data-page-id="CompetitionPage"] {
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
    background: var(--colors-background-bg-primary);

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
