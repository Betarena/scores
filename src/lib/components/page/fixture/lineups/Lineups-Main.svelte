<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import { onceTargetLivescoreNowFixtureGet, targetLivescoreNowFixtureListen } from '$lib/firebase/common.js';
	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { dlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { LIN_F_dataInject, LIN_F_obtainPlayerIdList } from '@betarena/scores-lib/dist/functions/func.fixture.lineups.js';
	
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import LineupPlayerRow from './Lineup_Player_Row.svelte';
	import LineupPlayerVisual from './Lineup_Player_Visual.svelte';
	import LineupVectorMobile from './Lineup_Vector_Mobile.svelte';
	import LineupVectorMobileAway from './Lineup_Vector_Mobile_Away.svelte';
	import LineupVectorTablet from './Lineup_Vector_Tablet.svelte';

  import type { B_H_SFPV2 } from '@betarena/scores-lib/types/hasura.js';
  import type { B_LIN_D, B_LIN_T, LIN_Player } from '@betarena/scores-lib/types/lineups.js';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	// export let FIXTURE_INFO:                 REDIS_CACHE_SINGLE_fixtures_page_info_response;
	export let FIXTURE_LINEUPS: B_LIN_D;
	export let FIXTURE_LINEUPS_TRANSLATION: B_LIN_T;

	const formation_pos_arr = ['G', 'D', 'M', 'A'];

	let loaded: boolean = false;
	let refresh: boolean = false;
	let refresh_data: any = undefined;
	let no_widget_data: any = false;
	let selected_view: 'home' | 'away' = 'home';
	let home_team_formation_map = new Map< string, LIN_Player[] >();
	let away_team_formation_map = new Map< string, LIN_Player[]	>();
	let show_placeholder: boolean = false;
  let playerMap = new Map <number, B_H_SFPV2>();

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

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1000;
	const MOBILE_VIEW = 725;
	let mobileExclusive,
		tabletExclusive: boolean = false;

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

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE METHODS
	// CRITICAL
	// ~~~~~~~~~~~~~~~~~~~~~

	$: refresh_data =	$userBetarenaSettings.country_bookmaker;

	$: if (browser && refresh_data) 
  {
		// [ℹ] reset necessary variables;
		refresh = true;
		loaded = false;
		no_widget_data = false;
		// widget_init()
		setTimeout(async () => {
			refresh = false;
		}, 100);
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// [ADD-ON] FIREBASE
	// ~~~~~~~~~~~~~~~~~~~~~

  /**
   * @summary
   * [MAIN]
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

    // NOTE: check if the "cache/hasura" data is "invalid"
    // NOTE: requiring an "auto-lineup" live-data generation
    // NOTE: on the spot, by the widget, using "livescores" data;
    const if_M_0 =
      FIXTURE_LINEUPS.home.lineup.length == 0 
      && FIXTURE_LINEUPS.away.lineup.length == 0 
      && FIXTURE_LINEUPS.home.bench.length == 0 
      && FIXTURE_LINEUPS.away.bench.length == 0 
      && FIREBASE_LINEUPS_DATA != undefined 
      && FIREBASE_BENCH_DATA != undefined
    ;
    if (if_M_0) 
    {
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
      FIREBASE_LINEUPS_DATA,
      FIREBASE_BENCH_DATA,
      FIXTURE_LINEUPS.events,
      playerMap
    );

    const [
      awayTeamLineup,
      awayTeamBench
    ] = await LIN_F_dataInject
    (
      away_team_id,
      FIREBASE_LINEUPS_DATA,
      FIREBASE_BENCH_DATA,
      FIXTURE_LINEUPS.events,
      playerMap
    );

    FIXTURE_LINEUPS.home.lineup =	homeTeamLineup;
    FIXTURE_LINEUPS.home.bench = homeTeamBench;

    FIXTURE_LINEUPS.away.lineup =	awayTeamLineup;
    FIXTURE_LINEUPS.away.bench = awayTeamBench;

    // IMPORTANT
    FIXTURE_LINEUPS = FIXTURE_LINEUPS;
  }

  onMount
  (
    async() => 
    {

      if (['FT', 'FT_PEN'].includes(FIXTURE_LINEUPS?.status)) return;
    
      // NOTE: causes a potential delay in data retrieval,
      // as waits for onMount of Page & components;
      await onceTargetLivescoreNowFixtureGet
      (
        `livescores_now/${FIXTURE_LINEUPS?.id}`
      );

      let connectionRef = targetLivescoreNowFixtureListen
      (
        `livescores_now/${FIXTURE_LINEUPS?.id}`
      );
      // FIREBASE_CONNECTIONS_SET.add(connectionRef)

      document.addEventListener
      (
        'visibilitychange',
        async function
        (
        ) 
        {
          if (!document.hidden) {
            dlog('🔵 user is active', true)
            await onceTargetLivescoreNowFixtureGet
            (
              `livescores_now/${FIXTURE_LINEUPS?.id}`
            );
            let connectionRef = targetLivescoreNowFixtureListen
            (
              `livescores_now/${FIXTURE_LINEUPS?.id}`
            );
            // FIREBASE_CONNECTIONS_SET.add(connectionRef)
          }
        }
      );
    }
  );

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

  $: if_R_0 = 
    FIXTURE_LINEUPS
		&& browser
		&& FIXTURE_LINEUPS?.away?.formation ==	undefined 
    && FIXTURE_LINEUPS?.home?.formation ==	undefined 
    && 
    (FIXTURE_LINEUPS?.away?.lineup == undefined 
    || FIXTURE_LINEUPS?.away?.lineup.length == 0) 
    && 
    (FIXTURE_LINEUPS?.home?.lineup == undefined 
    || FIXTURE_LINEUPS?.home?.lineup.length == 0)
  ;
	$: if (if_R_0) 
  {
		no_widget_data = true;
		loaded = true;
	} 
  else 
  {
		no_widget_data = false;
	}

  $: if_R_1 =
    FIXTURE_LINEUPS
		&& browser
		&& FIXTURE_LINEUPS?.away?.formation
		&& FIXTURE_LINEUPS?.home?.formation
		&& 
      (FIXTURE_LINEUPS?.away?.lineup != undefined 
      || FIXTURE_LINEUPS?.away?.lineup.length != 0) 
    &&
		  (FIXTURE_LINEUPS?.home?.lineup != undefined
			|| FIXTURE_LINEUPS?.home?.lineup.length != 0)
  ;
	$: if (if_R_1) 
  {

		// NOTE: HOME TEAM
		let rt_home_count = 0;
		let count_pos_diff = 0;
		let home_team_formation_arr_temp = FIXTURE_LINEUPS?.home?.formation.split('-');
    // add goalkeeper pos
		home_team_formation_arr_temp.unshift('1');
    // reset player-list
		home_team_formation_map = new Map< string, LIN_Player[]	>();

		for (const form_pos of home_team_formation_arr_temp) 
    {
			let form_pos_num = parseInt(form_pos);
			let form_pos_code = form_pos + count_pos_diff.toString();

			for (let i = rt_home_count; i < rt_home_count + form_pos_num;	i++)
      {
				const player = FIXTURE_LINEUPS?.home?.lineup[i];

        const if_M_0 = 
          home_team_formation_map.has(form_pos_code)
        ;

				if (if_M_0) 
        {
					let exist_lineup_list = home_team_formation_map.get(form_pos_code);
					exist_lineup_list.unshift(player);
					home_team_formation_map.set
          (
						form_pos_code,
						exist_lineup_list
					);
				} 
        else 
        {
					const lineup_list = [];
					lineup_list.push(player);
					home_team_formation_map.set
          (
						form_pos_code,
						lineup_list
					);
				}

			}

			count_pos_diff++;
			rt_home_count +=	form_pos_num;
		}

		home_team_formation_map =	home_team_formation_map;

		// NOTE: AWAY TEAM
		rt_home_count = 0;
		count_pos_diff = 0;
		let away_team_formation_arr_temp = FIXTURE_LINEUPS?.away?.formation.split('-');
    // add goalkeeper pos
		away_team_formation_arr_temp.unshift('1');
		away_team_formation_arr_temp.reverse();

		// NOTE: sometimes formation_position can been "null" 
    // ISSUE: #905
		let null_formation = FIXTURE_LINEUPS?.away?.lineup
    .filter
    (
      (
        { 
          formation_position 
        }
      ) =>
        formation_position == undefined
    ).length > 0
      ? true
      : false
    ;

		if (!null_formation) 
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

    // reset player-list
		away_team_formation_map = new Map< string, LIN_Player[]	>();

		for (const form_pos of away_team_formation_arr_temp) 
    {
			let form_pos_num = parseInt(form_pos);
			let form_pos_code = form_pos + count_pos_diff.toString();
			for (let i = rt_home_count;	i < rt_home_count + form_pos_num; i++)
      {
				const player = FIXTURE_LINEUPS?.away?.lineup[i];

				if (
					away_team_formation_map.has(
						form_pos_code
					)
				) {
					let exist_lineup_list =
						away_team_formation_map.get(
							form_pos_code
						);
					exist_lineup_list.unshift(player);
					away_team_formation_map.set(
						form_pos_code,
						exist_lineup_list
					);
				} else {
					const lineup_list = [];
					lineup_list.push(player);
					away_team_formation_map.set(
						form_pos_code,
						lineup_list
					);
				}
			}
			count_pos_diff++;
			rt_home_count =
				rt_home_count + form_pos_num;
		}
		away_team_formation_map =
			away_team_formation_map;
	}
	// [ℹ] only-lineup available
	else if (
		FIXTURE_LINEUPS &&
		browser &&
		(FIXTURE_LINEUPS?.away?.lineup != undefined ||
			FIXTURE_LINEUPS?.away?.lineup.length !=
				0) &&
		(FIXTURE_LINEUPS?.home?.lineup != undefined ||
			FIXTURE_LINEUPS?.home?.lineup.length != 0)
	) {
		// NOTE: home-team
		home_team_formation_map = new Map<
			string,
			LIN_Player[]
		>(); // [ℹ] reset player-list
		for (const form_pos of formation_pos_arr) {
			for (const player of FIXTURE_LINEUPS?.home
				?.lineup) {
				if (form_pos == player?.position) {
					if (
						home_team_formation_map.has(form_pos)
					) {
						let exist_lineup_list =
							home_team_formation_map.get(
								form_pos
							);
						exist_lineup_list.push(player);
						home_team_formation_map.set(
							form_pos,
							exist_lineup_list
						);
					} else {
						const lineup_list = [];
						lineup_list.push(player);
						home_team_formation_map.set(
							form_pos,
							lineup_list
						);
					}
				}
			}
		}
		home_team_formation_map =
			home_team_formation_map;
		// NOTE: away-team
		away_team_formation_map = new Map<
			string,
			LIN_Player[]
		>(); // [ℹ] reset player-list
		for (const form_pos of formation_pos_arr) {
			for (const player of FIXTURE_LINEUPS?.away
				?.lineup) {
				if (form_pos == player?.position) {
					if (
						away_team_formation_map.has(form_pos)
					) {
						let exist_lineup_list =
							away_team_formation_map.get(
								form_pos
							);
						exist_lineup_list.push(player);
						away_team_formation_map.set(
							form_pos,
							exist_lineup_list
						);
					} else {
						const lineup_list = [];
						lineup_list.push(player);
						away_team_formation_map.set(
							form_pos,
							lineup_list
						);
					}
				}
			}
		}
		away_team_formation_map =
			away_team_formation_map;
	}
	// [ℹ] no-lineups && no-formations
	else 
  {
		no_widget_data = true;
		loaded = true;
	}

  $: if ($sessionStore?.livescore_now_fixture_target)
  {
    injectLiveData()
  }

</script>

<!-- ===============
  COMPONENT HTML 
=================-->

<div
	id="widget-outer"
	class:display_none={no_widget_data &&	!show_placeholder}
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
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}
    <h2
      class="
        s-20 
        m-b-10 
        w-500 
        color-black-2
      "
      style="margin-top: 0px;"
      class:color-white={$userBetarenaSettings.theme ==
        'Dark'}
    >
      {FIXTURE_LINEUPS_TRANSLATION?.title}
    </h2>

    <div
      id="lineup-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      <!-- 
      [ℹ] [MOBILE]
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
            {#if selected_view == 'home' && home_team_formation_map.size != 0}
              {#each Array.from(home_team_formation_map.values()) as players_list}
                <div id="overlay-column">
                  {#each Array.from(players_list) as player}
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
              {#each Array.from(away_team_formation_map.values()) as players_list}
                <div id="overlay-column">
                  {#each Array.from(players_list) as player}
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
          {#each FIXTURE_LINEUPS[selected_view].bench as player}
            <LineupPlayerRow
              TYPE="R"
              PLAYER_INFO={player}
              {FIXTURE_LINEUPS_TRANSLATION}
              STATUS={FIXTURE_LINEUPS?.status}
            />
          {/each}
        </div>
        <!-- 
      [ℹ] [TABLET] && [DESKTOP]
      [ℹ] drastic layout change
      -->
      {:else}
        <!-- 
        [ℹ] team visiualization 
        -->
        <div id="lineup-vector-box">
          <div id="lineup-vector">
            <LineupVectorTablet />
          </div>
          <!-- 
          [ℹ] lineup - absolute box 
          [ℹ] home team 
          [ℹ] away team 
          -->
          <div
            id="overlay-player-pos-box"
            class="row-space-out"
          >
            <!-- 
            [ℹ] home 
            -->
            <div
              class="overlay-grid"
              style="width: 100%;"
            >
              {#each Array.from(home_team_formation_map.values()) as players_list}
                <div id="overlay-column">
                  {#each Array.from(players_list) as player}
                    <LineupPlayerVisual
                      PLAYER_INFO={player}
                      STATUS={FIXTURE_LINEUPS?.status}
                    />
                  {/each}
                </div>
              {/each}
            </div>
            <!-- 
            [ℹ] away 
            -->
            <div
              class="overlay-grid"
              style="width: 100%;"
            >
              {#each Array.from(away_team_formation_map.values()) as players_list}
                <div id="overlay-column">
                  {#each Array.from(players_list) as player}
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
          [ℹ] home team info 
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
                src={FIXTURE_LINEUPS?.home
                  ?.team_logo}
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
                {FIXTURE_LINEUPS?.home
                  ?.team_name}
                <br />
                <span
                  class="
                    w-400
                    color-grey
                  "
                >
                  {FIXTURE_LINEUPS?.home
                    ?.formation || ''}
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
        [ℹ] team lineup ROW -->
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
                {FIXTURE_LINEUPS.home
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
            [ℹ] rest of lineup-team -->
            {#each FIXTURE_LINEUPS.home.bench as player}
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
            {#each FIXTURE_LINEUPS.away.bench as player}
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
=================-->

<style>
  
	/* [ℹ] OTHER STYLE / CSS */
	.display_none {
		display: none;
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
	}
	div#lineup-top-view-box-select
		button.team-select-btn {
		background-color: transparent;
		border: 1px solid #cccccc !important;
		width: 100%;
		padding: 10px;
		max-height: 40px;
	}
	div#lineup-top-view-box-select
		button.team-select-btn
		p {
		font-size: 14px;
	}
	div#lineup-top-view-box-select
		button.team-select-btn:hover:active,
	div#lineup-top-view-box-select
		button.team-select-btn.activeOpt {
		border: 1px solid #f5620f !important;
	}
	div#lineup-top-view-box-select
		button.team-select-btn:first-child {
		border-radius: 8px 0px 0px 8px;
	}
	div#lineup-top-view-box-select
		button.team-select-btn:first-child
		img.sel-team-img {
		margin-right: 8px;
	}
	div#lineup-top-view-box-select
		button.team-select-btn:last-child {
		border-radius: 0px 8px 8px 0px;
	}
	div#lineup-top-view-box-select
		button.team-select-btn:last-child
		img.sel-team-img {
		margin-left: 8px;
	}

	/* lineup-vector box */
	div#lineup-vector-box {
		position: relative;
		padding: 8px 20px;
	}
	div#lineup-vector-box div#lineup-vector {
		position: absolute;
		z-index: 0;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: 8px 20px;
	}
	div#lineup-vector-box
		div#overlay-player-pos-box {
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
	div#lineup-vector-box
		div#overlay-player-pos-box
		div#overlay-column {
		display: grid;
		gap: 8px;
		height: -webkit-fill-available;
		height: -moz-available;
	}

	/* main team select */
	div.team-main-select {
		padding: 15px 0;
		margin: 0 20px 8px 20px;
		border-bottom: 1px solid #e6e6e6;
		width: auto;
	}
	div.team-main-select img.main-team-img {
		/* dynamic */
		margin-right: 16px;
	}
	div.team-main-select p {
		/* dynamic */
		font-size: 14px;
	}
	div.team-main-select p#box-goals {
		box-sizing: border-box;
		text-align: center;
		border-radius: 30px;
		padding: 1.5px 8px;
		max-height: 24px;
		width: auto;
		color: white;
	}
	div.team-main-select p#box-goals.rating_bronze {
		background-color: #dbb884 !important;
	}
	div.team-main-select p#box-goals.rating_silver {
		background-color: #8c8c8c !important;
	}
	div.team-main-select p#box-goals.rating_golden {
		background-color: #ffb904 !important;
	}

	/* lineup-box - coach-only */
	div.lineup-box div.player-row {
		padding: 8px 20px;
	}
	div.lineup-box div.player-row img.lineup-img {
		object-fit: contain;
		border-radius: 50%;
		border: 1px solid #e6e6e6;
		margin-right: 16px;
	}
	div.lineup-box
		div.player-row
		p.lineup-player-name {
		font-size: 14px;
	}
	div.lineup-box:last-child
		div.player-row
		img.lineup-img {
		margin-right: 16px;
	}
	div.lineup-box:last-child
		div.player-row
		p.lineup-player-name {
		text-align: start;
	}

	/* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) and (max-width: 1000px) {
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
		}
		div#lineup-vector-box div#lineup-vector {
			margin: 20px 20px 8px 20px;
		}
		div#lineup-vector-box
			div#overlay-player-pos-box {
			display: flex !important;
			/* min-height: unset; */
			/* max-height: unset; */
		}
		div#lineup-vector-box
			div#overlay-player-pos-box
			div.overlay-grid {
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
		div#lineup-vector-box
			div#overlay-player-pos-box
			div.overlay-grid
			div#overlay-column {
			height: -webkit-fill-available;
			/* height: -moz-available; */
			height: inherit;
		}

		/* main team select */
		div#team-info-box div.team-main-select {
			padding: 15px 0;
			border-bottom: 1px solid #e6e6e6;
			width: 100%;
		}
		div#team-info-box
			div.team-main-select:first-child {
			margin: 0 0 8px 20px;
		}
		div#team-info-box
			div.team-main-select:last-child {
			margin: 0 20px 8px 0;
		}
		div#team-info-box
			div.team-main-select:first-child
			img.main-team-img {
			margin-right: 16px;
		}
		div#team-info-box
			div.team-main-select:last-child
			img.main-team-img {
			margin-left: 16px;
		}
		div#team-info-box
			div.team-main-select:first-child
			p.team-name {
			margin-right: 16px;
		}
		div#team-info-box
			div.team-main-select:last-child
			p.team-name {
			margin-left: 16px;
		}
		div#team-info-box
			div.team-main-select
			p#box-goals {
			box-sizing: border-box;
			text-align: center;
			border-radius: 30px;
			padding: 1.5px 8px;
			max-height: 24px;
			width: auto;
			color: white;
		}
		div#team-info-box
			div.team-main-select
			p#box-goals.rating_golden {
			background-color: #ffb904 !important;
		}
		div#team-info-box
			div.team-main-select
			p#box-goals.rating_silver {
			background-color: #8c8c8c !important;
		}
		div#team-info-box
			div.team-main-select
			p#box-goals.rating_bronze {
			background-color: #dbb884 !important;
		}

		/* main team lineup */
		div#team-lineup-box {
			align-items: flex-start;
			position: relative;
		}
		div#team-lineup-box div.lineup-box {
			width: 100%;
		}
		div#team-lineup-box
			div.lineup-box:last-child
			div.player-row
			img.lineup-img {
			margin-left: 16px;
		}
		div#team-lineup-box
			div.lineup-box:last-child
			div.player-row
			p.lineup-player-name {
			text-align: end;
		}

		/* lineup divider */
		div#divider {
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

	:global(div#lineup-widget-container.dark-background-1
			div#team-info-box
			div.team-main-select) {
		border-bottom: 1px solid #616161;
	}
	div#lineup-widget-container.dark-background-1
		div#divider {
		background-color: #616161;
	}
	div#lineup-widget-container.dark-background-1
		div.team-main-select {
		border-bottom: 1px solid #616161;
	}
</style>
