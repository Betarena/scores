// #region ➤ 📦 Package Imports

import { get } from "$lib/api/utils.js";
import { getUserLocation, getUserLocationFromIP } from "$lib/geo-js/init.js";
import sessionStore from "$lib/store/session.js";
import userBetarenaSettings from '$lib/store/user-settings.js';
import { error, redirect, type Page } from "@sveltejs/kit";
import { NB_W_TAG, dlog, dlogv2 } from "./debug";

import { dev } from "$app/environment";
import { goto } from "$app/navigation";
import type { GeoJsResponse } from "$lib/types/types.geojs.js";
import type { B_SPT_D } from "@betarena/scores-lib/types/sportbook.js";
import { ROUTE_ID_PROFILE } from "./user.js";

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS


/**
 * @summary
 * 🔹 HELPER
 * @description
 * 📌 Determines language (SSR) of platform.
 * @param
 * { string | undefined } page_route_id - Target page `routeId`.
 * @param
 * { unknown | undefined } page_error - Target page `error` object.
 * @param
 * { string | undefined } page_params_lang - Target page `params` for `lang`.
 * @returns
 * A string of target language.
 */
export function platfrom_lang_ssr
(
	page_route_id?: string | undefined,
	page_error?: unknown | undefined,
	page_params_lang?: string | undefined
): string
{

  // [🐞]
  dlogv2
  (
    'Platfrom-Functions',
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

  // [🐞]
  dlog
  (
    `Platfrom-Functions server_side_language ➡️ ${server_side_language}`
  );

	return server_side_language;
}

/**
 * @summary
 * 🔹 HELPER
 * @description Simple function to return
 * the TABLET and MOBILE viewport changes
 * as a array/tuple of both states
 * @param
 * { number } TABLET_VIEW_INIT - Target viewport/width at
 * which `tablet` is expected to start.
 * @param
 * { number } MOBILE_VIEW_INIT - Target viewport/width at
 * which `mobile` is expected to start.
 * @param
 * { number } OTHER_VIEW - Custom target viewport/width.
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
 * 🔹 HELPER
 * @description
 * 📌 "pause" JavaScript execution for X milliseconds.
 * @param
 * { number } ms - Number of Milliseconds.
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
 * 🔹 HELPER
 * @description
 * TODO: DOC:
 * @param
 * { string } action
 * @returns
 * void
 */
export function googleEventLog
(
  action: string
): void
{

  if (action === 'fixture_football_fixtures_probabilities')
  {
    // @ts-expect-error - Add gtag to global types;
    window.gtag
    (
      'event',
      'fixture_football_fixtures_probabilities',
      {
        event_category:
          'fixture_football_fixtures_probabilities',
        event_label: 'click_betting_site_logo',
        value: 'click'
      }
    );
  }

  if (action === 'betting_site_logo_football_fixtures_scoreboard_fixtures')
  {
    // @ts-expect-error - Add gtag to global types;
    window.gtag
    (
      'event',
      'fixtures_scoreboard_odds',
      {
        event_category: 'widget_fixture_scoreboard_info',
        event_label: 'click_betting_site_logo',
        value: 'click'
      }
    );
  }

  if (action === 'betting_site_logo_football_fixtures_odds_tournament')
  {
    // @ts-expect-error - Add gtag to global types;
    window.gtag
    (
      'event',
      'betting_site_logo_football_fixtures_odds_tournament',
      {
        event_category: 'widget_fixture_odds_info',
        event_label: 'click_betting_site_logo',
        value: 'click'
      }
    );
  }

  if (action === 'tournaments_football_fixtures_odds')
  {
    // @ts-expect-error - Add gtag to global types;
    window.gtag
    (
      'event',
      'tournaments_football_fixtures_odds',
      {
        event_category: 'widget_fixture_odds_info',
        event_label: 'click_betting_site_logo',
        value: 'click'
      }
    );
  }

  if (action === 'betting_site_logo_widget_league_info')
  {
    // @ts-expect-error - Add gtag to global types;
    window.gtag
    (
      'event',
      'betting_site_logo_widget_league_info',
      {
        event_category: 'widget_league_info',
        event_label: 'click_betting_site_logo',
        value: 'click'
      }
    );
  }

  if (action === 'beting_cta_link_widget_league_info')
  {
    // @ts-expect-error - Add gtag to global types;
    window.gtag
    (
      'event',
      'beting_cta_link_widget_league_info',
      {
        event_category: 'widget_league_info',
        event_label: 'beting_cta_link_logo',
        value: 'click'
      }
    );
  }

}

/**
 * @summary
 * 🔹 HELPER
 * @description
 * 📌 gets and sets user target Geo. Country location using GeoJs.
 * @returns
 * void
 */
export async function setUserGeoLocation
(
  HEADER_TRANSLATION_DATA: any
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
  const data_0 =	HEADER_TRANSLATION_DATA?.scores_header_translations?.bookmakers_countries
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
 * 🔹 HELPER / 🐞 DEBUG
 * @description
 * 📌 validates number of `null | undefined` data points in target
 * data Array[].
 * @example [[object Object], [object Object], undefined] => null:
 * @param
 * { unknown[] } data
 * @returns
 * NaN
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
 * 🔹 HELPER
 * @description
 * 📌 Handle of `load` for `.server.ts/.ts` files `exit`.
 * @param
 * { number } t0 - **[required]** timer for 'debug'.
 * @param
 * { stirng } page_tag - **[required]** Target page tag name to 'exit'.
 * @param
 * { number } exit_code - **[required]** Target page exit code to 'exit'.
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
  // [🐞]
  const t1: number = performance.now();

  // [🐞]
  dlog
  (
    `${page_tag} ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  throw error
  (
    exit_code,
    exit_reason
  );
}

/**
 * @summary
 * 🔹 HELPER
 * @description
 * 📌 Handle of `load` for `.server.ts/.ts` files `redirect`.
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
 * 🔹 HELPER
 * @description
 * 📌 `fetch` data from target list of `urls`, and returns results.
 * @param
 * { string[] } endpoints - List of target urls to fetch.
 * @param
 * { fetch } fetch - Target `fetch` object to use.
 * @returns
 * A listof type `Promise<any[]>`.
 */
export async function promiseUrlsPreload
(
  endpoints: string[],
  fetch: any
): Promise < any[] >
{

  const promises: any[] = endpoints
  ?.map
  (
    (
      _url
    ) =>
		fetch(_url)
    .then
    (
      (
        response
      ) =>
			response.json()
		)
	);

	const data: any[] = await Promise.all(promises);

  // [🐞]
  PRELOAD_invalid_data
  (
    data,
    endpoints
  );

  return data;
}

/**
 * @summary
 * 🔹 HELPER
 * @description
 * 📌 checks for target `url` to be a `valid` or not.
 * @param {fetch} fetch
 * @param {string} langUrl
 * @param {string} sportUrl
 * @param {string} countryUrl
 * @param {string} leagueUrl
 * @param {string} fixtureUrl
 * @param {string} playerUrl
 * @returns
 * A `boolean`.
 */
export async function promiseValidUrlCheck
(
  fetch: any,
  langUrl: string = null,
  sportUrl: string = null,
  countryUrl: string = null,
  leagueUrl: string = null,
  fixtureUrl: string = null,
  playerUrl: string = null
): Promise < boolean >
{

  const validation_0 =
    // lang
    (langUrl && !sportUrl && !countryUrl && !leagueUrl && !fixtureUrl && !playerUrl)
    // sport
    || (langUrl && sportUrl && !countryUrl && !leagueUrl && !fixtureUrl && !playerUrl)
    // country
    || (langUrl && sportUrl && countryUrl && !leagueUrl && !fixtureUrl && !playerUrl)
    // tournament/league
    || (langUrl && sportUrl && countryUrl && leagueUrl && !fixtureUrl && !playerUrl)
    // fixture
    || (langUrl && sportUrl && !countryUrl && !leagueUrl && fixtureUrl && !playerUrl)
    // player
    || (langUrl && !sportUrl && !countryUrl && !leagueUrl && !fixtureUrl && playerUrl)
  ;

  // [🐞]
  dlog
  (
    `🚏 checkpoint ➤ promiseValidUrlCheck`,
    true
  );

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ validation_0 ${validation_0}`,
    true
  );

  if (!validation_0) return false;

  let queryStr: string = "";
  if (langUrl) queryStr += `?langUrl=${langUrl}`;
  if (sportUrl) queryStr += `&sportUrl=${sportUrl}`;
  if (countryUrl) queryStr += `&countryUrl=${countryUrl}`;
  if (leagueUrl) queryStr += `&leagueUrl=${leagueUrl}`;
  if (fixtureUrl) queryStr += `&fixtureUrl=${fixtureUrl}`;
  if (playerUrl) queryStr += `&playerUrl=${playerUrl}`;

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ queryStr ${queryStr}`,
    true
  );

  const response = await fetch
  (
    `/api/data/main/seo-pages${queryStr}`,
    {
      method: 'GET'
    }
  )
  .then((r) => r.json())
  ;

  return response;
}

/**
 * @summary
 * 🔹 HELPER
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
 * @description
 * TODO: DOC:
 *
 * @param
 * { number } d_places - Target number of decimal places.
 *
 * @returns
 */
export function toDecimalFix
(
  value: number,
  d_places: number = 2
): string
{
  // [🐞]
  dlog
  (
    `🔹 [var] ➤ value ${value}`,
    true
  );

  if (value == null) return;

  return parseFloat(value.toString()).toFixed(d_places);
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
    `🔹 [var] ➤ value ${value}`,
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
 * 📌 MAIN | IMPORTANT
 *
 * @description
 * 📌 Updates `user` language platform selection.
 *
 * ⚡️ Manages platform main navigation,
 * for some of the section routes.
 *
 * @param
 * { string } lang - Target new `selected` language.
 */
export async function selectLanguage
(
  lang: string,
  page: Page<Record<string, string>, string>
): Promise < void >
{

  if (sessionStore?.getServerLang() == lang) return;

  // ➫ NOTE:
  // ➫ Past/previous lang option.
  const pastLang: string =
    sessionStore?.getServerLang() == 'en'
      ? '/'
      : `/${sessionStore?.getServerLang()}`
  ;

  userBetarenaSettings.setLang
  (
    lang
  );

  // [🐞]
  dlogv2
  (
    `${NB_W_TAG} selectLanguage()`,
    [
      `$userBetarenaSettings.lang: ${userBetarenaSettings.getUserLang()}`,
      `$sessionStore?.serverLang: ${sessionStore?.getServerLang()}`,
      `lang: ${lang}`,
      `pastLang: ${pastLang}`,
      `$page.route.id: ${page.route.id}`
    ],
    true
  );

  // TODO:
  // isLangDropdown = false;

  // ➫ NOTE:
  // ➫ Update <html {lang}> in DOCTYPE.
  let tempLang: string = lang;
  if (lang === 'br') tempLang = 'pt-BR';
  document.documentElement.setAttribute
  (
    'lang',
    tempLang
  );

  // ➫ CHECK
  // ➫ on error', navigate back to homepage;
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

  // ➫ CHECK
  // ➫ Omit 'special' routes cases, as these routes
  // ➫ manage their own navigation/translation switch.
  const if_M_1: boolean =
    [
      '/[[lang=lang]]/[sport]/[country]/[league_name]',
      '/[[lang=lang]]/[sport]/[fixture=fixture]',
      '/[[lang=lang]]/[player=player]/[...player_fill]'
    ]
    .includes(page.route.id)
  ;
  if (if_M_1)
  {
    // [🐞]
    dlog
    (
      `${NB_W_TAG} omitting route: ${page.route.id}`,
      true
    );
    return;
  }

  // ➫ CHECK
  // ➫ On profile page route, handle.
  else if (ROUTE_ID_PROFILE == page.route.id)
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
      `${NB_W_TAG} inside (PROFILE) ${lang},
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

  // ➫ NOTE:
  // ➫ Otherwise, continue navigation switch.
  // ➫ NOTE:

  // ➫ CHECK
  // ➫ for 'EN' naviagtion.
  else if (lang == 'en' && pastLang != '/')
  {

    // prefetch(`/`); [? - maybe ?] // NOTE:

    // [ℹ] count number of slashes URL;
    var count =	page.url.pathname.split('/').length - 1;
    // [ℹ] replace path-name accordingly for "EN" - first occurance;
    const newURL: string =
      count == 1
        ? page.url.pathname.replace(pastLang, '/')
        : page.url.pathname.replace(pastLang, '')
    ;
    dlog(`${NB_W_TAG} inside (EN) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`, true)

    // [ℹ] update URL breadcrumb;
    // window.history.replaceState({}, "NewPage", newURL);
    await goto(newURL, { replaceState: true });
  }
  // ➫ CHECK
  // ➫ for 'incoming (past)' from an 'EN (/)' route.
  else if (lang != 'en' && pastLang == '/')
  {
    // [ℹ] count number of slashes URL;
    var countSlash = page.url.pathname.split('/').length - 1;
    // [ℹ] replace path-name accordingly for "<lang>" - first occurance;
    const newURL: string =
      countSlash > 1
        ? page.url.pathname.replace(pastLang, `/${lang}/`)
        : page.url.pathname.replace(pastLang, `/${lang}`)
    ;
    dlog(`${NB_W_TAG} inside (V2) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`, true)

    // [ℹ] update URL breadcrumb;
    // window.history.replaceState({}, "NewPage", newURL);
    await goto(newURL, { replaceState: true });
  }
  // ➫ CHECK
  // ➫ for 'incoming (past)' from an 'non-EN (/)' route.
  else if (lang != 'en' && pastLang != '/')
  {
    // [ℹ] count number of slashes URL;
    var countSlash = page.url.pathname.split('/').length - 1;
    // [ℹ] replace path-name accordingly for "<lang>" - first occurance;
    const newURL: string = page.url.pathname.replace(pastLang, `/${lang}`);
    dlog(`${NB_W_TAG} inside (V3) ${lang}, pastLang: ${pastLang}, countSlash: ${countSlash}, newURL: ${newURL}`, true)

    // [ℹ] update URL breadcrumb;
    // window.history.replaceState({}, "NewPage", newURL);
    await goto(newURL, { replaceState: true });
  }
}

// #endregion ➤ 🛠️ METHODS