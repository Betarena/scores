<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { LIN_F_dataInject, LIN_F_obtainPlayerIdList } from '@betarena/scores-lib/dist/functions/func.fixture.lineups.js';
	
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import LineupPlayerRow from './Lineups-Player-Row.svelte';
	import LineupPlayerVisual from './Lineups-Player-Visual.svelte';
	import LineupVectorMobileAway from './Lineups-Vector-Mobile-Away.svelte';
	import LineupVectorMobile from './Lineups-Vector-Mobile.svelte';
	import LineupVectorTablet from './Lineups-Vector-Tablet.svelte';

  import type { B_H_SFPV2 } from '@betarena/scores-lib/types/hasura.js';
  import type { B_LIN_D, B_LIN_T, LIN_Player } from '@betarena/scores-lib/types/lineups.js';

  // #endregion ➤ [MAIN] Package Imports

  // #region ➤ [VARIABLES]

	export let FIXTURE_LINEUPS: B_LIN_D;
	export let FIXTURE_LINEUPS_TRANSLATION: B_LIN_T;

  console.log('⭐️ FIXTURE_LINEUPS', FIXTURE_LINEUPS)
  console.log('⭐️ FIXTURE_LINEUPS_TRANSLATION', FIXTURE_LINEUPS_TRANSLATION)

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

	const formation_pos_arr = ['G', 'D', 'M', 'A'];

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1000;
  
	let mobileExclusive = false;
  let tabletExclusive = false;

	let loaded: boolean = false;
	let no_widget_data: any = false;
	let selected_view: 'home' | 'away' = 'home';
	let homeTeamFormMap = new Map< string, LIN_Player[] >();
	let awayTeamFormMap = new Map< string, LIN_Player[]	>();
	let show_placeholder: boolean = false;
  let playerMap = new Map <number, B_H_SFPV2>();

  // #endregion ➤ [VARIABLES]

  // #region ➤ [MAIN-METHODS]

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ handles data generation (first-time)
   * ➨ updating against "live" firebase data;
   * @returns
   * void
  */
	async function injectLiveData
  (
	) 
  {
		const fixture_id = FIXTURE_LINEUPS?.id;

    const if_M_00 =
      $sessionStore?.livescore_now_fixture_target?.id != fixture_id
    ;
    if (if_M_00) return;

    const liveFixtureData = $sessionStore?.livescore_now_fixture_target;

    // [ℹ] update fixture data;
    FIXTURE_LINEUPS.status = liveFixtureData?.time?.status;
    FIXTURE_LINEUPS.home.formation = liveFixtureData?.formations?.localteam_formation;
    FIXTURE_LINEUPS.away.formation = liveFixtureData?.formations?.visitorteam_formation;
    // FIXME: make compatible TYPES for hasura/events && firebase/events
    FIXTURE_LINEUPS.events =	liveFixtureData?.events?.data;

    const FIREBASE_LINEUPS_DATA = liveFixtureData?.lineup?.data;
    const FIREBASE_BENCH_DATA = liveFixtureData?.bench?.data;

    // reset, to prevent first-time data generation re-trigger;
    playerMap = new Map();

    // NOTE: check if the "cache/hasura" data is "invalid"
    // NOTE: requiring an "auto-lineup" live-data generation
    // NOTE: on the spot, by the widget, using "livescores" data;
    const if_M_0 =
      FIXTURE_LINEUPS?.home?.lineup?.length == 0 
      && FIXTURE_LINEUPS?.away?.lineup?.length == 0 
      && FIXTURE_LINEUPS?.home?.bench?.length == 0 
      && FIXTURE_LINEUPS?.away?.bench?.length == 0 
      && FIREBASE_LINEUPS_DATA != undefined 
      && FIREBASE_BENCH_DATA != undefined
    ;
    if (if_M_0) 
    {

      console.log('⭐️ injectLiveData() if_M_0')

      const _playerIds = await LIN_F_obtainPlayerIdList
      (
        FIREBASE_LINEUPS_DATA,
        FIREBASE_BENCH_DATA
      );

      const playerIds = 
      [
        ...new Set(_playerIds)
      ];

      const response = await get
      (
        `/api/data/fixture/lineups/?player_ids=${playerIds}`
      ) as [number, B_H_SFPV2][];

      playerMap = new Map
      (
        response
      ) as Map <number, B_H_SFPV2>;
    }

    // NOTE: firebase live-data inject;
    const home_team_id = liveFixtureData?.localteam_id;
    const away_team_id =	liveFixtureData?.visitorteam_id;

    const [
      homeTeamLineup,
      homeTeamBench
    ] = await LIN_F_dataInject
    (
      home_team_id,
      FIXTURE_LINEUPS.events,
      { 
        lineupList: FIREBASE_LINEUPS_DATA,
        benchList: FIREBASE_BENCH_DATA,
        playerMap
      },
      {
        lineupList: FIXTURE_LINEUPS?.home?.lineup,
        benchList: FIXTURE_LINEUPS?.home?.bench
      }
    );

    const [
      awayTeamLineup,
      awayTeamBench
    ] = await LIN_F_dataInject
    (
      away_team_id,
      FIXTURE_LINEUPS.events,
      { 
        lineupList: FIREBASE_LINEUPS_DATA,
        benchList: FIREBASE_BENCH_DATA,
        playerMap
      },
      {
        lineupList: FIXTURE_LINEUPS?.away?.lineup,
        benchList: FIXTURE_LINEUPS?.away?.bench
      }
    );

    FIXTURE_LINEUPS.home.lineup =	homeTeamLineup;
    FIXTURE_LINEUPS.home.bench = homeTeamBench;

    FIXTURE_LINEUPS.away.lineup =	awayTeamLineup;
    FIXTURE_LINEUPS.away.bench = awayTeamBench;

    // IMPORTANT
    FIXTURE_LINEUPS = FIXTURE_LINEUPS;
  }

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  )
  {
    [
      tabletExclusive, 
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * @returns
   * void
   */
  function addEventListeners
  (
  )
  {
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function () 
      {
				resizeAction();
			}
		);
  }

  /**
   * @summary
   * [HELPER]
   * @description
   * ➨ generates a player map, by team pitch positions (V1);
   * @returns
   * void
   */
  async function generateTeamFormMap
  (
  ): Promise < void >
  {
    const teamTypes: ['home', 'away'] = ['home', 'away'];

    for (const teamT of teamTypes) 
    {
      const teamFormation = 
        teamT == 'home'
          ? FIXTURE_LINEUPS?.home?.formation
          : FIXTURE_LINEUPS?.away?.formation
      ;
      
      let runTotalCount = 0;
      let countPosDiff = 0;

      let _teamFormList = teamFormation
      ?.split
      (
        '-'
      );

      // add goalkeeper pos
      _teamFormList
      ?.unshift
      (
        '1'
      );

      if (teamT == 'away') _teamFormList.reverse();

      // reset player-list
      if (teamT == 'home') homeTeamFormMap = new Map < string, LIN_Player[]	>();
      if (teamT == 'away') awayTeamFormMap = new Map < string, LIN_Player[]	>();

      // NOTE: sometimes formation_position can been "null" 
      // applied to "AWAY" only;
      // ISSUE: #905
      if (teamT == 'away')
      {
        const if_M_0 = FIXTURE_LINEUPS?.away?.lineup
        .filter
        (
          (
            { 
              formation_position 
            }
          ) =>
            formation_position == undefined
        ).length == 0;

        if (if_M_0) 
        {
          FIXTURE_LINEUPS?.away?.lineup
          .sort
          (
            (
              a, 
              b
            ) =>
              parseFloat
              (
                b.formation_position.toString()
              ) -
              parseFloat
              (
                a.formation_position.toString()
              )
          );
        }
      }

      const teamFormMap = new Map < string, LIN_Player[]	>();

      // loop over each, position digit-string;
      for (const f_pos of _teamFormList) 
      {
        let formPosNum = parseInt
        (
          f_pos
        );
        let formationPosCode = f_pos + countPosDiff.toString();

        for (let i = runTotalCount; i < runTotalCount + formPosNum;	i++)
        {

          const player =
            teamT == 'home'
              ? FIXTURE_LINEUPS?.home?.lineup[i]
              : FIXTURE_LINEUPS?.away?.lineup[i]    
          ;

          const if_M_0 = 
            teamFormMap.has(formationPosCode)
          ;

          if (if_M_0) 
          {
            let exist_lineup_list = teamFormMap.get(formationPosCode);
            exist_lineup_list.unshift(player);
            teamFormMap.set
            (
              formationPosCode,
              exist_lineup_list
            );
          } 
          else 
          {
            const lineup_list = [];
            lineup_list.push(player);
            teamFormMap.set
            (
              formationPosCode,
              lineup_list
            );
          }
        }

        countPosDiff++;
        runTotalCount += formPosNum;
      }

      if (teamT == 'home') homeTeamFormMap = teamFormMap;
      if (teamT == 'away') awayTeamFormMap = teamFormMap;
    }
  }

  /**
   * @summary
   * [HELPER]
   * @description
   * ➨ generates a player map, by team pitch positions (V1);
   * @returns
   * void
   */
  async function generateTeamFormMap_2
  (
  ): Promise < void >
  {
    const teamTypes: ['home', 'away'] = ['home', 'away'];

    for (const teamT of teamTypes) 
    {

      const lineupList =
        teamT == 'home'
          ? FIXTURE_LINEUPS?.home?.lineup
          : FIXTURE_LINEUPS?.away?.lineup 
      ;

      // reset player-list
      if (teamT == 'home') homeTeamFormMap = new Map < string, LIN_Player[]	>();
      if (teamT == 'away') awayTeamFormMap = new Map < string, LIN_Player[]	>();

      const teamFormMap = new Map < string, LIN_Player[]	>();

      for (const form_pos of formation_pos_arr || []) 
      {
        for (const player of lineupList || []) 
        {
          if (form_pos == player?.position) 
          {
            if (teamFormMap.has(form_pos))
            {
              let exist_lineup_list = teamFormMap.get(form_pos);
              exist_lineup_list.push(player);
              teamFormMap.set
              (
                form_pos,
                exist_lineup_list
              );
            } 
            else 
            {
              const lineup_list = [];
              lineup_list.push(player);
              teamFormMap.set
              (
                form_pos,
                lineup_list
              );
            }
          }
        }
      }

      if (teamT == 'home') homeTeamFormMap = teamFormMap;
      if (teamT == 'away') awayTeamFormMap = teamFormMap;
    }
  }
  
  // #endregion ➤ [METHODS]

  // #region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  // #endregion ➤ [ONE-OFF] [METHODS] [IF]

  // #region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description 
   * listens to target "fixture" in "livescores_now" data;
  */
  $: if ($sessionStore?.livescore_now_fixture_target)
  {
    injectLiveData()
  }

  /**
   * @summary
   * [REACTIVE]
   * @description
   * listens to valid fixture (lineups)
   * when, formation + lineups exist;
   * version 1;
  */
  $: if_R_1 =
    FIXTURE_LINEUPS
		&& browser
		&& FIXTURE_LINEUPS?.away?.formation != undefined
		&& FIXTURE_LINEUPS?.home?.formation != undefined
		&& FIXTURE_LINEUPS?.away?.lineup?.length > 0
    && FIXTURE_LINEUPS?.home?.lineup?.length > 0
  ;

  /**
   * @summary
   * [REACTIVE]
   * @description
   * listens to valid fixture (lineups)
   * when, NO formation, but lineups exist;
   * version 2;
  */
  $: if_R_2 =
    FIXTURE_LINEUPS
		&& browser
		&& FIXTURE_LINEUPS?.away?.formation == undefined
		&& FIXTURE_LINEUPS?.home?.formation == undefined
		&& FIXTURE_LINEUPS?.away?.lineup?.length > 0
    && FIXTURE_LINEUPS?.home?.lineup?.length > 0
  ;

	$: if (if_R_1 && FIXTURE_LINEUPS) 
  {
    // [🐞]
    console.log
    (
      '⭐️ if_R_1'
    );
		no_widget_data = false;
    generateTeamFormMap()
	}
  else if (if_R_2 && FIXTURE_LINEUPS) 
  {
    // [🐞]
    console.log
    (
      '⭐️ if_R_2'
    );
		no_widget_data = false;
		generateTeamFormMap_2()
	}
	else 
  {
    console.log
    (
      '⭐️ NO WIDGET DATA [TRUE]'
    );
		no_widget_data = true;
		loaded = true;
	}

  // [🐞]
  // $: if (FIXTURE_LINEUPS)
  // {
  //   console.log('⭐️ FIXTURE_LINEUPS', FIXTURE_LINEUPS)
  // }

  //#endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() => 
    {
      resizeAction();
      addEventListeners();
    }
  );

  // #endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
	class:display-none={no_widget_data &&	!show_placeholder}
