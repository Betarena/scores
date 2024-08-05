// #region ➤ 📦 Package Imports

import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import type { Unsubscribe } from 'firebase/firestore';

// #endregion ➤ 📦 Package Imports

type IPageRouteId =
  | null
  | 'Standard'
  | 'ProfilePage'
  | 'CompetitionPage'
  | 'AuthorsPage'
  | "NotificationsPage"
  ;

type IUserStoreState =
  | 'IsPWA'
  | 'Authenticated'
  | 'AuthenticatedAndInitialized'
  | 'NotAuthenticated'
  ;

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 TYPES
 * @description
 *  📣 Interface for Platform Session / State data `(a.k.a Strictly Ephermal)` data.
 */
export interface ISessionStore
{
  /**
   * @description
   * 📝 Target general `store` state for `user settings`.
   */
  globalState: Set<IUserStoreState>;
  /**
   * @description
   * 📝 Target `sveltekit/page` instance.
   */
  page: Page<Record<string, string>, string | null>;
  /**
   * @description
   * ➕ `inter-component` events of selected season.
   */
  selectedSeasonID: number | undefined;
  /**
   * @description
   * ➕ Instant **Scores Platform** page language identification.
   */
  serverLang: string | undefined;
  /**
   * @description
   *  📣 Detect and pre-loading data for **target** page, simulating an `intent`.
   */
  lang_intent: string | undefined;
  /**
   * @description
   *  📣 Session data of `Livescore v2` widget of `selected date` (View).
   * @IMPORTANT
   *  📌 Must be in `ISO/UTC` timezone;
   */
  livescoreNowSelectedDate: Date;
  /**
   * @description
   *  📣 Session data on the today's fixture number.
   */
  fixturesTodayNum: number;
  /**
   * @description
   *  📣 Number of **total competitions**.
   */
  competitionsNum: number;
  /**
   * @description
   *  📣 Number of **open competitions**.
   */
  competitionsOpenNum: number;
  /**
   * @description
   *  📣 data on users current date.
   * @IMPORTANT
   *  📌 `date` must be adjusted to user (TZ) timezone;
   */
  userDate: Date;
  /**
   * @description
   *  📣 Active `firestore` event listeners.
   */
  firebaseListeners: Unsubscribe[] = [];
  /**
   * @description
   *  📣 Active `graphql` event listeners.
   */
  grapqhQlWebSockets: (() => void)[] = [];
  /**
   * @description
   *  📣 Device type obtained from `user-agent`.
   */
  deviceType: 'mobile' | 'tablet' | 'desktop';
  /**
   * @description
   *  📣 Wether user is currently `active` on the platform.
   */
  isUserActive: boolean;
  /**
   * @description
   *  📣 Current window `width`.
   */
  windowWidth: number;
  /**
   * @description
   *  📣 Current `platform` **route id**.
   */
  currentPageRouteId: IPageRouteId;

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: UI                   ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📣 Toggle livescore (widget) target available `view` tabs.
   */
  livescoreFixtureView: 'all' | 'live';
  /**
   * @description
   *  📣 Toggle `visibility` (show/hide) of Livescore (widget) pop-up calendar.
   */
  livescoreShowCalendar: boolean;
  /**
   * @description
   *  📣 Toggle `visibility` (show/hide) of Fixture (page) target `view` tabs.
   */
  fixture_select_view: 'overview' | 'news';
  /**
   * @description
   *  📣 Follow 'user' intent for `hover` language select action (intent).
   */
  navBtnHover: string | undefined;
  /**
   * @description
   *  📣 Toggle `visibility` (show/hide) of Userguide-1 (widget) pop-up modal.
   */
  showUserguide1: boolean;
  /**
   * @description
   *  📣 Toggle `visibility` (show/hide) of Userguide-1 (widget) access.
   */
  showUserguide1Conf: boolean;
  /**
   * @description
   *  📣 toogle `visibility` (show/hide) of Terms-And-Conditions modal.
   */
  showTermsAndConditions: boolean;
  /**
   * @description
   *  📣 Toggle `visibility` (show/hide) of Fixture Competition (widget) access.
   */
  showFixtureCompetition?: boolean;

