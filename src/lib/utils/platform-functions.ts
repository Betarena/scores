// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ [🐞] Scores Common/Global Logic                                                  │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { error, redirect } from '@sveltejs/kit';

import { get } from '$lib/api/utils.js';
import { getUserLocation, getUserLocationFromIP } from '$lib/geo-js/init.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import LZString from 'lz-string';
import { PAGE_INVALID_MSG, dlog, dlogv2 } from './debug.js';
import { removeDiacritics } from './languages.js';

import type { GeoJsResponse } from '$lib/types/types.geojs.js';
import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
import type { B_SAP_CTP_D, B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

/**
 * @deprecated
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Determines language (SSR) of platform.
 * @param { string | undefined } pageRouteId
 *  💠 Target page `routeId`.
 * @param { unknown | undefined } pageError
 *  💠 Target page `error` object.
 * @param { string | undefined } pageParamsLang
 *  💠 Target page `params` for `lang`.
 * @return { string }
 *  📤 Target current `platform` language.
 */
export function platfrom_lang_ssr
(
  pageRouteId?: string | undefined | null,
  pageError?: unknown | undefined,
  pageParamsLang?: string | undefined
): string
{
  // [🐞]
  dlogv2
  (
    'platfrom_lang_ssr(..)',
    [
      `🔹 [var] pageRouteId: ${pageRouteId}`,
      `🔹 [var] pageError: ${JSON.stringify(pageError, null, 2)}`,
      `🔹 [var] pageParamsLang: ${pageParamsLang}`
    ]
  );

  // ╭─────
  // │ CHECK
  // │ > cases of 'EN' default.
  // ╰─────
  if (pageRouteId == null && pageError != null) return 'en';

  const
    /**
     * @description
     *  📣 Target detected **language**.
     */
    language: string
    = (pageRouteId?.includes('[[lang=lang]]') || pageRouteId?.includes('[lang=lang]'))
    && pageParamsLang != undefined
      ? pageParamsLang
      : 'en'
  ;

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ platfrom_lang_ssr(..) language ➡️ ${language}`
  );

  return language;
}

/**
 * @deprecated
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Determines `tablet`, `mobile` and `other` viewport changes as a array/tuple of the `x` states
 * @param { number } TABLET_VIEW_INIT
 *  💠 Target viewport/width at which `tablet` is expected to start.
 * @param { number } MOBILE_VIEW_INIT
 *  💠 Target viewport/width at which `mobile` is expected to start.
 * @param { number } OTHER_VIEW
 *  💠 Custom target viewport/width.
 * @return { boolean[] }
 *  📤 An array of boolean's for each respective width.
 */
export function viewport_change
(
  TABLET_VIEW_INIT: number,
  MOBILE_VIEW_INIT: number,
  OTHER_VIEW?: number
): boolean[]
{
  const
    width: number = document.documentElement.clientWidth,
    isTabletView: boolean = width <= TABLET_VIEW_INIT,
    isMobileView: boolean = width <= MOBILE_VIEW_INIT,
    isOtherView: boolean = width <= OTHER_VIEW
  ;

  return [
    isTabletView,
    isMobileView,
    isOtherView
  ];
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  - 📣 Determines `tablet`, `mobile` and `other` viewport changes as a array/tuple of the `x` states.
 *  - 📣 Successor to `viewport_change(..)`.
 * @param { number } currentWidth
 *  💠 Current width of `window/document`.
 * @param { number } MOBILE_VIEW_INIT
 *  💠 Target viewport/width at which `mobile` is expected to start.
 * @param { number } TABLET_VIEW_INIT
 *  💠 Target viewport/width at which `tablet` is expected to start.
 * @param { number } OTHER_VIEW
 *  💠 Custom target viewport/width.
 * @return { boolean[] }
 *  📤 An array of boolean's for each respective width.
 */
export function viewportChangeV2
(
  currentWidth: number,
  MOBILE_VIEW_INIT: number,
  TABLET_VIEW_INIT: number,
  OTHER_VIEW: number = 0,
): boolean[]
{
  const
    isTabletView: boolean = currentWidth <= TABLET_VIEW_INIT,
    isMobileView: boolean = currentWidth <= MOBILE_VIEW_INIT,
    isOtherView: boolean = currentWidth <= OTHER_VIEW
  ;

  return [
    isMobileView,
    isTabletView,
    isOtherView
  ];
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Determines target initial device type, by the assigned `user-agent` data.
 * @param { string } deviceType
 *  💠 Target `user-agent` detected device.
 * @returns { boolean[] }
 *  📤 `Boolean` array, corresponding to `mobile` and `tablet`.
 */
export function initialDevice
(
  deviceType: string
): boolean[]
{
  let
    isMobileView: boolean,
    isTabletView: boolean
  ;

  if (deviceType == 'mobile')
  {
    isMobileView = true;
    isTabletView = false;
  }
  else if (deviceType == 'tablet')
  {
    isMobileView = true;
    isTabletView = true;
  }
  else if (deviceType == 'desktop')
  {
    isMobileView = false;
    isTabletView = false;
  }

  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ home/Layout.svelte 🖥️',
    true
  );

  return [
    isMobileView!,
    isTabletView!
  ]
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 "pause" JavaScript execution for X milliseconds.
 * @param { number } ms
 *  💠 Number of Milliseconds.
 * @return { Promise < void > }
 */
export async function sleep
(
  ms: number
): Promise < void >
{
  // [🐞]
  console.log('😴 sleeping...');

  return new Promise
  (
    (
      r
    ) =>
    {
      return setTimeout
      (
        r
        , ms
      )
    }
  );
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * TODO: DOC:
 *
 * @param
 * { string } action - Target `googleEvent` action to execute.
 *
 * @returns
 * A Void.
 */
export function googleEventLog
(
  action: string
): void
{
  const gtagEventObj:
  {
    type: string,
    tag_name?: string,
    event_category?: string,
    event_label?: string,
    value?: string
  }
  = {
    type: 'event',
    value: 'click'
  };

  if (action === 'fixture_football_fixtures_probabilities')
  {
    gtagEventObj.tag_name = 'fixture_football_fixtures_probabilities';
    gtagEventObj.event_category = 'fixture_football_fixtures_probabilities';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }

  if (action === 'betting_site_logo_football_fixtures_scoreboard_fixtures')
  {
    gtagEventObj.tag_name = 'fixtures_scoreboard_odds';
    gtagEventObj.event_category = 'widget_fixture_scoreboard_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }

  if (action === 'betting_site_logo_football_fixtures_odds_tournament')
  {
    gtagEventObj.tag_name = 'betting_site_logo_football_fixtures_odds_tournament';
    gtagEventObj.event_category = 'widget_fixture_odds_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }

  if (action === 'tournaments_football_fixtures_odds')
  {
    gtagEventObj.tag_name = 'tournaments_football_fixtures_odds';
    gtagEventObj.event_category = 'widget_fixture_odds_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }

  if (action === 'betting_site_logo_widget_league_info')
  {
    gtagEventObj.tag_name = 'betting_site_logo_widget_league_info';
    gtagEventObj.event_category = 'widget_league_info';
    gtagEventObj.event_label = 'click_betting_site_logo';
  }

  if (action === 'beting_cta_link_widget_league_info')
  {
    gtagEventObj.tag_name = 'beting_cta_link_widget_league_info';
    gtagEventObj.event_category = 'widget_league_info';
    gtagEventObj.event_label = 'beting_cta_link_logo';
  }

  // ### NOTE:
  // ### run target `gtag` event.
  window.gtag
  (
    gtagEventObj.type,
    gtagEventObj.tag_name,
    {
      event_category: gtagEventObj.tag_name,
      event_label: gtagEventObj.event_label,
      value: gtagEventObj.value
    }
  );
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 gets and sets user target Geo. Country location using GeoJs.
 *
 * @returns
 * void
 */
export async function setUserGeoLocation
(
  data: B_NAV_T
): Promise < void >
{
  const if_M_0: boolean
    = userBetarenaSettings.extract('geo-bookmaker') !== undefined
  ;
  if (if_M_0) return;

  let geoRes: GeoJsResponse = await getUserLocation(),

    userGeo: string
    = geoRes.country_code === undefined
      ? null
      : geoRes.country_code.toLowerCase()
  ;

  const if_M_1: boolean
    = userGeo == null
  ;
  if (if_M_1)
  {
    geoRes = await getUserLocationFromIP
    (
      '107.189.0.0'
    );
    userGeo = geoRes.country_code.toLowerCase();
  }

  userBetarenaSettings.updateData
  (
    'geoJs',
    geoRes
  );

  // ### CHECK
  // ### for existance of GEO available from
  // ### translations/country list.
  const data_0 =	data.scores_header_translations?.bookmakers_countries
    ?.find
    (
      function
      (
        item
      )
      {
        return (
          item[0].toString().toLowerCase() === userGeo.toString().toLowerCase()
        );
      }
    );

  if (data_0 == undefined) userGeo = 'en'

  userBetarenaSettings.updateData
  (
    'geo-bookmaker',
    userGeo.toLocaleLowerCase()
  );

  return;
}

/**
 * @summary
 * 🔹 HELPER | [🐞]
 *
 * @description
 * 📌 validates number of `null | undefined` data points in target
 * data Array[].
 *
 * @example [[object Object], [object Object], undefined] => null:
 *
 * @param
 * { unknown[] } data
 */
export function PRELOAD_invalid_data
(
  data: unknown[],
  urls: string[]
): void
{
  try
  {
    const indexesOf: (arr: any[], item: unknown) => number[]
      = (
        arr: any[],
        item: unknown
      ) =>
      {
        return arr.reduce
        (
          (
            accumulator,
            currentVal,
            currentIndex
          ) =>
          {
            return (
              currentVal === item
          && accumulator.push(currentIndex),
              accumulator
            )
          },
          []
        )
      },

      nullList: number[] = indexesOf
      (
        data,
        null
      );

    if (nullList.length == 0)

      // [🐞]
      dlog
      (
        '🚏 checkpoint ➤ PRELOAD_invalid_data 🟩',
        true
      );


    // ### CHECK
    // ### for `null` data fetched.
    if (nullList.length > 0)
    {
      // [🐞]
      dlog
      (
        `🚏 checkpoint ➤ PRELOAD_invalid_data 🟥 (position): ${nullList}`,
        true
      );
      // ### NOTE:
      // ### list URLs responsible for `null` data points.
      for (const i of nullList)

        console.log
        (
          `\t🚩 ${urls[i]}`
        );
    }

    return;
  }
  catch (ex)
  {
    console.debug
    (
      '❌ Err:',
      ex
    )
  }
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Handle of `load` for `.server.ts/.ts` files `exit`.
 *
 * @param
 * { number } t0 - **[required]** timer for 'debug'.
 *
 * @param
 * { stirng } page_tag - **[required]** Target page tag name to 'exit'.
 *
 * @param
 * { number } exit_code - **[required]** Target page exit code to 'exit'.
 *
 * @param
 * { string } exit_reason - [optional] Message for reason on page 'exit'/'error'
 */
export function preloadExitLogic
(
  t0: number,
  page_tag: string,
  exit_code: number,
  exit_reason?: string
): void
{
  // ### [🐞]
  const t1: number = performance.now();

  // ### [🐞]
  dlog
  (
    `${page_tag} ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  throw error
  (
    exit_code,
    exit_reason ?? PAGE_INVALID_MSG
  );
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Handle of `load` for `.server.ts/.ts` files `redirect`.
 *
 * @param
 * { string } redirect_url - **[required]** Target redirect url 'to'
 */
export function preloadRedirect
(
  redirect_url: string
): void
{
  throw redirect
  (
    302,
    redirect_url
  );
}

/**
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @description
 *  📌 `fetch` data from target list of `urls`, and returns results.
 * @param { string[] } endpoints
 *  List of target urls to fetch.
 * @param { fetch } fetch
 *  Target `fetch` object to use.
 * @returns
 *  A listof type `Promise<any[]>`.
 */
export async function promiseUrlsPreload
(
  endpoints: string[],
  fetch: any,
): Promise < any[] >
{
  const data: any[] = await Promise.all
  (
    endpoints
      .map
      (
        async (
          _url: string
        ): Promise < any > =>
        {
        // ### [🐞]
          const t0: number = performance.now(),

            response: Response = await fetch(_url),
            resJson: any = await response.json(),

            // ### [🐞]
            t1: number = performance.now();

          // ▓▓ [🐞]
          dlogv2
          (
            `🏹 FETCH (GET) (preload) ${_url} `,
            [
              `⏱️ ${((t1 - t0) / 1000).toFixed(2)} sec`
            ],
            true,
            null,
            false
          );

          // ▓▓ NOTE: ▓▓ IMPORTANT
          // ▓▓ step necessary to 'decompress' lz-string encoded payload.
          if (_url.includes('decompress'))
            return tryCatch(() => {return JSON.parse(LZString.decompress(resJson?.data))});


          return resJson;
        }
      )
  );

  // ### [🐞]
  PRELOAD_invalid_data
  (
    data,
    endpoints,
  );

  return data;
}

/**
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @description
 *  📌 checks for target `url` to be a `valid` or not.
 * @param { fetch } fetch
 *  Target `fetch(..)` method, supplied by `sveltekit`.
 * @param { Object } opts
 *  Target method `options`.
 * @param { string } opts.langUrl
 *  Target `lang` part of `url`.
 * @param { string } opts.sportUrl
 *  Target `sport` part of `url`.
 * @param { string } opts.countryUrl
 *  Target `country` part of `url`.
 * @param { string } opts.leagueUrl
 *  Target `league` part of `url`.
 * @param { string } opts.fixtureUrl
 *  Target `fixture` part of `url`.
 * @param { string } opts.playerUrl
 *  Target `player` part of `url`.
 * @param { string } opts.competitionMainUrl
 *  Target `competition (lobby)` part of `url`.
 * @param { string } opts.competitionUrl
 *  Target `competition (target)` part of `url`.
 * @returns { boolean }
 */
export async function promiseValidUrlCheck
(
  fetch: any,
  opts:
  {
    langUrl?: string,
    sportUrl?: string,
    countryUrl?: string,
    leagueUrl?: string,
    fixtureUrl?: string,
    playerUrl?: string,
    competitionMainUrl?: string,
    competitionUrl?: string
  }
): Promise < boolean >
{
  // ### CHECK
  // ### wether supplied `URL` combination is valid.
  const if_M_0
    // ### CHECK
    // ### for `lang`.
    = (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl)
    // ### CHECK
    // ### for `sport`.
    || (opts.langUrl && opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl)
    // ### CHECK
    // ### for `country`.
    || (opts.langUrl && opts.sportUrl && opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ### CHECK
    // ### for `tournament/league`.
    || (opts.langUrl && opts.sportUrl && opts.countryUrl && opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ### CHECK
    // ### for `fixture`.
    || (opts.langUrl && opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ### CHECK
    // ### for `player`.
    || (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ### CHECK
    // ### for `competitions` (lobby).
    || (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && opts.competitionMainUrl && !opts.competitionUrl)
    // ### CHECK
    // ### for `competition`.
    || (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && opts.competitionMainUrl && opts.competitionUrl)
  ;

  // ### [🐞]
  dlog
  (
    '🚏 checkpoint ➤ promiseValidUrlCheck',
    true
  );

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ if_M_0 ${if_M_0}`,
    true
  );

  if (!if_M_0) return false;

  // ### NOTE:
  // ### append to target string, the parts of url we wish to validate.

  let queryStr: string = '';
  if (opts.langUrl) queryStr += `?langUrl=${opts.langUrl}`;
  if (opts.sportUrl) queryStr += `&sportUrl=${opts.sportUrl}`;
  if (opts.countryUrl) queryStr += `&countryUrl=${opts.countryUrl}`;
  if (opts.leagueUrl) queryStr += `&leagueUrl=${opts.leagueUrl}`;
  if (opts.fixtureUrl) queryStr += `&fixtureUrl=${opts.fixtureUrl}`;
  if (opts.playerUrl) queryStr += `&playerUrl=${opts.playerUrl}`;
  if (opts.competitionMainUrl) queryStr += `&competitionMainUrl=${opts.competitionMainUrl}`;
  if (opts.competitionUrl) queryStr += `&competitionUrl=${opts.competitionUrl}`;

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ queryStr ${queryStr}`,
    true
  );

  const response: any = await get
  (
    `/api/data/main/seo-pages${queryStr}`,
    fetch,
    true,
    false
  );

  console.log('🎟️', response)

  return response;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @description
 *  📌 `fetch` target sportbook data, based on `client` geo-location.
 *  (⚡️) Data gathered at page-level and set to svelte-stores.
 *
 * NOTE: (*) best approach
 * TODO: (alt) can be moved to a layout-level [?]
 * TODO: (alt) can be moved to a header-level [?]
 * TODO: (alt) can be moved to a +server-level [⚠️]
 * @param { string } geoPos
 *  Target `geo-location`.
 * @returns { Promise < void > }
 */
export async function initSportbookData
(
  geoPos: string | undefined
): Promise < void >
{
  const dataRes0 = await get
  (
    `/api/data/main/sportbook?geoPos=${geoPos}`,
    null,
    true,
    true
  ) as B_SPT_D;

  sessionStore.updateData
  (
    'sportbookMain',
    dataRes0
  );

  const dataRes1 = await get
  (
    `/api/data/main/sportbook?all=true&geoPos=${geoPos}`,
    null,
    true,
    true
  ) as B_SPT_D[];

  sessionStore.updateData
  (
    'sportbookList',
    dataRes1
  );

  return;
}

/**
 * @summary
 * 🔹 HELPER | TESTING | STASH
 *
 * @description
 * TODO: DOC:
 */
export function cssVarChange
(
): void
{
  let value = 'false';

  setInterval
  (
    () =>
    {
      const currentValue = getComputedStyle(document.documentElement).getPropertyValue('--header-is-mobile');

      // console.log(`🔹 [var] --header-is-mobile: ${currentValue}`)
      // console.log(`🔹 [var] value: ${value}`)

      if (currentValue != value)
      {
        // ### NOTE:
        // ### The css-variable has changed
        value = currentValue;
        console.log('🔥 Header Is now Mobile!');
      }

      // console.log('📌 Checking')
    },
    500
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - ⭐️ IMPORTANT
 * @description
 *  📌 Converts target value to a float based value string.
 * @example
 * // returns 20.20
 * toDecimalFix(20.203453)
 * // returns 20.2043
 * toDecimalFix(20.204343, 4)
 * // returns 20.2043
 * toDecimalFix(20.204343, 4, true)
 * // returns 20.2043
 * toDecimalFix(20.204343, 4, true, false)
 * @param { number | null } value
 *  💠 **[required]** Target value to mutate for decimal places.
 * @param { number } [d_places=2]
 *  💠 **[optional]** Target number of decimal places to apply, `deafult = 2`.
 * @param { boolean } [noRoundUp=false]
 *  💠 **[optional]** Wether to perform a `round-up` or not, `deafult = false`.
 * @param { boolean } [removeDot00=true]
 *  💠 **[optional]** Wether to perform a `.00` removal from number (clean), `deafult = true`.
 * @returns { string }
 *  📤 Target mutated value, adjusted for decimal places.
 */
export function toDecimalFix
(
  value: number | null
  , d_places: number = 2
  , noRoundUp: boolean = false
  , removeDot00: boolean = true
): string
{
  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ toDecimalFix(..) value : ${value}`,
    false
  );

  if (value == null) return '-';

  let _value: string  = value.toString();

  if (noRoundUp)

    _value = _value
      .slice
      (
        0,
        (_value.indexOf('.')) + (d_places + 1)
      );


  _value = parseFloat(_value).toFixed(d_places);

  if (removeDot00)

    _value = _value.replace
    (
      '.00',
      ''
    );


  return _value;
}

/**
 * @description
 * TODO: DOC:
 *
 * @param
 * { string } value - Target string balace for trimming
 *
 * @returns
 */
export function spliceBalanceDoubleZero
(
  value: string
): string
{
  // [🐞]
  dlog
  (
    `🔹 [var] ➤ spliceBalanceDoubleZero(..) value : ${value}`,
    true
  );

  if (value == null) return;

  if (value.includes('.00'))
    return value.split('.')[0]
    ;

  return value;
}

/**
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Cleans a target `url` to be used for internal app routing.
 * @param { string } url
 *  Target **url** to clean for internal platform use.
 * @returns { string }
 *  Target string `URL`, ready for internal routing.
 */
export function cleanUrl
(
  url: string
): string
{
  if (url == null) return '';

  url = url.replace
  (
    'https://scores.betarena.com',
    ''
  );

  if (!url.startsWith('/')) url = '/'+url;

  return url;
}

/**
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Generates a target `newUrl` for when a `translation` switch occurs.
 * @param { string } lang
 *  Target **current** platform language.
 * @param { B_SAP_D3 } data
 *  Target **translations** for the term "_competitions_".
 * @returns { string }
 *  Target string, of the new `URL`.
 */
export function generateUrlCompetitions
(
  lang: string,
  data: B_SAP_D3
): string
{
  // ### [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ generateUrlCompetitions(..)',
    [
      `🔹 [var] ➤ lang :|: ${lang}`,
      `🔹 [var] ➤ data :|: ${JSON.stringify(data)}`,
    ],
    true
  );

  const competitionTerm = removeDiacritics(data[lang]);

  let newUrl: string
    = lang == 'en'
      ? `/${competitionTerm}`
      : `/${lang}/${competitionTerm}`
  ;

  newUrl = newUrl.replace
  (
    'https://scores.betarena.com',
    ''
  );

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ translateUrlCompetitions(..) newUrl : ${newUrl}`,
    true
  );

  if (checkNull(newUrl) || checkNull(competitionTerm)) return '/';

  return newUrl;
}

/**
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Generates a target `newUrl` for when a `translation` switch occurs.
 * @param { string } lang
 *  Target **current** platform language.
 * @param { B_SAP_CTP_D } competitionData
 *  Target **competition data**.
 * @returns { string }
 *  Target string, of the new `URL`.
 */
export function generateUrlCompetition
(
  lang: string,
  competitionData: B_SAP_CTP_D
): string
{
  let newUrl: string = `/${competitionData.alternate_data?.[lang]}`;

  newUrl = newUrl.replace
  (
    'https://scores.betarena.com',
    ''
  );

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ generateUrlCompetition(..) newUrl : ${newUrl}`,
    true
  );

  if (checkNull(newUrl)) return '/';

  return newUrl;
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 * @description
 *  📌 Lambda `arrow-function` TryCatch` wrapper.
 * @param { any } action
 *  Target function / method execution.
 * @returns { unknown }
 * An unknown return.
 */
export const tryCatch = (action: any): unknown =>
{
  try
  {
    return action();
  }
  catch (ex)
  {
    // ### [🐞]
    console.debug
    (
      `🚏 checkpoint ➤ tryCatch error : ❌ ${ex}`
    );

    return null;
  }
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Determine wether target value is `empty` / `null`.
 * @example
 *  => checkNull(undefined) => (output) `true`.
 *  => checkNull("hello") => (output) `false`.
 * @param { any } value
 *  💠 **[required]** Target value that requires testing.
 * @return { boolean }
 *  📤 `Boolean` representing respective identified value state.
 */
export const checkNull = (
  value: any
): boolean =>
{
  return value == undefined
    || value == null
  ;
}

/**
 * @description
 *
 * @param
 * { string } value
 *
 * @returns
 */
export const iso2CountryLogo = (value: string): string =>
{
  return value != undefined
    ? `https://betarena.com/images/flags/${value}.svg`
    : 'https://www.betarena.com/images/flags/EN.svg'
  ;
}

/**
 * @description
 * TODO: DOC:
 */
export function langPrefix
(
): string
{
  return sessionStore.extract('lang') == 'en'
    ? '/'
    : `/${sessionStore.extract('lang')}/`
  ;
}

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 * 📌 Generates an `object` from target `Map(..)`.
 *
 * @param
 * { Map < any, any > } map
 *
 * @returns
 * An `object`.
 */
export function recordToKeyValueArray
(
  record: Record < any, any > = null
): any[][]
{
  const jsonObj = Object.keys(record)
    .map
    (
      (
        key
      ) =>
      {return [key, JSON.parse(record[key])]}
    );

  return jsonObj;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Shortens a target wallet address.
 * @example
 *  0xA43B84b58aC6a21A03391971Bd274fe7Eec378Eb => 0xA43...378Eb
 * @returns { string }
 *  Target `wallet address` string.
 */
export function shortenWeb3WalletAddress
(
  walletAddress: string | null
): string
{
  if (!walletAddress) return null;
  return `${
    walletAddress.slice
    (
      0,
      5
    )
  }
    ...
    ${
  walletAddress.slice
  (
    -5
  )
}
  `
    .replaceAll('\t', '');
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Copy target `text` to client `clipboard`.
 * @NOTE
 *  📌 On `dev` only will work on an `SSL/TLS` address, or `localhost`.
 * @param { string } copyText
 *  💠 Target `text` to copy.
 * @return { Promise < void > }
 *
*/
export async function copyToClipboard
(
  copyText: string
): Promise < void >
{
  /* Copy the text inside the text field */
  await navigator.clipboard.writeText(copyText);

  /* Alert the copied text */
  alert('Copied: ' + copyText);

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Converts target `number` into a **number with commas** for _thousandths_ separator.
 * @param { number } x
 *  💠 Target `number` to format.
 * @handles
 *  ⭕️ Takes care of `null` / `undefined` cases.
 * @example
 * - null => ''
 * - undefined => ''
 * - 1000 => 1,000
 * - 1000000 => 1,000,000
 * - 5000 => 5,000
 * @return { string }
 *  📤 Formatted `number` (as `string`) for _thousnads_.
 */
export function formatNumberWithCommas
(
  x: number | null | undefined
): string
{
  if (x?.toString().includes('.')) return x.toString();
  return x
    ?.toString()
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    ?? ''
  ;
}

// #endregion ➤ 🛠️ METHODS
