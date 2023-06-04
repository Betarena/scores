import type { GeoJsResponse } from '$lib/types/types.geojs';
import type { FIREBASE_livescores_now, FIRE_LNNS } from '@betarena/scores-lib/types/firebase.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
import type { User } from 'firebase/auth';

export type Auth_Type =
	'discord'
	| 'email'
	| 'wallet'
	| 'google'
	| 'github'
;

export interface Betarena_User 
{
	lang: string;
	username: string;
	registration_type: Auth_Type[];
	register_date: string;
	profile_photo: string | undefined;
	web3_wallet_addr: string | undefined; // [ℹ] Authenticated User [WEB3]
}

export interface Scores_User 
{
	firebase_user_data: User;
	scores_user_data: Betarena_User;
}

export interface User_Setting 
{
	lang: string;
	theme: string;
	country_bookmaker: string;
	geoJs: GeoJsResponse;
	user: Scores_User; // [ℹ] Authenticated User
}

export interface Platform_Session 
{
  /** used by email (footer) pop-up modal */
	newsletterPopUpShow: boolean;
  /** NOTE:IMPORTANT - used for inter-component events of selected season changed (reactivity)  */
	selectedSeasonID: number;
  /** NOTE:IMPORTANT - used for inter-component events of selected view on fixtures page */
	fixture_select_view: 'overview' | 'news';
  /** [ℹ] used to show/hide auth pop-up modal */
	auth_show: boolean;
  /** NOTE: used for detecting and pre-loading the data for a TARGET page translation of the current one, programatically */
  lang_intent: string | undefined;
  /** session data on the Firebase Livescore [V1] */
  livescore_now: Map<number, FIREBASE_livescores_now>
  /** session data on the Firebase Livescore (Scoreboard) [V2] */
  livescore_now_scoreboard: Map<number, FIRE_LNNS>
  /** session data on the Sportbook Data */
  sportbook_main: B_SPT_D
  /** session data on the Sportbook Data (List) */
  sportbook_list: B_SPT_D[]
  /** 
   * session data | Livescore Now Selected Date (View). 
   * IMPORTANT
   * Must be in ISO/UTC timezone;
  */
  livescoreNowSelectedDate: Date
  /** session data on the LivescoreNow View Type Date (View) */
  livescoreFixtureView: 'all' | 'live'
  /** session data on the LivescoreNow Show/Hide Calndar Component */
  livescoreShowCalendar: boolean
  /** session data on the LivescoreNow Show/Hide Fixture NUmber */
  fixturesTodayNum: number
  /** session data on users current date 
   * IMPORTANT
   * Must be in user adjusted (TZ) timezone;
  */
  userDate: Date
}