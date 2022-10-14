<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->


<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SvelteSeo from 'svelte-seo';
  import type { PageData } from './$types';

	export let data: PageData;

  /*
    [v1] - Testing with Standard Imports (client-side)
  */

  import FeaturedMatchWidget from '$lib/components/home/featured_match/_FeaturedMatch_Widget.svelte';
  import FeaturedBettingSitesWidget from '$lib/components/home/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
  import LeagueListWidget from '$lib/components/home/league_list/_LeagueList_Widget.svelte';
  import LiveScoresWidget from '$lib/components/home/live_scores_football/_LiveScores_Widget.svelte';
  import BestGoalscorersWidget from '$lib/components/home/best_goalscorers/_Best_Goalscorers_Widget.svelte';
  import SeoBlock from '$lib/components/home/seo_block_homepage/_SEO_Block.svelte';
  import LeaguesTableWidget from '$lib/components/home/leagues_table/_Leagues_Table_Widget.svelte';

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

	import type { Cache_Single_Homepage_SEO_Translation_Response, Hasura_Complete_Pages_SEO } from '$lib/models/_main_/pages_and_seo/types';
  import type { LiveScores_Football_Translation } from '$lib/models/home/live_scores_football/types';
  import type { Cache_Single_Lang_Featured_Match_Translation_Response, FixtureResponse } from '$lib/models/home/featured_match/interface-fixture';
  import type { All_SportBook_Details_Data, Cache_Single_Lang_Featured_Betting_Site_Translation_Response } from '$lib/models/home/featured_betting_sites/firebase-real-db-interface';
  import type { Cache_Single_Geo_GoalScorers_Translation_Response, Cache_Single_Lang_GoalScorers_Translation_Response } from '$lib/models/home/best_goalscorer/types';
  import type { REDIS_CACHE_SINGLE_league_list_geo_data_response, REDIS_CACHE_SINGLE_league_list_seo_t_response } from '$lib/models/home/league_list/types';
  import type { Cache_Single_Geo_Leagues_Table_Translation_Response, Cache_Single_Lang_Leagues_Table_Translation_Response } from '$lib/models/home/leagues_table/types';
  import type { Cache_Single_Homepage_SEO_Block_Translation_Response } from '$lib/models/home/seo_block/types';

	let PAGE_DATA_SEO:                              Cache_Single_Homepage_SEO_Translation_Response
	let FEATURED_MATCH_WIDGET_DATA_SEO:             Cache_Single_Lang_Featured_Match_Translation_Response
	let FEATURED_BETTING_SITES_WIDGET_DATA_SEO:     Cache_Single_Lang_Featured_Betting_Site_Translation_Response
  let BEST_GOAL_SCORERS_DATA_SEO:                 Cache_Single_Lang_GoalScorers_Translation_Response
	let LEAGUE_LIST_WIDGET_DATA_SEO:                REDIS_CACHE_SINGLE_league_list_seo_t_response
  let LEAGUES_TABLE_SCORES_SEO_DATA:              Cache_Single_Lang_Leagues_Table_Translation_Response
  let SEO_BLOCK_DATA:                             Cache_Single_Homepage_SEO_Block_Translation_Response
	let LIVE_SCORES_FOOTBALL_TRANSLATIONS:          LiveScores_Football_Translation[]
	let LIVESCORES_FOOTBALL_TOURNAMENTS:            any


  $: PAGE_DATA_SEO =                              $page.data.PAGE_DATA_SEO;
  $: FEATURED_MATCH_WIDGET_DATA_SEO =             $page.data.FEATURED_MATCH_WIDGET_DATA_SEO;
  $: FEATURED_BETTING_SITES_WIDGET_DATA_SEO =     $page.data.FEATURED_BETTING_SITES_WIDGET_DATA_SEO;
  $: BEST_GOAL_SCORERS_DATA_SEO =                 $page.data.BEST_GOAL_SCORERS_DATA_SEO;
  $: LEAGUE_LIST_WIDGET_DATA_SEO =                $page.data.LEAGUE_LIST_WIDGET_DATA_SEO;
  $: LEAGUES_TABLE_SCORES_SEO_DATA =              $page.data.LEAGUES_TABLE_SCORES_SEO_DATA;
  $: SEO_BLOCK_DATA =                             $page.data.SEO_BLOCK_DATA;
  $: LIVE_SCORES_DATA_DATA_SEO =                  $page.data.LIVE_SCORES_DATA_DATA_SEO;
	$: LIVE_SCORES_DATA_LEAGUES =                   $page.data.LIVE_SCORES_DATA_LEAGUES;
	$: LIVE_SCORES_FOOTBALL_TRANSLATIONS =          $page.data.LIVE_SCORES_FOOTBALL_TRANSLATIONS;
	$: LIVESCORES_FOOTBALL_TOURNAMENTS =          $page.data.LIVESCORES_FOOTBALL_TOURNAMENTS;
  
  // [ℹ] ALT.
  // [ℹ] pre-loading [GEO]

  let FEATURED_MATCH_WIDGET_DATA_MAIN: FixtureResponse
  let FEATURED_BETTING_SITES_WIDGET_DATA: All_SportBook_Details_Data
  let LEAGUE_LIST_WIDGET_DATA: REDIS_CACHE_SINGLE_league_list_geo_data_response
  let BEST_GOAL_SCORERS_DATA: Cache_Single_Geo_GoalScorers_Translation_Response
  let LEAGUES_TABLE_SCORES_DATA: Cache_Single_Geo_Leagues_Table_Translation_Response;

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

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
        <svelte:component this={LiveScoresWidget} {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS} {LIVESCORES_FOOTBALL_TOURNAMENTS}/>
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
        <svelte:component this={LiveScoresWidget} {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS}  {LIVESCORES_FOOTBALL_TOURNAMENTS} />
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