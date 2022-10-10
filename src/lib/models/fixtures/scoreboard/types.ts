import type { 
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_scores_football_leagues, 
  BETARENA_HASURA_scores_football_seasons_details,
  BETARENA_HASURA_scores_general_translations,
  BETARENA_HASURA_scores_tournaments,
  BETARENA_HASURA_scores_widget_league_info_translations, 
  BETARENA_HASURA_scores_widget_tournament_about_translations, 
  BETARENA_HASURA_sportsbook_details, 
  BETARENA_HASURA_widget_league_info_translations, 
  Scores, 
  ScoresFootballLeaguesSeasonElement, 
  Sportbook, 
  WidgetLeagueInfo2Data,
  WidgetsNoDataAvailable,
  WidgetTournamentAboutData
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

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures extends BETARENA_HASURA_historic_fixtures {
  scores_j?:             Scores
}

export interface BETARENA_HASURA_league_info_query {
  scores_tournaments:   BETARENA_HASURA_scores_tournaments[]
  historic_fixtures:    BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
}

/**
 * =================================
 * TOURNAMENTS PAGE DATA [INTERFACES]
 * =================================
*/

export interface Fixture_Info {
  // NOTE: Scoreboard Before the match (fixture_scoreboard);
  name?:   string            // Tournament name (Link) | scores_tournaments/urls
  round?:  string            // historic_fixtures/round_name
  local_team?: string        // historic_fixtures/home_team_name
  local_team_logo?: string   // historic_fixtures/home_team_logo
  away_team?: string         // historic_fixtures/away_team_name
  away_team_logo?: string    // historic_fixtures/away_team_logo
  counter?: string           // (Just available 24 hours before the match)
  date?: string              // historic_fixtures/time
  _1x2?: string              // https://betarena-rv-6b382.firebaseio.com/odds
  _1x2_link?: string         // sportsbook_details/data

  // NOTE: Scoreboard during the match;
  score?: string             // Live Score Now Firebase
  minutes?: string           // Live Score Now Firebase

  // NOTE: Scoreboard after the match;

  score_post?: string        // JSON($path) historic_fixtures/data/scores
  status?: string            // historic_fixtures/status
  post_date?: string         // historic_fixtures/time
}