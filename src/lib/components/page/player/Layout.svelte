<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Code Format   // V.8.0                                                         │
│ ➤ Status        // 🔒 LOCKED                                                     │
│ ➤ Author(s)     // @migbash                                                      │
│ ➤ Maintainer(s) // @migbash                                                      │
│ ➤ Created on    // April 18th, 2023                                              │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ BETARENA (Module)
│ |: Player Fixtures Widget Entry Point
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
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';

	import { onceTargetLivescoreNowFixtureGet, onceTargetPlayerIds, targetLivescoreNowFixtureListen, targetPlayerIdsListen } from '$lib/firebase/common';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, dlogv2 } from '$lib/utils/debug';
	import { viewportChangeV2 } from '$lib/utils/device.js';
	import { generateUrlPlayer } from '$lib/utils/string.js';

	import SvelteSeo from 'svelte-seo';
	import Breadcrumb from './Breadcrumb.svelte';
	import FixturesWidget from './fixtures/Fixtures-Widget.svelte';
	import ProfileWidget from './profile/Profile-Widget.svelte';
	import SeoWidget from './seo/Seo-Widget.svelte';
	import StatisticsWidget from './statistics/Statistics-Widget.svelte';
	import TeamWidget from './team/Team-Widget.svelte';

  import type { B_SAP_PP_D, B_SAP_PP_T } from '@betarena/scores-lib/types/v8/preload.scores.js';

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
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = '<section-scope>⮕<type|w|c>⮕<unique-tag-name>⮕main',
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 475, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: objectPageData = $page.data.PAGE_DATA as B_SAP_PP_D | null | undefined;
  $: objectPageDataSeo = $page.data.PAGE_SEO as B_SAP_PP_T | null | undefined;

  const
    /**
     * @description
     */
    realDbPath1 = `livescores_now_player_ids/${objectPageData?.data?.player_id}`,
    /**
     * @description
     */
    realDbPath2 = 'livescores_now/'
  ;

  $: ({ lang } = $userBetarenaSettings);
  $: ({ windowWidth, lang_intent, livescore_now_player_fixture, serverLang, isUserActive } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    )
  ;

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
   * @summary
   * [MAIN]
   * @description
   * ➨ get target livescore fixture (data)
   * ➨ instantiate livescore fixture (data) listener
   * @returns
   * void
   */
  async function kickstartPlayerFixtureCheck
  (
  ): Promise < void >
  {
    await onceTargetPlayerIds
    (
      realDbPath1
    );
    let connectionRef = targetPlayerIdsListen
    (
      realDbPath1
    );
    // FIREBASE_CONNECTIONS_SET.add(connectionRef)
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 MAIN
   * @description
   *  📝 Kickstart Livescore Dataflow:
   *    - get target livescore fixture (data)
   *    - instantiate livescore fixture (data) listener
   */
  async function kickstartLivescore
  (
  ): Promise < void >
  {
    if (!livescore_now_player_fixture) return;

    const
      /**
       * @description
       * 📣 target livescore fixture (data)
      */
      fixtureRealDbTarget = `${realDbPath2}${livescore_now_player_fixture}`
    ;

    await onceTargetLivescoreNowFixtureGet
    (
      fixtureRealDbTarget
    );

    let
      /**
       * @description
       * 📣 target livescore fixture (data) listener
      */
      connectionRef
        = targetLivescoreNowFixtureListen
        (
          fixtureRealDbTarget
        )
      ;
  }

  /**
   * @summary
   *  🔹 HELPER
   * @param { string } newURL - Target new `URL` that is to be navigated to.
   */
  async function handleTranslationNavigation
  (
    isPreload: boolean = true
  ): Promise < void >
  {
    let
      /**
       * @description
       * 📝 New `URL` value
       */
      strNewUrl
        = generateUrlPlayer
        (
          isPreload ? lang_intent : lang,
          objectPageData
        )
    ;

    // [🐞]
    dlogv2
    (
      '🚏 [checkpoint] ➤ handleTranslationNavigation(..) // START',
      [
        lang_intent,
        lang,
        serverLang,
        objectPageData,
        isPreload,
        strNewUrl
      ],
      true
    );

    if (isPreload)
      await preloadData(strNewUrl);
    else if (serverLang != lang)
      goto
      (
        strNewUrl,
        {
          replaceState: true
        }
      );
    ;

    return;
  }

  /**
   * @summary
   */
  async function restartDataFeed
  (
  ): Promise < void >
  {
    // [🐞]
    dlog('🔥 restartDataFeed', true);

    await kickstartPlayerFixtureCheck();
    await kickstartLivescore();

    // [🐞]
    dlog('🔥 restartDataFeed [DONE]', true);

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

  $: if (browser && isUserActive) restartDataFeed();

  $: if (browser && lang_intent) handleTranslationNavigation(true);

  $: if (browser && serverLang != lang) handleTranslationNavigation(false);

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💉 Svelte Injection Tags                                                         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

{#if objectPageDataSeo}
	<SvelteSeo
		title={objectPageDataSeo.main_data?.title}
		description={objectPageDataSeo.main_data?.description}
		keywords={objectPageDataSeo.main_data?.keywords}
		noindex={JSON.parse(objectPageDataSeo.main_data?.noindex.toString())}
		nofollow={JSON.parse(objectPageDataSeo.main_data?.nofollow.toString())}
		canonical={objectPageDataSeo.main_data?.canonical}
		twitter={objectPageDataSeo.twitter_card}
		openGraph={objectPageDataSeo.opengraph}
	/>
{/if}

<svelte:head>
  {#if objectPageDataSeo}
    {#each objectPageDataSeo.hreflang ?? [] as item}
      {#each Object.entries(objectPageData?.alternate_data ?? []) as [lang, link]}
        {#if item.link == lang}
          <!--
          [ℹ] Meta <link hreflang={...}>
          [ℹ] example:
          [ℹ] <link rel="alternate" hrefLang="en" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
          [ℹ] <link rel="alternate" hrefLang="es" href="https://scores.betarena.com/es/futbol/aston-villa-southampton-50977>
          [ℹ] <link rel="alternate" hrefLang="x-default" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
          [ℹ] <link rel="canonical" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
          -->
          <link
            rel="alternate"
            hreflang={item.hreflang}
            href={`${$page.url.origin}/${link}`}
          />
        {/if}
        {#if item.link == null && lang == 'en'}
          <!--
          [ℹ] EN (unique)
          -->
          <link
            rel="alternate"
            hreflang={item.hreflang}
            href={`${$page.url.origin}/${link}`}
          />
          <!-- <link
            rel="alternate"
            hreflang="en"
            href={`${$page.url.origin}/${link}`}
          /> -->
        {/if}
      {/each}
    {/each}
  {/if}
</svelte:head>

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

<section
  id="section-player-page"
>

  {#if !$sessionStore.globalState.has('IsPWA')}
    <Breadcrumb />
  {/if}

  <ProfileWidget />

  <!--
  [ℹ] widgets
  [ℹ] MOBILE
  FIXME: update to have a single dynamic layout
  -->
  {#if VIEWPORT_MOBILE_INIT[1] || VIEWPORT_TABLET_INIT[1]}

  <div
      id="widget-grid-display"
    >
      <!--
      Column Num.1
      -->
      <div
        class="grid-display-column"
      >
        <TeamWidget />
        <StatisticsWidget />
        <FixturesWidget />
        <SeoWidget />
      </div>
    </div>

  {:else}

    <div
      id="widget-grid-display"
    >
      <!--
      Column Num.1
      -->
      <div
        class="grid-display-column"
      >
        <FixturesWidget />
        <SeoWidget />
      </div>
      <!--
      Column Num.2
      -->
      <div
        class="grid-display-column"
      >
        <TeamWidget />
        <StatisticsWidget />
      </div>
    </div>

  {/if}

</section>

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

  section#section-player-page {
    max-width: 1430px;
		grid-template-columns: 1fr;
		padding-top: 12px !important;
		align-items: start;
  }

  /* widget layout */
	div#widget-grid-display {
		display: grid;
		margin-top: 24px;
		align-items: start;
	}

	/* widget layout-inner */
	div.grid-display-column {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
    and (min-width: 726px)
    and (max-width: 1000px) {
  }

	@media only screen and (min-width: 768px) {
		/* widget layout */
		div#widget-grid-display {
			grid-template-columns: 1fr;
		}
	}

	@media only screen and (min-width: 1160px) {
		/* widget layout */
		div#widget-grid-display {
			gap: 20px;
			grid-template-columns:
        minmax(auto, 850px)
        minmax(auto, 502px)
      ;
		}
	}

	@media only screen and (min-width: 1320px) {
		/* widget layout */
		div#widget-grid-display {
			display: grid;
			align-items: start;
			gap: 20px;
			grid-template-columns:
        minmax(auto, 850px)
        minmax(auto, 502px)
      ;
		}
	}

</style>
