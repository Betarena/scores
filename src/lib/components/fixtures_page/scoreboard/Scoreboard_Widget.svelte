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
    REDIS_CACHE_SINGLE_scoreboard_data, REDIS_CACHE_SINGLE_scoreboard_translation 
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
	// import banner from './assets/banner.svg';
  import close_icon from './assets/close.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let FIXTURE_INFO:       REDIS_CACHE_SINGLE_fixtures_page_info_response;
	export let FIXTURE_SCOREBOARD: REDIS_CACHE_SINGLE_scoreboard_data;
  export let FIXTURE_SCOREBOARD_TRANSLATION: REDIS_CACHE_SINGLE_scoreboard_translation

  let SPORTBOOK_INFO:            Cache_Single_SportbookDetails_Data_Response;
  let SPORTBOOK_DETAILS_LIST:    Cache_Single_SportbookDetails_Data_Response[]

  let loaded:            boolean = false;         // [ℹ] holds boolean for data loaded;
  let refresh:           boolean = false;         // [ℹ] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;         // [ℹ] refresh-data value speed;
  let no_widget_data:    any = false;             // [ℹ] identifies the no_widget_data boolean;
  let selected_view      = 0;
  let tick_sec_show:     boolean = false;
  let enable_miniature:  boolean = false;

  let currentSeason:     number = undefined;

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
  // [ℹ] (x2) cache
  // [ℹ] (x1) hasura-default
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

    if (FIXTURE_SCOREBOARD == undefined) {
      // [🐞]
      if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `no cached fixture (loading Hasura)`)
      const fixture_id = FIXTURE_INFO.data.id;
      const response_fixture: REDIS_CACHE_SINGLE_scoreboard_data = await get("/api/hasura/fixtures/scoreboard?fixture_id="+fixture_id)
      FIXTURE_SCOREBOARD = response_fixture
    }

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
    FIXTURE_SCOREBOARD = FIXTURE_SCOREBOARD

    return FIXTURE_SCOREBOARD;
  }

  function triggerGoggleEvents(
    action: string
  ) {
    if (action === "betting_site_logo_football_fixtures_scoreboard_fixtures") {
      gtag('event', "fixtures_scoreboard_odds", { 
        'event_category': "widget_fixture_scoreboard_info", 
        'event_label': "click_betting_site_logo", 
        'value': "click"
        }
      );
      return
    }
  }

  let initial_div_distance: number = undefined;
  let count = 0;

  onMount(async() => {
    if (browser) {
      let target_div = document.getElementById('scoreboard-widget-container');
      window.addEventListener('scroll', function(ev) {
        target_div = document.getElementById('scoreboard-widget-container');
        if (count == 0) {
          initial_div_distance = target_div.getBoundingClientRect().top;
          count = 1;
        }
        let distance_top_from_div = target_div.getBoundingClientRect().top;
        let distance_top_scroll = window.scrollY;
        if (dev) console.log("HERE", `
          initial_div_distance: ${initial_div_distance}
          distance_top_scroll: ${distance_top_scroll}
          distance_top_from_div: ${distance_top_from_div}
        `)
        // [ℹ] when [STANDARD VIEW]
        if (
          distance_top_from_div <= 0 &&
          !enable_miniature
        ) {
          enable_miniature = true
        }
        // [ℹ] when [MINIATURE VIEW]
        if (
          initial_div_distance != undefined &&
          count == 1 &&
          distance_top_scroll <= initial_div_distance &&
          enable_miniature
        ) {
          enable_miniature = false
        }
      });
    }
  })
    

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
      if (dev) console.log("SPORTBOOK_DETAILS_LIST = UNDEFINED")
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
          if (dev) console.log("main_sportbook_title", main_sportbook_title)
          if (dev) console.log("firebase_sportbook", firebase_sportbook)
          FIXTURE_SCOREBOARD._1x2 = undefined
          FIXTURE_SCOREBOARD._1x2 = {
            home: undefined,
            away: undefined,
            draw: undefined
          }
          FIXTURE_SCOREBOARD._1x2.home = parseFloat(firebase_sportbook.markets['1X2FT'].data[0].value.toFixed(2))
          FIXTURE_SCOREBOARD._1x2.away = parseFloat(firebase_sportbook.markets['1X2FT'].data[1].value.toFixed(2))
          FIXTURE_SCOREBOARD._1x2.draw = parseFloat(firebase_sportbook.markets['1X2FT'].data[2].value.toFixed(2))
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
        check_fixture_odds_inject(sportbook_array);
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

  <!-- 
  [ℹ] SEO-DATA-LOADED 
  -->
  {#if !loaded}
    <div 
      id="seo-widget-box">
      <p>{FIXTURE_SCOREBOARD?.away_team_name}</p>
      <p>{FIXTURE_SCOREBOARD?.home_team_name}</p>
      <a href={$page.url.href}>
        {$page.url.href}
      </a>
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
          NO INFO
        </p>
        <p class='s-14 color-grey w-400'> 
          NO INFO DESC
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
      [ℹ] [STANDARD] widget-component [DESKTOP] [TABLET] [MOBILE]
      -->
      {#if !enable_miniature}
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
            [ℹ] [MOBILE]
            -->
            {#if mobileExclusive}

              <!-- 
              [ℹ] background-gradient
              -->
              <div
                id="background-gradient-box">
              </div>
              
              <!-- 
              [ℹ] league info
              -->
              <div
                id="league-info-box"
                class="
                  row-space-center 
                  m-b-15
                  cursor-pointer
                ">
                <a 
                  href={FIXTURE_SCOREBOARD?.league_urls[FIXTURE_SCOREBOARD_TRANSLATION?.lang]}>
                  <div
                    id="league-info-img-box"
                    class="m-r-10">
                    <img 
                      src={FIXTURE_SCOREBOARD?.league_logo}
                      alt=""
                      width=14px
                      height=14px
                    />
                  </div>
                  <p
                    class="color-white">
                    {FIXTURE_INFO?.data?.league_name}
                    -
                    Round
                    {FIXTURE_SCOREBOARD?.round}
                  </p>
                </a>
              </div>

              <!-- 
              [ℹ] teams / fixture info box
              -->
              <div
                id="fixture-info-box"
                class="
                  row-space-out
                  m-b-10
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
                    width=72px
                    height=72px
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
                {#if FIXTURE_SCOREBOARD.status == "NS" || FIXTURE_SCOREBOARD.status == "POSTP"}
                  <div
                    style="align-self: center;">
                    <p 
                      class="
                        w-500 
                        x-large 
                        desktop-x-large
                        color-white
                        text-center
                      ">
                      {countD_h}:{countD_min}:{countD_sec}
                    </p>
                    <p 
                      class="
                        w-400 
                        small 
                        color-grey 
                        desktop-medium
                        text-center
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
                        ft-text
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
                    <p
                      class="
                        s-14
                        w-500
                        color-grey
                      ">
                      {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                        (HT {FIXTURE_SCOREBOARD?.score_post?.ht_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                        (ET {FIXTURE_SCOREBOARD?.score_post?.et_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                        (PS {FIXTURE_SCOREBOARD?.score_post?.ps_score})
                      {/if}
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
                    width=72px
                    height=72px
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
              [ℹ] non-"FT"
              -->
              {#if FIXTURE_SCOREBOARD.status != "FT"}
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
                  <a 
                    rel="nofollow"
                    aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                    on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
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
              {/if}

              <!-- 
              [ℹ] odds
              [ℹ] non-"FT"
              -->
              {#if FIXTURE_SCOREBOARD.status != "FT"}
                <div
                  id="btn-vote-container" 
                  class="row-space-center">
                      
                  <!-- 
                  [ℹ] ODDS #1 -->
                  <a 
                    rel="nofollow"
                    aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                    on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                    style="width: fit-content;">
                    <div
                      class="
                        odds-box
                        row-space-out
                      ">
                      <!-- 
                      [ℹ] team-img / odds-type -->
                      <p  
                        class="
                          color-grey
                          s-14
                          w-500
                        ">
                        1
                      </p>
                      <p
                        class="
                          color-white
                          s-14
                          w-500
                        ">
                        {FIXTURE_SCOREBOARD?._1x2?.home}
                      </p>
                    </div>
                  </a>

                  <!-- 
                  [ℹ] ODDS #X -->
                  <a 
                    rel="nofollow"
                    aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                    on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                    style="width: fit-content;">
                    <div
                      class="
                        odds-box
                        row-space-out
                      ">
                      <p  
                        class="
                          color-grey
                          s-14
                          w-500
                        ">
                        X
                      </p>
                      <p  
                        class="
                          color-grey
                          s-14
                          w-500
                        ">
                        {FIXTURE_SCOREBOARD?._1x2?.draw}
                      </p>
                    </div>
                  </a>

                  <!-- 
                  [ℹ] ODDS #2 -->
                  <a 
                    rel="nofollow"
                    aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                    on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                    style="width: fit-content;">
                    <div
                      class="
                        odds-box
                        row-space-out
                      ">
                      <!-- 
                      [ℹ] team-img / odds-type -->
                      <p  
                        class="
                          color-grey
                          s-14
                          w-500
                        ">
                        2
                      </p>
                      <p
                        class="
                          color-white
                          s-14
                          w-500
                        ">
                        {FIXTURE_SCOREBOARD?._1x2?.away}
                      </p>
                    </div>
                  </a>

                </div>
              {:else}
                <div
                  class="fixture-time-btm">
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

            <!-- 
            [ℹ] [TABLET]
            -->
            {:else if !mobileExclusive && tabletExclusive}

              <!-- 
              [ℹ] background-gradient
              [ℹ] non-"FT"
              -->
              {#if FIXTURE_SCOREBOARD.status != "FT"}
                <div
                  id="background-gradient-box">
                </div>
              {/if}

              <!-- 
              [ℹ] league info
              -->
              <div
                id="league-info-box"
                class="
                  row-space-center 
                  cursor-pointer
                ">
                <a 
                  href={FIXTURE_SCOREBOARD?.league_urls[FIXTURE_SCOREBOARD_TRANSLATION?.lang]}>
                  <div
                    id="league-info-img-box"
                    class="m-r-10">
                    <img 
                      src={FIXTURE_SCOREBOARD?.league_logo}
                      alt=""
                      width=14px
                      height=14px
                    />
                  </div>
                  <p
                    class="color-white">
                    {FIXTURE_INFO?.data?.league_name}
                    -
                    Round
                    {FIXTURE_SCOREBOARD?.round}
                  </p>
                </a>
              </div>

              <!-- 
              [ℹ] teams / fixture info box
              -->
              <div
                id="fixture-info-box"
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
                    width=72px
                    height=72px
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
                {#if FIXTURE_SCOREBOARD.status == "NS" || FIXTURE_SCOREBOARD.status == "POSTP"}
                  <div
                    class="m-b-30"
                    style="align-self: center;">
                    <p 
                      class="
                        w-500 
                        x-large 
                        desktop-x-large
                        color-white
                        text-center
                      ">
                      {countD_h}:{countD_min}:{countD_sec}
                    </p>
                    <p 
                      class="
                        w-400 
                        small 
                        color-grey 
                        desktop-medium
                        text-center
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
                        ft-text
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
                    <p
                      class="
                        s-16
                        w-500
                        color-grey
                      ">
                      {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                        (HT {FIXTURE_SCOREBOARD?.score_post?.ht_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                        (ET {FIXTURE_SCOREBOARD?.score_post?.et_score})
                      {/if}
                      {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                        (PS {FIXTURE_SCOREBOARD?.score_post?.ps_score})
                      {/if}
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
                    width=72px
                    height=72px
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
              [ℹ] bet-site + odds -->
              {#if FIXTURE_SCOREBOARD.status != "FT"}
                <div
                  id="tablet-bet-odds-box">
                  <!-- 
                  [ℹ] betting site
                  [ℹ] non-"FT"
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
                    <a 
                      rel="nofollow"
                      aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                      on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
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
                  [ℹ] odds
                  [ℹ] non-"FT"
                  -->
                  <div
                    id="btn-vote-container" 
                    class="row-space-center">
                        
                    <!-- 
                    [ℹ] ODDS #1 -->
                    <a 
                      rel="nofollow"
                      aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                      on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                      href={SPORTBOOK_INFO?.register_link}
                      target="_blank"
                      style="width: fit-content;">
                      <div
                        class="
                          odds-box
                          row-space-out
                        ">
                        <!-- 
                        [ℹ] team-img / odds-type -->
                        <img 
                          src={FIXTURE_SCOREBOARD.home_team_logo} 
                          alt=""
                        />
                        <p
                          class="
                            color-white
                            s-14
                            w-500
                          ">
                          {FIXTURE_SCOREBOARD?._1x2?.home}
                        </p>
                      </div>
                    </a>

                    <!-- 
                    [ℹ] ODDS #X -->
                    <a 
                      rel="nofollow"
                      aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                      on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                      href={SPORTBOOK_INFO?.register_link}
                      target="_blank"
                      style="width: fit-content;">
                      <div
                        class="
                          odds-box
                          row-space-out
                        ">
                        <!-- 
                        [ℹ] team-img / odds-type -->
                        <img 
                          src={close_icon} 
                          alt=""
                        />
                        <p  
                          class="
                            color-grey
                            s-14
                            w-500
                          ">
                          {FIXTURE_SCOREBOARD?._1x2?.draw}
                        </p>
                      </div>
                    </a>

                    <!-- 
                    [ℹ] ODDS #2 -->
                    <a 
                      rel="nofollow"
                      aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                      on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                      href={SPORTBOOK_INFO?.register_link}
                      target="_blank"
                      style="width: fit-content;">
                      <div
                        class="
                          odds-box
                          row-space-out
                        ">
                        <!-- 
                        [ℹ] team-img / odds-type -->
                        <img 
                          src={FIXTURE_SCOREBOARD.away_team_logo} 
                          alt=""
                        />
                        <p
                          class="
                            color-white
                            s-14
                            w-500
                          ">
                          {FIXTURE_SCOREBOARD?._1x2?.away}
                        </p>
                      </div>
                    </a>

                  </div>
                </div>
              <!-- 
              [ℹ] display fixture-time -->
              {:else}
                <div
                  class="fixture-time-btm">
                  <p 
                    class="
                      w-400 
                      s-14 
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

            <!-- 
            [ℹ] [DESKTOP]
            -->
            {:else}

              <div
                class="
                  row-space-out
                "> 

                <!-- 
                [ℹ] team #1
                -->
                <div
                  class="
                    column-space-center 
                    team-box
                  ">
                  <div
                    class="inner-team-box-1">
                    <img 
                      src={FIXTURE_SCOREBOARD.home_team_logo}
                      alt=""
                      class="m-b-12"
                      width=88px
                      height=88px
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
                </div>

                <!-- 
                [ℹ] league info
                [ℹ] fixture info box
                [ℹ] bet-site + odds
                -->
                <div
                  class="column-space-center">

                  <div
                    id="league-info-box"
                    class="
                      row-space-center 
                      cursor-pointer
                      m-b-20
                    ">
                    <a 
                      href={FIXTURE_SCOREBOARD?.league_urls[FIXTURE_SCOREBOARD_TRANSLATION?.lang]}>
                      <div
                        id="league-info-img-box"
                        class="m-r-10">
                        <img 
                          src={FIXTURE_SCOREBOARD?.league_logo}
                          alt=""
                          width=14px
                          height=14px
                        />
                      </div>
                      <p
                        class="color-white">
                        {FIXTURE_INFO?.data?.league_name}
                        -
                        Round
                        {FIXTURE_SCOREBOARD?.round}
                      </p>
                    </a>
                  </div>

                  <!-- 
                  [ℹ] fixture info
                  [ℹ] =?> non-"FT"
                  [ℹ] =?> in-Play
                  [ℹ] =?> "FT"
                  -->
                  {#if FIXTURE_SCOREBOARD.status == "NS" || FIXTURE_SCOREBOARD.status == "POSTP"}
                    <div
                      class="m-b-30"
                      style="align-self: center;">
                      <p 
                        class="
                          w-500 
                          x-large 
                          desktop-x-large
                          color-white
                          text-center
                        ">
                        {countD_h}:{countD_min}:{countD_sec}
                      </p>
                      <p 
                        class="
                          w-400 
                          small 
                          color-grey 
                          desktop-medium
                          text-center
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
                          ft-text
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
                      <p
                        class="
                          s-16
                          w-500
                          color-grey
                        ">
                        {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                          (HT {FIXTURE_SCOREBOARD?.score_post?.ht_score})
                        {/if}
                        {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                          (ET {FIXTURE_SCOREBOARD?.score_post?.et_score})
                        {/if}
                        {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                          (PS {FIXTURE_SCOREBOARD?.score_post?.ps_score})
                        {/if}
                      </p>
                    </div>
                  {/if}

                  <!-- 
                  [ℹ] bet-site + odds -->
                  {#if FIXTURE_SCOREBOARD.status != "FT"}
                    <div
                      id="tablet-bet-odds-box">
                      <!-- 
                      [ℹ] betting site
                      [ℹ] non-"FT"
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
                        <a 
                          rel="nofollow"
                          aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                          on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
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
                      [ℹ] odds
                      [ℹ] non-"FT"
                      -->
                      <div
                        id="btn-vote-container" 
                        class="row-space-center">
                            
                        <!-- 
                        [ℹ] ODDS #1 -->
                        <a 
                          rel="nofollow"
                          aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                          on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                          href={SPORTBOOK_INFO?.register_link}
                          target="_blank"
                          style="width: fit-content;">
                          <div
                            class="
                              odds-box
                              row-space-out
                            ">
                            <!-- 
                            [ℹ] team-img / odds-type -->
                            <img 
                              src={FIXTURE_SCOREBOARD.home_team_logo} 
                              alt=""
                            />
                            <p
                              class="
                                color-white
                                s-14
                                w-500
                              ">
                              {FIXTURE_SCOREBOARD?._1x2?.home}
                            </p>
                          </div>
                        </a>

                        <!-- 
                        [ℹ] ODDS #X -->
                        <a 
                          rel="nofollow"
                          aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                          on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                          href={SPORTBOOK_INFO?.register_link}
                          target="_blank"
                          style="width: fit-content;">
                          <div
                            class="
                              odds-box
                              row-space-out
                            ">
                            <!-- 
                            [ℹ] team-img / odds-type -->
                            <img 
                              src={close_icon} 
                              alt=""
                            />
                            <p  
                              class="
                                color-grey
                                s-14
                                w-500
                              ">
                              {FIXTURE_SCOREBOARD?._1x2?.draw}
                            </p>
                          </div>
                        </a>

                        <!-- 
                        [ℹ] ODDS #2 -->
                        <a 
                          rel="nofollow"
                          aria-label="betting_site_logo_football_fixtures_scoreboard_fixtures"
                          on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_scoreboard_fixtures")}
                          href={SPORTBOOK_INFO?.register_link}
                          target="_blank"
                          style="width: fit-content;">
                          <div
                            class="
                              odds-box
                              row-space-out
                            ">
                            <!-- 
                            [ℹ] team-img / odds-type -->
                            <img 
                              src={FIXTURE_SCOREBOARD.away_team_logo} 
                              alt=""
                            />
                            <p
                              class="
                                color-white
                                s-14
                                w-500
                              ">
                              {FIXTURE_SCOREBOARD?._1x2?.away}
                            </p>
                          </div>
                        </a>

                      </div>
                    </div>
                  <!-- 
                  [ℹ] display fixture-time -->
                  {:else}
                    <div
                      class="m-t-20">
                      <p 
                        class="
                          w-400 
                          s-14 
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
                [ℹ] team #2
                -->
                <div
                  class="
                    column-space-center 
                    team-box
                  ">
                  <div
                    class="inner-team-box-2">
                    <img 
                      src={FIXTURE_SCOREBOARD.away_team_logo}
                      alt=""
                      class="m-b-12"
                      width=88px
                      height=88px
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
                {FIXTURE_SCOREBOARD_TRANSLATION?.overview}
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
                {FIXTURE_SCOREBOARD_TRANSLATION?.news_views}
              </p>
            </div>
          </div>
        </div>
      <!-- 
      [ℹ] [MINIATURE] widget-component [DESKTOP] [TABLET] [MOBILE]
      -->
      {:else}

        <div
          id="scoreboard-widget-container"
          class="miniature"
          class:tablet-miniature={!mobileExclusive}
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

          <!-- 
          [ℹ] [MOBILE]
          -->
          {#if mobileExclusive}

            <!-- 
            [ℹ] teams / fixture info box
            -->
            <div
              id="fixture-info-box"
              class="
                row-space-center
                m-b-20
              ">
              <!-- 
              [ℹ] team #1
              -->
              <div
                class="
                  row-space-out 
                  team-box
                  one
                ">
                <p
                  class="
                    s-14
                    w-500
                    color-white
                  ">
                  {FIXTURE_SCOREBOARD.home_team_name}
                </p>
                <img 
                  src={FIXTURE_SCOREBOARD.home_team_logo}
                  alt=""
                  width=40px
                  height=40px
                />
              </div>
              <!-- 
              [ℹ] fixture info
              [ℹ] =?> non-"FT"
              [ℹ] =?> in-Play
              [ℹ] =?> "FT"
              -->
              {#if FIXTURE_SCOREBOARD.status == "NS" || FIXTURE_SCOREBOARD.status == "POSTP"}
                <div
                  class="middle-info"
                  style="align-self: center;">
                  <p 
                    class="
                      w-500 
                      x-large 
                      desktop-x-large
                      color-white
                      text-center
                    ">
                    {countD_h}:{countD_min}:{countD_sec}
                  </p>
                  <p 
                    class="
                      w-400 
                      small 
                      color-grey 
                      desktop-medium
                      text-center
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
                    middle-info
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
                    middle-info
                  ">
                  <p
                    class="
                      s-14
                      w-500
                      color-grey
                      ft-text
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
                  <p
                    class="
                      s-14
                      w-500
                      color-grey
                    ">
                    {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                      (HT {FIXTURE_SCOREBOARD?.score_post?.ht_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                      (ET {FIXTURE_SCOREBOARD?.score_post?.et_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                      (PS {FIXTURE_SCOREBOARD?.score_post?.ps_score})
                    {/if}
                  </p>
                </div>
              {/if}
              <!-- 
              [ℹ] team #2
              -->
              <div
                class="
                  row-space-out  
                  team-box
                  two
                ">
                <img 
                  src={FIXTURE_SCOREBOARD.away_team_logo}
                  alt=""
                  width=40px
                  height=40px
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
                  {FIXTURE_SCOREBOARD_TRANSLATION?.overview}
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
                  {FIXTURE_SCOREBOARD_TRANSLATION?.news_views}
                </p>
              </div>
            </div>

          <!-- 
          [ℹ] [TABLET] && [DESKTOP]
          -->
          {:else}

            <!-- 
            [ℹ] teams / fixture info box
            -->
            <div
              id="fixture-info-box"
              class="
                row-space-center
                m-b-20
              ">

              <!-- 
              [ℹ] team #1
              -->
              <div
                class="
                  column-space-center
                  team-box
                  one
                ">
                <div  
                  class="
                    row-space-out 
                    inner-team-box-1
                  ">
                  <p
                    class="
                      s-14
                      w-500
                      color-white
                    ">
                    {FIXTURE_SCOREBOARD.home_team_name}
                  </p>
                  <img 
                    src={FIXTURE_SCOREBOARD.home_team_logo}
                    alt=""
                    width=40px
                    height=40px
                  />
                </div>
              </div>
              
              <!-- 
              [ℹ] fixture info
              [ℹ] =?> non-"FT"
              [ℹ] =?> in-Play
              [ℹ] =?> "FT"
              -->
              {#if FIXTURE_SCOREBOARD.status == "NS" || FIXTURE_SCOREBOARD.status == "POSTP"}
                <div
                  class="middle-info"
                  style="align-self: center;">
                  <p 
                    class="
                      w-500 
                      x-large 
                      desktop-x-large
                      color-white
                      text-center
                    ">
                    {countD_h}:{countD_min}:{countD_sec}
                  </p>
                  <p 
                    class="
                      w-400 
                      small 
                      color-grey 
                      desktop-medium
                      text-center
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
                    middle-info
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
                    middle-info
                  ">
                  <p
                    class="
                      s-14
                      w-500
                      color-grey
                      ft-text
                    ">
                    FT
                  </p>
                  <p
                    class="
                      color-white
                      s-42
                      w-500
                      no-wrap
                    ">
                    {FIXTURE_SCOREBOARD?.teams?.home?.score}
                    :
                    {FIXTURE_SCOREBOARD?.teams?.away?.score}
                  </p>
                  <p
                    class="
                      s-14
                      w-500
                      color-grey
                    ">
                    {#if FIXTURE_SCOREBOARD?.score_post?.ht_score}
                      (HT {FIXTURE_SCOREBOARD?.score_post?.ht_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.et_score}
                      (ET {FIXTURE_SCOREBOARD?.score_post?.et_score})
                    {/if}
                    {#if FIXTURE_SCOREBOARD?.score_post?.ps_score}
                      (PS {FIXTURE_SCOREBOARD?.score_post?.ps_score})
                    {/if}
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
                  two
                ">
                <div  
                  class="
                    row-space-out   
                    inner-team-box-2
                  ">
                  <img 
                    src={FIXTURE_SCOREBOARD.away_team_logo}
                    alt=""
                    width=40px
                    height=40px
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
                  {FIXTURE_SCOREBOARD_TRANSLATION?.overview}
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
                  {FIXTURE_SCOREBOARD_TRANSLATION?.news_views}
                </p>
              </div>
            </div>

          {/if}
        </div>

      {/if}

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

  /* scorebaord-main */
  #scoreboard-widget-container {
    background-color: #4B4B4B;
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

  /* scorebaord-top */
  div#scoreboard-widget-container div#scoreboard-top-box {
    position: relative;
    padding: 20px 12px;
  }

  /* league-info */
  div#scoreboard-widget-container div#scoreboard-top-box div#league-info-box div#league-info-img-box {
    background-color: #FFFFFF;
    border-radius: 50%;
    padding: 3px;
    width: 20px;
    height: 20px;
  } div#scoreboard-widget-container div#scoreboard-top-box div#league-info-box div#league-info-img-box img {
    width: 14px;
    height: 14px;
  }

  /* team-info style */
  div#scoreboard-widget-container div#scoreboard-top-box div#fixture-info-box {
    display: grid;
		grid-auto-flow: column;
		justify-items: center;
		align-items: start;
		justify-content: center;
		grid-template-columns: 1fr 1fr 1fr;
		text-align: center;
    z-index: 1;
  } div#scoreboard-widget-container div#scoreboard-top-box div#fixture-info-box div.team-box img {
    max-width: 72px;
    max-height: 72px;
  } div#scoreboard-widget-container span.visibility-none {
    visibility: hidden;
  }
  
  /* bet-site */
  div#scoreboard-widget-container div#scoreboard-top-box div.bet-site-box img {
    width: 67px;
    height: 28px;
    border-radius: 5.49px;
    object-fit: cover;
    z-index: 1;
  }

  /* odds style */
  div#scoreboard-widget-container div#scoreboard-top-box div.odds-box {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #4B4B4B;
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 10px 16px;
    height: 48px;
    z-index: 1;
  } div#scoreboard-widget-container div#scoreboard-top-box div.odds-box {
    margin-right: 8px;
  } div#scoreboard-widget-container div#scoreboard-top-box div.odds-box:last-child {
    margin-right: 0px;
  } div#scoreboard-widget-container div#scoreboard-top-box div.odds-box img {
    width: 28px;
    height: 28px;
  }

  /* fixture-time [completion] */
  div#scoreboard-widget-container div#scoreboard-top-box div.fixture-time-btm {
    z-index: 1;
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

  /* background-gradient */
  div#background-gradient-box {
    position: absolute;
    bottom: 0;
    background: linear-gradient(180deg, rgba(41, 41, 41, 0) 4.48%, #292929 46.39%);
    height: 60px;
    width: 100%;
    z-index: 0;
  }

  /* miniature [ONLY] [MOBILE] */
  div#scoreboard-widget-container.miniature {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    border-radius: 0 !important;
    background: #292929 !important;
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box {
    width: auto; 
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box.one {
    margin-right: 20px;
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box.one p {
    margin-right: 15px;
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box.two {
    margin-left: 20px;
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box.two p {
    margin-left: 15px;
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box img {
    width: 40px;
    height: 40px;
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.team-box p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 30px;
  } div#scoreboard-widget-container.miniature div#fixture-info-box div.middle-info {
    width: auto;
  } div#scoreboard-widget-container.miniature div#scoreboard-bottom-nav-box {
    background-color: #FFFFFF;
    padding: 10px 15px 0 15px;
  } div#scoreboard-widget-container div#scoreboard-bottom-nav-box div.opt-container p {
    padding-bottom: 8px;
  }

  /* miniature [ONLY] [TABLET] && [DESKTOP] */
  div#scoreboard-widget-container.miniature.tablet-miniature {
    position: fixed;
    top: 0;
    right: auto;
    left: auto;
    border-radius: 0 0 12px 12px !important;
    padding-top: 20px;
    background-image: url(./assets/banner.svg) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    max-width: 1430px;
    width: calc(100vw - 68px);
  } div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box {
    /* display: grid;
		grid-auto-flow: column;
		justify-items: center;
		align-items: center;
		justify-content: center;
		grid-template-columns: 1fr 1fr 1fr;
		text-align: center;
    z-index: 1; */
  } div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.team-box p {
    overflow: visible;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
  } div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.team-box {
    position: relative;
    width: -webkit-fill-available;
  } div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.team-box div.inner-team-box-1 {
    position: absolute;
    right: 0;
    width: auto;
  } div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.team-box div.inner-team-box-2 {
    position: absolute;
    left: 0;
    width: auto;
  } div#scoreboard-widget-container.miniature.tablet-miniature div#fixture-info-box div.middle-info {
    width: 100px;
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

    /* odds-bet style */
    div#tablet-bet-odds-box {
      position: relative;    
      width: -webkit-fill-available;
    } div#tablet-bet-odds-box div.bet-site-box {
      position: absolute;
      bottom: 100%;
    }

    /* background-gradient */
    div#background-gradient-box {
      height: 135px;
    }
  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {

    /* bottom nav */
    div#scoreboard-widget-container div#scoreboard-bottom-nav-box {
      justify-content: center !important;
    } div#scoreboard-widget-container div#scoreboard-bottom-nav-box div.opt-container {
      width: fit-content;
      margin-right: 32px;
    } div#scoreboard-widget-container div#scoreboard-bottom-nav-box div.opt-container:last-child {
      margin-right: 0;
    }

    /* odds style */
    div#scoreboard-widget-container div#scoreboard-top-box div#btn-vote-container a div.odds-box {
      margin-right: 20px;
      width: 100%;
    } div#scoreboard-widget-container div#scoreboard-top-box div#btn-vote-container a:last-child div.odds-box {
      margin-right: 0px;
    }

    /* background-gradient */
    div#background-gradient-box {
      background: linear-gradient(174.38deg, rgba(41, 41, 41, 0) 4.48%, #292929 46.39%);
      height: 60px;
      width: 100%;
    }

    /* miniature [TABLET] */
    div#scoreboard-widget-container.miniature.tablet-miniature {
      min-width: auto;
    }

  }

  /* 
  DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #scoreboard-widget-container {
      min-width: 100%;
    }

    /* league-info */
    div#scoreboard-widget-container div#scoreboard-top-box div#league-info-box p:hover {
      color: #F5620F !important;
    }

    /* team-info style */
    div#scoreboard-widget-container div#scoreboard-top-box div.team-box img {
      width: 88px;
      height: 88px;
    } div#scoreboard-widget-container div#scoreboard-top-box div.team-box {
      position: relative;
    } div#scoreboard-widget-container div#scoreboard-top-box div.team-box p {
      font-size: 16px;
    } div#scoreboard-widget-container div#scoreboard-top-box div.team-box div.inner-team-box-1 {
      position: absolute;
      left: 25%;
      text-align: center;
    } div#scoreboard-widget-container div#scoreboard-top-box div.team-box div.inner-team-box-2 {
      position: absolute;
      right: 25%;
      text-align: center;
    } p.ft-text {
      font-size: 16px !important;
      margin-bottom: -10px
    }

    /* odds style */
    div#scoreboard-widget-container div#scoreboard-top-box div.odds-box {
      height: 48px;
      max-width: 200px;
      min-width: 150px;
    }

    /* odds-bet style */
    div#tablet-bet-odds-box {
      position: relative;    
      width: -webkit-fill-available;
    } div#tablet-bet-odds-box div.bet-site-box {
      position: absolute;
      bottom: 100%;
      right: 0;
      width: auto;
    }

    /* miniature [TABLET] */
    div#scoreboard-widget-container.miniature.tablet-miniature {
      min-width: auto;
    }

  }

  /* 
  DESKTOP [L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {

    /* odds style */
    div#scoreboard-widget-container div#scoreboard-top-box div.odds-box {
      height: 48px;
      max-width: 200px;
      min-width: 200px;
    }

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  div#scoreboard-widget-container.dark-background-1 div#scoreboard-bottom-nav-box {
    background-color: #4B4B4B;
  }

</style>
