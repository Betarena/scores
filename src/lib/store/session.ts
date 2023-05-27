import { clientTimezoneDate } from '$lib/utils/dates.js';
import type { FIREBASE_livescores_now, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import { writable } from 'svelte/store';

export interface Platform_Session {
  /** used by email (footer) pop-up modal */
	newsletterPopUpShow: boolean;
  /** NOTE:IMPORTANT - used for inter-component events of selected season changed (reactivity)  */
	selectedSeasonID: number;
  /** NOTE:IMPORTANT - used for inter-component events of selected view on fixtures page */
	fixture_select_view: 'overview' | 'news';
  /** [ℹ] used to show/hide auth pop-up modal */
	auth_show: boolean;
  /** NOTE: used for detecting and pre-loading the data for a TARGET page translation of the current one, programatically */
  lang_intent: string | undefined;
  /** session data on the Firebase Livescore [V1] */
  livescore_now: Map<number, FIREBASE_livescores_now>
  /** session data on the Firebase Livescore (Scoreboard) [V2] */
  livescore_now_scoreboard: Map<number, FIRE_LNNS>
  /** session data on the Sportbook Data */
  sportbook_main: B_SPT_D
  /** session data on the Sportbook Data (List) */
  sportbook_list: B_SPT_D[]
  /** 
   * session data | Livescore Now Selected Date (View). 
   * IMPORTANT
   * Must be in ISO/UTC timezone;
  */
  livescoreNowSelectedDate: Date
  /** session data on the LivescoreNow View Type Date (View) */
  livescoreFixtureView: 'all' | 'live'
  /** session data on the LivescoreNow Show/Hide Calndar Component */
  livescoreShowCalendar: boolean
  /** session data on the LivescoreNow Show/Hide Fixture NUmber */
  fixturesTodayNum: number
  /** session data on users current date 
   * IMPORTANT
   * Must be in user adjusted (TZ) timezone;
  */
  userDate: Date,
  livescore_now_fixture_target: FIREBASE_livescores_now
}

// [ℹ] DEFAULT STORE STATE
const seassion_store: Platform_Session = {
	newsletterPopUpShow: false,
	selectedSeasonID: undefined,
	fixture_select_view: 'overview',
	auth_show: false,
  lang_intent: undefined,
  livescore_now: undefined,
  livescore_now_scoreboard: new Map(),
  sportbook_main: undefined,
  sportbook_list: undefined,
  livescoreNowSelectedDate: clientTimezoneDate(),
  livescoreFixtureView: 'all',
  livescoreShowCalendar: false,
  fixturesTodayNum: 0,
  userDate: clientTimezoneDate(),
  livescore_now_fixture_target: undefined
};

function createLocalStore() {
	const { subscribe, set, update } = writable(
		seassion_store
	);

	return {
		subscribe,
		set,
		update,

		toggleNewsletter: () => {
			seassion_store.newsletterPopUpShow =
				!seassion_store.newsletterPopUpShow;
		},

    /**
     * @summary [METHOD] update stores
     * @description updates storesJs on Livescores Data;
     * @param {Map<number, FIREBASE_livescores_now>} data 
     */
    updateLivescores: (data: Map<number, FIREBASE_livescores_now>) => {
      seassion_store.livescore_now = data
      set(seassion_store)
    },

    /**
     * @summary [METHOD] update stores
     * @description updates storesJs on Livescores Data;
     * @param {Map<number, FIREBASE_livescores_now>} data 
     */
    updateLivescoresTarget: (data: FIREBASE_livescores_now) => {
      seassion_store.livescore_now_fixture_target = data
      set(seassion_store)
    },

    /**
     * @summary [METHOD] [MAIN] method
     * @description updates storesJs on Livescores (scoreboard) data;
     * @param {Map<number, FIREBASE_livescores_now>} data 
     */
    updateLivescoreScoreboard: (data: Map<number, FIRE_LNNS>) => {
      seassion_store.livescore_now_scoreboard = data
      set(seassion_store)
    },
	};
}

export const sessionStore = createLocalStore();
