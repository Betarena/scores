import type { 
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_historic_fixtures_aggregate,
  BETARENA_HASURA_scores_fixture_scoreboard_translations,
  BETARENA_HASURA_scores_football_leagues,
  BETARENA_HASURA_scores_football_seasons_details,
  BETARENA_HASURA_scores_tournaments,
  DataStats,
  Round,
  ScoreboardTranslations,
  Scores,
  ScoresTournamentsUrls,
  Time
} from "$lib/models/hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_scoreboard_translation extends ScoreboardTranslations {
  lang?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_scoreboard_data extends Fixture_Scoreboard_Info {
  // empty
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures extends BETARENA_HASURA_historic_fixtures {
  stats_j?:            DataStats
  localteam_id_j?:     number
  visitorteam_id_j?:   number
  time_j?:             Time
  round_j?:            Round
  scores_j?:           Scores
}

export interface BETARENA_HASURA_SURGICAL_JSONB_scores_football_leagues extends BETARENA_HASURA_scores_football_leagues {
  image_path_j?:       string
}

export interface BETARENA_HASURA_scoreboard_query {
  scores_football_seasons_details: BETARENA_HASURA_scores_football_seasons_details[]
  scores_tournaments:              BETARENA_HASURA_scores_tournaments[]
  historic_fixtures_aggregate:     BETARENA_HASURA_historic_fixtures_aggregate
  historic_fixtures:               BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
  // NOTE: league-img
  scores_football_leagues:         BETARENA_HASURA_SURGICAL_JSONB_scores_football_leagues[]
  // NOTE: translations
  scores_fixture_scoreboard_translations: BETARENA_HASURA_scores_fixture_scoreboard_translations[]
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

export interface Fixture_Scoreboard_Info {
  id?: number
  teams?: {
    home: Fixture_Scoreboard_Team
    away: Fixture_Scoreboard_Team
  }
  league_logo?: string
  league_urls?: ScoresTournamentsUrls
  // NOTE: Scoreboard Before the match (fixture_scoreboard);
  name?:   string                 // [hasura] Tournament name (Link) | scores_tournaments/urls
  round?:  number                 // [hasura] historic_fixtures/round_name
  home_team_name?: string         // [hasura] historic_fixtures/home_team_name
  home_team_logo?: string         // [hasura] historic_fixtures/home_team_logo
  away_team_name?: string         // [hasura] historic_fixtures/away_team_name
  away_team_logo?: string         // [hasura] historic_fixtures/away_team_logo
  counter?: string                // [] (Just available 24 hours before the match)
  fixture_time?: string           // [hasura] historic_fixtures/time
  _1x2?: Fixture_Scorebaord_Odds  // [firebase] https://betarena-rv-6b382.firebaseio.com/odds
  _1x2_link?: string              // [sportbook-cache] sportsbook_details/data
  // NOTE: Scoreboard during the match;
  score?: string                  // [firebase] Live Score Now Firebase
  minute?: number                 // [firebase] Live Score Now Firebase
  // NOTE: Scoreboard after the match;
  score_post?: Fixture_Scorebaord_Scores // [hasura] JSON($path) historic_fixtures/data/scores
  status?: string                 // [hasura] historic_fixtures/status
  post_date?: string              // [hasura] historic_fixtures/time
} export interface Fixture_Scoreboard_Team {
  name?: string
  score?: number
} export interface Fixture_Scorebaord_Odds {
  home?: number
  draw?: number
  away?: number
} export interface Fixture_Scorebaord_Scores {
  ht_score?: string
  et_score?: string
  ps_score?: string
}