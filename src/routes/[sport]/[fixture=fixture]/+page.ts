import {
  error
} from '@sveltejs/kit';
import {
  dev
} from '$app/environment';
import type {
  PageLoad
} from './$types';

import type { REDIS_CACHE_SINGLE_fixtures_page_info_response, REDIS_CACHE_SINGLE_fixtures_seo_response, REDIS_CACHE_SINGLE_general_countries_translation, REDIS_CACHE_SINGLE_general_sport_translation } from '$lib/models/_main_/pages_and_seo/types';
import type { REDIS_CACHE_SINGLE_scoreboard_data, REDIS_CACHE_SINGLE_scoreboard_translation } from '$lib/models/fixtures/scoreboard/types';
import type { REDIS_CACHE_SINGLE_lineups_data, REDIS_CACHE_SINGLE_lineups_translation } from '$lib/models/fixtures/lineups/types';
import type { REDIS_CACHE_SINGLE_incidents_data, REDIS_CACHE_SINGLE_incidents_translation } from '$lib/models/fixtures/incidents/types';
import type { REDIS_CACHE_SINGLE_statistics_data, REDIS_CACHE_SINGLE_statistics_translation } from '$lib/models/fixtures/statistics/types';
import type { REDIS_CACHE_SINGLE_content_data, REDIS_CACHE_SINGLE_content_translation } from '$lib/models/fixtures/content/types';
import type { REDIS_CACHE_SINGLE_about_data, REDIS_CACHE_SINGLE_about_translation } from '$lib/models/fixtures/about/types';
import type { Cache_Single_Lang_Featured_Betting_Site_Translation_Response } from '$lib/models/home/featured_betting_sites/firebase-real-db-interface';
import type { REDIS_CACHE_SINGLE_votes_translation } from '$lib/models/fixtures/votes/types';

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
   * [ℹ] checking URL is valid & viewable
  */

  const response_valid_url = await fetch(
    `/api/cache/_main_/pages_and_seo?url=` + url.pathname, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  // [ℹ] exit
  if (!response_valid_url) {
    throw error(404, `Uh-oh! This page does not exist!`);
  }

  // [ℹ] extract critical data from URL
  const urlLang: string = params.lang == undefined ? 'en' : params.lang
  const fixture_id = url.pathname.match(/\d+$/);

  /**
   * [ℹ] load (THIS) fixture page 
   * [ℹ] seo ready data
  */

  const response_fixtures_seo: REDIS_CACHE_SINGLE_fixtures_seo_response = await fetch(
    `/api/cache/_main_/pages_and_seo?lang=` + urlLang + "&page=fixtures", 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  const response_fixtures_page_info: REDIS_CACHE_SINGLE_fixtures_page_info_response = await fetch(
    `/api/cache/_main_/pages_and_seo?fixture_id=` + fixture_id + "&page=fixtures", 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  /**
   * [ℹ] regex-ing SEO content dynamically;
  */

  const id = 
    response_fixtures_page_info?.data?.id == undefined
      ? undefined
      : response_fixtures_page_info?.data?.id.toString()
  const league_name = response_fixtures_page_info?.data?.league_name;
  const country_id = response_fixtures_page_info?.data?.country_id;
  const home_team_name = response_fixtures_page_info?.data?.home_team_name;
  const away_team_name = response_fixtures_page_info?.data?.away_team_name;
  const fixture_day = 
    response_fixtures_page_info?.data?.fixture_day == undefined
      ? undefined
      : response_fixtures_page_info?.data?.fixture_day.replace('T00:00:00', '')
  const venue_name = response_fixtures_page_info?.data?.venue_name;
  const venue_city = response_fixtures_page_info?.data?.venue_city;

  const response_country_translation: REDIS_CACHE_SINGLE_general_countries_translation = await fetch(
    `/api/cache/_main_/pages_and_seo?country_id=` + country_id,
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  const country = response_country_translation?.translations[urlLang];

  response_fixtures_page_info.data.country = country
  response_fixtures_page_info.data.sport = 'football'

  // const response_sport_translation: REDIS_CACHE_SINGLE_general_sport_translation = await fetch(
  //   `/api/cache/_main_/pages_and_seo?sport=` + country_id,
  //   {
  //     method: 'GET'
  //   }
  // ).then((r) => r.json());

  // const sport_typ = response_sport_translation[lang]

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

  // const fixture_id = response_fixtures_page_info?.data?.id;

  // NOTE:IMPORTANT: can be null -load from hasura
  let response_scoreboard: REDIS_CACHE_SINGLE_scoreboard_data = await fetch(
    `/api/cache/fixtures/scoreboard?fixture_id=` + fixture_id, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  if (response_scoreboard == undefined) {
    if (dev) console.debug("Non current_season fixture - loading from Hasura Directly")
    response_scoreboard = await fetch(
      `/api/hasura/fixtures/scoreboard?fixture_id=` + fixture_id, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());
  }

  const response_scoreboard_translation: REDIS_CACHE_SINGLE_scoreboard_translation = await fetch(
    `/api/cache/fixtures/scoreboard?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  // NOTE:IMPORTANT: can be null -load from hasura
  let response_lineups: REDIS_CACHE_SINGLE_lineups_data = await fetch(
    `/api/cache/fixtures/lineups?fixture_id=` + fixture_id, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  if (response_lineups == undefined) {
    if (dev) console.debug("Non current_season fixture - loading from Hasura Directly")
    response_lineups = await fetch(
      `/api/hasura/fixtures/lineups?fixture_id=` + fixture_id, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());
  }

  const response_lineups_translation: REDIS_CACHE_SINGLE_lineups_translation = await fetch(
    `/api/cache/fixtures/lineups?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  // NOTE:IMPORTANT: can be null -load from hasura
  let response_incidents: REDIS_CACHE_SINGLE_incidents_data = await fetch(
    `/api/cache/fixtures/incidents?fixture_id=` + fixture_id, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  if (response_incidents == undefined) {
    if (dev) console.debug("Non current_season fixture - loading from Hasura Directly")
    response_incidents = await fetch(
      `/api/hasura/fixtures/incidents?fixture_id=` + fixture_id, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());
  }

  const response_incidents_translation: REDIS_CACHE_SINGLE_incidents_translation = await fetch(
    `/api/cache/fixtures/incidents?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  const response_featured_betting_sites_translation: Cache_Single_Lang_Featured_Betting_Site_Translation_Response = await fetch(
    `/api/cache/home/featured_betting_sites?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  // NOTE:IMPORTANT: can be null -load from hasura
  let response_statistics: REDIS_CACHE_SINGLE_statistics_data = await fetch(
    `/api/cache/fixtures/statistics?fixture_id=` + fixture_id, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  if (response_statistics == undefined) {
    if (dev) console.debug("Non current_season fixture - loading from Hasura Directly")
    response_statistics = await fetch(
      `/api/hasura/fixtures/statistics?fixture_id=` + fixture_id, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());
  }

  const response_statistics_translation: REDIS_CACHE_SINGLE_statistics_translation = await fetch(
    `/api/cache/fixtures/statistics?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  // NOTE:IMPORTANT: can be null -load from hasura
  let response_content: REDIS_CACHE_SINGLE_content_data[] = await fetch(
    `/api/cache/fixtures/content?fixture_id=` + fixture_id + `&lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  if (response_content == undefined) {
    if (dev) console.debug("Non current_season fixture - loading from Hasura Directly")
    response_content = await fetch(
      `/api/hasura/fixtures/content?fixture_id=` + fixture_id + `&lang=` + urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());
  }

  const response_content_translation: REDIS_CACHE_SINGLE_content_translation = await fetch(
    `/api/cache/fixtures/content?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  // NOTE:IMPORTANT: can be null -load from hasura
  let response_about: REDIS_CACHE_SINGLE_about_data = await fetch(
    `/api/cache/fixtures/about?fixture_id=` + fixture_id + `&lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  if (response_about == undefined) {
    if (dev) console.debug("Non current_season fixture - loading from Hasura Directly")
    response_about = await fetch(
      `/api/hasura/fixtures/about?fixture_id=` + fixture_id + `&lang=` + urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());
  }

  const response_about_translation: REDIS_CACHE_SINGLE_about_translation = await fetch(
    `/api/cache/fixtures/about?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  const response_votes_translation: REDIS_CACHE_SINGLE_votes_translation = await fetch(
    `/api/cache/fixtures/votes?lang=` + urlLang, 
    {
      method: 'GET'
    }
  ).then((r) => r.json());

  /** 
   * ==========
   * [ℹ] RETURN
   * ==========
  */

  if (
    response_fixtures_seo
    && response_fixtures_page_info
    && response_scoreboard
    && response_scoreboard_translation
    && response_lineups
    && response_lineups_translation
    && response_incidents
    && response_incidents_translation
    && response_featured_betting_sites_translation
    && response_statistics
    && response_statistics_translation
    && response_content
    && response_content_translation
    // && response_about // IMPORTANT can be "NULL"
    && response_about_translation
    && response_votes_translation
  ) {
    return {
      PAGE_SEO: response_fixtures_seo,
      FIXTURE_INFO: response_fixtures_page_info,
      FIXTURE_SCOREBOARD: response_scoreboard,
      FIXTURE_SCOREBOARD_TRANSLATION: response_scoreboard_translation,
      FIXTURE_LINEUPS: response_lineups,
      FIXTURE_LINEUPS_TRANSLATION: response_lineups_translation,
      FIXTURE_INCIDENTS: response_incidents,
      FXITURE_INCIDENTS_TRANSLATION: response_incidents_translation,
      FEATURED_BETTING_SITES_WIDGET_DATA_SEO: response_featured_betting_sites_translation,
      FIXTURE_STATISTICS: response_statistics,
      FIXTURE_STATISTICS_TRANSLATION: response_statistics_translation,
      FIXTURE_CONTENT: response_content,
      FIXTURE_CONTENT_TRANSLATION: response_content_translation,
      FIXTURE_ABOUT: response_about,
      FIXTURE_ABOUT_TRANSLATION: response_about_translation,
      FIXTURE_VOTES_TRANSLATION: response_votes_translation
    }
  }

  throw error(500, `Uh-oh! There has been an /{fixture} page preloading error`);
}