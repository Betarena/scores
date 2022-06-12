<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    - pre-loading `featured_match` data;
=================
-->
<script lang="ts" context="module">

	/** 
	 * @type {import('@sveltejs/kit').Load} 
	*/
	export async function load({ 
    url, 
    params, 
    fetch,
    session
  }) {

    let response_IP_2;

    if (!dev) {

      // const response_IP = await fetch(`/getClientIP`, {
      //   method: 'GET'
      // }).then((r) => r.json());
      // console.log("response_IP: ", response_IP);
      
      response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
      console.log("response_IP_2: ", response_IP_2);
    }

    console.log("SESSION: ", session);

    const urlLang: string = params.lang == undefined ? 'en' : params.lang

    /**
     * [ℹ] Ensure URL Check Existance; 
    */

    const response_valid_url = await fetch(`/api/pages_and_seo/cache-seo.json?url=`+url.pathname, {
			method: 'GET'
		}).then((r) => r.json());

    // [ℹ] validate URL existance;
    if (!response_valid_url) {
      // [ℹ] otherwise, ERROR;
      return {
        status: 404,
        error: new Error("Uh-oh! This page does not exist!")
      }
    }

    /**
     * [ℹ] Loading of (this) page [homepage] SEO-READY DATA; 
    */

    const response_homepage_seo = await fetch('/api/pages_and_seo/cache-seo.json?lang='+urlLang+"&page=homepage", {
			method: 'GET'
		}).then((r) => r.json());

		const response_featured_match_seo = await fetch('/api/featured_match/cache-data.json?lang='+urlLang, {
			method: 'GET'
		}).then((r) => r.json());

		const response_featured_betting_sites_seo = await fetch('/api/featured_betting_sites/cache-data.json?lang='+urlLang, {
			method: 'GET'
		}).then((r) => r.json());

    const response_best_goalscorers_seo = await fetch('/api/best_goalscorer/cache-data.json?lang='+urlLang, {
			method: 'GET'
		}).then((r) => r.json());

    const response_league_list_seo = await fetch('/api/league_list/cache-data.json?lang='+urlLang, {
			method: 'GET'
		}).then((r) => r.json());

    const response_leagues_table_seo = await fetch('/api/leagues_table/cache-data.json?lang='+urlLang, {
			method: 'GET'
		}).then((r) => r.json());

    const response_seo_block_seo = await fetch('/api/seo_block/cache-data.json?lang='+urlLang, {
			method: 'GET'
		}).then((r) => r.json());

    // Andres's Code (Below)

		const response_livescores_football = await fetch('/api/live_scores/cache-seo.json?lang='+urlLang, {
			method: 'GET'
		}).then((r) => r.json());

		const response_livescores_football_leagues = await fetch('/api/live_scores/cache-data.json', {
			method: 'GET'
		}).then((r) => r.json());

		const response_livescores_football_translations = await fetch('/api/live_scores/cache-translations.json', {
			method: 'GET'
		}).then((r) => r.json());


    // 🤔✅ Correct ? not sure
    const userGeoResponse: GeoJsResponse = await getUserLocation()
    console.log("userGeoResponse_s", userGeoResponse.country_code.toLowerCase())

    // ⚠ sometiemes correct on the `console` on client
    const userGeoResponse_v2 = await fetch('https://get.geojs.io/v1/ip/geo.json', {
			method: 'GET'
		}).then((r) => r.json());
    console.log("userGeoResponse_s2", userGeoResponse_v2.country_code.toLowerCase())

    // 🤔✅ correct ? not sure.
    const userGeoResponse_v3 = await get(`https://get.geojs.io/v1/ip/geo.json`);
    console.log("userGeoResponse_s3", userGeoResponse_v3.country_code.toLowerCase())

    const response: Cache_Single_Geo_LeagueList_Translation_Response = await get('api/league_list/cache-data.json?geoPos='+userGeoResponse_v3.country_code.toLowerCase())

    /**
    * [v3] - Testing with Dynamic Imports (server-side) inside load() 
    */

    // let FeaturedMatchWidget = (await import('$lib/components/featured_match/_FeaturedMatch_Widget.svelte')).default;
    // let FeaturedBettingSitesWidget = (await import('$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte')).default;
    // let	LeagueListWidget = (await import('$lib/components/league_list/_LeagueList_Widget.svelte')).default;
    // let	LiveScoresWidget = (await import('$lib/components/live_scores_football/_LiveScores_Widget.svelte')).default;
    // let BestGoalscorersWidget = (await import('$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte')).default;
    // let SeoBlock = (await import('$lib/components/seo_block_homepage/_SEO_Block.svelte')).default;
    // let LeaguesTableWidget = (await import('$lib/components/leagues_table/_Leagues_Table_Widget.svelte')).default;

		// [ℹ] validate, DATA RETURNED;
		if (response_homepage_seo &&
        response_featured_match_seo && 
        response_featured_betting_sites_seo &&
        response_best_goalscorers_seo &&
        response_league_list_seo && 
        response_leagues_table_seo &&
        response_livescores_football &&
        response_livescores_football_leagues &&
        response_livescores_football_translations
      ) {

      return {
        status: 200,
        cache: {
          "maxage": 3600,
          "private": false
        },
        props: {
          PAGE_DATA_SEO: response_homepage_seo,
          FEATURED_MATCH_WIDGET_DATA_SEO: response_featured_match_seo,
          FEATURED_BETTING_SITES_WIDGET_DATA_SEO: response_featured_betting_sites_seo,
          BEST_GOAL_SCORERS_DATA_SEO: response_best_goalscorers_seo,
          LEAGUE_LIST_WIDGET_DATA_SEO: response_league_list_seo,
          LEAGUES_TABLE_SCORES_SEO_DATA: response_leagues_table_seo,
          SEO_BLOCK_DATA: response_seo_block_seo,

          LIVE_SCORES_DATA_DATA_SEO : response_livescores_football,
          LIVE_SCORES_DATA_LEAGUES : response_livescores_football_leagues,
          LIVE_SCORES_FOOTBALL_TRANSLATIONS : response_livescores_football_translations,

          response_IP_2: response_IP_2,
          userGeoResponse: userGeoResponse.country_code.toLowerCase(),
          userGeoResponse_v2: userGeoResponse_v2.country_code.toLowerCase(),
          userGeoResponse_v3: userGeoResponse_v3.country_code.toLowerCase(),

          response: response
          /**
          * [v3] - Testing with Dynamic Imports (server-side) inside load() 
          */

          // FeaturedMatchWidget: FeaturedMatchWidget,
          // FeaturedBettingSitesWidget: FeaturedBettingSitesWidget,
          // LeagueListWidget: LeagueListWidget,
          // LiveScoresWidget: LiveScoresWidget,
          // BestGoalscorersWidget: BestGoalscorersWidget,
          // SeoBlock: SeoBlock,
          // LeaguesTableWidget: LeaguesTableWidget
        }
      };

		}

		// [ℹ] otherwise, ERROR;
		return {
			status: 500,
			error: new Error(`Uh-oh! There has been an /{lang} page preloading error`)
		};

	}
