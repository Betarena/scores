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

import { routeIdPageAuthors, routeIdPageCompetitions, routeIdPageProfile } from '$lib/constants/paths.js';
import type { IPageRouteId, ISessionStore } from '$lib/types/types.scores.js';
import { dlogv2 } from '$lib/utils/debug.js';
import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';

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
    currentPageRouteId: null,

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

type IDataProp =
  | 'lang'
  | 'routeId'
  | 'firebaseListeners'
  | 'competitionAllNum'
  | 'sportbookMain'
  | 'sportbookList'
  | 'livescorePlayerId'
  | 'livescoreScoreboard'
  | 'competitionLatestMap'
  | 'graphqlListeners'
  | 'liveOdds'
  | 'liveOddsMap'
  | 'livescoresNow'
  | 'livescoresFixtureTarget'
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

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 📣 Main Logic                                                                    │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Update **target** single data property.
         * @param { IDataProp } dataTarget
         *  💠 **[required]** Target data to update.
         * @param { any } dataPoint
         *  💠 **[required]** Target data value to update.
         * @return { void }
         */
        updateData:
        (
          dataTarget: IDataProp,
          dataPoint?: any,
        ): void =>
        {
          if (dataTarget == 'lang')
          {
            sessionStoreObj.serverLang = dataPoint;
          }
          else if (dataTarget == 'routeId')
          {
            let
              customRouteId: IPageRouteId = dataPoint
            ;

            if (dataPoint == routeIdPageCompetitions)
              customRouteId = 'CompetitionPage';
            else if (dataPoint == routeIdPageProfile)
              customRouteId = 'ProfilePage';
            else if (dataPoint == routeIdPageAuthors)
              customRouteId = 'AuthorsPage';
            ;

            // [🐞]
            dlogv2
            (
              '🚏 checkpoint ➤ updateRouteId(..)',
              [
                `🔹 [var] ➤ customRouteId :|: ${customRouteId}`,
              ],
              true
            );

            sessionStoreObj.currentPageRouteId = customRouteId;
          }
          else if (dataTarget == 'firebaseListeners')
          {
            sessionStoreObj.firebaseListeners.push(...dataPoint);
          }
          else if (dataTarget == 'competitionAllNum')
          {
            sessionStoreObj.competitionsNum = dataPoint[0];
            sessionStoreObj.competitionsOpenNum = dataPoint[1];
          }
          else if (dataTarget == 'sportbookMain')
          {
            sessionStoreObj.sportbook_main = dataPoint;
          }
          else if (dataTarget == 'sportbookList')
          {
            // ╭─────
            // │ NOTE: WARNING: IMPORTANT CRITICAL
            // │ > Sort data (asc).
            // ╰─────
            dataPoint
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

            sessionStoreObj.sportbook_list = dataPoint;
          }
          else if (dataTarget == 'livescorePlayerId')
          {
            sessionStoreObj.livescore_now_player_fixture = dataPoint;
          }
          else if (dataTarget == 'livescoreScoreboard')
          {
            sessionStoreObj.livescore_now_scoreboard = dataPoint as Map < number, FIRE_LNNS >;
          }
          else if (dataTarget == 'competitionLatestMap')
          {
            sessionStoreObj.competitions_map = dataPoint as Map < number, B_H_COMP_DATA >;
          }
          else if (dataTarget == 'graphqlListeners')
          {
            sessionStoreObj.grapqhQlWebSockets.push(dataPoint as () => void);
          }
          else if (dataTarget == 'liveOdds')
          {
            sessionStoreObj.live_odds_fixture_target = dataPoint as FIREBASE_odds[];
          }
          else if (dataTarget == 'liveOddsMap')
          {
            sessionStoreObj.live_odds_fixture_map.set
            (
              dataPoint[0],
              dataPoint[1]
            );
          }
          else if (dataTarget == 'livescoresNow')
          {
            sessionStoreObj.livescore_now = dataPoint as Map < number, FIREBASE_livescores_now >;
          }
          else if (dataTarget == 'livescoresFixtureTarget')
          {
            sessionStoreObj.livescore_now_fixture_target = dataPoint as FIREBASE_livescores_now;
          }

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
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Extracts **target** `user` data property.
         * @param { IDataProp } dataPoint
         *  💠 **[required]** Target `data point` to be retrieved.
         * @return { any }
         *  📤 Requested `data point`.
         */
        extract:
        (
          dataPoint: IDataProp
        ): any =>
        {
          if (dataPoint == 'lang')
            return sessionStoreObj.serverLang;
          else if (dataPoint == 'routeId')
            return sessionStoreObj.currentPageRouteId;
          ;

          return;
        },
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
