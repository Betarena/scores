import type { Platform_Session } from '$lib/types/types.scores.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';

import { clientTimezoneDate } from '$lib/utils/dates.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import { writable } from 'svelte/store';

const sessionStoreObj: Platform_Session =
{
  // (+) show/hide;
	newsletterPopUpShow: false,
	auth_show: false,
  livescoreShowCalendar: false,
	selectedSeasonID: undefined,
  livescoreFixtureView: 'all',
	fixture_select_view: 'overview',
  navBtnHover: undefined,
  // (+) lang handle;
  lang_intent: undefined,
  serverLang: undefined,
  // (+) misc;
  fixturesTodayNum: 0,
  // (+) date handle;
  userDate: clientTimezoneDate(),
  livescoreNowSelectedDate: clientTimezoneDate(),
  // (+) sportbook;
  sportbook_main: undefined,
  sportbook_list: undefined,
  // (+) real-time/live;
  livescore_now: undefined,
  livescore_now_scoreboard: new Map(),
  livescore_now_fixture_target: undefined,
  live_odds_fixture_target: [],
  livescore_now_player_fixture: undefined,
  livescore_now_fixtures: []
};

function createLocalStore
(
)
{

	const
  {
    subscribe,
    set,
    update
  } = writable
  (
		sessionStoreObj
	);

	return {
		subscribe,
		set,
		update,

    /**
     * @summary
     * [HELPER]
     * @description
     * updates + stores global "session" language in session object;
     * @param
     * {string} lang
     */
    updateServerLang:
    (
      lang: string
    ) =>
    {
      sessionStoreObj.serverLang = lang;
      set(sessionStoreObj);
    },

    /**
     * @summary
     * [HELPER]
     * @description
     * stores "LIVE" target fixture odds data in session object;
     * @param
     * {FIREBASE_odds[]} data
     */
    updateLiveOdds:
    (
      data: FIREBASE_odds[]
    ) =>
    {
      sessionStoreObj.live_odds_fixture_target = data;
      set(sessionStoreObj);
    },

    /**
     * @summary
     * [HELPER]
     * @description
     * stores "LIVE" all fixtures data in session object;
     * @param
     * {Map<number, FIREBASE_livescores_now>} data in session object;
     */
    updateLivescores:
    (
      data: Map<number, FIREBASE_livescores_now>
    ) =>
    {
      sessionStoreObj.livescore_now = data
      set(sessionStoreObj)
    },

    /**
     * @summary
     * [HELPER]
     * @description
     * stores "LIVE" target fixture scores data in session object;
     * @param
     * {Map<number, FIREBASE_livescores_now>} data
     */
    updateLivescoresTarget:
    (
      data: FIREBASE_livescores_now
    ) =>
    {
      sessionStoreObj.livescore_now_fixture_target = data
      set(sessionStoreObj)
    },

    /**
     * @summary
     * [HELPER]
     * @description
     * stores "LIVE" target fixture scoreboard (V2) data in session object;
     * @param
     * {Map<number, FIREBASE_livescores_now>} data
     */
    updateLivescoreScoreboard:
    (
      data: Map<number, FIRE_LNNS>
    ) =>
    {
      sessionStoreObj.livescore_now_scoreboard = data
      set(sessionStoreObj)
    },

    /**
     * @summary
     * [HELPER]
     * @description
     * stores "LIVE" target fixture scoreboard (V2) data in session object;
     * @param
     * {Map<number, FIREBASE_livescores_now>} data
     */
    updateLivescorePlayerId:
    (
      data: number
    ) =>
    {
      sessionStoreObj.livescore_now_player_fixture = data
      set(sessionStoreObj)
    },

    /**
     * @summary
     * [HELPER]
     * @description
     * stores "LIVE" target fixture scoreboard (V2) data in session object;
     * @param
     * {Map<number, FIREBASE_livescores_now>} data
     */
    updateLivescoreFixtureIds:
    (
      data: number[]
    ) =>
    {
      sessionStoreObj.livescore_now_fixtures = data
      set(sessionStoreObj)
    },

    updateSportbookMain:
    (
      data: B_SPT_D
    ) =>
    {
      sessionStoreObj.sportbook_main = data;
      set
      (
        sessionStoreObj
      );
    },

    updateSportbookList:
    (
      data: B_SPT_D[]
    ) =>
    {
      // ACTION: sort data;
      data
      ?.sort
      (
        (
          a,
          b
        ) =>
        parseInt(a.position) - parseInt(b.position)
      );

      sessionStoreObj.sportbook_list = data;

      set
      (
        sessionStoreObj
      );
    }

	};
}

export const sessionStore = createLocalStore();
