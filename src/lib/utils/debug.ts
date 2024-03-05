// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Debug Common Logic                                                      │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { browser, dev } from '$app/environment';
import * as Sentry from '@sentry/browser';
import chalk from 'chalk';

import { postv2 } from '$lib/api/utils.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

type DEBUG = [string, boolean, string]

export const
  PAGE_INVALID_MSG = 'Uh-oh! This page does not exist!',
  ERROR_CODE_INVALID = 404,
  ERROR_CODE_PRELOAD = 500,
  LAYOUT_1_LANG_PAGE_ERROR_MSG = 'Uh-oh! There has been a pre-load error (/layout)',
  HOME_LANG_PAGE_ERROR_MSG = 'Uh-oh! There has been a pre-load error (/lang)',
  FIXTURE_PAGE_ERROR_MSG = 'Uh-oh! There has been a pre-load error (/fixture)',
  PRELOAD_ERROR_MSG_PLAYER = 'Uh-oh! There has been a pre-load error (/...player_fill)'
;

const
  /**
   * @description
   *  - 📣 overrides all individual toggles for show/hide ALL logs.
   *  - 📣 used for local development override of `logs`.
   */
  MASTER_DEBUG_TOGGLE: boolean = true,
  /**
   * @description
   *  - 📣 overrides (ADMIN) to show logs even in PROD.
   *  - 📣 Prevents logs display on `deployments`.
   */
  LOGS_SHOW_OVERRIDE: boolean
    = import.meta.env.VITE_PROD_LOGS == undefined
      ? dev
      : import.meta.env.VITE_PROD_LOGS == 'false'
        ? false
        : true
;

export const
  // ╭─────
  // │ NOTE:
  // │ > Main Page (debug)
  // ╰─────
  NB_W_TAG: DEBUG = ['Navbar |', false, 'background: purple; color: #FFFFFF; border-radius: 1.5px;'],
  FT_W_TAG: DEBUG = ['Footer |', false, 'background: blue; color: #FFFFFF; border-radius: 1.5px;'],
  AU_W_TAG: DEBUG = ['Auth |', true, 'background: black; color: yellow; border-radius: 1.5px;'],
  // ╭─────
  // │ NOTE:
  // │ > Home Page (debug)
  // ╰─────
  BG_W_H_TAG = 'BG [P/T][D] |',
  BG_W_H_STY = 'background: blue; color: #FFFFFF',
  BG_W_H_TOG = false,
  FB_W_H_TAG = 'FB [P/T][D] |',
  FB_W_H_STY = 'background: blue; color: #FFFFFF',
  FB_W_H_TOG = false,
  FM_W_H_TAG = 'FM [P/T][D] |',
  FM_W_H_STY = 'background: blue; color: #FFFFFF',
  FM_W_H_TOG = false,
  LL_W_H_TAG = 'LL [P/T][D] |',
  LL_W_H_STY = 'background: blue; color: #FFFFFF',
  LL_W_H_TOG = false,
  LT_W_H_TAG = 'LT [P/T][D] |',
  LT_W_H_STY = 'background: blue; color: #FFFFFF',
  LT_W_H_TOG = false,
  SEO_W_H_TAG = 'SEO [P/T][D] |',
  SEO_W_H_STY = 'background: blue; color: #FFFFFF',
  SEO_W_H_TOG = false,
  LV2_W_H_TAG: DEBUG = ['LV2 [P/H][D] |', false, 'background: #292929; color: white; border-radius: 1.5px;'],
  // ╭─────
  // │ NOTE:
  // │ > League/Tournament Page (debug)
  // ╰─────
  AB_W_T_TAG = 'tournament (about) [DEBUG] |',
  AB_W_T_STY = 'background: blue; color: #FFFFFF',
  AB_W_T_TOG = false,
  FIX_W_T_TAG = 'tournament (fixture) [DEBUG] |',
  FIX_W_T_STY = 'background: blue; color: #FFFFFF',
  FIX_W_T_TOG = false,
  LI_W_T_TAG = 'tournament (league-info) [DEBUG] |',
  LI_W_T_STY = 'background: blue; color: #FFFFFF',
  LI_W_T_TOG = false,
  LI2_W_T_TAG = 'tournament (league-info-2) [DEBUG] |',
  LI2_W_T_STY = 'background: blue; color: #FFFFFF',
  LI2_W_T_TOG = false,
  ST_W_T_TAG = 'ST [P/T][D] |',
  ST_W_T_STY = 'background: blue; color: #FFFFFF',
  ST_W_T_TOG = false,
  TP_W_TAG = 'tournament (top-players) [DEBUG] |',
  TP_W_STY = 'background: green; color: #000000',
  TP_W_TOG = false,
  // ╭─────
  // │ NOTE:
  // │ > Firebase (debug)
  // ╰─────
  FIREBASE_DEBUG_TAG = 'FB(E) [D] |',
  FIREBASE_DEBUG_TOGGLE = false,
  FIREBASE_DEBUG_STYLE = 'background: black; color: yellow; border-radius: 1.5px;',
  // ╭─────
  // │ NOTE:
  // │ > Fixture Page (debug)
  // ╰─────
  F_DEBUG_TAG = 'firebase [DEBUG] |',
  F_DEBUG_STYLE = 'background: blue; color: #FFFFFF',
  F_DEBUG_TOGGLE = false,
  AB_W_F_TAG = 'fixtures (about) [DEBUG] |',
  AB_W_F_STY = 'background: blue; color: #FFFFFF',
  AB_W_F_TOG = false,
  CO_W_F_TAG = 'fixtures (content) [DEBUG] |',
  CO_W_F_STY = 'background: blue; color: #FFFFFF',
  CO_W_F_TOG = false,
  H2H_W_F_TAG = 'fixtures (h2h) [DEBUG] |',
  H2H_W_F_STY = 'background: blue; color: #FFFFFF',
  H2H_W_F_TOG = false,
  IN_W_F_TAG = 'fixtures (incident) [DEBUG] |',
  IN_W_F_STY = 'background: blue; color: #FFFFFF',
  IN_W_F_TOG = false,
  LI_W_F_TAG = 'fixtures (lineups) [DEBUG] |',
  LI_W_F_STY = 'background: blue; color: #FFFFFF',
  LI_W_F_TOG = false,
  PR_W_F_TAG = 'fixtures (prob.) [DEBUG] |',
  PR_W_F_STY = 'background: blue; color: #FFFFFF',
  PR_W_F_TOG = false,
  SC_W_F_TAG = 'fixtures (scoreboard) [DEBUG] |',
  SC_W_F_STY = 'background: blue; color: #FFFFFF',
  SC_W_F_TOG = false,
  ST_W_F_TAG = 'fixtures (standings) [DEBUG] |',
  ST_W_F_STY = 'background: blue; color: #FFFFFF',
  ST_W_F_TOG = false,
  STS_W_F_TAG = 'fixtures (stats) [DEBUG] |',
  STS_W_F_STY = 'background: blue; color: #FFFFFF',
  STS_W_F_TOG = false,
  VO_W_F_TAG = 'fixtures (vote) [DEBUG] |',
  VO_W_F_STY = 'background: green; color: #000000',
  VO_W_F_TOG = false,
  // ╭─────
  // │ NOTE:
  // │ > Profile Page (debug)
  // ╰─────
  PR_P_TAG = 'profile (page) [DEBUG] |',
  PR_P_STY = 'background: yellow; color: #000000',
  PR_P_TOG =  false,
  // ╭─────
  // │ NOTE:
  // │ > Competition Page (debug)
  // ╰─────
  COMP_HIGH_DEBUG: DEBUG = ['Highlights (COMP) |', true, 'background: black; color: yellow; border-radius: 1.5px;']
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - [🐞]
 * @description
 *  📣 debug logging function for displaying target.
 * @param { string | object } msg
 *  💠 **[required]** Target `message` to log in `console`.
 * @param { boolean } [show]
 *  💠 [optional] Wether to `show/hide` log message.
 * @param { string } [style]
 *  💠 [optional] Target `style` to apply to console.
 * @return { void }
 */