</script>


<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->


<script lang="ts">
	import { dev } from '$app/env';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SvelteSeo from 'svelte-seo';

  /**
   * [v1] - Testing with Standard Imports (client-side)
  */

	import FeaturedMatchWidget from '$lib/components/featured_match/_FeaturedMatch_Widget.svelte';
	import FeaturedBettingSitesWidget from '$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
	import LeagueListWidget from '$lib/components/league_list/_LeagueList_Widget.svelte';
	import LiveScoresWidget from '$lib/components/live_scores_football/_LiveScores_Widget.svelte';
  import BestGoalscorersWidget from '$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte';
  import SeoBlock from '$lib/components/seo_block_homepage/_SEO_Block.svelte';
  import LeaguesTableWidget from '$lib/components/leagues_table/_Leagues_Table_Widget.svelte';

  /**
   * [v2] - Testing with Dynamic Imports (client-side)
  */

  // let FeaturedMatchWidget;
  // let FeaturedBettingSitesWidget;
  // let LeagueListWidget;
  // let LiveScoresWidget;
  // let BestGoalscorersWidget;
  // let SeoBlock;
  // let LeaguesTableWidget;


  // onMount(async () => {
	// 	FeaturedMatchWidget = (await import('$lib/components/featured_match/_FeaturedMatch_Widget.svelte')).default;
	// 	FeaturedBettingSitesWidget = (await import('$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte')).default;
	// 	LeagueListWidget = (await import('$lib/components/league_list/_LeagueList_Widget.svelte')).default;
	// 	LiveScoresWidget = (await import('$lib/components/live_scores_football/_LiveScores_Widget.svelte')).default;
	// 	BestGoalscorersWidget = (await import('$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte')).default;
	// 	SeoBlock = (await import('$lib/components/seo_block_homepage/_SEO_Block.svelte')).default;
	// 	LeaguesTableWidget = (await import('$lib/components/leagues_table/_Leagues_Table_Widget.svelte')).default;
	// });

  /**
   * [v3] - Testing with Dynamic Imports (server-side) inside load() 
  */

  // export let FeaturedMatchWidget;
  // export let FeaturedBettingSitesWidget;
  // export let LeagueListWidget;
  // export let LiveScoresWidget;
  // export let BestGoalscorersWidget;
  // export let SeoBlock;
  // export let LeaguesTableWidget;

	import type { Cache_Single_Homepage_SEO_Translation_Response, Hasura_Complete_Pages_SEO } from '$lib/models/pages_and_seo/types';
  import type { LiveScores_Football_Translation } from '$lib/models/live_scores_football/types';
  import type { Cache_Single_Lang_Featured_Match_Translation_Response } from '$lib/models/featured_match/interface-fixture';
  import type { Cache_Single_Lang_Featured_Betting_Site_Translation_Response } from '$lib/models/featured_betting_sites/firebase-real-db-interface';
  import type { Cache_Single_Lang_GoalScorers_Translation_Response } from '$lib/models/best_goalscorer/types';
  import type { Cache_Single_Geo_LeagueList_Translation_Response, Cache_Single_Lang_LeagueList_Translation_Response } from '$lib/models/league_list/types';
  import type { Cache_Single_Lang_Leagues_Table_Translation_Response } from '$lib/models/leagues_table/types';
  import type { Cache_Single_Homepage_SEO_Block_Translation_Response } from '$lib/models/seo_block/types';
