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
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { listenRealTimeScoreboardAll, onceRealTimeLiveScoreboard } from '$lib/firebase/common.js';
	import { subscribeCompetitionsAllListen } from '$lib/graphql/graphql.common.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions.js';
  import { tryCatch } from '$lib/utils/miscellenous.js';
  import { generateUrlCompetitions } from '$lib/utils/string';

	import UserguideCompetition_1Widget from '$lib/components/_main_/userguide/Userguide-Competition-1-Widget.svelte';
	import SvelteSeo from 'svelte-seo';
	import HighlightsWidget from './highlights/Highlights-Widget.svelte';

  import type { B_SAP_CP_T, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
  import type { Unsubscribe } from 'firebase/database';
  import { initialDevice } from '$lib/utils/device.js';
  import { modalStore } from '$lib/store/modal.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    /** */
    MOBILE_VIEW = 475,
    /** */
    TABLET_VIEW = 1160
  ;

	let
    /** Page data availabe for `this` layout */
    B_SAP_CP_T: B_SAP_CP_T,
    /** */
    B_SAP_D3_CP_M: B_SAP_D3,
    /** */
	  current_lang: string = $sessionStore?.serverLang,
    /** */
    mobileExclusive: boolean = true,
    /** */
    tabletExclusive: boolean = true
  ;

	$: B_SAP_CP_T = $page.data?.B_SAP_CP_T;
	$: B_SAP_D3_CP_M = $page.data?.B_SAP_D3_CP_M;
  $: refresh_lang = $userBetarenaSettings?.lang;
	$: lang_intent = $sessionStore?.lang_intent;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @description
   * TODO: DOC:
   */
  function resizeAction
  (
  ): void
  {

    [
      tabletExclusive,
      mobileExclusive
    ] = viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );

  }

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @description
   * TODO: DOC:
   */
  function initEventListeners
  (
  ): void
  {
    // ### NOTE:
    // ### listen to changes in 'window.resize'.
    window.addEventListener
    (
      'resize',
      function
      (
      ): void
      {
        resizeAction();
      }
    );
  }

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @param
   * { string } newURL - Target new `URL` that is to be navigated to.
   */
  async function navigateToTranslation
  (
    newURL: string
  ): Promise < void >
  {
    await preloadData(newURL)
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Validate change in `lang`.
   *
   * WARNING:
   * triggered by changes in:
   * - `browser`
   * - `current_lang` ➤ **kicker**
   * - `refresh_lang` ➤ **kicker**
   */
  $: if_R_0 =
    browser
  ;
	$: if (if_R_0 && current_lang != refresh_lang)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ competitions/Layout.svelte if_R_0`,
      true
    );

		current_lang = refresh_lang;

		let newURL: string = generateUrlCompetitions
    (
      current_lang,
      B_SAP_D3_CP_M
    );

    // ### NOTE: | STASH:
    // ### Alternative navigational options, testing.
    /*
      invalidate('/api/cache/tournaments/cache-data.json');
      prefetch(newURL); // depreceated
      preloadData(newURL)
      goto(newURL, { replaceState: true });
    */

		goto
    (
      newURL,
      {
        replaceState: true
      }
    );
	}

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Validate change in `lang`.
   *
   * WARNING:
   * triggered by changes in:
   * - `browser`
   * - `lang_intent` ➤ **kicker**
   */
  $: if_R_1 =
    browser
  ;
  $: if (if_R_1 && lang_intent)
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint [R] ➤ competitions/Layout.svelte if_R_1`,
      true
    );

    let newURL: string = generateUrlCompetitions
    (
      lang_intent,
      B_SAP_D3_CP_M
    );

    navigateToTranslation
    (
      newURL
    );
  }

  // $: console.log('current_lang', current_lang);
  // $: console.log('refresh_lang', refresh_lang);
  // $: console.log('lang_intent', lang_intent);

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately, as soon as 'this' .svelte file is ran, as a one-off ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   * TODO: DOC:
  */
  [
    mobileExclusive,
    tabletExclusive
  ] = initialDevice
  (
    $sessionStore.deviceType
  );

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   * TODO: DOC:
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {
      showModal();
      resizeAction();
      initEventListeners();

      subscribeCompetitionsAllListen();

      // ### NOTE:
      // ### causes a potential delay in data retrieval,
      // ### as waits for onMount of Page & components;
      await onceRealTimeLiveScoreboard()

      let connectionRef: Unsubscribe = listenRealTimeScoreboardAll();
    }
  );

  function showModal(){
    $modalStore.component = UserguideCompetition_1Widget;
    $modalStore.modal = false;
    $modalStore.show = true;
  }

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### SVELTE INJECTION TAGS                                                              ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
### NOTE:
### SEO META TAGS
-->
{#if B_SAP_CP_T}
	<SvelteSeo
		title={B_SAP_CP_T?.main_data?.title}
		description={B_SAP_CP_T?.main_data?.description}
		keywords={B_SAP_CP_T?.main_data?.keywords}
		noindex={ tryCatch(() => JSON.parse(B_SAP_CP_T?.main_data?.noindex)) ?? false }
		nofollow={ tryCatch(() => JSON.parse(B_SAP_CP_T?.main_data?.nofollow)) ?? false }
		canonical={B_SAP_CP_T?.main_data?.canonical}
		twitter={B_SAP_CP_T?.twitter_card}
		openGraph={B_SAP_CP_T?.opengraph}
	/>
{/if}

<!--
### NOTE:
### HREFLANG TAGS
-->
<svelte:head>
  {#each B_SAP_CP_T?.hreflang ?? [] as item}
    {#if item?.link == null}
      <link
        rel="alternate"
        hreflang={item?.hreflang}
        href="https://scores.betarena.com/{B_SAP_D3_CP_M?.['en']}"
      />
    {:else}
      <link
        rel="alternate"
        hreflang={item?.hreflang}
        href="https://scores.betarena.com/{item?.link}/{B_SAP_D3_CP_M?.[item?.link]}"
      />
    {/if}
  {/each}
</svelte:head>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<section
  id="page-competitions"
  class:no-competitions={$sessionStore.competitionsNum == 0}
>

  <!--
  ### TODO:
  ### temporary title / breadcrumb
  -->
  <h1
    class=
    "
    s-14
    color-white
    "
  >
    {B_SAP_CP_T?.general?.data?.title ?? 'Competitions'}
  </h1>


  <div>
    <HighlightsWidget on:showModal={showModal}/>
  </div>

</section>

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

	section#page-competitions
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
		/* display: grid; */
		max-width: 1430px;
		grid-template-columns: 1fr;
		align-items: start;
    padding-top: 12px;
	}
  section#page-competitions.no-competitions
  {
    /* 🎨 style */
    min-height: calc(100vh - 400px);
  }

</style>