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
	Fixture_Player,
    REDIS_CACHE_SINGLE_lineups_data, 
    REDIS_CACHE_SINGLE_lineups_translation 
  } from "$lib/models/fixtures/lineups/types";

	import type { 
    FIREBASE_livescores_now 
  } from "$lib/models/firebase";

	import type {
    REDIS_CACHE_SINGLE_fixtures_page_info_response 
  } from "$lib/models/_main_/pages_and_seo/types";

	import type { 
    EventsDatum 
  } from "$lib/models/hasura";

	// import ScoreboardLoader from "./Scoreboard_Loader.svelte";
	import LineupsLoader from "./Lineups_Loader.svelte";
	import LineupVectorMobile from "./Lineup_Vector_Mobile.svelte";
	import LineupVectorMobileAway from "./Lineup_Vector_Mobile_Away.svelte";
	import LineupVectorTablet from "./Lineup_Vector_Tablet.svelte";
	import LineupPlayerRow from "./Lineup_Player_Row.svelte";
	import LineupPlayerVisual from "./Lineup_Player_Visual.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // export let FIXTURE_INFO:                 REDIS_CACHE_SINGLE_fixtures_page_info_response;
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

  let home_team_formation_map = new Map <string, Fixture_Player[]>()
  let away_team_formation_map = new Map <string, Fixture_Player[]>()

  // NOTE: [Sportmonks]
  // NOTE: Formation Number | Outcome
  // 1 - Keeper [G]
  // 2 - Right-back [D]
  // 3 - Central defender [D]
  // 4 - Central defender [D]
  // 5 - Left-back [D]
  // 6 - Right central midfielder [M]
  // 7 - Central midfielder [M]
  // 8 - Left central midfielder [M]
  // 9 - Right-winger [A]
  // 10 - Central forward [A]
  // 11 - Left-winger [A]

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

  // ~~~~~~~~~~~~~~~~~~~~~
  // [ADD-ON] FIREBASE
  // ~~~~~~~~~~~~~~~~~~~~~

  let real_time_unsubscribe: Unsubscribe[] = []
  const live_fixtures_map = new Map<number, FIREBASE_livescores_now>();

  async function check_live_fixtures (
    data: [string, FIREBASE_livescores_now][]
  ) {
    // [🐞]
    const logs_name = dev_console_tag + " check_live_fixtures";
    const logs: string[] = []
    logs.push(`checking livescores_now`)

    // [ℹ] generate FIREBASE fixtures-map
    for (const live_fixture of data) {
      const fixture_id = parseInt(live_fixture[0].toString())
      const fixture_data = live_fixture[1]
      live_fixtures_map.set(fixture_id, fixture_data)
    }

    // [ℹ] validate against [this] fixture_id
    const fixture_id = FIXTURE_LINEUPS?.id;

    if (live_fixtures_map.has(fixture_id)) {
      // [🐞]
      logs.push(`fixture ${fixture_id} livescore_now exists!`) 
      // [ℹ] update fixture data;
      FIXTURE_LINEUPS.status = live_fixtures_map.get(fixture_id)?.time?.status
      // FIXME: make compatible TYPES for hasura/events && firebase/events
      FIXTURE_LINEUPS.events = live_fixtures_map.get(fixture_id)?.events?.data
      // [ℹ] update fixture-target lineup
      // [ℹ] with appropiate events HOME && AWAY
      for (const player of FIXTURE_LINEUPS.home.lineup) {
        // [ℹ] reset player events
        player.events = {
          injured: false,
          yeallow_card: null,
          red_card: null,
          goals: null,
          substitution: null
        }
        if (FIXTURE_LINEUPS.events == undefined) {
          continue;
        }
        for (const live_event of FIXTURE_LINEUPS.events) {
          if (player.player_id == live_event.player_id) {
            if (player.player_id == live_event.player_id) {
              if (live_event.type == 'yellowcard') {
                player.events.yeallow_card =
                  player.events.yeallow_card == null
                    ? 1
                    : player.events.yeallow_card + 1
                ;
              }
              if (live_event.type == 'redcard') {
                player.events.yeallow_card = 1;
              }
              if (live_event.type == 'goal' || live_event.type == 'own-goal') {
                player.events.goals =
                  player.events.goals == null
                    ? 1
                    : player.events.goals + 1
                ;
              }
            }
          }
          if (player.player_id == live_event.related_player_id) {
            if (live_event.type == 'substitution') {
              player.events.substitution = live_event;
            }
            if (live_event.injuried) {
              player.events.injured = true;
            }
          }
        }
      }
      for (const player of FIXTURE_LINEUPS.away.lineup) {
        // [ℹ] reset player events
        player.events = {
          injured: false,
          yeallow_card: null,
          red_card: null,
          goals: null,
          substitution: null
        }
        if (FIXTURE_LINEUPS.events == undefined) {
          continue;
        }
        for (const live_event of FIXTURE_LINEUPS.events) {
          if (player.player_id == live_event.player_id) {
            if (live_event.type == 'yellowcard') {
              player.events.yeallow_card =
                player.events.yeallow_card == null
                  ? 1
                  : player.events.yeallow_card + 1
              ;
            }
            if (live_event.type == 'redcard') {
              player.events.yeallow_card = 1;
            }
            if (live_event.type == 'goal' || live_event.type == 'own-goal') {
              player.events.goals =
                player.events.goals == null
                  ? 1
                  : player.events.goals + 1
              ;
            }
          }
          if (player.player_id == live_event.related_player_id) {
            if (live_event.type == 'substitution') {
              player.events.substitution = live_event;
            }
            if (live_event.injuried) {
              player.events.injured = true;
            }
          }
        }
      }
      // [ℹ] update fixture-target bench
      // [ℹ] with appropiate events HOME && AWAY
      for (const player of FIXTURE_LINEUPS.home.bench) {
        // [ℹ] reset player events
        player.events = {
          injured: false,
          yeallow_card: null,
          red_card: null,
          goals: null,
          substitution: null
        }
        if (FIXTURE_LINEUPS.events == undefined) {
          continue;
        }
        for (const live_event of FIXTURE_LINEUPS.events) {
          if (player.player_id == live_event.player_id) {
            if (player.player_id == live_event.player_id) {
              if (live_event.type == 'substitution') {
                player.events.substitution = live_event;
              }
              if (live_event.type == 'yellowcard') {
                player.events.yeallow_card =
                  player.events.yeallow_card == null
                    ? 1
                    : player.events.yeallow_card + 1
                ;
              }
              if (live_event.type == 'redcard') {
                player.events.yeallow_card = 1;
              }
              if (live_event.type == 'goal' || live_event.type == 'own-goal') {
                player.events.goals =
                  player.events.goals == null
                    ? 1
                    : player.events.goals + 1
                ;
              }
            }
          }
          if (player.player_id == live_event.related_player_id) {
            if (live_event.injuried) {
              player.events.injured = true;
            }
          }
        }
      }
      for (const player of FIXTURE_LINEUPS.away.bench) {
        // [ℹ] reset player events
        player.events = {
          injured: false,
          yeallow_card: null,
          red_card: null,
          goals: null,
          substitution: null
        }
        if (FIXTURE_LINEUPS.events == undefined) {
          continue;
        }
        for (const live_event of FIXTURE_LINEUPS.events) {
          if (player.player_id == live_event.player_id) {
            if (live_event.type == 'substitution') {
              player.events.substitution = live_event;
            }
            if (live_event.type == 'yellowcard') {
              player.events.yeallow_card =
                player.events.yeallow_card == null
                  ? 1
                  : player.events.yeallow_card + 1
              ;
            }
            if (live_event.type == 'redcard') {
              player.events.yeallow_card = 1;
            }
            if (live_event.type == 'goal' || live_event.type == 'own-goal') {
              player.events.goals =
                player.events.goals == null
                  ? 1
                  : player.events.goals + 1
              ;
            }
          }
          if (player.player_id == live_event.related_player_id) {

            if (live_event.injuried) {
              player.events.injured = true;
            }
          }
        }
      }

      // [ℹ] reactiveity on-set main
      FIXTURE_LINEUPS = FIXTURE_LINEUPS
    }

    // TODO: lazy_load_data_check = true

    // [🐞]
    if (dev) log_info_group(logs_name, logs)
  }

	async function listen_real_time_livescores_now (
  ): Promise < void > {

    const fixture_status = FIXTURE_LINEUPS?.status;
    if (fixture_status == 'FT') {
      return
    }

    // [🐞]
    if (dev) console.log("%cTriggered livescore_now listen", 'background: green; color: #fffff');

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

  // [ℹ] one-off real-time "read" init.
  onMount(async() => {
    const firebase_real_time = await get_livescores_now()
    if (firebase_real_time != null) {
      const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
      check_live_fixtures(data)
    }
  })
  
  // [ℹ] real-time listen-events init.
  onMount(async() => {
    listen_real_time_livescores_now();
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
        listen_real_time_livescores_now()
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

  // FIXME:
  // async function kickstart_one_off_data (
  // ) {
  //   const firebase_real_time = await get_livescores_now()
  //   if (firebase_real_time != null) {
  //     const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
  //     check_live_fixtures(data)
  //   }
  // }

  // $: if (FIXTURE_LINEUPS != undefined) {
  //   kickstart_one_off_data()
  // }

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (
    FIXTURE_LINEUPS
    && browser 
    && FIXTURE_LINEUPS?.away?.formation == undefined
    && FIXTURE_LINEUPS?.home?.formation == undefined
    && (FIXTURE_LINEUPS?.away?.lineup == undefined || FIXTURE_LINEUPS?.away?.lineup.length == 0)
    && (FIXTURE_LINEUPS?.home?.lineup == undefined || FIXTURE_LINEUPS?.home?.lineup.length == 0)
  ) {
    no_widget_data = true
    loaded = true
  } else {
    no_widget_data = false
  }

  $: if (
    FIXTURE_LINEUPS
    && browser 
    && FIXTURE_LINEUPS?.away?.formation
    && FIXTURE_LINEUPS?.home?.formation
    && (FIXTURE_LINEUPS?.away?.lineup != undefined || FIXTURE_LINEUPS?.away?.lineup.length != 0)
    && (FIXTURE_LINEUPS?.home?.lineup != undefined || FIXTURE_LINEUPS?.home?.lineup.length != 0)
  ) {
    // NOTE: home-team
    let rt_home_count = 0
    let count_pos_diff = 0;
    let home_team_formation_arr_temp = FIXTURE_LINEUPS?.home?.formation.split('-')
    home_team_formation_arr_temp.unshift('1'); // [ℹ] add goalkeeper pos
    home_team_formation_map = new Map <string, Fixture_Player[]>() // [ℹ] reset player-list
    for (const form_pos of home_team_formation_arr_temp) {
      let form_pos_num = parseInt(form_pos)
      let form_pos_code = form_pos + count_pos_diff.toString()
      for (let i = rt_home_count; i < (rt_home_count + form_pos_num); i++) {
        const player = FIXTURE_LINEUPS?.home?.lineup[i];
        if (home_team_formation_map.has(form_pos_code)) {
          let exist_lineup_list = home_team_formation_map.get(form_pos_code)
          exist_lineup_list.push(player)
          home_team_formation_map.set(form_pos_code, exist_lineup_list)
        }
        else {
          const lineup_list = []
          lineup_list.push(player)
          home_team_formation_map.set(form_pos_code, lineup_list)
        }
      }
      count_pos_diff++;
      rt_home_count = rt_home_count + form_pos_num;
    }
    home_team_formation_map = home_team_formation_map
    // NOTE: away-team
    rt_home_count = 0
    count_pos_diff = 0;
    let away_team_formation_arr_temp = FIXTURE_LINEUPS?.away?.formation.split('-')
    away_team_formation_arr_temp.unshift('1'); // [ℹ] add goalkeeper pos
    away_team_formation_arr_temp.reverse();
    FIXTURE_LINEUPS?.away?.lineup.sort((a, b) => parseFloat(b.formation_position.toString()) - parseFloat(a.formation_position.toString()));
    away_team_formation_map = new Map <string, Fixture_Player[]>() // [ℹ] reset player-list
    for (const form_pos of away_team_formation_arr_temp) {
      let form_pos_num = parseInt(form_pos)
      let form_pos_code = form_pos + count_pos_diff.toString()
      for (let i = rt_home_count; i < (rt_home_count + form_pos_num); i++) {
        const player = FIXTURE_LINEUPS?.away?.lineup[i];
        if (away_team_formation_map.has(form_pos_code)) {
          let exist_lineup_list = away_team_formation_map.get(form_pos_code)
          exist_lineup_list.push(player)
          away_team_formation_map.set(form_pos_code, exist_lineup_list)
        }
        else {
          const lineup_list = []
          lineup_list.push(player)
          away_team_formation_map.set(form_pos_code, lineup_list)
        }
      }
      count_pos_diff++;
      rt_home_count = rt_home_count + form_pos_num;
    }
    away_team_formation_map = away_team_formation_map
  }
  // [ℹ] only-lineup available
  else if (
    FIXTURE_LINEUPS
    && browser 
    && (FIXTURE_LINEUPS?.away?.lineup != undefined || FIXTURE_LINEUPS?.away?.lineup.length != 0)
    && (FIXTURE_LINEUPS?.home?.lineup != undefined || FIXTURE_LINEUPS?.home?.lineup.length != 0)
  ) {
    // NOTE: home-team
    home_team_formation_map = new Map <string, Fixture_Player[]>() // [ℹ] reset player-list
    for (const form_pos of formation_pos_arr) {
      for (const player of FIXTURE_LINEUPS?.home?.lineup) {
        if (form_pos == player?.position) {
          if (home_team_formation_map.has(form_pos)) {
            let exist_lineup_list = home_team_formation_map.get(form_pos)
            exist_lineup_list.push(player)
            home_team_formation_map.set(form_pos, exist_lineup_list)
          }
          else {
            const lineup_list = []
            lineup_list.push(player)
            home_team_formation_map.set(form_pos, lineup_list)
          }
        }
      }
    }
    home_team_formation_map = home_team_formation_map
    // NOTE: away-team
    away_team_formation_map = new Map <string, Fixture_Player[]>() // [ℹ] reset player-list
    for (const form_pos of formation_pos_arr) {
      for (const player of FIXTURE_LINEUPS?.away?.lineup) {
        if (form_pos == player?.position) {
          if (away_team_formation_map.has(form_pos)) {
            let exist_lineup_list = away_team_formation_map.get(form_pos)
            exist_lineup_list.push(player)
            away_team_formation_map.set(form_pos, exist_lineup_list)
          }
          else {
            const lineup_list = []
            lineup_list.push(player)
            away_team_formation_map.set(form_pos, lineup_list)
          }
        }
      }
    }
    away_team_formation_map = away_team_formation_map
  }
  // [ℹ] no-lineups && no-formations
  else {
    no_widget_data = true
    loaded = true
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
      <!-- <h2>{FIXTURE_LINEUPS_TRANSLATION?.title}</h2> -->
      <!--
      [ℹ] home-team 
      [ℹ] home full team (lineup) + (bench) -->
      <p>{FIXTURE_LINEUPS?.home?.team_name}</p>
      {#if FIXTURE_LINEUPS?.home?.lineup}
        {#each FIXTURE_LINEUPS?.home?.lineup as player}
          <p>{player?.player_name}</p>
        {/each}
      {/if}
      {#if FIXTURE_LINEUPS?.home?.bench}
        {#each FIXTURE_LINEUPS?.home?.bench as player}
          <p>{player?.player_name}</p>
        {/each}
      {/if}
      <!--
      [ℹ] away-team
      [ℹ] away full team (lineup) + (bench) -->
      <p>{FIXTURE_LINEUPS?.away?.team_name}</p>
      {#if FIXTURE_LINEUPS?.away?.lineup}
        {#each FIXTURE_LINEUPS?.away?.lineup as player}
          <p>{player?.player_name}</p>
        {/each}
      {/if}
      {#if FIXTURE_LINEUPS?.away?.bench}
        {#each FIXTURE_LINEUPS?.away?.bench as player}
          <p>{player?.player_name}</p>
        {/each}
      {/if}
    </div>
  <!-- {/if} -->

  <!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if
    no_widget_data && 
    loaded}

    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0px;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {FIXTURE_LINEUPS_TRANSLATION?.title}
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
        {#if mobileExclusive}
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
                  color-black-2
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
                  color-black-2
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
              {#if selected_view == 'home'}
                <LineupVectorMobile />
              {:else}
                <LineupVectorMobileAway />
              {/if}
            </div>
            <!-- 
            [ℹ] lineup - absolute box -->
            <div
              id="overlay-player-pos-box">
              <!-- 
              [ℹ] home -->
              {#if selected_view == 'home' && home_team_formation_map.size != 0}
                {#each Array.from(home_team_formation_map.values()) as players_list}
                  <div
                    id="overlay-column">
                    {#each Array.from(players_list) as player}
                      <LineupPlayerVisual PLAYER_INFO={player} STATUS={FIXTURE_LINEUPS?.status} />
                    {/each}
                  </div>
                {/each}
              <!-- 
              [ℹ] away -->
              {:else}
                {#each Array.from(away_team_formation_map.values()) as players_list}
                  <div
                    id="overlay-column">
                    {#each Array.from(players_list) as player}
                      <LineupPlayerVisual PLAYER_INFO={player} STATUS={FIXTURE_LINEUPS?.status} />
                    {/each}
                  </div>
                {/each}
              {/if}
            </div>
          </div>
          
          <!-- 
          [ℹ] selected lineup - home / away (logo) -->
          <div
            class="
              row-space-out
              team-main-select
            ">
            <div
              class="
                row-space-start
              ">
              <!-- 
              [ℹ] team icon -->
              <img 
                src={FIXTURE_LINEUPS[selected_view]?.team_logo} 
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
                  color-black-2
                ">
                {FIXTURE_LINEUPS[selected_view]?.team_name}
                <br/>
                <span
                  class="
                    w-400
                    color-grey
                  ">
                  {FIXTURE_LINEUPS[selected_view]?.formation || ""}
                </span>
              </p>
            </div>
            <!-- 
            [ℹ] team-rating -->
            {#if 
              FIXTURE_LINEUPS?.status == "FT"
              && FIXTURE_LINEUPS?.home?.team_rating != undefined}
              <p 
                id='box-goals'
                class="medium w-500"
                class:rating_golden={FIXTURE_LINEUPS?.home?.team_rating >= 9}
                class:rating_silver={FIXTURE_LINEUPS?.home?.team_rating >= 7}
                class:rating_bronze={FIXTURE_LINEUPS?.home?.team_rating >= 0}>
                {FIXTURE_LINEUPS?.home?.team_rating}
              </p>
            {/if}
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
                  color-black-2
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
            {#each FIXTURE_LINEUPS[selected_view].bench as player}
              <LineupPlayerRow TYPE="R" PLAYER_INFO={player} {FIXTURE_LINEUPS_TRANSLATION} STATUS={FIXTURE_LINEUPS?.status} />
            {/each}
          </div>
        <!-- 
        [ℹ] [TABLET] && [DESKTOP]
        [ℹ] drastic layout change
        -->
        {:else}
        
          <!-- 
          [ℹ] team visiualization -->
          <div
            id="lineup-vector-box">
            <div
              id="lineup-vector">
              <LineupVectorTablet />
            </div>
            <!-- 
            [ℹ] lineup - absolute box 
            [ℹ] home team 
            [ℹ] away team -->
            <div
              id="overlay-player-pos-box">
              <!-- 
              [ℹ] home -->
              {#each Array.from(home_team_formation_map.values()) as players_list}
                <div
                  id="overlay-column">
                  {#each Array.from(players_list) as player}
                    <LineupPlayerVisual PLAYER_INFO={player} STATUS={FIXTURE_LINEUPS?.status} />
                  {/each}
                </div>
              {/each}
              <!-- 
              [ℹ] empty-col -->
              <div id="overlay-column" />
              <div id="overlay-column" />
              <!-- 
              [ℹ] away -->
              {#each Array.from(away_team_formation_map.values()) as players_list}
                <div
                  id="overlay-column">
                  {#each Array.from(players_list) as player}
                    <LineupPlayerVisual PLAYER_INFO={player} STATUS={FIXTURE_LINEUPS?.status} />
                  {/each}
                </div>
              {/each}
            </div>
          </div>

          <!-- 
          [ℹ] team info ROW -->
          <div
            id="team-info-box"
            class="row-space-out">

            <!-- 
            [ℹ] home team info -->
            <div
              class="
                row-space-start
                team-main-select
              ">
              <!-- 
              [ℹ] team-info -->
              <div
                class="
                  row-space-start
                "
                style="width: auto;">
                <!-- 
                [ℹ] team icon -->
                <img 
                  src={FIXTURE_LINEUPS?.home?.team_logo} 
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
                    color-black-2
                    team-name
                  ">
                  {FIXTURE_LINEUPS?.home?.team_name}
                  <br/>
                  <span
                    class="
                      w-400
                      color-grey
                    ">
                    {FIXTURE_LINEUPS?.home?.formation || ""}
                  </span>
                </p>
              </div>
              <!-- 
              [ℹ] team-rating -->
              {#if 
                FIXTURE_LINEUPS?.status == "FT"
                && FIXTURE_LINEUPS?.home?.team_rating != undefined}
                <p 
                  id='box-goals'
                  class="medium w-500"
                  class:rating_golden={FIXTURE_LINEUPS?.home?.team_rating >= 9}
                  class:rating_silver={FIXTURE_LINEUPS?.home?.team_rating >= 7}
                  class:rating_bronze={FIXTURE_LINEUPS?.home?.team_rating >= 0}>
                  {FIXTURE_LINEUPS?.home?.team_rating}
                </p>
              {/if}
            </div>

            <!-- 
            [ℹ] away team info -->
            <div
              class="
                row-space-end
                team-main-select
              ">
              <!-- 
              [ℹ] team-rating -->
              {#if 
                FIXTURE_LINEUPS?.status == "FT"
                && FIXTURE_LINEUPS?.away?.team_rating != undefined}
                <p 
                  id='box-goals'
                  class="medium w-500"
                  class:rating_golden={FIXTURE_LINEUPS?.away?.team_rating >= 9}
                  class:rating_silver={FIXTURE_LINEUPS?.away?.team_rating >= 7}
                  class:rating_bronze={FIXTURE_LINEUPS?.away?.team_rating >= 0}>
                  {FIXTURE_LINEUPS?.away?.team_rating}
                </p>
              {/if}
              <!-- 
              [ℹ] team-info -->
              <div
                class="
                  row-space-end
                "
                style="width: auto;">
                <!-- 
                [ℹ] team name -->
                <p
                  class="
                    w-500
                    color-black-2
                    team-name
                  ">
                  {FIXTURE_LINEUPS?.away?.team_name}
                  <br/>
                  <span
                    class="
                      w-400
                      color-grey
                    ">
                    {FIXTURE_LINEUPS?.away?.formation || ""}
                  </span>
                </p>
                <!-- 
                [ℹ] team icon -->
                <img 
                  src={FIXTURE_LINEUPS?.away?.team_logo} 
                  alt=""
                  width=40px
                  height=40px
                  class="main-team-img"
                />
              </div>
            </div>
           
          </div>

          <!-- 
          [ℹ] team lineup ROW -->
          <div
            id="team-lineup-box"
            class="row-space-out">

            <!-- 
            [ℹ] home lineup -->
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
                [ℹ] coach avatar -->
                <img 
                  src={FIXTURE_LINEUPS.home?.coach_avatar} 
                  alt=""
                  width=40px
                  height=40px
                  class="lineup-img"
                />
                <!-- 
                [ℹ] coach name -->
                <p
                  class="
                    w-500
                    color-black-2
                    lineup-player-name
                  ">
                  {FIXTURE_LINEUPS.home?.coach_name}
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
              {#each FIXTURE_LINEUPS.home.bench as player}
                <LineupPlayerRow TYPE="R" PLAYER_INFO={player} {FIXTURE_LINEUPS_TRANSLATION} STATUS={FIXTURE_LINEUPS?.status} />
              {/each}
            </div>

            <!--
            [ℹ] divider -->
            <div id="divider" />

            <!-- 
            [ℹ] away lineup -->
            <div
              class="lineup-box">
              <!-- 
              [ℹ] coach single - home / away -->
              <div
                class="
                  row-space-end
                  player-row
                ">
                <!-- 
                [ℹ] coach name -->
                <p
                  class="
                    w-500
                    color-black-2
                    lineup-player-name
                  ">
                  {FIXTURE_LINEUPS?.away?.coach_name}
                  <br/>
                  <span
                    class="
                      w-400
                      color-grey
                    ">
                    {FIXTURE_LINEUPS_TRANSLATION['c']}
                  </span>
                </p>
                <!-- 
                [ℹ] player avatar -->
                <img 
                  src={FIXTURE_LINEUPS?.away?.coach_avatar} 
                  alt=""
                  width=40px
                  height=40px
                  class="lineup-img"
                />
              </div>
              <!-- 
              [ℹ] rest of lineup-team -->
              {#each FIXTURE_LINEUPS.away.bench as player}
                <LineupPlayerRow TYPE="L" PLAYER_INFO={player} {FIXTURE_LINEUPS_TRANSLATION} STATUS={FIXTURE_LINEUPS?.status} />
              {/each}
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

  /* lineups-main */
  #lineup-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: none;
    /* override */
    padding-bottom: 7px;
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
  } div#lineup-top-view-box-select button.team-select-btn p {
    font-size: 14px;
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
    grid-template-columns: repeat(auto-fit, minmax(fit-content, 1fr));
    grid-template-rows: 1fr;
    grid-auto-flow: column;
    align-items: center;
    align-content: center;
    /* dynamic */
    z-index: 1;
    position: relative;
    padding: 15px;
  } div#lineup-vector-box div#overlay-player-pos-box div#overlay-column {
    display: grid;
    gap: 8px;
  }

  /* main team select */
  div.team-main-select {
    padding: 15px 0;
    margin: 0 20px 8px 20px;
    border-bottom: 1px solid #E6E6E6;
    width: auto;
  } div.team-main-select img.main-team-img {
    /* dynamic */
    margin-right: 16px;
  } div.team-main-select p {
    /* dynamic */
    font-size: 14px;
  } div.team-main-select p#box-goals {
    box-sizing: border-box;
    text-align: center;
    border-radius: 30px;
    padding: 1.5px 8px;
    max-height: 24px;
    width: auto;
    color: white;
  } div.team-main-select p#box-goals.rating_golden {
    background-color: #ffb904 !important;
  } div.team-main-select p#box-goals.rating_silver {
    background-color: #8C8C8C !important;
  } div.team-main-select p#box-goals.rating_bronze {
    background-color: #dbb884 !important;
  }

  /* lineup-box - coach-only */
  div.lineup-box div.player-row {
    padding: 8px 20px;
  } div.lineup-box div.player-row img.lineup-img {
    object-fit: contain;
    border-radius: 50%;
    border: 1px solid #E6E6E6;
    margin-right: 16px;
  } div.lineup-box div.player-row p.lineup-player-name {
    font-size: 14px;
  } div.lineup-box:last-child div.player-row img.lineup-img {
    margin-right: 16px;
  } div.lineup-box:last-child div.player-row p.lineup-player-name{
    text-align: start;
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

    /* lineup-vector box */
    div#lineup-vector-box {
      padding: 20px 20px 8px 20px;
    } div#lineup-vector-box div#lineup-vector {
      margin: 20px 20px 8px 20px;
    } div#lineup-vector-box div#overlay-player-pos-box {
      grid-template-columns: repeat(auto-fit, minmax(fit-content, 1fr));
      grid-template-rows: 1fr;
    } 

    /* main team select */
    div#team-info-box div.team-main-select {
      padding: 15px 0;
      border-bottom: 1px solid #E6E6E6;
      width: 100%;
    } div#team-info-box div.team-main-select:first-child {
      margin: 0 0 8px 20px;
    } div#team-info-box div.team-main-select:last-child {
      margin: 0 20px 8px 0;
    } div#team-info-box div.team-main-select:first-child img.main-team-img {
      margin-right: 16px;
    } div#team-info-box div.team-main-select:last-child img.main-team-img {
      margin-left: 16px;
    } div#team-info-box div.team-main-select:first-child p.team-name {
      margin-right: 16px;
    } div#team-info-box div.team-main-select:last-child p.team-name {
      margin-left: 16px;
    } div#team-info-box div.team-main-select p#box-goals {
      box-sizing: border-box;
      text-align: center;
      border-radius: 30px;
      padding: 1.5px 8px;
      max-height: 24px;
      width: auto;
      color: white;
    } div#team-info-box div.team-main-select p#box-goals.rating_golden {
      background-color: #ffb904 !important;
    } div#team-info-box div.team-main-select p#box-goals.rating_silver {
      background-color: #8C8C8C !important;
    } div#team-info-box div.team-main-select p#box-goals.rating_bronze {
      background-color: #dbb884 !important;
    }

    /* main team lineup */
    div#team-lineup-box {
      align-items: flex-start;
    } div#team-lineup-box div.lineup-box {
      width: 100%;
    } div#team-lineup-box div.lineup-box:last-child div.player-row img.lineup-img {
      margin-left: 16px;
    } div#team-lineup-box div.lineup-box:last-child div.player-row p.lineup-player-name {
      text-align: end;
    }
  
    /* lineup divider */
    div#divider {
      background-color: #E6E6E6;
      width: 1px;
      height: 653px;
    }
  
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
    /* EMPTY */
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  :global(div#lineup-widget-container.dark-background-1 div#team-info-box div.team-main-select) {
    border-bottom: 1px solid #616161;
  }
  div#lineup-widget-container.dark-background-1 div#divider {
    background-color: #616161;
  }

</style>
