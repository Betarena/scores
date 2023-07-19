import type { Platform_Session } from '$lib/types/types.scores.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';

import { clientTimezoneDate, targetDate } from '$lib/utils/dates.js';
import { writable } from 'svelte/store';

import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

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
  userTxShowCalendar: false,
  userTxHistDateSelect: clientTimezoneDate(),
  userTxHistFilterDateRange:
  {
    from: targetDate
    (
      -7
    ),
    to: targetDate()
  },
  // (+) sportbook;
  sportbook_main: undefined,
  sportbook_list: undefined,
  // (+) real-time/live;
  livescore_now: undefined,
  livescore_now_scoreboard: new Map(),
  livescore_now_fixture_target: undefined,
  live_odds_fixture_target: [],
  live_odds_fixture_map: new Map(),
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
     * 🔹 HELPER
     *
     * @description
     *
     * 📌 Update and store `server language` in session object.
     *
     * @param
     * { string } lang - Target language server is currently in.
     */
    updateServerLang:
    (
      lang: string
    ): void =>
    {
      sessionStoreObj.serverLang = lang;
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @summary
     * 🔹 HELPER
     *
     * @description
     *
     * 📌 Update and store `live` **fixture odds** data for a **single fixture** in session object.
     *
     * @param
     * { FIREBASE_odds[] } data - Target fixture odds list.
     */
    updateLiveOdds:
    (
      data: FIREBASE_odds[]
    ): void =>
    {
      sessionStoreObj.live_odds_fixture_target = data;
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @summary
     * 🔹 HELPER
     *
     * @description
     *
     * 📌 Update and store `live` **fixture odds** data in session object.
     *
     * @param
     * { number } key - Target `fixtureId`
     *
     * @param
     * { FIREBASE_odds[] } data - Target `fixtureId` respective **odds** data.
     */
    updateLiveOddsMap:
    (
      key: number,
      data: FIREBASE_odds[]
    ): void =>
    {
      sessionStoreObj.live_odds_fixture_map.set
      (
        key,
        data
      );
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @deprecated
     *
     * @summary
     * 🔹 HELPER
     *
     * @description
     *
     * 📌 Update and store **all** `live` fixtures data in session object.
     *
     * @param
     * { Map < number, FIREBASE_livescores_now > } data - Target `fixture` data to store in session object.
     */
    updateLivescores:
    (
      data: Map<number, FIREBASE_livescores_now>
    ): void =>
    {
      sessionStoreObj.livescore_now = data
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @summary
     * 🔹 HELPER
     *
     * @description
     *
     * 📌 Update and stores `live` target fixture scores data in session object.
     *
     * @param
     * { FIREBASE_livescores_now } data - Target `fixture` data to store in session object.
     */
    updateLivescoresTarget:
    (
      data: FIREBASE_livescores_now
    ): void =>
    {
      sessionStoreObj.livescore_now_fixture_target = data
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @summary
     * 🔹 HELPER
     *
     * @description
     * 📌 Update and stores `live` target fixture scoreboard (V2) data in session object.
     *
     * @param
     * { Map < number, FIRE_LNNS > } data - Target `fixture` data to store in session object.
     */
    updateLivescoreScoreboard:
    (
      data: Map<number, FIRE_LNNS>
    ): void =>
    {
      sessionStoreObj.livescore_now_scoreboard = data
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @summary
     * 🔹 HELPER
     *
     * @description
     *
     * 📌 Update and stores `live` target fixture scoreboard (V2) data in session object.
     *
     * @param
     * { number } data - Target Livescore Player Id.
     */
    updateLivescorePlayerId:
    (
      data: number
    ): void =>
    {
      sessionStoreObj.livescore_now_player_fixture = data
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @summary
     * 🔹 HELPER
     *
     * @description
     *
     * 📌 Update and stores `live` target fixture scoreboard (V2) data in session object;
     *
     * @param
     * { number[] } data - Target Livescore Fixture Id's
     */
    updateLivescoreFixtureIds:
    (
      data: number[]
    ): void =>
    {
      sessionStoreObj.livescore_now_fixtures = data
      set
      (
        sessionStoreObj
      );
    },

    /**
     * TODO: DOC:
     * @param data
     */
    updateSportbookMain:
    (
      data: B_SPT_D
    ): void =>
    {
      sessionStoreObj.sportbook_main = data;
      set
      (
        sessionStoreObj
      );
    },

    /**
     * TODO: DOC:
     * @param data
     */
    updateSportbookList:
    (
      data: B_SPT_D[]
    ): void =>
    {
      // ### NOTE:
      // ### Sort data (asc).
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
    },

    /**
     * TODO: DOC:
     * @param _from
     * @param _to
     */
    updateUserTxHistDateRange:
    (
      _from: Date,
      _to: Date
    ): void =>
    {
      sessionStoreObj.userTxHistFilterDateRange =
      {
        from: _from,
        to: _to
      };

      console.debug('🔥')

      // set(sessionStoreObj);
      // update
      // (
      //   s =>
      //   (
      //     {
      //       ...s,
      //       userTxHistFilterDateRange:
      //       {
      //         from: _from,
      //         to: _to
      //       }
      //     }
      //   )
      // );
    }

	};
}

export const sessionStore = createLocalStore();
