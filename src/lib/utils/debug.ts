// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Scores Debug Common Logic
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable no-console */
/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { browser, dev } from '$app/environment';
import * as Sentry from '@sentry/browser';
import { json } from '@sveltejs/kit';
import chalk, { type ChalkInstance } from 'chalk';

import { getInstance } from '$lib/constants/instance.js';
import { parseObject } from './string.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ ⛩️ TYPES

type DEBUG = [string, boolean, string]

interface DEBUG_VALUE {
  codeName: string;
  show: boolean;
  style: ChalkInstance;
}

type DEBUG_KEY =
  | 'Hooks |'
  | 'Preload |'
  | 'Store |'
  | 'Subscription | [SIDE-EFFECT]'
  | 'Reactivity |'
  | 'Fetch |'
  | 'Unknown |'
  | 'Interval |'
  | 'Auth |'
;

// #endregion ➤ ⛩️ TYPES

// #region ➤ 📌 VARIABLES

export const
  PAGE_INVALID_MSG = 'Uh-oh! This page does not exist!',
  ERROR_CODE_INVALID = 404,
  ERROR_CODE_PRELOAD = 500,
  ERROR_CODE_UNAUTHORIZED = 401,
  PAGE_UNAUTHORIZED_MSG = 'Uh-oh! You are not authorized to view this page!',
  LAYOUT_1_LANG_PAGE_ERROR_MSG = 'Uh-oh! There has been a pre-load error (/layout)',
  HOME_LANG_PAGE_ERROR_MSG = 'Uh-oh! There has been a pre-load error (/lang)',
  FIXTURE_PAGE_ERROR_MSG = 'Uh-oh! There has been a pre-load error (/fixture)',
  PRELOAD_ERROR_MSG_PLAYER = 'Uh-oh! There has been a pre-load error (/...player_fill)',
  LOG_PREFIX_HOOKS_S = '[HOOKS-SERVER] ::',
  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📝 Error message for `API` data response.
   * @returns { Response }
   *  📤 Response.
   */
  API_DATA_ERROR_RESPONSE = (
    intType = 0
  ) =>
  {
    if (intType == 0)
      return json
      (
        null,
        {
          status: 400,
          statusText: 'Uh-oh! There has been an error'
        }
      );
    else if (intType == 1)
      return json
      (
        null,
        {
          status: 500,
          statusText: 'Invalid Endpoint Condition'
        }
      );
    else
      return json
      (
        null,
        {
          status: 500,
          statusText: 'Unknown Error'
        }
      );
    ;
  }
;

const
  // [🐞]
  logPrefix = '🖥️  [scores] ::'
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
  COMP_HIGH_DEBUG: DEBUG = ['Highlights (COMP) |', true, 'background: black; color: yellow; border-radius: 1.5px;'],
  /**
   * @description
   * 📝 Debug defintion tags.
   */
  objectDebug
    = new Map < DEBUG_KEY, DEBUG_VALUE >
    (
      [
        // ╭─────
        // │ NOTE: |:| Debugging for Svelte/+Kit
        // ╰─────
        [
          'Hooks |',
          { codeName: 'Hooks |', show: true, style: chalk.bgCyan.hex('#ffffff') }
        ],
        [
          'Preload |',
          { codeName: 'Preload |', show: true, style: chalk.hex('#f52891') }
        ],
        [
          'Subscription | [SIDE-EFFECT]',
          { codeName: 'Subscription | [SIDE-EFFECT]', show: true, style: chalk.hex('#ff6060') }
        ],
        [
          'Store |',
          { codeName: 'Store |', show: true, style: chalk.hex('#228B22') }
        ],
        [
          'Reactivity |',
          { codeName: 'Reactivity |', show: true, style: chalk.hex('#FF6133') }
        ],
        [
          'Fetch |',
          { codeName: 'Fetch |', show: true, style: chalk.hex('#C4FD00') }
        ],
        // ╭─────
        // │ NOTE: |:| Debugging for General
        // ╰─────
        [
          'Unknown |',
          { codeName: 'Unknown |', show: true, style: chalk.hex('#f52891') }
        ],
        // ╭─────
        // │ NOTE: |:| Debugging for JavaScript
        // ╰─────
        [
          'Interval |',
          { codeName: 'Interval |', show: true, style: chalk.bgBlack.hex('#FFFF00') }
        ],
        // ╭─────
        // │ NOTE: |:| Debugging for Authentication
        // ╰─────
        [
          'Auth |',
          { codeName: 'Auth |', show: true, style: chalk.hex('#f52891') }
        ]
      ]
    )
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @deprecated
 *  Use `log_v3(..)` instead.
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
  // eslint-disable-next-line no-unused-vars
  show?: boolean,
  // eslint-disable-next-line no-unused-vars
  style?: string,
): void
{
  // [🐞]
  log_v3
  (
    {
      strGroupName: `${logPrefix} ${msg}`,
      msgs: [],
      closed: true
    }
  );

  return;
}

