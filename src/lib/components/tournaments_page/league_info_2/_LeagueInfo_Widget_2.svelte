<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // [ℹ] svelte-imports;
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup } from "$lib/utils/debug";

  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from "$lib/store/user-settings";

  import type { 
    Cache_Single_Tournaments_League_Info_Data_Response 
  } from "$lib/models/tournaments/league-info/types";

  import LeagueInfoWidget_2ContentLoader from "./_LeagueInfo_Widget_2_ContentLoader.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  let loaded:                   boolean = false;                // [ℹ] holds boolean for data loaded;
  let refresh:                  boolean = false;                // [ℹ] refresh value speed of the WIDGET;
	let refresh_data:             any = undefined;                // [ℹ] refresh-data value speed;
  let noWidgetData:             any = false;                    // [ℹ] identifies the noWidgetData boolean;
  let trueLengthOfArray:        number;

  let diasbleDev:               boolean = false;
  let devConsoleTag:            string = "TOP_PLAYER";

  let currentSeason:            number = undefined;

	export let LEAGUE_INFO_SEO_DATA: Cache_Single_Tournaments_League_Info_Data_Response;

  $: if (dev && diasbleDev) logDevGroup ("league info #2 [DEV]", `LEAGUE_INFO_SEO_DATA: ${LEAGUE_INFO_SEO_DATA}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(): Promise < Cache_Single_Tournaments_League_Info_Data_Response > {

    // [ℹ] get response [lang] [data] [obtained from preload()]
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(3000);

		if (LEAGUE_INFO_SEO_DATA == null || LEAGUE_INFO_SEO_DATA == undefined) {
      // [🐛] debug 
      if (dev) logDevGroup ("league info #2 [DEV]", `❌ no data available!`)
      noWidgetData = true;
			return;
		}
    // [ℹ] otherwise, revert back to DATA AVAILABLE;
    else {
      noWidgetData = false;
    }

    // [🐛] debug TEST WIDGET MISSING DATA
    // noWidgetData = true;
    // loaded = false;

    loaded = true;

    return LEAGUE_INFO_SEO_DATA;
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
    refresh = true
    loaded = false
    noWidgetData = false
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
  $: if (browser && $sessionStore.selectedSeasonID != undefined && !loadedCurrentSeason) {
    currentSeason = $sessionStore.selectedSeasonID;
    loadedCurrentSeason = true;
  }

  $: if (browser && $sessionStore.selectedSeasonID != undefined) {
    // selectPlayerView(dropdownPlayerViewSelect)
  }

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div
  id='widget-outer'>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <div 
      id="seo-widget-box">
      <h1>{LEAGUE_INFO_SEO_DATA.data.name}</h1>
      <p>{LEAGUE_INFO_SEO_DATA.data.country}</p>
    </div>
  {/if}

  <!-- [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if 
    noWidgetData && 
    !loaded}

    <!-- [ℹ] title of the widget 
    -->
    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {LEAGUE_INFO_SEO_DATA?.data?.translation?.league_info}
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
          No League Info Available 
        </p>
        <p class='s-14 color-grey w-400'> 
          Sorry, at this time there is no league info available! 
        </p>
      </div>
    </div>
  {/if}

  <!-- [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if 
    !noWidgetData &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker && 
    !diasbleDev}

    <!-- [ℹ] promise is pending 
    -->
    {#await widgetInit()}
      <LeagueInfoWidget_2ContentLoader />
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
        {LEAGUE_INFO_SEO_DATA?.data?.translation?.league_info}
      </h2>

      <div
        id="top-players-widget-container"
        class:widget-no-data-height={trueLengthOfArray == 0}
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <div
          class="row-space-start m-b-16">
          <img 
            class="m-r-10"
            src={LEAGUE_INFO_SEO_DATA?.data?.image_path}
            alt=""
            width=24px height=24px
            style="object-fit: contain;"
          />
          <p
            class="s-16 color-black-2 w-500">
            {LEAGUE_INFO_SEO_DATA?.data?.name}
          </p>
        </div>
        
        {#each LEAGUE_INFO_SEO_DATA?.data?.seasons as season}
          {#if season.id === $sessionStore.selectedSeasonID}
            
            <div
              style="padding: 0 0 4px 0;"
              class="league-info-row row-space-out">
              <p
                class="s-14 color-grey">
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.teams}:
              </p>
              <p
                class="s-14 color-black-2 w-500">
                {#if season?.number_of_clubs == null || season?.number_of_clubs == undefined}
                   -
                {:else}
                  {season?.number_of_clubs}
                {/if}
              </p>
            </div>

            <div 
              class="league-info-row row-space-out">
              <p
                class="s-14 color-grey">
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.goals}:
              </p>
              <p
                class="s-14 color-black-2 w-500">
                {#if season?.goals == null || season?.goals == undefined}
                   -
                {:else}
                  {season?.goals}
                {/if}
              </p>
            </div>

            <div
              class="league-info-row row-space-out">
              <p
                class="s-14 color-grey">
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.average_goals}:
              </p>
              <p
                class="s-14 color-black-2 w-500">
                {#if season?.avg_goals == null || season?.avg_goals == undefined}
                   -
                {:else}
                  {season?.avg_goals}
                {/if}
              </p>
            </div>

            <div
              class="league-info-row row-space-out">
              <p
                class="s-14 color-grey">
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.win_percentage}:
              </p>
              <p
                class="s-14 color-black-2 w-500">
                {#if season?.win_p == null || season?.win_p == undefined}
                   -
                {:else}
                  {season?.win_p}%
                {/if}
              </p>
            </div>

            <div
              class="league-info-row row-space-out">
              <p
                class="s-14 color-grey">
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.average_player_rating}:
              </p>
              <p
                class="s-14 color-black-2 w-500">
                {#if season?.avg_player_r == null || season?.avg_player_r == undefined}
                   -
                {:else}
                  {season?.avg_player_r}
                {/if}
              </p>
            </div>

          {/if}
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

  /* NaN */

  /* [ℹ] SEO WIDGET DATA */
  
  #seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  /* [ℹ] NO DATA WIDGET STYLE / CSS */

  #no-widget-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-align: center;
  }

  /*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] MOBILE FIRST
  */

  div#top-players-widget-container.widget-no-data-height {
    height: 832px;
  }

  #top-players-widget-container {
    padding: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    position: relative;
    padding: 20px;
  }

  div.league-info-row {
    padding: 14px 0 4px 0;
    border-bottom: 1px solid #E6E6E6;
  } div.league-info-row:first-child {
    padding: 0 0 4px 0;
  } div.league-info-row:last-child {
    border-bottom: none;
  }
  
  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #top-players-widget-container {
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

    #top-players-widget-container {
      min-width: 100%;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  .dark-background-1 div.league-info-row {
    border-bottom: 1px solid #616161;
  }


</style>
