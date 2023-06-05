import type { GeoJsResponse } from '$lib/types/types.geojs';
import type { FIREBASE_livescores_now, FIREBASE_odds, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import type { User } from 'firebase/auth';

export interface Voted_Fixture 
{
	fixture_id:       number;
	fixture_vote:     string;
	fixture_vote_val: string;
}

export type Auth_Type =
	'discord'
	| 'email'
	| 'wallet'
	| 'google'
	| 'github'
;

// Used with authenticated users;
export interface Betarena_User 
{
	lang: string;
	username: string;
	registration_type: Auth_Type[];
	register_date: string;
	profile_photo: string | undefined;
	web3_wallet_addr: string | undefined; // [ℹ] Authenticated User [WEB3]
}

// Used with authenticated users;
export interface Scores_User 
{
  /** Authenticated user firestore DB data object */
	firebase_user_data: User;
  /** Authenticated user critical data */
	scores_user_data: Betarena_User;
}

// Used with localStorage data;
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

// Used with session data;
export interface Platform_Session 
{
  /** NOTE:IMPORTANT - used for inter-component events of selected season changed (reactivity)  */
	selectedSeasonID: number;
  /** NOTE: used for detecting and pre-loading the data for a TARGET page translation of the current one, programatically */
  lang_intent: string | undefined;
  /** NOTE: instant page lang */
  serverLang: string | undefined;
  /** 
   * session data | Livescore Now Selected Date (View). 
   * IMPORTANT
   * Must be in ISO/UTC timezone;
  */
  livescoreNowSelectedDate: Date
  /** session data on the LivescoreNow Show/Hide Fixture NUmber */
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

  /** toggle livescore (widget) view */
  livescoreFixtureView: 'all' | 'live'
  /** show/hide livescore (widget) pop-up calendar */
  livescoreShowCalendar: boolean
  /** NOTE:IMPORTANT - fixture page show/hide tabs */
	fixture_select_view: 'overview' | 'news';
  /** show/hide email (footer) pop-up modal */
	newsletterPopUpShow: boolean;
  /** show/hide authentication pop-up modal */
	auth_show: boolean;

  // -----
  // NOTE: SPORTBOOK DATA;
  // -----

  /** session data on the Sportbook Data */
  sportbook_main: B_SPT_D
  /** session data on the Sportbook Data (List) */
  sportbook_list: B_SPT_D[]

  // -----
  // NOTE: LIVESCORE DATA;
  // -----

  /** session data on the Firebase Livescore [V1] */
  livescore_now: Map<number, FIREBASE_livescores_now>
  /** session data on the Firebase Livescore (Scoreboard) [V2] */
  livescore_now_scoreboard: Map<number, FIRE_LNNS>
  /** holds "LIVE" data for a target fixture scores */
  livescore_now_fixture_target: FIREBASE_livescores_now;
  /** holds "LIVE" data for a target fixture odds */
  live_odds_fixture_target: FIREBASE_odds[];
}