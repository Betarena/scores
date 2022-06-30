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

    /**
     * ==================
     * [ℹ] Attempt to Identify the USERS IP from "pre-load()"
     * [ℹ] only works in PROD with deployment of 'my_server.js'
    */

    if (!dev) {
      // ⚠❌ does not appear to work
      // const response_IP = await fetch(`/getClientIP`, {
      //   method: 'GET'
      // }).then((r) => r.json());
      // console.log("response_IP: ", response_IP);
      
      // 🤔✅ works ? only on `same-origin-domain-deployment`
      // response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
      // console.log("response_IP_2: ", response_IP_2);
    }

    // [ℹ] testing-hooks
    if (dev) console.log("SESSION: ", session);

    /**
     * ==================
     * [ℹ] Ensure URL Check Existance;
     * [disabled]
     * [check-made-as-a-complex-PROMISE]
    */

    /*
      const response_valid_url = await fetch(
        `/api/pages_and_seo/cache-seo.json?url=`+url.pathname, 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      // [ℹ] validate URL existance;
      if (!response_valid_url) {
        // [ℹ] otherwise, ERROR;
        return {
          status: 404,
          error: new Error("Uh-oh! This page does not exist!")
        }
      }
    */

    const urlLang: string = params.lang == undefined ? 'en' : params.lang

    /**
     * ==================
     * [ℹ] Loading of (this) page [homepage] SEO-READY DATA; 
     * [disabled]
     * [check-made-as-a-complex-PROMISE]
    */

    /*
      const response_homepage_seo = await fetch(
        '/api/pages_and_seo/cache-seo.json?lang='+urlLang+"&page=homepage", 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_featured_match_seo = await fetch(
        '/api/featured_match/cache-data.json?lang='+urlLang, 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_featured_betting_sites_seo = await fetch(
        '/api/featured_betting_sites/cache-data.json?lang='+urlLang, 
        {
          method: 'GET' 
        }
      ).then((r) => r.json());

      const response_best_goalscorers_seo = await fetch(
        '/api/best_goalscorer/cache-data.json?lang='+urlLang, 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_league_list_seo = await fetch(
        '/api/league_list/cache-data.json?lang='+urlLang, 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_leagues_table_seo = await fetch(
        '/api/leagues_table/cache-data.json?lang='+urlLang, 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_seo_block_seo = await fetch(
        '/api/seo_block/cache-data.json?lang='+urlLang, 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_livescores_football = await fetch(
        '/api/live_scores/cache-seo.json?lang='+urlLang, 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_livescores_football_leagues = await fetch(
        '/api/live_scores/cache-data.json', 
        {
          method: 'GET'
        }
      ).then((r) => r.json());

      const response_livescores_football_translations = await fetch('/api/live_scores/cache-translations.json', {
        method: 'GET'
      }).then((r) => r.json());
    */

    /**
     * ==================
     * [ℹ] testing widget GEO data loading experimentation
    */

    /*
      // [ℹ] correct ? not sure... seems to work and pass GB for me
      const userGeoResponse: GeoJsResponse = await getUserLocation()
      console.log("userGeoResponse_s", userGeoResponse.country_code.toLowerCase())

      // ⚠ sometiemes correct on the `console` on client mostly [server-side]
      const userGeoResponse_v2 = await fetch('https://get.geojs.io/v1/ip/geo.json', {
        method: 'GET'
      }).then((r) => r.json());
      console.log("userGeoResponse_s2", userGeoResponse_v2.country_code.toLowerCase())

    */

      // [ℹ] correct ? not sure... seems to work and pass GB for me
      const userGeoResponse_v3 = await get(`https://get.geojs.io/v1/ip/geo.json`);
      // console.log("userGeoResponse_s3", userGeoResponse_v3.country_code.toLowerCase())

    //  const userGeo: string = userGeoResponse_v3.country_code.toLowerCase()
    /*

      const response_featured_match: FixtureResponse = fetch(
        '/api/featured_match/cache-data.json?geoPos='+userGeo, 
        {
        method: 'GET'
        }
      )

      const response_featured_betting_sites: All_SportBook_Details_Data = fetch(
        '/api/featured_betting_sites/cache-data.json?geoPos='+userGeo, 
        {
        method: 'GET'
        }
      )

      const response_league_list: Cache_Single_Geo_LeagueList_Translation_Response = fetch(
        '/api/league_list/cache-data.json?geoPos='+userGeo, 
        {
        method: 'GET'
        }
      )

      const response_best_goalscorers: Cache_Single_Geo_GoalScorers_Translation_Response = fetch(
        '/api/best_goalscorer/cache-data.json?geoPos='+userGeo, 
        {
        method: 'GET'
        }
      )

      const response_leagues_table: Cache_Single_Geo_Leagues_Table_Translation_Response = fetch(
        '/api/leagues_table/cache-data.json?geoPos='+userGeo, 
        {
        method: 'GET'
        }
      )
    */

    /**
     * [ℹ] =================
     * [ℹ] further API FETCH enhancing via bundeling requests;
     * [ℹ] https://stackoverflow.com/questions/43691808/http-performance-many-small-requests-or-one-big-one
     * [ℹ] https://svelte.dev/repl/ec6f6b61329f4f43ae049464d73d8158?version=3.23.1
     * [ℹ] https://svelte.dev/repl/16b375da9b39417dae837b5006799cb4?version=3.25.0
     * [ℹ] =================
    */


    const urls = [
      '/api/pages_and_seo/cache-seo.json?lang='+urlLang+"&page=homepage",
      '/api/featured_match/cache-data.json?lang='+urlLang,
      '/api/featured_betting_sites/cache-data.json?lang='+urlLang,
      '/api/best_goalscorer/cache-data.json?lang='+urlLang,
      '/api/league_list/cache-data.json?lang='+urlLang,
      '/api/leagues_table/cache-data.json?lang='+urlLang,
      '/api/seo_block/cache-data.json?lang='+urlLang,
      // [ℹ] page validation check;
      `/api/pages_and_seo/cache-seo.json?url=`+url.pathname,
      // [ℹ] livescores
      '/api/live_scores/cache-seo.json?lang='+urlLang, 
      '/api/live_scores/cache-data.json', 
      '/api/live_scores/cache-translations.json',

      '/api/featured_match/cache-data.json?geoPos='+'en', 
      '/api/featured_betting_sites/cache-data.json?geoPos='+'en', 
      '/api/league_list/cache-data.json?geoPos='+'en', 
      '/api/best_goalscorer/cache-data.json?geoPos='+'en', 
      '/api/leagues_table/cache-data.json?geoPos='+'en', 
    ];

    const promises = urls.map((url) =>
      fetch(url)
      .then((response) => response.json())
    );

    const data = await Promise.all(promises);

    // [🐛] debug
    if (dev) console.log("pre-load() data: ", data)

    const response_homepage_seo = data[0]
    const response_featured_match_seo = data[1]
    const response_featured_betting_sites_seo = data[2]
    const response_best_goalscorers_seo = data[3]
    const response_league_list_seo = data[4]
    const response_leagues_table_seo = data[5]
    const response_seo_block_seo = data[6]
    const response_livescores_football = data[8]
    const response_livescores_football_leagues = data[9]
    const response_livescores_football_translations = data[10]

    // [ℹ] data-geo real-test [direct widget data]

    // const response_featured_match = data[11]
    // const response_featured_betting_sites = data[12]
    // const response_league_list = data[13]
    // const response_best_goalscorers = data[14]
    // const response_leagues_table = data[15]

    const response_valid_url = data[7]

    if (!response_valid_url) {
      // [ℹ] otherwise, ERROR;
      return {
        status: 404,
        error: new Error("Uh-oh! This page does not exist!")
      }
    }

		// [ℹ] validate, DATA RETURNED;
		if (response_homepage_seo) {

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

          // [ℹ] data-geo real-test [direct widget data]
          
          // FEATURED_MATCH_WIDGET_DATA_MAIN : response_featured_match,
          // FEATURED_BETTING_SITES_WIDGET_DATA : response_featured_betting_sites,
          // BEST_GOAL_SCORERS_DATA : response_best_goalscorers,
          // LEAGUE_LIST_WIDGET_DATA : response_league_list,
          // LEAGUES_TABLE_SCORES_DATA: response_leagues_table
          // SEO_BLOCK_DATA: response_seo_block_seo,

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
	import { browser, dev } from '$app/env';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SvelteSeo from 'svelte-seo';

  /*
    [v1] - Testing with Standard Imports (client-side)
  */

  import FeaturedMatchWidget from '$lib/components/featured_match/_FeaturedMatch_Widget.svelte';
  import FeaturedBettingSitesWidget from '$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
  import LeagueListWidget from '$lib/components/league_list/_LeagueList_Widget.svelte';
  import LiveScoresWidget from '$lib/components/live_scores_football/_LiveScores_Widget.svelte';
  import BestGoalscorersWidget from '$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte';
  import SeoBlock from '$lib/components/seo_block_homepage/_SEO_Block.svelte';
  import LeaguesTableWidget from '$lib/components/leagues_table/_Leagues_Table_Widget.svelte';

  /*
    [v2] - Testing with Dynamic Imports (client-side)
    [FASTER OPTION]
  */

  /*
  let FeaturedMatchWidget;
  let FeaturedBettingSitesWidget;
  let LeagueListWidget;
  let LiveScoresWidget;
  let BestGoalscorersWidget;
  let SeoBlock;
  let LeaguesTableWidget;

  onMount(async () => {
    FeaturedMatchWidget = (await import('$lib/components/featured_match/_FeaturedMatch_Widget.svelte')).default;
    FeaturedBettingSitesWidget = (await import('$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte')).default;
    LeagueListWidget = (await import('$lib/components/league_list/_LeagueList_Widget.svelte')).default;
    LiveScoresWidget = (await import('$lib/components/live_scores_football/_LiveScores_Widget.svelte')).default;
    BestGoalscorersWidget = (await import('$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte')).default;
    SeoBlock = (await import('$lib/components/seo_block_homepage/_SEO_Block.svelte')).default;
    LeaguesTableWidget = (await import('$lib/components/leagues_table/_Leagues_Table_Widget.svelte')).default;
  });
  */

	import type { Cache_Single_Homepage_SEO_Translation_Response, Hasura_Complete_Pages_SEO } from '$lib/models/pages_and_seo/types';
  import type { LiveScores_Football_Translation } from '$lib/models/live_scores_football/types';
  import type { Cache_Single_Lang_Featured_Match_Translation_Response, FixtureResponse } from '$lib/models/featured_match/interface-fixture';
  import type { All_SportBook_Details_Data, Cache_Single_Lang_Featured_Betting_Site_Translation_Response } from '$lib/models/featured_betting_sites/firebase-real-db-interface';
  import type { Cache_Single_Geo_GoalScorers_Translation_Response, Cache_Single_Lang_GoalScorers_Translation_Response } from '$lib/models/best_goalscorer/types';
  import type { Cache_Single_Geo_LeagueList_Translation_Response, Cache_Single_Lang_LeagueList_Translation_Response } from '$lib/models/league_list/types';
  import type { Cache_Single_Geo_Leagues_Table_Translation_Response, Cache_Single_Lang_Leagues_Table_Translation_Response } from '$lib/models/leagues_table/types';
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

  export let FEATURED_MATCH_WIDGET_DATA_MAIN: FixtureResponse
  export let FEATURED_BETTING_SITES_WIDGET_DATA: All_SportBook_Details_Data
  export let LEAGUE_LIST_WIDGET_DATA: Cache_Single_Geo_LeagueList_Translation_Response
  export let BEST_GOAL_SCORERS_DATA: Cache_Single_Geo_GoalScorers_Translation_Response
  export let LEAGUES_TABLE_SCORES_DATA: Cache_Single_Geo_Leagues_Table_Translation_Response;

  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
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
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
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
		});
	});