>

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if
    no_widget_data 
    && loaded 
    && show_placeholder}
    <WidgetNoData 
      WIDGET_TITLE={FIXTURE_LINEUPS_TRANSLATION?.title}
      NO_DATA_TITLE={FIXTURE_LINEUPS_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_LINEUPS_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && browser && $userBetarenaSettings.country_bookmaker}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_LINEUPS_TRANSLATION?.title}
    />

    <div
      class="widget-component"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      <!-- 
      📱 MOBILE
      -->
      {#if mobileExclusive}

        <!-- 
        [ℹ] toggle lineup team
        -->
        <div
          id="lineup-top-view-box-select"
          class="
            row-space-out
          "
        >
          <!--
          [ℹ] home team btn. 
          -->
          <button
            class="
              row-space-start
              team-select-btn
            "
            class:activeOpt={selected_view ==
              'home'}
            on:click={() =>
              (selected_view = 'home')}
          >
            <img
              src={FIXTURE_LINEUPS?.home
                ?.team_logo}
              alt="default alt text"
              width="20px"
              height="20px"
              class="sel-team-img"
            />
            <p
              class="
                w-500
                color-black-2
              "
            >
              {FIXTURE_LINEUPS?.home
                ?.team_short_code}
            </p>
          </button>
          <!--
          [ℹ] away team btn. 
          -->
          <button
            class="
              row-space-end
              team-select-btn
            "
            class:activeOpt={selected_view ==
              'away'}
            on:click={() =>
              (selected_view = 'away')}
          >
            <p
              class="
                w-500
                color-black-2
              "
            >
              {FIXTURE_LINEUPS?.away
                ?.team_short_code}
            </p>
            <img
              src={FIXTURE_LINEUPS?.away
                ?.team_logo}
              alt="default alt text"
              width="20px"
              height="20px"
              class="sel-team-img"
            />
          </button>
        </div>

        <!-- 
        [ℹ] team visiualization 
        -->
        <div id="lineup-vector-box">
          <div id="lineup-vector">
            {#if selected_view == 'home'}
              <LineupVectorMobile />
            {:else}
              <LineupVectorMobileAway />
            {/if}
          </div>
          <!-- 
          [ℹ] lineup - absolute box 
          -->
          <div id="overlay-player-pos-box">
            <!-- 
            [ℹ] home 
            -->
            {#if selected_view == 'home' && homeTeamFormMap.size != 0}
              {#each Array.from(homeTeamFormMap.values()) || [] as players_list}
                <div id="overlay-column">
                  {#each Array.from(players_list) || [] as player}
                    <LineupPlayerVisual
                      PLAYER_INFO={player}
                      STATUS={FIXTURE_LINEUPS?.status}
                    />
                  {/each}
                </div>
              {/each}
              <!-- 
            [ℹ] away 
            -->
            {:else}
              {#each Array.from(awayTeamFormMap.values()) || [] as players_list}
                <div id="overlay-column">
                  {#each Array.from(players_list) || [] as player}
                    <LineupPlayerVisual
                      PLAYER_INFO={player}
                      STATUS={FIXTURE_LINEUPS?.status}
                    />
                  {/each}
                </div>
              {/each}
            {/if}
          </div>
        </div>

        <!-- 
        [ℹ] selected lineup - home / away (logo) 
        -->
        <div
          class="
            row-space-out
            team-main-select
          "
        >
          <div
            class="
              row-space-start
            "
          >
            <!-- 
            [ℹ] team icon 
            -->
            <img
              src={FIXTURE_LINEUPS[
                selected_view
              ]?.team_logo}
              alt="default alt text"
              width="40"
              height="40"
              class="main-team-img"
            />
            <!-- 
            [ℹ] team name 
            -->
            <p
              class="
                w-500
                color-black-2
              "
            >
              {FIXTURE_LINEUPS[selected_view]
                ?.team_name}
              <br />
              <span
                class="
                  w-400
                  color-grey
                "
              >
                {FIXTURE_LINEUPS[selected_view]
                  ?.formation || ''}
              </span>
            </p>
          </div>
          <!-- 
          [ℹ] team-rating 
          -->
          {#if ['FT', 'FT_PEN'].includes(FIXTURE_LINEUPS?.status) && FIXTURE_LINEUPS[selected_view]?.team_rating != undefined}
            <p
              id="box-goals"
              class="medium w-500"
              class:rating_bronze={parseFloat(
                FIXTURE_LINEUPS[
                  selected_view
                ]?.team_rating.toString()
              ) >= 0 &&
                parseFloat(
                  FIXTURE_LINEUPS[
                    selected_view
                  ]?.team_rating.toString()
                ) < 7}
              class:rating_silver={parseFloat(
                FIXTURE_LINEUPS[
                  selected_view
                ]?.team_rating.toString()
              ) >= 7 &&
                parseFloat(
                  FIXTURE_LINEUPS[
                    selected_view
                  ]?.team_rating.toString()
                ) < 9}
              class:rating_golden={parseFloat(
                FIXTURE_LINEUPS[
                  selected_view
                ]?.team_rating.toString()
              ) >= 9}
            >
              {FIXTURE_LINEUPS[selected_view]
                ?.team_rating}
            </p>
          {/if}
        </div>

        <!-- 
        [ℹ] selected lineup - home / away 
        -->
        <div class="lineup-box">
          <!-- 
          [ℹ] coach single - home / away 
          -->
          <div
            class="
              row-space-start
              player-row
            "
          >
            <!-- 
            [ℹ] player avatar
            -->
            <img
              src={FIXTURE_LINEUPS[
                selected_view
              ]?.coach_avatar}
              alt="default alt text"
              width="40"
              height="40"
              class="lineup-img"
              on:error={(e) =>
                (e.target.src =
                  'https://cdn.sportmonks.com/images/soccer/placeholder.png')}
            />
            <!-- 
            [ℹ] player name 
            -->
            <p
              class="
                w-500
                color-black-2
                lineup-player-name
              "
            >
              {FIXTURE_LINEUPS[selected_view]
                ?.coach_name}
              <br />
              <span
                class="
                  w-400
                  color-grey
                "
              >
                {FIXTURE_LINEUPS_TRANSLATION[
                  'c'
                ]}
              </span>
            </p>
          </div>
          <!-- 
          [ℹ] rest of lineup-team 
          -->
          {#each FIXTURE_LINEUPS?.[selected_view]?.bench || [] as player}
            <LineupPlayerRow
              TYPE="R"
              PLAYER_INFO={player}
              {FIXTURE_LINEUPS_TRANSLATION}
              STATUS={FIXTURE_LINEUPS?.status}
            />
          {/each}
        </div>

      <!-- 
      💻 TABLET 🖥️ LAPTOP
      -->
      {:else}

        <!-- 
        [ℹ] team visiualization 
        -->
        <div
          id="lineup-vector-box">

          <div
            id="lineup-vector">
            <LineupVectorTablet />
          </div>

          <!-- 
          [ℹ] lineup - absolute box 
          -->
          <div
            id="overlay-player-pos-box"
            class="row-space-out"
          >
            <!--
            HOME TEAM
            -->
            <div
              class="overlay-grid"
              style="width: 100%;"
            >
              {#each Array.from(homeTeamFormMap.values()) || [] as players_list}
                <div 
                  id="overlay-column">
                  {#each Array.from(players_list) || [] as player}
                    <LineupPlayerVisual
                      PLAYER_INFO={player}
                      STATUS={FIXTURE_LINEUPS?.status}
                    />
                  {/each}
                </div>
              {/each}
            </div>

            <!-- 
            AWAY TEAM 
            -->
            <div
              class="overlay-grid"
              style="width: 100%;"
            >
              {#each Array.from(awayTeamFormMap.values()) || [] as players_list}
                <div 
                  id="overlay-column">
                  {#each Array.from(players_list) || [] as player}
                    <LineupPlayerVisual
                      PLAYER_INFO={player}
                      STATUS={FIXTURE_LINEUPS?.status}
                    />
                  {/each}
                </div>
              {/each}
            </div>

          </div>

        </div>

        <!-- 
        [ℹ] team info ROW 
        -->
        <div
          id="team-info-box"
          class="row-space-out"
        >
          <!-- 
          home team info 
          -->
          <div
            class="
              row-space-start
              team-main-select
            "
          >
            <!-- 
            [ℹ] team-info 
            -->
            <div
              class="
                row-space-start
              "
              style="width: auto;"
            >
              <!-- 
              [ℹ] team icon 
              -->
              <img
                src={FIXTURE_LINEUPS?.home?.team_logo}
                alt="default alt text"
                width="40"
                height="40"
                class="main-team-img"
              />
              <!-- 
              [ℹ] team name 
              -->
              <p
                class="
                  w-500
                  color-black-2
                  team-name
                "
              >
                {FIXTURE_LINEUPS?.home?.team_name}
                <br />
                <span
                  class="
                    w-400
                    color-grey
                  "
                >
                  {FIXTURE_LINEUPS?.home?.formation || ''}
                </span>
              </p>
            </div>
            
            <!-- 
            [ℹ] team-rating 
            -->
            {#if ['FT', 'FT_PEN'].includes(FIXTURE_LINEUPS?.status) && FIXTURE_LINEUPS?.home?.team_rating != undefined}
              <p
                id="box-goals"
                class="medium w-500"
                class:rating_bronze={parseFloat(
                  FIXTURE_LINEUPS?.home?.team_rating.toString()
                ) >= 0 &&
                  parseFloat(
                    FIXTURE_LINEUPS?.home?.team_rating.toString()
                  ) < 7}
                class:rating_silver={parseFloat(
                  FIXTURE_LINEUPS?.home?.team_rating.toString()
                ) >= 7 &&
                  parseFloat(
                    FIXTURE_LINEUPS?.home?.team_rating.toString()
                  ) < 9}
                class:rating_golden={parseFloat(
                  FIXTURE_LINEUPS?.home?.team_rating.toString()
                ) >= 9}
              >
                {FIXTURE_LINEUPS?.home
                  ?.team_rating}
              </p>
            {/if}
          </div>

          <!-- 
          [ℹ] away team info 
          -->
          <div
            class="
              row-space-end
              team-main-select
            "
          >
            <!-- 
            [ℹ] team-rating 
            -->
            {#if ['FT', 'FT_PEN'].includes(FIXTURE_LINEUPS?.status) && FIXTURE_LINEUPS?.away?.team_rating != undefined}
              <p
                id="box-goals"
                class="medium w-500"
                class:rating_bronze={parseFloat(
                  FIXTURE_LINEUPS?.away?.team_rating.toString()
                ) >= 0 &&
                  parseFloat(
                    FIXTURE_LINEUPS?.away?.team_rating.toString()
                  ) < 7}
                class:rating_silver={parseFloat(
                  FIXTURE_LINEUPS?.away?.team_rating.toString()
                ) >= 7 &&
                  parseFloat(
                    FIXTURE_LINEUPS?.away?.team_rating.toString()
                  ) < 9}
                class:rating_golden={parseFloat(
                  FIXTURE_LINEUPS?.away?.team_rating.toString()
                ) >= 9}
              >
                {FIXTURE_LINEUPS?.away
                  ?.team_rating}
              </p>
            {/if}
            <!-- 
            [ℹ] team-info 
            -->
            <div
              class="
                row-space-end
              "
              style="width: auto;"
            >
              <!-- 
              [ℹ] team name 
              -->
              <p
                class="
                  w-500
                  color-black-2
                  team-name
                "
              >
                {FIXTURE_LINEUPS?.away
                  ?.team_name}
                <br />
                <span
                  class="
                    w-400
                    color-grey
                  "
                >
                  {FIXTURE_LINEUPS?.away
                    ?.formation || ''}
                </span>
              </p>
              <!-- 
              [ℹ] team icon 
              -->
              <img
                src={FIXTURE_LINEUPS?.away
                  ?.team_logo}
                alt="default alt text"
                width="40px"
                height="40px"
                class="main-team-img"
              />
            </div>
          </div>
        </div>

        <!-- 
        [ℹ] team lineup ROW 
        -->
        <div
          id="team-lineup-box"
          class="row-space-out"
        >
          <!-- 
          [ℹ] home lineup -->
          <div class="lineup-box">
            <!-- 
            [ℹ] coach single - home / away -->
            <div
              class="
                row-space-start
                player-row
              "
            >
              <!-- 
              [ℹ] coach avatar -->
              <img
                src={FIXTURE_LINEUPS.home
                  ?.coach_avatar}
                alt="default alt text"
                width="40px"
                height="40px"
                class="lineup-img"
                on:error={(e) =>
                  (e.target.src =
                    'https://cdn.sportmonks.com/images/soccer/placeholder.png')}
              />
              <!-- 
              [ℹ] coach name -->
              <p
                class="
                  w-500
                  color-black-2
                  lineup-player-name
                "
              >
                {FIXTURE_LINEUPS.home?.coach_name}
                <br />
                <span
                  class="
                    w-400
                    color-grey
                  "
                >
                  {FIXTURE_LINEUPS_TRANSLATION[
                    'c'
                  ]}
                </span>
              </p>
            </div>
            <!-- 
            [ℹ] rest of lineup-team -->
            {#each FIXTURE_LINEUPS?.home?.bench || [] as player}
              <LineupPlayerRow
                TYPE="R"
                PLAYER_INFO={player}
                {FIXTURE_LINEUPS_TRANSLATION}
                STATUS={FIXTURE_LINEUPS?.status}
              />
            {/each}
          </div>

          <!--
          [ℹ] divider -->
          <div id="divider" />

          <!-- 
          [ℹ] away lineup -->
          <div class="lineup-box">
            <!-- 
            [ℹ] coach single - home / away -->
            <div
              class="
                row-space-end
                player-row
              "
            >
              <!-- 
              [ℹ] coach name -->
              <p
                class="
                  w-500
                  color-black-2
                  lineup-player-name
                "
              >
                {FIXTURE_LINEUPS?.away
                  ?.coach_name}
                <br />
                <span
                  class="
                    w-400
                    color-grey
                  "
                >
                  {FIXTURE_LINEUPS_TRANSLATION[
                    'c'
                  ]}
                </span>
              </p>
              <!-- 
              [ℹ] player avatar -->
              <img
                src={FIXTURE_LINEUPS?.away
                  ?.coach_avatar}
                alt="default alt text"
                width="40px"
                height="40px"
                class="lineup-img"
                on:error={(e) =>
                  (e.target.src =
                    'https://cdn.sportmonks.com/images/soccer/placeholder.png')}
              />
            </div>
            <!-- 
            [ℹ] rest of lineup-team -->
            {#each FIXTURE_LINEUPS?.away?.bench || [] as player}
              <LineupPlayerRow
                TYPE="L"
                PLAYER_INFO={player}
                {FIXTURE_LINEUPS_TRANSLATION}
                STATUS={FIXTURE_LINEUPS?.status}
              />
            {/each}
          </div>
        </div>
        
      {/if}
    </div>
    
	{/if}
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* 
  top-box btn view select 
  */
	div#lineup-top-view-box-select 
  {
		margin: 20px 20px 0 20px;
		/* o */
		width: auto;
	}
	div#lineup-top-view-box-select button.team-select-btn 
  {
		background-color: transparent;
		border: 1px solid #cccccc !important;
		width: 100%;
		padding: 10px;
		max-height: 40px;
	}
	div#lineup-top-view-box-select button.team-select-btn	p 
  {
		font-size: 14px;
	}
	div#lineup-top-view-box-select button.team-select-btn:hover:active,
	div#lineup-top-view-box-select button.team-select-btn.activeOpt 
  {
		border: 1px solid #f5620f !important;
	}
	div#lineup-top-view-box-select button.team-select-btn:first-child 
  {
		border-radius: 8px 0px 0px 8px;
	}
	div#lineup-top-view-box-select button.team-select-btn:first-child	img.sel-team-img 
  {
		margin-right: 8px;
	}
	div#lineup-top-view-box-select button.team-select-btn:last-child 
  {
		border-radius: 0px 8px 8px 0px;
	}
	div#lineup-top-view-box-select button.team-select-btn:last-child img.sel-team-img 
  {
		margin-left: 8px;
	}

	/* 
  lineup-vector box 
  */
	div#lineup-vector-box 
  {
		position: relative;
		padding: 8px 20px;
	}
	div#lineup-vector-box div#lineup-vector 
  {
    /* p */
		position: absolute;
		z-index: 0;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: 8px 20px;
	}
	div#lineup-vector-box	div#overlay-player-pos-box 
  {
		display: grid;
		grid-template-columns: repeat(auto-fill, 1fr);
		grid-template-rows: 1fr;
		grid-auto-flow: column;
		align-items: center;
		align-content: center;
		/* dynamic */
		z-index: 1;
		position: relative;
		padding: 15px;
		min-height: 400px;
		height: 400px;
		max-height: 400px;
	}
	div#lineup-vector-box	div#overlay-player-pos-box div#overlay-column 
  {
		display: grid;
		gap: 8px;
		height: -webkit-fill-available;
		height: -moz-available;
	}

	/* 
  main team select 
  */
	div.team-main-select 
  {
		padding: 15px 0;
		margin: 0 20px 8px 20px;
		border-bottom: 1px solid #e6e6e6;
		width: auto;
	}
	div.team-main-select img.main-team-img 
  {
		/* dynamic */
		margin-right: 16px;
	}
	div.team-main-select p 
  {
		/* dynamic */
		font-size: 14px;
	}
	div.team-main-select p#box-goals 
  {
		box-sizing: border-box;
		text-align: center;
		border-radius: 30px;
		padding: 1.5px 8px;
		max-height: 24px;
		width: auto;
		color: white;
	}
	div.team-main-select p#box-goals.rating_bronze 
  {
		background-color: #dbb884 !important;
	}
	div.team-main-select p#box-goals.rating_silver 
  {
		background-color: #8c8c8c !important;
	}
	div.team-main-select p#box-goals.rating_golden 
  {
		background-color: #ffb904 !important;
	}

	/* 
  lineup-box - coach-only 
  */
	div.lineup-box div.player-row 
  {
		padding: 8px 20px;
	}
	div.lineup-box div.player-row img.lineup-img 
  {
		object-fit: contain;
		border-radius: 50%;
		border: 1px solid #e6e6e6;
		margin-right: 16px;
	}
	div.lineup-box div.player-row	p.lineup-player-name 
  {
		font-size: 14px;
	}
	div.lineup-box:last-child	div.player-row img.lineup-img 
  {
		margin-right: 16px;
	}
	div.lineup-box:last-child	div.player-row p.lineup-player-name 
  {
		text-align: start;
	}

	/*
  =============
  RESPONSIVNESS 
  =============
  */

	@media only screen 
  and (min-width: 726px) 
  and (max-width: 1000px) 
  {
    /* NaN */
  }

	@media only screen 
  and (min-width: 726px) 
  {
		/* 
    lineup-vector box 
    */
		div#lineup-vector-box 
    {
			padding: 20px 20px 8px 20px;
		}
		div#lineup-vector-box div#lineup-vector 
    {
        margin: 20px 20px 8px 20px;
		}
		div#lineup-vector-box	div#overlay-player-pos-box 
    {
			display: flex !important;
			/* min-height: unset; */
			/* max-height: unset; */
		}
		div#lineup-vector-box	div#overlay-player-pos-box div.overlay-grid 
    {
			display: grid;
			grid-template-columns: repeat(
				auto-fill,
				1fr
			);
			grid-template-rows: 1fr;
			grid-auto-flow: column;
			align-items: center;
			align-content: center;
			height: -webkit-fill-available;
			/* height: -moz-available; */
			height: inherit;
		}
		div#lineup-vector-box div#overlay-player-pos-box div.overlay-grid	div#overlay-column 
    {
			height: -webkit-fill-available;
			/* height: -moz-available; */
			height: inherit;
		}

		/* 
    main team select 
    */
		div#team-info-box div.team-main-select 
    {
			padding: 15px 0;
			border-bottom: 1px solid #e6e6e6;
			width: 100%;
		}
		div#team-info-box	div.team-main-select:first-child 
    {
			margin: 0 0 8px 20px;
		}
		div#team-info-box	div.team-main-select:last-child 
    {
			margin: 0 20px 8px 0;
		}
		div#team-info-box	div.team-main-select:first-child img.main-team-img 
    {
			margin-right: 16px;
		}
		div#team-info-box	div.team-main-select:last-child	img.main-team-img 
    {
			margin-left: 16px;
		}
		div#team-info-box	div.team-main-select:first-child p.team-name 
    {
			margin-right: 16px;
		}
		div#team-info-box div.team-main-select:last-child	p.team-name 
    {
			margin-left: 16px;
		}
		div#team-info-box	div.team-main-select p#box-goals 
    {
			box-sizing: border-box;
			text-align: center;
			border-radius: 30px;
			padding: 1.5px 8px;
			max-height: 24px;
			width: auto;
			color: white;
		}
		div#team-info-box	div.team-main-select p#box-goals.rating_golden 
    {
			background-color: #ffb904 !important;
		}
		div#team-info-box div.team-main-select p#box-goals.rating_silver 
    {
			background-color: #8c8c8c !important;
		}
		div#team-info-box	div.team-main-select p#box-goals.rating_bronze 
    {
			background-color: #dbb884 !important;
		}

		/* 
    main team lineup 
    */
		div#team-lineup-box 
    {
			align-items: flex-start;
			position: relative;
		}
		div#team-lineup-box div.lineup-box 
    {
			width: 100%;
		}
		div#team-lineup-box	div.lineup-box:last-child	div.player-row img.lineup-img 
    {
			margin-left: 16px;
		}
		div#team-lineup-box	div.lineup-box:last-child div.player-row p.lineup-player-name 
    {
			text-align: end;
		}

		/* 
    lineup divider 
    */
		div#divider 
    {
			background-color: #e6e6e6;
			width: 1px;
			position: absolute;
			bottom: 0;
			top: 0;
			height: -webkit-fill-available;
			margin: auto;
			right: 50%;
		}
	}

	@media only screen 
  and (min-width: 1000px) 
  {
    /* NaN */
	}

	@media only screen 
  and (min-width: 1160px) 
  {
    /* NaN */
	}

	/*
  =============
  DARK-THEME
  =============
  */

	:global(div#lineup-widget-container.dark-background-1	div#team-info-box	div.team-main-select) 
  {
		border-bottom: 1px solid #616161;
	}
	div#lineup-widget-container.dark-background-1	div#divider 
  {
		background-color: #616161;
	}
	div#lineup-widget-container.dark-background-1	div.team-main-select 
  {
		border-bottom: 1px solid #616161;
	}
  
</style>
