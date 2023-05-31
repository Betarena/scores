<!-- ===================
	COMPONENT JS - BASIC 
=================== -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { sessionStore } from '$lib/store/session';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog } from '$lib/utils/debug';
	import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';

	import type {
		REDIS_CACHE_SINGLE_fixtures_page_info_response,
		REDIS_CACHE_SINGLE_fixtures_seo_response
	} from '$lib/models/_main_/pages_and_seo/types';
	import type {
		REDIS_CACHE_SINGLE_scoreboard_data,
		REDIS_CACHE_SINGLE_scoreboard_translation
	} from '$lib/models/fixtures/scoreboard/types';

	import type {
		REDIS_CACHE_SINGLE_incidents_data,
		REDIS_CACHE_SINGLE_incidents_translation
	} from '$lib/models/fixtures/incidents/types';

	import type { Cache_Single_Lang_Featured_Betting_Site_Translation_Response } from '$lib/models/home/featured_betting_sites/firebase-real-db-interface';

	import type {
		REDIS_CACHE_SINGLE_statistics_data,
		REDIS_CACHE_SINGLE_statistics_translation
	} from '$lib/models/fixtures/statistics/types';

	import type {
		REDIS_CACHE_SINGLE_content_data,
		REDIS_CACHE_SINGLE_content_translation
	} from '$lib/models/fixtures/content/types';

	import type {
		REDIS_CACHE_SINGLE_about_data,
		REDIS_CACHE_SINGLE_about_translation
	} from '$lib/models/fixtures/about/types';

	import type {
		Fixture_Head_2_Head,
		REDIS_CACHE_SINGLE_h2h_translation
	} from '$lib/models/fixtures/head-2-head/types';
	import type { REDIS_CACHE_SINGLE_probabilities_translation } from '$lib/models/fixtures/probabilities/types';
	import type { REDIS_CACHE_SINGLE_votes_translation } from '$lib/models/fixtures/votes/types';
	import type { REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response } from '$lib/models/tournaments/fixtures_odds/types';
	import type {
		REDIS_CACHE_SINGLE_tournament_standings_data,
		REDIS_CACHE_SINGLE_tournament_standings_translation
	} from '$lib/models/tournaments/standings/types';

	import AboutWidget from '$lib/components/page/fixture/about/About_Widget.svelte';
	import ContentWidget from '$lib/components/page/fixture/content/Content_Widget.svelte';
	import Head_2HeadWidget from '$lib/components/page/fixture/head-2-head/Head_2_Head_Widget.svelte';
	import IncidentsWidget from '$lib/components/page/fixture/incidents/Incidents_Widget.svelte';
	import ProbabilityWidget from '$lib/components/page/fixture/probabilities/Probability_Widget.svelte';
	import ScoreboardWidget from '$lib/components/page/fixture/scoreboard/Scoreboard_Widget.svelte';
	import StandingsWidget from '$lib/components/page/fixture/standings/Standings-Widget.svelte';
	import StatisticsWidget from '$lib/components/page/fixture/statistics/Statistics_Widget.svelte';
	import VoteWidget from '$lib/components/page/fixture/votes/Vote_Widget.svelte';
	import FeaturedBettingSitesWidget from '$lib/components/page/home/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
	import SvelteSeo from 'svelte-seo';
	import Breadcrumb from './Breadcrumb.svelte';
	import LineupsWidget from './lineups/Lineups-Widget.svelte';
	
	let PAGE_SEO: REDIS_CACHE_SINGLE_fixtures_seo_response;
	let FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response;
	let FIXTURE_SCOREBOARD: REDIS_CACHE_SINGLE_scoreboard_data;
	let FIXTURE_SCOREBOARD_TRANSLATION: REDIS_CACHE_SINGLE_scoreboard_translation;
	let FIXTURE_INCIDENTS: REDIS_CACHE_SINGLE_incidents_data;
	let FXITURE_INCIDENTS_TRANSLATION: REDIS_CACHE_SINGLE_incidents_translation;
	let FEATURED_BETTING_SITES_WIDGET_DATA_SEO: Cache_Single_Lang_Featured_Betting_Site_Translation_Response;
	let FIXTURE_STATISTICS: REDIS_CACHE_SINGLE_statistics_data;
	let FIXTURE_STATISTICS_TRANSLATION: REDIS_CACHE_SINGLE_statistics_translation;
	let FIXTURE_CONTENT: REDIS_CACHE_SINGLE_content_data[];
	let FIXTURE_CONTENT_TRANSLATION: REDIS_CACHE_SINGLE_content_translation;
	let FIXTURE_ABOUT: REDIS_CACHE_SINGLE_about_data;
	let FIXTURE_ABOUT_TRANSLATION: REDIS_CACHE_SINGLE_about_translation;
	let FIXTURE_VOTES_TRANSLATION: REDIS_CACHE_SINGLE_votes_translation;
	let FIXTURE_PROBS_TRANSLATION: REDIS_CACHE_SINGLE_probabilities_translation;
	let FIXTURES_ODDS_T: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response;
	let FIXTURE_H2H: Fixture_Head_2_Head;
	let FIXTURE_H2H_TRANSLATION: REDIS_CACHE_SINGLE_h2h_translation;
	let STANDINGS_T: REDIS_CACHE_SINGLE_tournament_standings_translation;
	let STANDINGS_DATA: REDIS_CACHE_SINGLE_tournament_standings_data;

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE OTHER
	// ~~~~~~~~~~~~~~~~~~~~~

	$: PAGE_SEO = $page.data.PAGE_SEO;
	$: FIXTURE_INFO = $page.data.FIXTURE_INFO;
	$: FIXTURE_SCOREBOARD =	$page.data.FIXTURE_SCOREBOARD;
	$: FIXTURE_SCOREBOARD_TRANSLATION =	$page.data.FIXTURE_SCOREBOARD_TRANSLATION;
	$: FIXTURE_INCIDENTS = $page.data.FIXTURE_INCIDENTS;
	$: FXITURE_INCIDENTS_TRANSLATION = $page.data.FXITURE_INCIDENTS_TRANSLATION;
	$: FEATURED_BETTING_SITES_WIDGET_DATA_SEO =	$page.data.FEATURED_BETTING_SITES_WIDGET_DATA_SEO;
	$: FIXTURE_STATISTICS =	$page.data.FIXTURE_STATISTICS;
	$: FIXTURE_STATISTICS_TRANSLATION =	$page.data.FIXTURE_STATISTICS_TRANSLATION;
	$: FIXTURE_CONTENT = $page.data.FIXTURE_CONTENT;
	$: FIXTURE_CONTENT_TRANSLATION = $page.data.FIXTURE_CONTENT_TRANSLATION;
	$: FIXTURE_ABOUT = $page.data.FIXTURE_ABOUT;
	$: FIXTURE_ABOUT_TRANSLATION = $page.data.FIXTURE_ABOUT_TRANSLATION;
	$: FIXTURE_VOTES_TRANSLATION = $page.data.FIXTURE_VOTES_TRANSLATION;
	$: FIXTURE_PROBS_TRANSLATION = $page.data.FIXTURE_PROBS_TRANSLATION;
	$: FIXTURES_ODDS_T = $page.data.FIXTURES_ODDS_T;
	$: FIXTURE_H2H = $page.data.FIXTURE_H2H;
	$: FIXTURE_H2H_TRANSLATION = $page.data.FIXTURE_H2H_TRANSLATION;
	$: STANDINGS_T = $page.data.STANDINGS_T;
	$: STANDINGS_DATA = $page.data.STANDINGS_DATA;

	$: country_link =
		FIXTURE_INFO?.data?.country == undefined
			? undefined
			: FIXTURE_INFO?.data?.country
					.toLowerCase()
					.replace(/\s/g, '-')
					.replace(/\./g, '');
	$: league_name_link =
		FIXTURE_INFO?.data?.league_name == undefined
			? undefined
			: FIXTURE_INFO?.data?.league_name
					.toLowerCase()
					.replace(/\s/g, '-')
					.replace(/\./g, '');

	// ~~~~~~~~~~~~~~~~~~~~~
	//  PAGE METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

  // TODO:
  /*
    $: if (browser && $userBetarenaSettings && $userBetarenaSettings.country_bookmaker != undefined) {
      get_sportbooks()
    }
    async function get_sportbooks() {
      let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()
      SPORTBOOK_MAIN = await get("/api/cache/tournaments/sportbook?geoPos="+userGeo) as Cache_Single_SportbookDetails_Data_Response;
      console.log('SPORTBOOK_MAIN', SPORTBOOK_MAIN)
      SPORTBOOK_MAIN = SPORTBOOK_MAIN
      SPORTBOOK_ALL = await get("/api/cache/tournaments/sportbook?all=true&geoPos="+userGeo) as Cache_Single_SportbookDetails_Data_Response[];
      SPORTBOOK_ALL = SPORTBOOK_ALL
    }
    $: SPORTBOOK_MAIN = SPORTBOOK_MAIN
    $: SPORTBOOK_ALL = SPORTBOOK_ALL
  */

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE METHODS
	// CRITICAL
	// ~~~~~~~~~~~~~~~~~~~~~

  // TODO: FIXME: replace into a single __layout.svelte method [?]
	// TODO: FIXME: using page-stores [?]
	// [ℹ] listen to change in LANG SELECT of `$userBetarenaSettings.lang`
	let current_lang: string = server_side_language;
	$: refresh_lang = $userBetarenaSettings.lang;
	$: lang_intent = $sessionStore.lang_intent;

	// [ℹ] validate LANG change
	$: if (current_lang != refresh_lang 
    && browser
	) {
		current_lang = refresh_lang;
		let newURL = translatedURL(current_lang)

		// [ℹ] navigate [options];
		// invalidate('/api/cache/tournaments/cache-data.json');
		// prefetch(newURL); // depreceated
    // preloadData(newURL)
		// goto(newURL, { replaceState: true });
		goto(newURL, { replaceState: true });
	}

  function translatedURL(lang: string): string {
    let newURL: string = FIXTURE_INFO.alternate_data[lang];
    newURL = newURL.replace('https://scores.betarena.com','');
    dlog(FIXTURE_INFO.alternate_data, true)
    if (newURL == undefined) return '/'
    dlog(`newURL: ${newURL}`, true)
    return newURL;
  }

  $: if (lang_intent && browser) {
    let newURL = translatedURL(lang_intent)
    dlog(`newURL (lang_intent): ${newURL}`, true)
    navigateToTranslation(newURL)
  }

  // onMount(() => {
  //   for (let [key, value] of Object.entries(FIXTURE_INFO.alternate_data)) {
	// 	  value = value.replace('https://scores.betarena.com','');
  //     navigateToTranslation(value)
  //     dlog(`preloaded: ${value}`, true);
  //   }
  // })

  async function navigateToTranslation(newURL: string) {
    await preloadData(newURL)
  }
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

