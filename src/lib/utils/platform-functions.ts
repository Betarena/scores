// *************************************************
// IMPORTANT                                       *
// *************************************************
// The file 'utils/platform-functions.ts' contains *
// functions that are used by many files and logic *
// within the Betarena Scores (this) project.      *
// *************************************************

// #region ➤ 📦 Package Imports

import { dev } from "$app/environment";
import { goto } from "$app/navigation";
import { error, redirect, type Page } from "@sveltejs/kit";

import { get } from "$lib/api/utils.js";
import { getUserLocation, getUserLocationFromIP } from "$lib/geo-js/init.js";
import sessionStore from "$lib/store/session.js";
import userBetarenaSettings from '$lib/store/user-settings.js';
import LZString from 'lz-string';
import { NB_W_TAG, PAGE_INVALID_MSG, dlog, dlogv2 } from "./debug";
import { removeDiacritics } from "./languages.js";
import { ROUTE_ID_PROFILE } from "./user.js";

import type { GeoJsResponse } from "$lib/types/types.geojs.js";
import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
import type { B_SAP_CTP_D, B_SAP_D3 } from "@betarena/scores-lib/types/seo-pages.js";
import type { B_SPT_D } from "@betarena/scores-lib/types/sportbook.js";

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Determines language (SSR) of platform.
 *
 * @param
 * { string | undefined } page_route_id - Target page `routeId`.
 *
 * @param
 * { unknown | undefined } page_error - Target page `error` object.
 *
 * @param
 * { string | undefined } page_params_lang - Target page `params` for `lang`.
 *
 * @returns
 * A string of target current `platform` language.
 */
export function platfrom_lang_ssr
(
	page_route_id?: string | undefined,
	page_error?: unknown | undefined,
	page_params_lang?: string | undefined
): string
{

  // ### [🐞]
  dlogv2
  (
    'platfrom_lang_ssr(..)',
    [
      `🔹 [var] page_route_id: ${page_route_id}`,
      `🔹 [var] page_error: ${JSON.stringify(page_error, null, 2)}`,
      `🔹 [var] page_params_lang: ${page_params_lang}`
    ]
  );

	// ### NOTE:
  // ### default to 'EN'.
	let server_side_language: string = 'en';

  // ### CHECK
  // ### for cases of 'EN' default.
	const if_M_0: boolean =
		page_route_id == null
    && page_error != null
  ;
	if (if_M_0) return server_side_language;

  // ### CHECK
  // ### for cases of [[lang=lang]] page.
	server_side_language =
    (page_route_id.includes('[[lang=lang]]') || page_route_id.includes('[lang=lang]'))
    && page_params_lang != undefined
      ? page_params_lang
      : 'en'
  ;

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ platfrom_lang_ssr(..) server_side_language ➡️ ${server_side_language}`
  );

	return server_side_language;
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Determines `tablet`, `mobile` and `other` viewport
 * changes as a array/tuple of the `x` states
 *
 * @param
 * { number } TABLET_VIEW_INIT - Target viewport/width at
 * which `tablet` is expected to start.
 *
 * @param
 * { number } MOBILE_VIEW_INIT - Target viewport/width at
 * which `mobile` is expected to start.
 *
 * @param
 * { number } OTHER_VIEW - Custom target viewport/width.
 *
 * @returns
 * An array of boolean's (true/false)
 */
export function viewport_change
(
	TABLET_VIEW_INIT: number,
	MOBILE_VIEW_INIT: number,
  OTHER_VIEW?: number
): boolean[]
{
	const width: number = document.documentElement.clientWidth;

	const isTabletView: boolean = width <= TABLET_VIEW_INIT;
	const isMobileView: boolean = width <= MOBILE_VIEW_INIT;
  const isOtherView: boolean = width <= OTHER_VIEW;

	return [
    isTabletView,
    isMobileView,
    isOtherView
  ];
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Determines target initial device type, by the assigned
 * `user-agent` data.
 *
 * @param
 * { string } deviceType - Target `user-agent` detected device.
 *
 * @returns
 * An array of boolean's (true/false), corresponding to `mobile` and `tablet`.
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
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ home/Layout.svelte 📱`,
      true
    );

    isMobileView = true;
    isTabletView = false;
  }
  else if (deviceType == 'tablet')
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ home/Layout.svelte 💻`,
      true
    );

    isMobileView = true;
    isTabletView = true;
  }
  else if (deviceType == 'desktop')
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ home/Layout.svelte 🖥️`,
      true
    );

    isMobileView = false;
    isTabletView = false;
  }

  return [
    isMobileView,
    isTabletView
  ]
}

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 * 📌 "pause" JavaScript execution for X milliseconds.
 *
 * @param
 * { number } ms - Number of Milliseconds.
 *
 * @returns
 * void
 */
