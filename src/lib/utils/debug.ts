import { dev } from '$app/environment';

// NOTE: page error messages & error codes
export const PAGE_INVALID_MSG = `Uh-oh! This page does not exist!`;
export const ERROR_CODE_INVALID = 404;
export const ERROR_CODE_PRELOAD = 500;
export const LAYOUT_1_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/layout)`;
export const HOME_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/lang)`;
export const FIXTURE_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/fixture)`;

// NOTE: overrides all individual toggles for show/hide logs
// NOTE: (values) true/false | undefined
const MASTER_DEBUG_TOGGLE = undefined

// NOTE: overrides "dev" state and forces logs even in PROD where dev == false;
// NOTE: (values) true/false | dev
// NOTE:IMPORTANT for PROD should always be FALSE on PR -> (main)
// NOTE:IMPORTANT using custom ENV for this
const LOGS_SHOW_OVERRIDE = import.meta.env?.VITE_PROD_LOGS || dev

// NOTE: naming of new DEBUG variables is of following structure:
// NOTE: [2]_W{+T}/P/_TAG/TOG/STY
// NOTE: where:
// NOTE: => [2] = any 2 shortcode char for target VAR
// NOTE: => W/P = (widget + page-type) or (page)
// NOTE: => TAG/TOG/STY = (tag) - (toggle) - (style)
// NOTE: => for example: BG_W_H_TAG => BestGoalscore (Widget) (Homepage) (Tag)

type DEBUG = [string, boolean, string]

// [ℹ] MAIN-(page)-(widgets) (debug)
export const NB_W_TAG = 'navbar [DEBUG] |'
export const NB_W_TOG = true
export const NB_W_STY = 'background: purple; color: #FFFFFF'
export const FT_W_TAG = 'footer [DEBUG] |'
export const FT_W_TOG = true
export const FT_W_STY = 'background: blue; color: #FFFFFF'
export const AU_W_TAG = 'auth [DEBUG] |'
export const AU_W_TOG = true
export const AU_W_STY = 'background: blue; color: #FFFFFF'
// [ℹ] HOMEPAGE-(page)-(widgets) (debug)
export const BG_W_H_TAG = 'BG [P/T][D] |'
export const BG_W_H_TOG = true
export const BG_W_H_STY = 'background: blue; color: #FFFFFF'
export const FB_W_H_TAG = 'FB [P/T][D] |'
export const FB_W_H_TOG = true
export const FB_W_H_STY = 'background: blue; color: #FFFFFF'
export const FM_W_H_TAG = 'FM [P/T][D] |'
export const FM_W_H_TOG = true
export const FM_W_H_STY = 'background: blue; color: #FFFFFF'
export const LL_W_H_TAG = 'LL [P/T][D] |'
export const LL_W_H_TOG = true
export const LL_W_H_STY = 'background: blue; color: #FFFFFF'
export const LT_W_H_TAG = 'LT [P/T][D] |'
export const LT_W_H_TOG = true
export const LT_W_H_STY = 'background: blue; color: #FFFFFF'
export const SEO_W_H_TAG = 'SEO [P/T][D] |'
export const SEO_W_H_TOG = true
export const SEO_W_H_STY = 'background: blue; color: #FFFFFF'
export const LV2_W_H_TAG: DEBUG = ['LV2 [P/H][D] |', true, 'background: #292929; color: white; border-radius: 1.5px;']
// [ℹ] TOURNAMENTS-(page)-(widgets) (debug)
export const AB_W_T_TAG = 'tournament (about) [DEBUG] |'
export const AB_W_T_TOG = true
export const AB_W_T_STY = 'background: blue; color: #FFFFFF'
export const FIX_W_T_TAG = 'tournament (fixture) [DEBUG] |'
export const FIX_W_T_TOG = true
export const FIX_W_T_STY = 'background: blue; color: #FFFFFF'
export const LI_W_T_TAG = 'tournament (league-info) [DEBUG] |'
export const LI_W_T_TOG = true
export const LI_W_T_STY = 'background: blue; color: #FFFFFF'
export const LI2_W_T_TAG = 'tournament (league-info-2) [DEBUG] |'
export const LI2_W_T_TOG = true
export const LI2_W_T_STY = 'background: blue; color: #FFFFFF'
export const ST_W_T_TAG = 'ST [P/T][D] |'
export const ST_W_T_TOG = true
export const ST_W_T_STY = 'background: blue; color: #FFFFFF'
// (tournament) (widget) ➤ top-players
export const TP_W_TOG = true
export const TP_W_TAG = 'tournament (top-players) [DEBUG] |'
export const TP_W_STY = 'background: green; color: #000000'
// [ℹ] FIREBASE (debug)
export const FIREBASE_DEBUG_TAG = 'FB(E) [D] |'
export const FIREBASE_DEBUG_TOGGLE = true
export const FIREBASE_DEBUG_STYLE = 'background: black; color: yellow; border-radius: 1.5px;'
// [ℹ] FIXTURE-(page)-(widgets) (debug)
export const F_DEBUG_TAG = 'firebase [DEBUG] |'
export const F_DEBUG_TOGGLE = true
export const F_DEBUG_STYLE = 'background: blue; color: #FFFFFF'
export const AB_W_F_TAG = 'fixtures (about) [DEBUG] |'
export const AB_W_F_TOG = true
export const AB_W_F_STY = 'background: blue; color: #FFFFFF'
export const CO_W_F_TAG = 'fixtures (content) [DEBUG] |'
export const CO_W_F_TOG = true
export const CO_W_F_STY = 'background: blue; color: #FFFFFF'
export const H2H_W_F_TAG = 'fixtures (h2h) [DEBUG] |'
export const H2H_W_F_TOG = true
export const H2H_W_F_STY = 'background: blue; color: #FFFFFF'
export const IN_W_F_TAG = 'fixtures (incident) [DEBUG] |'
export const IN_W_F_TOG = true
export const IN_W_F_STY = 'background: blue; color: #FFFFFF'
export const LI_W_F_TAG = 'fixtures (lineups) [DEBUG] |'
export const LI_W_F_TOG = true
export const LI_W_F_STY = 'background: blue; color: #FFFFFF'
export const PR_W_F_TAG = 'fixtures (prob.) [DEBUG] |'
export const PR_W_F_TOG = true
export const PR_W_F_STY = 'background: blue; color: #FFFFFF'
export const SC_W_F_TAG = 'fixtures (scoreboard) [DEBUG] |'
export const SC_W_F_TOG = true
export const SC_W_F_STY = 'background: blue; color: #FFFFFF'
export const ST_W_F_TAG = 'fixtures (standings) [DEBUG] |'
export const ST_W_F_TOG = true
export const ST_W_F_STY = 'background: blue; color: #FFFFFF'
export const STS_W_F_TAG = 'fixtures (stats) [DEBUG] |'
export const STS_W_F_TOG = true
export const STS_W_F_STY = 'background: blue; color: #FFFFFF'
export const VO_W_F_TAG = 'fixtures (vote) [DEBUG] |'
export const VO_W_F_TOG = true
export const VO_W_F_STY = 'background: green; color: #000000'
// [ℹ] PROFILE-(page)-(widgets) (debug)
export const PR_P_TAG = 'profile (page) [DEBUG] |'
export const PR_P_TOG =  true
export const PR_P_STY = 'background: yellow; color: #000000'

// --------------
// --------------

/**
 * @description old logs
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
 * @description old logs
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
 * @returns {void}
 */
export function dlog(
	msg: string | object,
	show?: boolean,
	style?: string
): void {
  if (typeof(msg) == 'string' && msg.includes(LV2_W_H_TAG[0])) style = LV2_W_H_TAG[2]
  if (typeof(msg) == 'string' && msg.includes(LV2_W_H_TAG[0])) show = LV2_W_H_TAG[1]
	// [🐞]
  show = MASTER_DEBUG_TOGGLE != undefined ? MASTER_DEBUG_TOGGLE : show
	if (LOGS_SHOW_OVERRIDE && show && !style) console.debug(msg);
	if (LOGS_SHOW_OVERRIDE && typeof(msg) == 'string' && show && style) console.debug(`%c${msg}`, style);
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
 * @returns {void}
 */
export function dlogv2(
	groupName: string,
	msgs: unknown[],
	show?: boolean,
	style?: string
): void {
	// [🐞]
	if (LOGS_SHOW_OVERRIDE && show) {
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
 * @description Advanced multi- string / object 
 * debug logging function for displaying target 
 * information based on supplied arguments, 
 * and styling.
 * @param {string} groupName
 * @param {unknown[]} msg 
 * @param {boolean} show 
 * @param {string} style
 * @returns {void}
 */
export function dlogv2open(
	groupName: string,
	msgs: unknown[],
	show?: boolean,
	style?: string
): void {
	// [🐞]
	if (LOGS_SHOW_OVERRIDE && show) {
		console.group(
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
	if (LOGS_SHOW_OVERRIDE) console.error(`❌ Error: ${msg}`);
}
