<!-- ===================
	COMPONENT JS - BASIC 
=================== -->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { createFixtureOddsPath, onceTargetLivescoreNowFixtureGet, targetLivescoreNowFixtureListen, targetLivescoreNowFixtureOddsListen } from '$lib/firebase/common.js';
	import { sessionStore } from '$lib/store/session';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions.js';

	import AboutWidget from '$lib/components/page/fixture/about/About-Widget.svelte';
	import ContentWidget from '$lib/components/page/fixture/content/Content_Widget.svelte';
	import Head_2HeadWidget from '$lib/components/page/fixture/head-2-head/Head2Head-Widget.svelte';
	import IncidentsWidget from '$lib/components/page/fixture/incidents/Incidents-Widget.svelte';
	import ProbabilityWidget from '$lib/components/page/fixture/probabilities/Probability-Widget.svelte';
	import ScoreboardWidget from '$lib/components/page/fixture/scoreboard/Scoreboard-Widget.svelte';
	import StandingsWidget from '$lib/components/page/fixture/standings/Standings-Widget.svelte';
	import StatisticsWidget from '$lib/components/page/fixture/statistics/Statistics-Widget.svelte';
	import VoteWidget from '$lib/components/page/fixture/votes/Votes-Widget.svelte';
	import FeaturedBettingSitesWidget from '$lib/components/page/home/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
	import SvelteSeo from 'svelte-seo';
	import Breadcrumb from './Breadcrumb.svelte';
	import LineupsWidget from './lineups/Lineups-Widget.svelte';

  import type { B_SAP_FP_D, B_SAP_FP_T } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	let PAGE_SEO: B_SAP_FP_T = $page.data.PAGE_SEO;
	let FIXTURE_INFO: B_SAP_FP_D = $page.data.FIXTURE_INFO;

  const fixtureId = FIXTURE_INFO?.data?.id;
  const fixtureTime =	FIXTURE_INFO?.data?.fixture_time + 'Z';

  const livescorePath = `livescores_now/${$page.data?.FIXTURE_INFO?.id}`
  const livesOddsPath = createFixtureOddsPath
  (
    fixtureId,
    fixtureTime
  );

  const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;

  let mobileExclusive = false;
  let tabletExclusive = false;
	let current_lang: string = $sessionStore?.serverLang;

  $: PAGE_SEO = $page.data.PAGE_SEO;
  $: FIXTURE_INFO = $page.data.FIXTURE_INFO;

	$: country_link =
		FIXTURE_INFO?.data?.country == undefined
			? undefined
			: FIXTURE_INFO?.data?.country
					.toLowerCase()
					.replace(/\s/g, '-')
					.replace(/\./g, '')
  ;
  
	$: league_name_link =
		FIXTURE_INFO?.data?.league_name == undefined
			? undefined
			: FIXTURE_INFO?.data?.league_name
					.toLowerCase()
					.replace(/\s/g, '-')
					.replace(/\./g, '')
  ;

  // TODO: FIXME: replace into a single __layout.svelte method [?]
	// TODO: FIXME: using page-stores [?]
	// [ℹ] listen to change in LANG SELECT of `$userBetarenaSettings.lang`
	$: refresh_lang = $userBetarenaSettings.lang;
	$: lang_intent = $sessionStore.lang_intent;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

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
  )
  {
    const if_M_0 = 
      ['FT', 'FT_PEN'].includes($page.data?.FIXTURE_INFO?.status)
    ;
    if (if_M_0) return;
    await onceTargetLivescoreNowFixtureGet
    (
      livescorePath
    );
    let connectionRef = targetLivescoreNowFixtureListen
    (
      livescorePath
    );
    // FIREBASE_CONNECTIONS_SET.add(connectionRef)
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ instantiate livescore fixture odds (data) listener
   * @returns
   * void
   */
  async function kickstartLiveOdds
  (
  ): Promise < void > 
  {

    const if_M_0 = 
      ['FT', 'FT_PEN'].includes($page.data?.FIXTURE_INFO?.status)
    ;
    if (if_M_0) return;
    let connectionRef = targetLivescoreNowFixtureOddsListen
    (
      livesOddsPath
    );
	}

  /**
   * @summary
   * [HELPER]
   * @param 
   * {string} newURL
   */
  async function navigateToTranslation
  (
    newURL: string
  ): Promise < void > 
  {
    await preloadData(newURL)
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
          dlog('🔵 user is active', true)
          await kickstartLivescore();
          await kickstartLiveOdds();
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

  /**
   * @summary
   * [MAIN]
   * @param 
   * {string} lang
   */
  function translatedURL
  (
    lang: string
  ): string 
  {
    let newURL: string = FIXTURE_INFO.alternate_data[lang];
    newURL = newURL.replace('https://scores.betarena.com','');
    dlog(FIXTURE_INFO.alternate_data, true)
    if (newURL == undefined) return '/'
    dlog(`newURL: ${newURL}`, true)
    return newURL;
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // [ℹ] validate LANG change
	$: if (current_lang != refresh_lang && browser) 
  {
		current_lang = refresh_lang;
		let newURL = translatedURL(current_lang)

		// [ℹ] navigate [options];
		// invalidate('/api/cache/tournaments/cache-data.json');
		// prefetch(newURL); // depreceated
    // preloadData(newURL)
		// goto(newURL, { replaceState: true });
		goto(newURL, { replaceState: true });
	}

  $: if (lang_intent && browser) 
  {
    let newURL = translatedURL(lang_intent)
    dlog(`newURL (lang_intent): ${newURL}`, true)
    navigateToTranslation(newURL)
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart livescore data GET + LISTEN;
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() => 
    {
      await kickstartLivescore();
      await kickstartLiveOdds();
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
[ℹ] adding SEO-META-TAGS for (this) PAGE 
-->
{#if PAGE_SEO}
	<SvelteSeo
		title={PAGE_SEO?.main_data.title}
		description={PAGE_SEO?.main_data.description}
		keywords={PAGE_SEO?.main_data.keywords}
		noindex={JSON.parse(PAGE_SEO?.main_data.noindex.toString())}
		nofollow={JSON.parse(PAGE_SEO?.main_data.nofollow.toString())}
		canonical={PAGE_SEO?.main_data.canonical}
		twitter={PAGE_SEO?.twitter_card}
		openGraph={PAGE_SEO?.opengraph}
	/>
{/if}

<!-- 
[ℹ] adding HREF-LANG-META-TAGS for (this) PAGE 
-->
<svelte:head>
	{#if PAGE_SEO}
		{#each PAGE_SEO?.hreflang || [] as item}
			{#each Object.entries(FIXTURE_INFO?.alternate_data) as [lang, link]}
				{#if item.link == lang}
					<!-- 
          [ℹ] expected alternate example
          <link rel="canonical" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
          <link rel="alternate" hrefLang="en" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
          <link rel="alternate" hrefLang="se" href="https://scores.betarena.com/se/fotboll/aston-villa-southampton-50977>
          [...]
          -->
					<link
						rel="alternate"
						hreflang={item.hreflang}
						href={link}
					/>
				{/if}
				{#if item.link == null && lang == 'en'}
					<!-- 
          [ℹ] EN here
          -->
					<link
						rel="alternate"
						hreflang={item.hreflang}
						href={link}
					/>
					<!-- <link
						rel="alternate"
						hreflang="en"
						href={link}
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
  id="fixture-page">

	<!-- 
  [ℹ] breadcrumbs URL 
  -->
	<Breadcrumb 
    {FIXTURE_INFO}
    {country_link}
    {league_name_link}
  />

  <!-- 
  FIXME: TODO: update to have a single dynamic layout
  -->

	<!-- 
  📱 MOBILE
  -->
	{#if mobileExclusive || tabletExclusive}
		<ScoreboardWidget />
		<div
      id="widget-grid-display"
    >
			<!-- 
      [ℹ] "Overview" view selection 
      -->
			<div
				class="grid-display-column"
				class:display-none={$sessionStore.fixture_select_view == 'news'}
			>
				<VoteWidget />
				<IncidentsWidget />
				<FeaturedBettingSitesWidget
					{FEATURED_BETTING_SITES_WIDGET_DATA_SEO}
				/>
				<LineupsWidget />
				<Head_2HeadWidget />
				<StandingsWidget
					{STANDINGS_T}
					{STANDINGS_DATA}
					{FIXTURE_INFO}
				/>
				<StatisticsWidget	/>
				<ProbabilityWidget />
				<AboutWidget />
			</div>
			<!-- 
      [ℹ] "News" view selection 
      -->
			<div
				id="grid-display-column"
				class:display-none={$sessionStore.fixture_select_view == 'overview'}
			>
				<ContentWidget
					{FIXTURE_CONTENT}
					{FIXTURE_CONTENT_TRANSLATION}
				/>
			</div>
		</div>
  <!-- 
  💻 TABLET 🖥️ LAPTOP 
  -->
	{:else}
		<ScoreboardWidget />
		<!-- 
    [ℹ] "Overview" view selection 
    -->
		<div
			id="widget-grid-display"
			class:display-none={$sessionStore.fixture_select_view == 'news'}
		>
			<div 
        class="grid-display-column">
				<VoteWidget />
				<LineupsWidget />
				<Head_2HeadWidget	/>
				<StandingsWidget
					{STANDINGS_T}
					{STANDINGS_DATA}
					{FIXTURE_INFO}
				/>
				<AboutWidget />
			</div>
			<div 
        class="grid-display-column">
				<FeaturedBettingSitesWidget
					{FEATURED_BETTING_SITES_WIDGET_DATA_SEO}
				/>
				<IncidentsWidget />
				<StatisticsWidget	/>
				<ProbabilityWidget />
			</div>
		</div>
		<!-- 
    [ℹ] "News" view selection 
    -->
		<div
			id="widget-grid-display-news"
			class:display-none={$sessionStore.fixture_select_view == 'overview'}
		>
			<ContentWidget
				{FIXTURE_CONTENT}
				{FIXTURE_CONTENT_TRANSLATION}
			/>
		</div>
	{/if}

</section>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	section#fixture-page 
  {
		max-width: 1430px;
		grid-template-columns: 1fr;
		padding-top: 12px !important;
		align-items: start;
	}

	/* page breadcrumbs */
	:global(div#fixture-page-breadcrumbs p.capitalize) 
  {
		text-transform: capitalize;
		overflow: hidden;
	}
	:global(div#fixture-page-breadcrumbs > p) 
  {
		color: #8c8c8c !important;
	}
	:global(div#fixture-page-breadcrumbs a > p:hover) 
  {
		color: #f5620f !important;
	}

	/* widget layout */
	div#widget-grid-display
  {
		display: grid;
		margin-top: 24px;
		align-items: start;
	}

	/* widget layout-inner */
	div.grid-display-column 
  {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	div#widget-grid-display-news 
  {
		display: grid;
		margin-top: 24px;
		align-items: start;
	}

	/*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
  and (max-width: 450px) 
  {
		/* page breadcrumbs */
		:global(div#fixture-page-breadcrumbs p.fixture-name) {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 50px;
		}
	}

	@media only screen 
  and (min-width: 768px) 
  {
		/* widget layout */
		div#widget-grid-display {
			grid-template-columns: 1fr;
		}
	}

	@media only screen 
  and (min-width: 1160px) 
  {
		/* widget layout */
		div#widget-grid-display {
			gap: 20px;
			grid-template-columns: minmax(auto, 850px) minmax(
					auto,
					502px
				);
		}
	}

	@media only screen 
  and (min-width: 1320px) 
  {
		/* widget layout */
		div#widget-grid-display {
			display: grid;
			align-items: start;
			gap: 20px;
			grid-template-columns: minmax(auto, 850px) minmax(
					auto,
					502px
				);
		}
	}

</style>
