import {
  error
} from '@sveltejs/kit';
import {
  dev
} from '$app/environment';
import type {
  PageLoad
} from './$types';

import type {
  REDIS_CACHE_SINGLE_fixtures_page_info_response,
  REDIS_CACHE_SINGLE_fixtures_seo_response
} from '$lib/models/pages_and_seo/types';

/** 
 * @type {import('./$types').PageLoad} 
 */
export async function load({
  url,
  params,
  fetch,
  setHeaders
}): PageLoad {

  const {
    lang,
    sport
  } = params

  /**
   * [ℹ] Ensure URL Check Existance; 
   * [ℹ] IMPORTANT;
   */

  const response_valid_url = await fetch(`/api/cache/pages_and_seo?url=` + url.pathname, {
    method: 'GET'
  })
  .then((r) => r.json());

  // [ℹ] validate URL existance;
  if (!response_valid_url) {
    // [ℹ] otherwise, ERROR;
    throw error(404, `Uh-oh! This page does not exist!`);
  }

  const urlLang: string = params.lang == undefined ? 'en' : params.lang

  /**
   * [ℹ] Loading of (this) page [fixtures] SEO-READY data; 
   */

  const response_fixtures_seo: REDIS_CACHE_SINGLE_fixtures_seo_response = await fetch(`/api/cache/pages_and_seo?lang=` + urlLang + "&page=fixtures", {
    method: 'GET'
  }).then((r) => r.json());

  const response_fixtures_page_info: REDIS_CACHE_SINGLE_fixtures_page_info_response = await fetch(`/api/cache/pages_and_seo?url=` + url.pathname + "&page=fixtures", {
    method: 'GET'
  }).then((r) => r.json());

  /**
   * [ℹ] regex-ing SEO content dynamically;
  */

  const id = 
    response_fixtures_page_info?.data?.id == undefined
      ? undefined
      : response_fixtures_page_info?.data?.id.toString()
  const league_name = response_fixtures_page_info?.data?.league_name;
  const country = response_fixtures_page_info?.data?.country;
  const home_team_name = response_fixtures_page_info?.data?.home_team_name;
  const away_team_name = response_fixtures_page_info?.data?.away_team_name;
  const fixture_day = 
    response_fixtures_page_info?.data?.fixture_day == undefined
      ? undefined
      : response_fixtures_page_info?.data?.fixture_day.replace('T00:00:00', '')
  const venue_name = response_fixtures_page_info?.data?.venue_name;
  const venue_city = response_fixtures_page_info?.data?.venue_city;

  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{id}/g, id));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{lang}/g, lang));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{sport}/g, sport));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{country}/g, country));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{name}/g, league_name));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{home_team_name}/g, home_team_name));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{away_team_name}/g, away_team_name));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{fixtures_day}/g, fixture_day));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{data.venue.data.name}/g, venue_name));
  response_fixtures_seo.main_data = JSON.parse(JSON.stringify(response_fixtures_seo.main_data).replace(/{data.venue.data.city}/g, venue_city));

  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{id}/g, id));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{lang}/g, lang));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{sport}/g, sport));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{country}/g, country));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{name}/g, league_name));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{home_team_name}/g, home_team_name));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{away_team_name}/g, away_team_name));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{fixtures_day}/g, fixture_day));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{data.venue.data.name}/g, venue_name));
  response_fixtures_seo.twitter_card = JSON.parse(JSON.stringify(response_fixtures_seo.twitter_card).replace(/{data.venue.data.city}/g, venue_city));

  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{id}/g, id));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{lang}/g, lang));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{sport}/g, sport));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{country}/g, country));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{name}/g, league_name));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{home_team_name}/g, home_team_name));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{away_team_name}/g, away_team_name));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{fixtures_day}/g, fixture_day));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{data.venue.data.name}/g, venue_name));
  response_fixtures_seo.opengraph = JSON.parse(JSON.stringify(response_fixtures_seo.opengraph).replace(/{data.venue.data.city}/g, venue_city));

  // [ℹ] canonical exclusive - [EN];
  const enItemAlt = response_fixtures_page_info.alternate_data['en']
  response_fixtures_seo.main_data.canonical = enItemAlt;

  /** 
   * ==========
   * [ℹ] RETURN
   * ==========
   */

  // [ℹ] page -> response data chceck
  if (
    response_fixtures_seo &&
    response_fixtures_page_info
  ) {
    return {
      PAGE_SEO:   response_fixtures_seo,
      FIXTURE_INFO:  response_fixtures_page_info
    }
  }

  throw error(500, `Uh-oh! There has been an /{fixtures} page preloading error`);
}