import type { GeoJsResponse } from '$lib/types/types.geojs';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import type { User } from 'firebase/auth';

/**
 * @description
 * TODO: DOC:
 */
export interface Voted_Fixture
{
	fixture_id?:       number;
	fixture_vote?:     string;
	fixture_vote_val?: string;
}

/**
 * @description
 * TODO: DOC:
 */
export type Auth_Type =
	| 'discord'
	| 'email'
	| 'wallet'
	| 'google'
	| 'github'
;

/**
 * @description
 * Interface for 'authenticated' users.
 */
export interface Betarena_User
{
  /**
   * @description
   */
	lang?: string;
	username?: string;
	registration_type?: Auth_Type[];
	register_date?: string;
	profile_photo?: string | undefined;
	web3_wallet_addr?: string | undefined; // [ℹ] Authenticated User [WEB3]
  main_balance?: number;
}

/**
 * @description
 * Interface for 'authenticated' users.
 */
export interface Scores_User
{
  /** Authenticated user firestore DB data object */
	firebase_user_data: User;
  /** Authenticated user critical data */
	scores_user_data: Betarena_User;
}

/**
 * @description
 * Interface for 'localstorage' data.
 */
export interface User_Setting
{
  /** User selected lang (overrides serverLang) */
	lang:               string;
  /** User selected theme */
	theme:              'Dark' | 'Light';
  /** User selected country bookmaker ISO2 */
	country_bookmaker:  string;
  /** GeoJs object response data */
	geoJs:              GeoJsResponse;
  /** Authenticated user data object */
	user:               Scores_User;
  /** Voted fixtures */
  voted_fixtures:     Voted_Fixture[];
}

/**
 * @description
 * Interface for Platform Session Data
 * 'a.k.a Ephermal' data.
 */
export interface Platform_Session
{
  /**
   * NOTE:IMPORTANT - used for inter-component events of selected season changed (reactivity)
   */
	selectedSeasonID: number;
  /**
   * NOTE: used for detecting and pre-loading the data for a TARGET page translation of the current one, programatically
   */
  lang_intent: string | undefined;
  /**
   * NOTE: instant page lang
   */
  serverLang: string | undefined;
  /**
   * session data | Livescore Now Selected Date (View).
   * IMPORTANT
   * Must be in ISO/UTC timezone;
  */
  livescoreNowSelectedDate: Date
  /**
   * session data on the LivescoreNow Show/Hide Fixture NUmber
   */
  fixturesTodayNum: number
  /**
   * session data on users current date
   * IMPORTANT
   * Must be in user adjusted (TZ) timezone;
  */
  userDate: Date,

  // -----
  // NOTE: UI;
  // -----

  /**
   * @description
   * Toggle livescore (widget) target view tabs.
   */
  livescoreFixtureView: 'all' | 'live';
  /**
   * @description
   * Show/Hide Livescore (widget) pop-up calendar.
   */
  livescoreShowCalendar: boolean;
  /**
   * @description
   * Show/Hide Fixture-Page target view tabs.
   */
	fixture_select_view: 'overview' | 'news';
  /**
   * @description
   * Show/Hide 'email' (footer) pop-up modal.
   */
	newsletterPopUpShow: boolean;
  /**
   * @description
   * Show/Hide 'authentication' pop-up modal.
   */
	auth_show: boolean;
  /**
   * @description
   * Follows 'user' intent for 'hover' language select action.
   */
  navBtnHover: string;

  // -----
  // NOTE: SPORTBOOK DATA;
  // -----

  /**
   * @description
   * Target Geo-Position Sportbook (MAIN) Data Object
   */
  sportbook_main: B_SPT_D;
  /**
   * @description
   * Target Geo-Position Sportbook (LIST) Data
   */
  sportbook_list: B_SPT_D[];

  // -----
  // NOTE: LIVESCORE WIDGET STORE DATA;
  // -----

  /**
   * @description
   * Store of 'LIVE' data of 'Firebase Livescore' (V1)
   * @deprecated
   * in favor of `livescore_now_scoreboard`
   */
  livescore_now: Map < number, FIREBASE_livescores_now >;
  /**
   * @description
   * Store of 'LIVE' data 'Firebase Livescore' (Scoreboard) (V2)
   */
  livescore_now_scoreboard: Map < number, FIRE_LNNS >;
  /**
   * @description
   * Store 'LIVE' data for Target (SINGLE) fixture 'scores'
   */
  livescore_now_fixture_target: FIREBASE_livescores_now;
  /**
   * @description
   * Store 'LIVE' data for Target (SINGLE) fixture 'odds'
   */
  live_odds_fixture_target: FIREBASE_odds[];
  /**
   * @description
   * Store 'LIVE' data on 'Firebase Odds' Target (MULTIPLE) fixtures
   */
  live_odds_fixture_map: Map < number, FIREBASE_odds[] >;
  /**
   * @description
   * Store 'LIVE' data for ALL players in a game
   */
  livescore_now_player_fixture: number | null;
  /**
   * @description
   * Store 'LIVE' data for ALL fixtures
   */
  livescore_now_fixtures: number[];

  // -----
  // NOTE: USER SESSION;
  // -----

  userTxShowCalendar: boolean;
  userTxHistDateSelect: Date;
  userTxHistFilterDateRange:
  {
    from?: Date,
    to?: Date
  };
}

/**
 * @description
 * TODO: DOC:
 */
export type PROFILE_OPT =
  | 'Dashboard'
  | 'Account Settings'
  | 'Deposit'
  | 'Withdraw'
  | 'Transaction History'
  | 'Competitions History'
  | 'Scores'
  | 'Author'
;