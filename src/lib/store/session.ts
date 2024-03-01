// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Client 'Svelte/Store'                                                          │
// │ > Main Scores Platform Page Session ('Ephermal') Store                           │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { clientTimezoneDate, targetDate } from '$lib/utils/dates.js';
import { writable } from 'svelte/store';

import type { ISessionStore } from '$lib/types/types.scores.js';
import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import type { Unsubscribe } from 'firebase/firestore';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  sessionStoreObj: ISessionStore
  = {
    deviceType: 'mobile',
    isUserActive: true,
    windowWidth: 0,
    firebaseListeners: [],
    grapqhQlWebSockets: [],
    currentActiveModal: null,
    currentAdminToggle: null,

    // ### NOTE:
    // ### variables for show/hide.
    auth_show: false,
    livescoreShowCalendar: false,
    selectedSeasonID: undefined,
    livescoreFixtureView: 'all',
    fixture_select_view: 'overview',
    navBtnHover: undefined,
    showUserguide1: false,
    showUserguide1Conf: false,
    showTermsAndConditions: false,
    showFixtureCompetition: false,
    // ### NOTE:
    // ### variables for language handle.
    lang_intent: undefined,
    serverLang: undefined,
    // ### NOTE:
    // ### variables for misc.
    fixturesTodayNum: 0,
    competitionsNum: 0,
    competitionsOpenNum: 0,
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
    competitions_map: new Map(),
    investDepositAmountMobileWeb3: undefined
  }
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

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
    ),
    /**
     * @description
     *  📣 Complementary 'store' added methods.
     */
    methods
      = {

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and store `server language` in session object.
         * @param { string } lang
         *  💠 **[required]** Target `language` server is currently in.
         * @returns { void }
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and store `live` **fixture odds** data for a **single fixture** in session object.
         * @param { FIREBASE_odds[] } data
         *  💠 **[required]** Target fixture odds list.
         * @returns { void }
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and store `live` **fixture odds** data in session object.
         * @param { number } key
         *  💠 **[required]** Target `fixtureId`.
         * @param { FIREBASE_odds[] } data
         *  💠 **[required]** Target `fixtureId` respective **odds** data.
         * @returns { void }
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
          return;
        },

        /**
         * @deprecated
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and store **all** `live` fixtures data in session object.
         * @param { Map < number, FIREBASE_livescores_now > } data
         *  💠 **[required]** Target `fixture` data to store in session object.
         * @returns { void }
         */
        updateLivescores:
        (
          data: Map < number, FIREBASE_livescores_now >
        ): void =>
        {
          sessionStoreObj.livescore_now = data
          set
          (
            sessionStoreObj
          );
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and stores `live` target fixture scores data in session object.
         * @param { FIREBASE_livescores_now } data
         *  💠 **[required]** Target `fixture` data to store in session object.
         * @returns { void }
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and stores `live` target fixture scoreboard (V2) data in session object.
         * @param { Map < number, FIRE_LNNS > } data
         *  💠 **[required]** Target `fixture` data to store in session object.
         * @returns { void }
         */
        updateLivescoreScoreboard:
        (
          data: Map < number, FIRE_LNNS >
        ): void =>
        {
          sessionStoreObj.livescore_now_scoreboard = data
          set
          (
            sessionStoreObj
          );
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and stores `live` target fixture scoreboard (V2) data in session object.
         * @param { number } data
         *  💠 **[required]** Target Livescore Player Id.
         * @returns { void }
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update and stores `live` target fixture scoreboard (V2) data in session object;
         * @param { number[] } data
         *  💠 **[required]** Target Livescore Fixture Id's
         * @returns { void }
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update `Sportbook` **main** data.
         * @param { B_SPT_D } data
         *  💠 **[required]** Target Sportbook `data`
         * @returns { void }
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update `Sportbook` **list** data.
         * @param { B_SPT_D[] } data
         *  💠 **[required]** List Sportbook `data`
         * @returns { void }
         */
        updateSportbookList:
        (
          data: B_SPT_D[]
        ): void =>
        {
          // ╭─────
          // │ NOTE: WARNING: IMPORTANT CRITICAL
          // │ > Sort data (asc).
          // ╰─────
          data
            .sort
            (
              (
                a,
                b
              ) =>
              {
                return parseInt(a.position!) - parseInt(b.position!)
              }
            )
          ;

          sessionStoreObj.sportbook_list = data;

          set
          (
            sessionStoreObj
          );

          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Update user `preference` for filter of `transaction` history data.
         * @param { Date } _from
         *  💠 **[required]** Target `from` data (start).
         * @param { Date } _to
         *  💠 **[required]** Target `to` data (end).
         * @returns { void }
         */
        updateUserTxHistDateRange:
        (
          _from: Date,
          _to: Date
        ): void =>
        {
          sessionStoreObj.userTxHistFilterDateRange
          = {
              from: _from,
              to: _to
            }
          ;

          /*
            set(sessionStoreObj);
            update
            (
              s =>
              (
                {
                  ...s,
                  userTxHistFilterDateRange:
                  {
                    from: _from,
                    to: _to
                  }
                }
              )
            );
          */

          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Retrieve target `session` platform `language`.
         * @return { string }
         *  📤 Target _current_ platform language.
         */
        getServerLang:
        (
        ): string =>
        {
          return sessionStoreObj.serverLang!;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Update and store **latest competitions data** in user's session object.
         * @param { Map < number, B_H_COMP_DATA > } data
         *  💠 **[required]** Target new latest **competition data**.
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Update and store **amount of competitions available** in user's session object.
         * @param { number } amountTotal
         *  💠 **[required]** Target amount of **competition data**.
         * @param { number } amountOpen
         *  💠 **[required]** Target amount of **competition data**.
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
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Update and store **amount of firebase listeners active** in user's session object.
         * @param { Unsubscribe[] } listener
         *  💠 **[required]** Target list of firebase event listeners.
         * @returns { void }
         */
        updateFirebaseListener:
        (
          listener: Unsubscribe[]
        ): void =>
        {
          sessionStoreObj.firebaseListeners.push(...listener);
          set
          (
            sessionStoreObj
          );
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Update target `GraphQL` connection(s) list.
         * @param { () => void } wsConneection
         *  💠 **[required]** Target `webSocket` connection.
         * @return { void }
         */
        updateGraphQlSubscriptions:
        (
          wsConneection: () => void
        ): void =>
        {
          sessionStoreObj.grapqhQlWebSockets.push(wsConneection);
          set
          (
            sessionStoreObj
          );
          return;
        }
      }
  ;

  return {
    subscribe,
    set,
    update,
    ...methods
  };
}

// #endregion ➤ 🛠️ METHODS

export default createLocalStore();
