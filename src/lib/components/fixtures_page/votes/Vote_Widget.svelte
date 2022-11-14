<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup, logErrorGroup, log_info_group } from "$lib/utils/debug";
	import { fade } from "svelte/transition";

	import { get } from "$lib/api/utils";
  import { initGrapQLClient } from "$lib/graphql/init_graphQL";
	import { onValue, ref, type Unsubscribe } from "firebase/database";
	import { db_real } from "$lib/firebase/init";
  import { userBetarenaSettings } from "$lib/store/user-settings";
	import { fixtureVote, type fixture } from '$lib/store/vote_fixture';
	import { HASURA_FIXTURE_VOTES_DATA_0, HASURA_FIXTURE_VOTES_INIT_UPDATE } from "$lib/graphql/fixtures/votes/query";
  import { getImageBgColor } from "$lib/utils/color_thief";
	import { get_odds } from "$lib/firebase/votes";

	import type {
    REDIS_CACHE_SINGLE_fixtures_page_info_response 
  } from "$lib/models/_main_/pages_and_seo/types";
	import type { 
    BETARENA_HASURA_votes_mutation, 
    BETARENA_HASURA_votes_query, 
    Fixture_Votes, 
	  REDIS_CACHE_SINGLE_votes_translation
  } from "$lib/models/fixtures/votes/types";
	import type { 
    Cache_Single_SportbookDetails_Data_Response 
  } from "$lib/models/tournaments/league-info/types";
	import type { 
    FIREBASE_odds 
  } from "$lib/models/firebase";

	import VoteLoader from "./Vote_Loader.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // NOTE: NO WIDGET SPECIFIC SEO or PRE-LOAD DATA REQUIRED
  // NOTE: lazy-loaded component data
  export let FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let FIXTURE_VOTES_TRANSLATION: REDIS_CACHE_SINGLE_votes_translation
	let FIXTURE_VOTES_DATA:  Fixture_Votes;
  let SPORTBOOK_INFO:      Cache_Single_SportbookDetails_Data_Response;
  let SPORTBOOK_DETAILS_LIST: Cache_Single_SportbookDetails_Data_Response[];

  let loaded:            boolean = false;     // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;     // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;     // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;         // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;
  let lazy_load_data_check: boolean = false;

  let show_placeholder:  boolean = true;      // [ℹ] [override] placeholder for "no-widget-data" for fixtures-page

	let user_stake_amount: number = 50.0;       // [ℹ] user const stake amount (input)
	let total_votes:       number = undefined;  // [ℹ] fixture-total votes
	let show_bet_site:     boolean = false;
	let vote_casted:       boolean = false;

  let fixture_data_vote_obj: fixture = {
		fixture_id: undefined,
		fixture_vote: undefined,
		fixture_vote_val: undefined,
		_X_vote: undefined,
		_1_vote: undefined,
		_2_vote: undefined
	};

  let imageVar:          string = '--fixture-votes-bookmaker-bg-';

  // [🐞]
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "fixtures | votes [DEV]";

  // [🐞]
  $: if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `FIXTURE_VOTES_DATA: ${FIXTURE_VOTES_DATA}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  // [ℹ] Not In Use
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
      match_id: FIXTURE_INFO?.data?.id,
      fixture_id: FIXTURE_INFO?.data?.id
    }
    const response: BETARENA_HASURA_votes_query =
      await initGrapQLClient().request(
        HASURA_FIXTURE_VOTES_DATA_0, 
        VARIABLES
    );
		const response_main_sportbook: Cache_Single_SportbookDetails_Data_Response = 
      await get("/api/cache/tournaments/sportbook?geoPos="+userGeo)
    ;
    const response_all_spotbooks: Cache_Single_SportbookDetails_Data_Response[] = 
      await get("/api/cache/tournaments/sportbook?all=true&geoPos="+userGeo)
    ;
    loaded = true;

    // [🐞]
    if (dev) logDevGroup (`${dev_console_tag}`, `response: ${response}`)

    // [ℹ] data validation check
		if (response == undefined) {
      // [🐞]
      if (dev) logDevGroup (`${dev_console_tag}`, `❌ no data available!`)
      no_widget_data = true;
			return;
		}
    // [ℹ] otherwise, no data
    // [ℹ] can be length [] = 0
    else {
      no_widget_data = false;
    }

    // [ℹ] data pre-processing

    const HIST_FIXTURE_DATA = response.historic_fixtures[0]

    console.log("HIST_FIXTURE_DATA", HIST_FIXTURE_DATA)

    SPORTBOOK_INFO = response_main_sportbook;
    SPORTBOOK_DETAILS_LIST = response_all_spotbooks;
    SPORTBOOK_DETAILS_LIST.sort((a, b) => parseInt(a.position) - parseInt(b.position))

    FIXTURE_VOTES_DATA = {
      time: undefined,
      match_votes: undefined,
      probabilities: undefined,
      _1x2: undefined
    }


    FIXTURE_VOTES_DATA.time = HIST_FIXTURE_DATA?.time
    FIXTURE_VOTES_DATA.match_votes = response.widget_featured_match_votes[0]
    FIXTURE_VOTES_DATA.probabilities = HIST_FIXTURE_DATA?.probabilities
    FIXTURE_VOTES_DATA._1x2 = undefined // NOTE: populated from FIREBASE, if exist & "live"
    FIXTURE_VOTES_DATA._1x2 = {
      home: undefined,
      away: undefined,
      draw: undefined
    }
    FIXTURE_VOTES_DATA.away_team_logo = HIST_FIXTURE_DATA?.away_team_logo;
    FIXTURE_VOTES_DATA.home_team_logo = HIST_FIXTURE_DATA?.home_team_logo;

    getImageBgColor(SPORTBOOK_INFO?.image, imageVar)

    total_votes =
      FIXTURE_VOTES_DATA?.match_votes == undefined
        ? 0
        : FIXTURE_VOTES_DATA?.match_votes?.vote_draw_x
          + FIXTURE_VOTES_DATA?.match_votes?.vote_win_local
          + FIXTURE_VOTES_DATA?.match_votes?.vote_win_visitor
    ;

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
	 * handle initialization of vote values
   * and validation of already casted votes
   * ---
   * @param {string} vote_type - type of vote
   * @param {string} vote_val - vote value
  */
	function init_vote () {
		// [ℹ] get target fixture by ID from USER localStorage()
		const result = $fixtureVote.fixtureVotes_Array.find((fixture) => {
			return fixture.fixture_id === FIXTURE_INFO?.data?.id;
		});
		// [ℹ] if target ID exists, assign to "fixture_data_vote_obj"
		// [ℹ] with show appropiate match-betting site info;
		if (result != undefined) {
			fixture_data_vote_obj = result;
			show_bet_site = true;
			vote_casted = true;
			return;
		}
		// [ℹ] else, 
    // [ℹ] declare vote as not been casted
		else {
			fixture_data_vote_obj = {
				fixture_id: undefined,
				fixture_vote: undefined,
				fixture_vote_val: undefined,
				_X_vote: undefined,
				_1_vote: undefined,
				_2_vote: undefined
			};
			show_bet_site = false;
			vote_casted = false;
		}
	}

  /**
	 * Description
   * ---
	 * handler for user-votes persistance
   * on Hasura + localStorage()
   * ---
   * @param {string} vote_type - type of vote
   * @param {string} vote_val - vote value
  */
	function cast_vote (
    vote_type: string, 
    vote_val: string
  ): void {

		// [🐞]
    if (dev) logDevGroup (`${dev_console_tag}`, `vote_val: ${vote_val}`)

		// [ℹ] check vote already casted
		if (!vote_casted) {
			// [ℹ] update the show_bet_site Frame;
			show_bet_site = true;
			// [ℹ] update the VoteMatch on DB;
			fixture_data_vote_obj = {
				fixture_id: FIXTURE_INFO?.data?.id,
				fixture_vote: vote_type,
				fixture_vote_val: vote_val,
				_X_vote: 0,
				_1_vote: 0,
				_2_vote: 0
			};
			fixture_data_vote_obj['_' + fixture_data_vote_obj.fixture_vote + '_vote'] = 1;
			execute_vote_submit(fixture_data_vote_obj);
			// [ℹ] update USER localStorage()
			fixtureVote.addToVotes(fixture_data_vote_obj);
			// [ℹ] set "casted" BOOLEAN
			vote_casted = true;
		}
	}

  /**
	 * Description
   * ---
	 * submit mutation to Hasura to update votes
   * ---
   * @param {string} vote_type - type of vote
   * @param {string} vote_val - vote value
  */
	async function execute_vote_submit (
    fixtureData: fixture
  ): Promise < void > {

		const VARIABLES = {
			match_id: fixtureData.fixture_id,
			_1_vote: fixtureData._1_vote,
			_2_vote: fixtureData._2_vote,
			_X_vote: fixtureData._X_vote
		};

		// [🐞]
    if (dev) logDevGroup (`${dev_console_tag}`, `handleSubmit() variables: ${VARIABLES}`)

    // FIXME: need a try..catch ?
		try {
			// [ℹ] execute GRAPH-QL request;
			const update_fixture_data: BETARENA_HASURA_votes_mutation =
				await initGrapQLClient().request(
          HASURA_FIXTURE_VOTES_INIT_UPDATE, 
          VARIABLES
      );

      // [🐞]
      if (dev) logDevGroup (`${dev_console_tag}`, `update_fixture_data: ${update_fixture_data}`)

			// [ℹ] update existing data with CASTED-VOTES;
			FIXTURE_VOTES_DATA.match_votes =
				update_fixture_data.update_widget_featured_match_votes_by_pk;
			total_votes =
				FIXTURE_VOTES_DATA?.match_votes.vote_draw_x
				+ FIXTURE_VOTES_DATA?.match_votes.vote_win_local
				+ FIXTURE_VOTES_DATA?.match_votes.vote_win_visitor
      ;
		} catch (error) {
      if (dev) logErrorGroup ("featured match", `error: ${error}`)
		}
	}

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let tabletView = 1160
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

    for (const main_sportbook of SPORTBOOK_DETAILS_LIST) {
      const main_sportbook_title = main_sportbook?.title
      for (const firebase_sportbook of sportbook_list) {
        const firebase_sportbook_title = firebase_sportbook?.sportbook
        if (
          main_sportbook_title.toLowerCase() == firebase_sportbook_title.toLowerCase() &&
          firebase_sportbook.markets['1X2FT'] != null &&
          firebase_sportbook.markets != null &&
          firebase_sportbook.markets['1X2FT'].data[0].value != null &&
          firebase_sportbook.markets['1X2FT'].data[1].value != null &&
          firebase_sportbook.markets['1X2FT'].data[2].value != null &&
          count != 1
        ) {
          // [🐞]
          logs.push(`main_sportbook_title: ${main_sportbook_title}`)
          logs.push(`firebase_sportbook: ${firebase_sportbook}`)
          FIXTURE_VOTES_DATA._1x2 = undefined
          FIXTURE_VOTES_DATA._1x2 = {
            home: undefined,
            away: undefined,
            draw: undefined
          }
          FIXTURE_VOTES_DATA._1x2.home = firebase_sportbook.markets['1X2FT'].data[0].value.toFixed(2);
          FIXTURE_VOTES_DATA._1x2.draw = firebase_sportbook.markets['1X2FT'].data[1].value.toFixed(2);
          FIXTURE_VOTES_DATA._1x2.away = firebase_sportbook.markets['1X2FT'].data[2].value.toFixed(2);
          SPORTBOOK_INFO = main_sportbook
          count = 1
        }
      }
    }

    // [ℹ] assign changes [persist]
    FIXTURE_VOTES_DATA = FIXTURE_VOTES_DATA
    lazy_load_data_check = true

    // [🐞]
    if (dev) log_info_group(logs_name, logs)
  }

	async function listen_real_time_odds (
  ): Promise < void > {

    // [🐞]
    if (dev) console.log("%cTriggered odds listen", 'background: green; color: #fffff');

    const sportbook_array: FIREBASE_odds[] = []
    const fixture_time = FIXTURE_VOTES_DATA?.time + "Z";
    const fixture_id = FIXTURE_INFO?.data?.id;

    // [ℹ] [GET] target fixture odds
    // [ℹ] ALL STASUS

    const year_: string = new Date(fixture_time).getFullYear().toString();
    const month_: number = new Date(fixture_time).getMonth();
    let new_month_ = (month_ + 1).toString();
    new_month_ = ('0' + new_month_).slice(-2);
    let day_ = new Date(fixture_time).getDate().toString();
    day_ = ('0' + day_).slice(-2);

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

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE OTHER
  // ~~~~~~~~~~~~~~~~~~~~~

  $: condition = 
    $fixtureVote.fixtureVotes_Array != undefined 
    && loaded
  ;
	$: if (condition) {
		init_vote()
	}

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div
  id='widget-outer'>

  <!-- 
  [ℹ] SEO-DATA-LOADED 
  -->
  <!-- {#if !loaded} -->
    <div 
      id="seo-widget-box">
      <!-- 
      [ℹ] widget-title -->
      <h2>{FIXTURE_VOTES_TRANSLATION?.widget_title}</h2>
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
      {FIXTURE_VOTES_TRANSLATION?.widget_title}
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
          {FIXTURE_VOTES_TRANSLATION?.no_info}
        </p>
        <p class='s-14 color-grey w-400'> 
          {FIXTURE_VOTES_TRANSLATION?.no_info_desc}
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

    <!-- <VoteLoader /> -->

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <VoteLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <h2
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0px;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {FIXTURE_VOTES_TRANSLATION?.widget_title}
      </h2>

      <div
        id="votes-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] (minimal) cross-platform design change
        -->

        <!-- 
        [ℹ] voting hint text -->
        {#if !vote_casted}
          <p
            class="
              w-500 
              large 
              color-primary 
              m-b-12 
              text-center
            ">
            {FIXTURE_VOTES_TRANSLATION?.vote}
          </p>
        {/if}

        <!-- 
        [ℹ] voting results btn -->
        <div
          id="btn-vote-container" 
          class="row-space-out">
            
          <!-- 
          [ℹ] ODDS #1 
          -->
          <div
            class="
              odds-vote-box 
              text-center 
              column
            ">

            <button
              class="
                row-space-out 
                cast-vote-btn 
                m-b-12
              "
              class:active={fixture_data_vote_obj.fixture_vote == '1'}
              disabled={vote_casted}
              on:click={() => cast_vote('1', FIXTURE_VOTES_DATA._1x2.home.toString())}>
                <p
                  class="
                    w-500 
                    medium 
                    row-space-out
                  ">
                  {#if mobileExclusive}
                    <span 
                      class="color-grey"> 
                      1 
                    </span>
                  {:else}
                    <img
                      src={FIXTURE_VOTES_DATA?.home_team_logo}
                      alt=""
                      width="28px"
                      height="28px"
                    />
                  {/if}
                  <span
                    class:active_p={fixture_data_vote_obj.fixture_vote == '1'}>
                    {#if FIXTURE_VOTES_DATA._1x2.home}
                      {FIXTURE_VOTES_DATA._1x2.home.toString()}
                    {:else}
                      -
                    {/if}
                  </span>
                </p>
            </button>

            <!-- 
            [ℹ] fixture-probability 
            -->
            {#if !show_bet_site}
              <p 
                class="
                  w-400 
                  probablitiy-text 
                  medium
                ">
                {FIXTURE_VOTES_TRANSLATION?.probability}
                {#if mobileExclusive}
                  <br />
                {/if}
                {Math.round(parseFloat(FIXTURE_VOTES_DATA?.probabilities?.home.toString())).toFixed(2)}%
              </p>
            {:else if FIXTURE_VOTES_DATA?.match_votes != undefined}
              <p 
                class="
                  large
                ">
                <span 
                  class="
                    color-dark
                    w-500
                  ">
                  {((FIXTURE_VOTES_DATA?.match_votes.vote_win_local / total_votes) * 100).toFixed(0)}%
                </span>
                <span 
                  class="
                    color-grey
                    w-400
                  ">
                  ({FIXTURE_VOTES_DATA.match_votes.vote_win_local})
                </span>
              </p>
            {/if}
          </div>

          <!--
          [ℹ] ODDS #X
          -->
          <div
            class="
              odds-vote-box 
              text-center 
              column
            ">

            <button
              class="
                row-space-out 
                cast-vote-btn 
                m-b-12
              "
              class:active={fixture_data_vote_obj.fixture_vote == 'X'}
              disabled={vote_casted}
              on:click={() => cast_vote('X', FIXTURE_VOTES_DATA._1x2.draw.toString())}>
                <p 
                  class="
                    w-500 
                    medium 
                    row-space-out
                  ">
                  {#if mobileExclusive}
                    <span 
                      class="color-grey"> 
                      X 
                    </span>
                  {:else}
                    <!-- 
                    src="./static/icon/icon-close.svg"
                    -->
                    <img
                      src="/assets/svg/icon/icon-close.svg"
                      alt=""
                      width="28px"
                      height="28px"
                    />
                  {/if}
                  <span 
                    class:active_p={fixture_data_vote_obj.fixture_vote == 'X'}>
                    {#if FIXTURE_VOTES_DATA._1x2.draw}
                      {FIXTURE_VOTES_DATA._1x2.draw.toString()}
                    {:else}
                      -
                    {/if}
                  </span>
                </p>
            </button>

            <!-- 
            [ℹ] fixture-probability 
            -->
            {#if !show_bet_site}
              <p 
                class="
                  w-400 
                  probablitiy-text 
                  medium
                ">
                {FIXTURE_VOTES_TRANSLATION?.probability}
                {#if mobileExclusive}
                  <br />
                {/if}
                {Math.round(parseInt(FIXTURE_VOTES_DATA.probabilities.draw.toString())).toFixed(2)}%
              </p>
            {:else if FIXTURE_VOTES_DATA.match_votes != undefined}
              <p 
                class="
                  large
                ">
                <span 
                  class="
                    w-500 
                    color-dark
                  ">
                  {((FIXTURE_VOTES_DATA.match_votes.vote_draw_x / total_votes) * 100).toFixed(0)}%
                </span>
                <span 
                  class="
                    w-400 
                    color-grey
                  ">
                  ({FIXTURE_VOTES_DATA.match_votes.vote_draw_x})
                </span>
              </p>
            {/if}
          </div>

          <!-- 
          [ℹ] ODDS #2 
          -->
          <div
            class="
              odds-vote-box 
              column 
              text-center
            ">

              <button
                class="
                  row-space-out 
                  cast-vote-btn 
                  m-b-12
                "
                class:active={fixture_data_vote_obj.fixture_vote == '2'}
                disabled={vote_casted}
                on:click={() => cast_vote('2', FIXTURE_VOTES_DATA._1x2.away.toString())}>
                <p 
                  class="
                    w-500 
                    medium 
                    row-space-out
                  ">
                  {#if mobileExclusive}
                    <span 
                      class="color-grey"> 
                      2 
                    </span>
                  {:else}
                    <img
                      src={FIXTURE_VOTES_DATA?.away_team_logo}
                      alt=""
                      width="28px"
                      height="28px"
                    />
                  {/if}
                  <span 
                    class:active_p={fixture_data_vote_obj.fixture_vote == '2'}>
                    {#if FIXTURE_VOTES_DATA._1x2.away}
                      {FIXTURE_VOTES_DATA._1x2.away.toString()}
                    {:else}
                      -
                    {/if}
                  </span>
                </p>
              </button>

              <!-- 
              [ℹ] fixture-probability 
              -->
              {#if !show_bet_site}
                <p 
                  class="
                    w-400 
                    probablitiy-text 
                    medium
                  ">
                  {FIXTURE_VOTES_TRANSLATION?.probability}
                  {#if mobileExclusive}
                    <br />
                  {/if}
                  {Math.round(parseInt(FIXTURE_VOTES_DATA.probabilities.away.toString())).toFixed(2)}%
                </p>
              {:else if FIXTURE_VOTES_DATA.match_votes != undefined}
                <p 
                  class="
                    large
                  ">
                  <span 
                    class="
                      color-dark
                      w-500
                    ">
                    {((FIXTURE_VOTES_DATA.match_votes.vote_win_visitor / total_votes) * 100).toFixed(0)}%
                  </span>
                  <span 
                    class="
                      color-grey
                      w-400
                    ">
                    ({FIXTURE_VOTES_DATA.match_votes.vote_win_visitor})
                  </span>
                </p>
              {/if}
          </div>

        </div>

        <!-- 
        [ℹ] stakes-site-info-pop-up 
        -->
        {#if show_bet_site}
          <div
            id="site-bet-box" 
            in:fade>

            <!-- 
            close-btn src="./static/icon/white-close.svg" 
            -->
            <img
              src="/assets/svg/icon/white-close.svg"
              alt=""
              width="16px"
              height="16px"
              style="position: absolute; top: 12px; right: 20px;"
              on:click={() => (show_bet_site = false)}
            />
            <a href={SPORTBOOK_INFO.register_link}>
              <img
                id="stakesSiteImg"
                src={SPORTBOOK_INFO.image}
                alt=""
                style="background-color: var({imageVar});"
                width="100%"
                height="40px"
              />
            </a>

            <!-- 
            [ℹ] bottom container info
            -->
            <div
              id="inner-site-container">

              <!-- 
              [ℹ] STAKES DATA 
              -->
              <div
                id="box-row"
                class="
                  m-b-20 
                  row-space-out
                ">
                
                <!-- 
                [ℹ] Win Type 
                -->
                <div
                  class="
                    text-center
                    stakes-info-box
                  ">

                  <!-- 
                  [ℹ] type of vote select - text
                  -->
                  <p 
                    class="
                      w-400 
                      medium 
                      m-b-8 
                      color-grey
                    ">
                    {#if fixture_data_vote_obj.fixture_vote == '1'}
                      Home win
                    {:else if fixture_data_vote_obj.fixture_vote == 'X'}
                      Draw
                    {:else}
                      Away win
                    {/if}
                  </p>
                  
                  <!-- 
                  [ℹ] box stakes show
                  -->
                  <div
                    class="
                      input-value 
                      row-space-out 
                      medium 
                      text-center
                    ">

                    {#if !mobileExclusive}
                      {#if fixture_data_vote_obj.fixture_vote == '1'}
                        <img
                          src={FIXTURE_VOTES_DATA?.home_team_logo}
                          alt=""
                          width="28px"
                          height="28px"
                        />
                      {:else if fixture_data_vote_obj.fixture_vote == 'X'}
                        <p 
                          class="
                            w-500 
                            medium
                            row-space-out
                          ">
                          <span 
                            class="color-grey"> 
                            X 
                          </span>
                        </p>
                      {:else}
                        <img
                          src={FIXTURE_VOTES_DATA?.away_team_logo}
                          alt=""
                          width="28px"
                          height="28px"
                        />
                      {/if}
                    {/if}

                    <input
                      id="win-type"
                      class="
                        w-500 
                        medium 
                        text-center 
                        desktop-view-winnings
                      "
                      type="number"
                      bind:value={fixture_data_vote_obj.fixture_vote_val}
                      disabled
                    />

                  </div>
                </div>

                <!-- 
                [ℹ] MULTIPLY SIGN 
                -->
                <img
                  src="/assets/svg/icon/icon-close.svg"
                  alt="multiply-icon"
                  width="16px"
                  height="16px"
                  style="margin-top: 25px;"
                />

                <!-- 
                [ℹ] Stake 
                -->
                <div
                  class="
                    text-center
                    stakes-info-box
                  ">
                  <p 
                    class="
                      w-400 
                      medium 
                      m-b-8 
                      color-grey
                    ">
                    {FIXTURE_VOTES_TRANSLATION?.stake}
                  </p>
                  <input
                    class="
                      w-500 
                      input-value 
                      medium 
                      text-center
                    "
                    type="text"
                    bind:value={user_stake_amount}
                  />
                </div>

                <!-- 
                [ℹ] EQUALS SIGN 
                -->
                <img
                  src="/assets/svg/icon/icon-equally.svg"
                  alt="icon-equlaity"
                  width="16px"
                  height="16px"
                  style="margin-top: 25px;"
                />

                <!-- 
                [ℹ] Winnings 
                -->
                <div
                  class="
                    text-center
                    stakes-info-box
                  ">
                  <p
                    class="
                      w-400 
                      medium 
                      m-b-8 
                      color-grey
                    ">
                    {FIXTURE_VOTES_TRANSLATION?.winnings}
                  </p>
                  <input
                    class="
                      w-500 
                      input-value 
                      medium 
                      text-center
                    "
                    type="number"
                    value={(parseFloat(fixture_data_vote_obj.fixture_vote_val) * user_stake_amount).toFixed(2)}
                    disabled
                  />
                </div>

                <!-- 
                [ℹ] PLACE BET BUTTON 
                [ℹ] [DESKTOP]
                -->
                {#if !mobileExclusive && !tabletExclusive}
                  <a
                    href={SPORTBOOK_INFO.register_link}
                    class="anchor-bet-box">
                    <button 
                      class="
                        place-bet-btn 
                        btn-primary
                      ">
                      <p
                        class="small">
                        {FIXTURE_VOTES_TRANSLATION?.bet}
                      </p>
                    </button>
                  </a>
                {/if}

              </div>

              <!-- 
              [ℹ] PLACE BET BUTTON 
              [ℹ] [MOBILE] OR [TABLET]
              -->
              {#if mobileExclusive || tabletExclusive}
                <a
                  href={SPORTBOOK_INFO.register_link}
                  class="anchor-bet-box">
                  <button 
                    class="
                      place-bet-btn 
                      btn-primary 
                      m-b-12
                    ">
                    <p
                      class="small">
                      {FIXTURE_VOTES_TRANSLATION?.bet}
                    </p>
                  </button>
                </a>
              {/if}

              <!-- 
              [ℹ] BETTING SITE INFO 
              -->
              <p
                class="
                  small 
                  text-center 
                  color-grey
                ">
                {SPORTBOOK_INFO.information}
              </p>

            </div>
          </div>
        {/if}

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

  /* widget-main */
  div#votes-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: 20px;
  }

  /* widget vote container */
  div#votes-widget-container div#btn-vote-container div.odds-vote-box {
    width: 100%;
    margin-right: 20px;
  } div#votes-widget-container div#btn-vote-container div.odds-vote-box:last-child {
    margin-right: 0;
  } div#votes-widget-container div#btn-vote-container button.cast-vote-btn {
		background: #f2f2f2;
		border: 1px solid #cccccc !important;
		box-sizing: border-box;
		border-radius: 8px;
		padding: 14px 16px;
		transition: all ease 0.15s;
		box-shadow: none !important;
		/* width: 96px; */
		height: 48px;
	}	div#votes-widget-container div#btn-vote-container button.cast-vote-btn.active {
		background: #ffffff !important;
		border: 1px solid #f5620f !important;
		box-sizing: border-box;
		border-radius: 8px;
		opacity: 1 !important;
	}	div#votes-widget-container div#btn-vote-container button.cast-vote-btn:disabled {
		opacity: 0.5;
	} div#votes-widget-container div#btn-vote-container p.probablitiy-text {
		text-align: center;
		color: #8c8c8c;
		width: min-content;
	} div#votes-widget-container div#btn-vote-container button.cast-vote-btn .active_p {
		color: #f5620f !important;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		border: none;
	}

  /* widget bet site container */
	div#site-bet-box {
		margin-top: 20px;
		background: #f2f2f2;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	} div#site-bet-box img#stakesSiteImg {
		background-color: var(--featured-match-bookmaker-bg-);
		object-fit: none;
		height: 40px;
	} div#site-bet-box div#inner-site-container {
		padding: 20px 12px;
		background: #f2f2f2;
		border-radius: 8px;
	} div#site-bet-box div#inner-site-container div#box-row > * {
    margin-right: 4px;
  } div#site-bet-box div#inner-site-container div#box-row > *:last-child {
    margin-right: 0;
  } div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box {
    width: 100%;
  } div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input#win-type {
		border-radius: 5px;
		border: 0;
		outline: none;
	} div#site-bet-box div#inner-site-container	div#box-row div.stakes-info-box .input-value {
		-moz-appearance: textfield;
		background: #ffffff;
		border-radius: 8px;
		height: 48px;
		/* width: 76px; */
		border: none;
	} div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input {
		background: rgb(255, 255, 255);
		color: black !important;
		opacity: 1 !important;
	} div#site-bet-box div#inner-site-container a.anchor-bet-box button.place-bet-btn {
		height: 46px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
    margin-top: 0;
	}

  /* widget bet site container width decalrations */
  div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box button,
  div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input,
  div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value,
  div#site-bet-box div#inner-site-container a.anchor-bet-box {
    /* max-width: -webkit-fill-available; */
    width: inherit;
  }

  /* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  NOTE: TABLET [EXCLUSIVE] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1160px)  {

    #votes-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
    
  }

  /* 
  NOTE: TABLET && DESKTOP [SHARED] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
   
    /* widget vote container */
    div#votes-widget-container div#btn-vote-container button.cast-vote-btn {
			min-width: 206px;
			width: 100%;
			height: 48px;
		}

    /* widget bet site container */
    div#site-bet-box #inner-site-container button {
			height: 44px;
		}  div#site-bet-box div#inner-site-container div#box-row > * {
      margin-right: 16px;
    } div#site-bet-box div#inner-site-container div#box-row > *:last-child {
      margin-right: 0;
    } div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value {
			width: 100%;
			/* max-width: 160px; */
			padding: 14px;
		} div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box input#win-type.desktop-view-winnings {
			padding: 0;
			text-align: end;
    }

  }

  /* 
  NOTE: DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {

    #votes-widget-container {
      min-width: 100%;
    }

    /* widget vote container */
		div#votes-widget-container div#btn-vote-container button.cast-vote-btn {
			min-width: 140px;
			width: 100%;
			height: 48px;
		}

    /* widget bet site container */
		div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box .input-value,
    div#site-bet-box div#inner-site-container div#box-row div.stakes-info-box a.anchor-bet-box {
			width: 100%;
			/* max-width: 160px; */
    } div#site-bet-box div#inner-site-container a.anchor-bet-box button.place-bet-btn {
      margin-top: 27px;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

	.dark-background-1 .cast-vote-btn {
		background-color: #616161 !important;
		border: 1px solid #999999 !important;
	}	.dark-background-1 .cast-vote-btn.active {
		border: 1px solid #f5620f !important;
	}

	.dark-background-1 p {
		color: #ffffff;
	}

	.dark-background-1 .probablitiy-text {
		color: #a8a8a8 !important;
	}

	.dark-background-1 #site-bet-box,
	.dark-background-1 #inner-site-container {
		background-color: #616161 !important;
	}
	.dark-background-1 #inner-site-container .input-value {
		background-color: #4b4b4b !important;
		color: #ffffff !important;
	} .dark-background-1 #inner-site-container input {
		color: #ffffff !important;
	}
  
	.dark-background-1 input#win-type {
		background-color: #4b4b4b !important;
	}
  
</style>
