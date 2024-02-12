// #region ➤ 📦 Package Imports

import type { GeoJsResponse } from '$lib/types/types.geojs';
import type { IBetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import type { User } from 'firebase/auth';
import type { Unsubscribe } from 'firebase/firestore';

// #endregion ➤ 📦 Package Imports

/**
 * @description
 * TODO: DOC:
 */
export interface Voted_Fixture
{
	fixture_id?: number;
	fixture_vote?: string;
	fixture_vote_val?: string;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 TYPES
 * @description
 *  📌 Interface for 'authenticated' users.
 */
export interface BetarenaUser
extends
IBetarenaUser,
Pick < IUserSetting, 'userguide_id_opt_out' >
{
  // NaN
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 TYPES
 * @description
 *  📣 Interface for 'authenticated' users.
 */
export interface IScoreUser
{
  /** @description 📣 **User** authenticated user `Firebase | Firestore` DB data object */
	firebase_user_data?: User;
  /** @description 📣 **User** authenticated user critical data */
	scores_user_data?: BetarenaUser;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 TYPES
 * @description
 *  📣 Interface for 'localstorage' data.
 */
export interface IUserSetting
{
  /** @description **Client/User** selected lang (overrides serverLang) */
	lang: string;
  /** @description **Client/User** selected theme */
	theme: 'Dark' | 'Light';
  /** @description **Client/User** selected country bookmaker ISO2 */
	country_bookmaker: string;
  /** @description **Client/User** geoJs object response data */
	geoJs: GeoJsResponse;
  /** @description **User** authenticated data object */
	user: IScoreUser;
  /** @description **Client/User** voted fixtures */
  voted_fixtures: Voted_Fixture[];
  /** @description **Client/User** userguides opt-out */
  userguide_id_opt_out: number[];
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 TYPES
 * @description
 *  📌 Interface for Platform Session / State data
 * `a.k.a Strictly Ephermal` data.
 */
export interface Platform_Session
{
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: MISC                 ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📌 `session/state` variable used for
   *  `inter-component` events of selected season.
   */
	selectedSeasonID: number;
  /**
   * @description
   *  📌 `session/state` variable used for
   *  detecting and pre-loading data for **target** page,
   *  simulating an `intent`.
   */
  lang_intent: string | undefined;
  /**
   * @description
   *  📌 `session/state` variable used for
   *  instant **Scores Platform** page language identification.
   */
  serverLang: string | undefined;
  /**
   * @description
   *  📌 `session/state` variable used for
   *  session data of `Livescore v2` widget of `selected date` (View).
   *
   * IMPORTANT
   * Must be in `ISO/UTC` timezone;
  */
  livescoreNowSelectedDate: Date;
  /**
   * @description
   *  📌 `session/state` variable used for
   *  session data on the today's fixture number.
   */
  fixturesTodayNum: number;
  /**
   * @description
   *  📌 `session/state` variable used for the
   *  number of **total competitions**.
   */
  competitionsNum: number;
  /**
   * @description
   *  📌 `session/state` variable used for the
   *  number of **open competitions**.
   */
  competitionsOpenNum: number;
  /**
   * @description
   *  📌 `session/state` variable used for the
   *  device type obtained from `user-agent`.
   */
  deviceType: 'mobile' | 'tablet' | 'desktop';
  /**
   * @description
   *  📌 `session/state` variable used for the
   *  data on users current date.
   *
   * IMPORTANT
   * `date` must be adjusted to user (TZ) timezone;
  */
  userDate: Date;
  /**
   * @description
   *  📌 `session/state` variable used for the
   *  keeping a record of active listeners on the frontend.
   */
  firebaseListeners: Unsubscribe[] = [];
  /**
   * @description
   *  📌 `session/state` variable used for the
   *  keeping a record of active listeners on the frontend.
   */
  grapqhQlWebSockets: (() => void)[] = [];

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: UI                   ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📌 Toggle livescore (widget) target available `view` tabs.
   */
  livescoreFixtureView: 'all' | 'live';
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Livescore (widget) pop-up calendar.
   */
  livescoreShowCalendar: boolean;
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Fixture (page) target `view` tabs.
   */
	fixture_select_view: 'overview' | 'news';
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Email (widget) pop-up modal.
   */
	newsletterPopUpShow: boolean;
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Authentication (widget) pop-up modal.
   */
	auth_show: boolean;
  /**
   * @description
   *  📌 Follow 'user' intent for `hover` language select action (intent).
   */
  navBtnHover: string;
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Withdraw (widget) pop-up modal.
   */
  withdrawModal: boolean;
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Userguide-1 (widget) pop-up modal.
   */
  showUserguide1: boolean;
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Userguide-1 (widget) access.
   */
  showUserguide1Conf: boolean;
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Fixture Competition (widget) access.
   */
  showFixtureCompetition?: boolean;
  /**
   * @description
   *  📌 Toggle `visibility` (show/hide) of Fixture Competition (widget) Modal View.
   */
  isShowFixtureCompetitionJoinModal?: boolean;
  /**
   * @description
   *  📣 Currently **active** modal being shown on platform.
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
    | 'GeneralPlatform_Error'
  ;

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: SPORTBOOK DATA       ◼️
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📌 Target `geo-position` sportbook (single-main) data object.
   */
  sportbook_main: B_SPT_D;
  /**
   * @description
   *  📌 Target `geo-position` sportbook (list) data.
   */
  sportbook_list: B_SPT_D[];

  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // NOTE: LIVESCORE WIDGET STORE DATA;
  // ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   *  📌 Store of `live` data of 'Firebase Livescore' (V1)
   * @deprecated
   * in favor of `livescore_now_scoreboard`
   */
  livescore_now: Map < number, FIREBASE_livescores_now >;
  /**
   * @description
   *  📌 Store of `live` data 'Firebase Livescore' (Scoreboard) (V2)
   */
  livescore_now_scoreboard: Map < number, FIRE_LNNS >;
  /**
   * @description
   *  📌 Store `live` data for target (SINGLE) fixture 'scores'.
   */
  livescore_now_fixture_target: FIREBASE_livescores_now;
  /**
   * @description
   *  📌 Store `live` data for target (SINGLE) fixture 'odds'
   */
  live_odds_fixture_target: FIREBASE_odds[];
  /**
   * @description
   *  📌 Store `live` data on 'Firebase Odds' target (MULTIPLE) fixtures
   */
  live_odds_fixture_map: Map < number, FIREBASE_odds[] >;
  /**
   * @description
   *  📌 Store `live` data for **all** players in a game.
   */
  livescore_now_player_fixture: number | null;
  /**
   * @description
   *  📌 Store `live` data for **all** fixtures.
   */
  livescore_now_fixtures: number[];
  /**
   * @description
   *  📌 Store data for new 'real-time' (a.k.a) latest competitions data.
   */
  competitions_map: Map < number, B_H_COMP_DATA >;

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
  investDepositAmountMobileWeb3: number;

  // ╭────────────────────────────────────────────────────────────────────────╮
  // | 🛠️ DEVELOPMENT                                                         |
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   *  📣 Current name for target **admin** widget under inspection.
   */
  currentAdminToggle: string | null;
}

/**
 * @description
 * TODO: DOC:
 */
export type PROFILE_OPT =
  | 'Dashboard'
  | 'Account Settings'
  | 'Investor'
  | 'Deposit'
  | 'Withdraw'
  | 'Transaction History'
  | 'Competitions History'
  | 'Scores'
  | 'Author'
;
