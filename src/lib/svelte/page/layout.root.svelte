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
  import { logoutUser } from '$lib/utils/user.js';
  import { partytownSnippet } from '@qwik.dev/partytown/integration';
  import { onDestroy, onMount } from 'svelte';

  import { loginStore } from '$lib/components/section/login/login-store';
  import { config } from '$lib/constants/config.js';
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
  import history_store from '$lib/store/history.js';
  import sessionStore from '$lib/store/session.js';
  import { initiateSubscribtions } from '$lib/store/subscribtions.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { initWalletStore } from '$lib/store/wallets';
  import { Browser } from '$lib/utils/browser.js';
  import { dlogv2, log_v3 } from '$lib/utils/debug';
  import { isPWA, viewportChangeV2 } from '$lib/utils/device.js';
  import { setUserGeoLocation } from '$lib/utils/geo.js';
  import { Intercom } from '$lib/utils/service.intercom.js';
  import { initializeTopLevelConsoleController } from '$lib/utils/subscribtion.js';
  import { gotoSW } from '$lib/utils/sveltekitWrapper';

  import AndroidPwaBanner from '$lib/components/AndroidPWABanner.svelte';
  import FooterWidget from '$lib/components/_main_/footer/v2/Footer.Widget.svelte';
  import HeaderRedesigned from '$lib/components/_main_/header_redisigned/HeaderRedesigned.svelte';
  import MobileMenu from '$lib/components/_main_/mobile-menu/MobileMenu.svelte';
  import SplashScreen from '$lib/components/misc/Splash-Screen.svelte';
  import WrapperDynamicImport from '$lib/components/misc/WrapperDynamicImport.svelte';
  import DevInfoBox from '$lib/components/misc/admin/Dev-Info-Box.svelte';
  import OfflineAlert from '$lib/components/misc/banner/Banner-Offline-Alert.svelte';
  import PlatformAlert from '$lib/components/misc/banner/Banner-Platform-Alert.svelte';
  import EmailSubscribe from '$lib/components/misc/modal/Modal-Email-Subscribe.svelte';
  import ModalError from '$lib/components/misc/modal/Modal-Error.svelte';
  import ModalMain from '$lib/components/misc/modal/ModalMain.svelte';
  import ToastAuth from '$lib/components/misc/toast/Toast-Auth/Toast-Auth.svelte';
  import InfoMessages from '$lib/components/ui/infomessages/InfoMessages.svelte';
  import { getRates } from '$lib/utils/web3.js';

  // ╭─────
  // │ IMPORTANT:
  // │ |: Global Styles Import
  // ╰─────
  // import '../../../../static/app.scss';

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
          }
      },
    /**
     * @description
     * 📝 `this` component **main** `id` and `data-testid` prefix.
     */
    objConfig
      = config.objApp.objComponentConfiguration.get('src/routes/+layout.svelte')!
  ;

  let
    [
      isBetarenaWidgetAdEngineEnabled
    ] = [
      false
    ]
  ;

  $: ({ currentPageRouteId, currentActiveModal, currentActiveToast, globalState, serverLang, window: _window, viewportType } = { ...$sessionStore });
  $: ({ theme } = { ...$userBetarenaSettings });
  $: ({ username, lang, competition_number, verified } = { ...$userBetarenaSettings.user?.scores_user_data });
  $: ({ uid, email } = { ...$userBetarenaSettings.user?.firebase_user_data });
  $: ({ route: { id: pageRouteId } } = $page);
  $: ({ B_NAV_T: navbarTranslationData, dataArticle,  _dev_wrong_cookies, loggedIn, deviceType } = $page.data);
  $: ({ isEnabled: isPartytownEnabled, strCodeSampleForPartytownConfig } = config.objApp.objServiceWorkerPartytown());

  $: isInitliazed = false;
  $: isInitializationFinished = false;
  $: isWindowIntercom = (browser && _window?.Intercom != null && currentPageRouteId === 'ProfilePage');

  $: [ objComponentStandardState.viewport.mobile.state, objComponentStandardState.viewport.tablet.state]
    = viewportChangeV2
    (
      $sessionStore.windowWidth,
      objComponentStandardState.viewport.mobile.threshold,
      objComponentStandardState.viewport.tablet.threshold
    )
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @author
   *  @izobov
   * @description
   *  📣 Update CSS Variable `--vh` to handle viewport height changes on mobile devices with dynamic toolbars.
   * @return { void }
   */
  function updateVh
  (
  ): void
  {
    const
      vv = window.visualViewport
    ;

    if (!browser || !vv) return;

    const
      effectiveHeight = vv.height + vv.offsetTop,
      isKeyboardOpen = window.innerHeight - effectiveHeight > 100,
      height = isKeyboardOpen
        ? vv.height + vv.offsetTop
        : window.innerHeight
    ;

    document.body.style.setProperty('--vh', `${height * 0.01}px`);

    return;
  }

  /**
   * @author
   *  @migbash
   * @description
   *  📣 Service Worker Initialization Helper
   */
  function initiateServiceWorker
  (
  ): void
  {
    if (config.objApp.isServiceWorkerEnabled && ('serviceWorker' in navigator))
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
  }

  /**
   * @author
   *  @migbash
   * @description
   *  📣 Eager Server Initialization Helper
   * @return { Promise < void > }
   */
  async function helperInitializeServerEager
  (
  ): Promise < void >
  {
    initiateSubscribtions();
    return;
  }

  /**
   * @author
   *  @migbash
   * @description
   *  📣 Pre-Mount Initialization Helper
   * @return { Promise < void > }
   */
  async function helperInitializeOnMountPre
  (
  ): Promise < void >
  {
    isInitliazed = true;
    userBetarenaSettings.useLocalStorage(serverLang);
    scoresAdminStore.useLocalStorage();

    if (loggedIn) {
      const { mainDeepLinkCheck } = (await import('$lib/utils/deeplink.js'));
      await mainDeepLinkCheck();
    }
    new Browser().initiateSubscription();
    isInitializationFinished = true;
    return;
  }

  /**
   * @author
   *  @migbash
   * @description
   *  📣 Redirect to OnBoarding Page
   * @param { boolean } [register=true]
   *  📝 Whether to redirect to 'register' (true) or 'login' (false) page.
   * @return { Promise < void > }
   */
  async function redirectToOnBoard
  (
    register: boolean = true
  ): Promise < void >
  {
    const
      lang = ($userBetarenaSettings.lang ?? $page.params.lang)
    ;

    let path = '';

    if (lang && lang !== 'en')
      path += `/${lang}`;
    ;

    path += register ? '/register' : '/login';

    if(register && uid)
      $loginStore.isExistedUser = true;
    ;

    await gotoSW(path);

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
  // │ CRITICAL
  // │ │: [instant] [once]
  // │ │: Instant critical data initialization.
  // ╰─────
  $: if (browser && !isInitliazed)
    helperInitializeOnMountPre();
  ;

  $: if (browser && theme) {
    const isDark = theme === "Dark";
    document.body.classList.remove(isDark ? "light-mode": "dark-mode")
    document.body.classList.add(isDark ? "dark-mode" : "light-mode")
  }

  // ╭─────
  // │ CRITICAL
  // │ │: Hijack the 'console' object.
  // ╰─────
  $: if (browser && document)
    initializeTopLevelConsoleController();
  ;
  $: if (browser && isInitliazed && _dev_wrong_cookies)

    logoutUser();

  // ╭─────
  // │ NOTE:
  // │ |: [3rd-party] // Intercom // BOOT (with user data)
  // ╰─────
  $: if (isWindowIntercom)
    new Intercom().lifecycle
    (
      {
        uid,
        email,
        username,
        lang,
        competition_number,
        currentPageRouteIdVisibility: (currentPageRouteId !== 'ProfilePage'),
        strLifecycleType: 'boot',
      }
    );
  ;

  $: if (currentActiveModal === 'Auth_Modal' && ![routeIdLogin, routeIdRegister].includes(pageRouteId || ''))
    redirectToOnBoard(false);
  ;

  $: if(![routeIdLogin, routeIdRegister].includes(pageRouteId || '') && uid && !verified && isInitializationFinished)
    redirectToOnBoard();
  ;

  $: if (browser)
  {
    updateVh();
    window.visualViewport?.addEventListener('resize', updateVh);
  }

  $: if (browser && uid)
    initWalletStore(uid);
  ;

  $: if (deviceType && !viewportType) {
    sessionStore.updateData([["viewportType", deviceType]]);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately, as soon as 'this' .svelte file is ran, as a one-off       │
  // ╰────────────────────────────────────────────────────────────────────────╯

  if (browser) {
    helperInitializeServerEager();
  }

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onDestroy
  (
    () =>
    {
      if (!browser) return;
      window.visualViewport
        ?.removeEventListener('resize', updateVh)
      ;
      return;
    }
  );

  onMount
  (
    async (
    ): Promise < void > =>
    {
      getRates(sessionStore);
      // ╭─────
      // │ CRITICAL
      // ╰─────
      initiateServiceWorker();
      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: Check if the current device is a PWA.
      // ╰─────
      sessionStore.updateData
      (
        [
          ['windowWidth', document.documentElement.clientWidth],
          [(isPWA() ? 'globalStateAdd' : 'globalStateRemove'), 'IsPWA'],
        ]
      );

      setUserGeoLocation(navbarTranslationData!);

      if ($page.url.searchParams.get('admin'))
        scoresAdminStore.toggleAdminState($page.url.searchParams.get('admin') == 'true' ? true : false);
      ;

      setTimeout
      (
        () =>
        {
          isBetarenaWidgetAdEngineEnabled = true;
        },
        (objConfig.intBetarenaAdEngineDelayMs ?? 0)
      );

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
        `${objConfig.mapStrDebugPreifix?.get('beforeNavigate')} // START`,
        [
          `🔹 [var] ➤ _event :: ${JSON.stringify(_event)}`
        ]
      );

      if ($page.data.setState?.has('IsAnonymousNewBurner'))
      {
        // [🐞]
        dlogv2
        (
          `${objConfig.mapStrDebugPreifix?.get('beforeNavigate')} // IsAnonymousNewBurner`,
          []
        );

        delCookie
        (
          'betarenaScoresCookie'
        );
      }

      if (_event.from)
        $history_store.push(_event.from.url.pathname);
      ;

      return;
    }
  );

  afterNavigate
  (
    async (
      e
    ): Promise < void > =>
    {
      if (!browser) return;

      // [🐞]
      dlogv2
      (
        `${objConfig.mapStrDebugPreifix?.get('afterNavigate')}`,
        [
          `🔹 [var] ➤ e.from :|: ${JSON.stringify(e)}`
        ]
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
  ╭─────
  │ NOTE:
  │ |: Theme Color Meta Tag
  ╰───── -->
  {#if theme === 'Dark'}
    <meta
      name="theme-color"
      content="#1f1f1f"
    />
  {:else}
    <meta
      name="theme-color"
      content="#ffffff"
    />
  {/if}

  <!--
  ╭─────
  │ NOTE:
  │ |: Integration Injection for :: Partytown
  ╰───── -->
  {#if isPartytownEnabled}
    <!--
    ╭─────
    │ NOTE: IMPORTANT
    │ |: Forward the necessary functions to the web worker layer
    ╰───── -->
    {@html strCodeSampleForPartytownConfig}

    <!-- CRITICAL -->
    {@html '<script>' + partytownSnippet() + '</script>'}
  {/if}

  <!--
  ╭─────
  │ NOTE:
  │ |: Integration Injection for :: Intercom
  ╰───── -->
  {#if config.objApp.objServiceIntercom && currentPageRouteId === 'ProfilePage'}
    {@html config.objApp.objServiceIntercom.strInjectionCode}
  {/if}
</svelte:head>

<svelte:document
  on:visibilitychange=
  {
    () =>
    {
      // [🐞]
      if (!config.objDebug.objMeta['document.on:visibilitychange'].isEnabled)
        log_v3
        (
          {
            strGroupName: `${config.objDebug.objMeta['document.on:visibilitychange'].strLogPrefix}`,
          }
        );
      ;

      sessionStore.updateData
      (
        [
          ['isUserActive', !document.hidden],
        ]
      );

      return;
    }
  }
/>

<svelte:window
  on:resize=
  {
    () =>
    {
      // [🐞]
      if (!config.objDebug.objMeta['window.on:resize'].isEnabled)
        log_v3
        (
          {
            strGroupName: `${config.objDebug.objMeta['window.on:resize'].strLogPrefix}`,
          }
        );
      ;

      sessionStore.updateData
      (
        [
          ['windowWidth', document.documentElement.clientWidth],
          [(isPWA() ? 'globalStateAdd' : 'globalStateRemove'), 'IsPWA'],
        ]
      );

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
  class:page-content={[routeIdContent, routeIdSearch].includes(pageRouteId || '')}
  data-page-id={currentPageRouteId}
  data-mode={globalState.has('IsPWA') ? 'pwa' : 'web'}
>
  {#if
    isBetarenaWidgetAdEngineEnabled
    && config.objApp.isBetareAgEngineEnabled
    && (
      (dataArticle?.article != null && dataArticle?.article?.access_type === 'free')
      || (dataArticle?.article == null)
    )
  }
    {#key pageRouteId}
      <!-- <WidgetAdEngine -->
      <WrapperDynamicImport
        importComponentPath='Ad-Engine'
        authorId={dataArticle?.author?.id}
        authorArticleTagIds={(dataArticle?.article?.tags ?? [])}
        isDarkTheme={theme == 'Dark'}
        strTranslationTarget={(lang ?? 'en')}
        isStandalone={false}
      />
    {/key}
  {/if}

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/Splash-Screen.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/Splash-Screen.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Splash-Screen'
      />
    {:else}
      <SplashScreen />
    {/if}
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

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Offline-Alert.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Offline-Alert.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Banner-Offline-Alert'
      />
    {:else}
      <OfflineAlert />
    {/if}
  {/if}

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Platform-Alert.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Platform-Alert.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Banner-Platform-Alert'
      />
    {:else}
      <PlatformAlert />
    {/if}
  {/if}

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Modal-Email-Subscribe.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/modal/Modal-Email-Subscribe.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Modal-Email-Subscribe'
      />
    {:else}
      <EmailSubscribe />
    {/if}
  {/if}

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/Splash-Screen.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/Splash-Screen.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Splash-Screen'
      />
    {:else}
      <SplashScreen />
    {/if}
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

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Offline-Alert.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Offline-Alert.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Banner-Offline-Alert'
      />
    {:else}
      <OfflineAlert />
    {/if}
  {/if}

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Platform-Alert.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Banner-Platform-Alert.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Banner-Platform-Alert'
      />
    {:else}
      <PlatformAlert />
    {/if}
  {/if}

  {#if !config.objApp.objComponentConfiguration.get('src/lib/components/misc/banner/Modal-Email-Subscribe.svelte')?.isHidden}
    {#if config.objApp.objComponentConfiguration.get('src/lib/components/misc/modal/Modal-Email-Subscribe.svelte')?.isDynamicImport}
      <WrapperDynamicImport
        importComponentPath='Modal-Email-Subscribe'
      />
    {:else}
      <EmailSubscribe />
    {/if}
  {/if}

  {#if ![routeIdPageProfileArticleCreation, routeIdPageProfileEditArticle, routeIdSearch, routeIdLogin, routeIdRegister].includes(pageRouteId || '' ) || (pageRouteId === routeIdSearch && $sessionStore.viewportType !== 'mobile') }
    <HeaderRedesigned />
  {/if}

  <main
    class:dark-mode={theme == 'Dark'}
    class:light-mode={theme == 'Light'}
    class:standard={currentPageRouteId == null}
    class:page-profile={currentPageRouteId == 'ProfilePage'}
    class:page-authors={currentPageRouteId == 'AuthorsPage' || currentPageRouteId == 'Standard' || pageRouteId === routeIdSearch }
    class:page-content={[routeIdContent, routeIdSearch].includes(pageRouteId || '')}
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
  :global(body) {
    background-color: var(--colors-background-bg-primary);
  }


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
    min-height: 100dvh;
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
