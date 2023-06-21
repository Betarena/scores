<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ [MAIN] Package Imports

  import { browser, dev } from '$app/environment';
  import { onMount } from 'svelte';

	import { get } from '$lib/api/utils';
	import { createFixtureOddsPath, oneOffOddsDataGet, targetLivescoreNowFixtureOddsListenMulti } from '$lib/firebase/common.js';
	import { sessionStore } from '$lib/store/session';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { MONTH_NAMES_ABBRV, toISOMod, weekDays } from '$lib/utils/dates.js';
	import { FIX_W_T_STY, FIX_W_T_TAG, FIX_W_T_TOG, dlog, dlogv2 } from '$lib/utils/debug';
	import { googleEventLog, viewport_change } from '$lib/utils/platform-functions';
	import { FIXTURE_FULL_TIME_OPT } from '@betarena/scores-lib/dist/api/sportmonks.js';

	import type { FIREBASE_odds } from '@betarena/scores-lib/types/firebase.js';
	import type { B_FO_D, B_FO_T, FO_Main, FO_Rounds_Data, FO_Season, FO_Weeks_Data } from '@betarena/scores-lib/types/fixture-odds';
	import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
	import type { Unsubscribe } from 'firebase/database';

  import one_red_card from './assets/1_red_card.svg';
  import one_red_card_dark from './assets/1_red_card_dark.svg';
  import two_red_card from './assets/2_red_cards.svg';
  import two_red_card_dark from './assets/2_red_cards_dark.svg';
  import three_red_card from './assets/3_red_cards.svg';
  import three_red_card_dark from './assets/3_red_cards_dark.svg';
  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';
  import play_dark from './assets/play-dark.svg';
  import play from './assets/play.svg';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import FixtureOddsLoader from './FixtureOdds-Loader.svelte';

  // #endregion ➤ [MAIN] Package Imports

  // #region ➤ [VARIABLES]

  export let FIXTURES_ODDS_T: B_FO_T;
	export let FIXTURES_ODDS_DATA: B_FO_D;

	let noWidgetData: boolean = false;
	let toggleDropdown: boolean = false;
	let trueLengthOfArray: number;
	let optView: 'round' | 'week' = 'week';
	let fixtures_arr_filter:
  {
		date: Date;
		fixtures: FO_Main[];
	}[] = [];
	let selectedOpt: 'odds' | 'matches' = 'matches';
	let tickSecShow: boolean = false;
	let week_start: Date;
	let week_end: Date;
	let week_name: number;
	let weeks_total: number;
	let rounds_total: number;
	let total_nav_num: number = weeks_total;
	let current_round_select: FO_Rounds_Data;
	let current_rounds_all: FO_Rounds_Data[];
	let lazyLoadingSeasonFixture: boolean = false;
  let loadedCurrentSeason: boolean = false;
  let currentSeason = $sessionStore.selectedSeasonID;

  let realTimeOddsListenMap: Map < number, Unsubscribe > = new Map<number, Unsubscribe>();

  // IMPORTANT DeepValue (change) Listen
  $: selectedSeasonId = JSON.stringify($sessionStore?.selectedSeasonID)
  $: livescoreNowScoreboardChng = JSON.stringify([...$sessionStore?.livescore_now_scoreboard?.entries()]);
  $: livescoreOddsChng = JSON.stringify([...$sessionStore?.live_odds_fixture_map?.entries()]);

  // #endregion ➤ [VARIABLES]

  // #region ➤ [METHODS]

  /**
   * @summary
   * [HELPER]
   * @description
   * ➨ selects target fixture odds view;
   * @param
   * {'odds' | 'matches'} opt
  */
	function select_table_view
  (
		opt: 'odds' | 'matches'
	): void
  {
		selectedOpt = opt;
	}

  /**
   * @description
   * ➨ simple select week-rounds view;
   * ➨ kickstarts round/week user selection;
   * @returns
   * void (NaN)
  */
	function selected_rounds_weeks_view
  (
		opt_view: 'round' | 'week'
	): void
  {
		optView = opt_view;
		select_fixtures_odds();
	}

  /**
   * @description
   * ➨ simple close all dropdowns
   * @returns
   * void (NaN)
  */
	function close_all_dropdowns
  (
  ): void
  {
		toggleDropdown = false;
	}

  // TODO: DOC:
  function identifyTargetWeekRound
  (
    targetSeason: FO_Season,
    targetRound: FO_Rounds_Data,
    targetWeek: FO_Weeks_Data
  ): void
  {
    const s_date = targetRound?.s_date || targetWeek?.s_date;
    const e_date = targetRound?.e_date || targetWeek?.e_date;
    const value = targetRound?.value || parseInt(targetWeek?.name);

		fixtures_arr_filter = [];
		let temp_fixtures_odds_arr: FO_Main[] = [];

    week_start = new Date(s_date);
    week_end = new Date(e_date);
    week_name = value;

    // ACTION: Round detection exclusive;
    if (targetRound) current_round_select = targetRound;

    // [🐞]
    dlog
    (
      `${FIX_W_T_TAG} week_end: ${week_end}`,
      FIX_W_T_TOG,
      FIX_W_T_STY
    );

    // [ℹ] search fixtures by target data
    // [ℹ] FIXME: only works with "fixture_time" - not with "fixture_date"
    // [ℹ] FIXME: happens to be with dates: "2022-09-19T00:00:00" [?]
    let mod_end_week = new Date(e_date);
    mod_end_week.setHours
    (
      mod_end_week.getHours() + 24
    );

    // [🐞]
    dlog
    (
      `${FIX_W_T_TAG} week_end: ${week_end} | week_start: ${week_start}`,
      FIX_W_T_TOG,
      FIX_W_T_STY
    );

    // [ℹ] search fixtures by target data
    temp_fixtures_odds_arr = targetSeason.fixtures
    ?.filter
    (
      (
        {
          fixture_time
        }
      ) =>
        new Date(fixture_time) >= week_start
        && new Date(fixture_time) <= mod_end_week
    );

    // ACTION: Group fixtures by "day" as map
		const fixtures_group_by_date = new Map < string, FO_Main[] >();

    for (const fixture of temp_fixtures_odds_arr)
    {
      const fixDate = fixture.fixture_date;

      if (fixtures_group_by_date.has(fixDate))
      {
        fixtures_group_by_date.get(fixDate).push(fixture);
        let fix_arr =	fixtures_group_by_date.get(fixDate);

        fix_arr.sort((a, b) =>
            new Date(a.fixture_time).getTime() -
            new Date(b.fixture_time).getTime()
        );

        fixtures_group_by_date.set
        (
          fixDate,
          fix_arr
        );
      }
      else
      {
        let newFixtureArr: FO_Main[] = [];
        newFixtureArr.push(fixture);
        fixtures_group_by_date
        .set
        (
          fixDate,
          newFixtureArr
        );
      }
    }

    for (const [group_date, fixtures_arr] of fixtures_group_by_date.entries())
    {
      const fixObj =
      {
        date: new Date(group_date),
        fixtures: fixtures_arr
      };
      fixtures_arr_filter.push
      (
        fixObj
      );
    }

    fixtures_arr_filter
    ?.sort
    (
      (
        a,
        b
      ) =>
        new Date(a.date).getTime()
        -	new Date(b.date).getTime()
    );

    return;
  }

  // TODO: DOC:
  async function select_fixtures_odds
  (
  ): Promise < void >
  {

		if (FIXTURES_ODDS_DATA == undefined) return;

    // [🐞]
    dlog
    (
      `${FIX_W_T_TAG} select_fixtures_odds() cont.`,
      FIX_W_T_TOG,
      FIX_W_T_STY
    );

		fixtures_arr_filter = [];

		// [🐞]
		// const date = new Date("2023-07-29");
		const date = new Date();

		let target_season = FIXTURES_ODDS_DATA?.seasons
    ?.find
    (
			(
        {
          season_id
        }
      ) =>
			  season_id === $sessionStore.selectedSeasonID
    );

    // [🐞]
		dlogv2
    (
			'FIXTURE ODDS [WIDGET]',
			[
        '⬇️ target_season',
        target_season,
				'⬇️ $sessionStore.selectedSeasonID',
				$sessionStore.selectedSeasonID,
				'⬇️ FIXTURES_ODDS_DATA',
				FIXTURES_ODDS_DATA
			],
			true,
			'background: violet; color: #000000'
		);

    // CHECK: For "past-season" fetch;
    const if_M_0: boolean =
      target_season == undefined
    ;
		if (if_M_0)
    {

      const if_M_0: boolean =
        currentSeason != $sessionStore.selectedSeasonID
        || FIXTURES_ODDS_DATA?.seasons.length == 0
      ;
			if (if_M_0)
      {
				lazyLoadingSeasonFixture = true;

				const dataRes0: B_FO_D = await get
        (
          `/api/hasura/league/fixtures-odds?season_id=${$sessionStore.selectedSeasonID}`
        );
				if (dataRes0 == undefined)
        {
					noWidgetData = true;
					lazyLoadingSeasonFixture = false;
					return;
				}

        FIXTURES_ODDS_DATA.seasons.push
        (
          dataRes0?.seasons?.[0]
        );

        FIXTURES_ODDS_DATA = FIXTURES_ODDS_DATA;
        target_season = dataRes0?.seasons?.[0];
        lazyLoadingSeasonFixture = false;
			}
			else
      {
				noWidgetData = true;
				return;
			}

		}

    // CHECK: For "no data";
    const if_M_1: boolean =
      target_season?.weeks == undefined
      || target_season?.rounds == undefined
      || target_season?.fixtures == undefined
    ;
		if (if_M_1)
    {
			noWidgetData = true;
			return;
		}

    // ACTION: Detect "round" start/end dates;
		if (optView === 'round')
    {
			let target_round: FO_Rounds_Data;

			// NOTE: Complex round targeting selection;
			for (let i = 0; i < target_season?.rounds?.length; i++)
      {
				const s_date: Date = new Date(target_season?.rounds?.[i]?.s_date);
				const e_date: Date = new Date(target_season?.rounds?.[i]?.e_date);
				const past_e_date: Date =
					i == 0
						? null
						: new Date(target_season.rounds[i - 1].s_date)
        ;

        // CHECK: (case) LEAGUE is ON-GOING;
        // (+) user/client date matching fixture week;
        const if_M_0: boolean =
          (s_date <= date && e_date >= date)
          || toISOMod(s_date) == toISOMod(date)
          || toISOMod(e_date) == toISOMod(date)
        ;
				if (if_M_0)
        {
					target_round = target_season?.rounds?.[i];
					break;
				}

        // CHECK: (case) LEAGUE is ON-GOING;
        // (+) a look at future upcoming fixtures;
        const if_M_1: boolean =
          past_e_date !== null
          && past_e_date < date
          && s_date >= date
        ;
				if (if_M_1)
        {
					target_round = target_season?.rounds?.[i];
					break;
				}

        // CHECK: (case) LEAGUE is NOT YET STARTED;
        // (+) a look at future upcoming fixtures;
        const if_M_2: boolean =
          past_e_date === null
          && s_date >= date
        ;
				if (if_M_2)
        {
					target_round = target_season?.rounds?.[i];
					break;
				}

			}

      // CHECK: No target "round" identified;
      // ACTION: Select "last-round" from "past-season";
      const if_M_0: boolean =
        target_round == undefined &&
				new Date(target_season?.rounds?.[target_season?.rounds?.length - 1]?.e_date) < date
      ;
			if (if_M_0)
      {
				target_round =	target_season?.rounds?.[target_season?.rounds?.length - 1];
			}

			// ACTION: Round detection exclusive;
			current_rounds_all = target_season?.rounds;

      identifyTargetWeekRound
      (
        target_season,
        target_round,
        null
      );
		}
    // ACTION: Detect "week" start/end dates;
		else
    {
			let target_week: FO_Weeks_Data;

			// NOTE: Complex "week" targeting selection;
			for (let i = 0; i < target_season.weeks.length;	i++)
      {
				const s_date: Date = new Date(target_season?.weeks?.[i]?.s_date);
				const e_date: Date = new Date(target_season?.weeks?.[i]?.e_date);
				const past_e_date: Date =
					i == 0
						? null
						: new Date(target_season.weeks[i - 1].s_date)
        ;

				// CHECK: (case) LEAGUE is ON-GOING;
        // (+) user/client date matching fixture week;
        const if_M_0: boolean =
          (s_date <= date && e_date >= date)
          || toISOMod(s_date) == toISOMod(date)
          || toISOMod(e_date) == toISOMod(date)
        ;
				if (if_M_0)
        {
					target_week = target_season?.weeks?.[i];
					break;
				}

        // CHECK: (case) LEAGUE is ON-GOING;
        // (+) a look at future upcoming fixtures;
        const if_M_1: boolean =
          past_e_date !== null
          && past_e_date < date
          && s_date >= date
        ;
				if (if_M_1)
        {
					target_week = target_season?.weeks?.[i];
					break;
				}

        // CHECK: (case) LEAGUE is NOT YET STARTED;
        // (+) a look at future upcoming fixtures;
        const if_M_2: boolean =
          past_e_date === null
          && s_date >= date
        ;
				if (if_M_2)
        {
					target_week = target_season?.weeks?.[i];
					break;
				}
			}

      // CHECK: No target "round" identified;
      // ACTION: Select "last-round" from "past-season";
      const if_M_0: boolean =
        target_week == undefined &&
				new Date(target_season?.weeks?.[target_season?.weeks?.length - 1]?.e_date) < date
      ;
			if (if_M_0)
      {
				target_week =	target_season?.weeks?.[target_season?.weeks?.length - 1];
			}

      identifyTargetWeekRound
      (
        target_season,
        null,
        target_week
      );
		}

		// ACTION: Calc. Number of Weeks/Rounds;
		weeks_total = target_season.weeks.length;
		rounds_total = target_season.rounds.length;
		total_nav_num =
			optView === 'round'
				? rounds_total
				: weeks_total
    ;

		noWidgetData = false;
	}

  // TODO: DOC:
	async function carusel_fixture_odds_data
  (
		opt_view: number
  ): Promise < void >
  {

    // [🐞]
    dlog
    (
      `${FIX_W_T_TAG} carusel_fixture_odds_data()`,
      FIX_W_T_TOG,
      FIX_W_T_STY
    );

		const targetSeason = FIXTURES_ODDS_DATA.seasons
    ?.find
    (
      (
        {
          season_id
        }
      ) =>
        season_id === $sessionStore.selectedSeasonID
    );

    // ACTION: Detect "round" start/end dates;
		if (optView === 'round')
    {
			const targetRound = targetSeason?.rounds
      ?.find
      (
        (
          {
            value
          }
        ) =>
        value == opt_view
      );

			identifyTargetWeekRound
      (
        targetSeason,
        targetRound,
        null
      );
		}
    // ACTION: Detect "week" start/end dates;
		else
    {
			const targetWeek = targetSeason?.weeks
      ?.find
      (
        (
          {
            name
          }
        ) =>
        parseInt(name) == opt_view
      );

      identifyTargetWeekRound
      (
        targetSeason,
        null,
        targetWeek
      );
		}
	}

  // #region [ADD-ON] FIREBASE

  // TODO: DOC:
	async function injectLivescoreData
  (
  ): Promise < void >
  {

    // [🐞]
    dlog
    (
      `${FIX_W_T_TAG} checkForLiveFixtures()`,
      FIX_W_T_TOG,
      FIX_W_T_STY
    );

    const liveFixturesMap = $sessionStore?.livescore_now_scoreboard;

    for (const dateFixObj of fixtures_arr_filter)
    {
      dateFixObj?.fixtures
      ?.map
      (
        (
          fixture
        ) =>
        {

          if (liveFixturesMap.has(fixture.id))
          {
            return {
							...fixture,
							minute: liveFixturesMap.get(fixture.id)?.minute,
							status: liveFixturesMap.get(fixture.id)?.status,
							teams:
              {
								away:
                {
									name: fixture?.teams?.away?.name,
									red_cards: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "away")?.redcards,
									score: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "away")?.score,
								},
								home:
                {
									name: fixture?.teams?.home?.name,
									red_cards: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "home")?.redcards,
									score: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "home")?.score,
								}
							}
						}
          }

          return fixture
        }
      )
    }

  }

  // TODO: DOC:
	async function injectFixtureOddsData
  (
  ): Promise < void >
  {
    const SPORTBOOK_DETAILS_LIST = $sessionStore?.sportbook_list;
    const liveFixturesOddsMap = $sessionStore?.live_odds_fixture_map;

    // ACTION: List of sportbook available names/title;
		let sportbook_main_arr: string[] = SPORTBOOK_DETAILS_LIST
    ?.map
    (
      (
        s
      ) =>
      s.title.toLowerCase()
    );

    for (const dateFixObj of fixtures_arr_filter)
    {
      for (const fixture of dateFixObj?.fixtures)
      {
        const if_M_0: boolean =
          !liveFixturesOddsMap.has(fixture?.id)
        ;
        if (if_M_0) continue;

        const sportbook_list = liveFixturesOddsMap.get(fixture?.id);

        let sportbook_main_arr_2: string[] = sportbook_list
        ?.map
        (
          (
            s
          ) =>
          s.sportbook.toLowerCase()
        );

        let intersection: string[] = sportbook_main_arr
        ?.filter
        (
          (
            x
          ) =>
          sportbook_main_arr_2.includes(x)
        );

        let cross_sportbooks: number = intersection.length;

        // [🐞]
        dlog
        (
          `${FIX_W_T_TAG} cross_sportbooks: ${cross_sportbooks} | fixture_id: ${fixture?.id} | intersection: ${intersection}`,
          FIX_W_T_TOG,
          FIX_W_T_STY
        );

        // CHECK: For "no" matching sportbooks; (continue)
        const if_M_1: boolean =
          cross_sportbooks == 0
        ;
				if (if_M_1)
        {
					if (dev) console.log('No Matching Sportbook Details');
					fixture.live_odds = undefined;
					continue;
				}

        // ACTION: Select TOP-3 bet-sites select;

        let sp_count: number = 0;
        let odds_for: string[] = ['home',	'draw', 'away'];

        // ACTION: Object initializer;
        fixture.live_odds =
        {
          home:
          {
            betting_site_icon_link: undefined,
            register_link: undefined,
            value: undefined
          },
          draw:
          {
            betting_site_icon_link: undefined,
            register_link: undefined,
            value: undefined
          },
          away:
          {
            betting_site_icon_link: undefined,
            register_link: undefined,
            value: undefined
          }
        };

        // ACTION: Instantiate "insurance" odds;
        let main_odds: FIREBASE_odds;
        let main_sportbook: B_SPT_D;

        loop_main_sportbooks: for (const sportbook of SPORTBOOK_DETAILS_LIST)
        {
          const sportbook_name_main =	sportbook.title;
          const sportbook_logo = sportbook.image;
          const sportbook_link = sportbook.register_link;

          loop_fixture_sportbooks: for (const sportbook_from_fixture of sportbook_list)
          {
            const sportbook_name = sportbook_from_fixture?.sportbook;

            // CHECK: For "live" fixture state;
            if (fixture?.status != 'NS')
            {

              const if_M_0: boolean =
                sportbook_name.toLowerCase() != sportbook_name_main.toLowerCase()
                || sportbook_from_fixture?.markets?.['1X2FT'] == undefined
                || sportbook_from_fixture?.markets?.['1X2FT']?.data?.[0]?.value ==	undefined
                || sportbook_from_fixture?.markets?.['1X2FT']?.data?.[1]?.value ==	undefined
                || sportbook_from_fixture?.markets?.['1X2FT']?.data?.[2]?.value == undefined
              ;
              if (if_M_0) continue;

              fixture.live_odds.home.value = sportbook_from_fixture?.markets['1X2FT'].data[0].value;
              fixture.live_odds.home.betting_site_icon_link =	sportbook_logo;
              fixture.live_odds.home.register_link = sportbook_link;

              fixture.live_odds.draw.value = sportbook_from_fixture?.markets['1X2FT'].data[1].value;
              fixture.live_odds.draw.betting_site_icon_link =	sportbook_logo;
              fixture.live_odds.draw.register_link = sportbook_link;

              fixture.live_odds.away.value = sportbook_from_fixture?.markets['1X2FT'].data[2].value;
              fixture.live_odds.away.betting_site_icon_link =	sportbook_logo;
              fixture.live_odds.away.register_link = sportbook_link

              break loop_main_sportbooks;
            }

            // COINTINUE: For "pre-live" fixture state;

            const if_M_0: boolean =
              sportbook_name.toLowerCase() != sportbook_name_main.toLowerCase()
              || sportbook_from_fixture?.markets?.['1X2FT'] == undefined
              || sportbook_from_fixture?.markets?.['1X2FT']?.data?.[sp_count]?.value ==	undefined
            ;
            if (if_M_0) continue;

            // CHECK: Assign main odds;
            if (sp_count == 0)
            {
              main_odds = sportbook_from_fixture;
              main_sportbook = sportbook;
            }

            // [🐞]
            dlog
            (
              `${FIX_W_T_TAG} sportbook_name_main: ${sportbook_name_main} | fixture_id: ${fixture?.id}`,
              FIX_W_T_TOG,
              FIX_W_T_STY
            );

            fixture.live_odds[odds_for[sp_count]].value =	sportbook_from_fixture?.markets?.['1X2FT']?.data?.[sp_count]?.value;
            fixture.live_odds[odds_for[sp_count]].betting_site_icon_link = sportbook_logo;
            fixture.live_odds[odds_for[sp_count]].register_link = sportbook_link;

            // CHECK: For (solo) 1 sportbook (cross);
            // ACTION: Re-apply to other data-points;
            const if_M_1: boolean =
              sp_count == 0
              && cross_sportbooks == 1
            ;
            if (if_M_1)
            {
              fixture.live_odds.draw.value = sportbook_from_fixture?.markets['1X2FT']?.data[1]?.value;
              fixture.live_odds.draw.betting_site_icon_link = sportbook_logo;
              fixture.live_odds.draw.register_link = sportbook_link;

              fixture.live_odds.away.value = sportbook_from_fixture?.markets['1X2FT']?.data[2]?.value;
              fixture.live_odds.away.betting_site_icon_link = sportbook_logo;
              fixture.live_odds.away.register_link = sportbook_link;

              break loop_main_sportbooks;
            }

            // CHECK: For (double) 2 sportbooks (cross);
            // ACTION: Re-apply to other data-points;
            const if_M_2: boolean =
              sp_count == 0
              && cross_sportbooks == 2
            ;
            if (if_M_2)
            {
              fixture.live_odds.draw.value = sportbook_from_fixture?.markets['1X2FT']?.data[1]?.value;
              fixture.live_odds.draw.betting_site_icon_link = sportbook_logo;
              fixture.live_odds.draw.register_link = sportbook_link;

              sp_count++;
            }

            sp_count++;

            if (sp_count == 3) break loop_main_sportbooks;
          }
        }

        // CHECK: Missing last/final "odds";
        // ACTION: Assign "home" odds;
        const if_M_2: boolean =
          fixture?.live_odds?.away?.value == undefined
          && main_odds != undefined
          && main_sportbook != undefined
        ;
        if (if_M_2)
        {
          fixture.live_odds.away.value = main_odds?.markets?.['1X2FT']?.data?.[2]?.value;
          fixture.live_odds.away.betting_site_icon_link =	main_sportbook?.image;
          fixture.live_odds.away.register_link = main_sportbook?.register_link;
        }

			}
		}

		// IMPORTANT
		fixtures_arr_filter = fixtures_arr_filter;
	}

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ instantiate livescore fixture odds (data) listener
   * @returns
   * void
   */
  async function kickstartLiveOdds
  (
  ): Promise < void >
  {

    const liveOddsPathsList: string[] = [];

    const flatFixturesList = fixtures_arr_filter?.map(x => x?.fixtures).flat();

		for (const fixture of flatFixturesList)
    {
      const if_M_0: boolean =
        FIXTURE_FULL_TIME_OPT.includes(fixture?.status)
      ;
      if (if_M_0) return;

      const livesOddsPath = createFixtureOddsPath
      (
        fixture?.id,
        fixture?.fixture_time
      );
      liveOddsPathsList.push
      (
        livesOddsPath
      );
    }

    await oneOffOddsDataGet
    (
      liveOddsPathsList
    );

    // TODO: deal with Unsubscribe[]
    let connectionRefs = targetLivescoreNowFixtureOddsListenMulti
    (
      liveOddsPathsList
    );
	}

  // #endregion [ADD-ON] FIREBASE

  // #endregion ➤ [METHODS]

  // #region ➤ [ONE-OFF] [METHODS] [IF]

  if (FIXTURES_ODDS_DATA == undefined
    || FIXTURES_ODDS_T == undefined) {
		noWidgetData = true;
	}

  // #endregion ➤ [ONE-OFF] [METHODS] [IF]

  // #region ➤ [REACTIVIY] [METHODS]

  /**
   * @description
  */
	$: if (selectedSeasonId)
  {

    // [🐞]
		dlog
    (
			`INFO: SeasonId changed (new) ${selectedSeasonId}`,
			true
		);

		select_fixtures_odds();
	}

	$: if (optView == 'round') total_nav_num = rounds_total;
	$: if (optView == 'week') total_nav_num = weeks_total;

  /**
   * @description
   * ➨ listens to change in "livescore_now_scoreboard" data session-store;
  */
  $: if (livescoreNowScoreboardChng)
  {
    injectLivescoreData()
  }

  /**
   * @description
   * ➨ listens to change in "odds" data session-store;
  */
  $: if (livescoreOddsChng)
  {
    injectFixtureOddsData()
  }

  // [🐞]
  $: if (dev)
  {
		dlogv2(
			'FIXTURE ODDS [WIDGET]',
			[
				`browser ${browser}`,
				`noWidgetData ${noWidgetData}`,
				`$userBetarenaSettings.country_bookmaker ${$userBetarenaSettings.country_bookmaker}`,
			],
			true,
			'background: violet; color: #000000'
		);
	}

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

	const TABLET_VIEW = 1000;
	const MOBILE_VIEW = 725;
	let mobileExclusive, tabletExclusive: boolean = false;

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

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart livescore data GET + LISTEN;
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() =>
    {
      await kickstartLiveOdds();
    }
  );

  // #endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
