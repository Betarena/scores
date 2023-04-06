import type { FIREBASE_livescores_now } from '$lib/models/firebase';
import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';
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
  /** session data on the Firebase Livescore */
  livescore_now: Map<number, FIREBASE_livescores_now>
  /** session data on the Sportbook Data */
  sportbook_main: Cache_Single_SportbookDetails_Data_Response
  /** session data on the Sportbook Data (List) */
  sportbook_list: Cache_Single_SportbookDetails_Data_Response[]
  /** session data on the LivescoreNow Selected Date (View) */
  livescoreNowSelectedDate: Date
  /** session data on the LivescoreNow View Type Date (View) */
  livescoreFixtureView: 'all' | 'live'
  /** session data on the LivescoreNow Show/Hide Calndar Component */
  livescoreShowCalendar: boolean
  /** session data on the LivescoreNow Show/Hide Fixture NUmber */
  fixturesTodayNum: number
  /** session data on users current date */
  userDate: Date
}

// [ℹ] DEFAULT STORE STATE
const seassion_store: Platform_Session = {
	newsletterPopUpShow: false,
	selectedSeasonID: undefined,
	fixture_select_view: 'overview',
	auth_show: false,
  lang_intent: undefined,
  livescore_now: undefined,
  sportbook_main: undefined,
  sportbook_list: undefined,
  livescoreNowSelectedDate: new Date(),
  livescoreFixtureView: 'all',
  livescoreShowCalendar: false,
  fixturesTodayNum: 0,
  userDate: new Date()
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
    }
	};
}

export const sessionStore = createLocalStore();
