// import { dev } from '$app/environment';

export const PAGE_INVALID_MSG = `Uh-oh! This page does not exist!`;
export const ERROR_CODE_INVALID = 404;
export const ERROR_CODE_PRELOAD = 500;
export const LAYOUT_1_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/layout)`;
export const HOME_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/lang)`;
export const FIXTURE_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/fixture)`;

const MASTER_DEBUG_TOGGLE = true // NOTE: overrides all individual toggles for show/hide logs
const DEV_OVERRIDE = true // true/false || dev // overrides "dev" state and forces logs even in PROD where dev == false;

export const NAVBAR_DEBUG_TAG = 'navbar [DEBUG] |'
export const NAVBAR_DEBUG_STYLE = 'background: purple; color: #FFFFFF'
export const FOOTER_DEBUG_TAG = 'footer [DEBUG] |'
export const FOOTER_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const FOOTER_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const AUTH_DEBUG_TAG = 'auth [DEBUG] |'
export const AUTH_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const AUTH_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const ABOUT_FW_DEBUG_TAG = 'fixtures (about) [DEBUG] |'
export const ABOUT_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const ABOUT_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const CONTENT_FW_DEBUG_TAG = 'fixtures (content) [DEBUG] |'
export const CONTENT_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const CONTENT_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const H2H_FW_DEBUG_TAG = 'fixtures (h2h) [DEBUG] |'
export const H2H_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const H2H_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const INCIDENT_FW_DEBUG_TAG = 'fixtures (incident) [DEBUG] |'
export const INCIDENT_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const INCIDENT_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const LINEUPS_FW_DEBUG_TAG = 'fixtures (lineups) [DEBUG] |'
export const LINEUPS_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const LINEUPS_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const PROB_FW_DEBUG_TAG = 'fixtures (prob.) [DEBUG] |'
export const PROB_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const PROB_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const SCOREBOARD_FW_DEBUG_TAG = 'fixtures (scoreboard) [DEBUG] |'
export const SCOREBOARD_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const SCOREBOARD_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const STANDINGS_FW_DEBUG_TAG = 'fixtures (standings) [DEBUG] |'
export const STANDINGS_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const STANDINGS_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const STATS_FW_DEBUG_TAG = 'fixtures (stats) [DEBUG] |'
export const STATS_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const STATS_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const VOTES_FW_DEBUG_TAG = 'fixtures (vote) [DEBUG] |'
export const VOTES_FW_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const VOTES_FW_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const BEST_GOAL_H_DEBUG_TAG = 'home (best-goal) [DEBUG] |'
export const BEST_GOAL_H_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const BEST_GOAL_H_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const FEAT_BET_H_DEBUG_TAG = 'home (feat-bet) [DEBUG] |'
export const FEAT_BET_H_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const FEAT_BET_H_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const FEAT_MATCH_H_DEBUG_TAG = 'home (feat-match) [DEBUG] |'
export const FEAT_MATCH_H_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const FEAT_MATCH_H_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const LEAGUE_LIST_H_DEBUG_TAG = 'home (league-list) [DEBUG] |'
export const LEAGUE_LIST_H_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const LEAGUE_LIST_H_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const LEAGUES_H_DEBUG_TAG = 'home (leagues) [DEBUG] |'
export const LEAGUES_H_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const LEAGUES_H_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const SEO_BLOCK_DEBUG_TAG = 'home (seo-block) [DEBUG] |'
export const SEO_BLOCK_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const SEO_BLOCK_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const ABOUT_T_DEBUG_TAG = 'tournament (about) [DEBUG] |'
export const ABOUT_T_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const ABOUT_T_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const FIXTURE_T_DEBUG_TAG = 'tournament (fixture) [DEBUG] |'
export const FIXTURE_T_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const FIXTURE_T_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const LEAGUE_INFO_T_DEBUG_TAG = 'tournament (league-info) [DEBUG] |'
export const LEAGUE_INFO_T_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const LEAGUE_INFO_T_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const LEAGUE_INFO_2_T_DEBUG_TAG = 'tournament (league-info-2) [DEBUG] |'
export const LEAGUE_INFO_2_T_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const LEAGUE_INFO_2_T_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const STANDINGS_T_DEBUG_TAG = 'tournament (standings) [DEBUG] |'
export const STANDINGS_T_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const STANDINGS_T_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const TOP_PLAY_T_DEBUG_TAG = 'tournament (top-players) [DEBUG] |'
export const TOP_PLAY_T_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const TOP_PLAY_T_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const FIREBASE_DEBUG_TAG = 'firebase [DEBUG] |'
export const FIREBASE_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const FIREBASE_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const F_DEBUG_TAG = 'firebase [DEBUG] |'
export const F_DEBUG_TOGGLE = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : true
export const F_DEBUG_STYLE = 'background: blue; color: #FFFFFF'

/**
 * @param groupName
 * @param msg
 */
export function logErrorGroup(
	groupName: string,
	msg: string
) {
	console.groupCollapsed(groupName);
	msg = msg.replace(/\t/g, '');
	console.error(`${msg}`);
	console.groupEnd();
}

/**
 * @param groupName
 * @param msgs
 */
export function log_info_group(
	groupName: string,
	msgs: string[]
) {
	console.groupCollapsed(
		`%c${groupName}`,
		'background: blue; color: #fffff'
	);
	for (const m of msgs) {
		const msg = m.replace(/\t/g, '');
		console.log(`${msg}`);
	}
	console.groupEnd();
}

/**
 * @description Advanced single string / object 
 * debug logging function for displaying target 
 * information based on supplied arguments, 
 * and styling.
 * @param {string | object} msg 
 * @param {boolean} show 
 * @param {string} style
 */
export function dlog(
	msg: string | object,
	show?: boolean,
	style?: string
) {
	// [🐞]
	if (DEV_OVERRIDE && show && !style) console.debug(msg);
	if (DEV_OVERRIDE && typeof(msg) == 'string' && show && style) console.debug(`%c${msg}`, style);
}

/**
 * @description Advanced multi- string / object 
 * debug logging function for displaying target 
 * information based on supplied arguments, 
 * and styling.
 * @param {string} groupName
 * @param {unknown[]} msg 
 * @param {boolean} show 
 * @param {string} style
 */
export function dlogv2(
	groupName: string,
	msgs: unknown[],
	show?: boolean,
	style?: string
) {
	// [🐞]
	if (DEV_OVERRIDE && show) {
		console.groupCollapsed(
			`%c${groupName}`,
			style
		);
		for (const m of msgs) {
			const msg =
				typeof m == 'string'
					? m.replace(/\t/g, '')
					: m;
			console.debug(msg);
		}
		console.groupEnd();
	}
}

/**
 * @description Main error console log for
 * the platform to easily identify errors;
 * @param {string} msg
 */
export function errlog(
  msg: string
) {
	// [🐞]
	if (DEV_OVERRIDE) console.error(`❌ Error: ${msg}`);
}
