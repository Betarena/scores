<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup, log_info_group } from "$lib/utils/debug";

  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from "$lib/store/user-settings";
	import { get } from "$lib/api/utils";
	import { get_livescores_now, get_odds } from "$lib/firebase/scoreboard";
	import { onValue, ref, type Unsubscribe } from "firebase/database";
	import { db_real } from "$lib/firebase/init";

	import type { 
    REDIS_CACHE_SINGLE_lineups_data, 
    REDIS_CACHE_SINGLE_lineups_translation 
  } from "$lib/models/fixtures/lineups/types";

	// import ScoreboardLoader from "./Scoreboard_Loader.svelte";
	import LineupsLoader from "./Lineups_Loader.svelte";
	import LineupVectorMobile from "./Lineup_Vector_Mobile.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // export let FIXTURE_INFO:       REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let FIXTURE_LINEUPS:              REDIS_CACHE_SINGLE_lineups_data
  export let FIXTURE_LINEUPS_TRANSLATION:  REDIS_CACHE_SINGLE_lineups_translation

  let loaded:            boolean = false;           // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;           // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;           // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;               // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;
  let selected_view:     'home' | 'away' = 'home';  // [ℹ] change "mobile-only" view on TEAM-LINEUPS

  const formation_pos_arr = [
    'G',
    'D',
    'M',
    'A'
  ]

  let currentSeason:     number = undefined;

  // [🐞]
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "fixtures | lineups [DEV]";

  // [🐞]
  $: if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `FIXTURE_LINEUPS: ${FIXTURE_LINEUPS}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  // [ℹ] Not In Use
  async function widget_init (
  ): Promise < REDIS_CACHE_SINGLE_lineups_data > {

    // [ℹ] get response [lang] [data] [obtained from preload()]
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(3000);

    loaded = true;

    // [ℹ] data validation check
		if (
      FIXTURE_LINEUPS == undefined
    ) {
      // [🐞]
      if (dev) logDevGroup (`${dev_console_tag}`, `❌ no data available!`)
      no_widget_data = true;
			return;
		}
    // [ℹ] otherwise, no data
    else {
      no_widget_data = false;
    }

    FIXTURE_LINEUPS = FIXTURE_LINEUPS

    return FIXTURE_LINEUPS;
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
    no_widget_data = false
    // widget_init()
    setTimeout(async() => {
      refresh = false
    }, 100)
  }

  afterNavigate(async () => {
    widget_init()
  })

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div
  id='widget-outer'>

  <!-- 
  [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <div 
      id="seo-widget-box">
      <p>{FIXTURE_LINEUPS?.home?.team_name}</p>
      {#each FIXTURE_LINEUPS?.home?.lineup as player}
        <p>{player?.player_name}</p>
      {/each}
      <p>{FIXTURE_LINEUPS?.away?.team_name}</p>
      {#each FIXTURE_LINEUPS?.away?.lineup as player}
        <p>{player?.player_name}</p>
      {/each}
    </div>
  {/if}

  <!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if
    no_widget_data && 
    loaded}

    <!-- [ℹ] no-widget-data-avaiable-placeholder container 
    -->
    <div
      id='no-widget-box'
      class='column-space-center'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      <!-- 
      [ℹ] no-visual-asset
      -->
      {#if $userBetarenaSettings.theme == 'Dark'}
        <img 
          src={no_visual_dark} 
          alt="no_visual_dark"
          width=32px
          height=32px
          class='m-b-16'
        />
      {:else}
        <img 
          src={no_visual} 
          alt="no_visual"
          width=32px
          height=32px
          class='m-b-16'
        />
      {/if}
      
      <!-- 
      [ℹ] container w/ text 
      -->
      <div>
        <p 
          class='s-14 m-b-8 w-500'
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {FIXTURE_LINEUPS_TRANSLATION?.no_info}
        </p>
        <p class='s-14 color-grey w-400'> 
          {FIXTURE_LINEUPS_TRANSLATION?.no_info_desc}
        </p>
      </div>
    </div>
  {/if}

  <!-- 
  [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if
    !no_widget_data &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker}

    <!-- <LineupsLoader /> -->

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <LineupsLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <h2
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0px;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {FIXTURE_LINEUPS_TRANSLATION?.title}
      </h2>

      <div
        id="lineup-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE]
        -->

        <!-- 
        [ℹ] toggle lineup team -->
        <div
          id="lineup-top-view-box-select"
          class="
            row-space-out
          ">
          <!--
          [ℹ] home team btn. -->
          <button
            class="
              row-space-start
              team-select-btn
            "
            class:activeOpt={selected_view == 'home'}
            on:click={() => selected_view = 'home'}>
            <img 
              src={FIXTURE_LINEUPS?.home?.team_logo} 
              alt=""
              width=20px
              height=20px
              class="sel-team-img"
            />
            <p
              class="
                w-500
                color-black
              ">
              {FIXTURE_LINEUPS?.home?.team_short_code}
            </p>
          </button>
          <!--
          [ℹ] away team btn. -->
          <button
            class="
              row-space-end
              team-select-btn
            "
            class:activeOpt={selected_view == 'away'}
            on:click={() => selected_view = 'away'}>
            <p
              class="
                w-500
                color-black
              ">
              {FIXTURE_LINEUPS?.away?.team_short_code}
            </p>
            <img 
              src={FIXTURE_LINEUPS?.away?.team_logo} 
              alt=""
              width=20px
              height=20px
              class="sel-team-img"
            />
          </button>
        </div>

        <!-- 
        [ℹ] team visiualization -->
        <div
          id="lineup-vector-box">
          <div
            id="lineup-vector">
            <LineupVectorMobile />
          </div>
          <!-- 
          [ℹ] lineup - absolute box -->
          <div
            id="overlay-player-pos-box">
            {#each formation_pos_arr as pos}
              <div
                id="overlay-column">
                {#each FIXTURE_LINEUPS[selected_view].lineup as team}
                  {#if pos == team?.position}
                    <div
                      class="
                        column-space-center
                      ">
                      <!-- 
                      [ℹ] player avatar -->
                      <img 
                        src={team?.player_avatar} 
                        alt=""
                        width=32px
                        height=32px
                        class="lineup-img"
                      />
                      <!-- 
                      [ℹ] player name -->
                      <p
                        class="
                          w-500
                          color-black
                          lineup-player-name
                        ">
                        {team?.player_name}
                        <br/>
                        <span>
                          {team?.number}
                        </span>
                      </p>
                    </div>
                  {/if}
                {/each}
              </div>
            {/each}
          </div>
        </div>
        
        <!-- 
        [ℹ] selected lineup - home / away (logo) -->
        <div
          class="
            row-space-start
            team-main-select
          ">
          <!-- 
          [ℹ] team icon -->
          <img 
            src={FIXTURE_LINEUPS[selected_view].team_logo} 
            alt=""
            width=40px
            height=40px
            class="main-team-img"
          />
          <!-- 
          [ℹ] team name -->
          <p
            class="
              w-500
              color-black
            ">
            {FIXTURE_LINEUPS[selected_view].team_name}
            <br/>
            <span
              class="
                w-400
                color-grey
              ">
              {FIXTURE_LINEUPS[selected_view].formation}
            </span>
          </p>
        </div>

        <!-- 
        [ℹ] selected lineup - home / away -->
        <div
          class="lineup-box">
          <!-- 
          [ℹ] coach single - home / away -->
          <div
            class="
              row-space-start
              player-row
            ">
            <!-- 
            [ℹ] player avatar -->
            <img 
              src={FIXTURE_LINEUPS[selected_view]?.coach_avatar} 
              alt=""
              width=40px
              height=40px
              class="lineup-img"
            />
            <!-- 
            [ℹ] player name -->
            <p
              class="
                w-500
                color-black
                lineup-player-name
              ">
              {FIXTURE_LINEUPS[selected_view]?.coach_name}
              <br/>
              <span
                class="
                  w-400
                  color-grey
                ">
                {FIXTURE_LINEUPS_TRANSLATION['c']}
              </span>
            </p>
          </div>
          <!-- 
          [ℹ] rest of lineup-team -->
          {#each FIXTURE_LINEUPS[selected_view].lineup as team}
            <div
              class="
                row-space-start
                player-row
              ">
              <!-- 
              [ℹ] player avatar -->
              <img 
                src={team?.player_avatar} 
                alt=""
                width=40px
                height=40px
                class="lineup-img"
              />
              <!-- 
              [ℹ] player name -->
              <p
                class="
                  w-500
                  color-black
                  lineup-player-name
                ">
                {team?.player_name}
                <br/>
                <span
                  class="
                    w-400
                    color-grey
                  ">
                  {FIXTURE_LINEUPS_TRANSLATION[team?.position.toLowerCase()]}
                </span>
              </p>
            </div>
          {/each}
        </div>

        <!-- 
        [ℹ] [TABLET] && [DESKTOP]
        TODO:
        -->

      </div>

    <!-- 
    [ℹ] promise was rejected
    -->
    {:catch error}
      {error}
    {/await}

  {/if}

</div>

<!-- ===============
  COMPONENT STYLE
=================-->

<style>

  /* [ℹ] OTHER STYLE / CSS */

  /* EMPTY */

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
    [ℹ] NOTE: [MOBILE-FIRST]
  */

  /* lineups-main */
  #lineup-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: none;
  }

  /* top-box btn view select */
  div#lineup-top-view-box-select {
    margin: 20px 20px 0 20px;
    /* override */
    width: auto;
  } div#lineup-top-view-box-select button.team-select-btn {
    background-color: transparent;
    border: 1px solid #CCCCCC !important;
    width: 100%;
    padding: 10px;
    max-height: 40px;
  } div#lineup-top-view-box-select button.team-select-btn:hover:active,
    div#lineup-top-view-box-select button.team-select-btn.activeOpt {
    border: 1px solid #F5620F !important;
  } div#lineup-top-view-box-select button.team-select-btn:first-child {
    border-radius: 8px 0px 0px 8px;
  } div#lineup-top-view-box-select button.team-select-btn:first-child img.sel-team-img {
    margin-right: 8px; 
  } div#lineup-top-view-box-select button.team-select-btn:last-child {
    border-radius: 0px 8px 8px 0px;
  } div#lineup-top-view-box-select button.team-select-btn:last-child img.sel-team-img {
    margin-left: 8px; 
  }

  /* lineup-vector box */
  div#lineup-vector-box {
    position: relative;
    padding: 8px 20px;
  } div#lineup-vector-box div#lineup-vector {
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: 8px 20px;
  } div#lineup-vector-box div#overlay-player-pos-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    align-content: center;
    /* dynamic */
    z-index: 1;
    position: relative;
    padding: 15px;
  } div#lineup-vector-box div#overlay-player-pos-box div#overlay-column {
    display: grid;
    gap: 8px;
  } div#lineup-vector-box div#overlay-player-pos-box div#overlay-column img.lineup-img {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);
    object-fit: contain;
    border-radius: 50%;
  } div#lineup-vector-box div#overlay-player-pos-box div#overlay-column p.lineup-player-name,
    div#lineup-vector-box div#overlay-player-pos-box div#overlay-column p.lineup-player-name span {
    text-align: center;
    /* dynamic */
    font-size: 10px;
  }

  /* main team select */
  div.team-main-select {
    padding: 15px 0;
    margin: 0 20px 8px 20px;
    border-bottom: 1px solid #E6E6E6;
  } div.team-main-select img.main-team-img {
    /* dynamic */
    margin-right: 16px;
  } div.team-main-select p {
    /* dynamic */
    font-size: 14px;
  }

  /* lineup-box */
  div.lineup-box div.player-row {
    padding: 8px 20px;
  } div.lineup-box div.player-row:last-child {
    padding: 8px 20px 20px 20px;
  } div.lineup-box div.player-row img.lineup-img {
    object-fit: contain;
    border-radius: 50%;
    border: 1px solid #E6E6E6;
    /* dynamic */
    margin-right: 16px;
  } div.lineup-box div.player-row p.lineup-player-name {
    /* dynamic */
    font-size: 14px;
  }

  /* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #lineup-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
    
  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
    
  }

  /* 
  DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #lineup-widget-container {
      min-width: 100%;
    }

  }

  /* 
  DESKTOP [L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */


</style>
