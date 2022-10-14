import type { 
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_scores_endpoints_translations,
  BETARENA_HASURA_scores_football_countries,
  BETARENA_HASURA_scores_hreflang, 
  BETARENA_HASURA_scores_seo_fixtures, 
  BETARENA_HASURA_scores_seo_homepage, 
  BETARENA_HASURA_scores_seo_tournaments, 
  BETARENA_HASURA_scores_tournaments, 
  Urls
} from "../../hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface Cache_Single_Homepage_SEO_Translation_Response extends BETARENA_HASURA_scores_seo_homepage {
  lang:         string
  hreflang:     BETARENA_HASURA_scores_hreflang[]
} 

export interface Cache_Single_Tournaments_SEO_Translation_Response extends BETARENA_HASURA_scores_seo_tournaments {
  lang:         string
  hreflang:     BETARENA_HASURA_scores_hreflang[]
}

export interface Cache_Single_Tournaments_Data_Page_Translation_Response {
  url:            string
  lang:           string
  data:           BETARENA_HASURA_scores_tournaments
  alternate_data: BETARENA_HASURA_scores_tournaments[]
}

export interface REDIS_CACHE_SINGLE_fixtures_seo_response extends BETARENA_HASURA_scores_seo_fixtures {
  lang?:         string
  hreflang?:     BETARENA_HASURA_scores_hreflang[]
}

export interface REDIS_CACHE_SINGLE_fixtures_page_info_response {
  url?:            string
  lang?:           string
  data?:           Fixtures_Page_Data
  alternate_data?: Urls
} export interface Fixtures_Page_Data {
  sport?:           string    // (breadcrumbs & URL)
  country?:         string    // (breadcrumbs) = "league": { "data": { "country_id": 6783} = scores_football_countries = scores_general_translations = countries 
  league_name?:     string    // (breadcrumbs)
  // status?: string          // (Definition if the fixture is visible or not)
  // sport: string            // historic_fixtures / sport
  widgets?:         string[]  // (The widgets that will be loaded on this fixtures section) = scores_widgets_list
  home_team_name?:  string    // historic_fixtures / home_team_name
  away_team_name?:  string    // historic_fixtures / away_team_name
  id?:              number    // historic_fixtures / id
  fixture_day?:     string    // historic_fixtures / fixture_day
  venue_name?:      string    // historic_fixtures / "venue": {"data": { "name": "Stadiumi Liri Ballabani"}
  venue_city?:      string    // = historic_fixtures / "venue": {"data": { "city": "Burreli"}
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures extends BETARENA_HASURA_historic_fixtures {
  venue_name_j?:     string
  venue_city_j?:     string
  country_id_j?:     number
}

export interface BETARENA_HASURA_QUERY_pages_and_seo {
  scores_hreflang:            BETARENA_HASURA_scores_hreflang[]
  scores_seo_homepage:        BETARENA_HASURA_scores_seo_homepage[]
  scores_seo_tournaments:     BETARENA_HASURA_scores_seo_tournaments[]
  scores_tournaments:         BETARENA_HASURA_scores_tournaments[]
  historic_fixtures:          BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
  scores_endpoints_translations: BETARENA_HASURA_scores_endpoints_translations[]
  scores_football_countries:  BETARENA_HASURA_scores_football_countries[]
  scores_seo_fixtures:        BETARENA_HASURA_scores_seo_fixtures[]
}