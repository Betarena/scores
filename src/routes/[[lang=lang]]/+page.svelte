<!-- ===================
	COMPONENT JS - BASIC 
=================== -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	import { viewport_change } from '$lib/utils/platform-functions';

	import BestGoalscorersWidget from '$lib/components/page/home/best_goalscorers/_Best_Goalscorers_Widget.svelte';
	import FeaturedBettingSitesWidget from '$lib/components/page/home/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
	import FeaturedMatchWidget from '$lib/components/page/home/featured_match/_FeaturedMatch_Widget.svelte';
	import LeaguesTableWidget from '$lib/components/page/home/leagues_table/_Leagues_Table_Widget.svelte';
	import LeagueListWidget from '$lib/components/page/home/league_list/_LeagueList_Widget.svelte';
	import LivescoresWidget from '$lib/components/page/home/livescores-v2/Livescores_Widget.svelte';
	import SeoBlock from '$lib/components/page/home/seo_block_homepage/_SEO_Block.svelte';
	import SvelteSeo from 'svelte-seo';

	import { get } from '$lib/api/utils';
	import { genLiveFixMap, listenRealTimeLivescoresNowChange } from '$lib/firebase/common';
	import { getLivescoresNow } from '$lib/firebase/fixtures_odds';
	import type { FIREBASE_livescores_now } from '$lib/models/firebase';
	import type { Cache_Single_Lang_GoalScorers_Translation_Response } from '$lib/models/home/best_goalscorer/types';
	import type { Cache_Single_Lang_Featured_Betting_Site_Translation_Response } from '$lib/models/home/featured_betting_sites/firebase-real-db-interface';
	import type { Cache_Single_Lang_Featured_Match_Translation_Response } from '$lib/models/home/featured_match/interface-fixture';
	import type { Cache_Single_Lang_Leagues_Table_Translation_Response } from '$lib/models/home/leagues_table/types';
	import type { REDIS_CACHE_SINGLE_league_list_seo_t_response } from '$lib/models/home/league_list/types';
	import type { LiveScores_Football_Translation } from '$lib/models/home/live_scores_football/types';
	import type { Cache_Single_Homepage_SEO_Block_Translation_Response } from '$lib/models/home/seo_block/types';
	import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';
	import type { Cache_Single_Homepage_SEO_Translation_Response } from '$lib/models/_main_/pages_and_seo/types';
	import { sessionStore } from '$lib/store/session';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import type { Unsubscribe } from 'firebase/database';

	let PAGE_DATA_SEO: Cache_Single_Homepage_SEO_Translation_Response;
	let FEATURED_MATCH_WIDGET_DATA_SEO: Cache_Single_Lang_Featured_Match_Translation_Response;
	let FEATURED_BETTING_SITES_WIDGET_DATA_SEO: Cache_Single_Lang_Featured_Betting_Site_Translation_Response;
	let BEST_GOAL_SCORERS_DATA_SEO: Cache_Single_Lang_GoalScorers_Translation_Response;
	let LEAGUE_LIST_WIDGET_DATA_SEO: REDIS_CACHE_SINGLE_league_list_seo_t_response;
	let LEAGUES_TABLE_SCORES_SEO_DATA: Cache_Single_Lang_Leagues_Table_Translation_Response;
	let SEO_BLOCK_DATA: Cache_Single_Homepage_SEO_Block_Translation_Response;
	let LIVE_SCORES_FOOTBALL_TRANSLATIONS: LiveScores_Football_Translation[];
	let LIVESCORES_FOOTBALL_TOURNAMENTS: any;

	$: PAGE_DATA_SEO = $page.data?.PAGE_DATA_SEO;
	$: FEATURED_MATCH_WIDGET_DATA_SEO =
		$page.data?.FEATURED_MATCH_WIDGET_DATA_SEO;
	$: FEATURED_BETTING_SITES_WIDGET_DATA_SEO =
		$page.data
			?.FEATURED_BETTING_SITES_WIDGET_DATA_SEO;
	$: BEST_GOAL_SCORERS_DATA_SEO =
		$page.data?.BEST_GOAL_SCORERS_DATA_SEO;
	$: LEAGUE_LIST_WIDGET_DATA_SEO =
		$page.data?.LEAGUE_LIST_WIDGET_DATA_SEO;
	$: LEAGUES_TABLE_SCORES_SEO_DATA =
		$page.data?.LEAGUES_TABLE_SCORES_SEO_DATA;
	$: SEO_BLOCK_DATA = $page.data?.SEO_BLOCK_DATA;
	$: LIVE_SCORES_DATA_DATA_SEO =
		$page.data?.LIVE_SCORES_DATA_DATA_SEO;
	$: LIVE_SCORES_DATA_LEAGUES =
		$page.data?.LIVE_SCORES_DATA_LEAGUES;
	$: LIVE_SCORES_FOOTBALL_TRANSLATIONS =
		$page.data?.LIVE_SCORES_FOOTBALL_TRANSLATIONS;
	$: LIVESCORES_FOOTBALL_TOURNAMENTS =
		$page.data?.LIVESCORES_FOOTBALL_TOURNAMENTS;

  // ~~~~~~~~~~~~~~~~~~~~~
  //  PAGE METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  let FIREBASE_CONNECTIONS_SET: Set<Unsubscribe> = new Set()

  /**
   * @description obtains the target sportbook data 
   * information based on users geo-location;
   * data gathered at page-level and set to svelte-stores
   * to be used by (this) page components;
   * NOTE: best approach
   * TODO: can be moved to a layout-level [?]
   * TODO: can be moved to a header-level [?]
   * TODO: can be moved to a +server-level [⚠️]
   * @returns {Promise<void>} void
   */
  async function sportbookIdentify(
  ): Promise < void > {
    if (!$userBetarenaSettings.country_bookmaker) {
      return;
    }
    const userGeo = $userBetarenaSettings?.country_bookmaker.toLowerCase()
    $sessionStore.sportbook_main = await get(`/api/cache/tournaments/sportbook?geoPos=${userGeo}`) as Cache_Single_SportbookDetails_Data_Response;
    $sessionStore.sportbook_list = await get(`/api/cache/tournaments/sportbook?all=true&geoPos=${userGeo}`) as Cache_Single_SportbookDetails_Data_Response[];
    $sessionStore.sportbook_list = $sessionStore.sportbook_list.sort(
			(a, b) =>
				parseInt(a.position) -
				parseInt(b.position)
		);
  }

  $: if ($userBetarenaSettings.country_bookmaker) {
    sportbookIdentify()
  }

  onMount(async() => {

    const firebase_real_time =
			await getLivescoresNow();
		if (firebase_real_time != null) {
			const data: [
				string,
				FIREBASE_livescores_now
			][] = Object.entries(firebase_real_time);
			genLiveFixMap(data);
		}

    let connectionRef = await listenRealTimeLivescoresNowChange()
    FIREBASE_CONNECTIONS_SET.add(connectionRef)
    sportbookIdentify()
    document.addEventListener(
			'visibilitychange',
			async function () {
				if (!document.hidden) {
					let connectionRef = await listenRealTimeLivescoresNowChange()
          FIREBASE_CONNECTIONS_SET.add(connectionRef)
				}
			}
		);
  })

  // CRITICAL
	onDestroy(async () => {
		const logsMsg: string[] = []
		for (const connection of [...FIREBASE_CONNECTIONS_SET]) {
      logsMsg.push('✅ closing connection')
			connection();
		}
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive,
		tabletExclusive: boolean = false;

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

</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- 
[ℹ] adding SEO-META-TAGS for (this) PAGE 
-->
{#if PAGE_DATA_SEO}
	<SvelteSeo
		title={PAGE_DATA_SEO.main_data.title}
		description={PAGE_DATA_SEO.main_data
			.description}
		keywords={PAGE_DATA_SEO.main_data.keywords}
		noindex={JSON.parse(
			PAGE_DATA_SEO.main_data.noindex.toString()
		)}
		nofollow={JSON.parse(
			PAGE_DATA_SEO.main_data.nofollow.toString()
		)}
		canonical={PAGE_DATA_SEO.main_data.canonical}
		twitter={PAGE_DATA_SEO.twitter_card}
		openGraph={PAGE_DATA_SEO.opengraph}
	/>
{/if}

<!-- 
[ℹ] adding HREFLANG-TAGS for (this) PAGE
-->
<svelte:head>
	{#if PAGE_DATA_SEO}
		{#each PAGE_DATA_SEO.hreflang as item}
			{#if item.link == null}
				<link
					rel="alternate"
					hreflang={item.hreflang}
					href="https://scores.betarena.com/"
				/>
			{:else}
				<link
					rel="alternate"
					hreflang={item.hreflang}
					href="https://scores.betarena.com/{item.link}"
				/>
			{/if}
		{/each}
	{/if}
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<section 
  id="home-page">
	<!-- 
  [ℹ] DESKTOP & TABLET VIEW ONLY
  -->
	{#if !tabletExclusive && !mobileExclusive}
		<!-- 
    [ℹ] 1st ROW 
    -->
		<div>
			<LeagueListWidget
				{LEAGUE_LIST_WIDGET_DATA_SEO}
			/>
		</div>
		<!--
    [ℹ] 2nd ROW 
    -->
		<div class="grid-display-column">
      <LivescoresWidget />
			<!-- <div>
				<LiveScoresWidget
					{LIVE_SCORES_DATA_DATA_SEO}
					{LIVE_SCORES_DATA_LEAGUES}
					{LIVE_SCORES_FOOTBALL_TRANSLATIONS}
					{LIVESCORES_FOOTBALL_TOURNAMENTS}
				/>
			</div> -->
			<SeoBlock {SEO_BLOCK_DATA} />
		</div>
		<!-- 
    [ℹ] 3rd ROW 
    -->
		<div class="grid-display-column">
			<FeaturedMatchWidget
				{FEATURED_MATCH_WIDGET_DATA_SEO}
			/>
			<FeaturedBettingSitesWidget
				{FEATURED_BETTING_SITES_WIDGET_DATA_SEO}
			/>
			<BestGoalscorersWidget
				{BEST_GOAL_SCORERS_DATA_SEO}
			/>
			<LeaguesTableWidget
				{LEAGUES_TABLE_SCORES_SEO_DATA}
			/>
		</div>
		<!-- 
  [ℹ] MOBILE VIEW ONLY 
  -->
	{:else}
		<!-- 
    [ℹ] 3rd ROW 
    -->
		<div class="grid-display-column">
      <LivescoresWidget />
			<div>
				<!-- <LiveScoresWidget
					{LIVE_SCORES_DATA_DATA_SEO}
					{LIVE_SCORES_DATA_LEAGUES}
					{LIVE_SCORES_FOOTBALL_TRANSLATIONS}
					{LIVESCORES_FOOTBALL_TOURNAMENTS}
				/> -->
			</div>
			<FeaturedBettingSitesWidget
				{FEATURED_BETTING_SITES_WIDGET_DATA_SEO}
			/>
			<FeaturedMatchWidget
				{FEATURED_MATCH_WIDGET_DATA_SEO}
			/>
			<BestGoalscorersWidget
				{BEST_GOAL_SCORERS_DATA_SEO}
			/>
			{#if tabletExclusive && !mobileExclusive}
				<LeaguesTableWidget
					{LEAGUES_TABLE_SCORES_SEO_DATA}
				/>
			{/if}
			<SeoBlock {SEO_BLOCK_DATA} />
		</div>
	{/if}
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->
<style>
	section#home-page {
		display: grid;
		max-width: 1430px;
		grid-template-columns: 1fr;
		align-items: start;
	}

	div.grid-display-column {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	/* ====================
    RESPONSIVNESS
  ==================== */

	@media only screen and (min-width: 768px) {
		section#home-page {
			grid-template-columns: 1fr;
		}
	}

	@media only screen and (min-width: 1160px) {
		section#home-page {
			gap: 20px;
			grid-template-columns:
				minmax(auto, 275px) minmax(auto, 502px)
				minmax(auto, 502px);
		}
	}

	@media only screen and (min-width: 1320px) {
		section#home-page {
			gap: 20px;
			grid-template-columns:
				minmax(auto, 328px) minmax(502px, 502px)
				minmax(auto, 502px);
		}
	}
</style>
