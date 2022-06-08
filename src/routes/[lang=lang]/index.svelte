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
    fetch 
  }) {

    const response_seo_page = await fetch('/api/pages_and_seo/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());

    // [ℹ] validate URL existance;
    if (!response_seo_page.scores_urls_dev.urlsArr.includes(url.pathname)) {

      // [ℹ] otherwise, ERROR;
      return {
        status: 404,
        error: new Error("Uh-oh! This page does not exist!")
      }
    }
    
    /**
     * GET PRE-LOADED-PAGE-DATA:
     * ------------------------
     * ➤ GET featured match data;
     * ➤ GET featured_betting_sites data;
     * ➤ GET league_list data;
     * ➤ GET seo_page data;
     * ➤ GET seo_page data;
     * ➤ GET best_goalscorers data;
     * ➤ GET leagues_table data;
     * ➤ GET livescores_football data;
     * ➤ GET livescores_football_leagues data;
     * ➤ GET livescores_football_translations data;
    */

		const response_featured_match = await fetch('/api/featured_match/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());

		const response_featured_betting_sites = await fetch('/api/featured_betting_sites/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());

		const response_league_list = await fetch('/api/league_list/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());
		
		const response_best_goalscorers = await fetch('/api/best_goalscorer/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());

    const response_leagues_table = await fetch('/api/leagues_table/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());

		const response_livescores_football = await fetch('/api/live_scores/cache-seo.json?lang='+url['pathname'].substring(1), {
			method: 'GET'
		}).then((r) => r.json());

		const response_livescores_football_leagues = await fetch('/api/live_scores/cache-data.json', {
			method: 'GET'
		}).then((r) => r.json());

		const response_livescores_football_translations = await fetch('/api/live_scores/cache-translations.json', {
			method: 'GET'
		}).then((r) => r.json());

    let FeaturedMatchWidget = (await import('$lib/components/featured_match/_FeaturedMatch_Widget.svelte')).default;
    let FeaturedBettingSitesWidget = (await import('$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte')).default;
    let	LeagueListWidget = (await import('$lib/components/league_list/_LeagueList_Widget.svelte')).default;
    let	LiveScoresWidget = (await import('$lib/components/live_scores_football/_LiveScores_Widget.svelte')).default;
    let BestGoalscorersWidget = (await import('$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte')).default;
    let SeoBlock = (await import('$lib/components/seo_block_homepage/_SEO_Block.svelte')).default;
    let LeaguesTableWidget = (await import('$lib/components/leagues_table/_Leagues_Table_Widget.svelte')).default;

		// [ℹ] validate, DATA RETURNED;
		if (response_featured_match && 
        response_featured_betting_sites &&
        response_league_list && 
        response_seo_page &&
        response_best_goalscorers &&
        response_leagues_table &&
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
          FEATURED_MATCH_WIDGET_DATA_SEO: response_featured_match,
          FEATURED_BETTING_SITES_WIDGET_DATA_SEO: response_featured_betting_sites,
          LEAGUE_LIST_WIDGET_DATA_SEO: response_league_list,
          PAGE_DATA_SEO: response_seo_page,
          LEAGUES_TABLE_SCORES_SEO_DATA: response_leagues_table,
          LIVE_SCORES_DATA_DATA_SEO : response_livescores_football,
          LIVE_SCORES_DATA_LEAGUES : response_livescores_football_leagues,
          LIVE_SCORES_FOOTBALL_TRANSLATIONS : response_livescores_football_translations,
          BEST_GOAL_SCORERS_DATA_SEO: response_best_goalscorers,

          FeaturedMatchWidget: FeaturedMatchWidget,
          FeaturedBettingSitesWidget: FeaturedBettingSitesWidget,
          LeagueListWidget: LeagueListWidget,
          LiveScoresWidget: LiveScoresWidget,
          BestGoalscorersWidget: BestGoalscorersWidget,
          SeoBlock: SeoBlock,
          LeaguesTableWidget: LeaguesTableWidget
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

  export let FeaturedMatchWidget;
  export let FeaturedBettingSitesWidget;
  export let LeagueListWidget;
  export let LiveScoresWidget;
  export let BestGoalscorersWidget;
  export let SeoBlock;
  export let LeaguesTableWidget;

	import SvelteSeo from 'svelte-seo';

  // let FeaturedMatchWidget;
  // let FeaturedBettingSitesWidget;
  // let LeagueListWidget;
  // let LiveScoresWidget;
  // let BestGoalscorersWidget;
  // let SeoBlock;
  // let LeaguesTableWidget;

	// ... import sub-components;
	// import FeaturedMatchWidget from '$lib/components/featured_match/_FeaturedMatch_Widget.svelte';
	// import FeaturedBettingSitesWidget from '$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
	// import LeagueListWidget from '$lib/components/league_list/_LeagueList_Widget.svelte';
	// import LiveScoresWidget from '$lib/components/live_scores_football/_LiveScores_Widget.svelte';
  // import BestGoalscorersWidget from '$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte';
  // import SeoBlock from '$lib/components/seo_block_homepage/_SEO_Block.svelte';
  // import LeaguesTableWidget from '$lib/components/leagues_table/_Leagues_Table_Widget.svelte';

  // onMount(async () => {
	// 	FeaturedMatchWidget = (await import('$lib/components/featured_match/_FeaturedMatch_Widget.svelte')).default;
	// 	FeaturedBettingSitesWidget = (await import('$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte')).default;
	// 	LeagueListWidget = (await import('$lib/components/league_list/_LeagueList_Widget.svelte')).default;
	// 	LiveScoresWidget = (await import('$lib/components/live_scores_football/_LiveScores_Widget.svelte')).default;
	// 	BestGoalscorersWidget = (await import('$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte')).default;
	// 	SeoBlock = (await import('$lib/components/seo_block_homepage/_SEO_Block.svelte')).default;
	// 	LeaguesTableWidget = (await import('$lib/components/leagues_table/_Leagues_Table_Widget.svelte')).default;
	// });

	import type { Hasura_Complete_Pages_SEO } from '$lib/models/pages_and_seo/types';
  import type { LiveScores_Football_Translation } from '$lib/models/live_scores_football/types';

	export let FEATURED_MATCH_WIDGET_DATA_SEO;
	export let FEATURED_BETTING_SITES_WIDGET_DATA_SEO;
	export let LEAGUE_LIST_WIDGET_DATA_SEO;
  export let BEST_GOAL_SCORERS_DATA_SEO;
	export let PAGE_DATA_SEO: Hasura_Complete_Pages_SEO;
  let SEO_BLOCK_DATA = PAGE_DATA_SEO;
  export let LEAGUES_TABLE_SCORES_SEO_DATA;
	export let LIVE_SCORES_DATA_DATA_SEO;
	export let LIVE_SCORES_DATA_LEAGUES;
	export let LIVE_SCORES_FOOTBALL_TRANSLATIONS: LiveScores_Football_Translation[];

	// [ℹ] page-language-declaration;
	let server_side_language: string = 'en';
	// [ℹ] language-translation-declaration;
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~
	 * This function loads when all of the
	 * rest of the components have loaded
	 * and rendered, checking via JS the viewport
	 * of the client device and changing between
	 * appropiate components to display the correct
	 * component, tailored to a specifc device.
  */
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


<!-- [ℹ] adding SEO-META-TAGS for PAGE -->
{#each PAGE_DATA_SEO.scores_seo_homepage_dev as item}
	{#if item.lang == server_side_language}
		<!-- [ℹ] content here 
    -->
		<SvelteSeo
			title={item.main_data.title}
			description={item.main_data.description}
			keywords={item.main_data.keywords}
			noindex={JSON.parse(item.main_data.noindex.toString())}
			nofollow={JSON.parse(item.main_data.nofollow.toString())}
			canonical={item.main_data.canonical}
			twitter={item.twitter_card}
			openGraph={item.opengraph}
		/>
	{/if}
{/each}

<svelte:head>
  <!-- ... ℹ head content 
  -->
  {#if PAGE_DATA_SEO}
    <!-- ... ℹ content here 
    -->
    {#each PAGE_DATA_SEO.scores_hreflang_dev as item}
      <!-- ... ℹ content here 
      -->
      {#if item.link == null}
        <!-- content here -->
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