[ℹ] area-outside-for-close
-->
{#if toggleDropdown}
	<div
		id="background-area-close"
		on:click={() => close_all_dropdowns()}
	/>
{/if}

<div
  id="widget-outer">

  <!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={FIXTURES_ODDS_T?.matches}
      NO_DATA_TITLE={FIXTURES_ODDS_T.no_info}
      NO_DATA_DESC={FIXTURES_ODDS_T.no_info_desc}
      version={2}
    />
  {/if}

  <!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    {#if lazyLoadingSeasonFixture}
      <FixtureOddsLoader />
    {:else}

      <WidgetTitle
        WIDGET_TITLE={FIXTURES_ODDS_T?.matches}
      />

      <div
        id="fixtures-odds-widget-container"
        class:widget-no-data-height={trueLengthOfArray == 0}
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
      >

        <!--
        📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
        -->

        <!--
        WIDGET TOP CONTROLS
        -->
        <div
          id="fixtures-odds-top-container"
          class=
          "
            m-b-15
          "
          class:row-space-out={!tabletExclusive}
          class:column-space-center={tabletExclusive || mobileExclusive}
        >

          <!--
          🖥️ LAPTOP
          TOP ROW - FIXTURE ODDS VIEW SELECT
          -->
          <div
            id="fix-odds-view-box"
            class=
            "
              row-space-start
            "
            class:m-r-20={!tabletExclusive}
          >

            <div
              class=
              "
                fix-odds-view-opt-box
                cursor-pointer
              "
              on:click={() => select_table_view('matches')}
              class:activeOpt={selectedOpt == 'matches'}
            >

              <p
                class=
                "
                  s-14
                  w-500
                  color-grey
                "
              >
                {FIXTURES_ODDS_T?.matches}
              </p>

            </div>

            <div
              class=
              "
                fix-odds-view-opt-box
                cursor-pointer
              "
              on:click={() => select_table_view('odds')}
              class:activeOpt={selectedOpt == 'odds'}
            >
              <p
                class=
                "
                  s-14
                  w-500
                  color-grey
                "
              >
                {FIXTURES_ODDS_T?.odds}
              </p>
            </div>

          </div>

          <div
            class=
            "
              row-space-out
              m-t-15
            "
            class:m-t-15={tabletExclusive || mobileExclusive}
          >

            <!--
            DROPDOWN SELECT
            -->
            <div
              id="dropdown-seasons"
              class="m-r-16"
            >
              <div
                class="row-space-start"
                on:click={() => (toggleDropdown = !toggleDropdown)}
              >

                <!--
                SELECTED WEEK/ROUND
                -->
                <p
                  class=
                  "
                    s-14
                    m-r-5
                    w-500
                    color-grey
                  "
                  style="white-space: nowrap;"
                >

                  <!--
                  WEEK OPT
                  -->
                  {#if optView === 'week'}
                    {FIXTURES_ODDS_T?.week}
                    {week_name}
                  <!--
                  ROUND OPT
                  -->
                  {:else if optView === 'round' && current_round_select.type == 'round'}
                    {FIXTURES_ODDS_T?.round}
                    {week_name}
                  <!--
                  ROUND (STAGE)
                  -->
                  {:else if optView === 'round' && current_round_select.type == 'advanced'}
                    {current_round_select.name}
                  {/if}

                </p>

                <!--
                ARROW DOWN
                -->
                <img
                  src={!toggleDropdown ? arrow_down : arrow_up}
                  alt={!toggleDropdown ? "arrow_down" : "arrow_up"}
                  width="16"
                  height="16"
                />

              </div>

              <!--
              SHOW DROPDOWN
              -->
              {#if toggleDropdown}
                <div
                  id="dropdown-list-main-container"
                >
                  <div
                    id="dropdown-list-inner-container"
                  >

                    <!--
                    WEEKS DROPDOWN SHOW
                    -->
                    {#if optView === 'week'}
                      {#each { length: weeks_total } as _, i}
                        <p
                          class=
                          "
                            s-14
                            w-500
                            row-season
                          "
                          class:color-primary={i + 1 === week_name}
                          on:click={() => carusel_fixture_odds_data(i + 1)}
                        >
                          {FIXTURES_ODDS_T?.week}
                          {i + 1}
                        </p>
                      {/each}
                    <!--
                    ROUNDS DROPDOWN SHOW
                    -->
                    {:else}
                      {#each current_rounds_all as _, i}

                        <p
                          class=
                          "
                            s-14
                            w-500
                            row-season
                          "
                          class:color-primary={i + 1 === week_name}
                          on:click={() => carusel_fixture_odds_data(i + 1)}
                        >
                          <!--
                          ROUND OPT
                          -->
                          {#if current_rounds_all?.[i]?.type == 'round'}
                            {FIXTURES_ODDS_T?.round}
                            {i + 1}
                          <!--
                          ROUND (STAGE) OPT
                          -->
                          {:else if current_rounds_all?.[i].type == 'advanced'}
                            {current_rounds_all?.[i]?.name}
                          {/if}
                        </p>

                      {/each}
                    {/if}

                  </div>
                </div>
              {/if}

            </div>

            <!--
            ROUND / WEEK SELECT VIEW
            -->
            <div
              id="widget-round-week-select"
              class="row-space-start"
            >

              <div
                on:click={() => selected_rounds_weeks_view('round')}
                class=
                "
                  row-space-start
                  m-r-16
                "
              >

                <label
                  for="round">
                  <input
                    aria-label="select-round-view"
                    placeholder=""
                    type="radio"
                    name="matches-odds-select"
                    bind:group={optView}
                    id="round"
                    class="m-r-8"
                    value={'round'}
                  />
                </label>

                <p
                  class=
                  "
                    s-14
                    w-500
                    color-grey
                  "
                  class:color-primary={optView === 'round'}
                >
                  {FIXTURES_ODDS_T?.round}
                </p>

              </div>

              <div
                on:click={() => selected_rounds_weeks_view('week')}
                class="row-space-start"
              >

                <label
                  for="week">
                  <input
                    aria-label="select-weekly-view"
                    placeholder=""
                    type="radio"
                    name="matches-odds-select"
                    bind:group={optView}
                    id="week"
                    class="m-r-8"
                    value={'week'}
                  />
                </label>

                <p
                  class=
                  "
                    s-14
                    w-500
                    color-grey
                  "
                  class:color-primary={optView === 'week'}
                >
                  {FIXTURES_ODDS_T?.week}
                </p>

              </div>

            </div>

          </div>

        </div>

        <!--
        WEEK / ROUND CAROUSEL SELECT
        -->
        <div
          id="mobile-table-box"
          class="
            row-space-out
            m-b-12
          "
        >
          <!--
          NAVIGATING IN PAST WEEKS/ROUNDS SELECT
          -->
          <button
            id="left-btn"
            class="table-nav-btn"
            aria-label="selectedOptionTableMobile"
            disabled={week_name == 1}
            on:click={() => carusel_fixture_odds_data(week_name - 1)}
          />

          <!--
          NAVIGATION TEXT MAIN SHOW
          -->
          <div
            class="text-center"
          >

            <p
              class=
              "
                s-16
                w-500
                color-black-2
              "
            >

              <!--
              WEEK OPT
              -->
              {#if optView === 'week'}
                {FIXTURES_ODDS_T?.week}
                {week_name}
              <!--
              ROUND OPT
              -->
              {:else if optView === 'round' && current_round_select.type == 'round'}
                {FIXTURES_ODDS_T?.round}
                {week_name}
              <!--
              ROUND (STAGE) OPT
              -->
              {:else if optView === 'round' && current_round_select.type == 'advanced'}
                {current_round_select?.name}
              {/if}

            </p>

            <p
              class="
                s-12
                color-grey
              "
            >
              {week_start.getDate()}
              {FIXTURES_ODDS_T?.months_abbreviation?.[MONTH_NAMES_ABBRV?.[week_start.getMonth()]]}
              -
              {week_end.getDate()}
              {FIXTURES_ODDS_T?.months_abbreviation?.[MONTH_NAMES_ABBRV?.[week_end.getMonth()]]}
            </p>

          </div>

          <!--
          NAVIGATING IN FUTURE WEEKS/ROUNDS SELECT
          -->
          <button
            id="right-btn"
            class="table-nav-btn"
            aria-label="selectedOptionTableMobile"
            disabled={week_name == total_nav_num}
            on:click={() => carusel_fixture_odds_data(week_name + 1)}
          />
        </div>

        <!--
        MATCHES / ODDS VIEW
        -->
        {#each fixtures_arr_filter as item}

          <div>

            <!--
            GROUP FIXTURES BY DATE
            -->
            <div
              class=
              "
                m-t-10
                m-b-8
                group-fixture-date
              "
              class:row-space-out={selectedOpt == 'odds'}
              class:row-space-start={selectedOpt != 'odds'}
            >

              <!--
              FIXTURE DATE (GROUP)
              -->
              <p
                class=
                "
                  color-grey
                  w-500
                  s-12
                "
              >
                <!-- DATE -->
                {new Date(item?.date).getDate()}
                <!-- MONTH ABREV. -->
                {FIXTURES_ODDS_T?.months_abbreviation?.[MONTH_NAMES_ABBRV?.[new Date(item?.date).getMonth()]]},
                <!-- WEEK DAY ABREV. -->
                {FIXTURES_ODDS_T[weekDays[new Date(item?.date).getDay()]]}
              </p>

              <!--
              ODDS TYPE OPT HEADING
              -->
              {#if selectedOpt == 'odds'}
                <div
                  class="row-space-end odds-head"
                  style="width: auto;"
                >
                  <p
                    class=
                    "
                      color-grey
                      s-12
                      w-500
                    "
                  >
                    {FIXTURES_ODDS_T?.home}
                  </p>
                  <p
                    class=
                    "
                      color-grey
                      s-12
                      w-500
                    "
                  >
                    {FIXTURES_ODDS_T?.draw}
                  </p>
                  <p
                    class="color-grey s-12 w-500"
                  >
                    {FIXTURES_ODDS_T?.away}
                  </p>
                </div>
              {/if}

            </div>

            <!--
            MATCH (DATE-GROUP) POPULATION
            -->
            {#each item?.fixtures || [] as fixture}

              <div
                class=
                "
                  fixture-row
                  row-space-out
                "
              >

                <!--
                1st COLUMN
                -->
                <div
                  class="row-space-start"
                >

                  <!--
                  FIXTURE TIME
                  -->
                  <div
                    class=
                    "
                      m-r-16
                      fixture-time-box
                      text-center
                    "
                  >

                    {#if fixture?.status === 'LIVE'}

                      <p
                        style="color: #FF3C3C;"
                        class="s-14 no-wrap"
                      >
                        {fixture?.minute}
                        <span
                          class:visibility-none={tickSecShow}
                        >
                          '
                        </span>
                      </p>

                    {:else if fixture?.status === 'HT'}

                      <p
                        class="
                          no-wrap
                          s-14
                          color-black-2
                        "
                      >
                        {FIXTURES_ODDS_T?.status_abv?.HT}
                      </p>

                    <!--
                    [ℹ] fixture-time +
                    [ℹ] status [translation] abbreviations SHOW
                    -->
                    {:else}

                      <p
                        class=
                        "
                          no-wrap
                          s-14
                          color-black-2
                        "
                        class:color-grey={['FT','FT_PEN','AET'].includes(fixture?.status)}
                      >
                        {
                          (('0' + new Date(fixture?.fixture_time + 'Z').getHours()).slice(-2) +
                          ':' +
                          ('0' + new Date(fixture?.fixture_time + 'Z').getMinutes()).slice(-2)).split(' ').join('')
                        }
                      </p>

                      <!--
                      [ℹ] show status-abv of the match translations
                      [ℹ] NOTE: status_abv trnasltions on hasura must
                      [ℹ] NOTE: must match that of the SPORTMONKS data
                      -->
                      <p
                        class=
                        "
                          no-wrap
                          s-14
                          color-grey
                        "
                      >
                        {#if fixture?.status != 'NS'}
                          <p
                            class="
                              no-wrap
                              s-14
                              color-grey
                            "
                          >
                            {FIXTURES_ODDS_T?.status_abv?.[fixture?.status]}
                          </p>
                        {/if}
                      </p>
                    {/if}
                  </div>

                  <!--
                  [ℹ] fixture-teams with FIXTURE-LINK
                  FIXME:  syntax error
                  -->
                  <a
                    href={fixture?.fixture_link == undefined ? '' : fixture?.fixture_link[$sessionStore?.serverLang]}
                    style="width: inherit;"
                    class:disable-anchor={fixture?.fixture_link == undefined || fixture?.fixture_link[$sessionStore?.serverLang] == undefined}
                  >
                    <div
                      class=
                      "
                        column-start-grid-start
                        fixture-teams-box
                      "
                    >

                      <!--
                      FIXTURE LOCAL TEAM BOX
                      NOTE: TODO: Can be move to a TEAM-BOX.svelte
                      -->
                      <div
                        class="row-space-start"
                      >

                        <p
                          class=
                          "
                            s-14
                            color-black-2
                            w-500
                            m-r-8
                          "
                          class:color-grey={fixture?.teams?.home?.score < fixture?.teams?.away?.score}
                        >
                          {fixture?.teams?.home?.name}
                        </p>

                        <!--
                        TEAM RED CARDS
                        -->
                        {#if fixture?.teams?.home?.red_cards}
                          {#if fixture?.teams?.home?.red_cards == 1}
                            <img
                              loading="lazy"
                              src={$userBetarenaSettings.theme == 'Dark' ? one_red_card_dark : one_red_card}
                              alt="default alt text"
                              width="12"
                              height="16"
                            />
                          {:else if fixture?.teams?.home?.red_cards == 2}
                            <img
                              loading="lazy"
                              src={$userBetarenaSettings.theme == 'Dark' ? two_red_card_dark : two_red_card}
                              alt="default alt text"
                              width="15"
                              height="19"
                            />
                          {:else}
                            <img
                              loading="lazy"
                              src={$userBetarenaSettings.theme == 'Dark' ? three_red_card_dark : three_red_card}
                              alt="default alt text"
                              width="15px"
                              height="19px"
                            />
                          {/if}
                        {/if}

                      </div>

                      <!--
                      FIXTURE VISITOR TEAM BOX
                      NOTE: TODO: Can be move to a TEAM-BOX.svelte
                      -->
                      <div
                        class="row-space-start"
                      >

                        <p
                          class=
                          "
                            s-14
                            color-black-2
                            w-500
                            m-r-8
                          "
                          class:color-grey={fixture?.teams?.away?.score < fixture?.teams?.home?.score}
                        >
                          {fixture?.teams?.away?.name}
                        </p>

                        <!--
                        TEAM RED CARDS
                        -->
                        {#if fixture?.teams?.home?.red_cards}
                          {#if fixture?.teams?.home?.red_cards == 1}
                            <img
                              loading="lazy"
                              src={$userBetarenaSettings.theme == 'Dark' ? one_red_card_dark : one_red_card}
                              alt="default alt text"
                              width="12"
                              height="16"
                            />
                          {:else if fixture?.teams?.home?.red_cards == 2}
                            <img
                              loading="lazy"
                              src={$userBetarenaSettings.theme == 'Dark' ? two_red_card_dark : two_red_card}
                              alt="default alt text"
                              width="15"
                              height="19"
                            />
                          {:else}
                            <img
                              loading="lazy"
                              src={$userBetarenaSettings.theme == 'Dark' ? three_red_card_dark : three_red_card}
                              alt="default alt text"
                              width="15px"
                              height="19px"
                            />
                          {/if}
                        {/if}

                      </div>

                    </div>
                  </a>

                </div>

                <!--
                2nd COLUMN
                -->
                <div
                  class="row-space-end"
                  style="width: auto;"
                >

                  <!--
                  FIXTURE LINK / MEDIA LINK
                  -->
                  {#if selectedOpt == 'matches' && fixture?.media_link && fixture?.media_link?.length > 0 && fixture?.fixture_link && fixture?.fixture_link?.[$sessionStore?.serverLang]}
                    <a
                      href={fixture?.fixture_link[$sessionStore?.serverLang]}
                      aria-label="media_link_redirect"
                      style="width: inherit;"
                    >
                      <div
                        class=
                        "
                          media-play-btn
                          m-r-16
                        "
                      >
                        <img
                          src={$userBetarenaSettings.theme == 'Dark' ? play_dark : play}
                          alt="default alt text"
                          width=14
                          height=14
                        />
                      </div>
                    </a>
                  {/if}

                  <!--
                  FIXTURE TIP LINK
                  -->
                  {#if selectedOpt == 'matches' && fixture?.tip_link && fixture?.tip_link?.[$sessionStore?.serverLang]}
                    <a
                      rel="nofollow"
                      aria-label="tip_link_redirect"
                      href={fixture?.tip_link?.[$sessionStore?.serverLang]}
                      target="_blank"
                      style="width: inherit;"
                    >
                      <div
                        class=
                        "
                          tip-box
                          m-r-16
                        "
                      >
                        <p
                          class=
                          "
                            s-12
                            color-black-2
                          "
                        >
                          {FIXTURES_ODDS_T?.tip}
                        </p>
                      </div>
                    </a>
                  {/if}

                  <!--
                  (MAIN) BET SITE
                  -->
                  {#if selectedOpt == 'matches' && $sessionStore?.sportbook_main}

                    <a
                      rel="nofollow"
                      aria-label="betting_site_logo_football_fixtures_odds_tournament"
                      on:click={() => googleEventLog('betting_site_logo_football_fixtures_odds_tournament')}
                      href={$sessionStore?.sportbook_main?.register_link}
                      target="_blank"
                      style="width: inherit;"
                    >
                      <img
                        id="sportbook-logo-img"
                        src={$sessionStore?.sportbook_main?.image}
                        alt={$sessionStore?.sportbook_main?.title}
                      />
                    </a>

                  {/if}

                  <!--
                  FIXTURE SCORE
                  -->
                  {#if (fixture?.teams?.away?.score && fixture?.teams?.home?.score) || ['FT', 'FT_PEN', 'AET', 'LIVE', 'HT'].includes(fixture?.status)}
                    <div
                      class=
                      "
                        column-space-center
                        m-l-24
                        fixtures-scores-box
                      "
                    >

                      <!--
                      HOME SCORE
                      -->
                      <p
                        class=
                        "
                          s-14
                          w-500
                          color-black-2
                        "
                        class:color-grey={fixture?.teams?.home?.score < fixture?.teams?.away?.score && fixture?.status != 'LIVE'}
                        class:color-red-bright={fixture?.status === 'LIVE'}
                      >
                        {fixture?.teams?.home?.score}
                      </p>

                      <!--
                      AWAY SCORE
                      -->
                      <p
                        class=
                        "
                          s-14
                          w-500
                          color-black-2
                        "
                        class:color-grey={fixture?.teams?.away?.score < fixture?.teams?.home?.score && fixture?.status != 'LIVE'}
                        class:color-red-bright={fixture?.status === 'LIVE'}
                      >
                        {fixture?.teams?.away?.score}
                      </p>

                    </div>
                  {/if}

                  <!--
                  FIXTURE LIVE ODDS
                  -->
                  {#if selectedOpt == 'odds'}

                    {#if fixture?.live_odds != undefined && !['FT', 'FT_PEN', 'AET'].includes(fixture?.status)}
                      <div
                        class="main-bet-box row-space-out"
                        style="width: auto;"
                      >
                        <!--
                        [ℹ] home
                        -->
                        <a
                          rel="nofollow"
                          aria-label="betting_site_logo_fixtures_odds"
                          on:click={() => googleEventLog('tournaments_football_fixtures_odds')}
                          href={fixture?.live_odds?.home?.register_link}
                          target="_blank"
                          style="width: inherit;"
                        >
                          <div
                            class="bet-site-box column-space-center m-r-5 cursor-pointer"
                          >
                            <p
                              class="s-12 color-black-2 w-500"
                            >
                              {fixture?.live_odds?.home?.value?.toFixed(2)}
                            </p>
                            <img
                              src={fixture?.live_odds?.home?.betting_site_icon_link}
                              alt="default alt text"
                            />
                          </div>
                        </a>

                        <!--
                        [ℹ] draw
                        -->
                        <a
                          rel="nofollow"
                          aria-label="betting_site_logo_fixtures_odds"
                          on:click={() => googleEventLog('tournaments_football_fixtures_odds')}
                          href={fixture?.live_odds?.draw?.register_link}
                          target="_blank"
                          style="width: inherit;"
                        >
                          <div
                            class="bet-site-box column-space-center m-r-5 cursor-pointer"
                          >
                            <p
                              class="s-12 color-black-2 w-500"
                            >
                              {fixture?.live_odds?.draw?.value?.toFixed(2)}
                            </p>
                            <img
                              src={fixture?.live_odds?.draw.betting_site_icon_link}
                              alt="default alt text"
                            />
                          </div>
                        </a>

                        <!--
                        [ℹ] away
                        -->
                        <a
                          rel="nofollow"
                          aria-label="betting_site_logo_fixtures_odds"
                          on:click={() => googleEventLog('tournaments_football_fixtures_odds')}
                          href={fixture?.live_odds?.away?.register_link}
                          target="_blank"
                          style="width: inherit;"
                        >
                          <div
                            class="bet-site-box column-space-center cursor-pointer"
                          >
                            <p
                              class="s-12 color-black-2 w-500"
                            >
                              {fixture?.live_odds?.away?.value?.toFixed(2)}
                            </p>
                            <img
                              src={fixture?.live_odds?.away.betting_site_icon_link}
                              alt="default alt text"
                            />
                          </div>
                        </a>
                      </div>
                    {:else}
                      <div
                        class="no-odds-available-box"
                      >
                        <p
                          class="s-14 no-wrap color-grey text-center"
                        >
                          {FIXTURES_ODDS_T?.no_odds}
                        </p>
                      </div>
                    {/if}

                  {/if}

                </div>

              </div>

            {/each}

          </div>

        {/each}

      </div>

    {/if}

  {/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/*
    [ℹ] OTHER STYLE / CSS
  */
	#background-area-close
  {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 1000;
	}

  div#fixtures-odds-top-container
  {
    padding: 20px;
    padding-bottom: 0;
  }
	div#fix-odds-view-box
  {
    /* s */
		width: -webkit-fill-available;
	}
	div.fix-odds-view-opt-box
  {
		border: 1px solid #cccccc;
		padding: 10px 30px;
		width: inherit;
		text-align: center;
	}
	div.fix-odds-view-opt-box.activeOpt
  {
		border: 1px solid #f5620f !important;
	}
	div.fix-odds-view-opt-box.activeOpt p
  {
		color: #f5620f !important;
	}
	div.fix-odds-view-opt-box:hover p
  {
		color: #292929 !important;
	}
	div.fix-odds-view-opt-box:first-child
  {
		border-radius: 8px 0px 0px 8px;
	}
	div.fix-odds-view-opt-box:last-child
  {
		border-radius: 0px 8px 8px 0px;
	}

	div#mobile-middle-control-row
  {
		padding: 0 20px;
	}
	div#widget-round-week-select
  {
		width: fit-content;
	}
	div#widget-round-week-select input[type='radio']
  {
		width: 1.3em;
		height: 1.3em;
		background-color: white;
		border-radius: 50%;
		border: 1px solid #cccccc;
		-webkit-appearance: none;
		cursor: pointer;
	}
	div#widget-round-week-select input[type='radio']:checked
  {
		background-color: #f5620f;
		border: 2px solid white;
		box-shadow: 0 0 0 1px #f5620f;
	}

	div#dropdown-seasons
  {
		border-radius: 4px;
		position: relative;
		cursor: pointer;
		width: 98px;
	}
	div#dropdown-seasons:hover p
  {
		color: black;
	}
	div#dropdown-seasons div#dropdown-list-main-container
  {
		position: absolute;
		top: 115%;
		width: auto;
		min-width: 100%;
		/* background-color: #F2F2F2; */
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		z-index: 10000;
		/* height: 308px; */
		max-height: 308px;
		overflow-y: scroll;
		overflow-x: hidden;
		padding-right: 6px;
		right: 0;
	}
	div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar
  {
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}
	div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container
  {
		max-height: 308px;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season
  {
		padding: 11px 2px 11px 8px;
		white-space: nowrap;
		text-align: center;
	}
	div#dropdown-seasons div#dropdown-list-main-container	div#dropdown-list-inner-container .row-season:hover
  {
		cursor: pointer;
		color: #f5620f !important;
	}

	/* width */
	div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar
  {
		width: 4px;
	}
	/* track */
	div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track
  {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	}
	/* handle */
	div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb
  {
		background: #cccccc;
		border-radius: 12px;
	}

	div#mobile-table-box
  {
		padding: 5px 12px;
		background: #f2f2f2;
		border-radius: 48px;
		margin: 0 20px 12px 20px;
		width: auto;
	}
	div#mobile-table-box button.table-nav-btn
  {
		border-radius: 50%;
		background-color: #4b4b4b;
		width: 32px;
		height: 32px;
		padding: 6px;
	}
	div#mobile-table-box button.table-nav-btn:disabled
  {
		opacity: 0.2;
	}
	div#mobile-table-box button#left-btn
  {
		width: 32px;
		height: 32px;
		background-image: url('./assets/slider-left.svg');
		background-size: 20px;
		background-position: center;
		background-repeat: no-repeat;
	}
	div#mobile-table-box button#left-btn:hover
  {
		background-image: url('./assets/slider-left-hover.svg');
	}
	div#mobile-table-box button#right-btn
  {
		width: 32px;
		height: 32px;
		background-image: url('./assets/slider-right.svg');
		background-size: 20px;
		background-position: center;
		background-repeat: no-repeat;
	}
	div#mobile-table-box button#right-btn:hover
  {
		background-image: url('./assets/slider-right-hover.svg');
	}

	div.group-fixture-date
  {
    /* s */
		background: #f2f2f2;
		padding: 7px 20px;
	}

	div.fixture-row
  {
		padding: 5px 12px;
	}

	div.fixture-time-box
  {
		width: 37px;
		margin-right: 8px;
	}
	div.fixture-time-box p
  {
		font-size: 12px;
	}

	div.fixture-teams-box
  {
		border-left: 1px #e6e6e6 solid;
		padding-left: 8px;
	}
	div.fixture-teams-box p
  {
		font-weight: 400;
	}
	div.fixture-teams-box p.odds-view
  {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 85px;
	}

	div.fixtures-scores-box
  {
		margin-left: 10px;
	}
	div.fixtures-scores-box p
  {
		font-weight: 400;
	}

	div.media-play-btn
  {
		display: flex;
		padding: 4px;
		margin-right: 5px;
		border: 1px solid #cccccc;
		border-radius: 50%;
	}
	div.media-play-btn img
  {
		width: 6px;
		height: 6px;
	}

	div.tip-box
  {
		padding: 2.5px 7px;
		border-radius: 4px;
		margin-right: 5px;
		border: 1px solid #cccccc;
	}
	div.tip-box:hover
  {
		border: 1px solid #f5620f !important;
	}
	div.tip-box p
  {
		font-size: 10px;
	}
	div.tip-box:hover p
  {
		color: #f5620f;
	}

	img#sportbook-logo-img
  {
		width: 20px;
		height: 20px;
		object-fit: contain;
		border-radius: 4px;
		object-position: left;
	}

	div.odds-head p
  {
		margin-right: 13px;
	}
	div.odds-head p:last-child
  {
		margin-right: 0px;
	}

	div.main-bet-box
  {
		margin-left: 6px;
	}
	div.main-bet-box div.bet-site-box
  {
		border-radius: 4px;
		border: 1px solid #cccccc;
		overflow: hidden;
		max-height: 40px;
		max-width: 40px;
	}
	div.main-bet-box div.bet-site-box:hover
  {
		border: 1px solid #f5620f !important;
	}
	div.main-bet-box div.bet-site-box:hover p
  {
		color: #f5620f !important;
	}
	div.main-bet-box div.bet-site-box:hover img
  {
		border-top: 1px solid #f5620f !important;
	}
	div.main-bet-box div.bet-site-box img
  {
		object-fit: cover;
		border-top: 1px solid #cccccc;
		width: 40px;
		height: 20px;
	}
	div.main-bet-box div.bet-site-box p
  {
		padding: 2px 0px;
	}

	div.no-odds-available-box
  {
		border: 1px solid #cccccc;
		padding: 8px 0px;
		border-radius: 4px;
		min-width: 130px;
		max-height: 40px;
		margin-left: 13px;
	}

	span.visibility-none
  {
		visibility: hidden;
	}

	div#fixtures-odds-widget-container.widget-no-data-height
  {
		height: 832px;
	}

	#fixtures-odds-widget-container
  {
		padding: 0;
		padding-bottom: 16px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		position: relative;
	}

	/*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 400px)
  {
		div.fixture-teams-box p.odds-view
    {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 150px;
		}
	}

	@media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
		#fixtures-odds-widget-container
    {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	@media only screen
  and (min-width: 726px)
  {
		div.fix-odds-view-opt-box
    {
      /* s */
			text-align: center;
		}

		div.fixture-row
    {
      /* s */
			padding: 5px 20px;
			max-height: 56px;
			height: 56px;
		}

		div.fixture-time-box
    {
			min-width: 47px;
			margin-right: 16px;
		}
		div.fixture-time-box p
    {
			font-size: 14px;
		}

		div.fixture-teams-box
    {
			border-left: 1px #e6e6e6 solid;
			padding-left: 16px;
		}
		div.fixture-teams-box p
    {
			font-weight: 500;
		}

		div.fixtures-scores-box
    {
			margin-left: 24px;
		}
		div.fixtures-scores-box p
    {
			font-weight: 500;
		}

		div.tip-box
    {
			padding: 6px 12px;
			margin-right: 16px;
		}
		div.tip-box p
    {
			font-size: 12px;
		}

		div.media-play-btn
    {
			padding: 9px;
			margin-right: 16px;
		}
		div.media-play-btn img
    {
			width: 14px;
			height: 14px;
		}

		img#sportbook-logo-img
    {
			width: 30px;
			height: 30px;
		}

		div.odds-head p
    {
			margin-right: 24px;
		}
		div.odds-head p:last-child
    {
			margin-right: 10px;
		}

		div.main-bet-box
    {
			margin-left: 24px;
		}
		div.main-bet-box div.bet-site-box
    {
			max-height: 48px;
			max-width: 48px;
		}
		div.main-bet-box div.bet-site-box img
    {
			width: 48px;
			height: 24px;
		}

		div.no-odds-available-box
    {
			padding: 13px 20px;
			min-width: 154px;
			max-height: 48px;
			margin-left: 24px;
		}
	}

  @media only screen
  and (min-width: 1000px)
  {
    div#fix-odds-view-box
    {
      /* s */
      width: auto;
			padding: 0;
		}
	}

	@media only screen
  and (min-width: 1160px)
  {
		#fixtures-odds-widget-container
    {
			min-width: 100%;
		}

		div#widget-outer
    {
			margin-top: 0;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	.dark-background-1 div.fix-odds-view-opt-box
  {
		border: 1px solid #737373;
	}
	.dark-background-1 div#fix-odds-view-box div.fix-odds-view-opt-box:hover p
  {
		color: #ffffff !important;
	}

	.dark-background-1 div#mobile-table-box
  {
		background: #616161;
	}
	.dark-background-1 div#mobile-table-box button#left-btn
  {
		background-image: url('./assets/slider-left-dark.svg');
		background-size: 20px;
		background-position: center;
		background-repeat: no-repeat;
	}
	.dark-background-1 div#mobile-table-box button#left-btn:hover
  {
		background-image: url('./assets/slider-left-hover.svg');
	}
	.dark-background-1 div#mobile-table-box button#right-btn
  {
		background-image: url('./assets/slider-right-dark.svg');
		background-size: 20px;
		background-position: center;
		background-repeat: no-repeat;
	}
	.dark-background-1 div#mobile-table-box button#right-btn:hover
  {
		background-image: url('./assets/slider-right-hover.svg');
	}
	.dark-background-1 div#mobile-table-box button.table-nav-btn
  {
		background: #a8a8a8;
	}
	.dark-background-1 div#mobile-table-box p
  {
		color: white;
	}

	.dark-background-1 div.fixture-teams-box
  {
		border-left: 1px #616161 solid;
	}
	.dark-background-1 div.tip-box
  {
		border: 1px solid #737373;
	}
	.dark-background-1 div.media-play-btn
  {
		border: 1px solid #737373;
	}

	.dark-background-1 div#widget-round-week-select input[type='radio']
  {
		background-color: transparent;
		border: 1px solid #999999;
	}
	.dark-background-1 div#widget-round-week-select input[type='radio']:checked
  {
		background-color: #f5620f;
		border: 2px solid #4b4b4b;
		box-shadow: 0 0 0 1px #f5620f;
	}

	.dark-background-1 div#dropdown-seasons div#dropdown-list-main-container
  {
		/* dark theme/dark-gray */
		background: #616161;
		/* shadow/black */
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
		border-radius: 4px;
	}
	.dark-background-1 div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season
  {
		color: #ffffff;
	}

	/* handle */
	.dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb
  {
		background: #999999 !important;
	}
	/* track */
	.dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track
  {
		background: #4b4b4b !important;
	}

	.dark-background-1 div.group-fixture-date
  {
		background: #616161 !important;
	}

	.dark-background-1 div.bet-site-box
  {
		border: 1px solid #737373 !important;
	}
	.dark-background-1 div.bet-site-box img
  {
		border-top: 1px solid #737373 !important;
	}

	.dark-background-1 div.no-odds-available-box
  {
		border: 1px solid #737373 !important;
	}

</style>
