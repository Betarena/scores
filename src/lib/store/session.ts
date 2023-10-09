// #region ➤ 📦 Package Imports

import { clientTimezoneDate, targetDate } from '$lib/utils/dates.js';
import { writable } from 'svelte/store';

import type { Platform_Session } from '$lib/types/types.scores.js';
import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

/**
 * @description
 * TODO: DOC:
 */
const sessionStoreObj: Platform_Session =
{
  // ### NOTE:
  // ### variables for show/hide.
	newsletterPopUpShow: false,
	auth_show: false,
  livescoreShowCalendar: false,
	selectedSeasonID: undefined,
  livescoreFixtureView: 'all',
	fixture_select_view: 'overview',
  navBtnHover: undefined,
  withdrawModal: false,
  showUseguide1: false,
  // ### NOTE:
  // ### variables for language handle.
  lang_intent: undefined,
  serverLang: undefined,
  // ### NOTE:
  // ### variables for misc.
  fixturesTodayNum: 0,
  competitionsNum: 0,
  competitionsOpenNum: 0,
  deviceType: undefined,
  // ### NOTE:
  // ### variables for date handle.
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
  // ### NOTE:
  // ### variables for sportbook.
  sportbook_main: undefined,
  sportbook_list: undefined,
  // ### NOTE:
  // ### variables for real-time/live;
  livescore_now: undefined,
  livescore_now_scoreboard: new Map(),
  livescore_now_fixture_target: undefined,
  live_odds_fixture_target: [],
  live_odds_fixture_map: new Map(),
  livescore_now_player_fixture: undefined,
  livescore_now_fixtures: [],
  competitions_map: new Map()
};

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @description
 * TODO: DOC:
 */
function createLocalStore
(
)
{

  // ◼️ NOTE:
  // ◼️ Default 'svelte/store' exports.
	const
  {
    subscribe,
    set,
    update
  } = writable
  (
		sessionStoreObj
	);

  // ◼️ NOTE:
  // ◼️ Complementary 'store' added methods.
  const methods =
  {

    /**
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and store `server language` in session object.
     * @param { string } lang
     *  Target `language` server is currently in.
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
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and store `live` **fixture odds** data for a **single fixture** in session object.
     * @param { FIREBASE_odds[] } data
     *  Target fixture odds list.
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
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and store `live` **fixture odds** data in session object.
     * @param { number } key
     *  Target `fixtureId`
     * @param { FIREBASE_odds[] } data
     *  Target `fixtureId` respective **odds** data.
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
     * @author
     *  @migbash
     * @deprecated
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and store **all** `live` fixtures data in session object.
     * @param { Map < number, FIREBASE_livescores_now > } data
     *  Target `fixture` data to store in session object.
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
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and stores `live` target fixture scores data in session object.
     * @param { FIREBASE_livescores_now } data
     *  Target `fixture` data to store in session object.
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
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and stores `live` target fixture scoreboard (V2) data in session object.
     * @param { Map < number, FIRE_LNNS > } data
     *  Target `fixture` data to store in session object.
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
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and stores `live` target fixture scoreboard (V2) data in session object.
     * @param { number } data
     *  Target Livescore Player Id.
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
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📌 Update and stores `live` target fixture scoreboard (V2) data in session object;
     * @param { number[] } data
     *  Target Livescore Fixture Id's
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
    },

    /**
     * @description
     * TODO: DOC:
     */
    getServerLang:
    (
    ): string =>
    {
      return sessionStoreObj.serverLang;
    },

    /**
     * @summary
     * 🔹 HELPER | IMPORTANT
     * @description
     *  📌 Update and store **latest competitions data** in user's session object.
     * @param { Map < number, B_H_COMP_DATA > } data
     *  Target new latest **competition data**.
     * @returns { void }
     */
    updateCompetitionsLatestMap:
    (
      data: Map < number, B_H_COMP_DATA >
    ): void =>
    {
      sessionStoreObj.competitions_map = data;
      set
      (
        sessionStoreObj
      );
    },

    /**
     * @summary
     *  🔹 HELPER | IMPORTANT
     * @description
     *  📌 Update and store **amount of competitions available** in user's session object.
     * @param { number } amountTotal
     *  Target amount of **competition data**.
     * @param { number } amountOpen
     *  Target amount of **competition data**.
     * @returns { void }
     */
    updateCompetitionsAllNum:
    (
      amountTotal: number,
      amountOpen: number
    ): void =>
    {
      sessionStoreObj.competitionsNum = amountTotal;
      sessionStoreObj.competitionsOpenNum = amountOpen;
      set
      (
        sessionStoreObj
      );
    }

  }

	return {
		subscribe,
		set,
		update,
    ...methods
	};
}

// #endregion ➤ 🛠️ METHODS

export default createLocalStore();