<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup } from "$lib/utils/debug";

  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from "$lib/store/user-settings";
	import { get } from "$lib/api/utils";
	import { get_livescores_now, get_odds } from "$lib/firebase/scoreboard";
	import { onValue, ref, type Unsubscribe } from "firebase/database";
	import { db_real } from "$lib/firebase/init";

	import type { 
    REDIS_CACHE_SINGLE_scoreboard_data 
  } from "$lib/models/fixtures/scoreboard/types";
	import type {
    REDIS_CACHE_SINGLE_fixtures_page_info_response 
  } from "$lib/models/_main_/pages_and_seo/types";
	import type { 
    FIREBASE_livescores_now, FIREBASE_odds 
  } from "$lib/models/firebase";
	import type { 
    Cache_Single_SportbookDetails_Data_Response 
  } from "$lib/models/tournaments/league-info/types";

	import ScoreboardLoader from "./Scoreboard_Loader.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
	import banner from './assets/banner.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let FIXTURE_INFO:       REDIS_CACHE_SINGLE_fixtures_page_info_response;
	export let FIXTURE_SCOREBOARD: REDIS_CACHE_SINGLE_scoreboard_data;

  let SPORTBOOK_INFO:            Cache_Single_SportbookDetails_Data_Response;
  let SPORTBOOK_DETAILS_LIST:    Cache_Single_SportbookDetails_Data_Response[]

  let loaded:            boolean = false;         // [ℹ] holds boolean for data loaded;
  let refresh:           boolean = false;         // [ℹ] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;         // [ℹ] refresh-data value speed;
  let no_widget_data:    any = false;             // [ℹ] identifies the no_widget_data boolean;
  let selected_view      = 0;
  let currentSeason:     number = undefined;
  let tick_sec_show:     boolean = false;

  // [🐞]
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "fixtures | scoreboard [DEV]";

  // [🐞]
  $: if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `FIXTURE_SCOREBOARD: ${FIXTURE_SCOREBOARD}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  // [ℹ] In Use
  async function widget_init (
  ): Promise < REDIS_CACHE_SINGLE_scoreboard_data > {

    // [ℹ] get response [lang] [data] [obtained from preload()]
    // const sleep = ms => new Promise(r => setTimeout(r, ms));
    // await sleep(3000);

    if (!$userBetarenaSettings.country_bookmaker) {
      return
    }
    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] [GET] response sportbook [geo]
		const response_main_sportbook: Cache_Single_SportbookDetails_Data_Response = await get("/api/cache/tournaments/sportbook?geoPos="+userGeo)
    const response_all_spotbooks: Cache_Single_SportbookDetails_Data_Response[] = await get("/api/cache/tournaments/sportbook?all=true&geoPos="+userGeo)

    loaded = true;

    // [ℹ] data validation check
		if (
      FIXTURE_SCOREBOARD == undefined ||
      response_main_sportbook == undefined || 
      response_all_spotbooks == undefined
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

    SPORTBOOK_INFO = response_main_sportbook;
    SPORTBOOK_DETAILS_LIST = response_all_spotbooks;
    SPORTBOOK_DETAILS_LIST.sort((a, b) => parseInt(a.position) - parseInt(b.position))

    return FIXTURE_SCOREBOARD;
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

  // ~~~~~~~~~~~~~~~~~~~~~
	// COMPONENT TIMER CLOCK
	// ~~~~~~~~~~~~~~~~~~~~~

	let current_date: Date = new Date();
	let date_obj_diff: number = Date.parse(current_date.toString()) - Date.parse(new Date().toString());

	$: if (loaded) {
		date_obj_diff = Date.parse(FIXTURE_SCOREBOARD?.fixture_time.toString()) - Date.parse(new Date().toString());
		setInterval(() => {
			date_obj_diff = Date.parse(FIXTURE_SCOREBOARD?.fixture_time.toString()) - Date.parse(new Date().toString());
		}, 1000);
	}

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
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
		return number + ['th', 'st', 'nd', 'rd', ''][selector];
	};

	$: countD_sec = Math.floor((date_obj_diff / 1000) % 60).toString();
	$: if (parseInt(countD_sec) < 10) {
		countD_sec = '0' + countD_sec;
	}
	$: countD_min = Math.floor((date_obj_diff / 1000 / 60) % 60).toString();
	$: if (parseInt(countD_min) < 10) {
		countD_min = '0' + countD_min;
	}
	$: countD_h = Math.floor((date_obj_diff / (1000 * 60 * 60)) % 24).toString();
	$: if (parseInt(countD_h) < 10) {
		countD_h = '0' + countD_h;
	}

  // ~~~~~~~~~~~~~~~~~~~~~
  // [ADD-ON] FIREBASE
  // ~~~~~~~~~~~~~~~~~~~~~

  let real_time_unsubscribe: Unsubscribe[] = []
  const live_fixtures_map = new Map<number, FIREBASE_livescores_now>();

  async function check_live_fixtures (
    data: [string, FIREBASE_livescores_now][]
  ) {
    
    // [🐞]
    if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `in-check_live_fixtures()`)

    // [ℹ] generate FIREBASE fixtures-map
    for (const live_fixture of data) {
      const fixture_id = parseInt(live_fixture[0].toString())
      const fixture_data = live_fixture[1]
      live_fixtures_map.set(fixture_id, fixture_data)
    }

    // [ℹ] validate against [this] fixture_id
    const fixture_id = FIXTURE_SCOREBOARD?.id;

    if (live_fixtures_map.has(fixture_id)) {
      if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `fixture livescore_now exists!`)
      // [ℹ] update fixture data;
      FIXTURE_SCOREBOARD.minute = live_fixtures_map.get(fixture_id)?.time?.minute
      FIXTURE_SCOREBOARD.status = live_fixtures_map.get(fixture_id)?.time?.status
      FIXTURE_SCOREBOARD.teams.away.score = live_fixtures_map.get(fixture_id)?.scores?.localteam_score
      FIXTURE_SCOREBOARD.teams.home.score = live_fixtures_map.get(fixture_id)?.scores?.visitorteam_score
    }
    FIXTURE_SCOREBOARD = FIXTURE_SCOREBOARD
  }

	async function listen_real_time_livescores_now (
  ): Promise < void > {

    // [🐞]
    if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `in-listen_real_time_livescores_now()`)

    const fixtureRef = ref (
      db_real,
      'livescores_now/'
    );

    const listen_livescore_event_ref = onValue(fixtureRef, (snapshot) => {
      // [ℹ] break-down-values
      if (snapshot.val() != null) {
        const data: [string, FIREBASE_livescores_now][] = Object.entries(snapshot.val())
        check_live_fixtures(data);
      }
    });

    real_time_unsubscribe.push(listen_livescore_event_ref);
  }

  async function check_fixture_odds_inject(
    sportbook_list: FIREBASE_odds[]
  ) {

    // [ℹ] match "data.key" (fixture_id)
    // [ℹ] with available (fixture_id's)
    // [ℹ] and populate the SPORTBOOK_DETAILS
    // [ℹ] based on the "top-1" OR avaialble ODDS
    // [ℹ] for the selected GEO-POSITION
    // [ℹ] and inject to LIVE_ODDS for TARGET FIXTURE

    if (SPORTBOOK_DETAILS_LIST == undefined) {
      return;
    }

    let count = 0;

    for (const firebase_sportbook of sportbook_list) {
      const firebase_sportbook_title = firebase_sportbook?.sportbook
      for (const main_sportbook of SPORTBOOK_DETAILS_LIST) {
        const main_sportbook_title = main_sportbook?.title
        if (
          main_sportbook_title.toLowerCase() == firebase_sportbook_title.toLowerCase() &&
          firebase_sportbook.markets['1X2FT'] != null &&
          firebase_sportbook.markets != null &&
          firebase_sportbook.markets['1X2FT'].data[0].value != null &&
          firebase_sportbook.markets['1X2FT'].data[1].value != null &&
          firebase_sportbook.markets['1X2FT'].data[2].value != null &&
          count != 1
        ) {
          FIXTURE_SCOREBOARD._1x2.home = firebase_sportbook.markets['1X2FT'].data[0].value
          FIXTURE_SCOREBOARD._1x2.away = firebase_sportbook.markets['1X2FT'].data[1].value
          FIXTURE_SCOREBOARD._1x2.draw = firebase_sportbook.markets['1X2FT'].data[2].value
          SPORTBOOK_INFO = main_sportbook
          count = 1
        }
      }
    }

    // [ℹ] assign changes [persist]
    FIXTURE_SCOREBOARD = FIXTURE_SCOREBOARD
  }

	async function listen_real_time_odds (
  ): Promise < void > {

    const fixture_status = FIXTURE_SCOREBOARD?.status;
    if (fixture_status == 'FT') {
      return
    }

    const sportbook_array: FIREBASE_odds[] = []
    const fixture_time = FIXTURE_SCOREBOARD?.fixture_time;
    const fixture_id = FIXTURE_SCOREBOARD?.id;

    // [ℹ] [GET] target fixture odds
    // [ℹ] only non-"FT" in THIS method

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
      }
    });

    real_time_unsubscribe.push(listen_odds_event_ref);
  }

  // [ℹ] one-off event read "livescores_now"
  onMount(async() => {
    const firebase_real_time = await get_livescores_now()
    if (firebase_real_time != null) {
      const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
      check_live_fixtures(data)
    }
    const fixture_status = FIXTURE_SCOREBOARD?.status;
    if (fixture_status != 'FT') {
      const fixture_time = FIXTURE_SCOREBOARD?.fixture_time;
      const fixture_id = FIXTURE_SCOREBOARD?.id;
      const firebase_odds = await get_odds(fixture_time, fixture_id)
      if (firebase_odds.length != 0) {
        check_fixture_odds_inject(firebase_odds);
      }
    }
  })
  
  // [ℹ] real-time listen-events init.
  onMount(async() => {
    listen_real_time_livescores_now();
    listen_real_time_odds();
    setInterval(async () => {
      tick_sec_show = !tick_sec_show
    }, 500)
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
        listen_real_time_livescores_now()
        listen_real_time_odds();
      }
    });
  })

  onDestroy(async() => {
    // [ℹ] close LISTEN EVENT connection
    for (const iterator of real_time_unsubscribe) {
      if (dev) console.groupCollapsed("closing connections [DEV]");
      if (dev) console.log("closing connection")
      if (dev) console.groupEnd();
      iterator();
    }
  })

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div
  id='widget-outer'>

  <!-- [ℹ] SEO-DATA-LOADED 
  -->
  <!-- {#if !loaded}
    <div 
      id="seo-widget-box">
      {@html LEAGUE_INFO_SEO_DATA?.data?.seo_content}
    </div>
  {/if} -->

  <!-- [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  <!-- {#if 
    no_widget_data && 
    loaded}

    <!-- [ℹ] title of the widget 
    - ->
    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {LEAGUE_INFO_SEO_DATA?.data?.translation?.league_info}
    </h2>

    <!-- [ℹ] no-widget-data-avaiable-placeholder container 
    - ->
    <div
      id='no-widget-box'
      class='column-space-center'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      <!-- [ℹ] no-visual-asset
      - ->
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
      - ->
      <div>
        <p 
          class='s-14 m-b-8 w-500'
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info}
        </p>
        <p class='s-14 color-grey w-400'> 
          {LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info_desc}
        </p>
      </div>
    </div>
  {/if} -->

  <!-- [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if 
    !no_widget_data &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker && 
    !enable_logs}


    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <ScoreboardLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <!--
      [ℹ] widget-component [DESKTOP] [TABLET] [MOBILE]
      -->
      <div 
        id="scoreboard-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] top-row data container
        -->
        <div
          id="scoreboard-top-box"
          class="column-space-center">

          <!-- 
          [ℹ] league info
          -->
          <div
            class="row-space-center m-b-15">
            <img 
              src=''
              alt=""
              width=20px
              height=20px
              class="m-r-10"
            />
            <p
              class="color-white">
              {FIXTURE_INFO?.data?.league_name}
              -
              Round
              {FIXTURE_SCOREBOARD?.round}
            </p>
          </div>

          <!-- 
          [ℹ] teams / fixture info box
          -->
          <div
            class="
              row-space-out
              m-b-20
            ">
            <!-- 
            [ℹ] team #1
            -->
            <div
              class="
                column-space-center 
                team-box
              ">
              <img 
                src={FIXTURE_SCOREBOARD.home_team_logo}
                alt=""
                class="m-b-12"
              />
              <p
                class="
                  s-14
                  w-500
                  color-white
                ">
                {FIXTURE_SCOREBOARD.home_team_name}
              </p>
            </div>
            <!-- 
            [ℹ] fixture info
            [ℹ] =?> non-"FT"
            [ℹ] =?> in-Play
            [ℹ] =?> "FT"
            -->
            {#if FIXTURE_SCOREBOARD.status == "NS"}
              <div
                style="align-self: center;">
                <p 
                  class="
                    w-500 
                    x-large 
                    desktop-x-large
                    color-white
                  ">
                  {countD_h}:{countD_min}:{countD_sec}
                </p>
                <p 
                  class="
                    w-400 
                    small 
                    color-grey 
                    desktop-medium
                  " 
                  style="white-space: nowrap;">
                  {getOrdinalNum(new Date(FIXTURE_SCOREBOARD?.fixture_time).getDate())}
                  {monthNames[new Date(FIXTURE_SCOREBOARD?.fixture_time).getMonth().toString()]}
                  {new Date(FIXTURE_SCOREBOARD?.fixture_time).getFullYear().toString().substr(-2)},
                  {new Date(FIXTURE_SCOREBOARD?.fixture_time).getHours().toString()}:{(
                    '0' + new Date(FIXTURE_SCOREBOARD?.fixture_time).getMinutes().toString()
                  ).slice(-2)}h
                </p>
              </div>
            {:else if FIXTURE_SCOREBOARD.status != "FT" }
              <div
                class="
                  column-space-center
                ">
                <p
                  class="
                    color-white
                    s-42
                    w-500
                  ">
                  {FIXTURE_SCOREBOARD?.teams?.home?.score}
                  :
                  {FIXTURE_SCOREBOARD?.teams?.away?.score}
                </p>
                <p
                  class="
                    color-grey
                    s-16
                    w-500
                  ">
                  {FIXTURE_SCOREBOARD?.minute}
                  <span
                    class:visibility-none={tick_sec_show}>'
                  </span>
                </p>
              </div>
            {:else if FIXTURE_SCOREBOARD.status == "FT" }
              <div
                class="
                  column-space-center
                ">
                <p
                  class="
                    s-14
                    w-500
                    color-grey
                  ">
                  FT
                </p>
                <p
                  class="
                    color-white
                    s-42
                    w-500
                  ">
                  {FIXTURE_SCOREBOARD?.teams?.home?.score}
                  :
                  {FIXTURE_SCOREBOARD?.teams?.away?.score}
                </p>
              </div>
            {/if}
            <!-- 
            [ℹ] team #2
            -->
            <div
              class="
                column-space-center 
                team-box
              ">
              <img 
                src={FIXTURE_SCOREBOARD.away_team_logo}
                alt=""
                class="m-b-12"
              />
              <p
                class="
                  s-14
                  w-500
                  color-white
                ">
                {FIXTURE_SCOREBOARD.away_team_name}
              </p>
            </div>
          </div>

          <!-- 
          [ℹ] betting site
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
              Featured by
            </p>
            <img 
              src={SPORTBOOK_INFO?.image}
              alt=""
            />
          </div>

          <!-- 
          [ℹ] odds
          [ℹ] non-"FT"
          -->
          {#if FIXTURE_SCOREBOARD.status != "FT"}
            <div
              id="btn-vote-container" 
              class="row-space-out">
                  
              <!-- 
              [ℹ] ODDS #1 -->
              <div
                class="
                  odds-box
                  row-space-out
                ">
                <!-- 
                [ℹ] team-img / odds-type -->
                {#if !mobileExclusive}
                  <img 
                    src={FIXTURE_SCOREBOARD.home_team_logo} 
                    alt=""
                  />
                {:else}
                  <p  
                    class="
                      color-grey
                      s-14
                      w-500
                    ">
                    1
                  </p>
                {/if}
              </div>

              <!-- 
              [ℹ] ODDS #X -->
              <div
                class="
                  odds-box
                  row-space-out
                ">
                <!-- 
                [ℹ] team-img / odds-type -->
                {#if !mobileExclusive}
                  <img 
                    src={FIXTURE_SCOREBOARD.home_team_logo} 
                    alt=""
                  />
                {:else}
                  <p  
                    class="
                      color-grey
                      s-14
                      w-500
                    ">
                    X
                  </p>
                {/if}
                <p>
                  {IXTURE_SCOREBOARD._1x2.home}
                </p>
              </div>

              <!-- 
              [ℹ] ODDS #2 -->
              <div
                class="
                  odds-box
                  row-space-out
                ">
                <!-- 
                [ℹ] team-img / odds-type -->
                {#if !mobileExclusive}
                  <img 
                    src={FIXTURE_SCOREBOARD.away_team_logo} 
                    alt=""
                  />
                {:else}
                  <p  
                    class="
                      color-grey
                      s-14
                      w-500
                    ">
                    2
                  </p>
                {/if}
                <p>
                  {IXTURE_SCOREBOARD._1x2.away}
                </p>
              </div>

            </div>
          {:else}
            <div>
              <p 
                class="
                  w-400 
                  small 
                  color-grey 
                  desktop-medium
                " 
                style="white-space: nowrap;">
                {getOrdinalNum(new Date(FIXTURE_SCOREBOARD?.fixture_time).getDate())}
                {monthNames[new Date(FIXTURE_SCOREBOARD?.fixture_time).getMonth().toString()]}
                {new Date(FIXTURE_SCOREBOARD?.fixture_time).getFullYear().toString().substr(-2)},
                {new Date(FIXTURE_SCOREBOARD?.fixture_time).getHours().toString()}:{(
                  '0' + new Date(FIXTURE_SCOREBOARD?.fixture_time).getMinutes().toString()
                ).slice(-2)}h
              </p>
            </div>
          {/if}
 
        </div>

        <!-- 
        [ℹ] bottom-navigation
        -->
        <div
          id="scoreboard-bottom-nav-box"
          class="row-space-even">
          <div
            class="
              opt-container 
              cursor-pointer
            "
            on:click={() => selected_view = 0}
            class:activeOpt={selected_view == 0}>
            <p
              class="s-14 color-grey w-500 no-wrap">
              Overview
            </p>
          </div>
          <div
            class="
              opt-container 
              cursor-not-allowed
            "
            on:click={() => selected_view = 1}
            class:activeOpt={selected_view == 1}>
            <p
              class="s-14 color-grey w-500 no-wrap">
              News and Views
            </p>
          </div>
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
    [ℹ] NOTE: [MOBILE-FIRST]
  */

  #scoreboard-widget-container {
    padding: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: none;
    background-image: url(./assets/banner.svg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  div#scoreboard-widget-container div#scoreboard-top-box {
    padding: 20px 12px;
  }

  /* team-info style */
  div#scoreboard-widget-container div#scoreboard-top-box div.team-box img {
    width: 72px;
    height: 72px;
  } div#scoreboard-widget-container div#scoreboard-top-box span.visibility-none {
    visibility: hidden;
  }
  
  /* bet-site */
  div#scoreboard-widget-container div#scoreboard-top-box div.bet-site-box img {
    width: 67px;
    height: 28px;
    border-radius: 5.49px;
    object-fit: cover;
  }

  /* odds style */
  div#scoreboard-widget-container div#scoreboard-top-box div.odds-box {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #4B4B4B;
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 16px;
  } div#scoreboard-widget-container div#scoreboard-top-box div.odds-box img {
    width: 28px;
    height: 28px;
  }

  /* bottom nav */
  div#scoreboard-widget-container div#scoreboard-bottom-nav-box {
    background-color: #FFFFFF;
    padding: 20px 10px 0 10px;
  } div#scoreboard-widget-container div#scoreboard-bottom-nav-box div.opt-container {
    border-bottom: solid 2.5px transparent;
    width: 100%;
    text-align: center;
  } div#scoreboard-widget-container div#scoreboard-bottom-nav-box div.opt-container p {
    padding-bottom: 12px;
  } div#scoreboard-widget-container div#scoreboard-bottom-nav-box div.opt-container.activeOpt {
    border-color: #F5620F;
  } div#scoreboard-widget-container div#scoreboard-bottom-nav-box  div.opt-container.activeOpt p {
    color: #F5620F !important;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #scoreboard-widget-container {
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

    #scoreboard-widget-container {
      min-width: 100%;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */


</style>
