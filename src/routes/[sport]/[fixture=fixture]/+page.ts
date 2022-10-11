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
} from '$lib/models/_main_/pages_and_seo/types';
import type { 
  REDIS_CACHE_SINGLE_scoreboard_data 
} from '$lib/models/fixtures/scoreboard/types';

/** @type {import('./$types').PageLoad} */
export async function load({
  url,
  params,
  fetch
}): PageLoad {

  const {
    lang,
    sport
  } = params

  /**
   * [ℹ] IMPORTANT
   * [ℹ] Ensure URL is Valid 
  */

  const response_valid_url = await fetch(`/api/cache/_main_/pages_and_seo?url=` + url.pathname, {
    method: 'GET'
  })
  .then((r) => r.json());

  if (!response_valid_url) {
    throw error(404, `Uh-oh! This page does not exist!`);
  }

  const urlLang: string = params.lang == undefined ? 'en' : params.lang

  /**
   * [ℹ] Loading of (this) page 
   * [ℹ] [fixtures] SEO-READY data; 
  */

  const response_fixtures_seo: REDIS_CACHE_SINGLE_fixtures_seo_response = await fetch(`/api/cache/_main_/pages_and_seo?lang=` + urlLang + "&page=fixtures", {
    method: 'GET'
  }).then((r) => r.json());

  const response_fixtures_page_info: REDIS_CACHE_SINGLE_fixtures_page_info_response = await fetch(`/api/cache/_main_/pages_and_seo?url=` + url.pathname + "&page=fixtures", {
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
   * [ℹ] [GET] page widgets data
  */

  const fixture_id = response_fixtures_page_info?.data?.id;

  const response_scoreboard: REDIS_CACHE_SINGLE_scoreboard_data = await fetch(`/api/cache/fixtures/scoreboard?fixture_id=` + fixture_id, {
    method: 'GET'
  }).then((r) => r.json());

  /** 
   * ==========
   * [ℹ] RETURN
   * ==========
  */

  if (
    response_fixtures_seo &&
    response_fixtures_page_info &&
    response_scoreboard
  ) {
    return {
      PAGE_SEO: response_fixtures_seo,
      FIXTURE_INFO: response_fixtures_page_info,
      FIXTURE_SCOREBOARD: response_scoreboard
    }
  }

  throw error(500, `Uh-oh! There has been an /{fixture} page preloading error`);
}