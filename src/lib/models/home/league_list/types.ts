import type { 
  BETARENA_HASURA_leagues_filtered_country, 
  BETARENA_HASURA_scores_general_translations, 
  BETARENA_HASURA_scores_leagues_list_translations, 
  BETARENA_HASURA_scores_league_list, 
  BETARENA_HASURA_scores_tournaments,
  ScoresTournamentsUrls
} from "../hasura"

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_league_list_query {
  scores_league_list:                   BETARENA_HASURA_scores_league_list[]
  leagues_filtered_country:             BETARENA_HASURA_leagues_filtered_country[]
  scores_leagues_list_translations: BETARENA_HASURA_scores_leagues_list_translations[]
  scores_tournaments:               BETARENA_HASURA_scores_tournaments[]
  scores_general_translations:      BETARENA_HASURA_scores_general_translations[]
}

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface REDIS_CACHE_SINGLE_league_list_geo_data_response {
  // [GEO]
  geo: string
  // [ℹ] TOP 7 leagues for [THIS GEO]
  top_geo_leagues: {
    country_id:     number
    country_name:   string
    image_path:     string
    league_id:      number
    league_name:    string
    logo_path:      string
    type:           string
    urls?:          ScoresTournamentsUrls
  }[]
  // [ℹ] ALL LEAGUES
  all_leagues_list: {
    country_id:     number
    country_name:   string
    image_path:     string
    league_id:      number
    league_name:    string
    logo_path:      string
    type:           string
    urls?:          ScoresTournamentsUrls
  }[]
}

export interface REDIS_CACHE_SINGLE_league_list_seo_t_response {
  lang: string
  translations?: {
    search_form?:           string
    top_leagues?:           string
    leagues_by_country?:    string
    widget_title?:          string
    competitions_results?:  string
    countries_results?:     string
    full_list?:             string
    no_results?:            string
    hide?:                  string
  }
  all_leagues_list: {
    country_id:               number
    country_name:             string
    image_path:               string
    league_id:                number
    league_name:              string
    logo_path:                string
    type:                     string
  }[]
  unique_county_list: {
    country_id:               number
    country_name:             string
    image_path:               string
  }[]
}