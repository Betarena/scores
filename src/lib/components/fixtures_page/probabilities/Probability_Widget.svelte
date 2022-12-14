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
	import { REDIS_CACHE_FIXTURE_PROBABILITIES_0 } from "$lib/graphql/fixtures/probabilities/query";

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
	import type { Fixture_Probabilities, REDIS_CACHE_SINGLE_probabilities_translation } from "$lib/models/fixtures/probabilities/types";

	import ProbabilityLoader from "./Probability_Loader.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // NOTE: NO WIDGET SPECIFIC SEO or PRE-LOAD DATA REQUIRED
  // NOTE: lazy-loaded component data
  export let FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let FIXTURE_PROBS_TRANSLATION: REDIS_CACHE_SINGLE_probabilities_translation;

	let FIXTURE_PROB_DATA:      Fixture_Probabilities;
  let SPORTBOOK_INFO:         Cache_Single_SportbookDetails_Data_Response;
  let SPORTBOOK_DETAILS_LIST: Cache_Single_SportbookDetails_Data_Response[];

  let loaded:            boolean = false;     // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;     // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;     // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;         // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;
  let showMore:          boolean = false;
  let limitViewRow:      number = 8;          // [ℹ] holds the actual, `total` limit of the list of featured sites
  let toggleCTA:         boolean = false;
  let toggleCTA_Key:     string = undefined;
  let lazy_load_data_check: boolean = false;

  let show_placeholder:  boolean = false;     // [ℹ] [override] placeholder for "no-widget-data" for fixtures-page

  let exclude_prob_list = [
    'home',
    'draw',
    'away',
    'correct_score'
  ]

  let imageVar: string = '--probabilities-info-bookmaker-bg-';

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
  // [COMMENT TEMPLATE]

  function triggerGoggleEvents(
    action: string
  ) {
    if (action === "fixture_football_fixtures_probabilities") {
      window.gtag(
        'event', 
        "fixture_football_fixtures_probabilities", 
        { 
          'event_category': "fixture_football_fixtures_probabilities", 
          'event_label': "click_betting_site_logo", 
          'value': "click"
        }
      );
      return
    }
  }

  function toggleFullList() {
    showMore = !showMore;
    limitViewRow =
      showMore == true
        ? 100
        : 8
    ;
  }

  function toggle_cta (key: string) {
    if (toggleCTA_Key == key) {
      toggleCTA = !toggleCTA
    } else {
      toggleCTA = true;
      toggleCTA_Key = key
    }
  }

  function closeAllDropdowns() {
    toggleCTA = false;
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

          // [ℹ] distorted "sportmonks" image color-thief application
          const imageURL: string = SPORTBOOK_INFO?.image
          getImageBgColor(imageURL, imageVar)
    
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
    <!-- <ProbabilityLoader /> -->

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <ProbabilityLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <h2
        class="
          s-20 
          m-b-10 
          w-500 
          color-black-2
        "
        class:color-white={$userBetarenaSettings.theme == 'Dark'}
        style="margin-top: 0px;">
        {FIXTURE_PROBS_TRANSLATION?.probabilities}
      </h2>

      <div
        id="prob-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] (minimal) cross-platform design change
        -->

        <!-- 
        [ℹ] Top Bet Site Box
        -->
        <div
          class="
            row-space-center
            bet-site-box
            m-b-8
          ">
          <p 
            class="
              s-12
              color-grey
              m-r-10
            ">
            {FIXTURE_PROBS_TRANSLATION?.featured_by}
          </p>
          <a 
            rel="nofollow"
            aria-label="fixture_football_fixtures_probabilities"
            on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
            href={SPORTBOOK_INFO?.register_link}
            target="_blank"
            style="width: fit-content;">
            <img 
              id='sportbook-logo-img'
              src={SPORTBOOK_INFO?.image}
              alt={SPORTBOOK_INFO?.title}
            />
          </a>
        </div>

        <!-- 
        [ℹ] Team Row (Prob + Odds)
        -->
        <div
          id="team-row-probabilities"
          class="
            row-space-out
          ">

          <!-- 
          HOME TEAM 
          -->
          <div
            class="
              column-space-center
              team-box
            ">
            <p
              class="
                w-500
                color-black-2
                market-type-text
              ">
              {FIXTURE_PROBS_TRANSLATION?.home_team_win}
            </p>
            <!-- 
            Probabilities BUTTON
            + Bet-Site PopUp
            -->
            <div
              id='button-extra-info-container'>

              <button
                class="
                  place-bet-btn 
                  btn-primary
                "
                on:click={() => toggle_cta('home')}>
                <p
                  class="
                    w-500
                  ">
                  {FIXTURE_PROB_DATA?.probabilites?.home.toFixed(0)}%
                </p>
              </button>

              <!-- 
              [ℹ] extra-info pop-up container
              -->
              {#if toggleCTA
                && toggleCTA_Key == 'home'}
                <div
                  class="extra-info" 
                  in:fade>

                  <!--  
                  [ℹ] site-image 
                  -->
                  <a
                    rel="nofollow" 
                    aria-label="fixture_football_fixtures_probabilities"
                    on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                    href={SPORTBOOK_INFO?.register_link}
                    style="width: inherit;">
                    <img
                      style="background-color: var({imageVar});"
                      class="extra-info-img"
                      src={SPORTBOOK_INFO?.image}
                      alt={SPORTBOOK_INFO?.title}
                    />
                  </a>

                  <!--  
                  [ℹ] extra-site info 
                  -->
                  <div
                    class="extra-info-container">
                    <!--  
                    [ℹ] text 
                    -->
                    <p 
                      class="large">
                      {SPORTBOOK_INFO?.bonus_description}
                    </p>
                    <!--  
                    [ℹ] button_cta 
                    -->
                    <a 
                      rel="nofollow" 
                      aria-label="fixture_football_fixtures_probabilities"
                      on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                      href={SPORTBOOK_INFO?.register_link}
                      target="_blank">
                      <button
                        class="btn-primary btn-cta"
                        style="width: 100% !important;">
                        <p 
                          class="w-500 s-14 w-normal">
                          Register
                        </p>
                      </button>
                    </a>
                    <!--  
                    [ℹ] extra-site info text 
                    -->
                    <p 
                      class="small" 
                      style="color: #CCCCCC;">
                      {SPORTBOOK_INFO?.information}
                    </p>
                  </div>
                </div>
              {/if}

            </div>
            <p
              class="
                w-400
                color-grey
                odds-text
              ">
              {FIXTURE_PROBS_TRANSLATION?.odds}
              {#if FIXTURE_PROB_DATA?.odds?._1x2?.home != undefined}
                {FIXTURE_PROB_DATA?.odds?._1x2?.home}
              {:else}
                -
              {/if}
            </p>
          </div>

          <!-- 
          DRAW 
          -->
          <div
            class="
              column-space-center
              team-box
            ">
            <p
              class="
                w-500
                color-black-2
                market-type-text
              ">
              {FIXTURE_PROBS_TRANSLATION?.draw}
            </p>
            <!-- 
            Probabilities BUTTON
            + Bet-Site PopUp
            -->
            <div
              id='button-extra-info-container'>

              <button
                class="
                  place-bet-btn 
                  btn-primary
                "
                on:click={() => toggle_cta('draw')}>
                <p  
                  class="
                    w-500
                  ">
                  {FIXTURE_PROB_DATA?.probabilites?.draw.toFixed(0)}%
                </p>
              </button>

              <!-- 
              [ℹ] extra-info pop-up container
              -->
              {#if toggleCTA
                && toggleCTA_Key == 'draw'}
                <div
                  class="extra-info" 
                  in:fade>

                  <!--  
                  [ℹ] site-image 
                  -->
                  <a
                    rel="nofollow" 
                    aria-label="fixture_football_fixtures_probabilities"
                    on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                    href={SPORTBOOK_INFO?.register_link}
                    style="width: inherit;">
                    <img
                      style="background-color: var({imageVar});"
                      class="extra-info-img"
                      src={SPORTBOOK_INFO?.image}
                      alt={SPORTBOOK_INFO?.title}
                    />
                  </a>

                  <!--  
                  [ℹ] extra-site info 
                  -->
                  <div
                    class="extra-info-container">
                    <!--  
                    [ℹ] text 
                    -->
                    <p 
                      class="large">
                      {SPORTBOOK_INFO?.bonus_description}
                    </p>
                    <!--  
                    [ℹ] button_cta 
                    -->
                    <a 
                      rel="nofollow" 
                      aria-label="fixture_football_fixtures_probabilities"
                      on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                      href={SPORTBOOK_INFO?.register_link}
                      target="_blank">
                      <button
                        class="btn-primary btn-cta"
                        style="width: 100% !important;">
                        <p 
                          class="w-500 s-14 w-normal">
                          Register
                        </p>
                      </button>
                    </a>
                    <!--  
                    [ℹ] extra-site info text 
                    -->
                    <p 
                      class="small" 
                      style="color: #CCCCCC;">
                      {SPORTBOOK_INFO?.information}
                    </p>
                  </div>
                </div>
              {/if}

            </div>
            <p
              class="
                w-400
                color-grey
                odds-text
              ">
              {FIXTURE_PROBS_TRANSLATION?.odds}
              {#if FIXTURE_PROB_DATA?.odds?._1x2?.draw != undefined}
                {FIXTURE_PROB_DATA?.odds?._1x2?.draw}
              {:else}
                -
              {/if}
            </p>
          </div>

          <!-- 
          AWAY TEAM 
          -->
          <div
            class="
              column-space-center
              team-box
            ">
            <p
              class="
                w-500
                color-black-2
                market-type-text
              ">
              {FIXTURE_PROBS_TRANSLATION?.away_team_win}
            </p>
            <!-- 
            Probabilities BUTTON
            + Bet-Site PopUp
            -->
            <div
              id='button-extra-info-container'>

              <button
                class="
                  place-bet-btn 
                  btn-primary
                "
                on:click={() => toggle_cta('away')}>
                <p
                  class="
                    w-500
                  ">
                  {FIXTURE_PROB_DATA?.probabilites?.away.toFixed(0)}%
                </p>
              </button>

              <!-- 
              [ℹ] extra-info pop-up container
              -->
              {#if toggleCTA
                && toggleCTA_Key == 'away'}
                <div
                  class="extra-info" 
                  in:fade>

                  <!--  
                  [ℹ] site-image 
                  -->
                  <a
                    rel="nofollow" 
                    aria-label="fixture_football_fixtures_probabilities"
                    on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                    href={SPORTBOOK_INFO?.register_link}
                    style="width: inherit;">
                    <img
                      style="background-color: var({imageVar});"
                      class="extra-info-img"
                      src={SPORTBOOK_INFO?.image}
                      alt={SPORTBOOK_INFO?.title}
                    />
                  </a>

                  <!--  
                  [ℹ] extra-site info 
                  -->
                  <div
                    class="extra-info-container">
                    <!--  
                    [ℹ] text 
                    -->
                    <p 
                      class="large">
                      {SPORTBOOK_INFO?.bonus_description}
                    </p>
                    <!--  
                    [ℹ] button_cta 
                    -->
                    <a 
                      rel="nofollow" 
                      aria-label="fixture_football_fixtures_probabilities"
                      on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                      href={SPORTBOOK_INFO?.register_link}
                      target="_blank">
                      <button
                        class="btn-primary btn-cta"
                        style="width: 100% !important;">
                        <p 
                          class="w-500 s-14 w-normal">
                          Register
                        </p>
                      </button>
                    </a>
                    <!--  
                    [ℹ] extra-site info text 
                    -->
                    <p 
                      class="small" 
                      style="color: #CCCCCC;">
                      {SPORTBOOK_INFO?.information}
                    </p>
                  </div>
                </div>
              {/if}

            </div>
            <p
              class="
                w-400
                color-grey
                odds-text
              ">
              {FIXTURE_PROBS_TRANSLATION?.odds}
              {#if FIXTURE_PROB_DATA?.odds?._1x2?.away != undefined}
                {FIXTURE_PROB_DATA?.odds?._1x2?.away}
              {:else}
                -
              {/if}
            </p>
          </div>
          
        </div>

        <!-- 
        [ℹ] Other Probabilities + Odds Box [TOP]
        -->
        <div
          id="probabilites-head-box"
          class="
            row-space-out
          ">
          <p
            class="
              w-400
              color-grey
            ">
            {FIXTURE_PROBS_TRANSLATION?.market}
          </p>
          <p
            class="
              w-400
              color-grey
            ">
            {FIXTURE_PROBS_TRANSLATION?.probabilities}
          </p>
          <p
            class="
              w-400
              color-grey
            ">
            {FIXTURE_PROBS_TRANSLATION?.odds}
          </p>
        </div>

        <!-- 
        [ℹ] Other Probabilities + Odds Box [Section Main]
        -->
        {#each Object.entries(FIXTURE_PROB_DATA.probabilites).slice(0, limitViewRow) as [key, value]}

          {#if !exclude_prob_list.includes(key)}
            <!-- 
            Probabilites ROW
            -->
            <div
              class="
                row-space-out
                prob-odds-row
              ">
              <!-- 
              Probabilities Title
              -->
              <p
                class="
                  w-500
                  color-black-2
                  prob-title
                ">
                {FIXTURE_PROBS_TRANSLATION[key]}:
              </p>
              <!-- 
              Group Button
              -->
              <div
                class="
                  row-space-end
                ">
                <!-- 
                Probabilities BUTTON
                + Bet-Site PopUp
                -->
                <div
                  id='button-extra-info-container'>

                  <button
                    class="
                      place-bet-btn 
                      btn-primary
                    "
                    on:click={() => toggle_cta(key)}>
                    <p
                      class="
                        w-500
                      ">
                      {value.toFixed(0)}%
                    </p>
                  </button>

                  <!-- 
                  [ℹ] extra-info pop-up container
                  -->
                  <div
                    class="extra-info fade-in"
                    class:display_none={(!toggleCTA || toggleCTA_Key != key)}
                    in:fade>

                    <!--  
                    [ℹ] site-image 
                    -->
                    <a
                      rel="nofollow" 
                      aria-label="fixture_football_fixtures_probabilities"
                      on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                      href={SPORTBOOK_INFO?.register_link}
                      style="width: inherit;">
                      <img
                        style="background-color: var({imageVar});"
                        class="extra-info-img"
                        src={SPORTBOOK_INFO?.image}
                        alt={SPORTBOOK_INFO?.title}
                      />
                    </a>

                    <!--  
                    [ℹ] extra-site info 
                    -->
                    <div
                      class="extra-info-container">
                      <!--  
                      [ℹ] text 
                      -->
                      <p 
                        class="large">
                        {SPORTBOOK_INFO?.bonus_description}
                      </p>
                      <!--  
                      [ℹ] button_cta 
                      -->
                      <a 
                        rel="nofollow" 
                        aria-label="fixture_football_fixtures_probabilities"
                        on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                        href={SPORTBOOK_INFO?.register_link}
                        target="_blank">
                        <button
                          class="btn-primary btn-cta"
                          style="width: 100% !important;">
                          <p 
                            class="w-500 s-14 w-normal">
                            Register
                          </p>
                        </button>
                      </a>
                      <!--  
                      [ℹ] extra-site info text 
                      -->
                      <p 
                        class="small" 
                        style="color: #CCCCCC;">
                        {SPORTBOOK_INFO?.information}
                      </p>
                    </div>
                  </div>

                </div>
                <!-- 
                Equal Sign
                -->
                <p
                  class="
                    w-400
                    color-grey
                    equal-sign
                  ">
                  =
                </p>
                <!-- 
                Odds BUTTON
                -->
                <button
                  class="
                    odds-box-btn
                  ">
                  <p
                    class="
                      color-grey
                      w-400
                    ">
                    {#if key == 'btts' 
                      && FIXTURE_PROB_DATA?.odds?.btts != undefined}
                      {FIXTURE_PROB_DATA?.odds?.btts}
                    {:else if key == 'over_2_5'
                      && FIXTURE_PROB_DATA?.odds?.over_2_5 != undefined}
                      {FIXTURE_PROB_DATA?.odds?.over_2_5}
                    {:else}
                      -
                    {/if}
                  </p>
                </button>
              </div>
            </div>
          {/if}

          {#if key == 'correct_score'}
            <!--
            [ℹ] Correct Socre Title (txt)
            -->
            <p
              id="correct-score-text"
              class="
                w-400
                color-grey
                text-center
              ">
              {FIXTURE_PROBS_TRANSLATION?.correct_score}
            </p>

            <!--
            [ℹ] Correct Socre Grid-Box (box)
            -->
            <div
              id="correct-score-box">
              {#each Object.entries(FIXTURE_PROB_DATA.probabilites.correct_score) as [key, value]}
                <!-- 
                Probabilities Title
                -->
                <div
                  class="
                    column-space-center
                  ">
                  <p
                    class="
                      w-500
                      color-black-2
                    ">
                    {key}
                  </p>
                  <!-- 
                  Probabilities BUTTON
                  + Bet-Site PopUp
                  -->
                  <div
                    id='button-extra-info-container'>

                    <button
                      class="
                        place-bet-btn 
                        btn-primary
                      "
                      on:click={() => toggle_cta(key)}>
                      <p  
                        class="
                          w-500
                        ">
                        {value.toFixed(0)}%
                      </p>
                    </button>

                    <!-- 
                    [ℹ] extra-info pop-up container
                    -->
                    <div
                      class="extra-info fade-in"
                      class:display_none={(!toggleCTA || toggleCTA_Key != key)}
                      in:fade>

                      <!--  
                      [ℹ] site-image 
                      -->
                      <a 
                        rel="nofollow" 
                        aria-label="fixture_football_fixtures_probabilities"
                        on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                        href={SPORTBOOK_INFO?.register_link}
                        style="width: inherit;">
                        <img
                          style="background-color: var({imageVar});"
                          class="extra-info-img"
                          src={SPORTBOOK_INFO?.image}
                          alt={SPORTBOOK_INFO?.title}
                        />
                      </a>

                      <!--  
                      [ℹ] extra-site info 
                      -->
                      <div
                        class="extra-info-container">
                        <!--  
                        [ℹ] text 
                        -->
                        <p 
                          class="large">
                          {SPORTBOOK_INFO?.bonus_description}
                        </p>
                        <!--  
                        [ℹ] button_cta 
                        -->
                        <a 
                          rel="nofollow" 
                          aria-label="fixture_football_fixtures_probabilities"
                          on:click={() => triggerGoggleEvents("fixture_football_fixtures_probabilities")}
                          href={SPORTBOOK_INFO?.register_link}
                          target="_blank">
                          <button
                            class="btn-primary btn-cta"
                            style="width: 100% !important;">
                            <p 
                              class="w-500 s-14 w-normal">
                              Register
                            </p>
                          </button>
                        </a>
                        <!--  
                        [ℹ] extra-site info text 
                        -->
                        <p 
                          class="small" 
                          style="color: #CCCCCC;">
                          {SPORTBOOK_INFO?.information}
                        </p>
                      </div>
                    </div>

                  </div>
                  <p
                    class="
                      w-400
                      color-grey
                    ">
                    {FIXTURE_PROBS_TRANSLATION?.odds} -
                  </p>
                </div>
              {/each}
            </div>

          {/if}
        {/each}
          
        <!--
        [ℹ] Show more / show less (box)
        -->
        <div>
          <p 
            id="show-more-box" 
            on:click={() => toggleFullList ()}>
            {#if !showMore}
              {FIXTURE_PROBS_TRANSLATION?.show_more_options}
            {:else}
              {FIXTURE_PROBS_TRANSLATION?.show_less}
            {/if}
          </p>
        </div>

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
  div#prob-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    /* overflow: hidden; */
    width: 100%;
    position: relative;
    padding: 20px;
  }

  /* bet-site */
  div#prob-widget-container div.bet-site-box {
    margin-bottom: 26px;
  } div#prob-widget-container div.bet-site-box img {
    width: 67px;
    height: 28px;
    border-radius: 5.49px;
    object-fit: cover;
    z-index: 1;
  }

  /* team probabilites box style */
  div#prob-widget-container div#team-row-probabilities {
    margin-bottom: 24px;
    border-bottom: 1px #E6E6E6 solid;
  } div#prob-widget-container div#team-row-probabilities div.team-box {
    margin-right: 16px;
  } div#prob-widget-container div#team-row-probabilities div.team-box:last-child {
    margin-right: 0;
  } div#prob-widget-container div#team-row-probabilities div.team-box p.market-type-text {
    font-size: 14px;
  } div#prob-widget-container div#team-row-probabilities div.team-box p.odds-text {
    font-size: 14px;
    margin-bottom: 12px;
  } div#prob-widget-container div#team-row-probabilities div.team-box button.place-bet-btn {
		height: 46px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
    margin-top: 8px;
    margin-bottom: 12px;
	} div#prob-widget-container div#team-row-probabilities div.team-box button.place-bet-btn p {
    font-size: 14px;
  }

  /* probabilites head box style */
  div#prob-widget-container div#probabilites-head-box {
    margin-bottom: 12px;
  } div#prob-widget-container div#probabilites-head-box p:last-child {
    margin-right: 53px;
  }

  /* probabilites [main] rows style */
  div.prob-odds-row {
    padding-bottom: 12px;
  } div.prob-odds-row p.prob-title {
    font-size: 14px;
    width: 160px;
  } div.prob-odds-row div#button-extra-info-container button.place-bet-btn {
    height: 48px;
		width: 100%;
    max-width: 139px;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
    margin-top: 0;
  } div.prob-odds-row div#button-extra-info-container button.place-bet-btn p {
    font-size: 14px;
  } div.prob-odds-row p.equal-sign {
    margin: 0 8px;
    font-size: 14px;
  } div.prob-odds-row button.odds-box-btn {
    height: 48px;
		width: 100%;
    max-width: 139px;
		background-color: #ffffff;
		border-radius: 8px;
    margin-top: 0;
    border: 1px solid #CCCCCC !important;
  } div.prob-odds-row button.odds-box-btn p {
    font-size: 14px;
  }

  /* probabilites [correct-score] rows style */
  p#correct-score-text {
    font-size: 14px;
    margin-top: 8px;
    margin-bottom: 12px;
  }

  div#correct-score-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 12px 16px;
  } div#correct-score-box button.place-bet-btn {
    height: 48px;
		width: 100%;
    max-width: 139px;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
    margin-top: 8px;
    margin-bottom: 12px;
  } div#correct-score-box button.place-bet-btn p {
    font-size: 14px;
  }

  #button-extra-info-container {
    position: relative;
    width: 100%;
    max-width: 139px;
  } .extra-info-container {
    padding: 20px;
    display: grid;
    justify-items: stretch;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
  } .extra-info-container p {
    color: white;
  } .extra-info {
    background: #4b4b4b;
    box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
    border-radius: 8px;
    top: 105%;
    max-width: 289px;
    width: 289px;
    display: grid;
    z-index: 999;
    justify-items: center;
    overflow: hidden;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  } .extra-info-img {
    width: 100%;
    object-fit: contain;
    height: 40px;
  } .btn-cta {
    border-radius: 8px !important;
    margin-top: 32px;
    margin-bottom: 16px;
    padding: 11.5px !important;
    width: -webkit-fill-available;
  }
  
  button.place-bet-btn:hover,
  .btn-cta:hover {
    background: #F77C42 !important;
  }

  /* show-more / show-less style */
  #show-more-box {
    padding: 25px 0;
    padding-bottom: 0;
    text-align: center;
    white-space: nowrap;
    color: var(--primary);
    cursor: pointer;
    border-top: 1px solid #EBEBEB;
    margin: 0 -20px;
    margin-top: 20px;
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

  /* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  NOTE: TABLET [EXCLUSIVE] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1160px)  {

    #prob-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
    
  }

  /* 
  NOTE: TABLET && DESKTOP [SHARED] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
   
  }

  /* 
  NOTE: DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {

    #prob-widget-container {
      min-width: 100%;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  div#prob-widget-container.dark-background-1 div#team-row-probabilities {
    border-bottom: 1px #616161 solid;
  }

  div#prob-widget-container.dark-background-1 div.prob-odds-row button.odds-box-btn {
    height: 48px;
		width: 100%;
    max-width: 139px;
		background-color: #4B4B4B;
		border-radius: 8px;
    margin-top: 0;
    border: 1px solid #737373 !important;
  }

  div#prob-widget-container.dark-background-1 #show-more-box {
    border-top: 1px solid #616161;
  }

</style>
