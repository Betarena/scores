import {
  error
} from '@sveltejs/kit';
import {
  dev
} from '$app/env';
import type {
  PageLoad
} from './$types';

import type {
  Cache_Single_Tournaments_SEO_Translation_Response,
  Cache_Single_Tournaments_Data_Page_Translation_Response
} from '$lib/models/pages_and_seo/types';
import type {
  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response,
  REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response
} from '$lib/models/tournaments/fixtures_odds/types';
import type {
  Cache_Single_Tournaments_League_Info_Data_Response
} from '$lib/models/tournaments/league-info/types';
import type {
  Cache_Single_Tournaments_League_Standings_Translation_Data_Response,
  Cache_Single_Tournaments_League_Standings_Info_Data_Response
} from '$lib/models/tournaments/standings/types';
import type {
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response,
  REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response
} from '$lib/models/tournaments/top_players/types';

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
    sport,
    country,
    league_name
  } = params

  console.log(params)

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
   * [ℹ] Loading of (this) page [tournaments] SEO-READY data; 
   */

  const response_tournaments_seo: Cache_Single_Tournaments_SEO_Translation_Response = await fetch(`/api/cache/pages_and_seo?lang=` + urlLang + "&page=tournaments", {
    method: 'GET'
  }).then((r) => r.json());

  const response_tournaments_page_info: Cache_Single_Tournaments_Data_Page_Translation_Response = await fetch(`/api/cache/pages_and_seo?url=` + url.pathname + "&page=tournaments", {
    method: 'GET'
  }).then((r) => r.json());

  /**
   * [ℹ] regex-ing SEO content dynamically;
   */

  response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{lang}/g, lang));
  response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{sport}/g, sport));
  response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{country}/g, country));
  response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{name}/g, league_name));

  response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{lang}/g, lang));
  response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{sport}/g, sport));
  response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{country}/g, country));
  response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{name}/g, league_name));

  response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{lang}/g, lang));
  response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{sport}/g, sport));
  response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{country}/g, country));
  response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{name}/g, league_name));

  // [ℹ] canonical exclusive - [EN];
  const enItemAlt = response_tournaments_page_info.alternate_data.find(({
    lang
  }) => lang === 'en');
  response_tournaments_seo.main_data.canonical = `https://scores.betarena.com/${enItemAlt.sport.toLowerCase()}/${enItemAlt.country.toLowerCase()}/${enItemAlt.name.replace(/\s/g,'-').toLowerCase()}`

  /**
   * [ℹ] widgets data gather cache fetch 
   */

  const response_league_info: Cache_Single_Tournaments_League_Info_Data_Response = await fetch(`/api/cache/tournaments_league_info?url=` + url.pathname, {
    method: 'GET'
  }).then((r) => r.json());

  const league_id = response_tournaments_page_info.data.tournament_id;

  const response_standings_translations: Cache_Single_Tournaments_League_Standings_Translation_Data_Response = await fetch(`/api/cache/tournaments_standings?lang=` + urlLang, {
    method: 'GET'
  }).then((r) => r.json());

  // [ℹ] standings-widget cache data is dependent on the LEAGUE-ID;
  const response_standings_data: Cache_Single_Tournaments_League_Standings_Info_Data_Response = await fetch(`/api/cache/tournaments_standings?league_id=` + league_id, {
    method: 'GET'
  }).then((r) => r.json());

  const response_top_players_translations: REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response = await fetch(`/api/cache/tournaments_top_players?lang=` + urlLang, {
    method: 'GET'
  }).then((r) => r.json());

  // [ℹ] top-players-widget cache data is dependent on the LEAGUE-ID;
  const response_top_players_data: REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response = await fetch(`/api/cache/tournaments_top_players?league_id=` + league_id, {
    method: 'GET'
  }).then((r) => r.json());

  // [ℹ] fixtures_odds
  const response_fixtures_odds_translations: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response = await fetch(`/api/cache/tournaments_fixtures_odds?lang=` + urlLang, {
    method: 'GET'
  }).then((r) => r.json());

  // [ℹ] fixtures-odds-widget cache data is dependent on the LEAGUE-ID;
  const response_fixtures_odds_data: REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response = await fetch(`/api/cache/tournaments_fixtures_odds?league_id=` + league_id, {
    method: 'GET'
  }).then((r) => r.json());

  /** 
   * ==========
   * [ℹ] RETURN
   * ==========
   */

  // [ℹ] page -> response data chceck
  if (
    response_tournaments_seo &&
    response_tournaments_page_info &&
    // [ℹ] league_info
    response_league_info &&
    // [ℹ] standings
    response_standings_translations &&
    response_standings_data &&
    // [ℹ] top_players
    response_top_players_translations &&
    response_top_players_data &&
    // [ℹ] fixtures_odds
    response_fixtures_odds_translations &&
    response_fixtures_odds_data
  ) {
    return {

      PAGE_DATA_SEO: response_tournaments_seo,
      TOURNAMENT_DATA_TRANSLATED_COPIES: response_tournaments_page_info.alternate_data,
      TOURNAMENT_DATA: response_tournaments_page_info.data,
      LEAGUE_INFO_DATA: response_league_info,
      STANDINGS_T: response_standings_translations,
      STANDINGS_DATA: response_standings_data,
      TOP_PLAYERS_T: response_top_players_translations,
      TOP_PLAYERS_DATA: response_top_players_data,
      FIXTURES_ODDS_T: response_fixtures_odds_translations,
      FIXTURES_ODDS_DATA: response_fixtures_odds_data

    }
  }

  throw error(500, `Uh-oh! There has been an /{tournaments} page preloading error`);
}