export async function sleep
(
  ms: number
): Promise < void >
{
  new Promise
  (
    (
      r
    ) =>
    setTimeout
    (
      r,
      ms
    )
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
  } =
  {
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
    gtagEventObj?.type,
    gtagEventObj?.tag_name,
    {
      event_category: gtagEventObj?.tag_name,
      event_label: gtagEventObj?.event_label,
      value: gtagEventObj?.value
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

  const if_M_0: boolean =
    userBetarenaSettings.getCountryBookmaker() !== undefined
  ;
  if (if_M_0) return;

  let geoRes: GeoJsResponse = await getUserLocation();

  let userGeo: string =
    geoRes?.country_code === undefined
      ? null
      : geoRes.country_code.toLowerCase()
  ;

  const if_M_1: boolean =
    userGeo == null
  ;
  if (if_M_1)
  {
    geoRes = await getUserLocationFromIP
    (
      '107.189.0.0'
    );
    userGeo = geoRes.country_code.toLowerCase();
  }

  userBetarenaSettings.setGeoJs
  (
    geoRes
  );

  // ### CHECK
  // ### for existance of GEO available from
  // ### translations/country list.
  const data_0 =	data?.scores_header_translations?.bookmakers_countries
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

  userBetarenaSettings.setCountryBookmaker
  (
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
    const indexesOf: (arr: any[], item: unknown) => number[] =
      (
        arr: any[],
        item: unknown
      ) =>
      arr.reduce
      (
        (
          accumulator,
          currentVal,
          currentIndex
        ) =>
        (
          currentVal === item
          && accumulator.push(currentIndex),
          accumulator
        ),
        []
      )
    ;

    const nullList: number[] = indexesOf
    (
      data,
      null
    );

    if (nullList?.length == 0)
    {
      // [🐞]
      dlog
      (
        `🚏 checkpoint ➤ PRELOAD_invalid_data 🟩`,
        true
      );
    };

    // ### CHECK
    // ### for `null` data fetched.
    if (nullList?.length > 0)
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
      {
        console.log
        (
          `\t🚩 ${urls[i]}`
        );
      }
    };

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
export function PRELOAD_exitPage
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
export function PRELOAD_redirectPage
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
    ?.map
    (
      async (
        _url: string
      ): Promise < any > =>
      {

        const response: Response = await fetch(_url);
        const resJson: any = await response.json()

        // ### NOTE: | IMPORTANT
        // ### step necessary to 'decompress' lz-string encoded payload.
        if (_url.includes('decompress'))
          return JSON.parse(LZString.decompress(resJson?.data));
        ;

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
  const if_M_0 =
    // ### CHECK
    // ### for `lang`.
    (opts?.langUrl && !opts?.sportUrl && !opts?.countryUrl && !opts?.leagueUrl && !opts?.fixtureUrl && !opts?.playerUrl && !opts?.competitionMainUrl)
    // ### CHECK
    // ### for `sport`.
    || (opts?.langUrl && opts?.sportUrl && !opts?.countryUrl && !opts?.leagueUrl && !opts?.fixtureUrl && !opts?.playerUrl && !opts?.competitionMainUrl)
    // ### CHECK
    // ### for `country`.
    || (opts?.langUrl && opts?.sportUrl && opts?.countryUrl && !opts?.leagueUrl && !opts?.fixtureUrl && !opts?.playerUrl && !opts?.competitionMainUrl && !opts?.competitionUrl)
    // ### CHECK
    // ### for `tournament/league`.
    || (opts?.langUrl && opts?.sportUrl && opts?.countryUrl && opts?.leagueUrl && !opts?.fixtureUrl && !opts?.playerUrl && !opts?.competitionMainUrl && !opts?.competitionUrl)
    // ### CHECK
    // ### for `fixture`.
    || (opts?.langUrl && opts?.sportUrl && !opts?.countryUrl && !opts?.leagueUrl && opts?.fixtureUrl && !opts?.playerUrl && !opts?.competitionMainUrl && !opts?.competitionUrl)
    // ### CHECK
    // ### for `player`.
    || (opts?.langUrl && !opts?.sportUrl && !opts?.countryUrl && !opts?.leagueUrl && !opts?.fixtureUrl && opts?.playerUrl && !opts?.competitionMainUrl && !opts?.competitionUrl)
    // ### CHECK
    // ### for `competitions` (lobby).
    || (opts?.langUrl && !opts?.sportUrl && !opts?.countryUrl && !opts?.leagueUrl && !opts?.fixtureUrl && !opts?.playerUrl && opts?.competitionMainUrl && !opts?.competitionUrl)
    // ### CHECK
    // ### for `competition`.
    || (opts?.langUrl && !opts?.sportUrl && !opts?.countryUrl && !opts?.leagueUrl && !opts?.fixtureUrl && !opts?.playerUrl && opts?.competitionMainUrl && opts?.competitionUrl)
  ;

  // ### [🐞]
  dlog
  (
    `🚏 checkpoint ➤ promiseValidUrlCheck`,
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

  let queryStr: string = "";
  if (opts?.langUrl) queryStr += `?langUrl=${opts?.langUrl}`;
  if (opts?.sportUrl) queryStr += `&sportUrl=${opts?.sportUrl}`;
  if (opts?.countryUrl) queryStr += `&countryUrl=${opts?.countryUrl}`;
  if (opts?.leagueUrl) queryStr += `&leagueUrl=${opts?.leagueUrl}`;
  if (opts?.fixtureUrl) queryStr += `&fixtureUrl=${opts?.fixtureUrl}`;
  if (opts?.playerUrl) queryStr += `&playerUrl=${opts?.playerUrl}`;
  if (opts?.competitionMainUrl) queryStr += `&competitionMainUrl=${opts?.competitionMainUrl}`;
  if (opts?.competitionUrl) queryStr += `&competitionUrl=${opts?.competitionUrl}`;

  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ queryStr ${queryStr}`,
    true
  );

  const response: any = await get
  (
    `/api/data/main/seo-pages${queryStr}`,
    fetch
  );

  return response;
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 `fetch` target sportbook data,
 * based on `client` geo-location.
 *
 * ⚡️ Data gathered at page-level and set to svelte-stores.
 *
 * NOTE: (*) best approach
 * TODO: (alt) can be moved to a layout-level [?]
 * TODO: (alt) can be moved to a header-level [?]
 * TODO: (alt) can be moved to a +server-level [⚠️]
 * @returns {Promise<void>} void
 */
export async function initSportbookData
(
  geoPos: string
): Promise < void >
{
  const dataRes0 = await get
  (
    `/api/data/main/sportbook?geoPos=${geoPos}`
  ) as B_SPT_D;

  sessionStore.updateSportbookMain
  (
    dataRes0
  );

  const dataRes1 = await get
  (
    `/api/data/main/sportbook?all=true&geoPos=${geoPos}`
  ) as B_SPT_D[];

  sessionStore.updateSportbookList
  (
    dataRes1
  );
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
 * @summary
 *  🔹 HELPER | IMPORTANT
 * @description
 *  📌 Converts target value to a float based value string.
 * @param { number } value
 *  Target value to mutate.
 * @param { number } [d_places=2]
 *  Target number of decimal places to return.
 *  * @param { boolean } [noRoundUp=false]
 *  Wether to perform a `round-up` or not.
 * @returns { string }
 */
export function toDecimalFix
(
  value: number
  , d_places: number = 2
  , noRoundUp: boolean = false
): string
{
  // ### [🐞]
  dlog
  (
    `🔹 [var] ➤ toDecimalFix(..) value : ${value}`,
    false
  );

  if (value == null) return;

  let _value: string  = value?.toString();

  if (noRoundUp)
    _value = _value
    .slice
    (
      0,
      (_value.indexOf(".")) + (d_places + 1)
    );
  ;

  _value = parseFloat(_value)?.toFixed(d_places);

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
    return value?.split('.')?.[0]
  ;

  return value;
}

/**
 * @summary
 *  📌 MAIN | IMPORTANT
 * @description
 *  📌 Updates `user` language platform selection.
 *  ⚡️ Manages platform main navigation, for some of the section routes.
 * @param { string } lang
 *  Target new `selected` language.
 * @param { Page<Record<string, string>, string> } page
 *  Target page sveltekit object.
 * @returns { Promise < void > }
 */
export async function selectLanguage
(
  lang: string,
  page: Page < Record < string, string >, string >
): Promise < void >
{
  // ### CHECK
  if (sessionStore?.getServerLang() == lang) return;

  // ### NOTE:
  // ### Past/previous lang option.
  const pastLang: string =
    sessionStore?.getServerLang() == 'en'
      ? '/'
      : `/${sessionStore?.getServerLang()}`
  ;

  userBetarenaSettings.setLang
  (
    lang
  );

  // ### [🐞]
  dlogv2
  (
    `🚏 checkpoint ➤ selectLanguage(..)`,
    [
      `🔹 [var] ➤ $userBetarenaSettings.lang: ${userBetarenaSettings.getUserLang()}`,
      `🔹 [var] ➤ $sessionStore?.serverLang: ${sessionStore?.getServerLang()}`,
      `🔹 [var] ➤ lang: ${lang}`,
      `🔹 [var] ➤ pastLang: ${pastLang}`,
      `🔹 [var] ➤ $page.route.id: ${page.route.id}`
    ],
    true
  );

  // ### TODO:
  // ### <->
  // isLangDropdown = false;

  // ### NOTE:
  // ### Update <html {lang}> in DOCTYPE.
  let tempLang: string = lang;
  if (lang === 'br') tempLang = 'pt-BR';
  document.documentElement.setAttribute
  (
    'lang',
    tempLang
  );

  // ### CHECK
  // ### on error', navigate back to homepage;
  const if_M_0: boolean =
    page.error
    && !dev
  ;
  if (if_M_0)
  {
    const targetUrl: string =
      lang == 'en'
        ? `/`
        : `/${lang}`
    ;

    // [🐞]
    dlog
    (
      `${NB_W_TAG} -> ${lang}`,
      true,
    );

    await goto
    (
      targetUrl
    );

    return;
  }

  // ### CHECK
  // ### Omit 'special' routes cases, as these routes
  // ### manage their own navigation/translation switch.
  const if_M_1: boolean =
    [
      '/[[lang=lang]]/[sport]/[country]/[league_name]',
      '/[[lang=lang]]/[sport]/[fixture=fixture]',
      '/[[lang=lang]]/[player=player]/[...player_fill]',
      '/[[lang=lang]]/[competitions=competitions]',
      '/[[lang=lang]]/[competitions=competitions]/[...competition_fill]',
    ]
    .includes(page?.route?.id)
  ;
  if (if_M_1)
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ selectLanguage if_M_1 page?.route?.id: ${page?.route?.id}`,
      true
    );

    return;
  }

  // ### CHECK
  // ### On profile page route, handle.
  else if (ROUTE_ID_PROFILE == page?.route?.id)
  {

    const pastLangV2: string =
      pastLang == `/`
        ? `/en`
        : pastLang
    ;

    let tempUrl: string = `${page.url.pathname}/`;

    const newURL: string = tempUrl
    ?.replace
    (
      `${pastLangV2}/`,
      `/${lang}`
    );

    // [🐞]
    dlog
    (
      `inside (PROFILE) ${lang},
      pastLangV2: ${pastLangV2}; tempUrl: ${tempUrl}; newURL: ${newURL}`,
      true
    );

    await goto
    (
      newURL,
      {
        replaceState: true
      }
    );

  }

  // ### NOTE:
  // ### Otherwise, continue navigation switch.
  // ### NOTE:

  // ### CHECK
  // ### for 'EN' naviagtion.
  else if (lang == 'en' && pastLang != '/')
  {

    // ### NOTE:
    // ### maybe [?]
    // prefetch(`/`);

    // ### NOTE:
    // ### count number of slashes URL.
    var count: number =	page.url.pathname.split('/').length - 1;

    // ### NOTE:
    // ### replace path-name accordingly for 'EN', first occurance.
    const newURL: string =
      count == 1
        ? page.url.pathname.replace(pastLang, '/')
        : page.url.pathname.replace(pastLang, '')
    ;

    // ### [🐞]
    dlog
    (
      `inside (EN) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`,
      true
    );

    // ### NOTE:
    // ### update URL breadcrumb.

    // ### Solution 1.
    // window.history.replaceState({}, "NewPage", newURL);

    // ### Solution 2.
    await goto
    (
      newURL,
      {
        replaceState: true
      }
    );
  }
  // ### CHECK
  // ### for 'incoming (past)' from an 'EN (/)' route.
  else if (lang != 'en' && pastLang == '/')
  {

    // ### NOTE:
    // ### count number of slashes URL.
    var countSlash = page.url.pathname.split('/').length - 1;

    // ### NOTE:
    // ### replace path-name accordingly for "<lang>" - first occurance.
    const newURL: string =
      countSlash > 1
        ? page.url.pathname.replace(pastLang, `/${lang}/`)
        : page.url.pathname.replace(pastLang, `/${lang}`)
    ;

    // ### [🐞]
    dlog
    (
      `${NB_W_TAG} inside (V2) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`,
      true
    );

    // ### NOTE:
    // ### update URL breadcrumb.

    // ### Solution 1.
    // window.history.replaceState({}, "NewPage", newURL);

    // ### Solution 2.
    await goto
    (
      newURL,
      {
        replaceState: true
      }
    );
  }
  // ### CHECK
  // ### for 'incoming (past)' from an 'non-EN (/)' route.
  else if (lang != 'en' && pastLang != '/')
  {
    // ### NOTE:
    // ### count number of slashes URL.
    var countSlash = page.url.pathname.split('/').length - 1;

    // ### NOTE:
    // ### replace path-name accordingly for "<lang>", first occurance.
    const newURL: string = page.url.pathname.replace(pastLang, `/${lang}`);

    // ### [🐞]
    dlog
    (
      `${NB_W_TAG} inside (V3) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`,
      true
    );

    // ### NOTE:
    // ### update URL breadcrumb.

    // ### Solution 1.
    // window.history.replaceState({}, "NewPage", newURL);

    // ### Solution 2.
    await goto(newURL, { replaceState: true });
  }
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
  url = url.replace
  (
    'https://scores.betarena.com',
    ''
  );

  if (url?.[0] != '/') url = '/'+url;

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
  dlog
  (
    `🔹 [var] ➤ translateUrlCompetitions(..) data : ${JSON.stringify(data)}`,
    true
  );

  const competitionTerm: string = removeDiacritics(data?.[lang]);

  let newUrl: string =
    lang == 'en'
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

  if (checkNull(newUrl)) return '/';

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
  let newUrl: string = `/${competitionData?.alternate_data?.[lang]}`;

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
 * @summary
 * 🔹 HELPER
 *
 * @description
 * 📌 Determine wether target value is `empty` / `null`
 *
 * @param
 * { any } value - Target value that requires testing.
 *
 * @returns
 * A `boolean`
 */
export const checkNull = (value: any): boolean =>
{
  const if_M_0: boolean =
    value == undefined
    || value == null
  ;

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ checkNull(..) if_M_0 ${if_M_0}`,
    true
  );

  return if_M_0;
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
    : `https://www.betarena.com/images/flags/EN.svg`
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
  ?.map
  (
    (
      key
    ) =>
    [key, JSON.parse(record[key])]
  );

  return jsonObj;
}

// #endregion ➤ 🛠️ METHODS