import { getUserLocation } from '$lib/geoJs/init';
import type { GeoJsResponse } from '$lib/models/geojs-types';
import { get } from '$lib/api/utils';

	export let PAGE_DATA_SEO: Cache_Single_Homepage_SEO_Translation_Response;
	export let FEATURED_MATCH_WIDGET_DATA_SEO: Cache_Single_Lang_Featured_Match_Translation_Response;
	export let FEATURED_BETTING_SITES_WIDGET_DATA_SEO: Cache_Single_Lang_Featured_Betting_Site_Translation_Response;
  export let BEST_GOAL_SCORERS_DATA_SEO: Cache_Single_Lang_GoalScorers_Translation_Response;
	export let LEAGUE_LIST_WIDGET_DATA_SEO: Cache_Single_Lang_LeagueList_Translation_Response;
  export let LEAGUES_TABLE_SCORES_SEO_DATA: Cache_Single_Lang_Leagues_Table_Translation_Response;
  export let SEO_BLOCK_DATA: Cache_Single_Homepage_SEO_Block_Translation_Response;

	export let LIVE_SCORES_DATA_DATA_SEO;
	export let LIVE_SCORES_DATA_LEAGUES;
	export let LIVE_SCORES_FOOTBALL_TRANSLATIONS: LiveScores_Football_Translation[];

  export let response_IP_2
  export let userGeoResponse
  export let userGeoResponse_v2
  export let userGeoResponse_v3

  export let response: Cache_Single_Geo_LeagueList_Translation_Response

  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// ... TABLET - VIEW
		if (wInit >= 1160) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// ... MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// ... TABLET - VIEW
      if (wInit >= 1160) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// ... MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});

</script>


<!-- ===================
	SVELTE INJECTION TAGS
=================== -->


