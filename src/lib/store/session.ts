import type { FIREBASE_livescores_now } from '$lib/models/firebase';
import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';
import { writable } from 'svelte/store';
export interface Platform_Session {
  // [ℹ] used by email (footer) pop-up modal
	newsletterPopUpShow: boolean;
  // NOTE:IMPORTANT - used for inter-component events of selected season changed (reactivity)
	selectedSeasonID: number;
  // NOTE:IMPORTANT - used for inter-component events of selected view on fixtures page
	fixture_select_view: 'overview' | 'news';
  // [ℹ] used to show/hide auth pop-up modal
	auth_show: boolean;
  // NOTE: used for detecting and pre-loading the data for a TARGET page translation of the current one, programatically
  lang_intent: string | undefined;
  livescore_now: Map<number, FIREBASE_livescores_now>
  sportbook_main: Cache_Single_SportbookDetails_Data_Response
  sportbook_list: Cache_Single_SportbookDetails_Data_Response[]
  livescoreNowSelectedDate: Date
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
  livescoreNowSelectedDate: undefined,
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

    updateLivescores: (data: Map<number, FIREBASE_livescores_now>) => {
      seassion_store.livescore_now = data
      set(seassion_store)
    }
	};
}

export const sessionStore = createLocalStore();
