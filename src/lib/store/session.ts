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

import { routeIdAuthorProfile, routeIdAuthorSubscribers, routeIdContent, routeIdPageAuthors, routeIdPageCompetitions, routeIdPageProfile, routeIdPageProfileAuthorCreate, routeIdPageProfilePublication, routeIdPageTags, routeIdSearch, routeIdSportstack } from '$lib/constants/paths.js';
import { dlogv2, log_v3 } from '$lib/utils/debug.js';
import { viewportChangeV2 } from '$lib/utils/device.js';

import type { IPageRouteId, ISessionStore } from '$lib/types/types.session.js';
import { parseObject } from '$lib/utils/string.2.js';
import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const mobileBreakpoint = 575,
  tabletBreakpoint = 1160,


  /**
   *
   */
  sessionStoreObj: ISessionStore
    = {
      globalState: new Set(),
      page: null,
      // @ts-expect-error
      window: {},
      deviceType: 'mobile',
      viewportType: null,
      userAgent: undefined,
      isUserActive: true,
      windowWidth: 0,
      firebaseListeners: [],
      grapqhQlWebSockets: [],
      listIntervals: [],
      currentActiveModal: null,
      currentActiveToast: null,
      currentAdminToggle: null,
      currentPageRouteId: 'Standard',
      btaUsdRate: 0,

      // ### NOTE:
      // ### variables for show/hide.
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

/**
 *
 */
type IDataProp =
  | 'lang'
  | 'routeId'
  | 'currentModal'
  | 'currentToast'
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
  | 'globalStateAdd'
  | 'globalStateRemove'
  | 'windowWidth'
  | 'userAgent'
  | "btaRate"
  | 'window'
  | 'listIntervals'
;

/**
 *
 */
type IDataGetProp =
  Extract < IDataProp,
    'lang' |
    'routeId' |
    'userAgent'
  >
  | 'globalState'
  | 'page'
  | 'userAgent'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @author
 * @summary
 * @description
 * @returns
 */
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
         *  📣 Update **target** `list` data of target `properties` to update.
         * @param { [IDataProp, any][] } data
         *  💠 **[required]** Target data to update.
         * @return { void }
         */
        updateData:
        (
          data: [IDataProp, any][]
        ): void =>
        {
          // [🐞]
          log_v3
          (
            {
              strGroupName: '🚏 checkpoint ➤ Store | SessionStorage ➤ updateData(..) // START',
              msgs: [
                `🔹 [var] ➤ data :|: ${parseObject(data)}`,
              ],
              closed: true
            }
          );

          // ╭─────
          // │ NOTE:
          // │ │: loop through data.
          // │ │: update sessionStoreObj.
          // ╰─────
          for (const iterator of data)
          {
            const
              dataTarget = iterator[0],
              dataPoint = iterator[1]
            ;

            if (dataTarget == 'lang')
            {
              sessionStoreObj.serverLang = dataPoint;
            }
            else if (dataTarget == 'routeId')
            {
              let
                customRouteId: IPageRouteId = 'Standard'
              ;

              if (dataPoint == routeIdPageCompetitions)
                customRouteId = 'CompetitionPage';
              else if ([routeIdPageProfile, routeIdPageProfileAuthorCreate, routeIdPageProfilePublication].includes(dataPoint))
                customRouteId = 'ProfilePage';
              else if ([
                routeIdPageAuthors,
                routeIdPageTags,
                routeIdContent,
                routeIdAuthorProfile,
                routeIdSportstack,
                routeIdAuthorSubscribers,
                routeIdSearch
              ].includes(dataPoint))
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
            else if (dataTarget == 'currentModal')
            {
              sessionStoreObj.currentActiveModal = dataPoint;
            }
            else if (dataTarget == 'currentToast')
            {
              sessionStoreObj.currentActiveToast = dataPoint;
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
            else if (dataTarget == 'globalStateAdd')
            {
              // ╭─────
              // │ NOTE:
              // │ > Authentication Logic Toggle Reset
              // ╰─────
              if (dataPoint == 'NotAuthenticated')
              {
                sessionStoreObj.globalState.delete('Authenticated');
                sessionStoreObj.globalState.delete('AuthenticatedAndInitialized');
              }
              else if (dataPoint == 'Authenticated')
              {
                sessionStoreObj.globalState.delete('NotAuthenticated');
              }

              sessionStoreObj.globalState.add(dataPoint);
            }
            else if (dataTarget == 'globalStateRemove')
            {
              sessionStoreObj.globalState.delete(dataPoint);
            }
            else if (dataTarget == 'windowWidth')
            {
              sessionStoreObj.windowWidth = dataPoint;
              const [isMobile, isTablet] = viewportChangeV2(dataPoint, mobileBreakpoint, tabletBreakpoint);
              sessionStoreObj.viewportType = dataPoint && isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
            }
            else if (dataTarget === "btaRate")
            {
              sessionStoreObj.btaUsdRate = dataPoint;
            }
            else if (dataTarget == 'window')
            {
              sessionStoreObj.window = dataPoint;
            }
            else if (dataTarget == 'listIntervals')
            {
              sessionStoreObj.listIntervals.push(dataPoint);
            }
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
         * @param { IDataGetProp } dataPoint
         *  💠 **[required]** Target `data point` to be retrieved.
         * @return { Typ1 }
         *  📤 Requested `data point`.
         */
        extract:
        < Typ1 >
        (
          dataPoint: IDataGetProp
        ): Typ1 | NullUndef =>
        {
          if (dataPoint == 'lang')
            return sessionStoreObj.serverLang as Typ1 | NullUndef;
          else if (dataPoint == 'routeId')
            return sessionStoreObj.currentPageRouteId as Typ1 | NullUndef;
          else if (dataPoint == 'globalState')
            return sessionStoreObj.globalState as Typ1 | NullUndef;
          else if (dataPoint == 'page')
            return sessionStoreObj.page as Typ1 | NullUndef;
          else if (dataPoint == 'userAgent')
            return sessionStoreObj.userAgent as Typ1 | NullUndef;
          ;
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - ♦️ IMPORTANT
         *  - 🔹 HELPER
         * @description
         *  📝 Extracts all data.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ extractAll();
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Retrieves all data.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : ISessionStore | NullUndef
         *  [X]──────────────────────────────────────────────────────────────────
         * @returns { ISessionStore | NullUndef }
         *  📤 All data.
         */
        extractAll:
        (
        ): ISessionStore =>
        {
          return sessionStoreObj;
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
