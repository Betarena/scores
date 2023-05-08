<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->
	
  import { page } from '$app/stores';
  import { get } from '$lib/api/utils.js';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { MONTH_NAMES_ABBRV, toCorrectDate } from '$lib/utils/dates.js';
  import { shortenSeasonName } from '$lib/utils/languages.js';
  import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
  import { onMount } from 'svelte';
  
	import SeoBox from '$lib/components/SEO-Box.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import StatisticsRow from './Statistics-Row.svelte';
	import PstatBLoaderRatingGrid from './loaders/PSTAT-BLoader-RatingGrid.svelte';

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

  let selectedLeague: string = WIDGET_DATA?.data?.leaguesOrder[0]?.toString();
  let selectedSeason: string = ""
  let selectedStatsOpt: string[] = []
  let queriedSeasons: string[] = []
  let toggleDropdownLeague: boolean = false
  let toggleDropdownSeason: boolean = false
  let activeAverageRating: number;
  let selectedSeasonName: string;
  let loadingPrev: boolean = false;
  let noFixturesData: boolean = false;

  // $: console.log('selectedLeague: ', selectedLeague)
  // $: console.log('selectedSeason: ', selectedSeason)
  // $: console.log('playerSeasonStatMap.get(selectedSeason)?.player_stats: ', playerSeasonStatMap.get(selectedSeason)?.player_stats)
  // $: console.log('selectedStatsOpt: ', selectedStatsOpt)

  const statsMenu: 
  {
		key:
			| 'matches'
			| 'defend'
			| 'attack'
			| 'passing'
      | 'cards'
      | 'other'
    ;
		loc_arr: string[];
		loc_trans: string[];
	}[] = 
  [
    // (stats) matches 
		{
			key: 'matches',
			loc_arr: [
				'minutes_played',
				'bench',
				'appearances',
        'lineups'
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
        'big_chances_created',
        'big_chances_missed',
        'dribbled_past'
			],
			loc_trans: [
				'Minutes Played',
				'Bench',
				'Appearances'
			]
    },
    // (stats) passes
    {
      key: 'passing',
      loc_arr: [
				'passes',
				'accurate_passes',
				'accurate_passes_percentage',
        'key_passes',
        'assists'
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
        'yellowcards',
        'yellowred_cards',
        'redcards'
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
        'owngoals',
        'offsides',
      ],
      loc_trans: []
    }
	];

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

  function selectFirstAvailableSeason
  (
  )
  {
    const valiation_0 =
      leagueMap.get(selectedLeague)?.seasons?.length == 0
    ;
    if (valiation_0) return;
    selectedSeason = 
      leagueMap.get(selectedLeague)?.seasons?.[0]?.seasond_id.toString()
    ;
  }

  function obtainTargetSelectedSeaconName
  (
  )
  {
    selectedSeasonName = shortenSeasonName
    (
      leagueMap.get(selectedLeague)
        ?.seasons
          ?.find
          (
            x => x?.seasond_id?.toString() == selectedSeason
          )
          ?.name
    );
  }

  function modifierTranslation
  (
    target_prop: string
  )
  {
    let appliedTranslation = WIDGET_T_DATA[target_prop]
    if (target_prop == "attack") appliedTranslation = WIDGET_T_DATA?.attacking
    if (target_prop == "defend") appliedTranslation = WIDGET_T_DATA?.defending
    if (target_prop == "intercepts") appliedTranslation = WIDGET_T_DATA?.interceptions
    if (target_prop == "clearance") appliedTranslation = WIDGET_T_DATA?.clearances;
    if (target_prop == "fouls_drawn") appliedTranslation = WIDGET_T_DATA?.foulds_drawn;
    return appliedTranslation
  }

  function closeAllDropdowns
  (
  )
   {
		toggleDropdownLeague = false;
    toggleDropdownSeason = false;
	}

  async function getLast5SeasonFixtures
  (
  ) 
  {
    const if_0 =
      !playerSeasonStatMap.has(selectedSeason)
      || playerSeasonStatMap.get(selectedSeason)?.last_5_fixtures == undefined
      || playerSeasonStatMap.get(selectedSeason)?.last_5_fixtures.length != 0
      || queriedSeasons.includes(selectedSeason)
    ;
    noFixturesData = false;
    if (if_0) return
    // continue, load;
    loadingPrev = true;
    const response = await get
    (
      `/api/data/players/statistics?player_id=${PAGE_DATA?.data?.player_id}&league_id=${selectedLeague}&season_id=${selectedSeason}&hasura=true`
    ) as [PSTAT_C_Fixture[], number];
    // validate: end of fixtures;
    const if_1 =
      response == undefined
      || (response[0]?.length == 0 && response[1] == undefined)
    ;
    if (if_1) 
    {
      noFixturesData = true;
      loadingPrev = false;
      return;
    }
    const seasonStatObj = playerSeasonStatMap.get(selectedSeason);
    seasonStatObj.last_5_fixtures = response[0];
    seasonStatObj.last_5_fixtures_avg_rating = response[1];
    playerSeasonStatMap.set(selectedSeason, seasonStatObj)
    playerSeasonStatMap = playerSeasonStatMap;
    queriedSeasons.push(selectedSeason)
    noFixturesData = false;
    loadingPrev = false;
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

   /**
   * @description listens to when 
   * selected-league has changed;
  */
  $: if (selectedLeague) 
  {
    selectFirstAvailableSeason()
    obtainTargetSelectedSeaconName()
  }

  /**
   * @description listens to when 
   * selected-season has changed;
  */
  $: if (selectedSeason)
  {
    getLast5SeasonFixtures()
    obtainTargetSelectedSeaconName()
    activeAverageRating = playerSeasonStatMap.get(selectedSeason)?.last_5_fixtures_avg_rating
  }

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

<SeoBox>
  <h2>
    {WIDGET_TITLE}
  </h2>
</SeoBox>

<!-- 
[ℹ] area-outside-for-close 
-->
{#if toggleDropdownLeague || toggleDropdownSeason}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<!-- 
[ℹ] example comment
-->
<div>

  <WidgetTitle
    {WIDGET_TITLE}
    OVERRIDE_COLOR={!mobileExclusive && !tabletExclusive ? false : true}
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
              {#each WIDGET_DATA?.data?.leaguesOrder || [] as l_id}
                <div
                  class="
                    pstat-dropdown-row
                  "
                  on:click={() => selectedLeague = l_id?.toString()}
                >
                  <p
                    class="
                      s-14 
                      w-500 
                      color-black-2
                    "
                    class:activeLeague={selectedLeague == l_id?.toString()}
                  >
                    {leagueMap.get(l_id?.toString())?.name}
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
              color-black-2
            "
          >
            {selectedSeasonName}
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
                    class:activeSeason={selectedSeason == season?.seasond_id?.toString()}
                  >
                    {
                      shortenSeasonName
                      (
                        season?.name
                      )
                    }
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
    -->
    {#if !loadingPrev && !noFixturesData}
      <div
        id="pstat-avg-rating-box"
        class="
          row-space-out
        ">
        <p
          class="
            s-16
            w-500
            color-black-2
          "
        >
          {`${WIDGET_T_DATA?.average_rating}:` || 'Average Rating:'}
        </p>
        <p
          id="pstat-average-rating-main"
          class="
            s-14 
            w-500
          "
          class:rating_nan={activeAverageRating == undefined}
          class:rating_bronze={activeAverageRating >= 5 && activeAverageRating < 7}
          class:rating_silver={activeAverageRating >= 7 && activeAverageRating < 9}
          class:rating_golden={activeAverageRating >= 9}
        >
          {activeAverageRating || 'N/A'}
        </p>
      </div>
    {/if}

    <!-- 
    Last 5 (by season) fixtures
    -->
    {#if !loadingPrev && !noFixturesData}
      <div
        id="pstat-last-fixtures-box"
        class="
          m-b-25
        ">

        <!-- 
        overlay grid box
        -->
        <div
          id="pstat-overlay-rating-box">
          <!-- 
          average hr line (dotted)
          -->
          <hr 
            id="pstat-average"
            style="bottom: {((activeAverageRating || 0) * 10)}px"
          />
          <hr class="pstat-grid-line" />
          <hr class="pstat-grid-line" />
          <hr class="pstat-grid-line" />
          <hr class="pstat-grid-line" />
          <hr class="pstat-grid-line" />
          <hr class="pstat-grid-line" />
        </div>

        <!-- 
        main data
        -->
        {#each playerSeasonStatMap.get(selectedSeason)?.last_5_fixtures || [] as fixture}
          <div
            class="
              column-space-center
              width-auto
            ">
            <!-- 
            Rival Team Icon
            -->
            <img 
              src="{fixture?.rival_team?.icon}"
              alt="{fixture?.rival_team?.name}"
              title="{fixture?.rival_team?.name}"
              width="32"
              height="32"
            />
            <!-- 
            Fixture Date
            -->
            <p
              class="
                s-12
                color-grey
                m-t-10
                no-wrap
              ">
              {toCorrectDate(fixture?.fixture_day).getDate()}
              {MONTH_NAMES_ABBRV[toCorrectDate(fixture?.fixture_day).getMonth()]}
            </p>
            <!-- 
            Rating
            -->
            <div
              class="
                m-t-15
                pstat-fix-rating-box
              ">
              <p
                id="pstat-average-rating-main"
                class="
                  s-14 
                  w-500
                  pstat-fixture-rating
                "
                class:rating_nan={fixture?.player_rating == undefined}
                class:rating_bronze={fixture?.player_rating >= 5 && fixture?.player_rating < 7}
                class:rating_silver={fixture?.player_rating >= 7 && fixture?.player_rating < 9}
                class:rating_golden={fixture?.player_rating >= 9}
                style="bottom: {((fixture?.player_rating || 0) * 10)}px"
              >
                {fixture?.player_rating || 'N/A'}
              </p>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if loadingPrev}
      <div
        style="margin: 20px 20px 0 20px;">
        <PstatBLoaderRatingGrid />
      </div>
    {/if}

    <!-- 
    Season Stats
    -->
    <div
      id="pstat-season-box"
    >
      {#if selectedSeason != '' && playerSeasonStatMap.get(selectedSeason) != undefined}
        {#each statsMenu as item}

          <div
            class="
              cursor-pointer
              row-space-out
              pstat-group-opt
            "
            on:click={() => toggleStatOptList(item?.key)}
          >
            <p
              class="
                s-16
                w-500 
                color-black-2
              "
            >
              {modifierTranslation(item?.key)}
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
                STAT_NAME={modifierTranslation(sub_nav)}
                STAT_VALUE={playerSeasonStatMap.get(selectedSeason)?.player_stats?.[item.key]?.[sub_nav] || '-'}
                PROP_VALUE={sub_nav}
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
    padding-bottom: unset;
  }

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

  div#pstat-avg-rating-box
  {
    padding: 0 20px;
  }

  /* average rating row */
  p#pstat-average-rating-main 
  {
		box-sizing: border-box;
    text-align: center;
    border-radius: 12px;
    padding: 1.5px 0px;
    max-height: 24px;
    min-width: 44px;
    max-width: 44px;
    width: auto;
    color: var(--white);
	}
	p#pstat-average-rating-main.rating_golden 
  {
		background-color: #ffb904 !important;
	}
	p#pstat-average-rating-main.rating_silver 
  {
		background-color: #8c8c8c !important;
	}
	p#pstat-average-rating-main.rating_bronze 
  {
		background-color: #dbb884 !important;
	}
  p#pstat-average-rating-main.rating_nan 
  {
		background-color: var(--whitev2);
    color: var(--grey);
  }

  /* last 5 season fixtures */
  div#pstat-last-fixtures-box
  {
    position: relative;
    z-index: 1;
    /* s */
    margin: 20px;
    width: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    direction: ltr;
    gap: 5vw;
    /* padding: 0 20px; */
  }
  div#pstat-last-fixtures-box
  div#pstat-overlay-rating-box
  {
    /* p */
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: -1;
    /* s */
    /* height: 140px; */
    width: 100%;
    display: grid;
  }
  div#pstat-last-fixtures-box
  div#pstat-overlay-rating-box
  hr#pstat-average
  {
    /* o */
    position: absolute;
    /* top: 50%; */
    /* s */
    border-color: var(--grey) !important;
    background-color: var(--grey-color) !important;
    border: none;
    margin: unset;
    border-bottom: dashed 1px;
  }
  div#pstat-last-fixtures-box
  div#pstat-overlay-rating-box
  hr.pstat-grid-line
  {
    /* s */
    margin: 13px 0;
    border-color: var(--grey-color) !important;
    background-color: var(--grey-color) !important;
  }
  div#pstat-last-fixtures-box
  div#pstat-overlay-rating-box
  hr.pstat-grid-line:first-child
  {
    /* s */
    margin-top: unset;
  }
  div#pstat-last-fixtures-box
  div#pstat-overlay-rating-box
  hr.pstat-grid-line:last-child
  {
    /* s */
    margin-bottom: unset;
  }

  div.pstat-fix-rating-box
  {
    position: relative;
    min-height: 140px;
    max-height: 140px;
    width: 45px;
  }
  div.pstat-fix-rating-box
  p.pstat-fixture-rating
  {
    position: absolute;
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
		padding: 9px 16px 9px 20px;
		border: 1px solid #cccccc;
		box-sizing: border-box;
		border-radius: 8px;
		position: relative;
		height: 44px;
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
	div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container::-webkit-scrollbar-track,
	div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container::-webkit-scrollbar-track 
  {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	} 
  /* handle */
	div#pstat-drop-main	div#pstat-drop-league-main div#more-top-leagues-list-container::-webkit-scrollbar-thumb,
	div#pstat-drop-main	div#pstat-drop-season-main div#more-top-leagues-list-container::-webkit-scrollbar-thumb 
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

  p.activeLeague,
  p.activeSeason
  {
    color: var(--primary);
  }

  div#pstat-season-box
  div.pstat-group-opt:first-child
  {
    border: unset;
  }
  
  div#pstat-season-box
  div.pstat-group-opt
  {
    margin-top: 10px;
    border-top: 1px solid var(--grey-color);
    padding: 14px 20px;
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 425px) {
    div#pstat-last-fixtures-box
    {
      gap: 5%;
    }
  }

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) {
  }

  /*
  =============
  DARK-THEME
  =============
  */

  .dark-background-1 div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-outer,
  .dark-background-1 div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-outer 
  {
		/* dark theme/dark-gray */
		background: #616161;
		/* shadow/black */
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
		border-radius: 4px;
	}

	/* handle */
  .dark-background-1 div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container::-webkit-scrollbar-thumb,
	.dark-background-1 div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container::-webkit-scrollbar-thumb  
  {
		background: #999999 !important;
	}
	/* track */
	.dark-background-1 div#pstat-drop-main div#pstat-drop-league-main div#more-top-leagues-list-container::-webkit-scrollbar-track,
	.dark-background-1 div#pstat-drop-main div#pstat-drop-season-main div#more-top-leagues-list-container::-webkit-scrollbar-track  
  {
		background: #4b4b4b !important;
	}

  .dark-background-1
  div#pstat-last-fixtures-box
  div#pstat-overlay-rating-box
  hr#pstat-average
  {
    border-color: #A8A8A8 !important;
  }

  div.dark-background-1 
  div#pstat-last-fixtures-box
  div#pstat-overlay-rating-box
  hr
  {
    border-color: var(--dark-theme-1-shade) !important;
    background-color: var(--dark-theme-1-shade) !important;
  }

  div.dark-background-1 
  div.pstat-group-opt
  {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

  div.dark-background-1 div#pstat-drop-main div#pstat-drop-league-main div.pstat-drop-btn,
  div.dark-background-1 div#pstat-drop-main div#pstat-drop-season-main div.pstat-drop-btn 
  {
		border: 1px solid var(--dark-theme-1-2-shade);
	}

  div.dark-background-1
  p#pstat-average-rating-main 
  {
    color: var(--dark-theme-1) !important;
  }

  div.dark-background-1
  p#pstat-average-rating-main.rating_nan
  {
		background-color: var(--dark-theme-1-shade) !important;
    color: var(--dark-theme-1-3-shade) !important;
  }

</style>