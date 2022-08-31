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
  import { get } from "$lib/api/utils";

  import { userBetarenaSettings } from "$lib/store/user-settings";
	import { db_real } from '$lib/firebase/init';
	import { ref, onValue } from 'firebase/database';
  import { getLivescoresNow } from "$lib/firebase/fixtures_odds";

  import type { 
    REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response, 
    REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response, 
    Rounds_Data, 
    Tournament_Fixture_Odds
  } from "$lib/models/tournaments/fixtures_odds/types";
  import type { 
    Cache_Single_SportbookDetails_Data_Response 
  } from "$lib/models/tournaments/league-info/types";
  import type { 
    FIREBASE_livescores_now 
  } from "$lib/models/firebase";

  import FixtureOddsWidgetContentLoader from "./_Fixture_Odds_Widget_ContentLoader.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';
  import play from './assets/play.svg';
  import play_dark from './assets/play-dark.svg';
  import one_red_card from './assets/1_red_card.svg';
  import two_red_card from './assets/2_red_cards.svg';
  import three_red_card from './assets/3_red_cards.svg';

  let loaded:                   boolean = false;                // [ℹ] holds boolean for data loaded;
  let refresh:                  boolean = false;                // [ℹ] refresh value speed of the WIDGET;
	let refresh_data:             any = undefined;                // [ℹ] refresh-data value speed;
  let noFixturesOddsBool:       any = false;                    // [ℹ] identifies the noFixturesOddsBool boolean;
  let toggleDropdown:           boolean = false;
  let trueLengthOfArray:        number;
  let optView:                  'round' | 'week' = 'week'
  let fixtures_arr_filter: {
    date: Date
    fixtures: Tournament_Fixture_Odds[]
  }[] = []
  let selectedOpt:              string = 'matches';

  let diasbleDev:               boolean = false;
  let devConsoleTag:            string = "FIX_ODDS";

  let refreshRow:               boolean = false;

  let currentSeason:            number = undefined;

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

  const weekDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

	export let FIXTURES_ODDS_T:     REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response;
	export let FIXTURES_ODDS_DATA:  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response;

  $: if (dev && diasbleDev) console.log("FIXTURES_ODDS_T: ", FIXTURES_ODDS_T)

  // ~~~~~~~~~~~~~~~~~~~~~
  // [ADD-ON] FIREBASE
  // ~~~~~~~~~~~~~~~~~~~~~

  const liveFixturesMap = new Map<number, FIREBASE_livescores_now>();

  async function checkForLiveFixtures(data: [string, FIREBASE_livescores_now][]) {
    // [ℹ] generate map
    for (const live_fixture of data) {
      const fixture_id = parseInt(live_fixture[0].toString())
      const fixture_data = live_fixture[1]
      liveFixturesMap.set(fixture_id, fixture_data)
    }

    // [ℹ] validate against "visible" fixtures
    const currentDate = new Date();
    const numFixturesToday = fixtures_arr_filter
    .find( ({ date }) => 
      (new Date(date).getDate() === currentDate.getDate()) &&
      (new Date(date).getMonth() === currentDate.getMonth()) &&
      (new Date(date).getFullYear() === currentDate.getFullYear())
    )

    if (numFixturesToday != undefined) {
      const newFixturesArray = fixtures_arr_filter
      .find( ({ date }) => 
        (new Date(date).getDate() === currentDate.getDate()) &&
        (new Date(date).getMonth() === currentDate.getMonth()) &&
        (new Date(date).getFullYear() === currentDate.getFullYear())
      )
      ?.fixtures
      .map( fixture => {
        if (liveFixturesMap.has(fixture.id)) {
          return {
            ...fixture,
            minute: liveFixturesMap.get(fixture.id)?.time?.minute,
            status: liveFixturesMap.get(fixture.id)?.time?.status,
            teams: {
              away: {
                name: fixture?.teams?.away?.name,
                red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[0]?.redcards,
                score: liveFixturesMap.get(fixture.id)?.scores?.visitorteam_score,
              },
              home: {
                name: fixture?.teams?.home?.name,
                red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[1]?.redcards,
                score: liveFixturesMap.get(fixture.id)?.scores?.localteam_score,
              }
            }
          }
        }
        return fixture
      })

      fixtures_arr_filter
      .find( ({ date }) => 
        (new Date(date).getDate() === currentDate.getDate()) &&
        (new Date(date).getMonth() === currentDate.getMonth()) &&
        (new Date(date).getFullYear() === currentDate.getFullYear())
      )
      .fixtures = newFixturesArray

      fixtures_arr_filter = fixtures_arr_filter
    }
  }

  // [ℹ] listen real-time firebase livescores_now changes [WORKING]
	async function listenRealTimeOddsChange (): Promise < void > {

    const fixtureRef = ref (
      db_real,
      'livescores_now/'
    );

    onValue(fixtureRef, (snapshot) => {
      // [ℹ] break-down-values
      const data: [string, FIREBASE_livescores_now][] = Object.entries(snapshot.val())
      // if (dev) console.log(data)
      checkForLiveFixtures(data);
    });

  }

  let tickSecShow = false;

  onMount(async() => {
    listenRealTimeOddsChange();
    setInterval(async () => {
      tickSecShow = !tickSecShow
    }, 500)
  })

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(): Promise < Cache_Single_SportbookDetails_Data_Response > {

    if (!$userBetarenaSettings.country_bookmaker || $session?.selectedSeasonID == undefined) {
      return
    }

    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    // [ℹ] get response [lang] [data] [obtained from preload()]
		const response: Cache_Single_SportbookDetails_Data_Response = await get("/api/tournaments_sportbook/cache-data.json?geoPos="+userGeo)

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

    return response;
  }

  function selectTableView (opt: string) {
    selectedOpt = opt;
    refreshRow = true;
    setTimeout(async() => {
      refreshRow = false
    }, 50)
  }

  let week_start: Date
  let week_end: Date
  let week_name: number
  let ready = false
  let weeks_total: number
  let rounds_total: number

  async function selectFixturesOdds () {

    fixtures_arr_filter = []
    let temp_fixtures_odds_arr: Tournament_Fixture_Odds[] = []

    // [ℹ] current user (client) date
    const date = new Date();

    const target_season = FIXTURES_ODDS_DATA.seasons
    .find( ({ season_id }) => 
      season_id === $session.selectedSeasonID
    );

    // [ℹ] validation check (#1)
    if (target_season == undefined) {
      noFixturesOddsBool = true;
      loaded = false;
      return;
    }

    if (dev && !diasbleDev) console.log("target_season: ", target_season)

    // [ℹ] validation check (#1) [weeks / rounds] 
    if (
      target_season?.weeks === null ||
      target_season?.weeks === undefined ||
      target_season?.rounds === null || 
      target_season?.rounds === undefined) {
      noFixturesOddsBool = true;
      loaded = false;
      return;
    }

    // [ℹ] identify "round" start/end dates
    if (optView === 'round') {

      let target_round: Rounds_Data

      // [ℹ] complex round targeting identification
      for (let i = 0; i < target_season.rounds.length; i++) {
        
        const s_date = new Date(target_season.rounds[i].s_date)
        const e_date = new Date(target_season.rounds[i].e_date)
        const past_e_date = 
          i == 0 
            ? null
            : new Date(target_season.rounds[i-1].s_date)

        if (s_date <= date && e_date >= date) {
          target_round = target_season.rounds[i]
          break
        }

        else if (
          past_e_date !== null && 
          (past_e_date < date && s_date >= date)) {
          target_round = target_season.rounds[i]
          break
        }

      }

      week_start = new Date(target_round.s_date)
      week_end = new Date(target_round.e_date)
      week_name = parseInt(target_round.name)

      // [ℹ] search fixtures by target data
      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ round }) => 
        week_name === round
      );
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
      week_name = parseInt(target_week.name)

      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ fixture_date }) => 
        new Date(fixture_date) >= week_start &&
        new Date(fixture_date) <= week_end
      );

    }

    // [ℹ] extra get number of total weeks & rounds
    weeks_total = target_season.weeks.length
    rounds_total = target_season.rounds.length

    /**
     * [ℹ] group-by fixtures "fixture-day"
    */
    const fixtures_group_by_date = new Map <string, Tournament_Fixture_Odds[]>();

    for (const fixture of temp_fixtures_odds_arr) {
      
      const fixDate = fixture.fixture_date;

      if (fixtures_group_by_date.has(fixDate)) {
        fixtures_group_by_date.get(fixDate).push(fixture)
        let fix_arr = fixtures_group_by_date.get(fixDate)
        fix_arr.sort((a, b) => new Date(a.fixture_time).getTime() - new Date(b.fixture_time).getTime());
        fixtures_group_by_date.set(fixDate, fix_arr)
      }
      else {
        let newFixtureArr: Tournament_Fixture_Odds[] = []
        newFixtureArr.push(fixture)
        fixtures_group_by_date.set(fixDate, newFixtureArr)
      }
    }

    for (const [key, value] of fixtures_group_by_date.entries()) {
      const fixObj = {
        date: key,
        fixtures: value
      }
      fixtures_arr_filter.push(fixObj);
    }

    fixtures_arr_filter.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // [ℹ] break-down-values
    if (loaded) {
      const firebase_real_time = await getLivescoresNow()
      const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
      checkForLiveFixtures(data)
    }

    ready = true;
    noFixturesOddsBool = false;
    loaded = true;
  }

  async function selectFixtureOddsNumber(opt_view: number) {

    fixtures_arr_filter = []
    let temp_fixtures_odds_arr: Tournament_Fixture_Odds[] = []

    const target_season = FIXTURES_ODDS_DATA.seasons
    .find( ({ season_id }) => 
      season_id === $session.selectedSeasonID
    );

    // [ℹ] identify "round" start/end dates
    if (optView === 'round') {

      const target_round = target_season.rounds
      .find( ({ name }) =>
        parseInt(name) == opt_view
      );

      week_start = new Date(target_round.s_date)
      week_end = new Date(target_round.e_date)
      week_name = parseInt(target_round.name)

      // [ℹ] search fixtures by target data
      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ round }) => 
        week_name === round
      );
    }
    // [ℹ] identify "week" start/end dates
    else {

      const target_week = target_season.weeks
      .find( ({ name }) =>
        parseInt(name) == opt_view
      );

      week_start = new Date(target_week.s_date)
      week_end = new Date(target_week.e_date)
      week_name = parseInt(target_week.name)

      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ fixture_date }) => 
        new Date(fixture_date) >= week_start &&
        new Date(fixture_date) <= week_end
      );
    }

    /**
     * [ℹ] group-by fixtures "fixture-day"
    */
    const fixtures_group_by_date = new Map <string, Tournament_Fixture_Odds[]>();

    for (const fixture of temp_fixtures_odds_arr) {
      
      const fixDate = fixture.fixture_date;

      if (fixtures_group_by_date.has(fixDate)) {
        fixtures_group_by_date.get(fixDate).push(fixture)
        let fix_arr = fixtures_group_by_date.get(fixDate)
        fix_arr.sort((a, b) => new Date(a.fixture_time).getTime() - new Date(b.fixture_time).getTime());
        fixtures_group_by_date.set(fixDate, fix_arr)
      }
      else {
        let newFixtureArr: Tournament_Fixture_Odds[] = []
        newFixtureArr.push(fixture)
        fixtures_group_by_date.set(fixDate, newFixtureArr)
      }
    }

    for (const [key, value] of fixtures_group_by_date.entries()) {
      const fixObj = {
        date: key,
        fixtures: value
      }
      fixtures_arr_filter.push(fixObj);
    }

    fixtures_arr_filter.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // [ℹ] break-down-values
    if (loaded) {
      const firebase_real_time = await getLivescoresNow()
      const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
      checkForLiveFixtures(data)
    }
  }

  $: if (browser && loaded) {
    onMount(async() => {
      const firebase_real_time = await getLivescoresNow()
      const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
      checkForLiveFixtures(data)
    })
  }

  function selectedRoundsWeeksView(opt_view: "round" | "week") {
    optView = opt_view
    selectFixturesOdds()
  }

  function triggerGoggleEvents(action: string) {
    if (action === "betting_site_logo_football_fixtures_odds_tournament") {
      gtag('event', "betting_site_logo_football_fixtures_odds_tournament", { 
        'event_category': "widget_standings_info", 
        'event_label': "click_betting_site_logo", 
        'value': "click"
        }
      );
      return
    }
  }

  function closeAllDropdowns() {
    toggleDropdown = false;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  const tabletView = 1000
  const mobileView = 725
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

  let server_side_language: string = 'en';

  // [ℹ] IMPORTANT! lang selection [SERVER-SIDE-RENDER]
  $: if (
    $page.routeId != null &&
    !$page.error) {
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
        {#each FIXTURES_ODDS_DATA?.seasons[0].fixtures as item}
          <p>{item?.teams?.away?.name}</p>
          <p>{item?.teams?.home?.name}</p>
          {#if 
            item?.tip_link && 
            item?.tip_link[server_side_language]}
            <p>{item?.tip_link[server_side_language]}</p>
          {/if}
          {#if 
            item?.fixture_link && 
            item?.fixture_link[server_side_language]}
            <p>{item?.fixture_link[server_side_language]}</p>
          {/if}
          {#if 
            item?.media_link && 
            item?.media_link.length != 0}
            <p>{item?.media_link[0].video_link}</p>
          {/if}
        {/each}
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
    ready &&
    !noFixturesOddsBool &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker && 
    !diasbleDev}

    <!-- [ℹ] promise is pending 
    -->
    {#await widgetInit()}
      <FixtureOddsWidgetContentLoader />
    <!-- [ℹ] promise was fulfilled
    -->
    {:then data}

      <!-- [ℹ] widget-component
      [DESKTOP] 
      [TABLET] 
      [MOBILE]
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

        <!-- [ℹ] widget main top controls
        [DESKTOP]
        [TABLET]
        -->
        {#if !mobileExclusive}

          <!-- [ℹ] widget main top controls 
          -->
          <div
            id="fixtures-odds-top-container"
            class="row-space-out m-b-15">

            <div
              class="row-space-start">

              <!-- [ℹ] widget top selection fixtures odds views [DESKTOP]
              -->
              <div
                id="fix-odds-view-box"
                class="row-space-start m-r-20">

                <div
                  class="fix-odds-view-opt-box cursor-pointer"
                  on:click={() => selectTableView('matches')}
                  class:activeOpt={selectedOpt == 'matches'}>
                  <p
                    class="s-14 w-500 color-grey">
                    {FIXTURES_ODDS_T?.matches}
                  </p>
                </div>

                <div
                  class="fix-odds-view-opt-box cursor-pointer"
                  on:click={() => selectTableView('odds')}
                  class:activeOpt={selectedOpt == 'odds'}>
                  <p
                    class="s-14 w-500 color-grey">
                    {FIXTURES_ODDS_T?.odds}
                  </p>
                </div>

              </div>

              <!-- [ℹ] dropdown season select
              -->
              <div
                id='dropdown-seasons'
                class="m-r-16">
                
                <div
                  class="row-space-start"
                  on:click={() => toggleDropdown = !toggleDropdown}>
                  <!-- [ℹ] display selected week / round
                  -->
                  <p
                    class='s-14 m-r-5 w-500 color-grey'>
                    {#if optView === "week"}
                      {FIXTURES_ODDS_T?.week} {week_name}
                    {:else}
                      {FIXTURES_ODDS_T?.round} {week_name}
                    {/if}
                  </p>
                  <!-- [ℹ] arrow down [hidden-menu] 
                  -->
                  {#if !toggleDropdown}
                    <img 
                      src={arrow_down} 
                      alt="arrow_down" 
                      width="16px" height="16px" 
                    />
                  {:else}
                    <img 
                      src={arrow_up} 
                      alt="arrow_up" 
                      width="16px" height="16px" 
                    />
                  {/if}
                </div>
                
                <!-- [ℹ] show-dropdown
                -->
                {#if toggleDropdown}
                  <div
                    id="dropdown-list-main-container">
                    <div
                      id="dropdown-list-inner-container">
                      {#if optView === "week"}
                        {#each {length: weeks_total} as _,i}
                          <p
                            class='s-14 w-500 row-season'
                            class:color-primary={i+1 === week_name}
                            on:click={() => selectFixtureOddsNumber(i+1)}>
                            {FIXTURES_ODDS_T?.week} {i+1}
                          </p>
                        {/each}
                      {:else}
                        {#each {length: rounds_total} as _,i}
                          <p
                            class='s-14 w-500 row-season'
                            class:color-primary={i+1 === week_name}
                            on:click={() => selectFixtureOddsNumber(i+1)}>
                            {FIXTURES_ODDS_T?.round} {i+1}
                          </p>
                        {/each}
                      {/if}
                    </div>
                  </div>
                {/if}

              </div>

            </div>

            <!-- [ℹ] widget rounds / weeks selection 
            -->
            <div
              id="widget-round-week-select"
              class="row-space-start">
              <div
                on:click={() => selectedRoundsWeeksView("round")}
                class="row-space-start m-r-16">
                <input 
                  type="radio" 
                  name="matches-odds-select" 
                  bind:group={optView}
                  id=""
                  class="m-r-8"
                  value={"round"}
                />
                <p
                  class="s-14 w-500 color-grey"
                  class:color-primary={optView === "round"}>
                  {FIXTURES_ODDS_T?.round}
                </p>
              </div>
              <div
                on:click={() => selectedRoundsWeeksView("week")}
                class="row-space-start">
                <input 
                  type="radio" 
                  name="matches-odds-select"
                  bind:group={optView}
                  id=""
                  class="m-r-8"
                  value={"week"}
                />
                <p
                  class="s-14 w-500 color-grey"
                  class:color-primary={optView === "week"}>
                  {FIXTURES_ODDS_T?.week}
                </p>
              </div>
            </div>

          </div>

        <!-- [ℹ] widget main top controls
        [MOBILE]
        -->
        {:else}

          <!-- [ℹ] widget top selection fixtures odds views [MOBILE]
          -->
          <div
            id="fix-odds-view-box"
            class="row-space-start m-b-16">

            <div
              class="fix-odds-view-opt-box cursor-pointer"
              on:click={() => selectTableView('matches')}
              class:activeOpt={selectedOpt == 'matches'}>
              <p
                class="s-14 w-500 color-grey">
                {FIXTURES_ODDS_T?.matches}
              </p>
            </div>

            <div
              class="fix-odds-view-opt-box cursor-pointer"
              on:click={() => selectTableView('odds')}
              class:activeOpt={selectedOpt == 'odds'}>
              <p
                class="s-14 w-500 color-grey">
                {FIXTURES_ODDS_T?.odds}
              </p>
            </div>

          </div>

          <div
            id="mobile-middle-control-row"
            class="row-space-out m-b-20">
            
            <!-- [ℹ] dropdown season select
            -->
            <div
              id='dropdown-seasons'
              class="m-r-16">
              
              <div
                class="row-space-start"
                on:click={() => toggleDropdown = !toggleDropdown}>
                <!-- [ℹ] display selected week / round
                -->
                <p
                  class='s-14 m-r-5 w-500 color-grey'>
                  {#if optView === "week"}
                    {FIXTURES_ODDS_T?.week} {week_name}
                  {:else}
                    {FIXTURES_ODDS_T?.round} {week_name}
                  {/if}
                </p>
                <!-- [ℹ] arrow down [hidden-menu] 
                -->
                {#if !toggleDropdown}
                  <img 
                    src={arrow_down} 
                    alt="arrow_down" 
                    width="16px" height="16px" 
                  />
                {:else}
                  <img 
                    src={arrow_up} 
                    alt="arrow_up" 
                    width="16px" height="16px" 
                  />
                {/if}
              </div>
              
              <!-- [ℹ] show-dropdown
              -->
              {#if toggleDropdown}
                <div
                  id="dropdown-list-main-container">
                  <div
                    id="dropdown-list-inner-container">
                    {#if optView === "week"}
                      {#each {length: weeks_total} as _,i}
                        <p
                          class='s-14 w-500 row-season'
                          class:color-primary={i+1 === week_name}
                          on:click={() => selectFixtureOddsNumber(i+1)}>
                          {FIXTURES_ODDS_T?.week} {i+1}
                        </p>
                      {/each}
                    {:else}
                      {#each {length: rounds_total} as _,i}
                        <p
                          class='s-14 w-500 row-season'
                          class:color-primary={i+1 === week_name}
                          on:click={() => selectFixtureOddsNumber(i+1)}>
                          {FIXTURES_ODDS_T?.round} {i+1}
                        </p>
                      {/each}
                    {/if}
                  </div>
                </div>
              {/if}

            </div>

            <!-- [ℹ] widget rounds / weeks selection 
            -->
            <div
              id="widget-round-week-select"
              class="row-space-start">
              <div
                on:click={() => selectedRoundsWeeksView("round")}
                class="row-space-start m-r-16">
                <input 
                  type="radio" 
                  name="matches-odds-select" 
                  bind:group={optView}
                  id=""
                  class="m-r-8"
                  value={"round"}
                />
                {FIXTURES_ODDS_T?.round}
              </div>
              <div
                on:click={() => selectedRoundsWeeksView("week")}
                class="row-space-start">
                <input 
                  type="radio" 
                  name="matches-odds-select"
                  bind:group={optView}
                  id=""
                  class="m-r-8"
                  value={"week"}
                />
                {FIXTURES_ODDS_T?.week}
              </div>
            </div>

          </div>

        {/if}

        <!-- [ℹ] widget round / week toggle increment / decrese view 
        -->
        <div
          id="mobile-table-box"
          class="row-space-out m-b-12">

          <button
            id="left-btn"
            class="table-nav-btn"
            aria-label="selectedOptionTableMobile"
            disabled={week_name == 1}
            on:click={() => selectFixtureOddsNumber(week_name - 1)}
            >
          </button>

          <div
            class="text-center">
            <p
              class="s-16 w-500 color-black">
              {#if optView === "week"}
                {FIXTURES_ODDS_T?.week} {week_name}
              {:else}
                {FIXTURES_ODDS_T?.round} {week_name}
              {/if}
            </p>
            <p
              class="s-12 color-grey">
              {week_start.getDate()}
              {FIXTURES_ODDS_T?.months_abbreviation[monthNames[week_start.getMonth()]]}
              -
              {week_end.getDate()}
              {FIXTURES_ODDS_T?.months_abbreviation[monthNames[week_end.getMonth()]]}
            </p>
          </div>

          <button
            id="right-btn"
            class="table-nav-btn"
            aria-label="selectedOptionTableMobile"
            disabled={week_name == weeks_total}
            on:click={() => selectFixtureOddsNumber(week_name + 1)}
            >
          </button>

        </div>
        
        <!-- [ℹ] generated data fixtures
         -->
        {#each fixtures_arr_filter as item}
          <div>

            <!-- [ℹ] grouping date fixtures
            -->
            <p
              class="color-grey w-500 s-12 group-fixture-date m-b-8"> 
              {new Date(item?.date).getDate()} 
              {FIXTURES_ODDS_T.months_abbreviation[monthNames[new Date(item?.date).getMonth()]]}, 
              {FIXTURES_ODDS_T[weekDays[new Date(item?.date).getDay()]]}
            </p>

            <!-- [ℹ] matches loop population 
            -->
            {#each item?.fixtures as fixture}
              <div
                class="fixture-row row-space-out">

                <!-- [ℹ] fixture left-side container 
                -->
                <div
                  class="row-space-start">

                  <!-- [ℹ] fixture-time
                  -->
                  <div
                    class="m-r-16 fixture-time-box text-center">
                    {#if 
                      fixture?.status === "LIVE"}
                      <p
                        style="color: #FF3C3C;"
                        class="s-14 no-wrap">
                        {fixture?.minute}
                        <span
                          class:visibility-none={tickSecShow}>'
                        </span>
                      </p>
                    {:else if fixture?.status === "HT"}
                      <p
                        class="no-wrap s-14 color-black">
                        Ht
                      </p>
                    {:else}
                      <p
                        class="no-wrap s-14 color-black"
                        class:color-grey={fixture?.status === "FT"}>
                        {
                          (
                            new Date(fixture?.fixture_time).getHours() +
                            ":" +
                            ('0' + new Date(fixture?.fixture_time).getMinutes()).slice(-2)
                          ).split(' ').join('')
                        }
                      </p>
                      {#if fixture?.status === "FT"}
                        <p
                          class="no-wrap s-14 color-grey">
                          FT
                        </p>
                      {/if}
                    {/if}
                  </div>

                  <!-- [ℹ] fixture-teams
                  -->
                  {#if 
                    fixture?.fixture_link && 
                    fixture?.fixture_link[server_side_language]}
                    <a 
                      rel="nofollow"
                      href={fixture?.fixture_link[server_side_language]}
                      target="_blank"
                      style="width: inherit;">
                      <div
                        class="column-start-grid-start fixture-teams-box">

                        <div
                          class="row-space-start">
                          <p
                            class="s-14 color-black w-500 m-r-8"
                            class:color-grey={fixture?.teams?.away?.score < fixture?.teams?.home?.score}>
                            {fixture?.teams?.away?.name}
                          </p>
                          {#if fixture?.teams?.away?.red_cards}
                            {#if fixture?.teams?.away?.red_cards == 1}
                              <img 
                                src={one_red_card} 
                                alt=""
                                width=12px height=16px
                              />
                            {:else if fixture?.teams?.away?.red_cards == 2}
                              <img 
                                src={two_red_card} 
                                alt=""
                                width=15px height=19px
                              />
                            {:else}
                              <img 
                                src={three_red_card} 
                                alt=""
                                width=18px height=22px
                              />
                            {/if}
                          
                          {/if}
                        </div>

                        <div
                          class="row-space-start">
                          <p  
                            class="s-14 color-black w-500 m-r-8"
                            class:color-grey={fixture?.teams?.home?.score < fixture?.teams?.away?.score}>
                            {fixture?.teams?.home?.name}
                          </p>
                          {#if fixture?.teams?.home?.red_cards}
                            {#if fixture?.teams?.home?.red_cards == 1}
                              <img 
                                src={one_red_card} 
                                alt=""
                                width=12px height=16px
                              />
                            {:else if fixture?.teams?.home?.red_cards == 2}
                              <img 
                                src={two_red_card} 
                                alt=""
                                width=15px height=19px
                              />
                            {:else}
                              <img 
                                src={three_red_card} 
                                alt=""
                                width=18px height=22px
                              />
                            {/if}
                          {/if}
                        </div>

                      </div>
                    </a>
                  {:else}
                    <div
                      class="column-start-grid-start fixture-teams-box">

                      <div
                        class="row-space-start">
                        <p
                          class="s-14 color-black w-500 m-r-8"
                          class:color-grey={fixture?.teams?.away?.score < fixture?.teams?.home?.score}>
                          {fixture?.teams?.away?.name}
                        </p>
                        {#if fixture?.teams?.away?.red_cards}
                          {#if fixture?.teams?.away?.red_cards == 1}
                            <img 
                              src={one_red_card} 
                              alt=""
                              width=12px height=16px
                            />
                          {:else if fixture?.teams?.away?.red_cards == 2}
                            <img 
                              src={two_red_card} 
                              alt=""
                              width=15px height=19px
                            />
                          {:else}
                            <img 
                              src={three_red_card} 
                              alt=""
                              width=18px height=22px
                            />
                          {/if}
                        
                        {/if}
                      </div>

                      <div
                        class="row-space-start">
                        <p  
                          class="s-14 color-black w-500 m-r-8"
                          class:color-grey={fixture?.teams?.home?.score < fixture?.teams?.away?.score}>
                          {fixture?.teams?.home?.name}
                        </p>
                        {#if fixture?.teams?.home?.red_cards}
                          {#if fixture?.teams?.home?.red_cards == 1}
                            <img 
                              src={one_red_card} 
                              alt=""
                              width=12px height=16px
                            />
                          {:else if fixture?.teams?.home?.red_cards == 2}
                            <img 
                              src={two_red_card} 
                              alt=""
                              width=15px height=19px
                            />
                          {:else}
                            <img 
                              src={three_red_card} 
                              alt=""
                              width=18px height=22px
                            />
                          {/if}
                        {/if}
                      </div>

                    </div>
                  {/if}

                </div>

                <!-- [ℹ] fixture right-side container 
                -->
                <div
                  class="row-space-end"
                  style="width: auto;">

                  <!-- [ℹ] fixture-link / media-link 
                  -->
                  {#if 
                    fixture?.fixture_link && 
                    fixture?.fixture_link[server_side_language]}
                    <a 
                      rel="nofollow"
                      href={fixture?.fixture_link[server_side_language]}
                      target="_blank"
                      style="width: inherit;">
                      <div
                        class="media-play-btn m-r-16">
                        {#if $userBetarenaSettings.theme == 'Dark'}
                          <img 
                            src={play_dark}
                            alt=""
                            width=14px height=14px
                          />
                        {:else}
                          <img 
                            src={play}
                            alt=""
                            width=14px height=14px
                          />
                        {/if}
                      </div>
                    </a>
                  {/if}

                  <!-- [ℹ] tip-link 
                  -->
                  {#if 
                    fixture?.tip_link && 
                    fixture?.tip_link[server_side_language]}
                    <a 
                      rel="nofollow"
                      href={fixture?.tip_link[server_side_language]}
                      target="_blank"
                      style="width: inherit;">
                      <div
                        class="tip-box m-r-16">
                        <p
                          class="s-12 color-black">
                          {FIXTURES_ODDS_T?.tip}
                        </p>
                      </div>
                    </a>
                  {/if}

                  <!-- [ℹ] bet-site 
                  -->
                  {#if data}
                    <a 
                      rel="nofollow"
                      aria-label="betting_site_logo_football_fixtures_odds_tournament"
                      on:click={() => triggerGoggleEvents("betting_site_logo_football_fixtures_odds_tournament")}
                      href={data.register_link}
                      target="_blank"
                      style="width: inherit;">
                      <img 
                        id='sportbook-logo-img'
                        src={data.image}
                        alt={data.title}
                      />
                    </a>
                  {/if}

                  <!-- [ℹ] scores 
                  -->
                  {#if
                    (fixture?.teams?.away?.score && fixture?.teams?.home?.score) ||
                    fixture?.status === "LIVE" ||
                    fixture?.status === "HT"}
                    <div
                      class="column-space-center m-l-24">
                      <p
                        class="s-14 w-500 color-black"
                        class:color-red-bright={fixture?.status === "LIVE"}
                        class:color-grey={fixture?.teams?.away?.score < fixture?.teams?.home?.score}
                        >
                        {fixture?.teams?.away?.score}
                      </p>
                      <p 
                        class="s-14 w-500 color-black"
                        class:color-red-bright={fixture?.status === "LIVE"}
                        class:color-grey={fixture?.teams?.home?.score < fixture?.teams?.away?.score}
                        >
                        {fixture?.teams?.home?.score}
                      </p>
                    </div>
                  {/if}
                  
                </div>

              </div>
            {/each}
          </div>
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

  div#fix-odds-view-box {
    padding: 20px;
    padding-bottom: 0;
    width: -webkit-fill-available;
  } div.fix-odds-view-opt-box {
    border: 1px solid #CCCCCC;
    padding: 10px 30px;
    width: inherit;
    text-align: center;
  } div.fix-odds-view-opt-box.activeOpt {
    border: 1px solid #F5620F;
  } div.fix-odds-view-opt-box.activeOpt p{
    color: #F5620F !important;
  } div.fix-odds-view-opt-box:hover p {
    color: #292929 !important;
  } div.fix-odds-view-opt-box:first-child {
    border-radius: 8px 0px 0px 8px;
  } div.fix-odds-view-opt-box:last-child {
    border-radius: 0px 8px 8px 0px;
  }

  div#mobile-middle-control-row {
    padding: 0 20px;
  }

  div#widget-round-week-select {
    width: fit-content;
  } div#widget-round-week-select input[type="radio"] {
    width: 1.3em;
    height: 1.3em;
    background-color: white;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 1px #CCCCCC;
    -webkit-appearance: none;
    cursor: pointer;
  } div#widget-round-week-select input[type="radio"]:checked {
    background-color: #F5620F;
    box-shadow: 0 0 0 1px #F5620F;
  }

  div#dropdown-seasons {
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    width: 98px;
  } div#dropdown-seasons:hover p {
    color: black;
  } div#dropdown-seasons div#dropdown-list-main-container {
    position: absolute;
    top: 115%;
    width: 100%;
    /* background-color: #F2F2F2; */
    background-color: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    z-index: 10000;
    /* height: 308px; */
    max-height: 308px;
    overflow-y: scroll;
    padding-right: 6px;
    right: 0;
  } div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar  {
    /* Hide scrollbar for Chrome, Safari and Opera */
    display: none;
  } div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar  {
    /* Hide scrollbar for IE, Edge and Firefox */ 
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container {
    /* height: 308px; */
    max-height: 308px;
    overflow-y: scroll;
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season {
    padding: 11px 20px;
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season:hover {
    cursor: pointer;
    color: #f5620f !important;
  }

  /* width */
  div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar {
    width: 4px;
  }
  /* track */
  div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track {
    background: #F2F2F2;
    border-radius: 12px;
    margin: 8px;
  }
  /* handle */
  div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb {
    background: #CCCCCC;
    border-radius: 12px;
  }

  button#left-btn {
    width: 32px;
    height: 32px;
    background-image: url("./assets/slider-left.svg");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  } button#left-btn:hover {
    background-image: url("./assets/slider-left-hover.svg");
  }

  button#right-btn {
    width: 32px;
    height: 32px;
    background-image: url("./assets/slider-right.svg");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  } button#right-btn:hover {
    background-image: url("./assets/slider-right-hover.svg");
  }

  div#mobile-table-box {
    padding: 12px;
    background: #F2F2F2;
    border-radius: 48px;
    margin: 0 20px 12px 20px;
    width: auto;
  } div#mobile-table-box button.table-nav-btn {
    border-radius: 50%;
    background-color: #4B4B4B;
    width: 32px;
    height: 32px;
    padding: 6px;
  } div#mobile-table-box button.table-nav-btn:disabled {
    opacity: 0.2;
  }

  p.group-fixture-date {
    background: #F2F2F2;
    padding: 7px 20px;
  }

  div.fixture-row {
    padding: 5px 20px;
  }

  div.fixture-time-box {
    width: 47px;
  }

  div.fixture-teams-box {
    border-left: 1px #E6E6E6 solid;
    padding-left: 16px;
  }

  div.media-play-btn {
    display: flex;
    padding: 9px;
    border: 1px solid #CCCCCC;
    border-radius: 50%;
  }

  div.tip-box {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #CCCCCC;
  }

  img#sportbook-logo-img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    border-radius: 8px;
    object-position: left;
  }

  span.visibility-none {
    visibility: hidden;
  }

  div#widget-outer {
    /* margin-top: 24px; */
  }

  div#fixtures-odds-widget-container.widget-no-data-height {
    height: 832px;
  }

  #fixtures-odds-widget-container {
    padding: 0;
    padding-bottom: 16px;
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

    div#fixtures-odds-top-container {
      padding: 20px;
      padding-bottom: 0;
    }
    
    div#fix-odds-view-box {
      width: auto;
      padding: 0;
    } div.fix-odds-view-opt-box {
      width: auto;
      text-align: center;
    }

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

  .dark-background-1 div#mobile-table-box {
    background: #616161;
  } .dark-background-1 div#mobile-table-box button#left-btn {
    background-image: url("./assets/slider-left-dark.svg");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  } .dark-background-1 div#mobile-table-box button#left-btn:hover {
    background-image: url("./assets/slider-left-hover.svg");
  } .dark-background-1 div#mobile-table-box button#right-btn {
    background-image: url("./assets/slider-right-dark.svg");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  } .dark-background-1 div#mobile-table-box button#right-btn:hover {
    background-image: url("./assets/slider-right-hover.svg");
  } .dark-background-1 div#mobile-table-box button.table-nav-btn {
    background: #A8A8A8;
  } .dark-background-1 div#mobile-table-box p {
    color: white;
  }

  .dark-background-1 div#dropdown-seasons div#dropdown-list-main-container {
    /* dark theme/dark-gray */
    background: #616161;
    /* shadow/black */
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
    border-radius: 4px;
  }
  .dark-background-1  div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season  {
    color: #ffffff;
  }

  /* handle */
  .dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb {
    background: #999999 !important;
  }
  /* track */
  .dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track {
    background: #4B4B4B !important;
  }

  .dark-background-1 p.group-fixture-date {
    background: #616161 !important;
  }

  .dark-background-1 p.color-black {
    color: white;
  }

</style>