<!-- ===================
	COMPONENT HTML
=================== -->
<section id="fixture-page">
	<!-- 
  [ℹ] breadcrumbs URL 
  -->
	<Breadcrumb 
    {FIXTURE_INFO}
    {country_link}
    {league_name_link}
  />

	<!-- 
  [ℹ] widgets 
  [ℹ] MOBILE
  FIXME: update to have a single dynamic layout
  -->
	{#if mobileExclusive || tabletExclusive}
		<ScoreboardWidget
			{FIXTURE_SCOREBOARD}
			{FIXTURE_INFO}
			{FIXTURE_SCOREBOARD_TRANSLATION}
			{FIXTURE_CONTENT}
			{FIXTURES_ODDS_T}
		/>
		<div id="widget-grid-display">
			<!-- 
      [ℹ] "Overview" view selection -->
			<div
				class="grid-display-column"
				class:display-none={$sessionStore.fixture_select_view ==
					'news'}
			>
				<VoteWidget
					{FIXTURE_INFO}
					{FIXTURE_VOTES_TRANSLATION}
				/>
				<IncidentsWidget
					{FIXTURE_INCIDENTS}
					{FXITURE_INCIDENTS_TRANSLATION}
				/>
				<FeaturedBettingSitesWidget
					{FEATURED_BETTING_SITES_WIDGET_DATA_SEO}
				/>
				<LineupsWidget />
				<Head_2HeadWidget
					{FIXTURE_INFO}
					{FIXTURE_H2H}
					{FIXTURE_H2H_TRANSLATION}
					{FIXTURES_ODDS_T}
				/>
				<StandingsWidget
					{STANDINGS_T}
					{STANDINGS_DATA}
					{FIXTURE_INFO}
				/>
				<StatisticsWidget
					{FIXTURE_STATISTICS}
					{FIXTURE_STATISTICS_TRANSLATION}
				/>
				<ProbabilityWidget
					{FIXTURE_INFO}
					{FIXTURE_PROBS_TRANSLATION}
				/>
				<AboutWidget
					{FIXTURE_ABOUT}
					{FIXTURE_ABOUT_TRANSLATION}
				/>
			</div>
			<!-- 
      [ℹ] "News" view selection -->
			<div
				id="grid-display-column"
				class:display-none={$sessionStore.fixture_select_view ==
					'overview'}
			>
				<ContentWidget
					{FIXTURE_CONTENT}
					{FIXTURE_CONTENT_TRANSLATION}
				/>
			</div>
		</div>
		<!-- 
  [ℹ] widgets 
  [ℹ] TABLET && DESKTOP 
  -->
	{:else}
		<ScoreboardWidget
			{FIXTURE_SCOREBOARD}
			{FIXTURE_INFO}
			{FIXTURE_SCOREBOARD_TRANSLATION}
			{FIXTURE_CONTENT}
			{FIXTURES_ODDS_T}
		/>
		<!-- 
    [ℹ] "Overview" view selection 
    -->
		<div
			id="widget-grid-display"
			class:display-none={$sessionStore.fixture_select_view ==
				'news'}
		>
			<div class="grid-display-column">
				<VoteWidget
					{FIXTURE_INFO}
					{FIXTURE_VOTES_TRANSLATION}
				/>
				<LineupsWidget />
				<Head_2HeadWidget
					{FIXTURE_INFO}
					{FIXTURE_H2H}
					{FIXTURE_H2H_TRANSLATION}
					{FIXTURES_ODDS_T}
				/>
				<StandingsWidget
					{STANDINGS_T}
					{STANDINGS_DATA}
					{FIXTURE_INFO}
				/>
				<AboutWidget
					{FIXTURE_ABOUT}
					{FIXTURE_ABOUT_TRANSLATION}
				/>
			</div>
			<div class="grid-display-column">
				<FeaturedBettingSitesWidget
					{FEATURED_BETTING_SITES_WIDGET_DATA_SEO}
				/>
				<IncidentsWidget
					{FIXTURE_INCIDENTS}
					{FXITURE_INCIDENTS_TRANSLATION}
				/>
				<StatisticsWidget
					{FIXTURE_STATISTICS}
					{FIXTURE_STATISTICS_TRANSLATION}
				/>
				<ProbabilityWidget
					{FIXTURE_INFO}
					{FIXTURE_PROBS_TRANSLATION}
				/>
			</div>
		</div>
		<!-- 
    [ℹ] "News" view selection 
    -->
		<div
			id="widget-grid-display-news"
			class:display-none={$sessionStore.fixture_select_view ==
				'overview'}
		>
			<ContentWidget
				{FIXTURE_CONTENT}
				{FIXTURE_CONTENT_TRANSLATION}
			/>
		</div>
	{/if}

</section>

<!-- ===================
	COMPONENT STYLE
=================== -->
<style>
	section#fixture-page {
		/* display: grid; */
		max-width: 1430px;
		grid-template-columns: 1fr;
		padding-top: 12px !important;
		align-items: start;
	}

	/* page breadcrumbs */
	:global(div#fixture-page-breadcrumbs p.capitalize) {
		text-transform: capitalize;
		overflow: hidden;
	}
	:global(div#fixture-page-breadcrumbs > p) {
		color: #8c8c8c !important;
	}
	:global(div#fixture-page-breadcrumbs a > p:hover) {
		color: #f5620f !important;
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

	div#widget-grid-display-news {
		display: grid;
		margin-top: 24px;
		align-items: start;
	}

	.display-none {
		display: none !important;
	}

	/* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  MOBILE ONLY RESPONSIVNESS (&+) */
	@media only screen and (max-width: 450px) {
		/* page breadcrumbs */
		:global(div#fixture-page-breadcrumbs p.fixture-name) {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 50px;
		}
	}

	/* 
  RESPONSIVE FOR TABLET (&+) [768px] */
	@media only screen and (min-width: 768px) {
		/* widget layout */
		div#widget-grid-display {
			grid-template-columns: 1fr;
		}
	}

	/* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1160px) {
		/* widget layout */
		div#widget-grid-display {
			gap: 20px;
			grid-template-columns: minmax(auto, 850px) minmax(
					auto,
					502px
				);
		}
	}

	/* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1320px) {
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