  /**
   * @description
   *  📣 Currently **active** `modal` being shown on platform. Only **one at a time**.
   */
  currentActiveModal:
  | null
  | 'ProfileInvestor_ReferralInfo_Modal'
  | 'ProfileInvestor_Wallets_Modal'
  | 'ProfileInvestor_Terms&Cond_Modal'
  | 'ProfileInvestor_WalletConnect_Modal'
  | 'ProfileInvestor_ClaimTGE_Modal'
  | 'ProfileInvestor_ClaimVesting_Modal'
  | 'ProfileInvestor_TxState_Modal'
  | 'ProfileInvestor_SelectCrypto_Modal'
  | 'ProfileWithdraw_Modal'
  | 'GeneralPlatform_Error'
  | 'Footer_Newsletter_Modal'
  | 'Auth_Modal'
  | 'CompetitionFixtureJoin_Modal'
  ;
  /**
   * @description
   *  📣 Currently **active** `toast` being shown on platform. Only **one at a time**.
   */
  currentActiveToast:
  | null
  | 'Auth_Success_L_Toast'
  | 'Auth_Success_R_Toast'
  | 'Auth_Error_Toast'
  ;

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: SPORTBOOK DATA       ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📌 Target `geo-position` sportbook (single-main) data object.
   */
  sportbook_main: B_SPT_D | undefined;
  /**
   * @description
   *  📌 Target `geo-position` sportbook (list) data.
   */
  sportbook_list: B_SPT_D[] | undefined;

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: LIVESCORE WIDGET STORE DATA;
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📌 Store of `live` data of 'Firebase Livescore' (V1)
   * @deprecated
   * in favor of `livescore_now_scoreboard`
   */
  livescore_now: Map<number, FIREBASE_livescores_now> | undefined;
  /**
   * @description
   *  📌 Store of `live` data 'Firebase Livescore' (Scoreboard) (V2)
   */
  livescore_now_scoreboard: Map<number, FIRE_LNNS>;
  /**
   * @description
   *  📌 Store `live` data for target (SINGLE) fixture 'scores'.
   */
  livescore_now_fixture_target: FIREBASE_livescores_now | undefined;
  /**
   * @description
   *  📌 Store `live` data for target (SINGLE) fixture 'odds'
   */
  live_odds_fixture_target: FIREBASE_odds[] | null;
  /**
   * @description
   *  📌 Store `live` data on 'Firebase Odds' target (MULTIPLE) fixtures
   */
  live_odds_fixture_map: Map<number, FIREBASE_odds[]>;
  /**
   * @description
   *  📌 Store `live` data for **all** players in a game.
   */
  livescore_now_player_fixture: number | null | undefined;
  /**
   * @description
   *  📌 Store `live` data for **all** fixtures.
   */
  livescore_now_fixtures: number[];
  /**
   * @description
   *  📌 Store data for new 'real-time' (a.k.a) latest competitions data.
   */
  competitions_map: Map<number, B_H_COMP_DATA>;

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: USER SESSION;
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Transaction History (sub) Calendar (widget).
   */
  userTxShowCalendar: boolean;
  /**
   * @description
   *  📌 Selected by **user** date.
   */
  userTxHistDateSelect: Date;
  /**
   * @description
   *  📌 Selected by **user** date filter range.
   */
  userTxHistFilterDateRange:
  {
    from?: Date,
    to?: Date
  };
  /**
   * @description
   *  📌 Amount `deeplink` to `web3` selected by **user** for mobile.
   */
  investDepositAmountMobileWeb3: number | undefined;

  // ╭────────────────────────────────────────────────────────────────────────╮
  // | 🛠️ DEVELOPMENT                                                         |
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   *  📣 Current name for target **admin** widget under inspection.
   */
  currentAdminToggle: string | null;

  /**
   * @description
   *  📣 Defines the type of device being used for viewing.
   * Can take the values 'mobile', 'tablet', 'desktop', or null if the device type is not determined.
   */
  viewportType: "mobile" | "tablet" | "desktop" |  null;
}