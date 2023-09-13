// #region ➤ 📦 Package Imports

import { dev } from '$app/environment';
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

// *****************************************
// ### NOTE:
// ### page error messages & error codes
// *****************************************

export const PAGE_INVALID_MSG = `Uh-oh! This page does not exist!`;
export const ERROR_CODE_INVALID = 404;
export const ERROR_CODE_PRELOAD = 500;
export const LAYOUT_1_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/layout)`;
export const HOME_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/lang)`;
export const FIXTURE_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/fixture)`;

// *****************************************
// NOTE: overrides all individual toggles for show/hide ALL logs;
// NOTE: (values) true/false | undefined
// *****************************************

const MASTER_DEBUG_TOGGLE = undefined

// *****************************************
// NOTE: overrides "dev" state and forces logs even in PROD where dev == false;
// NOTE: (values) true/false | dev
// NOTE:IMPORTANT for PROD should always be FALSE on PR -> (main)
// NOTE:IMPORTANT using custom ENV for this
// *****************************************

const LOGS_SHOW_OVERRIDE: boolean =
  import.meta?.env?.VITE_PROD_LOGS == undefined
    ? dev
    : import.meta?.env?.VITE_PROD_LOGS == 'false'
      ? false
      : true
;

// *****************************************
// IMPORTANT - Version 1
// NOTE: naming of new DEBUG variables is of following structure:
// NOTE: [2]_W{+T}/P/_TAG/TOG/STY
// NOTE: where:
// NOTE: => [2] = any 2 shortcode char for target VAR
// NOTE: => W/P = (widget + page-type) or (page)
// NOTE: => TAG/TOG/STY = (tag) - (toggle) - (style)
// NOTE: => for example: BG_W_H_TAG => BestGoalscore (Widget) (Homepage) (Tag)
// *****************************************
// IMPORTANT - Version 2
// NOTE: Use the type DEBUG to construct, one-line debug data;
// *****************************************

type DEBUG = [string, boolean, string]

// ### NOTE:
// ### MAIN PAGE - DEBUG
export const NB_W_TAG: DEBUG = ['Navbar |', false, 'background: purple; color: #FFFFFF; border-radius: 1.5px;'];
export const FT_W_TAG: DEBUG = ['Footer |', false, 'background: blue; color: #FFFFFF; border-radius: 1.5px;'];
export const AU_W_TAG: DEBUG = ['Auth |', true, 'background: black; color: yellow; border-radius: 1.5px;'];

// ### NOTE:
// ### HOME PAGE - DEBUG
export const BG_W_H_TAG = 'BG [P/T][D] |';
export const BG_W_H_STY = 'background: blue; color: #FFFFFF';
export const BG_W_H_TOG = false;
export const FB_W_H_TAG = 'FB [P/T][D] |';
export const FB_W_H_STY = 'background: blue; color: #FFFFFF';
export const FB_W_H_TOG = false;
export const FM_W_H_TAG = 'FM [P/T][D] |';
export const FM_W_H_STY = 'background: blue; color: #FFFFFF';
export const FM_W_H_TOG = false;
export const LL_W_H_TAG = 'LL [P/T][D] |';
export const LL_W_H_STY = 'background: blue; color: #FFFFFF';
export const LL_W_H_TOG = false;
export const LT_W_H_TAG = 'LT [P/T][D] |';
export const LT_W_H_STY = 'background: blue; color: #FFFFFF';
export const LT_W_H_TOG = false;
export const SEO_W_H_TAG = 'SEO [P/T][D] |';
export const SEO_W_H_STY = 'background: blue; color: #FFFFFF';
export const SEO_W_H_TOG = false;
export const LV2_W_H_TAG: DEBUG = ['LV2 [P/H][D] |', false, 'background: #292929; color: white; border-radius: 1.5px;'];

// ### NOTE:
// ### LEAGUE/TOURNAMENT PAGE - DEBUG
export const AB_W_T_TAG = 'tournament (about) [DEBUG] |';
export const AB_W_T_STY = 'background: blue; color: #FFFFFF';
export const AB_W_T_TOG = false;
export const FIX_W_T_TAG = 'tournament (fixture) [DEBUG] |';
export const FIX_W_T_STY = 'background: blue; color: #FFFFFF';
export const FIX_W_T_TOG = false;
export const LI_W_T_TAG = 'tournament (league-info) [DEBUG] |';
export const LI_W_T_STY = 'background: blue; color: #FFFFFF';
export const LI_W_T_TOG = false;
export const LI2_W_T_TAG = 'tournament (league-info-2) [DEBUG] |';
export const LI2_W_T_STY = 'background: blue; color: #FFFFFF';
export const LI2_W_T_TOG = false;
export const ST_W_T_TAG = 'ST [P/T][D] |';
export const ST_W_T_STY = 'background: blue; color: #FFFFFF';
export const ST_W_T_TOG = false;
export const TP_W_TAG = 'tournament (top-players) [DEBUG] |';
export const TP_W_STY = 'background: green; color: #000000';
export const TP_W_TOG = false;

// ### NOTE:
// ### FIREBASE - DEBUG
export const FIREBASE_DEBUG_TAG = 'FB(E) [D] |';
export const FIREBASE_DEBUG_TOGGLE = false;
export const FIREBASE_DEBUG_STYLE = 'background: black; color: yellow; border-radius: 1.5px;';

// ### NOTE:
// ### FIXTURE PAGE - DEBUG
export const F_DEBUG_TAG = 'firebase [DEBUG] |';
export const F_DEBUG_STYLE = 'background: blue; color: #FFFFFF';
export const F_DEBUG_TOGGLE = false;
export const AB_W_F_TAG = 'fixtures (about) [DEBUG] |';
export const AB_W_F_STY = 'background: blue; color: #FFFFFF';
export const AB_W_F_TOG = false;
export const CO_W_F_TAG = 'fixtures (content) [DEBUG] |';
export const CO_W_F_STY = 'background: blue; color: #FFFFFF';
export const CO_W_F_TOG = false;
export const H2H_W_F_TAG = 'fixtures (h2h) [DEBUG] |';
export const H2H_W_F_STY = 'background: blue; color: #FFFFFF';
export const H2H_W_F_TOG = false;
export const IN_W_F_TAG = 'fixtures (incident) [DEBUG] |';
export const IN_W_F_STY = 'background: blue; color: #FFFFFF';
export const IN_W_F_TOG = false;
export const LI_W_F_TAG = 'fixtures (lineups) [DEBUG] |';
export const LI_W_F_STY = 'background: blue; color: #FFFFFF';
export const LI_W_F_TOG = false;
export const PR_W_F_TAG = 'fixtures (prob.) [DEBUG] |';
export const PR_W_F_STY = 'background: blue; color: #FFFFFF';
export const PR_W_F_TOG = false;
export const SC_W_F_TAG = 'fixtures (scoreboard) [DEBUG] |';
export const SC_W_F_STY = 'background: blue; color: #FFFFFF';
export const SC_W_F_TOG = false;
export const ST_W_F_TAG = 'fixtures (standings) [DEBUG] |';
export const ST_W_F_STY = 'background: blue; color: #FFFFFF';
export const ST_W_F_TOG = false;
export const STS_W_F_TAG = 'fixtures (stats) [DEBUG] |';
export const STS_W_F_STY = 'background: blue; color: #FFFFFF';
export const STS_W_F_TOG = false;
export const VO_W_F_TAG = 'fixtures (vote) [DEBUG] |';
export const VO_W_F_STY = 'background: green; color: #000000';
export const VO_W_F_TOG = false;

// ### NOTE:
// ### PROFILE PAGE - DEBUG;
export const PR_P_TAG = 'profile (page) [DEBUG] |';
export const PR_P_STY = 'background: yellow; color: #000000';
export const PR_P_TOG =  false;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @summary
 * 🔹 HELPER | [🐞]
 *
 * @description
 * 📌 debug logging function for displaying target.
 *
 * @param
 * { string | object } msg - Target `message` to log in `console`.
 *
 * @param
 * { boolean } show - Wether to `show/hide` log message.
 *
 * @param
 * { string } style - Target `style` to apply to console.
 *
 * @returns
 * void
 */
export function dlog
(
	msg: string | object,
	show?: boolean,
	style?: string
): void
{
  let targetLog: string = undefined;

  // ### NOTE:
  // ### New (v2) debug logs approach.

  // ### Livescores V2 Logs
  if (typeof(msg) == 'string' && msg.includes(LV2_W_H_TAG[0]))
    style = LV2_W_H_TAG[2];
  ;
  if (typeof(msg) == 'string' && msg.includes(LV2_W_H_TAG[0]))
    show = LV2_W_H_TAG[1];
  ;

  // ### Authentication Logs
  if (typeof(msg) == 'string' && msg.includes(AU_W_TAG[0]))
    targetLog = AU_W_TAG[0];
  ;
  if (typeof(msg) == 'string' && msg.includes(AU_W_TAG[0]))
    style = AU_W_TAG[2];
  ;
  if (typeof(msg) == 'string' && msg.includes(AU_W_TAG[0]))
    show = AU_W_TAG[1];
  ;

  // ### Reactiviy Logs
  if (typeof(msg) == 'string' && msg.includes('[R]'))
    style = 'background: #ff7f50; color: black; border-radius: 1.5px;';
  ;

  show =
    MASTER_DEBUG_TOGGLE != undefined
      ? MASTER_DEBUG_TOGGLE
      : show
  ;

  const if_M_0: boolean =
    (LOGS_SHOW_OVERRIDE && show && style == undefined)
    // ### NOTE:
    // ### FORCE AUTHENTICATION LOGS TO SHOW IN PRODUCTION.
    || (targetLog == AU_W_TAG[0] && AU_W_TAG[1] && style == undefined)
  ;
  const if_M_1: boolean =
    (LOGS_SHOW_OVERRIDE && typeof(msg) == 'string' && show && style != undefined)
    // ### NOTE:
    // ### FORCE AUTHENTICATION LOGS TO SHOW IN PRODUCTION.
    || (targetLog == AU_W_TAG[0] && AU_W_TAG[1] && typeof(msg) == 'string' && show && style != undefined)
  ;

	if (if_M_0)
    console.debug(msg);
  ;
	if (if_M_1)
    console.debug(`%c${msg}`, style);
  ;

  return;
}

/**
 * @summary
 * ◆ HELPER
 * @description
 * ➨ debug logging function for displaying target
 * @param
 * {string} groupName
 * @param
 * {unknown[]} msgs
 * @param
 * {boolean} show
 * @param
 * {string} style
 * @returns
 * {void}
 */
export function dlogv2
(
  /** target debug tag name */
	groupName: string,
  /** debug messages to show */
	msgs: unknown[],
  /** wether to show or not the debug log */
	show?: boolean,
  /** css style applied to logs */
	style?: string
): void
{
  let targetLog: string = undefined;

  if (groupName.includes(AU_W_TAG[0]))
    targetLog = AU_W_TAG[0];
  if (groupName.includes(AU_W_TAG[0]))
    style = AU_W_TAG[2]
  if (groupName.includes(AU_W_TAG[0]))
    show = AU_W_TAG[1]

  const if_M_0: boolean =
    (LOGS_SHOW_OVERRIDE && show)
    // FORCE AUTHENTICATION LOGS TO SHOW IN PRODUCTION;
    || (targetLog == AU_W_TAG[0] && AU_W_TAG[1])
  ;
	if (if_M_0)
  {
		console.groupCollapsed
    (
			`%c${groupName}`,
			style
		);
		for (const m of msgs)
    {
			const msg =
				typeof m == 'string'
					? m.replace(/\t/g, '')
					: m
      ;
			console.debug(msg);
		}
		console.groupEnd();
	}
}

/**
 * @summary
 * ◆ HELPER
 * @description
 * ➨ debug logging function for displaying target
 * @param
 * {string} groupName
 * @param
 * {unknown[]} msgs
 * @param
 * {boolean} show
 * @param
 * {string} style
 * @returns
 * {void}
 */
export function dlogv2open
(
	groupName: string,
	msgs: unknown[],
	show?: boolean,
	style?: string
): void
{
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
 * @summary
 * ◆ HELPER
 * @description
 * ➨ error console log platform to easily identify errors;
 * @param
 * {string} msg
 */
export function errlog
(
  msg: string
): void
{
	console.error
  (
    `❌ Error: ${msg}`
  );
}

/**
 * @summary
 * ◆ HELPER
 * @description
 * ➨ initialized Sentry Debug/Logging in PRODUCTION environment;
 */
export function initSentry
(
): void
{
  if (!dev)
  {
    Sentry.init
    (
      {
        dsn: 'https://847e94f5884c4185809a4cee44769d8b@o1009217.ingest.sentry.io/6275655',
        integrations:
        [
          new BrowserTracing(),
          new Sentry.Replay()
        ],

        // NOTE: browser-tracing;

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // NOTE: replay-session;

        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,
        // If the entire session is not sampled, use the below sample rate to sample
        // sessions when an error occurs.
        replaysOnErrorSampleRate: 1.0,
      }
    );
  }
}

// #endregion ➤ 🛠️ METHODS