<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // [ℹ] svelte-imports;
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page, session } from "$app/stores";
  import { browser, dev } from "$app/env";
  import { afterNavigate } from "$app/navigation";

  import { userBetarenaSettings } from "$lib/store/user-settings";

  import type { 
    REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response, 
    REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response, 
    Tournament_Fixture_Odds
  } from "$lib/models/tournaments/fixtures_odds/types";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';
  import check_league from './assets/check-league.svg';
  

  let loaded:                   boolean = false;                // [ℹ] holds boolean for data loaded;
  let refresh:                  boolean = false;                // [ℹ] refresh value speed of the WIDGET;
	let refresh_data:             any = undefined;                // [ℹ] refresh-data value speed;
  let noFixturesOddsBool:       any = false;                    // [ℹ] identifies the noFixturesOddsBool boolean;
  let toggleDropdown:           boolean = false;
  let trueLengthOfArray:        number;
  let optView:                  'round' | 'week' = 'round'
  let fixtures_arr:             Tournament_Fixture_Odds[]

  let diasbleDev:               boolean = false;
  let devConsoleTag:            string = "FIX_ODDS";

  let refreshRow:               boolean = false;

  let currentSeason:            number = undefined;

	export let FIXTURES_ODDS_T:     REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response;
	export let FIXTURES_ODDS_DATA:  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response;

  $: if (dev && diasbleDev) console.log("FIXTURES_ODDS_T: ", FIXTURES_ODDS_T)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(): Promise < REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response > {

    if (!$userBetarenaSettings.country_bookmaker || $session?.selectedSeasonID == undefined) {
      return
    }

    // [ℹ] get response [lang] [data] [obtained from preload()]

		if (FIXTURES_ODDS_T == null || FIXTURES_ODDS_DATA == undefined) {
      if (dev) console.debug('❌ no players_data available!')
      noFixturesOddsBool = true;
			return;
		}
    // [ℹ] otherwise, revert back to DATA AVAILABLE;
    else {
      noFixturesOddsBool = false;
    }

    // [🐛] debug TEST TOP PLAYERS MISSING DATA
    // noFixturesOddsBool = true;
    // loaded = false;

    // loaded = true;

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(2000);

    selectFixturesOdds();

    return FIXTURES_ODDS_DATA;
  }

  function selectTableView (opt: string) {
    selectedOpt = opt;
    refreshRow = true;
    setTimeout(async() => {
      refreshRow = false
    }, 50)
  }

  function selectFixturesOdds () {

    // [ℹ] current user (client) date
    const date = new Date();

    const target_season = FIXTURES_ODDS_DATA.seasons
      .find( ({ season_id }) => 
        season_id === $session.selectedSeasonID
      );

    let week_start: Date
    let week_end: Date
    let week_name;

    // [ℹ] identify "round" start/end dates
    if (optView === 'round') {

      const target_round = target_season.rounds
        .find( ({ s_date, e_date }) =>
          new Date(s_date) < date &&
          new Date(e_date) > date
        );

      week_start = new Date(target_round.s_date)
      week_end = new Date(target_round.e_date)
      week_name = target_round.name
    }
    // [ℹ] identify "week" start/end dates
    else {

      const target_week = target_season.weeks
        .find( ({ s_date, e_date }) =>
          new Date(s_date) < date &&
          new Date(e_date) > date
        );

      week_start = new Date(target_week.s_date)
      week_end = new Date(target_week.e_date)
      week_name = target_week.name

    }

    // [ℹ] search fixtures by target data
    fixtures_arr = target_season.fixtures
      .filter( ({ fixture_date, round, week }) => 
        new Date(fixture_date) > week_start &&
        new Date(fixture_date) < week_end
      );

  }

  function closeAllDropdowns() {
    toggleDropdown = false;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let tabletView = 1000
  let mobileView = 725
  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit <= mobileView) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// [ℹ] TABLET - VIEW
      if (w >= tabletView) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// [ℹ] MOBILE - VIEW
			if (w <= mobileView) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
  });

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE METHODS
  // [! CRITICAL !]
  // ~~~~~~~~~~~~~~~~~~~~~

	$: refresh_data = $userBetarenaSettings.country_bookmaker;

  $: if (browser && refresh_data) {
    // [ℹ] reset necessary variables;
    if (dev) console.log("League_HERE")
    refresh = true
    loaded = false
    noFixturesOddsBool = false
    // widgetInit()
    setTimeout(async() => {
      refresh = false
    }, 100)
  }

  afterNavigate(async () => {
    widgetInit()
  })

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE OTHER
  // ~~~~~~~~~~~~~~~~~~~~~

  let loadedCurrentSeason: boolean = false;
  $: if (browser && $session.selectedSeasonID != undefined && !loadedCurrentSeason) {
    currentSeason = $session.selectedSeasonID;
    loadedCurrentSeason = true;
  }

  $: if (browser && $session.selectedSeasonID != undefined) {
    selectFixturesOdds()
    if (dev) console.log(`
      ${devConsoleTag} 
      Updated season!
    `)
  }

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<!-- [ℹ] area-outside-for-close 
-->
{#if toggleDropdown}
  <div id="background-area-close" on:click={() => closeAllDropdowns()} />
{/if}

<div
  id='widget-outer'>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <div 
      id="seo-widget-box">
      {#if FIXTURES_ODDS_DATA?.seasons.length != 0}
      {/if}
      
    </div>
  {/if}

  <!-- [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if 
    noFixturesOddsBool && 
    !loaded}

    <!-- [ℹ] title of the widget 
    -->
    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {FIXTURES_ODDS_T?.matches}
    </h2>

    <!-- [ℹ] no-widget-data-avaiable-placeholder container 
    -->
    <div
      id='no-widget-box'
      class='column-space-center'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      <!-- [ℹ] no-visual-asset
      -->
      {#if $userBetarenaSettings.theme == 'Dark'}
        <img 
          src={no_visual_dark} 
          alt="no_visual_dark"
          width="32px" height="32px"
          class='m-b-16'
        />
      {:else}
        <img 
          src={no_visual} 
          alt="no_visual"
          width="32px" height="32px"
          class='m-b-16'
        />
      {/if}
      
      <!-- [ℹ] container w/ text 
      -->
      <div>
        <p 
          class='s-14 m-b-8 w-500'
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {FIXTURES_ODDS_T.no_info} </p>
        <p class='s-14 color-grey w-400'> {FIXTURES_ODDS_T.no_info_desc} </p>
      </div>
    </div>
  {/if}

  <!-- [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if 
    !noFixturesOddsBool &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker && 
    !diasbleDev}

    <!-- [ℹ] promise is pending 
    -->
    {#await widgetInit()}
      <!-- <TopPlayersWidgetContentLoader /> -->
    <!-- [ℹ] promise was fulfilled
    -->
    {:then data}

      <!-- [ℹ] widget-component [DESKTOP] [TABLET] [MOBILE]
      -->

      <!-- [ℹ] promise was fulfilled 
      -->
      <h2 
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0px;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {FIXTURES_ODDS_T?.matches}
      </h2>

      <div
        id="fixtures-odds-widget-container"
        class:widget-no-data-height={trueLengthOfArray == 0}
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        {#each fixtures_arr as item}
          {item?.fixture_date}
          {item?.teams?.away?.name}
          {item?.teams?.home?.name}
        {/each}

      </div>

    <!-- [ℹ] promise was rejected
    -->
    {:catch error}
      <!-- {error} -->
    {/await}

  {/if}

</div>

<!-- ===============
  COMPONENT STYLE
=================-->

<style>

  /* [ℹ] OTHER STYLE / CSS */

  #background-area-close {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

  /* [ℹ] NO DATA WIDGET STYLE / CSS */

  #no-widget-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-align: center;
  }

  /* [ℹ] SEO WIDGET DATA */
  
  #seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  /*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] MOBILE FIRST
  */

  div#widget-outer {
    margin-top: 24px;
  }

  div#fixtures-odds-widget-container.widget-no-data-height {
    height: 832px;
  }

  #fixtures-odds-widget-container {
    padding: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    position: relative;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #fixtures-odds-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }

  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
    /* EMPTY */
  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {

    #fixtures-odds-widget-container {
      min-width: 100%;
    }

    div#widget-outer {
      margin-top: 0;
    }

    div#widget-title-row {
      margin: 20px 20px 12.5px 20px;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

</style>
