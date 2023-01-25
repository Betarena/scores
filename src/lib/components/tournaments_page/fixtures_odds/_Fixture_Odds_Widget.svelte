<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import { get } from "$lib/api/utils";
  import { logDevGroup } from "$lib/utils/debug";
  import { onDestroy, onMount } from "svelte";

  import { getLivescoresNow, getOdds } from "$lib/firebase/fixtures_odds";
  import { db_real } from '$lib/firebase/init';
  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from "$lib/store/user-settings";
  import { onValue, ref, type Unsubscribe } from 'firebase/database';

  import type {
  	FIREBASE_livescores_now, FIREBASE_odds
  } from "$lib/models/firebase";
  import type {
  	REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response,
  	REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response,
  	Rounds_Data,
  	Tournament_Fixture_Odds,
  	Tournament_Season_Fixtures_Odds,
  	Weeks_Data
  } from "$lib/models/tournaments/fixtures_odds/types";
  import type {
  	Cache_Single_SportbookDetails_Data_Response
  } from "$lib/models/tournaments/league-info/types";

  import FixtureOddsWidgetContentLoader from "./_Fixture_Odds_Widget_ContentLoader.svelte";

	import one_red_card from './assets/1_red_card.svg';
	import one_red_card_dark from './assets/1_red_card_dark.svg';
	import two_red_card from './assets/2_red_cards.svg';
	import two_red_card_dark from './assets/2_red_cards_dark.svg';
	import three_red_card from './assets/3_red_cards.svg';
	import three_red_card_dark from './assets/3_red_cards_dark.svg';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
	import play_dark from './assets/play-dark.svg';
	import play from './assets/play.svg';

  export let FIXTURES_ODDS_T:     REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response;
	export let FIXTURES_ODDS_DATA:  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response;

  let loaded:                   boolean = false;                // [ℹ] (boolean) signal for widget has gone through "loading" phase
  let refresh:                  boolean = false;                // [ℹ] (boolean) signal for widget refresh
	let refresh_data:             any = undefined;                // [ℹ] (any) variable for declarative refresh-data value lsiten
  let noWidgetData:             boolean = false;                // [ℹ] (boolean) signal for widget data totally missing
  let toggleDropdown:           boolean = false;                // [ℹ] (boolean) signal dropdown state
  let trueLengthOfArray:        number;                         // [ℹ] (number) initial default kay array length
  let optView:                  'round' | 'week' = 'week'       // [ℹ] (string) view of widget state tracker
  let fixtures_arr_filter: {
    date: Date
    fixtures: Tournament_Fixture_Odds[]
  }[] = []
  let selectedOpt:              'odds' | 'matches' = 'matches';
  let tickSecShow:              boolean = false;
  let week_start:               Date
  let week_end:                 Date
  let week_name:                number
  let ready =                   false
  let weeks_total:              number
  let rounds_total:             number
  let total_nav_num:            number = weeks_total
  let current_round_select:     Rounds_Data
  let current_rounds_all:       Rounds_Data[]

  let currentSeason:            number = undefined;
  let lazyLoadingSeasonFixture: boolean = false;

  let enableLogs:              boolean = false;  
  let showWidget:              boolean = true;
  let devConsoleTag:           string = "FIX_ODDS";

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
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ];

  let SPORTBOOK_DETAILS_LIST: Cache_Single_SportbookDetails_Data_Response[]
  let realTimeOddsListenMap: Map<number, Unsubscribe> = new Map<number, Unsubscribe>();

  if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `FIXTURES_ODDS_T: ${FIXTURES_ODDS_T}`)
  if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `FIXTURES_ODDS_DATA: ${FIXTURES_ODDS_DATA}`)

  if (FIXTURES_ODDS_DATA == undefined
    || FIXTURES_ODDS_T == undefined
  ) {
    noWidgetData = true;
    loaded = true;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // [ADD-ON] FIREBASE
  // ~~~~~~~~~~~~~~~~~~~~~

  const liveFixturesMap = new Map<number, FIREBASE_livescores_now>();

  async function checkForLiveFixtures(data: [string, FIREBASE_livescores_now][]) {
    
    if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `checkForLiveFixtures()`)

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
                red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[1]?.redcards,
                score: liveFixturesMap.get(fixture.id)?.scores?.visitorteam_score,
              },
              home: {
                name: fixture?.teams?.home?.name,
                red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[0]?.redcards,
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

	async function listenRealTimeLivescoresNowChange (): Promise < void > {

    if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `listenRealTimeLivescoresNowChange()`)

    const fixtureRef = ref (
      db_real,
      'livescores_now/'
    );

    onValue(fixtureRef, (snapshot) => {
      // [ℹ] break-down-values
      if (snapshot.val() != null) {
        const data: [string, FIREBASE_livescores_now][] = Object.entries(snapshot.val())
        checkForLiveFixtures(data);
      }
    });

  }

  async function checkForFixtureOddsInject(fixture_id: number, sportbook_list: FIREBASE_odds[]) {

    // [ℹ] match "data.key" (fixture_id)
    // [ℹ] with available (fixture_id's)
    // [ℹ] and populate the SPORTBOOK_DETAILS
    // [ℹ] based on the "top-3" OR avaialble ODDS
    // [ℹ] for the selected GEO-POSITION
    // [ℹ] and inject to LIVE_ODDS for TARGET FIXTURE

    if (SPORTBOOK_DETAILS_LIST == undefined) {
      return
    }

    // [ℹ] generate matching sporbook names
    let sportbook_main_arr:   string[] = SPORTBOOK_DETAILS_LIST.map(s => s.title.toLowerCase())
    let sportbook_main_arr_2: string[] = sportbook_list.map(s => s.sportbook.toLowerCase())

    let intersection:     string[] = sportbook_main_arr.filter(x => sportbook_main_arr_2.includes(x));
    let cross_sportbooks: number   = intersection.length;
    // if (dev) console.log("cross_sportbooks", cross_sportbooks, fixture_id)
    // if (dev) console.log("intersection", intersection, fixture_id)

    for (const fixtures_group_by_date of fixtures_arr_filter) {
      for (const fixture of fixtures_group_by_date.fixtures) {

        if (fixture.id == fixture_id && cross_sportbooks == 0) {
          if (dev) console.log("No Matching Sportbook Details")
          fixture.live_odds = undefined;
          return;
        }
      
        // [ℹ] pre-live fixture validation
        // [ℹ] use TOP-3 betting sites
        // [ℹ] as odds-display
        if (fixture.status == "NS" && fixture.id == fixture_id) {

          let sp_count: number = 0;
          let odds_for: string[] = ['home', 'draw', 'away']

          fixture.live_odds = {
            home: {
              betting_site_icon_link: undefined,
              register_link: undefined,
              value: undefined
            },
            draw: {
              betting_site_icon_link: undefined,
              register_link: undefined,
              value: undefined
            },
            away: {
              betting_site_icon_link: undefined,
              register_link: undefined,
              value: undefined
            }
          }

          // [ℹ] insurance odds #1
          let main_odds:      FIREBASE_odds
          let main_sportbook: Cache_Single_SportbookDetails_Data_Response

          for (const sportbook of SPORTBOOK_DETAILS_LIST) {

            const sportbook_name_main = sportbook.title
            const sportbook_logo = sportbook.image
            const sportbook_link = sportbook.register_link

            for (const sportbook_from_fixture of sportbook_list) {

              const sportbook_name = sportbook_from_fixture.sportbook;

              if (sportbook_name.toLowerCase() == sportbook_name_main.toLowerCase()) {

                if (
                  sportbook_from_fixture?.markets['1X2FT'] == undefined ||
                  sportbook_from_fixture?.markets['1X2FT']?.data[sp_count]?.value == undefined
                ) {
                  continue;
                }

                // [ℹ] assign main odds #1
                if (sp_count == 0) {
                  main_odds = sportbook_from_fixture
                  main_sportbook = sportbook
                }

                // if (dev) console.log("sportbook_name_main", sportbook_name_main, fixture_id)

                fixture.live_odds[odds_for[sp_count]].value = 
                  sportbook_from_fixture?.markets['1X2FT']?.data[sp_count]?.value
                ;
                fixture.live_odds[odds_for[sp_count]].betting_site_icon_link = 
                  sportbook_logo
                ;
                fixture.live_odds[odds_for[sp_count]].register_link = 
                  sportbook_link
                ;

                // [ℹ] validation instance of 1
                // [ℹ] intersecting sportbooks
                // [ℹ] re-use the sportbook #1
                if (sp_count == 0 && cross_sportbooks == 1) {
                  
                  fixture.live_odds.draw.value = 
                    sportbook_from_fixture?.markets['1X2FT']?.data[1]?.value
                  ;
                  fixture.live_odds.draw.betting_site_icon_link = 
                    sportbook_logo
                  ;
                  fixture.live_odds.draw.register_link = 
                    sportbook_link
                  ;

                  fixture.live_odds.away.value = 
                    sportbook_from_fixture?.markets['1X2FT']?.data[2]?.value
                  ;
                  fixture.live_odds.away.betting_site_icon_link = 
                    sportbook_logo
                  ;
                  fixture.live_odds.away.register_link = 
                    sportbook_link
                  ;

                  sp_count = 3;
                  break;
                }

                // [ℹ] validation instance of 2
                // [ℹ] intersecting sportbooks
                // [ℹ] re-use the sportbook #1
                if (sp_count == 0 && cross_sportbooks == 2) {
                  
                  fixture.live_odds.draw.value = 
                    sportbook_from_fixture?.markets['1X2FT']?.data[1]?.value
                  ;
                  fixture.live_odds.draw.betting_site_icon_link = 
                    sportbook_logo
                  ;
                  fixture.live_odds.draw.register_link = 
                    sportbook_link
                  ;

                  sp_count++;
                }

                sp_count++;

                if (sp_count == 3) {
                  break;
                }
              }
            }

            if (sp_count == 3) {
              break;
            }

          }

          // [ℹ] extra validation
          // [ℹ] when there is a missing 
          // [ℹ] last odds "away" in the
          // [ℹ] case of missing odds
          // [ℹ] assing #1 ("home") odds
          if (
            fixture.live_odds.away.value == undefined && 
            main_odds != undefined &&
            main_sportbook != undefined
          ) {
            fixture.live_odds.away.value = 
              main_odds?.markets['1X2FT']?.data[2]?.value
            ;
            fixture.live_odds.away.betting_site_icon_link = 
              main_sportbook?.image
            ;
            fixture.live_odds.away.register_link = 
              main_sportbook?.register_link
            ;
          }

        }

        // [ℹ] live fixture validation
        // [ℹ] use TOP-1 betting sites
        // [ℹ] as odds-display
        // [ℹ] main sportbook
        if (fixture.status != "NS" && fixture.id == fixture_id) {

          let found_odds: boolean = false;

          fixture.live_odds = {
            home: {
              betting_site_icon_link: undefined,
              register_link: undefined,
              value: undefined
            },
            draw: {
              betting_site_icon_link: undefined,
              register_link: undefined,
              value: undefined
            },
            away: {
              betting_site_icon_link: undefined,
              register_link: undefined,
              value: undefined
            }
          }

          for (const sportbook of SPORTBOOK_DETAILS_LIST) {

            const sportbook_name_main = sportbook.title
            const sportbook_logo = sportbook.image
            const sportbook_link = sportbook.register_link

            for (const sportbook_from_fixture of sportbook_list) {

              const sportbook_name = sportbook_from_fixture.sportbook;

              if (sportbook_name.toLowerCase() == sportbook_name_main.toLowerCase()) {

                if (
                  sportbook_from_fixture?.markets['1X2FT'] == undefined ||
                  sportbook_from_fixture?.markets['1X2FT']?.data[0]?.value == undefined ||
                  sportbook_from_fixture?.markets['1X2FT']?.data[1]?.value == undefined ||
                  sportbook_from_fixture?.markets['1X2FT']?.data[2]?.value == undefined
                ) {
                  continue;
                }

                fixture.live_odds.home.value = 
                  sportbook_from_fixture?.markets['1X2FT'].data[0].value
                ;
                fixture.live_odds.home.betting_site_icon_link = 
                  sportbook_logo
                ;
                fixture.live_odds.home.register_link = 
                  sportbook_link
                ;
                
                fixture.live_odds.draw.value = 
                  sportbook_from_fixture?.markets['1X2FT'].data[1].value
                ;
                fixture.live_odds.draw.betting_site_icon_link = 
                  sportbook_logo
                ;
                fixture.live_odds.draw.register_link = 
                  sportbook_link
                ;

                fixture.live_odds.away.value = 
                  sportbook_from_fixture?.markets['1X2FT'].data[2].value
                ;
                fixture.live_odds.away.betting_site_icon_link = 
                  sportbook_logo
                ;
                fixture.live_odds.away.register_link = 
                  sportbook_link
                ;
                
                found_odds = true;
                break;
              }
            }

            if (found_odds) {
              break
            }
          }

          // [ℹ] extra validation
          // [ℹ] no live odds found
          if (!found_odds) {
            fixture.live_odds = undefined
          }

        }

      }
    }

    // [ℹ] assign changes (persist)
    fixtures_arr_filter = fixtures_arr_filter
  }

	async function listenRealTimeOddsChange (): Promise < void > {

    realTimeOddsListenMap = new Map<number, Unsubscribe>();

    // if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `listenRealTimeOddsChange()`)
    // if (dev) console.log("snapshot", fixtures_arr_filter.length)

    // [ℹ] iterate over ALL fixtures
    // [ℹ] of SELECTED season
    for (const season_fixture_date_group of fixtures_arr_filter) {

      // [ℹ] convert the datetime to the correct variables to search for the fixture;
      // [ℹ] FIXME: issue with the use of UTC DATE, for "getUTCDate" giving yesterdays date
      const year_: string = new Date(season_fixture_date_group.date).getFullYear().toString();
      const month_: number = new Date(season_fixture_date_group.date).getMonth();
      let new_month_ = (month_ + 1).toString();
      new_month_ = (`0${new_month_}`).slice(-2);
      let day_ = new Date(season_fixture_date_group.date).getDate().toString();
      day_ = (`0${day_}`).slice(-2);
      
      // [ℹ] iterater over fixtures 
      // [ℹ] [BY DATE GROUP]
      // [ℹ] assign "onValue" event-listeners
      for (const season_fixture of season_fixture_date_group.fixtures) {

        if (["FT", "FT_PEN", "AET"].includes(season_fixture.status)) {
          continue
        }

        const fixture_id = season_fixture.id;

        // [ℹ] listen to real-time fixture event changes;
        const fixtureRef = ref (
          db_real,
          `odds/${year_}/${new_month_}/${day_}/${fixture_id}`
        );

        // if (fixture_id == 18528023) {
        //   if (dev) console.log("snapshot", `odds/${year_}/${new_month_}/${day_}/${fixture_id}`)
        // }

        const listenEventRef = onValue(fixtureRef, (snapshot) => {
          // [ℹ] break-down-values
          if (snapshot.val() != null) {
            // if (dev) console.log("snapshot.key", snapshot.key)
            const sportbook_array: FIREBASE_odds[] = []
            const data: [string, FIREBASE_odds][] = Object.entries(snapshot.val())
            for (const sportbook of data) {
              sportbook[1].sportbook = sportbook[0].toString();
              sportbook_array.push(sportbook[1])
            }
            const fixture_id_: number = parseInt(snapshot.key)
            checkForFixtureOddsInject(fixture_id_, sportbook_array);
          }
        });

        realTimeOddsListenMap.set(fixture_id, listenEventRef);
      }

    }

  }

  // [ℹ] one-off event read "livescores_now"
  onMount(async() => {
    const firebase_real_time = await getLivescoresNow()
    if (firebase_real_time != null) {
      const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
      checkForLiveFixtures(data)
    }
    const firebase_odds = await getOdds(fixtures_arr_filter)
    if (firebase_odds.size != 0) {
      for (const [key, value] of firebase_odds.entries()) {
        checkForFixtureOddsInject(key, value);
      }
    }
  })
  
  // [ℹ] real-time listen-events init.
  onMount(async() => {
    listenRealTimeLivescoresNowChange();
    listenRealTimeOddsChange();
    setInterval(async () => {
      tickSecShow = !tickSecShow
    }, 500)
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
        select_fixtures_odds()
        listenRealTimeLivescoresNowChange()
        listenRealTimeOddsChange();
      }
    });
  })

  onDestroy(async() => {
    // [ℹ] close LISTEN EVENT connection
    for (const [key, value] of realTimeOddsListenMap.entries()) {
      if (dev) console.groupCollapsed("closing connections [DEV]");
      if (dev) console.log("closing connection")
      if (dev) console.groupEnd();
      value();
    }
  })

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  // [ℹ] SPORTBOOK-DETAILS [GET]
  async function widget_init(): Promise < Cache_Single_SportbookDetails_Data_Response > {

    // [ℹ] validation of platform key data loaded
    if (
      !$userBetarenaSettings.country_bookmaker
      || $sessionStore?.selectedSeasonID == undefined
    ) {
      return
    }
    let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()

    if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `widget_init()`)

    // [ℹ] get response [lang] [data] [obtained from preload()]
		const response: Cache_Single_SportbookDetails_Data_Response = await get("/api/cache/tournaments/sportbook?geoPos="+userGeo)
    const response_all: Cache_Single_SportbookDetails_Data_Response[] = await get("/api/cache/tournaments/sportbook?all=true&geoPos="+userGeo)
    loaded = true;

    // [ℹ] validation check, main
		if (
      FIXTURES_ODDS_T == undefined
      || FIXTURES_ODDS_DATA == undefined
      || response == undefined
    ) {
      // [🐛] debug 
      if (dev) logDevGroup ("fixture odds [DEV]", `❌ no data available!`)
      noWidgetData = true;
			return;
		}
    else {
      noWidgetData = false;
    }

    if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `widget_init() cont.`)

    // [ℹ] enable when no widget fetch is required, i.e. no const response ...
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(2000);

    select_fixtures_odds();

    SPORTBOOK_DETAILS_LIST = response_all;
    SPORTBOOK_DETAILS_LIST.sort((a, b) => parseInt(a.position) - parseInt(b.position))

    return response;
  }

  function select_table_view(
    opt: 'odds' | 'matches'
  ) {
    selectedOpt = opt;
  }

  async function select_fixtures_odds() {

    // [ℹ] validation check
    if (FIXTURES_ODDS_DATA == undefined) {
      return
    }

    // [🐞]
    if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `select_fixtures_odds()`)

    // ~~~~~~~~~~~~~
    // MAIN
    // ~~~~~~~~~~~~~

    fixtures_arr_filter = []
    let temp_fixtures_odds_arr: Tournament_Fixture_Odds[] = []

    // [ℹ] current user (client) date
    // [🐞]
    // const date = new Date("2023-07-29");
    const date = new Date();

    let target_season = FIXTURES_ODDS_DATA.seasons
    .find( ({ season_id }) => 
      season_id === $sessionStore.selectedSeasonID
    );

    if (dev) console.log('FIXTURES_ODDS_DATA', FIXTURES_ODDS_DATA)

    // [ℹ] validation check (#1)
    if (target_season == undefined) {

      // [ℹ] validation check (#1.2)
      // [ℹ] past season
      // [ℹ] get target data
      // [ℹ] and inject in exisitng
      if (currentSeason != $sessionStore.selectedSeasonID) {
        lazyLoadingSeasonFixture = true;
        const response: Tournament_Season_Fixtures_Odds = await get(`/api/hasura/tournaments/fixture_odds?seasonId=${$sessionStore.selectedSeasonID}`)
        if (response == undefined) {
          noWidgetData = true;
          lazyLoadingSeasonFixture = false;
          return;
        }
        else {
          FIXTURES_ODDS_DATA.seasons
          .push(response)
          if (dev) console.log('FIXTURES_ODDS_DATA', FIXTURES_ODDS_DATA)
          FIXTURES_ODDS_DATA = FIXTURES_ODDS_DATA
          target_season = response
          lazyLoadingSeasonFixture = false;
        }
      }
      // [ℹ] else,
      // [ℹ] no data and exit
      else {
        noWidgetData = true;
        return;
      }
    }

    // [ℹ] validation check (#1) [weeks / rounds / fixtures] 
    if (target_season?.weeks == undefined
      || target_season?.rounds == undefined
      || target_season?.fixtures == undefined
    ) {
      noWidgetData = true;
      loaded = false;
      return;
    }

    // [ℹ] identify "round" start/end dates
    if (optView === 'round') {

      let target_round: Rounds_Data

      // [ℹ] complex round targeting selection
      for (let i = 0; i < target_season.rounds.length; i++) {
        
        const s_date = new Date(target_season.rounds[i].s_date)
        const e_date = new Date(target_season.rounds[i].e_date)
        const past_e_date = 
          i == 0 
            ? null
            : new Date(target_season.rounds[i-1].s_date)
        ;

        // [ℹ] case for LEAGUE on-going,
        // [ℹ] with user date matching an on-going fixtures-week
        if ((s_date <= date && e_date >= date) 
          || (s_date.getDate() == date.getDate() && s_date.getMonth() == date.getMonth() && s_date.getFullYear() == date.getFullYear()) 
          || (e_date.getDate() == date.getDate() && e_date.getMonth() == date.getMonth() && e_date.getFullYear() == date.getFullYear())
        ) {
          target_round = target_season.rounds[i]
          break
        }

        // [ℹ] case for LEAGUE on-going,
        // [ℹ] with a look at future upcoming fixtures
        else if (past_e_date !== null 
          && (past_e_date < date && s_date >= date)
        ) {
          target_round = target_season.rounds[i]
          break
        }

        // [ℹ] case for LEAGUE not yet started,
        // [ℹ] with a look at future upcoming fixtures
        else if (past_e_date === null
          && s_date >= date
        ) {
          target_round = target_season.rounds[i]
          break
        }

      }

      // [ℹ] situation validation check
      // [ℹ] past-season (user-date > (GT) past season end)
      // [ℹ] select last week of past-season as target_week
      if (target_round == undefined
        && new Date(target_season?.rounds[target_season.rounds.length - 1]?.e_date) < date
      ) {
        target_round = target_season?.rounds[target_season.rounds.length - 1]
      }

      if (dev) console.log('target_round', target_round)

      week_start = new Date(target_round.s_date)
      week_end = new Date(target_round.e_date)
      week_name = target_round.value

      // [ℹ] exclusive for round-data only
      current_rounds_all = target_season?.rounds
      current_round_select = target_round

      // [ℹ] search fixtures by target data
      // [ℹ] FIXME: only works with "fixture_time" - not with "fixture_date"
      // [ℹ] FIXME: happens to be with dates: "2022-09-19T00:00:00" [?]
      // if (dev) console.log("week_end", week_end)
      let mod_end_week = new Date(target_round.e_date)
      mod_end_week.setHours(mod_end_week.getHours() + 24)
      // if (dev) console.log("week_end", week_end)
      // if (dev) console.log("week_start", week_start)

      // [ℹ] search fixtures by target data
      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ fixture_time }) => 
        new Date(fixture_time) >= week_start 
        && new Date(fixture_time) <= mod_end_week
      );
    }
    // [ℹ] identify "week" start/end dates
    else {

      let target_week: Weeks_Data

      // [ℹ] complex week targeting
      for (let i = 0; i < target_season.weeks.length; i++) {
        
        const s_date = new Date(target_season.weeks[i].s_date)
        const e_date = new Date(target_season.weeks[i].e_date)
        const past_e_date = 
          i == 0 
            ? null
            : new Date(target_season.weeks[i-1].s_date)
        ;

        // [ℹ] case for LEAGUE on-going,
        // [ℹ] with user date matching an on-going fixtures-week
        if ((s_date <= date && e_date >= date) 
          || (s_date.getDate() == date.getDate() && s_date.getMonth() == date.getMonth() && s_date.getFullYear() == date.getFullYear()) 
          || (e_date.getDate() == date.getDate() && e_date.getMonth() == date.getMonth() && e_date.getFullYear() == date.getFullYear())
        ) {
          target_week = target_season.weeks[i]
          break
        }

        // [ℹ] case for LEAGUE on-going,
        // [ℹ] with a look at future upcoming fixtures
        else if (past_e_date !== null 
          && (past_e_date < date && s_date >= date)
        ) {
          target_week = target_season.weeks[i]
          break
        }

        // [ℹ] case for LEAGUE not yet started,
        // [ℹ] with a look at future upcoming fixtures
        else if (past_e_date === null
          && s_date >= date
        ) {
          target_week = target_season.weeks[i]
          break
        }

      }

      // [ℹ] situation validation check
      // [ℹ] past-season (user-date > (GT) past season end)
      // [ℹ] select last week of past-season as target_week
      if (target_week == undefined 
        && new Date(target_season?.weeks[target_season.weeks.length - 1]?.e_date) < date
      ) {
        target_week = target_season?.weeks[target_season.weeks.length - 1]
      }

      week_start = new Date(target_week.s_date)
      week_end = new Date(target_week.e_date)
      week_name = parseInt(target_week.name)

      // [ℹ] search fixtures by target data
      // [ℹ] FIXME: only works with "fixture_time" - not with "fixture_date"
      // [ℹ] FIXME: happens to be with dates: "2022-09-19T00:00:00" [?]
      // if (dev) console.log("week_end", week_end)
      let mod_end_week = new Date(target_week.e_date)
      mod_end_week.setHours(mod_end_week.getHours() + 24)
      // if (dev) console.log("week_end", week_end)
      // if (dev) console.log("week_start", week_start)

      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ fixture_time }) => 
        new Date(fixture_time) >= week_start
        && new Date(fixture_time) <= mod_end_week
      );
    }

    // [ℹ] extra get number of total weeks & rounds
    weeks_total = target_season.weeks.length
    rounds_total = target_season.rounds.length
    total_nav_num = 
      optView === 'round'
        ? rounds_total
        : weeks_total
    ;

    /**
     * [ℹ] group-by fixtures "fixture-day" using a map
     * [ℹ] sort key => values by fixture-time in "ASC" order
     * [ℹ] and, generate array from set map data with array-objects
    */
    const fixtures_group_by_date = new Map <string, Tournament_Fixture_Odds[]> ();
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
    for (const [group_date, fixtures_arr] of fixtures_group_by_date.entries()) {
      const fixObj = {
        date: group_date,
        fixtures: fixtures_arr
      }
      fixtures_arr_filter.push(fixObj);
    }

    /**
     * [ℹ] END
     * [ℹ] sort TARGET FIXTURES by DATE
    */
    fixtures_arr_filter
    .sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // [🐞]
    if (dev) console.log('fixtures_arr_filter', fixtures_arr_filter)

    // [ℹ] break-down-values
    // [ℹ] kickstart Fireabse calls
    if (loaded) {
      // [ℹ] livescores
      const firebase_real_time = await getLivescoresNow()
      if (firebase_real_time != null) {
        const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
        checkForLiveFixtures(data)
      }
      listenRealTimeLivescoresNowChange()
      // [ℹ] odds init
      const firebase_odds = await getOdds(fixtures_arr_filter)
      if (firebase_odds.size != 0) {
        for (const [key, value] of firebase_odds.entries()) {
          checkForFixtureOddsInject(key, value);
        }
      }
      listenRealTimeOddsChange();
    }

    // [ℹ] signal widget data UI readiness
    ready = true;
    noWidgetData = false;
    loaded = true;
  }

  async function carusel_fixture_odds_data(
    opt_view: number
  ) {

    // [🐞]
    if (dev && enableLogs) logDevGroup ("fixture odds [DEV]", `carusel_fixture_odds_data()`)

    fixtures_arr_filter = []
    let temp_fixtures_odds_arr: Tournament_Fixture_Odds[] = []

    const target_season = FIXTURES_ODDS_DATA.seasons
    .find( ({ season_id }) => 
      season_id === $sessionStore.selectedSeasonID
    );

    // [ℹ] identify "round" start/end dates
    if (optView === 'round') {

      const target_round = target_season.rounds
      .find( ({ value }) =>
        value == opt_view
      );

      week_start = new Date(target_round.s_date)
      week_end = new Date(target_round.e_date)
      week_name = target_round.value

      // [ℹ] exclusive for round-data only
      current_round_select = target_round

      // [ℹ] search fixtures by target data
      // [ℹ] FIXME: only works with "fixture_time" - not with "fixture_date"
      // [ℹ] FIXME: happens to be with dates: "2022-09-19T00:00:00" [?]
      // if (dev) console.log("week_end", week_end)
      let mod_end_week = new Date(target_round.e_date)
      mod_end_week.setHours(mod_end_week.getHours() + 24)
      // if (dev) console.log("week_end", week_end)
      // if (dev) console.log("week_start", week_start)

      // [ℹ] search fixtures by target data
      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ fixture_time }) => 
        new Date(fixture_time) >= week_start 
        && new Date(fixture_time) <= mod_end_week
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

      // [ℹ] search fixtures by target data
      // [ℹ] FIXME: only works with "fixture_time" - not with "fixture_date"
      // [ℹ] FIXME: happens to be with dates: "2022-09-19T00:00:00" [?]
      let mod_end_week = new Date(target_week.e_date)
      mod_end_week.setHours(mod_end_week.getHours() + 24)
      // if (dev) console.log("week_end", week_end)
      // if (dev) console.log("week_start", week_start)

      temp_fixtures_odds_arr = target_season.fixtures
      .filter( ({ fixture_time }) => 
        new Date(fixture_time) >= week_start &&
        new Date(fixture_time) <= mod_end_week
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
      if (firebase_real_time != null) {
        const data: [string, FIREBASE_livescores_now][] = Object.entries(firebase_real_time)
        checkForLiveFixtures(data)
      }
      listenRealTimeOddsChange()
    }
  }

  function selected_rounds_weeks_view(
    opt_view: "round" | "week"
  ) {
    optView = opt_view
    select_fixtures_odds()
  }

  function trigger_google_events(
    action: string
  ) {
    if (action === "betting_site_logo_football_fixtures_odds_tournament") {
      window.gtag('event', "betting_site_logo_football_fixtures_odds_tournament", { 
        'event_category': "widget_fixture_odds_info", 
        'event_label': "click_betting_site_logo", 
        'value': "click"
        }
      );
      return
    }
    if (action === "tournaments_football_fixtures_odds") {
      window.gtag('event', "tournaments_football_fixtures_odds", { 
        'event_category': "widget_fixture_odds_info", 
        'event_label': "click_betting_site_logo", 
        'value': "click"
        }
      );
      return
    }
  }

  function close_all_dropdowns() {
    toggleDropdown = false;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE WIDGET METHODS
  // [! CRITICAL !]
  // ~~~~~~~~~~~~~~~~~~~~~

	$: refresh_data = $userBetarenaSettings.country_bookmaker;

  $: if (browser
    && refresh_data
  ) {
    // [ℹ] reset necessary variables;
    refresh = true
    // loaded = false
    // noWidgetData = false
    // widget_init()
    setTimeout(async() => {
      refresh = false
    }, 100)
  }

  afterNavigate(async () => {
    widget_init()
  })

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE LANG SVELTE
  // [! CRITICAL !]
  // ~~~~~~~~~~~~~~~~~~~~~

  let server_side_language: string = 'en';
  $: if ($page.routeId != null
    && !$page.error
  ) {
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

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE OTHER
  // ~~~~~~~~~~~~~~~~~~~~~

  let loadedCurrentSeason: boolean = false;
  $: if (browser
    && $sessionStore.selectedSeasonID != undefined 
    && !loadedCurrentSeason
  ) {
    currentSeason = $sessionStore.selectedSeasonID;
    loadedCurrentSeason = true;
  }

  $: if (browser
    && $sessionStore.selectedSeasonID != undefined
  ) {
    if (dev) logDevGroup ("fixture odds [DEV]", `Updated season!`)
    select_fixtures_odds()
  }

  $: if (optView == "round") {
    total_nav_num = rounds_total;
  } else {
    total_nav_num = weeks_total;
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
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		if (wInit <= mobileView) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
      if (w >= tabletView) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			if (w <= mobileView) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
  });

  // ~~~~~~~~~~~~~~~~~~~~~
  // DEBUG
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (dev && enableLogs) {
    logDevGroup ("fixture odds [DEV]", 
    `
    ${browser} 
    ${!noWidgetData}
    ${!refresh}
    ${$userBetarenaSettings.country_bookmaker}
    ${ready}
    ${showWidget}
    `)
  }

</script>

<!-- ===============
  COMPONENT HTML 
=================-->

<!-- 
[ℹ] area-outside-for-close 
-->
{#if toggleDropdown}
  <div id="background-area-close" on:click={() => close_all_dropdowns()} />
{/if}

<div
  id='widget-outer'>

  <!-- 
  [ℹ] SEO DATA
  -->
  <!-- {#if !loaded && !noWidgetData} -->
    <div 
      id="seo-widget-box">
      <h2>{FIXTURES_ODDS_T?.matches}</h2>
      {#if FIXTURES_ODDS_DATA != undefined 
        && FIXTURES_ODDS_DATA?.seasons.length != 0}
        <!-- 
        [ℹ] fixtures text loop
        -->
        {#each FIXTURES_ODDS_DATA?.seasons[0].fixtures as item}
          <p>{item?.teams?.away?.name}</p>
          <p>{item?.teams?.home?.name}</p>
        {/each}
        <!-- 
        [ℹ] fixtures FIXTURE LINK loop
        [ℹ] fixtures TIP LINK loop
        -->
        {#each FIXTURES_ODDS_DATA?.seasons[0].fixtures as item}
          {#if 
            item?.fixture_link 
            && item?.fixture_link[server_side_language]}
            <a
              href={item?.fixture_link[server_side_language]}>
              {item?.teams?.home?.name} vs. {item?.teams?.away?.name}
            </a>
          {/if}
          {#if 
            item?.tip_link 
            && item?.tip_link[server_side_language]}
            <a 
              href={item?.tip_link[server_side_language]}>
              {item?.tip_link[server_side_language]}
            </a>
          {/if}
          <!-- {#if 
            item?.media_link && 
            item?.media_link.length != 0}
            <a 
              href="item?.tip_link[server_side_language]">
              {item?.media_link[0].video_link}
            </a>
          {/if} -->
        {/each}
      {/if}
    </div>
  <!-- {/if} -->

  <!-- 
  [ℹ] NO WIDGET DATA
  [ℹ] PLACEHOLDER
  -->
  {#if noWidgetData 
    && loaded}
    <!-- 
    [ℹ] title of the widget 
    -->
    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      {FIXTURES_ODDS_T?.matches}
    </h2>

    <!-- 
    [ℹ] no-widget-data-avaiable-placeholder container 
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
      
      <!-- 
      [ℹ] container w/ text 
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

  <!-- 
  [ℹ] MAIN WIDGET COMPONENT
  [ℹ] -> loading animation
  [ℹ] -> data propagation
  [ℹ] -> error handling
  -->
  {#if browser
    && !noWidgetData 
    && !refresh 
    && $userBetarenaSettings.country_bookmaker 
    && ready 
    && showWidget}

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <FixtureOddsWidgetContentLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      {#if lazyLoadingSeasonFixture}
        <FixtureOddsWidgetContentLoader />
      {:else}
        <!-- 
        [ℹ] widget-component
        [ℹ] [DESKTOP / TABLET / MOBILE] 
        -->
        <h2
          class="
            s-20 
            m-b-10 
            w-500 
            color-black-2
          "
          style="margin-top: 0px;"
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          {FIXTURES_ODDS_T?.matches}
        </h2>

        <div
          id="fixtures-odds-widget-container"
          class:widget-no-data-height={trueLengthOfArray == 0}
          class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

          <!-- 
          [ℹ] widget main top controls
          [DESKTOP]
          [TABLET]
          -->
          {#if !mobileExclusive}
            <!--
            [ℹ] widget main top controls 
            -->
            <div
              id="fixtures-odds-top-container"
              class="
                row-space-out 
                m-b-15
              ">

              <div
                class="row-space-start">

                <!-- 
                [ℹ] widget top selection fixtures odds views [DESKTOP]
                -->
                <div
                  id="fix-odds-view-box"
                  class="
                    row-space-start 
                    m-r-20
                  ">

                  <div
                    class="
                      fix-odds-view-opt-box 
                      cursor-pointer
                    "
                    on:click={() => select_table_view('matches')}
                    class:activeOpt={selectedOpt == 'matches'}>
                    <p
                      class="
                        s-14 
                        w-500 
                        color-grey
                      ">
                      {FIXTURES_ODDS_T?.matches}
                    </p>
                  </div>

                  <div
                    class="
                      fix-odds-view-opt-box
                      cursor-pointer
                    "
                    on:click={() => select_table_view('odds')}
                    class:activeOpt={selectedOpt == 'odds'}>
                    <p
                      class="
                        s-14 
                        w-500 
                        color-grey
                      ">
                      {FIXTURES_ODDS_T?.odds}
                    </p>
                  </div>

                </div>

                <!-- 
                [ℹ] dropdown season select
                -->
                <div
                  id='dropdown-seasons'
                  class="m-r-16">
                  
                  <div
                    class="row-space-start"
                    on:click={() => toggleDropdown = !toggleDropdown}>
                    <!-- 
                    [ℹ] display selected week / round
                    -->
                    <p
                      class='
                        s-14 
                        m-r-5 
                        w-500 
                        color-grey
                      '
                      style="white-space: nowrap;">
                      <!-- 
                      [ℹ] week [default] [translation] -->
                      {#if optView === "week"}
                        {FIXTURES_ODDS_T?.week} {week_name}
                      <!-- 
                      [ℹ] round [default] [translation] -->
                      {:else if optView === "round"
                        && current_round_select.type == 'round'}
                        {FIXTURES_ODDS_T?.round} {week_name}
                      <!-- 
                      [ℹ] round [stage] -->
                      {:else if optView === "round"
                        && current_round_select.type == 'advanced'}
                        {current_round_select.name}
                      {/if}
                    </p>
                    <!-- 
                    [ℹ] arrow down [hidden-menu] 
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
                  
                  <!-- 
                  [ℹ] show-dropdown
                  -->
                  {#if toggleDropdown}
                    <div
                      id="dropdown-list-main-container">
                      <div
                        id="dropdown-list-inner-container">
                        {#if optView === "week"}
                          {#each {length: weeks_total} as _,i}
                            <p
                              class='
                                s-14 
                                w-500 
                                row-season
                              '
                              class:color-primary={i+1 === week_name}
                              on:click={() => carusel_fixture_odds_data(i+1)}>
                              {FIXTURES_ODDS_T?.week} {i+1}
                            </p>
                          {/each}
                        <!-- 
                        [ℹ] round data show
                        -->
                        {:else}
                          {#each current_rounds_all as _,i}
                            <p
                              class='
                                s-14 
                                w-500 
                                row-season
                              '
                              class:color-primary={i+1 === week_name}
                              on:click={() => carusel_fixture_odds_data(i+1)}>
                              <!--
                              [ℹ] round [default] [translation] -->
                              {#if current_rounds_all[i].type == 'round'}
                                {FIXTURES_ODDS_T?.round} {i+1}
                              <!-- 
                              [ℹ] round [stage] -->
                              {:else if current_rounds_all[i].type == 'advanced'}
                                {current_rounds_all[i].name}
                              {/if}
                            </p>
                          {/each}
                        {/if}
                      </div>
                    </div>
                  {/if}

                </div>
              </div>

              <!-- 
              [ℹ] widget rounds / weeks selection 
              -->
              <div
                id="widget-round-week-select"
                class="row-space-start">
                <div
                  on:click={() => selected_rounds_weeks_view("round")}
                  class="row-space-start m-r-16">
                  <label for="round">
                    <input 
                      aria-label="select-round-view" 
                      placeholder=""
                      type="radio" 
                      name="matches-odds-select" 
                      bind:group={optView}
                      id="round"
                      class="m-r-8"
                      value={"round"}
                    />
                  </label>
                  <p
                    class="s-14 w-500 color-grey"
                    class:color-primary={optView === "round"}>
                    {FIXTURES_ODDS_T?.round}
                  </p>
                </div>
                <div
                  on:click={() => selected_rounds_weeks_view("week")}
                  class="row-space-start">
                  <label for="week">
                    <input 
                      aria-label="select-weekly-view" 
                      placeholder=""
                      type="radio" 
                      name="matches-odds-select"
                      bind:group={optView}
                      id="week"
                      class="m-r-8"
                      value={"week"}
                    />
                  </label>
                  <p
                    class="s-14 w-500 color-grey"
                    class:color-primary={optView === "week"}>
                    {FIXTURES_ODDS_T?.week}
                  </p>
                </div>
              </div>

            </div>
          <!-- 
          [ℹ] widget main top controls
          [MOBILE]
          -->
          {:else}
            <!-- 
            [ℹ] widget top selection fixtures odds views [MOBILE]
            -->
            <div
              id="fix-odds-view-box"
              class="
                row-space-start 
                m-b-16
              ">

              <div
                class="
                  fix-odds-view-opt-box 
                  cursor-pointer
                "
                on:click={() => select_table_view('matches')}
                class:activeOpt={selectedOpt == 'matches'}>
                <p
                  class="
                    s-14 
                    w-500 
                    color-grey
                  ">
                  {FIXTURES_ODDS_T?.matches}
                </p>
              </div>

              <div
                class="
                  fix-odds-view-opt-box 
                  cursor-pointer
                "
                on:click={() => select_table_view('odds')}
                class:activeOpt={selectedOpt == 'odds'}>
                <p
                  class="
                    s-14 
                    w-500 
                    color-grey
                  ">
                  {FIXTURES_ODDS_T?.odds}
                </p>
              </div>

            </div>
            <div
              id="mobile-middle-control-row"
              class="
                row-space-out 
                m-b-20
              ">
              <!-- 
              [ℹ] dropdown season select
              -->
              <div
                id='dropdown-seasons'
                class="m-r-16">
                
                <div
                  class="row-space-start"
                  on:click={() => toggleDropdown = !toggleDropdown}>
                  <!-- 
                  [ℹ] display selected week / round
                  -->
                  <p
                    class='
                      s-14 
                      m-r-5 
                      w-500 
                      color-grey
                    '
                    style="white-space: nowrap;">
                    <!-- 
                    [ℹ] week [default] [translation] -->
                    {#if optView === "week"}
                      {FIXTURES_ODDS_T?.week} {week_name}
                    <!-- 
                    [ℹ] round [default] [translation] -->
                    {:else if optView === "round"
                      && current_round_select.type == 'round'}
                      {FIXTURES_ODDS_T?.round} {week_name}
                    <!-- 
                    [ℹ] round [stage] -->
                    {:else if optView === "round"
                      && current_round_select.type == 'advanced'}
                      {current_round_select.name}
                    {/if}
                  </p>
                  <!-- 
                  [ℹ] arrow down [hidden-menu] 
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
                
                <!-- 
                [ℹ] show-dropdown
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
                            on:click={() => carusel_fixture_odds_data(i+1)}>
                            {FIXTURES_ODDS_T?.week} {i+1}
                          </p>
                        {/each}
                      {:else}
                        {#each current_rounds_all as _,i}
                          <p
                            class='
                              s-14 
                              w-500 
                              row-season
                            '
                            class:color-primary={i+1 === week_name}
                            on:click={() => carusel_fixture_odds_data(i+1)}>
                            <!--
                            [ℹ] round [default] [translation] -->
                            {#if current_rounds_all[i].type == 'round'}
                              {FIXTURES_ODDS_T?.round} {i+1}
                            <!-- 
                            [ℹ] round [stage] -->
                            {:else if current_rounds_all[i].type == 'advanced'}
                              {current_rounds_all[i].name}
                            {/if}
                          </p>
                        {/each}
                      {/if}
                    </div>
                  </div>
                {/if}

              </div>
              <!--
              [ℹ] widget rounds / weeks selection 
              -->
              <div
                id="widget-round-week-select"
                class="row-space-start">
                <div
                  on:click={() => selected_rounds_weeks_view("round")}
                  class="row-space-start m-r-16">
                  <label for="round">
                    <input 
                      aria-label="select-round-view" 
                      placeholder=""
                      type="radio" 
                      name="matches-odds-select" 
                      bind:group={optView}
                      id="round"
                      class="m-r-8"
                      value={"round"}
                    />
                  </label>
                  <p
                    class="s-14 w-500 color-grey"
                    class:color-primary={optView === "round"}>
                    {FIXTURES_ODDS_T?.round}
                  </p>
                </div>
                <div
                  on:click={() => selected_rounds_weeks_view("week")}
                  class="row-space-start">
                  <label for="week">
                    <input 
                      aria-label="select-weekly-view" 
                      placeholder=""
                      type="radio" 
                      name="matches-odds-select"
                      bind:group={optView}
                      id="week"
                      class="m-r-8"
                      value={"week"}
                    />
                  </label>
                  <p
                    class="s-14 w-500 color-grey"
                    class:color-primary={optView === "week"}>
                    {FIXTURES_ODDS_T?.week}
                  </p>
                </div>
              </div>
            </div>
          {/if}

          <!-- 
          [ℹ] widget round / week
          [ℹ] week toggle decrement/increment data
          -->
          <div
            id="mobile-table-box"
            class="
              row-space-out 
              m-b-12
            ">
            <!--
            [ℹ] navigate to past date-data
            -->
            <button
              id="left-btn"
              class="table-nav-btn"
              aria-label="selectedOptionTableMobile"
              disabled={week_name == 1}
              on:click={() => carusel_fixture_odds_data(week_name - 1)}>
            </button>
            <!--
            [ℹ] navigation text main show
            -->
            <div
              class="text-center">
              <p
                class="
                  s-16 
                  w-500 
                  color-black
                ">
                <!-- 
                [ℹ] week [default] [translation] -->
                {#if optView === "week"}
                  {FIXTURES_ODDS_T?.week} {week_name}
                <!-- 
                [ℹ] round [default] [translation] -->
                {:else if optView === "round"
                  && current_round_select.type == 'round'}
                  {FIXTURES_ODDS_T?.round} {week_name}
                <!-- 
                [ℹ] round [stage] -->
                {:else if optView === "round"
                  && current_round_select.type == 'advanced'}
                  {current_round_select.name}
                {/if}
              </p>
              <p
                class="
                  s-12 
                  color-grey
                ">
                {week_start.getDate()}
                {FIXTURES_ODDS_T?.months_abbreviation[monthNames[week_start.getMonth()]]}
                -
                {week_end.getDate()}
                {FIXTURES_ODDS_T?.months_abbreviation[monthNames[week_end.getMonth()]]}
              </p>
            </div>
            <!--
            [ℹ] navigate to future date-data
            -->
            <button
              id="right-btn"
              class="table-nav-btn"
              aria-label="selectedOptionTableMobile"
              disabled={week_name == total_nav_num}
              on:click={() => carusel_fixture_odds_data(week_name + 1)}>
            </button>
          </div>

          <!--
          [ℹ] widget MATCHES / ODDS view  
          -->
          {#if selectedOpt == 'matches'}
            <!-- 
            [ℹ] generated data fixtures
            -->
            {#each fixtures_arr_filter as item}
              <div>
                <!-- 
                [ℹ] grouping date fixtures
                -->
                <div
                  class="
                    group-fixture-date 
                    m-t-10 
                    m-b-8
                  ">
                  <p
                    class="
                      color-grey
                      w-500 
                      s-12
                    "> 
                    <!-- date -->
                    {new Date(item?.date).getDate()} 
                    <!-- month abrev. -->
                    {FIXTURES_ODDS_T.months_abbreviation[monthNames[new Date(item?.date).getMonth()]]}, 
                    <!-- week day abrev. -->
                    {FIXTURES_ODDS_T[weekDays[new Date(item?.date).getDay()]]}
                  </p>
                </div>
                <!-- 
                [ℹ] matches loop population 
                -->
                {#each item?.fixtures as fixture}
                  <div
                    class="
                      fixture-row 
                      row-space-out
                    ">
                    <!-- 
                    [ℹ] fixture left-side container 
                    -->
                    <div
                      class="row-space-start">
                      <!-- 
                      [ℹ] fixture-time
                      -->
                      <div
                        class="
                          m-r-16 
                          fixture-time-box 
                          text-center
                        ">
                        {#if fixture?.status === "LIVE"}
                          <p
                            style="color: #FF3C3C;"
                            class="s-14 no-wrap">
                            {fixture?.minute}
                            <span
                              class:visibility-none={tickSecShow}>
                              '
                            </span>
                          </p>
                        {:else if fixture?.status === "HT"}
                          <p
                            class="
                              no-wrap 
                              s-14 
                              color-black
                            ">
                            {FIXTURES_ODDS_T?.status_abv?.HT}
                          </p>
                        <!-- 
                        [ℹ] fixture-time +
                        [ℹ] status [translation] abbreviations SHOW
                        -->
                        {:else}
                          <p
                            class="
                              no-wrap 
                              s-14 
                              color-black
                            "
                            class:color-grey={["FT", "FT_PEN", "AET"].includes(fixture?.status)}>
                            {
                              (
                                ('0' + new Date(fixture?.fixture_time + "Z").getHours()).slice(-2) +
                                ":" +
                                ('0' + new Date(fixture?.fixture_time + "Z").getMinutes()).slice(-2)
                              ).split(' ').join('')
                            }
                          </p>
                          <!-- 
                          [ℹ] show status-abv of the match translations
                          [ℹ] NOTE: status_abv trnasltions on hasura must
                          [ℹ] NOTE: must match that of the SPORTMONKS data
                          -->
                          <p
                            class="
                              no-wrap 
                              s-14 
                              color-grey
                            ">
                            {#if fixture?.status != "NS"}
                              <p
                                class="
                                  no-wrap 
                                  s-14 
                                  color-grey
                                ">
                                {FIXTURES_ODDS_T?.status_abv[fixture?.status]}
                              </p>
                            {/if}
                          </p>
                        {/if}
                      </div>

                      <!-- 
                      [ℹ] fixture-teams with FIXTURE-LINK
                      FIXME: data-sveltekit-prefetch syntax error
                      -->
                      <a
                        href={fixture?.fixture_link == undefined 
                          ? ''
                          : fixture?.fixture_link[server_side_language]
                        }
                        style="width: inherit;"
                        data-sveltekit-prefetch
                        class:disable-anchor={
                          fixture?.fixture_link == undefined
                          || fixture?.fixture_link[server_side_language] == undefined
                        }>
                        <div
                          class="
                            column-start-grid-start 
                            fixture-teams-box
                          ">
                          <!-- 
                          [ℹ] fixture home team box
                          -->
                          <div
                            class="row-space-start">
                            <!-- 
                            [ℹ] fixture home team name
                            -->
                            <p
                              class="
                                s-14 
                                color-black 
                                w-500 
                                m-r-8
                              "
                              class:color-grey={fixture?.teams?.home?.score < fixture?.teams?.away?.score}>
                              {fixture?.teams?.home?.name}
                            </p>
                            <!-- 
                            [ℹ] fixture-red-cards show/hide
                            -->
                            {#if fixture?.teams?.home?.red_cards}
                              {#if fixture?.teams?.home?.red_cards == 1}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={one_red_card_dark} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {:else}
                                  <img 
                                    src={one_red_card} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {/if}
                                
                              {:else if fixture?.teams?.home?.red_cards == 2}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={two_red_card_dark} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {:else}
                                  <img 
                                    src={two_red_card} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {/if}
                              
                              {:else}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={three_red_card_dark} 
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
                            {/if}
                          </div>
                          <!-- 
                          [ℹ] fixture away team box
                          -->
                          <div
                            class="row-space-start">
                            <!-- 
                            [ℹ] fixture away team name
                            -->
                            <p
                              class="
                                s-14 
                                color-black 
                                w-500 
                                m-r-8
                              "
                              class:color-grey={fixture?.teams?.away?.score < fixture?.teams?.home?.score}>
                              {fixture?.teams?.away?.name}
                            </p>
                            <!-- 
                            [ℹ] fixture-red-cards show/hide
                            -->
                            {#if fixture?.teams?.away?.red_cards}
                              {#if fixture?.teams?.away?.red_cards == 1}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={one_red_card_dark} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {:else}
                                  <img 
                                    src={one_red_card} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {/if}
                                
                              {:else if fixture?.teams?.away?.red_cards == 2}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={two_red_card_dark} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {:else}
                                  <img 
                                    src={two_red_card} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {/if}
                                
                              {:else}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={three_red_card_dark} 
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
                            {/if}
                          </div>
                        </div>
                      </a>

                    </div>
                    <!-- 
                    [ℹ] fixture right-side container 
                    -->
                    <div
                      class="row-space-end"
                      style="width: auto;">

                      <!-- 
                      [ℹ] fixture-link / media-link
                      [ℹ] show under conditions
                      -->
                      {#if fixture?.media_link 
                        && fixture?.media_link.length != 0 
                        && fixture?.fixture_link 
                        && fixture?.fixture_link[server_side_language]}
                        <a
                          data-sveltekit-prefetch
                          href={fixture?.fixture_link[server_side_language]}
                          aria-label="media_link_redirect"
                          style="width: inherit;">
                          <div
                            class="
                              media-play-btn 
                              m-r-16
                            ">
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

                      <!-- 
                      [ℹ] tip-link box SHOW/HIDE
                      -->
                      {#if fixture?.tip_link
                        && fixture?.tip_link[server_side_language]}
                        <a 
                          rel="nofollow"
                          aria-label="tip_link_redirect"
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

                      <!-- 
                      [ℹ] bet-site SHOW/HIDE
                      -->
                      {#if data}
                        <a 
                          rel="nofollow"
                          aria-label="betting_site_logo_football_fixtures_odds_tournament"
                          on:click={() => trigger_google_events("betting_site_logo_football_fixtures_odds_tournament")}
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

                      <!-- 
                      [ℹ] fixture scores BOX SHOW/HIDE
                      -->
                      {#if (fixture?.teams?.away?.score && fixture?.teams?.home?.score) 
                        || ["FT", "FT_PEN", "AET", "LIVE", "HT"].includes(fixture?.status)}
                        <div
                          class="
                            column-space-center 
                            m-l-24 
                            fixtures-scores-box
                          ">
                          <!-- 
                          [ℹ] home score
                          -->
                          <p
                            class="
                              s-14 
                              w-500 
                              color-black
                            "
                            class:color-grey={
                              (fixture?.teams?.home?.score < fixture?.teams?.away?.score) 
                              && fixture?.status != "LIVE"
                            }
                            class:color-red-bright={fixture?.status === "LIVE"}>
                            {fixture?.teams?.home?.score}
                          </p>
                          <!-- 
                          [ℹ] away score
                          -->
                          <p
                            class="
                              s-14 
                              w-500 
                              color-black
                            "
                            class:color-grey={
                              (fixture?.teams?.away?.score < fixture?.teams?.home?.score) 
                              && fixture?.status != "LIVE"}
                            class:color-red-bright={fixture?.status === "LIVE"}>
                            {fixture?.teams?.away?.score}
                          </p>
                        </div>
                      {/if}
                      
                    </div>
                  </div>
                {/each}
              </div>
            {/each}
          {:else}

            <!-- 
            [ℹ] generated data fixtures
            -->
            {#each fixtures_arr_filter as item}
              <div>

                <div
                  class="group-fixture-date row-space-out m-t-10 m-b-8">
                  <!-- 
                  [ℹ] grouping date fixtures
                  -->
                  <p
                    class="color-grey w-500 s-12"> 
                    {new Date(item?.date).getDate()} 
                    {FIXTURES_ODDS_T.months_abbreviation[monthNames[new Date(item?.date).getMonth()]]}, 
                    {FIXTURES_ODDS_T[weekDays[new Date(item?.date).getDay()]]}
                  </p>
                  <!-- 
                  [ℹ] home | away | draw
                  -->
                  <div
                    class="row-space-end odds-head"
                    style="width: auto;">
                    <p
                      class="color-grey s-12 w-500">
                      {FIXTURES_ODDS_T?.home}
                    </p>
                    <p
                      class="color-grey s-12 w-500">
                      {FIXTURES_ODDS_T?.draw}
                    </p>
                    <p
                      class="color-grey s-12 w-500">
                      {FIXTURES_ODDS_T?.away}
                    </p>
                  </div>
                </div>

                <!-- 
                [ℹ] matches loop population 
                -->
                {#each item?.fixtures as fixture}
                  <div
                    class="fixture-row row-space-out">

                    <!-- 
                    [ℹ] fixture left-side container 
                    -->
                    <div
                      class="row-space-start">
                      <!-- 
                      [ℹ] fixture LIVE minute box
                      -->
                      <div
                        class="
                          m-r-16 
                          fixture-time-box 
                          text-center
                        ">
                        <!-- 
                        [ℹ] fixture LIVE minute show
                        -->
                        {#if fixture?.status === "LIVE"}
                          <p
                            style="color: #FF3C3C;"
                            class="
                              s-14 
                              no-wrap
                            ">
                            {fixture?.minute}
                            <span
                              class:visibility-none={tickSecShow}>'
                            </span>
                          </p>
                        <!-- 
                        [ℹ] fixture HT abbrv show
                        -->
                        {:else if fixture?.status === "HT"}
                          <p
                            class="
                              no-wrap 
                              s-14 
                              color-black
                            ">
                            {FIXTURES_ODDS_T?.status_abv?.HT}
                          </p>
                        <!-- 
                        [ℹ] fixture show TIME
                        [ℹ] plus appropiate abbreviations
                        -->
                        {:else}
                          <p
                            class="
                              no-wrap 
                              s-14 
                              color-black
                            "
                            class:color-grey={["FT", "FT_PEN", "AET"].includes(fixture?.status)}>
                            {
                              (('0' + new Date(fixture?.fixture_time + "Z").getHours()).slice(-2) +
                                ":" +
                                ('0' + new Date(fixture?.fixture_time + "Z").getMinutes()).slice(-2)
                              ).split(' ').join('')
                            }
                          </p>
                          {#if fixture?.status === "FT_PEN"}
                            <p
                              class="
                                no-wrap 
                                s-14 
                                color-grey
                              ">
                              {FIXTURES_ODDS_T?.status_abv?.FT_PEN}
                            </p>
                          {/if}
                          {#if fixture?.status === "FT"}
                            <p
                              class="
                                no-wrap 
                                s-14 
                                color-grey
                              ">
                              {FIXTURES_ODDS_T?.status_abv?.FT}
                            </p>
                          {/if}
                        {/if}
                      </div>

                      <!-- 
                      [ℹ] fixture-teams with FIXTURE-LINK
                      FIXME: data-sveltekit-prefetch syntax error
                      -->
                      <a
                        href={fixture?.fixture_link == undefined 
                          ? ''
                          : fixture?.fixture_link[server_side_language]
                        }
                        style="width: inherit;"
                        data-sveltekit-prefetch
                        class:disable-anchor={
                          fixture?.fixture_link == undefined
                          || fixture?.fixture_link[server_side_language] == undefined
                        }>
                        <div
                          class="
                            column-start-grid-start 
                            fixture-teams-box
                          ">
                          <!-- 
                          [ℹ] fixture home team box
                          -->
                          <div
                            class="row-space-start">
                            <!-- 
                            [ℹ] fixture home team name
                            -->
                            <p
                              class="
                                s-14 
                                color-black 
                                w-500 
                                m-r-8 
                                odds-view
                              "
                              class:color-grey={fixture?.teams?.home?.score < fixture?.teams?.away?.score}>
                              {fixture?.teams?.home?.name}
                            </p>
                            <!-- 
                            [ℹ] fixture-red-cards show/hide
                            -->
                            {#if fixture?.teams?.home?.red_cards}
                              {#if fixture?.teams?.home?.red_cards == 1}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={one_red_card_dark} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {:else}
                                  <img 
                                    src={one_red_card} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {/if}
                                
                              {:else if fixture?.teams?.home?.red_cards == 2}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={two_red_card_dark} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {:else}
                                  <img 
                                    src={two_red_card} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {/if}
                              
                              {:else}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={three_red_card_dark} 
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
                            {/if}
                          </div>
                          <!-- 
                          [ℹ] fixture away team box
                          -->
                          <div
                            class="row-space-start">
                            <!-- 
                            [ℹ] fixture away team name
                            -->
                            <p
                              class="
                                s-14 
                                color-black 
                                w-500 
                                m-r-8 
                                odds-view
                              "
                              class:color-grey={fixture?.teams?.away?.score < fixture?.teams?.home?.score}>
                              {fixture?.teams?.away?.name}
                            </p>
                            <!-- 
                            [ℹ] fixture-red-cards show/hide
                            -->
                            {#if fixture?.teams?.away?.red_cards}
                              {#if fixture?.teams?.away?.red_cards == 1}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={one_red_card_dark} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {:else}
                                  <img 
                                    src={one_red_card} 
                                    alt=""
                                    width=12px height=16px
                                  />
                                {/if}
                                
                              {:else if fixture?.teams?.away?.red_cards == 2}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={two_red_card_dark} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {:else}
                                  <img 
                                    src={two_red_card} 
                                    alt=""
                                    width=15px height=19px
                                  />
                                {/if}
                                
                              {:else}
                                {#if $userBetarenaSettings.theme == 'Dark'}
                                  <img 
                                    src={three_red_card_dark} 
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
                            {/if}
                          </div>
                        </div>
                      </a>

                    </div>

                    <!-- [ℹ] fixture right-side container 
                    -->
                    <div
                      class="row-space-end"
                      style="width: auto;">

                      <!-- 
                      [ℹ] scores 
                      -->
                      {#if
                        (fixture?.teams?.away?.score && fixture?.teams?.home?.score)
                        || ["FT", "FT_PEN", "AET", "LIVE", "HT"].includes(fixture?.status)}
                        <div
                          class="column-space-center fixtures-scores-box">
                          <p 
                            class="s-14 w-500 color-black"
                            class:color-grey={(fixture?.teams?.home?.score < fixture?.teams?.away?.score) && 
                              fixture?.status != "LIVE"}
                            class:color-red-bright={fixture?.status === "LIVE"}>
                            {fixture?.teams?.home?.score}
                          </p>
                          <p
                            class="s-14 w-500 color-black"
                            class:color-grey={(fixture?.teams?.away?.score < fixture?.teams?.home?.score) && 
                              fixture?.status != "LIVE"}
                            class:color-red-bright={fixture?.status === "LIVE"}
                            >
                            {fixture?.teams?.away?.score}
                          </p>
                        </div>
                      {/if}

                      <!-- 
                      [ℹ] live-odds 
                      -->
                      {#if fixture?.live_odds != undefined 
                        && !["FT", "FT_PEN", "AET"].includes(fixture?.status)}

                        <div
                          class="main-bet-box row-space-out"
                          style="width: auto;">
                          
                          <!-- 
                          [ℹ] home
                          -->
                          <a 
                            rel="nofollow"
                            aria-label="betting_site_logo_fixtures_odds"
                            on:click={() => trigger_google_events("tournaments_football_fixtures_odds")}
                            href={fixture?.live_odds?.home?.register_link}
                            target="_blank"
                            style="width: inherit;">
                            <div 
                              class="bet-site-box column-space-center m-r-5 cursor-pointer">
                              <p
                                class="s-12 color-black-2 w-500">
                                {fixture?.live_odds?.home?.value?.toFixed(2)}
                              </p>
                              <img  
                                src={fixture?.live_odds?.home.betting_site_icon_link} 
                                alt=""
                              />
                            </div>
                          </a>

                          <!-- 
                          [ℹ] draw
                          -->
                          <a 
                            rel="nofollow"
                            aria-label="betting_site_logo_fixtures_odds"
                            on:click={() => trigger_google_events("tournaments_football_fixtures_odds")}
                            href={fixture?.live_odds?.draw?.register_link}
                            target="_blank"
                            style="width: inherit;">
                            <div
                              class="bet-site-box column-space-center m-r-5 cursor-pointer">
                              <p
                                class="s-12 color-black-2 w-500">
                                {fixture?.live_odds?.draw?.value?.toFixed(2)}
                              </p>
                              <img  
                                src={fixture?.live_odds?.draw.betting_site_icon_link} 
                                alt=""
                              />
                            </div>
                          </a>

                          <!-- 
                          [ℹ] away
                          -->
                          <a 
                            rel="nofollow"
                            aria-label="betting_site_logo_fixtures_odds"
                            on:click={() => trigger_google_events("tournaments_football_fixtures_odds")}
                            href={fixture?.live_odds?.away?.register_link}
                            target="_blank"
                            style="width: inherit;">
                            <div
                              class="bet-site-box column-space-center cursor-pointer">
                              <p
                                class="s-12 color-black-2 w-500">
                                {fixture?.live_odds?.away?.value?.toFixed(2)}
                              </p>
                              <img  
                                src={fixture?.live_odds?.away.betting_site_icon_link} 
                                alt=""
                              />
                            </div>
                          </a>
                        
                        </div>
                      
                      {:else}
                        
                        <div  
                          class="no-odds-available-box">
                          <p
                            class="s-14 no-wrap color-grey text-center">
                            {FIXTURES_ODDS_T?.no_odds}
                          </p>
                        </div>

                      {/if}
                      
                    </div>

                  </div>
                {/each}
              </div>
            {/each}

          {/if}

        </div>
      {/if}

    <!-- 
    [ℹ] promise was rejected
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

  /* 
    [ℹ] OTHER STYLE / CSS 
  */
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
  a.disable-anchor {
    pointer-events: none;
  }

  /* 
    [ℹ] SEO WIDGET DATA 
  */
  
  #seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -999999px;
		left: -999999px;
	}

  /* 
    [ℹ] NO DATA WIDGET STYLE / CSS 
  */

  #no-widget-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-align: center;
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
    border: 1px solid #F5620F !important;
  } div.fix-odds-view-opt-box.activeOpt p {
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
    border: 1px solid #CCCCCC;
    -webkit-appearance: none;
    cursor: pointer;
  } div#widget-round-week-select input[type="radio"]:checked {
    background-color: #F5620F;
    border: 2px solid white;
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
  } div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar  {
    /* Hide scrollbar for IE, Edge and Firefox */ 
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    /* Hide scrollbar for Chrome, Safari and Opera */
    display: none;
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container {
    max-height: 308px;
    overflow-y: scroll;
    overflow-x: hidden;
  } div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season {
    padding: 11px 2px 11px 8px;
    white-space: nowrap;
    text-align: center;
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

  div#mobile-table-box {
    padding: 5px 12px;
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
  } div#mobile-table-box button#left-btn {
    width: 32px;
    height: 32px;
    background-image: url("./assets/slider-left.svg");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  } div#mobile-table-box button#left-btn:hover {
    background-image: url("./assets/slider-left-hover.svg");
  } div#mobile-table-box button#right-btn {
    width: 32px;
    height: 32px;
    background-image: url("./assets/slider-right.svg");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  } div#mobile-table-box button#right-btn:hover {
    background-image: url("./assets/slider-right-hover.svg");
  }

  div.group-fixture-date {
    background: #F2F2F2;
    padding: 7px 20px;
  }

  div.fixture-row {
    padding: 5px 12px;
  }

  div.fixture-time-box {
    width: 37px;
    margin-right: 8px;
  } div.fixture-time-box p {
    font-size: 12px;
  }

  div.fixture-teams-box {
    border-left: 1px #E6E6E6 solid;
    padding-left: 8px;
  } div.fixture-teams-box p {
    font-weight: 400;
  } div.fixture-teams-box p.odds-view {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 85px;
  }

  div.fixtures-scores-box {
    margin-left: 10px;
  } div.fixtures-scores-box p {
    font-weight: 400;
  }

  div.media-play-btn {
    display: flex;
    padding: 4px;
    margin-right: 5px;
    border: 1px solid #CCCCCC;
    border-radius: 50%;
  } div.media-play-btn img {
    width: 6px;
    height: 6px;
  }

  div.tip-box {
    padding: 2.5px 7px;
    border-radius: 4px;
    margin-right: 5px;
    border: 1px solid #CCCCCC;
  } div.tip-box:hover {
    border: 1px solid #F5620F !important;
  } div.tip-box p {
    font-size: 10px;
  } div.tip-box:hover p {
    color: #F5620F;
  }

  img#sportbook-logo-img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: 4px;
    object-position: left;
  }

  div.odds-head p {
    margin-right: 13px;
  } div.odds-head p:last-child {
    margin-right: 0px;
  }

  div.main-bet-box {
    margin-left: 6px;
  } div.main-bet-box div.bet-site-box {
    border-radius: 4px;
    border: 1px solid #CCCCCC;
    overflow: hidden;
    max-height: 40px;
    max-width: 40px;
  } div.main-bet-box div.bet-site-box:hover {
    border: 1px solid #F5620F !important;
  } div.main-bet-box div.bet-site-box:hover p {
    color: #F5620F !important;
  } div.main-bet-box div.bet-site-box:hover img {
    border-top: 1px solid #F5620F !important;
  } div.main-bet-box div.bet-site-box img {
    object-fit: cover;
    border-top: 1px solid #CCCCCC;
    width: 40px;
    height: 20px;
  } div.main-bet-box div.bet-site-box p {
    padding: 2px 0px;
  }

  div.no-odds-available-box {
    border: 1px solid #CCCCCC;
    padding: 8px 0px;
    border-radius: 4px;
    min-width: 130px;
    max-height: 40px;
    margin-left: 13px;
  }

  span.visibility-none {
    visibility: hidden;
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
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 400px) {
    div.fixture-teams-box p.odds-view {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 150px;
    }
  }

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

    div.fixture-row {
      padding: 5px 20px;
      max-height: 56px;
      height: 56px;
    }

    div.fixture-time-box {
      min-width: 47px;
      margin-right: 16px;
    } div.fixture-time-box p {
      font-size: 14px;
    }

    div.fixture-teams-box {
      border-left: 1px #E6E6E6 solid;
      padding-left: 16px;
    } div.fixture-teams-box p {
      font-weight: 500;
    }

    div.fixtures-scores-box {
      margin-left: 24px;
    } div.fixtures-scores-box p {
      font-weight: 500;
    }

    div.tip-box {
      padding: 6px 12px;
      margin-right: 16px;
    } div.tip-box p {
      font-size: 12px;
    } 
    
    div.media-play-btn { 
      padding: 9px;
      margin-right: 16px;
    } div.media-play-btn img {
      width: 14px;
      height: 14px;
    }

    img#sportbook-logo-img {
      width: 30px;
      height: 30px;
    }

    div.odds-head p {
      margin-right: 24px;
    } div.odds-head p:last-child {
      margin-right: 10px;
    }

    div.main-bet-box {
      margin-left: 24px;
    } div.main-bet-box div.bet-site-box {
      max-height: 48px;
      max-width: 48px;
    } div.main-bet-box div.bet-site-box img {
      width: 48px;
      height: 24px;
    }

    div.no-odds-available-box {
      padding: 13px 20px;
      min-width: 154px;
      max-height: 48px;
      margin-left: 24px;
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

  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  .dark-background-1 div.fix-odds-view-opt-box {
    border: 1px solid #737373;
  }
  .dark-background-1 div#fix-odds-view-box div.fix-odds-view-opt-box:hover p {
    color: #FFFFFF !important;
  }

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

  .dark-background-1 div.fixture-teams-box {
    border-left: 1px #616161 solid;
  }
  .dark-background-1 div.tip-box {
    border: 1px solid #737373;
  }
  .dark-background-1 div.media-play-btn {
    border: 1px solid #737373;
  }

  .dark-background-1 div#widget-round-week-select input[type="radio"] {
    background-color: transparent;
    border: 1px solid #999999;
  } .dark-background-1 div#widget-round-week-select input[type="radio"]:checked {
    background-color: #F5620F;
    border: 2px solid #4B4B4B;
    box-shadow: 0 0 0 1px #F5620F;
  }

  .dark-background-1 div#dropdown-seasons div#dropdown-list-main-container {
    /* dark theme/dark-gray */
    background: #616161;
    /* shadow/black */
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
    border-radius: 4px;
  }
  .dark-background-1  div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season {
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

  .dark-background-1 div.group-fixture-date {
    background: #616161 !important;
  }

  .dark-background-1 p.color-black {
    color: white;
  }

  .dark-background-1 div.bet-site-box {
    border: 1px solid #737373 !important;
  } .dark-background-1 div.bet-site-box img {
    border-top: 1px solid #737373 !important;
  }

  .dark-background-1 div.no-odds-available-box {
    border: 1px solid #737373 !important;
  }
</style>
