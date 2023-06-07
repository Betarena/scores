import { get } from "$lib/api/utils.js";
import { sessionStore } from "$lib/store/session.js";
import type { B_SPT_D } from "@betarena/scores-lib/types/sportbook.js";
import { dlog, dlogv2, NB_W_TAG, NB_W_TOG } from "./debug";

/**
 * @description Simple function
 * to determine language (SSR) of platform
 * @param {string | undefined} page_route_id
 * @param {unknown | undefined} page_error
 * @param {string | undefined} page_params_lang
 * @returns string (language)
 */
export function platfrom_lang_ssr
(
	page_route_id?: string | undefined,
	page_error?: unknown | undefined,
	page_params_lang?: string | undefined
): string 
{
  dlogv2(
    NB_W_TAG,
    [
      `page_route_id: ${page_route_id}`,
      `page_error: ${JSON.stringify(page_error, null, 2)}`,
      `page_params_lang: ${page_params_lang}`
    ],
    NB_W_TOG
  )
	// NOTE: default (EN)
	let server_side_language = 'en';
	// [ℹ] validation (#1)
  // [ℹ] errorPage
	const validation_1 =
		page_route_id == null 
    && page_error;
	if (validation_1) return server_side_language;
	// [ℹ] validation (#2)
  // [ℹ] if [[lang=lang]] page
	server_side_language = 
    (page_route_id.includes('[[lang=lang]]') || page_route_id.includes('[lang=lang]'))
    && page_params_lang != undefined
      ? page_params_lang
      : 'en'
  ;
  dlog(`${NB_W_TAG} server_side_language ➡️ ${server_side_language}`, NB_W_TOG)
	return server_side_language;
}

/**
 * @description Simple function to return
 * the TABLET and MOBILE viewport changes
 * as a array/tuple of both states
 * @param {number} TABLET_VIEW
 * @param {number}MOBILE_VIEW
 * @returns boolean (true/false)
 */
export function viewport_change
(
	TABLET_VIEW: number,
	MOBILE_VIEW: number,
  OTHER_VIEW?: number
) 
{
	const width = document.documentElement.clientWidth;
	const tabletExclusive =
    width >= TABLET_VIEW 
      ? false 
      : true
  ;
	const mobileExclusive =
    width <= MOBILE_VIEW 
      ? true 
      : false
  ;
  const otherExclusive =
    width <= OTHER_VIEW 
      ? true 
      : false
  ;
	return [
    tabletExclusive, 
    mobileExclusive,
    otherExclusive
  ];
}

/**
 * @summary [HELPER]
 * @description simple method to "pause"
 * JavaScript execution for X milliseconds;
 * @param {number} ms
 * @returns void
 */
export async function sleep 
(
  ms: number
)
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

export function googleEventLog
(
  action: string
)
{

  if ( action === 'fixture_football_fixtures_probabilities') 
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
        event_category:
          'widget_fixture_scoreboard_info',
        event_label: 'click_betting_site_logo',
        value: 'click'
      }
    );
  }

  return;
}

/**
 * @summary 
 * [HELPER]
 * @description 
 * ➨ identified "NULL" data points, in data array;
 * @example 
 * [[object Object], [object Object], undefined, null] => [2,3]:
 * @param 
 * {unknown[]} data 
 * @returns 
 * ➨ NaN
 */
export function PRELOAD_invalid_data 
(
  data: unknown[],
  urls: string[]
) 
{
  try {
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

    const nullList = indexesOf
    (
      data, 
      null
    );

    if (nullList?.length == 0) 
      dlog
      (
        '🟩 Preload Successfull!',
        true
      );
    ;
    if (nullList?.length > 0) 
      dlog
      (
        `🟥 Preload has null (position): ${nullList}`,
        true
      );
      // list URLs responsible for NULL data points;
      for (const i of nullList) 
      {
        console.log
        (
          `\t🚩 ${urls[i]}`
        );
      }
    ;

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
 * @summary [HELPER] method
 * @description gethers data from target
 * url list, and returns;
 * @param {string[]} endpoints 
 * @param {fetch} fetch 
 * @returns Promise<any[]>
 */
export async function promiseUrlsPreload
(
  endpoints: string[],
  fetch: any
)
{
  const promises = endpoints.map((_url) =>
		fetch(_url).then((response) =>
			response.json()
		)
	);
	const data = await Promise.all(promises);
  return data;
}

/**
 * @summary [HELPER] method
 * @description validates the target
 * url properties for its validity in
 * the +page.ts/+page.server.ts (preload);
 * IMPORTANT used by PRE-LOAD ONLY;
 * @param {fetch} fetch 
 * @param {string} langUrl 
 * @param {string} sportUrl 
 * @param {string} countryUrl 
 * @param {string} leagueUrl 
 * @param {string} fixtureUrl 
 * @param {string} playerUrl 
 * @returns NaN
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

  console.log('validation_0', validation_0)

  if (!validation_0) return false;

  let queryStr = "";
  if (langUrl) queryStr += `?langUrl=${langUrl}`
  if (sportUrl) queryStr += `&sportUrl=${sportUrl}`
  if (countryUrl) queryStr += `&countryUrl=${countryUrl}`
  if (leagueUrl) queryStr += `&leagueUrl=${leagueUrl}`
  if (fixtureUrl) queryStr += `&fixtureUrl=${fixtureUrl}`
  if (playerUrl) queryStr += `&playerUrl=${playerUrl}`

  console.log('queryStr', queryStr)

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
 * @description obtains the target sportbook data 
 * information based on users geo-location;
 * data gathered at page-level and set to svelte-stores
 * to be used by (this) page components;
 * NOTE: (*) best approach
 * TODO: can be moved to a layout-level [?]
 * TODO: can be moved to a header-level [?]
 * TODO: can be moved to a +server-level [⚠️]
 * @returns {Promise<void>} void
 */
export async function initSportbookData
(
  geoPos: string
): Promise < void > 
{
  const dataRes0 = await get
  (
    `/api/cache/tournaments/sportbook?geoPos=${geoPos}`
  ) as B_SPT_D;

  sessionStore.updateSportbookMain
  (
    dataRes0
  );

  const dataRes1 = await get
  (
    `/api/cache/tournaments/sportbook?all=true&geoPos=${geoPos}`
  ) as B_SPT_D[];

  sessionStore.updateSportbookList
  (
    dataRes1
  );
}