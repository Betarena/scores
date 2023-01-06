<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup, log_info_group } from "$lib/utils/debug";
  import { onDestroy, onMount } from "svelte";

	import { get } from "$lib/api/utils";
	import { db_real } from "$lib/firebase/init";
	import { get_odds } from "$lib/firebase/votes";
	import { REDIS_CACHE_FIXTURE_PROBABILITIES_0 } from "$lib/graphql/fixtures/probabilities/query";
	import { initGrapQLClient } from "$lib/graphql/init_graphQL";
	import { userBetarenaSettings } from "$lib/store/user-settings";
	import { onValue, ref, type Unsubscribe } from "firebase/database";

	import type {
		FIREBASE_odds
	} from "$lib/models/firebase";
	import type { Fixture_Probabilities } from "$lib/models/fixtures/probabilities/types";
	import type {
		BETARENA_HASURA_votes_query
	} from "$lib/models/fixtures/votes/types";
	import type {
		Cache_Single_SportbookDetails_Data_Response
	} from "$lib/models/tournaments/league-info/types";

	import FixtureStatsBox from './Fixture_Stats_Box.svelte';
	import H2H_Loader from "./Head_2_Head_Loader.svelte";

	import type { Fixture_Head_2_Head, REDIS_CACHE_SINGLE_h2h_translation } from '$lib/models/fixtures/head-2-head/types';
	import type { REDIS_CACHE_SINGLE_fixtures_page_info_response } from '$lib/models/_main_/pages_and_seo/types';
  
	import { MONTH_NAMES_ABBRV } from '$lib/utils/dates';

	import { page } from '$app/stores';
	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // NOTE: NO WIDGET SPECIFIC SEO or PRE-LOAD DATA REQUIRED
  // NOTE: lazy-loaded component data
  export let FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let FIXTURE_H2H: Fixture_Head_2_Head;
  export let FIXTURE_H2H_TRANSLATION: REDIS_CACHE_SINGLE_h2h_translation;

	let FIXTURE_PROB_DATA:      Fixture_Probabilities;
  let SPORTBOOK_INFO:         Cache_Single_SportbookDetails_Data_Response;
  let SPORTBOOK_DETAILS_LIST: Cache_Single_SportbookDetails_Data_Response[];

  let loaded:            boolean = false;     // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;     // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;     // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;         // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;
  let toggleCTA:         boolean = false;
  let lazy_load_data_check: boolean = false;
  let team1Percent: number = 0;           // [ℹ] the (%) difference progress of season
  let team2Percent: number = 0;           // [ℹ] the (%) difference progress of season

  let show_placeholder:  boolean = false;     // [ℹ] [override] placeholder for "no-widget-data" for fixtures-page

  // [🐞]
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "fixtures | probabilities [DEV]";

  // [🐞]
  $: if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `FIXTURE_PROB_DATA: ${FIXTURE_PROB_DATA}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN WIDGET METHOD
  async function widget_init (
  ): Promise < void > {

    // [ℹ] [DEFAULT] [DISABLED] when ALL data PRE-LOADED (buffer)
    // const sleep = ms => new Promise(r => setTimeout(r, ms));
    // await sleep(3000);

    if (!$userBetarenaSettings.country_bookmaker) {
      return;
    }
    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] execute GRAPH-QL request;
    const VARIABLES = {
      fixture_id: FIXTURE_INFO?.data?.id
    }
    const response: BETARENA_HASURA_votes_query =
      await initGrapQLClient().request(
        REDIS_CACHE_FIXTURE_PROBABILITIES_0, 
        VARIABLES
    );
		const response_main_sportbook: Cache_Single_SportbookDetails_Data_Response = 
      await get("/api/cache/tournaments/sportbook?geoPos="+userGeo)
    ;
    const response_all_spotbooks: Cache_Single_SportbookDetails_Data_Response[] = 
      await get("/api/cache/tournaments/sportbook?all=true&geoPos="+userGeo)
    ;
    loaded = true;
    
    const responses_invalid = 
      response == undefined
      || response.historic_fixtures[0] == undefined
      || response.historic_fixtures[0]?.probabilities == undefined
      || response_main_sportbook == undefined
      || response_all_spotbooks == undefined
    ;

    // [ℹ] data validation check [#1]
		if (responses_invalid) {
      // [🐞]
      if (dev) logDevGroup (`${dev_console_tag}`, `❌ no data available!`)
      no_widget_data = true;
			return;
		}
    else {
      no_widget_data = false;
    }

    // ~~~~~~~~~~~~~~~~
    // [ℹ] data pre-processing

    SPORTBOOK_INFO = response_main_sportbook;
    SPORTBOOK_DETAILS_LIST = response_all_spotbooks;
    SPORTBOOK_DETAILS_LIST.sort((a, b) => parseInt(a.position) - parseInt(b.position))

    const HIST_FIXTURE_DATA = response.historic_fixtures[0]

    // [🐞]
    if (dev) console.log("HIST_FIXTURE_DATA", HIST_FIXTURE_DATA)

    FIXTURE_PROB_DATA = {}
    FIXTURE_PROB_DATA.id = HIST_FIXTURE_DATA?.id
    FIXTURE_PROB_DATA.probabilites = HIST_FIXTURE_DATA?.probabilities
    FIXTURE_PROB_DATA.time = HIST_FIXTURE_DATA?.time

    // [ℹ] calcuate (%) of 5 matches
    team1Percent = ((FIXTURE_H2H?.data?.wins_draws?.team_1 / 5) * 100)
    team2Percent = ((FIXTURE_H2H?.data?.wins_draws?.team_2 / 5) * 100)

    // [ℹ] regardless of STATUS, 
    // [ℹ] VOTE_DATA is shown until it is erased from "/odds"
    const fixture_time = HIST_FIXTURE_DATA?.time;
    const fixture_id = FIXTURE_INFO?.data?.id;
    const firebase_odds = await get_odds(fixture_time, fixture_id)
    if (firebase_odds.length != 0) {
      check_fixture_odds_inject(firebase_odds);
    }

    return;
  }

  /**
	 * Description
   * ---
	 * submit mutation to Hasura to update votes
   * ---
   * @param {string} vote_type - type of vote
   * @param {string} vote_val - vote value
  */
  // [ℹ] [COMMENT TEMPLATE]

  function trigger_event_google(
    action: string
  ) {
    if (action === "fixtures_football_fixtures_h2h") {
      window.gtag(
        'event', 
        "fixtures_football_fixtures_h2h", 
        { 
          'event_category': "fixtures_football_fixtures_h2h", 
          'event_label': "click_betting_site_logo", 
          'value': "click"
        }
      );
      return
    }
  }

  function closeAllDropdowns() {
    toggleCTA = false;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let tabletView = 1160;
  let mobileView = 725;
  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		if (wInit <= mobileView) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
      if (w >= tabletView) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
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

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE LANG SVELTE
  // [! CRITICAL !]
  // ~~~~~~~~~~~~~~~~~~~~~

  let server_side_language: string = 'en';
  $: if ($page.routeId != null
    && !$page.error
  ) {
    if ($page.routeId.includes("[lang=lang]")) {
		  server_side_language = $page.params.lang;
    }
    else {
      server_side_language = 'en';
    }
	  }
  else {
    server_side_language = 'en';
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // [ADD-ON] FIREBASE
  // ~~~~~~~~~~~~~~~~~~~~~

  let real_time_unsubscribe: Unsubscribe[] = []

  async function check_fixture_odds_inject(
    sportbook_list: FIREBASE_odds[]
  ) {

    // [🐞]
    const logs_name = dev_console_tag + " check_fixture_odds_inject";
    const logs: string[] = []
    logs.push(`checking odds`)

    // [ℹ] match "data.key" (fixture_id)
    // [ℹ] with available (fixture_id's)
    // [ℹ] and populate the SPORTBOOK_DETAILS
    // [ℹ] based on the "top-1" OR avaialble ODDS
    // [ℹ] for the selected GEO-POSITION
    // [ℹ] and inject to LIVE_ODDS for TARGET FIXTURE

    if (SPORTBOOK_DETAILS_LIST == undefined) {
      // [🐞]
      logs.push(`SPORTBOOK_DETAILS_LIST is undefined`)
      lazy_load_data_check = true
      return;
    }

    let count = 0;

    FIXTURE_PROB_DATA.odds = undefined
    FIXTURE_PROB_DATA.odds = {
      _1x2: {
        home: undefined,
        away: undefined,
        draw: undefined,
      },
      btts: undefined,
      over_2_5: undefined
    }

    for (const main_sportbook of SPORTBOOK_DETAILS_LIST) {
      const main_sportbook_title = main_sportbook?.title
      for (const firebase_sportbook of sportbook_list) {
        const firebase_sportbook_title = firebase_sportbook?.sportbook

        if (
          main_sportbook_title.toLowerCase() == firebase_sportbook_title.toLowerCase()
          && firebase_sportbook.markets != null
          && firebase_sportbook.markets['1X2FT'] != null
          && firebase_sportbook.markets['1X2FT'].data[0].value != null
          && firebase_sportbook.markets['1X2FT'].data[1].value != null
          && firebase_sportbook.markets['1X2FT'].data[2].value != null
          && count != 1
        ) {
          // [🐞]
          logs.push(`main_sportbook_title: ${main_sportbook_title}`)
          logs.push(`firebase_sportbook: ${firebase_sportbook}`)

          // [ℹ] 1X2FT [ODDS]
          FIXTURE_PROB_DATA.odds._1x2.home = firebase_sportbook.markets['1X2FT'].data[0].value.toFixed(2);
          FIXTURE_PROB_DATA.odds._1x2.draw = firebase_sportbook.markets['1X2FT'].data[1].value.toFixed(2);
          FIXTURE_PROB_DATA.odds._1x2.away = firebase_sportbook.markets['1X2FT'].data[2].value.toFixed(2);

          // [ℹ] BTSC [ODDS]
          if (
            firebase_sportbook.markets['BTSC'] != null
            && firebase_sportbook.markets['BTSC'].data[0].value != null
            && firebase_sportbook.markets['BTSC'].data[1].value != null
          ) {
            FIXTURE_PROB_DATA.odds.btts = firebase_sportbook.markets['BTSC'].data[0].value.toFixed(2);
          }

          // [ℹ] HCTG3 [ODDS]
          if (
            firebase_sportbook.markets['HCTG3'] != null
            && firebase_sportbook.markets['HCTG3'].data[0].value != null
            && firebase_sportbook.markets['HCTG3'].data[1].value != null
          ) {
            FIXTURE_PROB_DATA.odds.over_2_5 = firebase_sportbook.markets['HCTG3'].data[0].value.toFixed(2);
          }

          SPORTBOOK_INFO = main_sportbook

          count = 1
        }
      }
    }

    // [ℹ] assign changes [persist]
    FIXTURE_PROB_DATA = FIXTURE_PROB_DATA
    lazy_load_data_check = true

    // [🐞]
    if (dev) log_info_group(logs_name, logs)
  }

	async function listen_real_time_odds (
  ): Promise < void > {

    // [🐞]
    if (dev) console.log("%cTriggered odds listen", 'background: green; color: #fffff');

    const sportbook_array: FIREBASE_odds[] = []
    const fixture_time = FIXTURE_INFO?.data?.fixture_day + "Z";
    const fixture_id = FIXTURE_INFO?.data?.id;

    // [ℹ] [GET] target fixture odds
    // [ℹ] ALL STASUS

    const year_: string = new Date(fixture_time).getFullYear().toString();
    const month_: number = new Date(fixture_time).getMonth();
    let new_month_ = (month_ + 1).toString();
    new_month_ = (`0${new_month_}`).slice(-2);
    let day_ = new Date(fixture_time).getDate().toString();
    day_ = (`0${day_}`).slice(-2);

    // [ℹ] listen to real-time fixture event changes;
    const fixtureRef = ref (
      db_real,
      'odds/' + year_ + '/' + new_month_ + '/' + day_ + '/' + fixture_id
    );

    const listen_odds_event_ref = onValue(fixtureRef, (snapshot) => {
      // [ℹ] break-down-values
      if (snapshot.val() != null) {
        const data: [string, FIREBASE_odds][] = Object.entries(snapshot.val())
        for (const sportbook of data) {
          sportbook[1].sportbook = sportbook[0].toString();
          sportbook_array.push(sportbook[1])
        }
        check_fixture_odds_inject(sportbook_array);
      }
    });

    real_time_unsubscribe.push(listen_odds_event_ref);
  }

  // [ℹ] kickstart real-time listen-events
  onMount(async() => {
    listen_real_time_odds();
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
        listen_real_time_odds();
      }
    });
  })

  // [! CRITICAL !]
  onDestroy(async() => {
    // [🐞]
    if (dev) console.groupCollapsed("%cclosing firebase connections [DEV]", 'background: red; color: #fffff');
    // [ℹ] close LISTEN EVENT connection
    for (const iterator of real_time_unsubscribe) {
      // [🐞]
      if (dev) console.log("closing connection")
      iterator();
    }
    // [🐞]
    if (dev) console.groupEnd();
  })

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<!-- 
[ℹ] area-outside-for-close 
-->
{#if toggleCTA}
  <div id="background-area-close" on:click={() => closeAllDropdowns()} />
{/if}

<div
  id='widget-outer'
  class:display_none={no_widget_data && !show_placeholder}>

  <!-- 
  [ℹ] SEO-DATA-LOADED 
  -->
  <!-- {#if !loaded} -->
    <div 
      id="seo-widget-box">
      <!-- 
      [ℹ] widget-title -->
      <!-- <h2>{FIXTURE_VOTES_TRANSLATION?.widget_title}</h2> -->
      <!-- 
      [ℹ] team-names
      -->
      {#each FIXTURE_H2H?.teams_data as item}
        <p>{item?.team_name}</p>
      {/each}
      <!-- 
      [ℹ] league-names [from-fixtures]
      -->
      {#each FIXTURE_H2H?.data?.last_5_data as item}
        <p>{item?.league?.data?.name}</p>
      {/each}
    </div>
  <!-- {/if} -->

  <!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if no_widget_data
    && loaded
    && show_placeholder}

    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0px;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      <!-- {FIXTURE_VOTES_TRANSLATION?.widget_title} -->
    </h2>

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
          <!-- {FIXTURE_VOTES_TRANSLATION?.no_info} -->
        </p>
        <p class='s-14 color-grey w-400'> 
          <!-- {FIXTURE_VOTES_TRANSLATION?.no_info_desc} -->
        </p>
      </div>
    </div>
  {/if}

  <!-- 
  [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if !no_widget_data
    && !refresh
    && browser 
    && $userBetarenaSettings.country_bookmaker}

    <!-- [🐞] -->
    <!-- <H2H_Loader /> -->

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <H2H_Loader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <!-- 
      [ℹ] widget title
      -->
      <h2
        class="
          s-20 
          m-b-10 
          w-500 
          color-black-2
        "
        class:color-white={$userBetarenaSettings.theme == 'Dark'}
        style="margin-top: 0px;">
        {FIXTURE_H2H_TRANSLATION?.widget_title}
      </h2>

      <!-- 
      [ℹ] widget main content
      -->
      <div
        id="h2h-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] (minimal) cross-platform design change
        -->

        <!-- 
        [ℹ] last 5 data 'text'
        -->
        <p
          class="
            color-grey
            text-center
            first
          ">
          {FIXTURE_H2H_TRANSLATION?.last_5}
        </p>

        <!-- 
        [ℹ] main widget info start row
        -->
        <div
          id="main-widget-info-row"
          class="
            row-space-out
          ">
          <!-- 
          [ℹ] TEAM 1 INFO [LOCAL-TEAM]
          -->
          <div
            class="
              row-space-start
              team-box
            ">
            <img 
              src={FIXTURE_H2H?.teams_data[0].team_logo}
              alt='{FIXTURE_H2H?.teams_data[0].team_name} Logo'
              class='team-logo'
            />
            {#if !mobileExclusive}
              <p
                class="
                  s-16
                  w-500
                  color-black-2
                ">
                {FIXTURE_H2H?.teams_data[0].team_name}
              </p>
            {/if}
          </div>

          <!-- 
          [ℹ] WIN - DRAW - WIN INFO
          -->
          <div
            class="
              row-space-center
              stat-box-out
            ">
            <!-- 
            [ℹ] TEAM 1 WIN
            -->
            <div
              class="stat-win-box">
              <p
                class="
                  w-500
                  color-black-2
                  main-txt
                ">
                {FIXTURE_H2H?.data?.wins_draws?.team_1}
              </p>
              <p  
                class="color-grey">
                {FIXTURE_H2H_TRANSLATION?.wins}
              </p>
            </div>
            <!-- 
            [ℹ] DRAW(s)
            -->
            <div
              class="stat-win-box">
              <p
                class="
                  w-500
                  color-black-2
                  main-txt
                ">
                {FIXTURE_H2H?.data?.wins_draws?.draws}
              </p>
              <p  
                class="color-grey">
                {FIXTURE_H2H_TRANSLATION?.draws}
              </p>
            </div>
            <!-- 
            [ℹ] TEAM 2 WIN
            -->
            <div
              class="stat-win-box">
              <p
                class="
                  w-500
                  color-black-2
                  main-txt
                ">
                {FIXTURE_H2H?.data?.wins_draws?.team_2}
              </p>
              <p  
                class="color-grey">
                {FIXTURE_H2H_TRANSLATION?.wins}
              </p>
            </div>
          </div>

          <!-- 
          [ℹ] TEAM 2 INFO [VISITOR-TEAM]
          -->
          <div
            class="
              row-space-end
              team-box
            ">
            {#if !mobileExclusive}
              <p
                class="
                  s-16
                  w-500
                  color-black-2
                ">
                {FIXTURE_H2H?.teams_data[1].team_name}
              </p>
            {/if}
            <img 
            src={FIXTURE_H2H?.teams_data[1].team_logo}
            alt='{FIXTURE_H2H?.teams_data[1].team_name} Logo'
              class='team-logo'
            />
          </div>
        </div>

        <!-- 
        [ℹ] widget progress-bar for win-draws-wins info
        -->
        <div
          id="competition-progress-box"
          class="
            row-space-out
          ">
          <!-- 
          [ℹ] TEAM 1 PROGRESS BAR
          [ℹ] (+mobile) team-name
          -->
          <div
            class="progress-box-out">
            {#if mobileExclusive}
              <p
                class="
                  s-16
                  w-500
                  color-black-2
                ">
                {FIXTURE_H2H?.teams_data[0].team_name}
              </p>
            {/if}
            <div
              class="team-progress-bar">
              <div 
                class:greater_win_ration={team1Percent > team2Percent}
                style="
                  width: {team1Percent}%;
                "/>
            </div>
          </div>
          <!-- 
          [ℹ] TEAM 2 PROGRESS BAR
          [ℹ] (+mobile) team-name
          -->
          <div
            class="progress-box-out">
            {#if mobileExclusive}
              <p
                class="
                  s-16
                  w-500
                  color-black-2
                ">
                {FIXTURE_H2H?.teams_data[1].team_name}
              </p>
            {/if}
            <div
              class="team-progress-bar">
              <div 
                class:greater_win_ration={team2Percent > team1Percent}
                style="
                  width: {team2Percent}%;
                "/>
            </div>
          </div>
        </div>

        <!-- 
        [ℹ] main widget info stats - bets row
        -->
        <div
          id="grid-bet-stats">
          
          <!-- 
          [ℹ] overs-data
          -->
          {#each Object.entries(FIXTURE_H2H?.data?.overs) as [key, value]}
            <FixtureStatsBox
              {FIXTURE_H2H_TRANSLATION}
              {key}
              {value}
              {SPORTBOOK_INFO}
              on:google_click={() => trigger_event_google('fixtures_football_fixtures_h2h')}
              type={'overs'}
            />
          {/each}

          <!-- 
          [ℹ] yellow-cards-data
          -->
          <FixtureStatsBox
            {FIXTURE_H2H_TRANSLATION}
            key={FIXTURE_H2H_TRANSLATION?.yellow_cards}
            value={FIXTURE_H2H?.data?.yellow_cards_avg}
            {SPORTBOOK_INFO}
            on:google_click={() => trigger_event_google('fixtures_football_fixtures_h2h')}
            type={'ycavg'}
          />

          <!-- 
          [ℹ] corners-data
          -->
          <FixtureStatsBox
            {FIXTURE_H2H_TRANSLATION}
            key={FIXTURE_H2H_TRANSLATION?.corners}
            value={FIXTURE_H2H?.corner_avg}
            {SPORTBOOK_INFO}
            on:google_click={() => trigger_event_google('fixtures_football_fixtures_h2h')}
            type={'corners'}
          />

          <!-- 
          [ℹ] btts-data
          -->
          <FixtureStatsBox
            {FIXTURE_H2H_TRANSLATION}
            key={FIXTURE_H2H_TRANSLATION?.btts}
            value={FIXTURE_H2H?.data?.btts.btts_count}
            {SPORTBOOK_INFO}
            on:google_click={() => trigger_event_google('fixtures_football_fixtures_h2h')}
            type={'btts'}
          />

        </div>
   
        <!-- 
        [ℹ] main widget last 5 fixtures data
        -->
        {#each FIXTURE_H2H?.data?.last_5_data as item}

          <a 
            href="{FIXTURE_H2H?.last_5_data_urls?.find( ({ id }) => id == item?.id)?.urls[server_side_language]}">
            <div
              class="
                row-space-out
                past-fixture-row
              "
              class:row-space-out={!mobileExclusive}
              class:column-space-center={mobileExclusive}>
              
              <!-- 
              [ℹ] info on fixture league-round
              -->
              <p
                class="
                  color-grey
                  no-wrap
                ">
                <!--
                [ℹ] league text info
                -->
                {#if item?.league != undefined
                  && item?.league?.data?.name != undefined}
                  {item?.league?.data?.name}
                {/if}
                <!--
                [ℹ] round text info
                -->
                {#if item?.round != undefined
                  && item?.round?.data?.name != undefined}
                  - {FIXTURE_H2H_TRANSLATION?.round} {item?.round?.data?.name}
                {/if}
              </p>

              <!-- 
              [ℹ] info on fixture main teams/score
              -->
              <div
                class="
                  row-space-center
                  score-info-box
                ">
                <!-- 
                [ℹ] fixture-team_1 text
                -->
                <p
                  class="
                    color-black-2
                    team-text
                    no-wrap
                  ">
                  {#if mobileExclusive}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.localteam_id)?.team_short}
                  {:else}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.localteam_id)?.team_name}
                  {/if}
                </p>
                <img
                  src={FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.localteam_id)?.team_logo}
                  alt='{FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.localteam_id)?.team_logo} Logo'
                  width="24"
                />
                <!-- 
                [ℹ] fixture-score text
                -->
                <p
                  class="
                    w-500
                    color-black-2
                    score-txt
                  ">
                  {item?.scores?.localteam_score}
                  -
                  {item?.scores?.visitorteam_score}
                </p>
                <!-- 
                [ℹ] fixture-team_2 text
                -->
                <img
                  src={FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.visitorteam_id)?.team_logo}
                  alt='{FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.visitorteam_id)?.team_logo} Logo'
                  width="24"
                />
                <p
                  class="
                    color-black-2
                    team-text
                    no-wrap
                  ">
                  {#if mobileExclusive}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.visitorteam_id)?.team_short}
                  {:else}
                    {FIXTURE_H2H?.teams_data?.find(({ team_id }) => team_id == item?.visitorteam_id)?.team_name}
                  {/if}
                </p>
              </div>

              <!-- 
              [ℹ] starting date for fixture
              -->
              <p
                class="
                  color-grey
                  no-wrap
                ">
                {MONTH_NAMES_ABBRV[new Date(item?.time?.starting_at?.date_time + "Z").getMonth().toString()]}
                {new Date(item?.time?.starting_at?.date_time + "Z").getDate().toString()},
                {new Date(item?.time?.starting_at?.date_time + "Z").getFullYear().toString()}
              </p>
            </div>
          </a>
        {/each}

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

  #background-area-close {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 998;
  }

  .display_none {
    display: none !important;
  }

  .fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
  }

  @keyframes fadeInOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

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

  /* widget-main */
  div#h2h-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    /* overflow: hidden; */
    width: 100%;
    position: relative;
    padding: 20px;
  }

  /* first row info */
  div#main-widget-info-row {
    margin-top: 16px;
  } div#main-widget-info-row img.team-logo {
    width: 44px;
    height: 44px;
  } div#main-widget-info-row div.team-box:first-child img.team-logo {
    margin-right: 16px;
  } div#main-widget-info-row div.team-box:last-child img.team-logo {
    margin-left: 16px;
  } div#main-widget-info-row div.stat-box-out {
    /* empty */
  } div#main-widget-info-row div.stat-box-out div.stat-win-box {
    text-align: center;
  } div#main-widget-info-row div.stat-box-out div.stat-win-box:nth-of-type(2) {
    margin: 0 6px;
  } div#main-widget-info-row div.stat-box-out div.stat-win-box p.main-txt {
    font-size: 24px;
  }

  /* competition box */
  div#competition-progress-box {
    margin-top: 16px;
  } div#competition-progress-box div.progress-box-out {
    width: 100%;
  } div#competition-progress-box div.progress-box-out:first-child {
    margin-right: 15px;
  } div#competition-progress-box div.progress-box-out p {
    margin-bottom: 8px;
  } div#competition-progress-box div.progress-box-out:last-child p {
    text-align: end;
  } div#competition-progress-box div.progress-box-out:first-child div.team-progress-bar {
    margin-right: 12px;
    text-align: -webkit-right;
    text-align: -moz-right;
  } div#competition-progress-box div.progress-box-out div.team-progress-bar {
    background: #E6E6E6;
    border-radius: 10px;
    width: 100%;
  } div#competition-progress-box div.progress-box-out div.team-progress-bar > div {
    background-color: #FFB904;
    /* width: 40%; */ /* Adjust with JavaScript */
    height: 12px;
    border-radius: 10px;
  }

  div#competition-progress-box div.progress-box-out div.team-progress-bar > div.greater_win_ration {
    background-color: #F5620F !important;
  }

  /* fixture bet info */
  div#grid-bet-stats {
    position: relative;
		display: grid;
  } /* NOTE: rest fixture bet info styles inside component */

  /* past-fixture-data */
  div.past-fixture-row {
    border-bottom: 1px solid #E6E6E6;
    padding: 24px 0;
    position: relative;
  } div.past-fixture-row:last-child {
    border: none !important;
    padding-bottom: 0;
  } div.past-fixture-row div.score-info-box {
    margin: 8px 0;
  } div.past-fixture-row div.score-info-box p.score-txt {
    margin: 0 24px;
    font-size: 16px;
  } div.past-fixture-row p.team-text {
    font-size: 16px
  } div.past-fixture-row p.team-text:first-child {
    margin-right: 12px;
  } div.past-fixture-row p.team-text:last-child {
    margin-left: 12px;
  }

  /* ====================
    [MAIN] RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  NOTE: TABLET [EXCLUSIVE] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1160px)  {

    #h2h-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
    
  }

  /* 
  NOTE: TABLET && DESKTOP [SHARED] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
   
    /* first row info */
    div#main-widget-info-row img.team-logo {
      width: 64px;
      height: 64px;
    } div#main-widget-info-row div.stat-box-out div.stat-win-box:nth-of-type(2) {
      margin: 0 44px;
    } div#main-widget-info-row div.stat-box-out div.stat-win-box p.main-txt {
      font-size: 32px;
    }

    /* fixture bet info */
    div#grid-bet-stats {
      grid-auto-flow: row;
      grid-gap: 15px;
      margin-top: 20px;
      grid-template-columns: 1fr 1fr;
    } div#grid-bet-stats :global(div.bet-info-box) {
      border: 1px solid #E6E6E6;
      border-radius: 8px;
      padding: 12px 20px;
      margin: unset;
    }

    /* past-fixture-data */
    div.past-fixture-row div.score-info-box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      width: fit-content;
      margin: unset;
    } div.past-fixture-row p.team-text {
      position: absolute;
      font-size: 16px
    } div.past-fixture-row p.team-text:first-child {
      right: 100%;
      margin-right: 12px;
    } div.past-fixture-row p.team-text:last-child {
      left: 100%;
      margin-left: 12px;
    }

    div#h2h-widget-container.dark-background-1 div#grid-bet-stats :global(div.bet-info-box) {
      border: 1px solid #616161 !important;
    }
  }

  /* 
  NOTE: DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {

    #h2h-widget-container {
      min-width: 100%;
    }

  }

  /* ====================
    [MAIN] WIDGET DARK THEME
  ==================== */

  div#h2h-widget-container.dark-background-1 div#grid-bet-stats :global(div.bet-info-box) {
    border-bottom: 1px solid #616161 !important;
  }

  div#h2h-widget-container.dark-background-1 div.past-fixture-row {
    border-bottom: 1px solid #616161;
  }

</style>
