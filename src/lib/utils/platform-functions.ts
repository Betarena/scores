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
 * @summary [HELPER] method
 * @description validates for number of
 * null || undefined data points in target
 * data Array[];
 * @example [[object Object], [object Object], undefined] => null:
 * @param {unknown[]} data 
 * @returns NaN
 */
export function PRELOAD_invalid_data 
(
  data: unknown[]
): void 
{
  const indexesOf = (arr, item) =>
		arr.reduce(
			(acc, v, i) => (
				v === item && acc.push(i), acc
  ),[]);
	dlog(`null (preload): ${indexesOf(data, null)}`, true);
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