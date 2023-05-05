<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->
	
  import { page } from '$app/stores';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
  import { onMount } from 'svelte';
  
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import StatisticsRow from './Statistics-Row.svelte';
  
	import { get } from '$lib/api/utils.js';
	import { MONTH_NAMES_ABBRV, toCorrectDate } from '$lib/utils/dates.js';
	import type { B_PSTAT_D, B_PSTAT_T, PSTAT_C_Fixture, PSTAT_C_League, PSTAT_C_Season } from '@betarena/scores-lib/types/player-statistics.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_PSTAT_D

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_T_DATA: B_PSTAT_T = $page.data?.B_PSTAT_T

  $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_T_DATA = $page.data?.B_PSTAT_T
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.statistics || 'Statistics' : 'Statistics'

  let playerSeasonStatMap: Map <string, PSTAT_C_Season> = new Map(Object.entries(WIDGET_DATA?.data?.seasons_stats)) as Map <string, PSTAT_C_Season>;
  let leagueMap: Map <string, PSTAT_C_League> = new Map(Object.entries(WIDGET_DATA?.data?.leagues)) as unknown as Map <string, PSTAT_C_League>;

  let selectedLeague: string = leagueMap.keys().next().value;
  let selectedSeason: string = ""
  let selectedStatsOpt: string[] = []
  let toggleDropdownLeague: boolean = false
  let toggleDropdownSeason: boolean = false

  // $: console.log('selectedLeague: ', selectedLeague)
  // $: console.log('selectedSeason: ', selectedSeason)
  // $: console.log('playerSeasonStatMap.get(selectedSeason)?.player_stats: ', playerSeasonStatMap.get(selectedSeason)?.player_stats)
  // $: console.log('selectedStatsOpt: ', selectedStatsOpt)

  const statsMenu: {
		key:
			| 'matches'
			| 'defend'
			| 'attack'
			| 'passes'
      | 'cards'
      | 'other'
    ;
		loc_arr: string[];
		loc_trans: string[];
	}[] = [
    // (stats) matches 
		{
			key: 'matches',
			loc_arr: [
				'minutes_played',
				'bench',
				'appearances',
        ''
			],
			loc_trans: [
				'Minutes Played',
				'Bench',
				'Appearances'
			]
		},
    // (stats) attacks
    {
      key: 'attack',
      loc_arr: [
				'goals',
				'shots_total',
				'hit_woodwork',
        'shots_on_target',
        'shots_off_target',
        'big_changes_created',
        'big_changes_missed',
        'dribbled_past'
			],
			loc_trans: [
				'Minutes Played',
				'Bench',
				'Appearances'
			]
    },
    // (stats) defend
    {
      key: 'defend',
      loc_arr: [
        'tackles',
        'intercepts',
        'blocks',
        'clearance',
        'aerials_won',
        'goals_conceded',
        'saves',
        'inside_box_saves',
        'cleansheets'
      ],
      loc_trans: []
    },
    // (stats) cards
    {
      key: 'cards',
      loc_arr: [
        'yellow_cards',
        'yellow_red_cards',
        'red_cards',
      ],
      loc_trans: []
    },
    // (stats) other
    {
      key: 'other',
      loc_arr: [
        'captain',
        'fouls',
        'substitutions',
        'substitute_in',
        'substitute_out',
        'substitute_on_bench',
        'injuries',
        'dispossessed',
        'fouls_drawn',
        'total_duels',
        'duels_won',
        'own_goals',
        'offsides',
      ],
      loc_trans: []
    }
	];

  let loadingPrev: boolean = false;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function toggleStatOptList
  (
    option: string
  )
  {
    const validation_0 =
      selectedStatsOpt.includes(option)
    ;
    if (validation_0)
    {
      const index = selectedStatsOpt.indexOf(option);
      selectedStatsOpt.splice(index, 1);
      selectedStatsOpt = selectedStatsOpt;
      return;
    }
    selectedStatsOpt.push(option)
    selectedStatsOpt = selectedStatsOpt;
  }

  async function getLast5SeasonFixtures
  (
  ) 
  {
    const validation_0 =
      !playerSeasonStatMap.has(selectedSeason)
      || playerSeasonStatMap.get(selectedSeason)?.last_5_fixtures == undefined
      || playerSeasonStatMap.get(selectedSeason)?.last_5_fixtures.length != 0
    ;
    if (validation_0) return
    // continue, load;
    loadingPrev = true;
    const response = await get
    (
      `/api/data/players/statistics?player_id=${PAGE_DATA?.data?.player_id}&league_id=${selectedLeague}&season_id=${selectedSeason}&hasura=true`
    ) as PSTAT_C_Fixture[];
    // validate: end of fixtures;
    const validation_1 =
      response == undefined
    ;
    if (validation_1) 
    {
      loadingPrev = false;
      return;
    }
    const seasonStatObj = playerSeasonStatMap.get(selectedSeason);
    seasonStatObj.last_5_fixtures = response;
    playerSeasonStatMap.set(selectedSeason, seasonStatObj)
    playerSeasonStatMap = playerSeasonStatMap;
    loadingPrev = false;
  }

  $: if (selectedSeason)
  {
    getLast5SeasonFixtures()
  }

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1024;
	const MOBILE_VIEW = 475;
	let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr
  (
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!-- 
[ℹ] example comment
-->
<div>

  <WidgetTitle
    {WIDGET_TITLE}
    OVERRIDE_COLOR={true}
  />
  
  <div
    class="widget-component"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!-- 
    League -< Season (Many)
    -->
    <div
      id="pstat-drop-main"
      class="
        row-space-out
        width-auto
      "
    >

      <!-- 
      League dropdown select
      -->
      <div
        id="pstat-drop-league-main"
        class="cursor-pointer"
        on:click={() => toggleDropdownLeague = !toggleDropdownLeague}
      >
        <div
          class="
            row-space-out 
            cursor-pointer
            pstat-drop-btn
          "
        >
          <p
            class="
              s-14 
              w-500 
              color-black-2
            "
          >
            {leagueMap.get(selectedLeague)?.name}
          </p>
          <img
            src={!toggleDropdownLeague ? "/assets/svg/arrow-down.svg" : "/assets/svg/arrow-up.svg"}
            alt={!toggleDropdownLeague ? "arrow_down" : "arrow_up"}
            width="20"
            height="20"
          />
        </div>
        {#if toggleDropdownLeague}
          <div 
            id="more-top-leagues-outer"
          >
            <div
              id="more-top-leagues-list-container"
            >
              {#each [...leagueMap.entries()] || [] as [league_id, league_data]}
                <div
                  class="
                    pstat-dropdown-row
                  "
                  on:click={() => selectedLeague = league_id}
                >
                  <p
                    class="
                      s-14 
                      w-500 
                      color-black-2
                    "
                  >
                    {league_data?.name}
                  </p>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- 
      Season dropdown select
      -->
      <div
        id="pstat-drop-season-main"
        class="cursor-pointer"
        on:click={() => toggleDropdownSeason = !toggleDropdownSeason}
      >

        <div
          class="
            row-space-out 
            cursor-pointer
            pstat-drop-btn
          "
        >
          <p
            class="
              s-14 
              w-500 
              color-black-2
            "
          >
            {leagueMap.get(selectedLeague)?.seasons?.find(x => x?.seasond_id?.toString() == selectedSeason)?.name}
          </p>
          <img
            src={!toggleDropdownSeason ? "/assets/svg/arrow-down.svg" : "/assets/svg/arrow-up.svg"}
            alt={!toggleDropdownSeason ? "arrow_down" : "arrow_up"}
            width="20"
            height="20"
          />
        </div>

        {#if toggleDropdownSeason}
          <div 
            id="more-top-leagues-outer"
          >
            <div
              id="more-top-leagues-list-container"
            >
              {#each leagueMap.get(selectedLeague)?.seasons || [] as season}
                <div
                  class="
                    pstat-dropdown-row
                  "
                  on:click={() => selectedSeason = season?.seasond_id?.toString()}
                >
                  <p
                    class="
                      s-14 
                      w-500 
                      color-black-2
                    "
                  >
                    {season?.name}
                  </p>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
      </div>

    </div>

    <!-- 
    Average Rating
    Last 5 (by season) fixtures
    -->
    <div
      class="
        row-space-out
      ">
      <p>
        {`${WIDGET_T_DATA?.average_rating}:` || 'Average Rating:'}
      </p>
    </div>
    
    <div
      class="
        row-space-out
      ">
      {#each playerSeasonStatMap.get(selectedSeason)?.last_5_fixtures?.reverse() || [] as fixture}
        <div
          class="
            column-space-center
          ">
          <img 
            src="{fixture?.rival_team?.icon}"
            alt="{fixture?.rival_team?.name}"
            title="{fixture?.rival_team?.name}"
            width="32"
            height="32"
          />
          <p>
            {toCorrectDate(fixture?.fixture_day).getDate()}
            {MONTH_NAMES_ABBRV[toCorrectDate(fixture?.fixture_day).getMonth()]}
          </p>
          <p>
            {fixture?.player_rating}
          </p>
        </div>
      {/each}
    </div>

    <!-- 
    Season Stats
    -->
    <div>
      {#if selectedSeason != '' && playerSeasonStatMap.get(selectedSeason) != undefined}
        {#each statsMenu as item}

          <div
            class="
              row-space-out
              pstat-group-opt
            "
            on:click={() => toggleStatOptList(item?.key)}
          >
            <p
              class="
                s-14 
                w-500 
                color-black-2
              "
            >
              {WIDGET_T_DATA[item?.key]}
            </p>
            <img
              src={!selectedStatsOpt.includes(item?.key) ? "/assets/svg/arrow-up.svg" : "/assets/svg/arrow-down.svg"}
              alt={!selectedStatsOpt.includes(item?.key) ? "arrow_up" : "arrow_down"}
              width="20"
              height="20"
            />
          </div>
          
          {#if !selectedStatsOpt.includes(item?.key)}
            {#each item?.loc_arr || [] as sub_nav, i}
              <StatisticsRow
                STAT_NAME={WIDGET_T_DATA[sub_nav]}
                STAT_VALUE={playerSeasonStatMap.get(selectedSeason)?.player_stats?.[item.key]?.[sub_nav] || '-'}
              />
            {/each}
          {/if}
          
        {/each}
      {/if}
    </div>
    
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /* o */
  div.widget-component {
    overflow: unset;
  }

  /* dropdown box styles */
  div#pstat-drop-main
  {
    margin: 0 20px 20px 20px;
  }
  div#pstat-drop-main div#pstat-drop-league-main
  {
		position: relative;
    width: 100%;
    margin-right: 16px;
	}
  div#pstat-drop-main div#pstat-drop-season-main 
  {
		position: relative;
  }
  div#pstat-drop-main div#pstat-drop-league-main div.pstat-drop-btn,
  div#pstat-drop-main div#pstat-drop-season-main div.pstat-drop-btn 
  {
		padding: 9px 20px;
		border: 1px solid #cccccc;
		box-sizing: border-box;
		border-radius: 8px;
		position: relative;
		height: 40px;
	}
  div#pstat-drop-main div#pstat-drop-league-main div.pstat-drop-btn:hover
  div#pstat-drop-main div#pstat-drop-season-main div.pstat-drop-btn:hover 
  {
		border: 1px solid #8c8c8c !important;
	}
  /* dropdpwn (level) */
  div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-outer,
  div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-outer 
  {
		position: absolute;
		top: 115%;
		width: 100%;
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
		border-radius: 4px;
		z-index: 10000;
		max-height: 302px;
		overflow-y: scroll;
		padding-right: 6px;
	}
	div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-outer::-webkit-scrollbar,
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-outer::-webkit-scrollbar 
  {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}
	div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-outer::-webkit-scrollbar,
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-outer::-webkit-scrollbar
  {
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container, 
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container 
  {
		max-height: 302px;
		overflow-y: scroll;
	}
  /* width */
	div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container::-webkit-scrollbar,
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container::-webkit-scrollbar 
  {
		width: 4px;
	} 
  /* track */
	div#pstat-drop-main div#pstat-drop-league-main::-webkit-scrollbar-track,
	div#pstat-drop-main div#pstat-drop-season-main::-webkit-scrollbar-track 
  {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	} 
  /* handle */
	div#pstat-drop-main	div#pstat-drop-league-main::-webkit-scrollbar-thumb,
	div#pstat-drop-main	div#pstat-drop-season-main::-webkit-scrollbar-thumb 
  {
		background: #cccccc;
		border-radius: 12px;
	}

	div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container .pstat-dropdown-row,
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container .pstat-dropdown-row
  {
		padding: 12px 20px;
	}
  div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container .pstat-dropdown-row:hover,
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container .pstat-dropdown-row:hover {
		cursor: pointer;
	}
	div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container .pstat-dropdown-row:hover p,
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container .pstat-dropdown-row:hover p
  {
		color: #f5620f !important;
	} 

  div.pstat-group-opt
  {
    border-top: 1px solid var(--grey-color);
    padding: 14px 20px;
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) {
  }

  /*
  =============
  DARK-THEME
  =============
  */

  div.dark-background-1 div#fixtures-list-box a:first-child div.league-group-box {
    border: none;
  } div.dark-background-1 div#fixtures-list-box a div.league-group-box {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

  div.dark-background-1 button.btn-hollow {
    border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
  /* o */
  div.dark-background-1 button.btn-hollow:hover {
    border: 1px solid var(--primary) !important;
    color: var(--primary) !important;
  }

</style>