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
	export async function load({ url, params, fetch }) {
    
		// ... 🐛 debugging;
		if (dev) console.debug('ℹ preloading data');

		// ... ℹ get featured-match-response-seo-data;
		const response_featured_match = await fetch('/api/featured_match/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());
		// ... 🐛 debugging;
		// if (dev) console.debug('-- preloaded_translations_response_qty --', response);

		// ... ℹ get featured_betting_sites-response-seo-data;
		const response_featured_betting_sites = await fetch('/api/featured_betting_sites/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());
		// ... 🐛 debugging;
		// if (dev) console.debug('-- preloaded_translations_response_qty --', response);

		// ... ℹ get league_list-response-seo-data;
		const response_league_list = await fetch('/api/league_list/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());
		// ... 🐛 debugging;
		// if (dev) console.debug('-- preloaded_translations_response_qty --', response);
		
		// ... ℹ get seo_page-response-seo-data;
		const response_seo_page = await fetch('/api/page_seo/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());
		// ... 🐛 debugging;
		// if (dev) console.debug('-- preloaded_translations_response_qty --', response);

    // ... ℹ get seo_page-response-seo-data;
		const response_best_goalscorers = await fetch('/api/best_goalscorer/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());
		// ... 🐛 debugging;
		// if (dev) console.debug('-- preloaded_translations_response_qty --', response);

    // ... ℹ get livescore-widget-response-seo-data;
		const response_livescores_football = await fetch('/api/live_scores/cache-seo.json?lang='+url['pathname'].substring(1), {
			method: 'GET'
		}).then((r) => r.json());

		const response_livescores_football_leagues = await fetch('/api/live_scores/cache-data.json', {
			method: 'GET'
		}).then((r) => r.json());

		const response_livescores_football_translations = await fetch('/api/live_scores/cache-translations.json', {
			method: 'GET'
		}).then((r) => r.json());

		// ... ℹ return, RESPONSE DATA;
		if (response_featured_match && response_featured_betting_sites) {
			return {
				props: {
					FEATURED_MATCH_WIDGET_DATA_SEO: response_featured_match,
					FEATURED_BETTING_SITES_WIDGET_DATA_SEO: response_featured_betting_sites,
					LEAGUE_LIST_WIDGET_DATA_SEO: response_league_list,
					PAGE_DATA_SEO: response_seo_page,
					LIVE_SCORES_DATA_DATA_SEO : response_livescores_football,
					LIVE_SCORES_DATA_LEAGUES : response_livescores_football_leagues,
					LIVE_SCORES_FOOTBALL_TRANSLATIONS : response_livescores_football_translations,
          BEST_GOAL_SCORERS_DATA_SEO: response_best_goalscorers
				}
			};
		}
		// ... ℹ otherwise, ERROR;
		return {
			status: 500,
			error: new Error(`/ page-preloading-error`)
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
	import FeaturedMatchWidget from '$lib/components/featured_match/_FeaturedMatch_Widget.svelte';
	import FeaturedBettingSitesWidget from '$lib/components/featured_betting_sites/_FeaturedBettingSitesWidget.svelte';
	import LeagueListWidget from '$lib/components/league_list/_LeagueList_Widget.svelte';
  import LiveScoresWidget from '$lib/components/live_scores_football/_LiveScores_Widget.svelte';
  import BestGoalscorersWidget from '$lib/components/best_goalscorers/_Best_Goalscorers_Widget.svelte';

	import type { Hasura_Complete_Pages_SEO } from '$lib/models/page_seo/types';
  import type { LiveScores_Football_Translation } from '$lib/models/live_scores_football/types';

	export let FEATURED_MATCH_WIDGET_DATA_SEO;
	export let FEATURED_BETTING_SITES_WIDGET_DATA_SEO;
	export let LEAGUE_LIST_WIDGET_DATA_SEO;
  export let BEST_GOAL_SCORERS_DATA_SEO;
	export let PAGE_DATA_SEO: Hasura_Complete_Pages_SEO;
	export let LIVE_SCORES_DATA_DATA_SEO;
	export let LIVE_SCORES_DATA_LEAGUES;
	export let LIVE_SCORES_FOOTBALL_TRANSLATIONS: LiveScores_Football_Translation[];

	// ... page-language-declaration;
	let server_side_language: string = 'en';
	// ... language-translation-declaration;
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

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// MOBILE - VIEW
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

<!-- ... adding SEO-META-TAGS for PAGE ... -->
{#each PAGE_DATA_SEO.scores_seo_homepage_dev as item}
	{#if item.lang == server_side_language}
		<!-- content here -->
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


<!-- ===================
	COMPONENT HTML
=================== -->

<section id="home-page">
	
	{#if !mobileExclusive}
		<!-- ... 1st ROW ... -->
		<div> 
			<LeagueListWidget {LEAGUE_LIST_WIDGET_DATA_SEO} />
		</div>
	{/if}

  {#if !mobileExclusive}
    <!-- ... 2nd ROW ... -->
    <div >
      <LiveScoresWidget {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS}/>
    </div>
    <!-- ... 3rd ROW ... -->
    <div 
      class='grid-display-column'>
      <!-- ... widget #1 ... -->
      <FeaturedMatchWidget {FEATURED_MATCH_WIDGET_DATA_SEO} />
      <!-- ... widget #2 ... -->
      <FeaturedBettingSitesWidget {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} />
      <!-- ... widget #3 -->
      <BestGoalscorersWidget {BEST_GOAL_SCORERS_DATA_SEO} />
    </div>
  {:else}
    <!-- ... 3rd ROW ... -->
    <div 
      class='grid-display-column'>
      <div >
		    <LiveScoresWidget {LIVE_SCORES_DATA_DATA_SEO} {LIVE_SCORES_DATA_LEAGUES} {LIVE_SCORES_FOOTBALL_TRANSLATIONS}/>
      </div>
      <!-- ... widget #1 ... -->
      <FeaturedBettingSitesWidget {FEATURED_BETTING_SITES_WIDGET_DATA_SEO} />
      <!-- ... widget #2 ... -->
      <FeaturedMatchWidget {FEATURED_MATCH_WIDGET_DATA_SEO} />
      <!-- ... widget #3 -->
      <BestGoalscorersWidget {BEST_GOAL_SCORERS_DATA_SEO} />
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
