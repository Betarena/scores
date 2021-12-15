<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  // ... svelte-imports;
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
	import { browser, dev } from '$app/env'

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
  import { ref, onValue } from "firebase/database"

  // ... DECLARING TYPESCRIPT-TYPES imports;
  import type { fixture } from "$lib/store/vote_fixture"
  import type { FixtureResponse, ValueBet, MatchVotes } from "$lib/model/interface-fixture"
  import type { GeoJsResponse } from "$lib/model/geo-js-interface"
  import type { SelectedFixutre, BestPlayers_Data, Tv_Station, TranslationsResponse, CompleteFixtureData_Response, SelectedFixture_VoteUpdate_Response } from "$lib/model/response_models"
  import type { SelectedFixture_LiveOdds_Response } from "$lib/model/firebase-real-db-interface"

  let totalVotes: number  // ???
  let imageURL: string

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
    imageURL = WIDGET_SELECTED_FIXTURE_LIVE_ODDS.fixture_odds_info.image
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
    else {
      // ... otherwise, append the image & the registration link to the data;
      WIDGET_SELECTED_FIXTURE_VALUE_BETS = {
        ...WIDGET_SELECTED_FIXTURE_VALUE_BETS,
        image: sportbook_details.betting_site_info.image,
        link: sportbook_details.betting_site_info.register_link,
      }
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
  $: if (WIDGET_SELECTED_FIXTURE_START_TIME != undefined && WIDGET_SELECTED_FIXTURE_START_TIME != null) {
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

  $: if (browser && imageURL) {
    // ... apply the correct background-color to the image;
    getImageBgColor(imageURL)
  }

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