</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- [ℹ] adding SEO-META-TAGS for (this) PAGE 
-->
{#if PAGE_DATA_SEO}
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
  [SEO-WIDGETS]
=================== -->

<!-- [ℹ] SEO-DATA-LOADED 
{#if !browser &&
  PAGE_DATA_SEO &&
  FEATURED_MATCH_WIDGET_DATA_SEO &&
  FEATURED_BETTING_SITES_WIDGET_DATA_SEO && 
  BEST_GOAL_SCORERS_DATA_SEO &&
  LEAGUE_LIST_WIDGET_DATA_SEO && 
  LEAGUES_TABLE_SCORES_SEO_DATA &&
  SEO_BLOCK_DATA &&
  LIVE_SCORES_DATA_DATA_SEO}
  
  <div 
    id="seo-widget-container">
    
    <!-- [ℹ] BEST-GOAL-SCORERS-SEO-BOX 
    - ->
    <div>
      <h2>{BEST_GOAL_SCORERS_DATA_SEO.translations.widget_translations.best_goal_scorers}</h2>
      <p>{BEST_GOAL_SCORERS_DATA_SEO.translations.widget_translations.goals}</p>
      <p>{BEST_GOAL_SCORERS_DATA_SEO.translations.widget_translations.odds}</p>
      <p>{BEST_GOAL_SCORERS_DATA_SEO.translations.widget_translations.player}</p>
      <p>{BEST_GOAL_SCORERS_DATA_SEO.translations.widget_translations.show_more_players}</p>
      <!-- [ℹ] list all of the players in the DB 
      - ->
      {#each BEST_GOAL_SCORERS_DATA_SEO.top_geo_goalscorer_players as WIDGET_BEST_PLAYER}
        <p>{WIDGET_BEST_PLAYER.common_name}</p>
      {/each}
    </div>

    <!-- [ℹ] FEATURED-BETTING-SITES-BOX 
    - ->
    <div>
      <p>{FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.widget_title}</p>
      <p>{FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.title}</p>
    </div>

    <!-- [ℹ] FEATURED-MATCH-SEO-BOX 
    - ->
    <div>
      <p>{FEATURED_MATCH_WIDGET_DATA_SEO.widget_title}</p>
      <p>{FEATURED_MATCH_WIDGET_DATA_SEO.vote}</p>
      <p>{FEATURED_MATCH_WIDGET_DATA_SEO.assists}</p>
      <p>{FEATURED_MATCH_WIDGET_DATA_SEO.rating}</p>
      <p>{FEATURED_MATCH_WIDGET_DATA_SEO.player}</p>
      <p>{FEATURED_MATCH_WIDGET_DATA_SEO.matches}</p>
      <p>{FEATURED_MATCH_WIDGET_DATA_SEO.goals}</p>
    </div>

    <!-- [ℹ] LEAGUE_LIST-SEO-BOX 
    - ->
    <div>
      <!-- [ℹ] translation-expressions 
      - ->
      <p>{LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.widget_title}</p>
      <p>{LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.top_leagues}</p>
      <p>{LEAGUE_LIST_WIDGET_DATA_SEO.translations.translations.leagues_by_country}</p>
      <!-- [ℹ] all-leagues-expressions 
      - ->
      {#each LEAGUE_LIST_WIDGET_DATA_SEO.all_leagues_list as league}
        <p>{league.league_name}</p>
      {/each}
      <!-- [ℹ] all-unique-country-expressions 
      - ->
      {#each LEAGUE_LIST_WIDGET_DATA_SEO.unique_county_list as country}
        <p>{country.country_name}</p>
      {/each}
    </div>

    <!-- [ℹ] LEAGUE_TABLE-SEO-BOX 
    - ->
    <div>
      <h2>{LEAGUES_TABLE_SCORES_SEO_DATA.translations.title}</h2>
      <!-- [ℹ] list all of the seasons & leagues in the DB 
      -- >
      {#each LEAGUES_TABLE_SCORES_SEO_DATA.top_leagues_table_data as WIDGET_SEASON_LEAGUE}
        <p>{WIDGET_SEASON_LEAGUE.season_league_name}</p>
        <!-- [ℹ] list all of the seasons & leagues -> TEAMS in the DB 
        - ->
        {#each WIDGET_SEASON_LEAGUE.season_league_teams as WIDGET_TEAM_LEAGUE}
          <p>{WIDGET_TEAM_LEAGUE.team_name}</p>
        {/each}
      {/each}
    </div>

    <!-- [ℹ] LIVESCORES-SEO-BOX 
    - ->
    <div>
      {#each LIVE_SCORES_DATA_DATA_SEO as d}
        <p>{d.visitorteam}</p>
        <p>{d.localteam}</p>
        {#if d.tip != "" }
          <a href="{d.tip}">{d.tip}</a>
        {/if}
        {#if d.link != "" }
          <a href="{d.link}">{d.link}</a>
        {/if}
      {/each}
    </div>

    <!-- [ℹ] LEAGUE_TABLE-SEO-BOX 
    - ->
    <div>
      <h2>{LEAGUES_TABLE_SCORES_SEO_DATA.translations.title}</h2>
      <!-- [ℹ] list all of the seasons & leagues in the DB 
      - ->
      {#each LEAGUES_TABLE_SCORES_SEO_DATA.top_leagues_table_data as WIDGET_SEASON_LEAGUE}
        <p>{WIDGET_SEASON_LEAGUE.season_league_name}</p>
        <!-- [ℹ] list all of the seasons & leagues -> TEAMS in the DB 
        - ->
        {#each WIDGET_SEASON_LEAGUE.season_league_teams as WIDGET_TEAM_LEAGUE}
          <p>{WIDGET_TEAM_LEAGUE.team_name}</p>
        {/each}
      {/each}
    </div>

    <!-- [ℹ] SEO-BOX 
    - ->
    <div>
      <h2>{SEO_BLOCK_DATA.title}</h2>
      {@html SEO_BLOCK_DATA.html}
    </div>

  </div>
{/if}
-->

<!-- ===================
	COMPONENT HTML
=================== -->

<section id="home-page">

  <!-- [ℹ] DESKTOP & TABLET VIEW ONLY -->
  {#if !tabletExclusive && !mobileExclusive}
    <!-- [ℹ] 1st ROW -->
		<div> 
			<!-- <LeagueListWidget {LEAGUE_LIST_WIDGET_DATA_SEO} /> -->
      <svelte:component this={LeagueListWidget} {LEAGUE_LIST_WIDGET_DATA_SEO} {LEAGUE_LIST_WIDGET_DATA} />
		</div>
    <!-- [ℹ] 2nd ROW -->
    <div 
      class='grid-display-column'>
      <!-- [ℹ] widget #1 -->
      <div>
        <!-- <LiveScoresWidget {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS}/> -->
        <svelte:component this={LiveScoresWidget} {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS} />
      </div>
      <!-- [ℹ] widget #2 -->
      <!-- <SeoBlock {SEO_BLOCK_DATA} />  -->
      <svelte:component this={SeoBlock} {SEO_BLOCK_DATA} />
    </div>
    
    <!-- [ℹ] 3rd ROW -->
    <div 
      class='grid-display-column'>
      <!-- [ℹ] widget #1 -->
      <!-- <FeaturedMatchWidget {FEATURED_MATCH_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedMatchWidget} {FEATURED_MATCH_WIDGET_DATA_SEO} {FEATURED_MATCH_WIDGET_DATA_MAIN} />
      <!-- [ℹ] widget #2 -->
      <!-- <FeaturedBettingSitesWidget {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedBettingSitesWidget} {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} {FEATURED_BETTING_SITES_WIDGET_DATA} />
      <!-- [ℹ] widget #3 -->
      <!-- <BestGoalscorersWidget {BEST_GOAL_SCORERS_DATA_SEO} /> -->
      <svelte:component this={BestGoalscorersWidget} {BEST_GOAL_SCORERS_DATA_SEO} {BEST_GOAL_SCORERS_DATA} />
      <!-- [ℹ] widget #4 -->
      <!-- <LeaguesTableWidget {LEAGUES_TABLE_SCORES_SEO_DATA} /> -->
      <svelte:component this={LeaguesTableWidget} {LEAGUES_TABLE_SCORES_SEO_DATA} {LEAGUES_TABLE_SCORES_DATA} />
    </div>
  <!-- [ℹ] MOBILE VIEW ONLY -->
  {:else}
    <!-- [ℹ] 3rd ROW -->
    <div 
      class='grid-display-column'>
      <!-- [ℹ] widget #1 -->
      <div>
		    <!-- <LiveScoresWidget {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS}/> -->
        <svelte:component this={LiveScoresWidget} {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS} />
      </div>
      <!-- [ℹ] widget #2 -->
      <!-- <FeaturedBettingSitesWidget {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedBettingSitesWidget} {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} {FEATURED_BETTING_SITES_WIDGET_DATA}  />
      <!-- [ℹ] widget #3 -->
      <!-- <FeaturedMatchWidget {FEATURED_MATCH_WIDGET_DATA_SEO} /> -->
      <svelte:component this={FeaturedMatchWidget} {FEATURED_MATCH_WIDGET_DATA_SEO} {FEATURED_MATCH_WIDGET_DATA_MAIN} />
      <!-- [ℹ] widget #4 -->
      <!-- <BestGoalscorersWidget {BEST_GOAL_SCORERS_DATA_SEO} /> -->
      <svelte:component this={BestGoalscorersWidget} {BEST_GOAL_SCORERS_DATA_SEO}  {BEST_GOAL_SCORERS_DATA}/>
      {#if tabletExclusive && !mobileExclusive}
        <!-- content here -->
        <!-- [ℹ] widget #4 -->
        <!-- <LeaguesTableWidget {LEAGUES_TABLE_SCORES_SEO_DATA} /> -->
        <svelte:component this={LeaguesTableWidget} {LEAGUES_TABLE_SCORES_SEO_DATA} {LEAGUES_TABLE_SCORES_DATA} />
      {/if}
      <!-- [ℹ] widget #5 -->
      <!-- <SeoBlock {SEO_BLOCK_DATA} />  -->
      <svelte:component this={SeoBlock} {SEO_BLOCK_DATA} />
    </div>
  {/if}
  
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>

  #seo-widget-container {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

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