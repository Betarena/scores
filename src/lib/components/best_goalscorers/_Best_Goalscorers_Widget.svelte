<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  // ... svelte-imports;
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from "$app/env";
	// ... external `exports` imports;
  import { post } from "$lib/api/utils";
	import { userBetarenaSettings } from '$lib/store/user-settings';
	// ... external components import;
  import BestGoalscorerRow from "./_Best_Goalscorer_Row.svelte";
  import BestGoalscorersWidgetContentLoader from "./_Best_Goalscorers_Widget_ContentLoader.svelte";
  import type { GoalScorers_Cache_Ready, GoalScorers_Cache_SEO_Ready } from "$lib/models/best_goalscorer/types";

  // ... main component variables;
	export let BEST_GOAL_SCORERS_DATA_SEO: GoalScorers_Cache_SEO_Ready;

  let staticViewRow: number;              // ... holds the `initial` number of featured sites to be displayed
  let limitViewRow: number;               // ... holds the actual, `total` limit of the list of featured sites
  let showMore: boolean = false;          // ... signals to other widget values that the lsit has expanded
  let displayShowMore: boolean = false;   // ... signal as to whether to display or not the `showMore` / `showLess` data container;
	let loaded: boolean = false;            // ... holds boolean for data loaded;
  let refresh: boolean = false;
	let refresh_data: any = undefined;

  // ... widget-language-declaration;
	let server_side_language: string = 'en';
	// ... language-translation-declaration;
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... Intializer of the Widget Function
   * ... Returns PROMISE - [INTERFACE - `FinalFeaturedSiteResponseDB`]
  */
  let trueLengthOfArray: number
  // ...
  async function widgetInit(): Promise < GoalScorers_Cache_Ready > {

    // ... ℹ get the USER-GEO-LOCATION;
		let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()
    // ... 🐛 DEBUGGING;
    if (dev) console.debug('ℹ userGeo', userGeo)

    // ... ℹ GET RESPONSE;
		const response: GoalScorers_Cache_Ready  = await post(`api/best_goalscorer/cache-data.json`, userGeo)
		// ... 🐛 DEBUGGING;
		if (dev) console.debug('ℹ widgetInit() best goalscorers cache', response)

    // ... ℹ if response is null;
		if (response == null || response == undefined) {
			// ...
			if (dev) console.debug('❌ no goal scoreres available!')
			// ... return null;
			return;
		}

    // ...
    loaded = true;

    // ... ℹ intercept the length of array;
    trueLengthOfArray = response.top_geo_goalscorer_players.length

    // ... ℹ return the FINAL Promise Value;
    return response;
  }

  // ... change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	// ...
	$: if (refresh_data) {
		// ... reset necessary variables;
		refresh = true
    setTimeout(async() => {
			refresh = false
		}, 50)
	}

  // ... show-more / show-less;
  $: if (viewportDesktop) {
    if (trueLengthOfArray > 10) {
      displayShowMore = true;
      staticViewRow = 10;
      limitViewRow = 10;
    }
  } else {
    if (trueLengthOfArray > 5) {
      displayShowMore = true;
      staticViewRow = 5;
      limitViewRow = 5;
    }
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... Toggling the Show/Hide of the
   * ... list of featured site for the website;
  */
  function toggleFullList() {
    // ... update the showMore Boolean
    showMore = !showMore;
    // ... check if the `limitViewRow` matches the `trueLengthOfArray`,
    if (limitViewRow == trueLengthOfArray) {
      // ... if so, revert back to the original number of list row items,
      limitViewRow = staticViewRow;
      return;
    }
    // ... otherwise, expand the list to the full length,
    limitViewRow = trueLengthOfArray;
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... onMount() function that verifies that
   * ... the `viewport` width is of tablet size
   * ... or greater;
  */
  let viewportDesktop: boolean;

  onMount(async () => {
    var wInit = document.documentElement.clientWidth;
    if (wInit > 767) {
      viewportDesktop = true;
    } else {
      viewportDesktop = false;
    }
    window.addEventListener("resize", function () {
      var w = document.documentElement.clientWidth;
      if (w > 767) {
        viewportDesktop = true;
      } else {
        viewportDesktop = false;
      }
    });
  });
</script>


<!-- ===============
    COMPONENT HTML 
==================== -->

<div>

  <!-- ... ℹ SEO-DATA-LOADED ... -->
  {#if !loaded}
    <!-- ... iterate over the data to find the correc language ... -->
    {#each BEST_GOAL_SCORERS_DATA_SEO.translations as WIDGET_SEO_TRANSLATION}
      <!-- ... obtain the correct widget translation ... -->
      {#if WIDGET_SEO_TRANSLATION.lang == server_side_language}
        <!-- ... SEO-BOX ... -->
        <div id="seo-featured-betting-site-box">
          <p>{WIDGET_SEO_TRANSLATION.widget_translations.best_goal_scorers}</p>
          <p>{WIDGET_SEO_TRANSLATION.widget_translations.goals}</p>
          <p>{WIDGET_SEO_TRANSLATION.widget_translations.odds}</p>
          <p>{WIDGET_SEO_TRANSLATION.widget_translations.player}</p>
          <p>{WIDGET_SEO_TRANSLATION.widget_translations.show_more_players}</p>
          <!-- ... list all of the players in the DB ... -->
          {#each BEST_GOAL_SCORERS_DATA_SEO.top_geo_goalscorer_players as WIDGET_BEST_PLAYER}
            <p>{WIDGET_BEST_PLAYER.common_name}</p>
          {/each}
        </div>
      {/if}
    {/each}
  {/if}

  <!-- ... ℹ promise is pending ... -->
  {#if !refresh}

    {#await widgetInit()}
      <BestGoalscorersWidgetContentLoader />
    <!-- ... promise was fulfilled ... -->
    {:then data}

      <!-- ... identify the correct translation via IF -->
        {#each data.translations as WIDGET_TRANSLATION}
          {#if WIDGET_TRANSLATION.lang == server_side_language}

            <!-- ... wiget-title ... -->
            <p
              id='widget-title'
              class="s-20 m-b-10 color-black w-500 w-normal"
              class:color-white={$userBetarenaSettings.theme == 'Dark'}>
              {WIDGET_TRANSLATION.widget_translations.best_goal_scorers}
            </p>

            <!-- ... widget-component ... -->
            <div 
              id="featured-list-container"
              class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>
              
              <!-- ... DESKTOP ONLY ... -->
              {#if viewportDesktop}
                <!-- ... widget-brakdown-columns-section ... -->
                <div
                  id='widget-title-row'
                  class="row-space-out"
                  style="width: auto;">
                  <p class="w-400 small color-grey">
                    {WIDGET_TRANSLATION.widget_translations.player}
                  </p>
                  <div
                    class="row-space-end">
                    <p 
                      class="w-400 small color-grey"
                      style="margin-right: 54px;">
                      {WIDGET_TRANSLATION.widget_translations.goals}
                    </p>
                    <p 
                      class="w-400 small color-grey">
                      {WIDGET_TRANSLATION.widget_translations.odds}
                    </p>
                  </div>
                </div>
              {/if}

              <!-- content here -->
              <!-- ... display the first 5 rows on Mobile; ... -->
              {#each data.top_geo_goalscorer_players.slice(0, limitViewRow) as data, i}
                  <BestGoalscorerRow 
                    pos={i+1}
                    data={data} 
                    {WIDGET_TRANSLATION} />
              {/each}

              <!-- ... show-more / show-less ... -->
              {#if displayShowMore}
                <div>
                  <p 
                    id="show-more-box" 
                    on:click={() => toggleFullList()}>
                    {#if !showMore}
                      {WIDGET_TRANSLATION.widget_translations.show_more_players}
                    {:else}
                      {WIDGET_TRANSLATION.widget_translations.show_less_players}
                    {/if}
                  </p>
                </div>
              {:else}
                <p 
                  id="show-more-box" 
                  style="padding: 5px; box-shadow: none;" 
                />
              {/if}
            </div>

          {/if}
        {/each}

    <!-- ... promise was rejected ... -->
    {:catch error}
      {error}
    {/await}

  {/if}

</div>


<!-- ===============
    COMPONENT STYLE
==================== -->

<style>
  
  #seo-featured-betting-site-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  #featured-list-container {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    max-width: 383px;
    overflow: hidden;
  }

  div#widget-title-row {
    background-color: #f2f2f2;
    border-radius: 2px;
    padding: 7px 18px 7px 40px;
    margin: 20px 20px 12.5px 20px;
  }

  #show-more-box {
    padding: 25px 130px;
    text-align: center;
    white-space: nowrap;
    color: var(--primary);
    box-shadow: inset 0px 1px 0px #ebebeb;
    cursor: pointer;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
  @media only screen and (min-width: 767px) {

    #featured-list-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {

    #featured-list-container {
      min-width: 100%;
      /* max-width: 560px; */
    }
  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

	.dark-background-1 p#show-more-box {
		box-shadow: inset 0px 1px 0px #616161 !important;
	}

	.dark-background-1 div#widget-title-row {
		background-color: #616161 !important;
	}

</style>
