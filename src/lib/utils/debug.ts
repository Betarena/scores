// #region ➤ 📦 Package Imports

import { dev } from '$app/environment';
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### NOTE:                                                         ◼️
// ### page error messages & error codes                             ◼️
// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

export const PAGE_INVALID_MSG = `Uh-oh! This page does not exist!`;
export const ERROR_CODE_INVALID = 404;
export const ERROR_CODE_PRELOAD = 500;
export const LAYOUT_1_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/layout)`;
export const HOME_LANG_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/lang)`;
export const FIXTURE_PAGE_ERROR_MSG = `Uh-oh! There has been a pre-load error (/fixture)`;

// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### NOTE:                                                         ◼️
// ### log visibility toggles                                        ◼️
// ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

/**
 * @description
 *  📌 overrides all individual toggles for show/hide ALL logs.
 */
const MASTER_DEBUG_TOGGLE: boolean | undefined = undefined
/**
 * @description
 *  📌 overrides (ADMIN) to show logs even in PROD.
 */
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

// ### NOTE: || [🐞]
// ### COMPETITION PAGE - DEBUG;
export const COMP_HIGH_DEBUG: DEBUG = ['Highlights (COMP) |', true, 'background: black; color: yellow; border-radius: 1.5px;'];

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER | [🐞]
 * @description
 *  📌 debug logging function for displaying target.
 * @param { string | object } msg
 *  Target `message` to log in `console`.
 * @param { boolean } show
 *  Wether to `show/hide` log message.
 * @param { string } style
 *  Target `style` to apply to console.
 * @returns { void }
 */
export function dlog
(
	msg: string | object,
	show?: boolean,
	style?: string,
): void
{
  let targetLog: string = undefined;

  // ### NOTE:
  // ### New (v2) debug logs approach.

  // ### NOTE: || [🐞]
  // ### Livescores V2 Logs
  if (typeof(msg) == 'string' && msg.includes(LV2_W_H_TAG[0]))
    style = LV2_W_H_TAG[2];
  ;
  if (typeof(msg) == 'string' && msg.includes(LV2_W_H_TAG[0]))
    show = LV2_W_H_TAG[1];
  ;

  // ### NOTE: || [🐞]
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

  // ### NOTE: || [🐞]
  // ### Hooks Logs
  if (typeof(msg) == 'string' && msg.includes('[H]'))
    style = 'background: #00bce4; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
  ;

  // ### NOTE: || [🐞]
  // ### Reactiviy Logs
  if (typeof(msg) == 'string' && msg.includes('[R]'))
    style = 'background: #FF6133; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
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
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 Debug logging function for displaying target
 * @param { string } groupName
 *  Target debug tag name.
 * @param { unknown[] } msgs
 *  Debug messages to show
 * @param { boolean } [show]
 *  Wether to show or not the debug log.
 * @param { string } [style]
 *  `CSS` style applied to logs.
 * @param { boolean } [closed=true]
 *  Wether to keep group console logs.
 * @returns { void }
 */
export function dlogv2
(
	groupName: string,
	msgs: unknown[],
	show?: boolean,
	style?: string,
  closed: boolean = true,
): void
{
  let targetLog: string = undefined;

  // ### NOTE: || [🐞]
  // ### Authentication Logs
  if (groupName.includes(AU_W_TAG[0]))
    targetLog = AU_W_TAG[0];
  ;
  if (groupName.includes(AU_W_TAG[0]))
    style = AU_W_TAG[2]
  ;
  if (groupName.includes(AU_W_TAG[0]))
    show = AU_W_TAG[1]
  ;

  // ### NOTE: || [🐞]
  // ### Hooks Logs
  if (groupName.includes('[H]'))
    style = 'background: #00bce4; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
  ;

  // ### NOTE: || [🐞]
  // ### Reactiviy Logs
  if (groupName.includes('[R]'))
    style = 'background: #FF6133; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
  ;

  // ### NOTE: || [🐞]
  // ### Fetch Logs
  if (groupName.includes('🏹 FETCH'))
    style = 'background: #C4FD00; color: #000000; border-radius: 1.5px; padding: 2.5px 2.5px;';
  ;

  // ### CHECK
  // ### for showing logs.
  const if_M_0: boolean =
    (LOGS_SHOW_OVERRIDE && show)
    // ### IMPORTANT Force 'authentication' to show in production.
    || (targetLog == AU_W_TAG[0] && AU_W_TAG[1])
  ;
	if (if_M_0)
  {
    if (closed)
      console.groupCollapsed
      (
        `%c${groupName}`,
        style
      );
    else
      console.group
      (
        `%c${groupName}`,
        style
      );
    ;

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

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 error console log platform to easily identify errors;
 * @param { string } msg
 *  Target `message` representing the error.
 * @returns { void }
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
  return;
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