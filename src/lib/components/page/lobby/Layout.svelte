<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug';
	import { generateUrlCompetitions, tryCatch, viewport_change } from '$lib/utils/platform-functions.js';

  import SvelteSeo from 'svelte-seo';

  import { subscribeCompetitionsAllListen } from '$lib/graphql/graphql.common.js';
  import type { B_SAP_CP_T, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
  import HighlightsWidget from './highlights/Highlights-Widget.svelte';


  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

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
   * - `current_lang`
   * - `refresh_lang`
   */
  $: if_R_0 =
    browser
  ;
	$: if (if_R_0 && current_lang != refresh_lang)
  {
    // [🐞]
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
   * - `lang_intent`
   */
  $: if_R_1 =
    browser
  ;
  $: if (if_R_1 && lang_intent)
  {
    // [🐞]
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

    navigateToTranslation(newURL)
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  /**
   * @description
   * TODO: DOC:
  */
  if ($sessionStore.deviceType == 'mobile')
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ home/Layout.svelte 📱`,
      true
    );

    mobileExclusive = true;
    tabletExclusive = false;
  }
  else if ($sessionStore.deviceType == 'tablet')
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ home/Layout.svelte 💻`,
      true
    );

    mobileExclusive = true;
    tabletExclusive = true;
  }
  else if ($sessionStore.deviceType == 'desktop')
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ home/Layout.svelte 🖥️`,
      true
    );

    mobileExclusive = false;
    tabletExclusive = false;
  }

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

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
      resizeAction();
      initEventListeners();

      subscribeCompetitionsAllListen();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===================
### SVELTE INJECTION TAGS
=================== -->

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

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

<section
  id="page-competitions"
>

  <!--
  ### TODO:
  ### temporary title / breadcrumb
  -->
  <p
    class=
    "
    s-14
    color-black-2
    "
  >
    {B_SAP_CP_T?.general?.data?.title ?? 'Competitions'}
  </p>

  <!-- <NoCompetitionsWidget /> -->

  <div>
    <HighlightsWidget />
  </div>

</section>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

	section#page-competitions
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
		display: grid;
		max-width: 1430px;
		grid-template-columns: 1fr;
		align-items: start;
    padding-top: 12px;
	}

	div.grid-display-column
  {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	/*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

</style>