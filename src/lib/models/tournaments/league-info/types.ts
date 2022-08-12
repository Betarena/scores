import type { 
  BETARENA_HASURA_scores_football_leagues, 
  BETARENA_HASURA_scores_football_seasons_details,
  BETARENA_HASURA_scores_tournaments,
  BETARENA_HASURA_scores_widget_league_info_translations, 
  BETARENA_HASURA_sportsbook_details, 
  SeasonElement,
  Sportbook 
} from "$lib/models/hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface Cache_Single_Tournaments_League_Info_SEO_Translation_Response {
  lang: string
  country: string
  name: string
}

export interface Cache_Single_Tournaments_League_Info_Data_Response {
  url: string
  lang: string
  data: League_Info
}

export interface Cache_Single_SportbookDetails_Data_Response extends Sportbook {
  geoPos: string
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_league_info_query {
  scores_tournaments_dev:                       BETARENA_HASURA_scores_tournaments[]
  scores_football_seasons_details_dev:          BETARENA_HASURA_scores_football_seasons_details[]
  scores_football_leagues_dev:                  BETARENA_HASURA_scores_football_leagues[]
  sportsbook_details_dev:                       BETARENA_HASURA_sportsbook_details[]
  scores_widget_league_info_translations_dev:   BETARENA_HASURA_scores_widget_league_info_translations[]
}

/**
 * =================================
 * TOURNAMENTS PAGE DATA [INTERFACES]
 * =================================
*/

export interface League_Info {
  name: string                      // name =               endpoint: scores_football_leagues          | column: "name"
  country: string                   // country =            endpoint: scores_football_leagues          | column: "country" (Replace by the correct translation using the general translation endpoint: "scores_general_translations"
  image_path: string                // image_path =         endpoint: scores_football_leagues          | column: "data"
  // betting_site_logo?: string     // betting_site_logo =  endpoint: sportsbook_details               | column: "data" (link with no-follow)
  // beting_cta_link?: string       // beting_cta_link =    endpoint: sportsbook_details               | column: "data" (link with no-follow)
  country_logo?: string             // country_logo =       endpoint: scores_football_leagues          | column: "country" (image_path)
  // [🢃] many
  seasons: SeasonDataLeagueInfo[]
  translation: League_Info_Translations
  sportbook_detail?: Cache_Single_SportbookDetails_Data_Response
} export interface League_Info_Translations {
  stats?:     string;
  teams?:     string;
  content?:   string;
  overview?:  string;
  following?: string;
} export interface SeasonDataLeagueInfo extends SeasonElement {
  // default extend [?]            // seasons =            endpoint: scores_football_leagues         | column: "seasons"
  number_of_clubs: number | string // number_of_clubs =    endpoint: scores_football_seasons_details | column: "data_stats"
  start_date: Date                 // start_date =         endpoint: scores_football_seasons_details | column: "start_date"
  end_date: Date                   // end_date =           endpoint: scores_football_seasons_details | column: "end_date"
}