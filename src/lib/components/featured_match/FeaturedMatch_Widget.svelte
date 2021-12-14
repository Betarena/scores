<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  // ... svelte-imports;
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
	import { amp, browser, dev, mode, prerendering } from '$app/env'

  // ... external modules imports;
  import ColorThief from 'colorthief/dist/color-thief.mjs'

  import FeaturedMatchContentLoading from "./FeaturedMatch_ContentLoading.svelte";

  // ... external `exports` imports;
  import { db_real } from '$lib/firebase/init'
  import { UPDATE_MATCH_FIXTURE_VOTES } from "$lib/graphql/mutation"
  import { getUserLocation } from "$lib/geoJs/init"
  import { fixtureVote } from "$lib/store/vote_fixture"
  import { getTargetFixtureOdds, getTargetGeoSportBookDetails } from "$lib/firebase/index"
  import { GET_ALL_FIXTURE_DATA, GET_LANG_SELECTED_FIXTURE } from "$lib/graphql/query"
	import { userBetarenaSettings } from '$lib/store/user-settings'
	import { initGrapQLClient } from '$lib/graphql/init_graphQL'
  import { getDatabase, ref, set, onValue } from "firebase/database"

  // ... DECLARING TYPESCRIPT-TYPES imports;
  import type { fixture } from "$lib/store/vote_fixture"
  import type { FixtureResponse, ValueBet, MatchVotes } from "$lib/model/interface-fixture"
  import type { GeoJsResponse } from "$lib/model/geo-js-interface"
  import type { SelectedFixutre, BestPlayers_Data, Tv_Station, TranslationsResponse, CompleteFixtureData_Response, SelectedFixture_VoteUpdate_Response } from "$lib/model/response_models"
  import type { SelectedFixture_LiveOdds_Response } from "$lib/model/firebase-real-db-interface"

  let totalVotes: number  // ???

  // ... declaring component INSTANCED & VARIABLES;
  let WIDGET_SELECTED_FIXTURE_MATCH_VOTES: MatchVotes
  let WIDGET_SELECTED_FIXTURE_START_TIME: Date                              // ... contains the final widget fixture start time;
  let WIDGET_SELECTED_FIXTURE_DATA: FixtureResponse                         // ... contains the final-fixture-response-data;
  let WIDGET_SELECTED_FIXTURE_ID: number                                    // ... global-widget-component-selected-fixutre-id-value;
  let WIDGET_SELECTED_FIXTURE_VALUE_BETS: ValueBet                          // ... contains the widget-selected-fixture-value-bets-data;
  let WIDGET_SELECTED_FIXTURE_BEST_PLAYERS: BestPlayers_Data                // ... contains the widget-best-players-data;
  let WIDGET_SELECTED_FIXTURE_TV_STATIONS_DATA: Array<Tv_Station>           // ... contains the widget-tv-stations-data;
  let WIDGET_SELECTED_FIXTURE_LIVE_ODDS: SelectedFixture_LiveOdds_Response  // ... contains the widget-live-odds-data;
  let WIDGET_TRANSLATION_DATA: Array < TranslationsResponse >               // ... contains the widget-WIDGET_TRANSLATION_DATA-data;

  // ... DEBUGGING;
  $: if (dev) console.info('WIDGET_SELECTED_FIXTURE_LIVE_ODDS', WIDGET_SELECTED_FIXTURE_LIVE_ODDS)
  $: if (dev) console.info('WIDGET_TRANSLATION_DATA', WIDGET_TRANSLATION_DATA)
  $: if (dev) console.info('WIDGET_SELECTED_FIXTURE_BEST_PLAYERS', WIDGET_SELECTED_FIXTURE_BEST_PLAYERS)
  $: if (dev) console.info('WIDGET_SELECTED_FIXTURE_DATA', WIDGET_SELECTED_FIXTURE_DATA)
  $: if (dev) console.info('WIDGET_SELECTED_FIXTURE_VALUE_BETS', WIDGET_SELECTED_FIXTURE_VALUE_BETS)
  $: if (dev) console.info('WIDGET_SELECTED_FIXTURE_TV_STATIONS_DATA', WIDGET_SELECTED_FIXTURE_TV_STATIONS_DATA)

  // ... initiate the MAIN PROMISE();
  let promise = mainData()

  /**
   * Description: & [REACTIVITY]
   * ~~~~~~~~~~~~~~~~~~~
   * ... get user Geo-Location [WORKING]
   * and continue with the rest of the methods;
  */
  let userGeo: string

  // ... contains the main METHOD for DATA AGGREGATION & ASSIGNING;
  async function mainData() {
    // ... get the USER-GEO-LOCATION
    const userGeoResponse: GeoJsResponse = await getUserLocation()
    userGeo = userGeoResponse.country_code.toLowerCase()
    // ... DEBUGGING;
    if (dev) console.info('-- user location --', userGeo)

    // ... obtain the target-selected-fixture [HASURA-DB] [FEATURED-MATCH + TRANSLATION DATA]
    const selectedFixture = await getSelectedFixture(userGeo)
    // ... [selectedFixture] break-down response;
    let selected_fixture_id = selectedFixture.widget_featured_match_selection[0].fixture_id
    WIDGET_SELECTED_FIXTURE_ID = selected_fixture_id
    WIDGET_TRANSLATION_DATA = selectedFixture.widget_featured_match_translations

    // ... continue; 
    // ... create a promise, for obtaining the complete fixture odds data;
    // ... handles [WIDGET_SELECTED_FIXTURE_LIVE_ODDS]
    // ... listen to real-time odds for the widget data;
    let promiseData = await listenRealTimeOddsChange(selectedFixture.widget_featured_match_selection[0])

    // ... continue; 
    // ... get the complete fixture data in one JSON Object;
    const completeData = await get_CompleteFixtureData(selected_fixture_id)
    // ... [completeData] break-down response;
    WIDGET_SELECTED_FIXTURE_START_TIME = completeData.week_fixtures_by_pk.time
    WIDGET_SELECTED_FIXTURE_START_TIME = new Date(WIDGET_SELECTED_FIXTURE_START_TIME.toString())
    // ...
    WIDGET_SELECTED_FIXTURE_DATA = completeData.week_fixtures_by_pk
    // ...
    WIDGET_SELECTED_FIXTURE_BEST_PLAYERS = completeData.widget_featured_match_best_player_by_pk
    // ...
    WIDGET_SELECTED_FIXTURE_TV_STATIONS_DATA = completeData.week_fixtures_by_pk.tvstations
    // ...
    WIDGET_SELECTED_FIXTURE_MATCH_VOTES = completeData.widget_featured_match_votes_by_pk
    // ...
    totalVotes = WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_draw_x + WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_local + WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_visitor

    // ... continue; 
    // ... get the fixture value-bets;
    // ... handles `WIDGET_SELECTED_FIXTURE_VALUE_BETS`
    if (WIDGET_SELECTED_FIXTURE_DATA.valuebets != null) {
      assignValueBetsData();
    }

    return WIDGET_SELECTED_FIXTURE_DATA
  }

  // ... [WORKING]
  async function getSelectedFixture(lang: string) {
    // ... DEBUGGING;
    // if (dev) platformCountry = "en"
    // ... declare variables for GRAPH-QL-REQUEST;
    const variables = { 
      lang: lang
    }
    // ... push-GRAPH-QL-request;
		const response = await initGrapQLClient().request(GET_LANG_SELECTED_FIXTURE, variables)
    // ... DEBUGGING;
    if (dev) console.info('-- response getSelectedFixture() --', response)
    // ... if `widget_featured_match_selection` is EMPTY;
    if (response.widget_featured_match_selection.length == 0) {
      // ... rerun the method;
      if (dev) console.info('-- uh-oh! re-running getSelectedFixture() --')
      // ... DEFAULT EN VALUE
      getSelectedFixture('en')
    }
    // ... reutrn response;
    return response
  }

  // ... [WORKING]
  async function get_CompleteFixtureData(fixture_id: number): Promise < CompleteFixtureData_Response > {
    // ... DEBUGGING;
    if (dev) console.info('-- fixture_id --', fixture_id)
    // ... declare variables for GRAPH-QL-REQUEST;
    const variables = { 
      id: fixture_id, 
      fixture_id: fixture_id 
    }
    // ... push-GRAPH-QL-request;
    const response = await initGrapQLClient().request(GET_ALL_FIXTURE_DATA, variables)
    // ... DEBUGGING;
    if (dev) console.info('-- response get_CompleteFixtureData() --', response)
    // ... reutrn response;
    return response;
  }

  // ... [WORKING]
  async function listenRealTimeOddsChange(fixture_data: SelectedFixutre): Promise < void > {
      // ... DEBUGGING;
      if (dev) console.info('-- fixture_data --', fixture_data)
      // ... convert the datetime to the correct variables to search for the fixture;
      const year_: string = new Date(fixture_data.date).getFullYear().toString()
      const month_: number = new Date(fixture_data.date).getMonth()
      // ... apply-correct-month-structure;
      let new_month_ = (month_ + 1).toString()
      new_month_ = ("0" + new_month_).slice(-2)
      // ... apply-correct-day-structure;
      let day_ = new Date(fixture_data.date).getDate().toString()
      day_ = ("0" + day_).slice(-2)
      // ... obtain FIXTURE-ID;
      const fixtureId = fixture_data.fixture_id
      // ... listen to real-time fixture event changes;
      const fixtureRef = ref(db_real, 'odds/' + year_ + '/' + new_month_ + '/' + day_ + '/' + fixtureId)
      // ... setup-database event listener for the odds fixture changes;
      let data;
      onValue(fixtureRef, (snapshot) => {
          // ... DEBUGGING;
          if (dev) console.info('-- fixture changed! --')
          // if (dev) console.info('fixture cahnged data', snapshot.val())
          // ...
          get_TargetFixtureOddsAndInfo(fixture_data)
      });
      // ...
      return data;
  }
  
  // ... [WORKING]
  async function get_TargetFixtureOddsAndInfo(selectedFixutreData: SelectedFixutre): Promise < void > {
    // ... get the list of the odds for the;
    WIDGET_SELECTED_FIXTURE_LIVE_ODDS = await getTargetFixtureOdds(selectedFixutreData)
    // ... intercept the image of the matchbetting site logo, and declare it in TOP-LEVEL;
    let imageURL: string = WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds_info.image
    // ... apply the correct background-color to the image;
    getImageBgColor(imageURL)
  }

  // ... [WORKING]
  async function assignValueBetsData(): Promise < void > {
    // ... 
    WIDGET_SELECTED_FIXTURE_VALUE_BETS = WIDGET_SELECTED_FIXTURE_DATA.valuebets
    // ... obtain-target-fixture-bookmaker-site-name;
    let siteName: string = WIDGET_SELECTED_FIXTURE_VALUE_BETS.bookmaker
    // ... pass-in-sport-book-details-parameters;
    let sportbook_details: any = await getTargetGeoSportBookDetails(
      userGeo,
      siteName
    )
    // ... check if the data returned exists;
    if (Object.keys(sportbook_details).length === 0) {
      // ... if not, return `null`;
      WIDGET_SELECTED_FIXTURE_VALUE_BETS = null
      return
    }
    // ... otherwise, append the image & the registration link to the data;
    WIDGET_SELECTED_FIXTURE_VALUE_BETS = {
      ...WIDGET_SELECTED_FIXTURE_VALUE_BETS,
      image: sportbook_details.betting_site_info.image,
      link: sportbook_details.betting_site_info.register_link,
    }
  }

  // ... [WORKING]
  async function handleSubmit(fixtureData: fixture): Promise < void > {
    // ... declare variables for GRAPH-QL-REQUEST;
    const variables = { 
      match_id: fixtureData.fixture_id,
      _1_vote: fixtureData._1_vote,
      _2_vote: fixtureData._2_vote,
      _X_vote: fixtureData._X_vote,
    }
    // ... DEBUGGING;
    if (dev) console.debug('variables', variables)
    // ... [TRY-CATCH]
    try {
      // ... push-GRAPH-QL-request; 
      const update_fixture_data: SelectedFixture_VoteUpdate_Response = await initGrapQLClient().request(UPDATE_MATCH_FIXTURE_VOTES, variables)
      // ... DEBUGGING;
      if (dev) console.debug('update_fixture_data', update_fixture_data)
      // ... update the existing data on the CASTED-VOTES;
      WIDGET_SELECTED_FIXTURE_MATCH_VOTES = update_fixture_data.update_widget_featured_match_votes_by_pk
      totalVotes = WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_draw_x + WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_local + WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_visitor
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2))
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // USER ACTTIONS METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  let selected_bet; // contains the data for the `selected_bets`;
  let user_Stake_amount: number = 50.0; // user stake amount (input)

  /**
   * Description: & [REACTIVITY]
   * ~~~~~~~~~~~~~~~~~~~
   * ... assigning the default values for
   * the target fixture info;
   */
  let fixtureDataVote: fixture = {
    fixture_id: undefined,
    fixture_vote: undefined,
    fixture_vote_val: undefined,
    _X_vote: undefined,
    _1_vote: undefined,
    _2_vote: undefined,
  }
  $: if ($fixtureVote.fixtureVotes_Array != undefined && WIDGET_SELECTED_FIXTURE_ID != undefined) {
    // ... returns the fixture obj. matching the fixture data;
    const result = $fixtureVote.fixtureVotes_Array.find((fixture) => {
      return fixture.fixture_id === WIDGET_SELECTED_FIXTURE_ID
    });
    // ... if localStorage(); exists, then assign it to the `fixtureDataVote`,
    // ... and show the match-betting site information;
    if (result != undefined) {
      fixtureDataVote = result;
      showBettingSite = true;
      voteCasted = true;
    }
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... handling the user-voting on a THIS fixture
   * ... & storing the votes on the DB (PostgresDB)
   * ... for keeping a record of the votes;
   */
  let showBettingSite: boolean = false
  let voteCasted: boolean = false
  // ...
  function castVote(voteType: string, voteVal: string): void {
    // ... DEBUGGING;
    if (dev) console.log('-- voteVal --', voteVal)
    // ... check if a vote has already been casted ?;
    if (!voteCasted) {
      // ... update the showBettingSite Frame;
      showBettingSite = true;
      // ... update the VoteMatch on DB;
      fixtureDataVote = {
        fixture_id: WIDGET_SELECTED_FIXTURE_ID,
        fixture_vote: voteType,
        fixture_vote_val: voteVal,
        _X_vote: 0,
        _1_vote: 0,
        _2_vote: 0,
      };
      fixtureDataVote["_" + fixtureDataVote.fixture_vote + "_vote"] = 1;
      handleSubmit(fixtureDataVote);
      // ... and .localStorage();
      fixtureVote.addToVotes(fixtureDataVote);
      // ... set the BOOLEAN to voteCasted to TRUE;
      voteCasted = true;
    }
    // ... else, do nothing;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... onMount() function that verifies that
   * the `viewport` width is of tablet size
   * or greater;
   */
  let viewportDesktop: boolean

  onMount(async () => {
    var wInit = document.documentElement.clientWidth;
    if (wInit > 700) {
      viewportDesktop = true;
    } else {
      viewportDesktop = false;
    }
    window.addEventListener("resize", function () {
      var w = document.documentElement.clientWidth;
      if (w > 700) {
        viewportDesktop = true;
      } else {
        viewportDesktop = false;
      }
    });
  })

  // ~~~~~~~~~~~~~~~~~~~~~
  // COMPONENT TIMER CLOCK
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * Description
   * ~~~~~~~~~~~~~~~~~~~~
   * ... `countdown-clock` for the fixture;
   * local clock-time & other countdowns / timers,
   * set the timer of the selected card,
   */
  let currentDate: Date = new Date();
  let dateObjDif: number =
    Date.parse(currentDate.toString()) - Date.parse(new Date().toString());

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~~
   * ... set the Timer in Motion;
   * and Calcualte the difference between target
   * time and the current time, once the fixture time
   * has been loaded in,
   */
  $: if (WIDGET_SELECTED_FIXTURE_START_TIME) {
    dateObjDif =
      Date.parse(WIDGET_SELECTED_FIXTURE_START_TIME.toString()) - Date.parse(new Date().toString());
    // ... calculate the difference in the time;
    setInterval(() => {
      dateObjDif =
        Date.parse(WIDGET_SELECTED_FIXTURE_START_TIME.toString()) - Date.parse(new Date().toString());
    }, 1000);
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getOrdinalNum = (number) => {
    let selector;

    if (number <= 0) {
      selector = 4;
    } else if ((number > 3 && number < 21) || number % 10 > 3) {
      selector = 0;
    } else {
      selector = number % 10;
    }

    return number + ["th", "st", "nd", "rd", ""][selector];
  };

  /**
   * Description: & [REACTIVITY]
   * ~~~~~~~~~~~~~~~~~~~~
   * -> Seconds Counter;
   * -> Minutes Counter;
   * -> Hours Counter;
   */
  $: countD_sec = Math.floor((dateObjDif / 1000) % 60).toString();
  $: if (parseInt(countD_sec) < 10) {
    countD_sec = "0" + countD_sec;
  }
  $: countD_min = Math.floor((dateObjDif / 1000 / 60) % 60).toString();
  $: if (parseInt(countD_min) < 10) {
    countD_min = "0" + countD_min;
  }
  $: countD_h = Math.floor((dateObjDif / (1000 * 60 * 60)) % 24).toString();
  $: if (parseInt(countD_h) < 10) {
    countD_h = "0" + countD_h;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // COLOR-THIEF INSTANCE;
  // ~~~~~~~~~~~~~~~~~~~~~

  // ... declaring a new instance of `ColorThief`;
  const colorThief = new ColorThief();

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~~
   * ... a function-method to obtain the main
   * `primary` color of the image
   * and place it on the background
   * container to keep the image the same size
   * @param imgURL
   */
  let imageVar: string = "--featured-match-bookmaker-bg-"
  let hexColor: string
  // ...
  function getImageBgColor(imgURL: string) {
    try {
      // instantiate the image Type;
      const img = new Image();
      // listen, event to wait for the image to load
      img.addEventListener("load", function () {
        // get the array of RGB values,
        let colorValues = colorThief.getColor(img);
        // convert the RGB values to HEX value,
        hexColor = rgbToHex(colorValues[0], colorValues[1], colorValues[2]);
        // pass this values as a `CSS :root` variable, accessible to all the website,
        const doc = document.documentElement;
        doc.style.setProperty(imageVar, `${hexColor}`);
      });
      // ... declaring the image paramaters & CORS by-pass
      let imageURL = imgURL;
      let googleProxyURL =
        "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=";
      img.crossOrigin = "Anonymous";
      img.src = googleProxyURL + encodeURIComponent(imageURL);
    }
    // ... CATCH;
    catch (e) {
      if (dev) console.error('-- getImageBgColor() ERR --', e)
    }
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~~
   * A function-method to convert the
   * [x,a,c] of RBG values to `#HEX` values
   * @param r
   * @param g
   * @param b
   * @returns (# a singel #HEX-Color Value)
   */
  const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

</script>


<!-- ===============
  COMPONENT HTML 
==================== -->

<div>
  
  <p class='s-20 m-b-10 color-white'>
    Featured Match
  </p>

  {#await promise}
  <!-- promise is pending -->
      <FeaturedMatchContentLoading />
  {:then data}
  <!-- ... promise was fulfilled ... -->

    <!-- ... identify the correct translation via IF -->
		{#each WIDGET_TRANSLATION_DATA as WIDGET_TRANSLATION}
      {#if WIDGET_TRANSLATION.lang == $userBetarenaSettings.lang}

        <div id="live-score-container"
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
          >

          <!-- ... league-game-title ... -->
          <div id="fixture-league-title" class="row-space-start">
            <!-- ... league-icon ... -->
            <img 
              class="img-flag" 
              src={ data.country_flag } 
              alt="" 
            />
            <!-- ... league-name-title ... -->
            <p class="large color-dark m-r-8">
              { data.league_name }
              <span class="color-grey">
                (Round { data.round_name })
              </span>
            </p>
          </div>

          <!-- ... fixture-visual-voting ... -->
          {#if WIDGET_SELECTED_FIXTURE_LIVE_ODDS}
            <div id="fixture-visual-box">
              <!-- ... fixture-visual-info ... -->
              <div id="fixture-data" class="row-space-out m-b-20">
                <!-- ... first-team ... -->
                <div class="fixture-team">
                  <img
                    class="m-b-12"
                    src={ data.home_team_logo }
                    alt=""
                    width="72px"
                    height="72px"
                  />
                  <p class="medium desktop-medium">
                    { data.home_team_name }
                  </p>
                </div>
                <!-- 
                fixture-timer-clock -->
                <div style="align-self: center;">
                  <p class="x-large desktop-x-large">
                    {countD_h}:{countD_min}:{countD_sec}
                  </p>
                  <p
                    class="small color-grey desktop-medium"
                    style="white-space: nowrap;"
                  >
                    {getOrdinalNum(WIDGET_SELECTED_FIXTURE_START_TIME.getDate())}
                    {monthNames[WIDGET_SELECTED_FIXTURE_START_TIME.getMonth().toString()]}
                    {WIDGET_SELECTED_FIXTURE_START_TIME.getFullYear().toString().substr(-2)},
                    {WIDGET_SELECTED_FIXTURE_START_TIME.getHours().toString()}:{(
                      "0" + WIDGET_SELECTED_FIXTURE_START_TIME.getMinutes().toString()
                    ).slice(-2)}h
                  </p>
                </div>
                <!-- 
                second-team -->
                <div class="fixture-team">
                  <img
                    class="m-b-12"
                    src={data.away_team_logo}
                    alt=""
                    width="72px"
                    height="72px"
                  />
                  <p class="medium desktop-medium">
                    {data.away_team_name}
                  </p>
                </div>
              </div>
              {#if !voteCasted}
                <p class="large color-primary m-b-12 text-center">
                  {WIDGET_TRANSLATION.vote}
                </p>
              {/if}

              <!-- ... voting-results-btn ... -->
              <div id="btn-vote-container" class="row-space-out">

                <!-- 
                ODDS #1 
                -->
                <div class="odds-vote-box text-center column">
                  <button
                    class="row-space-out cast-vote-btn m-b-12"
                    class:active={fixtureDataVote.fixture_vote == "1"}
                    disabled={voteCasted}
                    on:click={() =>
                      castVote(
                        "1",
                        parseFloat(WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds.markets["1X2FT"].data[0].value.toString()).toFixed(2)
                      )}
                  >
                    <p class="medium row-space-out">
                      {#if !viewportDesktop}
                        <span class="color-grey"> 1 </span>
                      {:else}
                        <img
                          src={data.home_team_logo}
                          alt=""
                          width="28px"
                          height="28px"
                        />
                      {/if}
                      <span class:active_p={fixtureDataVote.fixture_vote == "1"}>
                        { parseFloat(WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds.markets["1X2FT"].data[0].value.toString()).toFixed(2) }
                      </span>
                    </p>
                  </button>
                  <!-- fixture-probability -->
                  {#if !showBettingSite}
                    <p class="probablitiy-text medium">
                      {WIDGET_TRANSLATION.probability}
                      {#if !viewportDesktop}
                        <br />
                      {/if}
                      {Math.round(
                        parseInt(data.probabilities.home)
                      ).toFixed(2)}%
                    </p>
                  {:else if WIDGET_SELECTED_FIXTURE_MATCH_VOTES != undefined}
                    <p class="large">
                      <span class="color-dark">
                        {(
                          (WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_local / totalVotes) *
                          100
                        ).toFixed(0)}%
                      </span>
                      <span class="color-grey">
                        ({WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_local})
                      </span>
                    </p>
                  {/if}
                </div>

                <!-- 
                ODDS #X 
                -->
                <div class="odds-vote-box text-center column">
                  <button
                    class="row-space-out cast-vote-btn m-b-12"
                    class:active={fixtureDataVote.fixture_vote == "X"}
                    disabled={voteCasted}
                    on:click={() =>
                      castVote(
                        "X",
                        parseFloat(WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds.markets["1X2FT"].data[1].value.toString()).toFixed(2)
                      )}
                  >
                    <p class="medium row-space-out">
                      {#if !viewportDesktop}
                        <span class="color-grey"> X </span>
                      {:else}
                        <!-- 
                          src="./static/icon/icon-close.svg"
                        -->
                        <img
                          src="https://www.betarena.com/widgets/featured_match/static/icon/icon-close.svg"
                          alt=""
                          width="28px"
                          height="28px"
                        />
                      {/if}
                      <span class:active_p={fixtureDataVote.fixture_vote == "X"}>
                        { parseFloat(WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds.markets["1X2FT"].data[1].value.toString()).toFixed(2) }
                      </span>
                    </p>
                  </button>
                  <!-- fixture-probability -->
                  {#if !showBettingSite}
                    <p class="probablitiy-text medium">
                      {WIDGET_TRANSLATION.probability}
                      {#if !viewportDesktop}
                        <br />
                      {/if}
                      {Math.round(
                        parseInt(data.probabilities.draw)
                      ).toFixed(2)}%
                    </p>
                  {:else if WIDGET_SELECTED_FIXTURE_MATCH_VOTES != undefined}
                    <p class="large">
                      <span class="color-dark">
                        {(
                          (WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_draw_x / totalVotes) *
                          100
                        ).toFixed(0)}%
                      </span>
                      <span class="color-grey">
                        ({WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_draw_x})
                      </span>
                    </p>
                  {/if}
                </div>

                <!-- 
                ODDS #2 
                -->
                <div class="odds-vote-box column text-center">
                  <button
                    class="row-space-out cast-vote-btn m-b-12"
                    class:active={fixtureDataVote.fixture_vote == "2"}
                    disabled={voteCasted}
                    on:click={() =>
                      castVote(
                        "2",
                        parseFloat(WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds.markets["1X2FT"].data[2].value.toString()).toFixed(2)
                      )}
                  >
                    <p class="medium row-space-out">
                      {#if !viewportDesktop}
                        <span class="color-grey"> 2 </span>
                      {:else}
                        <img
                          src={data.away_team_logo}
                          alt=""
                          width="28px"
                          height="28px"
                        />
                      {/if}
                      <span class:active_p={fixtureDataVote.fixture_vote == "2"}>
                        { parseFloat(WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds.markets["1X2FT"].data[2].value.toString()).toFixed(2) }
                      </span>
                    </p>
                  </button>
                  <!-- fixture-probability -->
                  {#if !showBettingSite}
                    <p class="probablitiy-text medium">
                      {WIDGET_TRANSLATION.probability}
                      {#if !viewportDesktop}
                        <br />
                      {/if}
                      {Math.round(
                        parseInt(data.probabilities.away)
                      ).toFixed(2)}%
                    </p>
                  {:else if WIDGET_SELECTED_FIXTURE_MATCH_VOTES != undefined}
                    <p class="large">
                      <span class="color-dark">
                        {(
                          (WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_visitor / totalVotes) *
                          100
                        ).toFixed(0)}%
                      </span>
                      <span class="color-grey">
                        ({WIDGET_SELECTED_FIXTURE_MATCH_VOTES.vote_win_visitor})
                      </span>
                    </p>
                  {/if}
                </div>

              </div>

              <!-- 
              ~~~~~~~~~~~~~~
              stakes-site-info-pop-up
              -->
              {#if showBettingSite}
                <div id="site-bet-box" in:fade>
                  <!-- 
                  close-btn 
                  src="./static/icon/white-close.svg"
                  -->
                  <img
                    src="https://www.betarena.com/widgets/featured_match/static/icon/white-close.svg"
                    alt=""
                    width="16px"
                    height="16px"
                    style="position: absolute; top: 12px; right: 20px;"
                    on:click={() => (showBettingSite = false)}
                  />
                  <a href={WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds_info.register_link}>
                    <img
                      id="stakesSiteImg"
                      src={WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds_info.image}
                      alt=""
                      width="100%"
                      height="40px"
                    />
                  </a>
                  <div id="inner-site-container">
                    <!-- 
                    STAKES DATA -->
                    <div class="m-b-20 row-space-out">
                      <!-- 
                      Win Type
                      -->
                      <div class="text-center">
                        {#if fixtureDataVote.fixture_vote == "1"}
                          <p class="medium m-b-8 color-grey">Home win</p>
                        {:else if fixtureDataVote.fixture_vote == "X"}
                          <p class="medium m-b-8 color-grey">Draw</p>
                        {:else}
                          <p class="medium m-b-8 color-grey">Away win</p>
                        {/if}
                        <div class="input-value row-space-out medium text-center">
                          {#if viewportDesktop}
                            {#if fixtureDataVote.fixture_vote == "1"}
                              <img
                                src={data.home_team_logo}
                                alt=""
                                width="28px"
                                height="28px"
                              />
                            {:else if fixtureDataVote.fixture_vote == "X"}
                              <p class="medium row-space-out">
                                <span class="color-grey"> X </span>
                              </p>
                            {:else}
                              <img
                                src={data.away_team_logo}
                                alt=""
                                width="28px"
                                height="28px"
                              />
                            {/if}
                          {/if}
                          <input id='win-type'
                            class="medium text-center desktop-view-winnings"
                            type="number"
                            bind:value={fixtureDataVote.fixture_vote_val}
                            disabled
                          />
                        </div>
                      </div>

                      <!-- MULTIPLY SIGN -->
                      <img
                        src="/assets/svg/icon/icon-close.svg"
                        alt="multiply-icon"
                        width="16px"
                        height="16px"
                        style="margin-top: 25px;"
                      />

                      <!-- 
                      Stake 
                      -->
                      <div class="text-center">
                        <p class="medium m-b-8 color-grey">{WIDGET_TRANSLATION.stake}</p>
                        <input
                          class="input-value medium text-center"
                          type="text"
                          bind:value={user_Stake_amount}
                        />
                      </div>

                      <!-- EQUALS SIGN -->
                      <img
                        src="/assets/svg/icon/icon-equally.svg"
                        alt="icon-equlaity"
                        width="16px"
                        height="16px"
                        style="margin-top: 25px;"
                      />

                      <!-- 
                      Winnings 
                      -->
                      <div class="text-center">
                        <p class="medium m-b-8 color-grey">
                          {WIDGET_TRANSLATION.winnings}
                        </p>
                        <input
                          class="input-value medium text-center"
                          type="number"
                          value={(
                            parseFloat(fixtureDataVote.fixture_vote_val) * user_Stake_amount
                          ).toFixed(2)}
                          disabled
                        />
                      </div>
                    </div>

                    <!-- 
                    PLACE BET BUTTON -->
                    <a href={WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds_info.register_link}>
                      <button class="place-bet-btn btn-primary m-b-12">
                        <p class="small">
                          {WIDGET_TRANSLATION.place_bet}
                        </p>
                      </button>
                    </a>

                    <!-- 
                    BETTING SITE INFO -->
                    <p class="small text-center color-grey">
                      {WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds_info.information}
                    </p>
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          <!-- ... live-streams-frame-box ... -->
          {#if WIDGET_SELECTED_FIXTURE_TV_STATIONS_DATA.length != 0}
            <div id="live-stream-box">
              <!-- 
              live-streams-title-section -->
              <p class="large m-b-8" style="padding-left: 20px;">
                {WIDGET_TRANSLATION.streams}
              </p>
              <!-- 
              live-streams-grid -->
              <div id="livestream-grid">
                {#each WIDGET_SELECTED_FIXTURE_TV_STATIONS_DATA as tv_item}
                  <a rel="external" href={tv_item.link}>
                    <div class="tooltip">
                      <button class="live-stream-btn">
                        <img
                          src={tv_item.img}
                          alt={tv_item.alt}
                          title={tv_item.Name}
                          width="45px"
                          height="26px"
                        />
                      </button>
                      <p class="s_small tooltiptext">{tv_item.Name}</p>
                    </div>
                  </a>
                {/each}
              </div>
            </div>
          {/if}

          <!-- ... best-players (Both-Teams) -->
          <div id="best-players-box-out">
            <!--
            ~~~~~~~~~~~~~
            TEAM - HOME 
            -->
            <div class="best-players-box">
              <div class="row-space-start m-b-16">
                <img
                  class="m-r-16"
                  src={data.home_team_logo}
                  alt=""
                  width="32px"
                  height="32px"
                />
                <p class="large">
                  {data.home_team_name}
                  {WIDGET_TRANSLATION.players}
                </p>
              </div>
              <table class="table-best-player">
                <tr class="row-head m-b-16">
                  <th class="rating-head">
                    <p class="small color-grey">
                      {WIDGET_TRANSLATION.rating}
                    </p>
                  </th>
                  <th class="player-col">
                    <p class="small color-grey">
                      {WIDGET_TRANSLATION.player}
                    </p>
                  </th>
                  {#if viewportDesktop}
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.matches}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.assists}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.goals}
                      </p>
                    </th>
                  {/if}
                </tr>
                <!-- PLAYER 1 -->
                <tr>
                  <td>
                    <div
                      class="rating-box"
                      class:bronze={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_1 >=
                        0 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_1 <
                          7}
                      class:silver={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_1 >=
                        7 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_1 <
                          9}
                      class:golden={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_1 >=
                        9}
                    >
                      <p class="medium">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_1}
                      </p>
                    </div>
                  </td>
                  <td class="row-space-start">
                    <img
                      src={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_1_image_path}
                      alt=""
                      width="32px"
                      height="32px"
                      class="player-img"
                    />
                    <p class="small desktop-small">
                      {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_1}
                    </p>
                  </td>
                  {#if viewportDesktop}
                    <td>
                      <p class="medium boxed-rating-matches">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_1_appearances}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-assits">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_1_assists}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-goals">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_1_goals}
                      </p>
                    </td>
                  {/if}
                </tr>
                <!-- PLAYER 2 -->
                <tr>
                  <td>
                    <div
                      class="rating-box"
                      class:bronze={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_2 >=
                        0 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_2 <
                          7}
                      class:silver={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_2 >=
                        7 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_2 <
                          9}
                      class:golden={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_2 >=
                        9}
                    >
                      <p class="medium">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_rating_player_2}
                      </p>
                    </div>
                  </td>
                  <td class="row-space-start">
                    <img
                      src={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_2_image_path}
                      alt=""
                      width="32px"
                      height="32px"
                      class="player-img"
                    />
                    <p class="small desktop-small">
                      {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_2}
                    </p>
                  </td>
                  {#if viewportDesktop}
                    <td>
                      <p class="medium boxed-rating-matches">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_2_appearances}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-assits">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_2_assists}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-goals">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.local_team_player_2_goals}
                      </p>
                    </td>
                  {/if}
                </tr>
              </table>
            </div>

            <!--
            ~~~~~~~~~~~~~
            TEAM - AWAY 
            -->
            <div class="best-players-box">
              <div class="row-space-start m-b-16">
                <img
                  class="m-r-16"
                  src={data.away_team_logo}
                  alt=""
                  width="32px"
                  height="32px"
                />
                <p class="large">
                  {data.away_team_name}
                  {WIDGET_TRANSLATION.players}
                </p>
              </div>
              <!--  -->
              <table class="table-best-player">
                <tr class="row-head m-b-16">
                  <th class="rating-head">
                    <p class="small color-grey">
                      {WIDGET_TRANSLATION.rating}
                    </p>
                  </th>
                  <th class="player-col">
                    <p class="small color-grey">
                      {WIDGET_TRANSLATION.player}
                    </p>
                  </th>
                  {#if viewportDesktop}
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.matches}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.assists}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.goals}
                      </p>
                    </th>
                  {/if}
                </tr>
                <!-- PLAYER 1 -->
                <tr>
                  <td>
                    <div
                      class="rating-box"
                      class:bronze={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_1 >=
                        0 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_1 <
                          7}
                      class:silver={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_1 >=
                        7 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_1 <
                          9}
                      class:golden={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_1 >=
                        9}
                    >
                      <p class="medium">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_1}
                      </p>
                    </div>
                  </td>
                  <td class="row-space-start">
                    <img
                      src={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_1_image_path}
                      alt=""
                      width="32px"
                      height="32px"
                      class="player-img"
                    />
                    <p class="small desktop-small">
                      {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_1}
                    </p>
                  </td>
                  {#if viewportDesktop}
                    <td>
                      <p class="medium boxed-rating-matches">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_1_appearances}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-assits">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_1_assists}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-goals">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_1_goals}
                      </p>
                    </td>
                  {/if}
                </tr>
                <!-- PLAYER 2 -->
                <tr>
                  <td>
                    <div
                      class="rating-box"
                      class:bronze={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_2 >=
                        0 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_2 <
                          7}
                      class:silver={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_2 >=
                        7 &&
                        WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_2 <
                          9}
                      class:golden={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_2 >=
                        9}
                    >
                      <p class="medium">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_rating_player_2}
                      </p>
                    </div>
                  </td>
                  <td class="row-space-start">
                    <img
                      src={WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_2_image_path}
                      alt=""
                      width="32px"
                      height="32px"
                      class="player-img"
                    />
                    <p class="small desktop-small">
                      {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_2}
                    </p>
                  </td>
                  {#if viewportDesktop}
                    <td>
                      <p class="medium boxed-rating-matches">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_2_appearances}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-assits">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_2_assists}
                      </p>
                    </td>
                    <td>
                      <p class="medium boxed-rating-goals">
                        {WIDGET_SELECTED_FIXTURE_BEST_PLAYERS.visitor_team_player_2_goals}
                      </p>
                    </td>
                  {/if}
                </tr>
              </table>
            </div>
          </div>

          <!-- ... value-bets section ... -->
          {#if WIDGET_SELECTED_FIXTURE_VALUE_BETS != null}
            <div id="value-bets">
              <p class="large m-b-16">
                {WIDGET_TRANSLATION.value_bet}
              </p>
              {#if !viewportDesktop}
                <div id="value-bets-container">
                  <div id="value-bets-inner-info">
                    <!-- 
                    VALUE-BET INFO -->
                    <div class="row-space-out">
                      <p class="medium color-grey">
                        {WIDGET_TRANSLATION.bookmaker}
                      </p>
                      <a rel="external" href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}>
                        <img
                          src={WIDGET_SELECTED_FIXTURE_VALUE_BETS.image}
                          alt={WIDGET_SELECTED_FIXTURE_VALUE_BETS.bookmaker}
                          height="30px"
                          width="56px"
                          style="height: 30px !important;"
                        />
                      </a>
                    </div>

                    <div class="row-space-out">
                      <p class="medium color-grey">
                        {WIDGET_TRANSLATION.type}
                      </p>
                      <p class="medium color-dark">
                        {WIDGET_TRANSLATION.market_name}
                      </p>
                    </div>

                    <div class="row-space-out">
                      <p class="medium color-grey">
                        {WIDGET_TRANSLATION.market}
                      </p>
                      <p class="medium color-dark">
                        {WIDGET_SELECTED_FIXTURE_VALUE_BETS.bet.toString()}
                      </p>
                    </div>

                    <div class="row-space-out">
                      <p class="medium color-grey">
                        {WIDGET_TRANSLATION.odds}
                      </p>
                      <a rel="external" href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}>
                        <p
                          class="medium color-dark"
                          style="background: #FFFFFF;
                          border-radius: 4px;
                          padding: 4px 6px;"
                        >
                          {parseFloat(WIDGET_SELECTED_FIXTURE_VALUE_BETS.odd.toString()).toFixed(2)}
                        </p>
                      </a>
                    </div>

                    <div class="row-space-out">
                      <p class="medium color-grey">
                        {WIDGET_TRANSLATION.fair_odds}
                      </p>
                      <a rel="external" href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}>
                        <p
                          class="medium color-dark"
                          style="background: #FFFFFF;
                          border-radius: 4px;
                          padding: 4px 6px;"
                        >
                          {parseFloat(WIDGET_SELECTED_FIXTURE_VALUE_BETS.fair_odd.toString()).toFixed(2)}
                        </p>
                      </a>
                    </div>
                  </div>
                  <!-- 
                  VALUE-BET BUTTON -->
                  <a rel="external" href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}>
                    <button
                      style="width: 100%; padding: 6px 0; border-radius: 4px;"
                      class="btn-primary"
                    >
                      <p class="medium">
                        {WIDGET_TRANSLATION.bet}
                      </p>
                    </button>
                  </a>
                </div>
              {:else}
                <table class="value_bets">
                  <tr class="row-head m-b-16">
                    <th class="text-center" style="text-align: start;">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.bookmaker}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.type}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.market}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.odds}
                      </p>
                    </th>
                    <th class="text-center">
                      <p class="small color-grey">
                        {WIDGET_TRANSLATION.fair_odds}
                      </p>
                    </th>
                    <th class="text-center" />
                  </tr>
                  <!-- 
                  VALUE-BET - ROW SINGLE -->
                  <tr>
                    <td class="text-center" style="text-align: start;">
                      <a
                        rel="external"
                        href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}
                        style="height: 30px;"
                      >
                        <img
                          src={WIDGET_SELECTED_FIXTURE_VALUE_BETS.image}
                          alt={WIDGET_SELECTED_FIXTURE_VALUE_BETS.bookmaker}
                          height="30px"
                          width="56px"
                          style="object-fit: cover; border-radius: 4px; height: 30px !important;"
                        />
                      </a>
                    </td>
                    <td>
                      <p class="medium text-center">
                        {WIDGET_TRANSLATION.market_name}
                      </p>
                    </td>
                    <td>
                      <p class="medium text-center">
                        {WIDGET_SELECTED_FIXTURE_VALUE_BETS.bet.toString()}
                      </p>
                    </td>
                    <td>
                      <a rel="external" href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}>
                        <p
                          class="medium max-height: 30px; boxed-rating-value-bets active_p_btn"
                        >
                          {parseFloat(WIDGET_SELECTED_FIXTURE_VALUE_BETS.odd.toString()).toFixed(2)}
                        </p>
                      </a>
                    </td>
                    <td>
                      <a rel="external" href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}>
                        <p
                          class="medium max-height: 30px; boxed-rating-value-bets active_p_btn"
                        >
                          {parseFloat(WIDGET_SELECTED_FIXTURE_VALUE_BETS.fair_odd.toString()).toFixed(2)}
                        </p>
                      </a>
                    </td>
                    <td>
                      <a rel="external" href={WIDGET_SELECTED_FIXTURE_VALUE_BETS.link}>
                        <button
                          style="width: 100%; padding: 6px 0; max-height: 30px; border-radius: 4px;"
                          class="btn-primary"
                        >
                          <p class="medium">
                            {WIDGET_TRANSLATION.bet}
                          </p>
                        </button>
                      </a>
                    </td>
                  </tr>
                </table>
              {/if}
            </div>
          {/if}

        </div>

      {/if}
    {/each}

  {:catch error}
  <!-- promise was rejected -->
  {/await}

</div>


<!-- ===============
  COMPONENT STYLE
==================== -->

<style>
  #live-score-container {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    min-width: 100%;
    width: 100%;
    max-width: 343px;
    padding-bottom: 4px;
    overflow: hidden;
  }

  #fixture-league-title {
    padding: 10px 20px;
    box-shadow: inset 0px -1px 0px #ebebeb;
  }

  #fixture-visual-box {
    padding: 25px 20px 20px 20px;
    box-shadow: inset 0px -1px 0px #ebebeb;
  }

  #fixture-data {
    display: grid;
    grid-auto-flow: column;
    justify-items: center;
    align-items: end;
    justify-content: center;
    grid-template-columns: 1fr 1fr 1fr;
    text-align: center;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
    border: none;
  }

  /* ====================
    vote-button-container 
  ==================== */

  #btn-vote-container {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-items: center;
    justify-content: space-between;
    width: -webkit-fill-available;
  }
  .odds-vote-box {
  }
  .cast-vote-btn {
    background: #f2f2f2;
    border: 1px solid #cccccc;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 14px 16px;
    transition: all ease 0.15s;
    box-shadow: none !important;
    width: 96px;
    height: 48px;
  }
  .cast-vote-btn.active {
    background: #ffffff !important;
    border: 1px solid #f5620f !important;
    box-sizing: border-box;
    border-radius: 8px;
    opacity: 1 !important;
  }
  .cast-vote-btn:disabled {
    opacity: 0.5;
  }
  .probablitiy-text {
    text-align: center;
    color: #8c8c8c;
    width: min-content;
  }

  .active_p {
    color: #f5620f !important;
  }

  .active_p_btn:hover {
    color: #f5620f !important;
  }

  #site-bet-box {
    margin-top: 35px;
    background: #f2f2f2;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }
  #inner-site-container {
    padding: 20px 12px;
    background: #f2f2f2;
    border-radius: 8px;
  }
  #inner-site-container button.place-bet-btn {
    height: 46px;
    width: 100%;
    background-color: #F5620F;
    box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
    border-radius: 8px;
  }
  .input-value {
    -moz-appearance: textfield;
    background: #ffffff;
    border-radius: 8px;
    height: 48px;
    width: 76px;
    border: none;
  }
  #inner-site-container input {
    background: rgb(255, 255, 255);
    color: black !important;
    opacity: 1 !important;
  }
  input#win-type {
    width: 100%;
    border-radius: 5px;
    border: 0;
    outline: none;
  }

  .img-flag {
    width: 24px;
    height: 18px;
    margin-right: 16px;
    filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
    border-radius: 2px !important;
    vertical-align: middle !important;
  }

  #stakesSiteImg {
    background-color: var(--featured-match-bookmaker-bg-);
    object-fit: none;
    height: 40px;
  }

  #live-stream-box {
    padding: 20px 0;
    box-shadow: inset 0px -1px 0px #ebebeb;
    overflow: hidden;
    width: inherit;
  }
  #livestream-grid {
    display: grid;
    grid-auto-flow: column;
    gap: 8px;
    overflow-y: scroll;
    padding: 0 20px;
    grid-template-columns: repeat(auto-fill, 71px);
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
  #livestream-grid::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  #livestream-grid {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .live-stream-btn {
    border: 1px solid #cccccc !important;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 7px 12px;
    /* padding: 0 !important; */
    background-color: transparent;
    box-shadow: none !important;
    width: 68px;
    height: 40px;
  }
  .live-stream-btn img {
    object-fit: contain;
    width: 100%;
  }

  /* ====================
    best-players-container 
  ==================== */

  #best-players-box-out {
  }
  .best-players-box {
    padding: 20px;
    box-shadow: inset 0px -1px 0px #ebebeb;
  }

  table.table-best-player,
  table.value_bets {
    text-align: left;
    border-collapse: collapse;
    width: 100%;
  }
  table.table-best-player .row-head,
  table.value_bets .row-head {
    background: #f2f2f2;
    border-radius: 2px;
  }
  table td,
  table th {
    padding: 7px 12px;
    /* padding: 7px 0; */
    vertical-align: middle;
    border: none !important;
  }
  table.table-best-player tr td:first-child {
    padding-left: 0;
  }

  table tr td:last-child {
    padding-right: 0;
  }

  table tr td {
    padding-top: 16px !important;
    padding-bottom: 0px;
  }

  .rating-head {
    width: 59px;
  }
  .rating-box {
    width: fit-content;
    border-radius: 30px;
    padding: 1.5px 8px;
    color: white;
  }
  .rating-box p {
    color: white;
  }
  .golden {
    background: #ffb904;
  }
  .silver {
    background: #a1a1a1;
  }
  .bronze {
    background: #dbb884;
  }

  .tooltip {
    border-bottom: none !important;
  }
  .tooltip .tooltiptext {
    display: none;
  }

  .player-img {
    border: 1px solid #cccccc;
    border-radius: 50%;
    margin-right: 8px;
  }

  /* ====================
    value-bets-container 
  ==================== */

  #value-bets {
    padding: 20px;
  }
  #value-bets-container {
    background: #f2f2f2;
    border-radius: 2px;
    width: 100%;
  }
  #value-bets-inner-info {
    padding: 12px;
    display: grid;
    grid-auto-rows: 1fr;
    justify-items: center;
    align-items: center;
    gap: 4px;
  }
  #value-bets-inner-info img {
    border-radius: 4px;
    width: 56px;
    object-fit: cover;
  }

  /* ====================
    responsivness
  ==================== */

  /* 
  MOBILE RESPONSIVNESS */
  @media only screen and (min-width: 700px) {
    #inner-site-container button {
      height: 44px;
    }

    .boxed-rating-matches {
      background: #ffffff;
      border: 1px solid #e6e6e6;
      box-sizing: border-box;
      border-radius: 4px;
      text-align: center;
      padding: 5px 0;
      max-height: 30px;
      width: 64px;
    }
    .boxed-rating-assits,
    .boxed-rating-value-bets {
      background: #f2f2f2;
      border-radius: 4px;
      text-align: center;
      padding: 5px 0;
      max-height: 30px;
      width: 64px;
    }
    .boxed-rating-goals {
      background: #e6e6e6;
      border-radius: 4px;
      text-align: center;
      padding: 5px 0;
      max-height: 30px;
      width: 64px;
    }

    table.table-best-player tr th:first-child p {
      left: 10%;
      position: relative;
    }
    table.table-best-player tr th:last-child p {
      left: 10%;
      position: relative;
    }

    table tr td:first-child {
      padding-left: 10px;
    }
    table td,
    table th {
      padding: 7px 10px;
    }

    #live-score-container {
      width: 100%;
      max-width: 700px;
    }
    #livestream-grid {
      grid-auto-flow: unset;
      overflow-y: visible;
      grid-template-columns: repeat(auto-fill, 71px);
    }
    .input-value {
      width: 100%;
      max-width: 164px;
      padding: 14px;
    }
    .cast-vote-btn {
      min-width: 206px;
      width: 100%;
      height: 48px;
    }
    .desktop-view-winnings {
      padding: 0;
      text-align: end;
    }
    .desktop-small {
      font-size: 14px !important;
    }
    .desktop-medium {
      font-size: 16px !important;
    }
    .desktop-x-large {
      font-size: 20px !important;
    }
    .live-stream-btn {
      padding: 0 5px;
    }
    .player-col {
      width: 357px;
    }
    .rating-head {
      width: 44px;
    }
    table.value_bets tr th:nth-child(-n + 3),
    table.value_bets tr td:nth-child(-n + 3) {
      max-width: 72px !important;
      padding-right: 24px;
    }
    table.value_bets tr th:nth-child(3),
    table.value_bets tr td:nth-child(3) {
      padding-right: 190px !important;
    }
    table.value_bets tr th:nth-last-child(-n + 3),
    table.value_bets tr td:nth-last-child(-n + 3),
    table.value_bets tr td button {
      width: 64px !important;
    }
    .player-img {
      margin-right: 16px;
    }
    table tr:nth-child(2) td {
      padding-top: 20px !important;
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {
    #live-score-container {
      width: 100%;
      max-width: 560px;
    }
    .input-value {
      width: 100%;
      max-width: 110px;
    }

    .tooltip .tooltiptext {
      display: unset !important;
    }

    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: none !important;
    }
    .tooltip .tooltiptext {
      visibility: hidden;
      width: 120px;
      color: #fff;
      text-align: center;
      padding: 10px;
      position: absolute;
      z-index: 1;
      top: -100%;
      left: 50%;
      margin-left: -60px;
      background: #4b4b4b;
      box-shadow: inset 0px -1px 0px #3c3c3c;
      border-radius: 4px;
      transition: all 0.15s ease-in;
    }
    .tooltip:hover .tooltiptext {
      visibility: visible !important;
    }
    .cast-vote-btn {
      min-width: 140px;
      width: 100%;
      height: 48px;
    }

    table.value_bets tr th:nth-child(-n + 3),
    table.value_bets tr td:nth-child(-n + 3) {
      max-width: 72px !important;
      padding-right: 24px;
    }
    table.value_bets tr th:nth-last-child(-n + 3),
    table.value_bets tr td:nth-last-child(-n + 3),
    table.value_bets tr td button {
      width: 64px !important;
    }

    table.value_bets tr th:nth-child(3),
    table.value_bets tr td:nth-child(3) {
      padding-right: 24px !important;
    }

    table.table-best-player th:first-child {
      width: 44px !important;
    }
    table.table-best-player tr th:first-child,
    table.table-best-player tr td:first-child {
      /* padding-right: 0px; */
    }
    table.table-best-player th.player-col {
      /* min-width: 226px !important;
      max-width: 226px !important; */
      width: 100%;
    }
    .player-img {
      margin-right: 16px;
    }
  }

  /* .............. 
  WIDGET DARK THEME 
  ................. */
  .dark-background-1 #fixture-league-title,
  .dark-background-1 #fixture-visual-box,
  .dark-background-1 .best-players-box,
  .dark-background-1 #live-stream-box {
    box-shadow: inset 0px -1px 0px #616161 !important;
  }

  .dark-background-1 .cast-vote-btn {
    background-color: #616161 !important;
    border: 1px solid #999999 !important;
  }
  .dark-background-1 .cast-vote-btn.active {
    border: 1px solid #f5620f !important;
  }

  .dark-background-1 table.table-best-player .row-head,
  .dark-background-1 table.value_bets .row-head {
    background-color: #616161 !important;
  }

  .dark-background-1 p {
    color: #FFFFFF;
  }

  .dark-background-1 .live-stream-btn {
    background-color: #FFFFFF !important;
    border: 1px solid #616161 !important;
  }

  .dark-background-1 table.table-best-player .row-head th p,
  .dark-background-1 table.value_bets .row-head th p,
  .dark-background-1 .probablitiy-text {
    color: #A8A8A8 !important;
  }

  .dark-background-1 #site-bet-box,
  .dark-background-1 #inner-site-container {
    background-color: #616161 !important;
  }
  .dark-background-1 #inner-site-container .input-value {
    background-color: #4B4B4B !important;
    color: #FFFFFF !important;
  }

  .dark-background-1 #inner-site-container input {
    color: #FFFFFF !important;
  }
  .dark-background-1 input#win-type {
    background-color: #4B4B4B !important;
  }

  @media only screen and (min-width: 700px) { 

    .dark-background-1 .boxed-rating-matches {
      background-color: #4B4B4B !important;
      border: 1px solid #616161 !important;
    }
    .dark-background-1 .boxed-rating-assits,
    .dark-background-1 .boxed-rating-value-bets {
      background-color: #616161 !important;
    }
    .dark-background-1 .boxed-rating-goals {
      background-color: #737373 !important;
    }

  }

  @media only screen and (min-width: 1024px) {
    .dark-background-1 .tooltip .tooltiptext {
      background: #616161;
      box-shadow: inset 0px -1px 0px #3C3C3C;
    }
  }
</style>