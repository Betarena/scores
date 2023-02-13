<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { sessionStore } from '$lib/store/session';
	import { userBetarenaSettings } from '$lib/store/user-settings';

	import type {
		REDIS_CACHE_SINGLE_lineups_data,
		REDIS_CACHE_SINGLE_lineups_translation
	} from '$lib/models/fixtures/lineups/types';
	import type {
		REDIS_CACHE_SINGLE_scoreboard_data,
		REDIS_CACHE_SINGLE_scoreboard_translation
	} from '$lib/models/fixtures/scoreboard/types';
	import type {
		REDIS_CACHE_SINGLE_fixtures_page_info_response,
		REDIS_CACHE_SINGLE_fixtures_seo_response
	} from '$lib/models/_main_/pages_and_seo/types';

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

	import AboutWidget from '$lib/components/fixtures_page/about/About_Widget.svelte';
	import ContentWidget from '$lib/components/fixtures_page/content/Content_Widget.svelte';
	import Head_2HeadWidget from '$lib/components/fixtures_page/head-2-head/Head_2_Head_Widget.svelte';
	import IncidentsWidget from '$lib/components/fixtures_page/incidents/Incidents_Widget.svelte';
	import LineupsWidget from '$lib/components/fixtures_page/lineups/Lineups_Widget.svelte';
	import ProbabilityWidget from '$lib/components/fixtures_page/probabilities/Probability_Widget.svelte';
	import ScoreboardWidget from '$lib/components/fixtures_page/scoreboard/Scoreboard_Widget.svelte';
	import StandingsWidget from '$lib/components/fixtures_page/standings/Standings-Widget.svelte';
	import StatisticsWidget from '$lib/components/fixtures_page/statistics/Statistics_Widget.svelte';
	import VoteWidget from '$lib/components/fixtures_page/votes/Vote_Widget.svelte';
	import FeaturedBettingSitesWidget from '$lib/components/home/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
	import SvelteSeo from 'svelte-seo';

	let PAGE_SEO: REDIS_CACHE_SINGLE_fixtures_seo_response;
	let FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response;
	let FIXTURE_SCOREBOARD: REDIS_CACHE_SINGLE_scoreboard_data;
	let FIXTURE_SCOREBOARD_TRANSLATION: REDIS_CACHE_SINGLE_scoreboard_translation;
	let FIXTURE_LINEUPS: REDIS_CACHE_SINGLE_lineups_data;
	let FIXTURE_LINEUPS_TRANSLATION: REDIS_CACHE_SINGLE_lineups_translation;
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
	$: FIXTURE_SCOREBOARD =
		$page.data.FIXTURE_SCOREBOARD;
	$: FIXTURE_SCOREBOARD_TRANSLATION =
		$page.data.FIXTURE_SCOREBOARD_TRANSLATION;
	$: FIXTURE_LINEUPS = $page.data.FIXTURE_LINEUPS;
	$: FIXTURE_LINEUPS_TRANSLATION =
		$page.data.FIXTURE_LINEUPS_TRANSLATION;
	$: FIXTURE_INCIDENTS =
		$page.data.FIXTURE_INCIDENTS;
	$: FXITURE_INCIDENTS_TRANSLATION =
		$page.data.FXITURE_INCIDENTS_TRANSLATION;
	$: FEATURED_BETTING_SITES_WIDGET_DATA_SEO =
		$page.data
			.FEATURED_BETTING_SITES_WIDGET_DATA_SEO;
	$: FIXTURE_STATISTICS =
		$page.data.FIXTURE_STATISTICS;
	$: FIXTURE_STATISTICS_TRANSLATION =
		$page.data.FIXTURE_STATISTICS_TRANSLATION;
	$: FIXTURE_CONTENT = $page.data.FIXTURE_CONTENT;
	$: FIXTURE_CONTENT_TRANSLATION =
		$page.data.FIXTURE_CONTENT_TRANSLATION;
	$: FIXTURE_ABOUT = $page.data.FIXTURE_ABOUT;
	$: FIXTURE_ABOUT_TRANSLATION =
		$page.data.FIXTURE_ABOUT_TRANSLATION;
	$: FIXTURE_VOTES_TRANSLATION =
		$page.data.FIXTURE_VOTES_TRANSLATION;
	$: FIXTURE_PROBS_TRANSLATION =
		$page.data.FIXTURE_PROBS_TRANSLATION;
	$: FIXTURES_ODDS_T = $page.data.FIXTURES_ODDS_T;
	$: FIXTURE_H2H = $page.data.FIXTURE_H2H;
	$: FIXTURE_H2H_TRANSLATION =
		$page.data.FIXTURE_H2H_TRANSLATION;
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

	// ~~~~~~~~~~~~~~~~~~~~~
	// [ℹ] VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= 1160) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				// [ℹ] TABLET - VIEW
				if (w >= 1160) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				// [ℹ] MOBILE - VIEW
				if (w < 475) {
					mobileExclusive = true;
				} else {
					mobileExclusive = false;
				}
			}
		);
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE METHODS
	// [! CRITICAL !]
	// ~~~~~~~~~~~~~~~~~~~~~

	// TODO: FIXME: replace into a single __layout.svelte method [?]
	// TODO: FIXME: using page-stores [?]
	// [ℹ] listen to change in LANG SELECT of `$userBetarenaSettings.lang`
	let current_lang: string =
		$userBetarenaSettings.lang;
	$: refresh_lang = $userBetarenaSettings.lang;

	// [ℹ] validate LANG change
	$: if (
		current_lang != refresh_lang &&
		browser
	) {
		current_lang = refresh_lang;
		let newURL =
			FIXTURE_INFO.alternate_data[current_lang];
		newURL = newURL.replace(
			'https://scores.betarena.com',
			''
		);

		// [ℹ] navigate [options];
		// invalidate('/api/cache/tournaments/cache-data.json');
		// prefetch(newURL);
		goto(newURL, { replaceState: true });
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
		noindex={JSON.parse(
			PAGE_SEO?.main_data.noindex.toString()
		)}
		nofollow={JSON.parse(
			PAGE_SEO?.main_data.nofollow.toString()
		)}
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
		{#each PAGE_SEO.hreflang as item}
			{#each Object.entries(FIXTURE_INFO.alternate_data) as [lang, link]}
				{#if item.link == lang}
					<!-- 
            [ℹ] expected alternate example
            <link rel="alternate" hrefLang="en" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="it" href="https://scores.betarena.com/it/calcio/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="es" href="https://scores.betarena.com/es/futbol/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="pt" href="https://scores.betarena.com/pt/futebol/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang=""pt-BR" href="https://scores.betarena.com/br/futebol/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="ro" href="https://scores.betarena.com/ro/fotbal/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="se" href="https://scores.betarena.com/se/fotboll/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="x-default" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
            <link rel="canonical" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
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
					<link
						rel="alternate"
						hreflang="en"
						href={link}
					/>
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
	<div
		id="fixture-page-breadcrumbs"
		class="
      row-space-start 
      m-b-20
    "
	>
		<!-- 
    [ℹ] sport 
    -->
		<a
			data-sveltekit-prefetch
			href={$page.params.lang != undefined
				? `/${$page.params.lang}/${$page.params.sport}`
				: `/${$page.params.sport}`}
		>
			<p
				class="
          s-14 
          color-white 
          m-r-10 
          capitalize 
          cursor-pointer 
          no-wrap
        "
			>
				{FIXTURE_INFO?.data?.sport}
			</p>
		</a>

		<img
			src="/assets/svg/tournaments/arrow-right.svg"
			alt=""
			class="m-r-10"
			width="14px"
			height="14px"
		/>

		<!-- 
    [ℹ] country 
    -->
		<a
			data-sveltekit-prefetch
			href={$page.params.lang != undefined
				? `/${$page.params.lang}/${$page.params.sport}/${country_link}`
				: `/${$page.params.sport}/${country_link}`}
		>
			<p
				class="
          s-14 
          color-white 
          m-r-10 
          capitalize 
          cursor-pointer 
          no-wrap
        "
			>
				{FIXTURE_INFO?.data?.country}
			</p>
		</a>

		<img
			src="/assets/svg/tournaments/arrow-right.svg"
			alt=""
			class="m-r-10"
			width="14px"
			height="14px"
		/>

		<!-- 
    [ℹ] league_name 
    -->
		<a
			data-sveltekit-prefetch
			href={$page.params.lang != undefined
				? `/${$page.params.lang}/${$page.params.sport}/${country_link}/${league_name_link}`
				: `/${$page.params.sport}/${country_link}/${league_name_link}`}
		>
			<p
				class="
          s-14 
          color-white
          m-r-10 
          capitalize 
          cursor-pointer 
          no-wrap
        "
			>
				{FIXTURE_INFO?.data?.league_name}
			</p>
		</a>

		<img
			src="/assets/svg/tournaments/arrow-right.svg"
			alt=""
			class="m-r-10"
			width="14px"
			height="14px"
		/>

		<!-- 
    [ℹ] fxiture_name 
    -->
		<p
			class="
        s-14 
        color-white 
        m-r-10 
        capitalize 
        fixture-name
      "
		>
			{FIXTURE_INFO?.data?.home_team_name}
			vs
			{FIXTURE_INFO?.data?.away_team_name}
		</p>
	</div>

	<!-- 
  [ℹ] widgets 
  [ℹ] MOBILE 
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
				<LineupsWidget
					{FIXTURE_LINEUPS}
					{FIXTURE_LINEUPS_TRANSLATION}
				/>
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
				<LineupsWidget
					{FIXTURE_LINEUPS}
					{FIXTURE_LINEUPS_TRANSLATION}
				/>
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
	div#fixture-page-breadcrumbs p.capitalize {
		text-transform: capitalize;
		overflow: hidden;
	}
	div#fixture-page-breadcrumbs > p {
		color: #8c8c8c !important;
	}
	div#fixture-page-breadcrumbs a > p:hover {
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
		div#fixture-page-breadcrumbs p.fixture-name {
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