export function dlog
(
  msg: string | object,
  show?: boolean,
  style?: string,
): void
{
  let
    targetLog: string = undefined
  ;

  // ╭─────
  // │ > Livescores V2 Logs
  // ╰─────
  if (typeof(msg) == 'string' && msg.includes(LV2_W_H_TAG[0]))
  {
    style = LV2_W_H_TAG[2];
    show = LV2_W_H_TAG[1];
  }

  // ╭─────
  // │ > Authentication Logs
  // ╰─────
  if (typeof(msg) == 'string' && msg.includes(AU_W_TAG[0]))
  {
    targetLog = AU_W_TAG[0];
    style = AU_W_TAG[2];
    show = AU_W_TAG[1];
  }

  // ╭─────
  // │ > Hooks Logs
  // ╰─────
  if (typeof(msg) == 'string' && msg.includes('[H]'))
    style = 'background: #00bce4; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
  ;

  // ╭─────
  // │ > Reactiviy Logs
  // ╰─────
  if (typeof(msg) == 'string' && msg.includes('[R]'))
    style = 'background: #FF6133; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
  ;

  show = MASTER_DEBUG_TOGGLE && show;

  const
    if_M_0: boolean
      = (LOGS_SHOW_OVERRIDE && show && style == undefined)
      // ╭─────
      // │ IMPORTANT
      // │ > Force 'authentication' to show in production.
      // ╰─────
      || (targetLog == AU_W_TAG[0] && AU_W_TAG[1] && style == undefined),
    if_M_1: boolean
      = (LOGS_SHOW_OVERRIDE && typeof(msg) == 'string' && show && style != undefined)
      // ╭─────
      // │ IMPORTANT
      // │ > Force 'authentication' to show in production.
      // ╰─────
      || (targetLog == AU_W_TAG[0] && AU_W_TAG[1] && typeof(msg) == 'string' && show && style != undefined)
  ;

  if (if_M_0)
    // eslint-disable-next-line no-console
    console.debug(msg);
  ;
  if (if_M_1)
    // eslint-disable-next-line no-console
    console.debug(`%c${msg}`, style);
  ;

  saveLog(msg);

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Debug logging function for displaying target
 * @param { string } groupName
 *  💠 **[required]** Target debug tag name.
 * @param { unknown[] } msgs
 *  💠 **[required]** Debug messages to show
 * @param { boolean } [show]
 *  💠 [optional] Wether to show or not the debug log.
 * @param { string } [style]
 *  💠 [optional] `CSS` style applied to logs.
 * @param { boolean } [closed=true]
 *  💠 [optional] Wether to keep group console logs.
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
  let
    targetLog: string = undefined
  ;

  // ╭─────
  // │ > Authentication Logs
  // ╰─────
  if (groupName.includes(AU_W_TAG[0]))
  {
    targetLog = AU_W_TAG[0];
    style = AU_W_TAG[2];
    show = AU_W_TAG[1];
  }

  // ╭─────
  // │ > Hooks Logs
  // ╰─────
  if (groupName.includes('[H]'))
  {
    style = 'background: #00bce4; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
    if (!browser) groupName = `${chalk.bgCyan(groupName)}`;
  }

  // ╭─────
  // │ > Preload Logs
  // ╰─────
  if (groupName.includes('[PL]'))
  {
    style = 'background: #f52891; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
    if (!browser) groupName = `${chalk.hex('#f52891')(groupName)}`;
  }

  // ╭─────
  // │ > Reactiviy Logs
  // ╰─────
  if (groupName.includes('[R]'))
  {
    style = 'background: #FF6133; color: black; border-radius: 1.5px; padding: 2.5px 2.5px;';
    if (!browser) groupName = `${chalk.hex('#FF6133')(groupName)}`;
  }

  // ╭─────
  // │ > Fetch Logs
  // ╰─────
  if (groupName.includes('🏹 FETCH'))
  {
    style = 'background: #C4FD00; color: #000000; border-radius: 1.5px; padding: 2.5px 2.5px;';
    if (!browser) groupName = `${chalk.hex('#C4FD00')(groupName)}`;
  }
  if (groupName.includes('(preload)'))
  {
    style = 'background: #004B2B; color: #00CF77; border-radius: 1.5px; padding: 2.5px 2.5px;';
    if (!browser) groupName = `${chalk.green(groupName)}`;
  }

  // ╭─────
  // │ CHECK
  // │ > for showing logs.
  // ╰─────
  const if_M_0: boolean
    = (LOGS_SHOW_OVERRIDE && show)
    // ╭─────
    // │ IMPORTANT
    // │ > Force 'authentication' to show in production.
    // ╰─────
    || (targetLog == AU_W_TAG[0] && AU_W_TAG[1])
  ;
  if (if_M_0)
  {
    if (closed)
      // eslint-disable-next-line no-console
      console.groupCollapsed
      (
        `%c${groupName}`,
        style
      );
    else
      // eslint-disable-next-line no-console
      console.group
      (
        `%c${groupName}`,
        style
      );
    ;

    saveLog(groupName);

    for (const m of msgs)
    {
      let msg: unknown = m;

      if (typeof m == 'string')
      {
        let mStr: string;
        mStr = m.replace(/\n/g, '');
        mStr = m.replace(/\t/g, '');

        if (mStr.includes('🔹 [var]') && mStr.includes('▓▓'))
        {
          const tempMsg: string[] = mStr.split
          (
            '▓▓'
          );
          msg = `${chalk.blue(tempMsg[0]) + chalk.hex('#444444')(tempMsg[1])}`;
        }
      }

      // eslint-disable-next-line no-console
      console.debug(msg);

      saveLog(msg);
    }

    // eslint-disable-next-line no-console
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
 *  📣 error console log platform to easily identify errors;
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
 * @deprecated
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 initialized Sentry Debug/Logging in PRODUCTION environment;
 */
export function initSentry
(
): void
{
  if (!dev)

    Sentry.init
    (
      {
        dsn: 'https://847e94f5884c4185809a4cee44769d8b@o1009217.ingest.sentry.io/6275655',
        integrations:
        [
          // new BrowserTracing(), // deprecated
          new Sentry.Replay()
        ],
        // release: "v.2.2.3",

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

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Save `log` to `file`.
 * @param { string } data
 *  💠 **[required]** Target `data` to be logged.
 * @return { void }
 */
async function saveLog
(
  data: string
): Promise < void >
{
  if (browser && dev)
    await postv2
    (
      '/api/misc/debug',
      data
    );
  ;

  return;
}

// #endregion ➤ 🛠️ METHODS
