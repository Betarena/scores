<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup, log_info_group } from "$lib/utils/debug";

  import { userBetarenaSettings } from "$lib/store/user-settings";
	import { get_livescores_now } from "$lib/firebase/scoreboard";
	import { onValue, ref, type Unsubscribe } from "firebase/database";
	import { db_real } from "$lib/firebase/init";

	import type { 
    FIREBASE_livescores_now 
  } from "$lib/models/firebase";

	import type {
    REDIS_CACHE_SINGLE_fixtures_page_info_response 
  } from "$lib/models/_main_/pages_and_seo/types";

	import type { 
    REDIS_CACHE_SINGLE_statistics_data, 
    REDIS_CACHE_SINGLE_statistics_translation 
  } from "$lib/models/fixtures/statistics/types";

	import StatisticsLoader from "./Statistics_Loader.svelte";
	import StatisticsRow from "./Statistics_Row.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // export let FIXTURE_INFO:                 REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let FIXTURE_STATISTICS:                 REDIS_CACHE_SINGLE_statistics_data
  export let FIXTURE_STATISTICS_TRANSLATION:     REDIS_CACHE_SINGLE_statistics_translation

  let loaded:            boolean = false;           // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;           // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;           // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;               // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;

  let show_placeholder:  boolean = false

  const stats_menu: {
    key: 'Shots' | 'Passes' | 'Attacks' | 'Other Stats' 
    loc_arr: string[]
    loc_trans: string[]
  }[] = [
    {
      key: "Shots",
      loc_arr: ["total", "ongoal", "blocked", "offgoal", "insidebox", "outsidebox"],
      loc_trans: ["Total", "Ongoal", "Blocked", "Offgoal", "Insidebox", "Outsidebox"]
    },
    {
      key: "Passes",
      loc_arr: ["total", "accurate", "percentage"],
      loc_trans: ["Total", "Accurate", "Percentage"]
    },
    {
      key: "Attacks",
      loc_arr: ["attacks", "dangerous_attacks"],
      loc_trans: ["Attacks", "Dangerous Attacks"]
    },
    {
      key: "Other Stats",
      loc_arr: ["possessiontime", "fouls", "corners", "offsides", "yellowcards", "redcards", "yellowredcards", "saves", "substitutions", "goal_kick", "goal_attempts", "free_kick", "throw_in", "ball_safe", "goals", "penalties", "injuries"],
      loc_trans: ["Possession Time", "Fouls", "Corners", "Offsides", "Yellow Cards", "Red Cards", "Yellow Red Cards", "Saves", "Substitutions", "Goal Kicks", "Goal Attempts", "Free Kicks", "Throw-ins", "Ball Safe", "Goals", "Penalties", "Injuries"]
    }
  ]

  // [🐞]
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "fixtures | incidents [DEV]";

  // [🐞]
  $: if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `FIXTURE_STATISTICS: ${FIXTURE_STATISTICS}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  // [ℹ] Not In Use
  async function widget_init (
  ): Promise < REDIS_CACHE_SINGLE_statistics_data > {

    // [ℹ] get response [lang] [data] [obtained from preload()]
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(3000);

    loaded = true;

    // [ℹ] data validation check
		if (
      FIXTURE_STATISTICS == undefined
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

    FIXTURE_STATISTICS = FIXTURE_STATISTICS

    return FIXTURE_STATISTICS;
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
    const fixture_id = FIXTURE_STATISTICS?.id;

    if (live_fixtures_map.has(fixture_id)) {
      // [🐞]
      logs.push(`fixture ${fixture_id} livescore_now exists!`)
      // [ℹ] update fixture data;
      FIXTURE_STATISTICS.status = live_fixtures_map.get(fixture_id)?.time?.status
      // FIXME: make compatible TYPES for hasura/stats && firebase/stats
      FIXTURE_STATISTICS.stats = live_fixtures_map.get(fixture_id)?.stats?.data

      // [ℹ] reactiveity on-set main
      FIXTURE_STATISTICS = FIXTURE_STATISTICS
    }

    // TODO: lazy_load_data_check = true

    // [🐞]
    if (dev) log_info_group(logs_name, logs)
  }

	async function listen_real_time_livescores_now (
  ): Promise < void > {

    const fixture_status = FIXTURE_STATISTICS?.status;
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

  // $: if (FIXTURE_STATISTICS != undefined) {
  //   kickstart_one_off_data()
  // }

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (
    FIXTURE_STATISTICS
    && browser 
    && (FIXTURE_STATISTICS?.status == "NS" || FIXTURE_STATISTICS?.status == "POST")
    && (FIXTURE_STATISTICS?.stats == undefined || FIXTURE_STATISTICS?.stats.length == 0)) {
    no_widget_data = true
    loaded = true
  } else {
    no_widget_data = false
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
      <h2>{FIXTURE_STATISTICS_TRANSLATION?.title}</h2>
      <!-- 
      [ℹ] team-names -->
      <p>{FIXTURE_STATISTICS?.home?.team_name}</p>
      <p>{FIXTURE_STATISTICS?.away?.team_name}</p>
    </div>
  <!-- {/if} -->

  <!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if
    no_widget_data && 
    loaded
    && show_placeholder}

    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0px;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {FIXTURE_STATISTICS_TRANSLATION?.title}
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
          {FIXTURE_STATISTICS_TRANSLATION?.no_info}
        </p>
        <p class='s-14 color-grey w-400'> 
          {FIXTURE_STATISTICS_TRANSLATION?.no_info_desc}
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

    <!-- <StatisticsLoader /> -->

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <StatisticsLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <h2
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0px;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {FIXTURE_STATISTICS_TRANSLATION?.title}
      </h2>

      <div
        id="statistics-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] no cross-platform design change
        -->

        <!-- 
        [ℹ] team info -->
        <div
          id="team-info-box"
          class="row-space-out">
          <!-- 
          [ℹ] home team -->
          <img 
            src={FIXTURE_STATISTICS?.home?.team_logo}
            alt=""
            width=24px
            height=24px
          />

          <!-- 
          [ℹ] away team -->
          <img 
            src={FIXTURE_STATISTICS?.away?.team_logo}
            alt=""
            width=24px
            height=24px
          />
        </div>

        <!-- 
        [ℹ] statistics table -->
        <div
          id="statistics-box">
          {#if FIXTURE_STATISTICS?.stats 
              && FIXTURE_STATISTICS?.stats.length == 2}
            <!-- 
            [ℹ] shots-section 
            [ℹ] passes-section
            [ℹ] attacks-section 
            [ℹ] other-stats-section -->
            {#each stats_menu as item}
              <p
                class="
                  w-500
                  color-black-2
                  text-group-stats
                ">
                {item.key}:
              </p>
              {#each item.loc_arr as sub_nav,i}

                {#if item.key == "Shots"}
                  <StatisticsRow 
                    TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats[0]?.shots[sub_nav]}
                    TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats[1]?.shots[sub_nav]} 
                    STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[sub_nav]}
                  />
                {/if}

                {#if item.key == "Passes"}
                  <StatisticsRow 
                    TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats[0]?.passes[sub_nav]}
                    TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats[1]?.passes[sub_nav]} 
                    STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[sub_nav]}
                  />
                {/if}

                {#if item.key == "Attacks"}
                  <StatisticsRow 
                    TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats[0]?.attacks[sub_nav]}
                    TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats[1]?.attacks[sub_nav]} 
                    STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[sub_nav]}
                  />
                {/if}

                {#if item.key == "Other Stats"}
                  <StatisticsRow 
                    TEAM_HOME_STAT={FIXTURE_STATISTICS?.stats[0][sub_nav]}
                    TEAM_AWAY_STAT={FIXTURE_STATISTICS?.stats[1][sub_nav]} 
                    STAT_TRANSLATION={FIXTURE_STATISTICS_TRANSLATION[sub_nav]}
                  />
                {/if}

              {/each}
            {/each}
          {/if}
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
  div#statistics-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: none;
    /* override */
    padding-bottom: 20px;
  }

  /* team info box */
  div#statistics-widget-container div#team-info-box {
    padding: 20px 20px 0 20px;
    position: absolute;
  }

  /* statistics table box */
  div#statistics-widget-container div#statistics-box p.text-group-stats {
    text-align: center;
    font-size: 16px;
    padding: 20px 0 0 0;
  } :global(div#statistics-widget-container div#statistics-box div.stats-row:last-child) {
    border-bottom: 0 !important;
  }

  /* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #statistics-widget-container {
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
  DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #statistics-widget-container {
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

  /* events table box */
  :global(div#statistics-widget-container.dark-background-1 div#statistics-box div.stats-row) {
    border-bottom: 1px solid #616161;
  }

</style>
