import type { Platform_Session } from '$lib/types/types.scores.js';
import { clientTimezoneDate } from '$lib/utils/dates.js';
import type { FIREBASE_livescores_now, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import { writable } from 'svelte/store';

const seassion_store: Platform_Session = 
{
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
  userDate: clientTimezoneDate()
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
		seassion_store
	);

	return {
		subscribe,
		set,
		update,

    /**
     * @summary [METHOD] update stores
     * @description updates storesJs on Livescores Data;
     * @param {Map<number, FIREBASE_livescores_now>} data 
     */
    updateLivescores: 
    (
      data: Map<number, FIREBASE_livescores_now>
    ) => 
    {
      seassion_store.livescore_now = data
      set(seassion_store)
    },

    /**
     * @summary [METHOD] [MAIN] method
     * @description updates storesJs on Livescores (scoreboard) data;
     * @param {Map<number, FIREBASE_livescores_now>} data 
     */
    updateLivescoreScoreboard: 
    (
      data: Map<number, FIRE_LNNS>
    ) => 
    {
      seassion_store.livescore_now_scoreboard = data
      set(seassion_store)
    }

	};
}

export const sessionStore = createLocalStore();