/**
 * @deprecated
 *  Use `log_v3(..)` instead.
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Debug logging function for displaying target
 * @param { string } groupName
 *  💠 **[required]** Debug tag name.
 * @param { unknown[] } msgs
 *  💠 **[required]** Debug message(s) to show.
 * @param { boolean } [show]
 *  💠 [optional] Wether to show or not the debug log.
 * @param { string } [style]
 *  💠 [optional] `CSS` style applied to logs.
 * @param { boolean } [closed=true]
 *  💠 [optional] Wether to keep group console logs closed/open by default.
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
  // [🐞]
  log_v3
  (
    {
      strGroupName: `${logPrefix} ${groupName}`,
      msgs: msgs,
      closed: closed
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 General debuging wrapper.
 * @param { object } opts
 *  ❗️ **REQUIRED** Debug object.
 * @param { string } opts.strGroupName
 *  ❗️ **REQUIRED** Debug tag name.
 * @param { unknown[] } [opts.msgs=[]]
 *  ❗️ **REQUIRED** Debug message(s) to show.
 * @param { boolean } [opts.closed=true]
 *  ❗️ OPTIONAL Wether to keep group console logs closed/open by default.
 * @return { void }
 */
export function log_v3
(
  opts:
  {
    strGroupName: string,
    msgs?: unknown[],
    closed?: boolean,
    timestamp?: boolean
  }
): void
{
  opts.msgs = opts.msgs ?? [];
  opts.closed = opts.closed ?? true;
  opts.timestamp = opts.timestamp ?? true;

  let
    /**
     * @description
     * 📝 Default debug object.
     */ // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    defaultDebug = objectDebug.get('Unknown |')!
  ;

  // ╭─────
  // │ NOTE: |:| Loop through debug objects for details.
  // ╰─────
  for (const [debugKey, debugObj] of objectDebug)
    if (opts.strGroupName.includes(debugKey))
      defaultDebug = debugObj;
  ;

  // ╭─────
  // │ CHECK |:| for showing logs
  // ╰─────
  if (!getInstance('logging') || !defaultDebug.show)
    return;
  ;

  if
  (
    parseObject(opts.msgs).includes('api/data/coinmarketcap')
    || parseObject(opts.msgs).includes('https://pro-api.coinmarketcap.com/v1/cryptocurrency')
    || parseObject(opts.msgs).includes('windowWidth')
  )
    return;
  ;

  opts.strGroupName = `${logPrefix} ${opts.strGroupName}`;

  if (opts.timestamp)
    opts.strGroupName = `${new Date().toISOString()} ${opts.strGroupName}`;
  ;

  opts.strGroupName = defaultDebug.style(opts.strGroupName);

  // ╭─────
  // │ NOTE: |:| logs generation
  // ╰─────
  if (browser)
  {
    if (opts.msgs.length == 0)
      console.log
      (
        opts.strGroupName
      );
    else if (opts.closed)
      console.groupCollapsed
      (
        opts.strGroupName
      );
    else
      console.group
      (
        opts.strGroupName
      );
  }
  else
  {
    console.log
    (
      chalk.hex('#324ca8')(`${new Date().toISOString()} ${logPrefix} ──────────────────────────────────────────────────`)
    );
    console.log
    (
      opts.strGroupName
    );
  }

  // ╭─────
  // │ NOTE: |:| loop through messages.
  // ╰─────
  for (let msg of opts.msgs)
  {
    if (typeof msg == 'string')
      // ╭─────
      // │ NOTE: IMPORTANT |:| Skip logs with `[SKIP]` tag.
      // ╰─────
      if (msg.includes('[SKIP]'))
        msg = '[SKIPPED]';
      else if (msg.includes('[EMPTY]'))
        continue;
    ;

    console.debug(msg);
  }

  if (browser)
    console.groupEnd();
  ;

  return;
}

/**
 * @deprecated
 * Use `log_v3(..)` instead.
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
    chalk.bgRedBright(`❌ Error: ${msg}`)
  );
  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 error console log platform to easily identify errors;
 * @param { string } opts.strErrorMsg
 *  💠 **REQUIRED** Message title
 * @param { 'error' | 'warning' | 'handled' } [opts.isWarning='error']
 *  💠 **OPTIONAL** Type of debug log.
 * @param { Error } [opts.excpetion]
 *  💠 **OPTIONAL** Exception generated.
 * @returns { void }
 */
export function log_error_v1
(
  opts:
  {
    strErrorMsg: string,
    type: 'error' | 'warning' | 'handled',
    excpetion?: Error | string,
  }
): void
{
  const
    /**
     * @description
     * 📝 Error message to display.
     */
    strMessage = parseObject(opts.strErrorMsg),
    /**
     * @description
     * 📝 Error message details.
     */
    strMessageDetaill = parseObject(opts.excpetion)
  ;

  let
    /**
     * @description
     * 📝 Final error message.
     */
    finalMessage = ''
  ;

  if (opts.type === 'handled')
    finalMessage = '🟩 Known Error | 🟦 HANDLED ::';
  else if (opts.type === 'warning')
    finalMessage = '🟩 Known Error | ⚠️ WARNING ::';
  else
    finalMessage = '💀 Unknown Error | ❌ ERROR ::';
  ;

  if (opts.type === 'handled' || opts.type === 'warning')
    console.warn
    (
      `${finalMessage} ${strMessage}`,
      strMessageDetaill
    );
  else
    console.error
    (
      `${finalMessage} ${strMessage}`,
      strMessageDetaill
    );
  ;

  // OPTIONAL
  // console.trace(excpetion);

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
async function saveLogToFile
(
  data: string
): Promise < void >
{
  // if (browser && import.meta.env?.VITE_PROD_LOGS)
  //   await postv2
  //   (
  //     '/api/misc/debug',
  //     data
  //   );
  // ;

  return;
}

// #endregion ➤ 🛠️ METHODS
