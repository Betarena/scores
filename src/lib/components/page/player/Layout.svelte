<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { onceTargetLivescoreNowFixtureGet, onceTargetPlayerIds, targetLivescoreNowFixtureListen, targetPlayerIdsListen } from '$lib/firebase/common';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions';

	import SvelteSeo from 'svelte-seo';
	import Breadcrumb from './Breadcrumb.svelte';
	import FixturesWidget from './fixtures/Fixtures-Widget.svelte';
	import ProfileWidget from './profile/Profile-Widget.svelte';
	import SeoWidget from './seo/Seo-Widget.svelte';
	import StatisticsWidget from './statistics/Statistics-Widget.svelte';
	import TeamWidget from './team/Team-Widget.svelte';

  import type { B_SAP_PP_D, B_SAP_PP_T } from '@betarena/scores-lib/types/seo-pages';
    import { isPWA } from '$lib/utils/device.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // IMPORTANT
  // (this) widget/component has access to the following PAGE data:
  // [...]
  // $page.data.PAGE_DATA: B_SAP_PP_D
  // $page.data.B_SAP_D1: B_SAP_D1
  // FIXME: remove cosnt data = [...] and fix the types issue with $page.data[...]

  let data: B_SAP_PP_D = $page.data.PAGE_DATA;
  let data_0: B_SAP_PP_T = $page.data.PAGE_SEO;

  const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;

  const realDbPath1 = `livescores_now_player_ids/${data?.data?.player_id}`
  const realDbPath2 = `livescores_now/`

  let mobileExclusive = false;
  let tabletExclusive = false;
  let current_lang: string = $sessionStore?.serverLang;

  $: data = $page.data.PAGE_DATA
  $: data_0 = $page.data.PAGE_SEO

	$: refresh_lang = $userBetarenaSettings.lang;
	$: lang_intent = $sessionStore.lang_intent;
  $: liveFixtureId = $sessionStore?.livescore_now_player_fixture;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

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
   * @summary
   * [MAIN]
   * @description
   * ➨ get target livescore fixture (data)
   * ➨ instantiate livescore fixture (data) listener
   * @returns
   * void
   */
  async function kickstartLivescore
  (
  ): Promise < void >
  {
    // CHECK: Exit;
    const if_M_0 =
      $sessionStore?.livescore_now_player_fixture == undefined
    ;
    if (if_M_0) return;

    const fixtureRealDbTarget = `${realDbPath2}${liveFixtureId}`;

    await onceTargetLivescoreNowFixtureGet
    (
      fixtureRealDbTarget
    );

    let connectionRef = targetLivescoreNowFixtureListen
    (
      fixtureRealDbTarget
    );
  }

  /**
   * @summary
   * [HELPER]
   * @description
   * identifies the target translated URL;
   * @param
   * {string} lang
   * @returns
   * a modified string
   */
  function translated_url
  (
    lang: string
  ): string
  {
    let new_url: string = data.alternate_data[lang];
    // new_url = new_url.replace('https://scores.betarena.com','');
    dlog(data.alternate_data, true)
    if (new_url == undefined) return '/'
    dlog(`new_url: /${new_url}`, true)
    return `/${new_url}`;
  }

  /**
   * @summary
   * [HELPER]
   * @description
   * preload target URL;
   * @param
   * {string} new_url
   * @returns
   * void
   */
  async function preload_target_url
  (
    new_url: string
  ): Promise < void >
  {
    await preloadData(new_url)
  }

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  )
  {
    [
      tabletExclusive,
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * ➨ document (on-resize) event listener;
   * @returns
   * void
   */
  function addEventListeners
  (
  )
  {
    // NOTE: (on-visibility-change)
    document.addEventListener
    (
      'visibilitychange',
      async function
      (
      )
      {
        if (!document.hidden)
        {
          // [🐞]
          dlog
          (
            '🔵 user is active',
            true
          );
          await kickstartPlayerFixtureCheck();
          await kickstartLivescore();
        }
      }
    );
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function ()
      {
				resizeAction();
			}
		);
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // [ℹ] (event-listen)
  // [ℹ] lang (intent) change;
  $: if
  (
    browser
    && lang_intent
  )
  {
    let newURL = translated_url(lang_intent)
    dlog(`newURL (lang_intent): ${newURL}`, true)
    preload_target_url(newURL)
  }

  // [ℹ] (event-listen)
  // [ℹ] lang change;
	$: if
  (
    browser
    && current_lang != refresh_lang
  )
  {
		current_lang = refresh_lang;
		goto
    (
      translated_url
      (
        current_lang
      ),
      {
        replaceState: true
      }
    );
	}

  $: if (liveFixtureId)
  {
    kickstartLivescore()
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart livescore (player-ids) data GET + LISTEN;
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() =>
    {
      await kickstartPlayerFixtureCheck();
      await kickstartLivescore();
      resizeAction();
      addEventListeners();
    }
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<!--
[ℹ] Meta (SEO)
-->
{#if data_0}
	<SvelteSeo
		title={data_0?.main_data?.title}
		description={data_0?.main_data?.description}
		keywords={data_0?.main_data?.keywords}
		noindex={JSON.parse(data_0?.main_data?.noindex.toString())}
		nofollow={JSON.parse(data_0?.main_data?.nofollow.toString())}
		canonical={data_0?.main_data?.canonical}
		twitter={data_0?.twitter_card}
		openGraph={data_0?.opengraph}
	/>
{/if}


<svelte:head>
  {#if data_0}
    {#each data_0?.hreflang as item}
      {#each Object.entries(data?.alternate_data) as [lang, link]}
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

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<section
  id="section-player-page">
  {#if !isPWA()}
     <Breadcrumb />
  {/if}
  <ProfileWidget/>

  <!--
  [ℹ] widgets
  [ℹ] MOBILE
  FIXME: update to have a single dynamic layout
  -->
	{#if mobileExclusive || tabletExclusive}

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

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

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
  =============
  RESPONSIVNESS
  =============
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

  /*
  =============
  DARK-THEME
  =============
  */

</style>