<!-- [ℹ] adding SEO-META-TAGS for (this) PAGE 
-->
{#if PAGE_DATA_SEO}
   <!-- content here -->
  <SvelteSeo
    title={PAGE_DATA_SEO.main_data.title}
    description={PAGE_DATA_SEO.main_data.description}
    keywords={PAGE_DATA_SEO.main_data.keywords}
    noindex={JSON.parse(PAGE_DATA_SEO.main_data.noindex.toString())}
    nofollow={JSON.parse(PAGE_DATA_SEO.main_data.nofollow.toString())}
    canonical={PAGE_DATA_SEO.main_data.canonical}
    twitter={PAGE_DATA_SEO.twitter_card}
    openGraph={PAGE_DATA_SEO.opengraph}
  />
{/if}

<!-- [ℹ] adding HREFLANG-TAGS for (this) PAGE
-->
<svelte:head>
  {#if PAGE_DATA_SEO}
    {#each PAGE_DATA_SEO.hreflang as item}
      {#if item.link == null}
        <link rel="alternate" hreflang={item.hreflang} href="https://scores.betarena.com/" />
      {:else}
        <link rel="alternate" hreflang={item.hreflang} href="https://scores.betarena.com/{item.link}" />
      {/if}
    {/each}
  {/if}
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<section id="home-page">

  <p>  {response_IP_2}
    {userGeoResponse}
    {userGeoResponse_v2}
    {userGeoResponse_v3}</p>

  <p>{response.lang}</p>
  {#each response.top_geo_leagues as item}
    {item.league_name}
  {/each}

  <!-- ... DESKTOP & TABLET VIEW ONLY ... -->
  {#if !tabletExclusive && !mobileExclusive}
    <!-- ... 1st ROW ... -->
		<div> 
			<!-- <LeagueListWidget {LEAGUE_LIST_WIDGET_DATA_SEO} /> -->
      <svelte:component this={LeagueListWidget} {LEAGUE_LIST_WIDGET_DATA_SEO} />
		</div>
    <!-- ... 2nd ROW ... -->
    <div 
      class='grid-display-column'>
      <!-- ... widget #1 ... -->
      <div>
        <!-- <LiveScoresWidget {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS}/> -->
        <svelte:component this={LiveScoresWidget} {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS} />
      </div>
      <!-- ... widget #2 ... -->
      <!-- <SeoBlock {SEO_BLOCK_DATA} />  -->
      <svelte:component this={SeoBlock} {SEO_BLOCK_DATA} />
    </div>
    
    <!-- ... 3rd ROW ... -->
    <div 
      class='grid-display-column'>
      <!-- ... widget #1 ... -->
      <!-- <FeaturedMatchWidget {FEATURED_MATCH_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedMatchWidget} {FEATURED_MATCH_WIDGET_DATA_SEO} />
      <!-- ... widget #2 ... -->
      <!-- <FeaturedBettingSitesWidget {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedBettingSitesWidget} {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} />
      <!-- ... widget #3 -->
      <!-- <BestGoalscorersWidget {BEST_GOAL_SCORERS_DATA_SEO} /> -->
      <svelte:component this={BestGoalscorersWidget} {BEST_GOAL_SCORERS_DATA_SEO} />
      <!-- ... widget #4 -->
      <!-- <LeaguesTableWidget {LEAGUES_TABLE_SCORES_SEO_DATA} /> -->
      <svelte:component this={LeaguesTableWidget} {LEAGUES_TABLE_SCORES_SEO_DATA} />
    </div>
  <!-- ... MOBILE VIEW ONLY ... -->
  {:else}
    <!-- ... 3rd ROW ... -->
    <div 
      class='grid-display-column'>
      <!-- ... widget #1 -->
      <div>
		    <!-- <LiveScoresWidget {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS}/> -->
        <svelte:component this={LiveScoresWidget} {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS} />
      </div>
      <!-- ... widget #2 ... -->
      <!-- <FeaturedBettingSitesWidget {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedBettingSitesWidget} {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} />
      <!-- ... widget #3 ... -->
      <!-- <FeaturedMatchWidget {FEATURED_MATCH_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedMatchWidget} {FEATURED_MATCH_WIDGET_DATA_SEO} />
      <!-- ... widget #4 -->
      <!-- <BestGoalscorersWidget {BEST_GOAL_SCORERS_DATA_SEO} /> -->
      <svelte:component this={BestGoalscorersWidget} {BEST_GOAL_SCORERS_DATA_SEO} />
      {#if tabletExclusive && !mobileExclusive}
        <!-- content here -->
        <!-- ... widget #4 -->
        <!-- <LeaguesTableWidget {LEAGUES_TABLE_SCORES_SEO_DATA} /> -->
        <svelte:component this={LeaguesTableWidget} {LEAGUES_TABLE_SCORES_SEO_DATA} />
      {/if}
      <!-- ... widget #5 -->
      <!-- <SeoBlock {SEO_BLOCK_DATA} />  -->
      <svelte:component this={SeoBlock} {SEO_BLOCK_DATA} />
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

	/* 
  RESPONSIVE FOR TABLET (&+) [768px] */
	@media only screen and (min-width: 768px) {
		section#home-page {
			grid-template-columns: 1fr;
		}
	}

  /* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1160px) {
		section#home-page {
			gap: 20px;
      grid-template-columns: minmax(auto, 275px) minmax(auto, 502px) minmax(auto, 502px);
		}
	}

  /* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1320px) {
		section#home-page {
			gap: 20px;
      grid-template-columns: minmax(auto, 328px) minmax(502px, 502px) minmax(auto, 502px);
		}
	}
</style>