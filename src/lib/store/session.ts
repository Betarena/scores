import type { Platform_Session } from '$lib/types/types.scores.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';

import { clientTimezoneDate } from '$lib/utils/dates.js';
import { writable } from 'svelte/store';

const sessionStoreObj: Platform_Session = 
{
	newsletterPopUpShow: false,
	selectedSeasonID: undefined,
	fixture_select_view: 'overview',
	auth_show: false,
  lang_intent: undefined,
  serverLang: undefined,
  livescore_now: undefined,
  livescore_now_scoreboard: new Map(),
  sportbook_main: undefined,
  sportbook_list: undefined,
  livescoreNowSelectedDate: clientTimezoneDate(),
  livescoreFixtureView: 'all',
  livescoreShowCalendar: false,
  fixturesTodayNum: 0,
  userDate: clientTimezoneDate(),
  livescore_now_fixture_target: undefined,
  live_odds_fixture_target: []
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
    }

	};
}

export const sessionStore = createLocalStore();
