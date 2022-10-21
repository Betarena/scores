import type { 
  BenchDatum,
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_historic_fixtures_aggregate,
  BETARENA_HASURA_player_positions_translations,
  BETARENA_HASURA_scores_fixture_lineup_translations,
  BETARENA_HASURA_scores_football_leagues,
  BETARENA_HASURA_scores_football_seasons_details,
  BETARENA_HASURA_scores_general_translations,
  BETARENA_HASURA_scores_tournaments,
  DataStats,
  Events,
  EventsDatum,
  Formations,
  HistFixturesTeamsRating,
  HistFixtures_Substitue,
  LocalCoachData,
  Round,
  ScoreboardTranslations,
  Scores,
  Time
} from "$lib/models/hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_lineups_translation extends ScoreboardTranslations {
  lang?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_lineups_data extends Fixture_Lineups {
  // empty
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures extends BETARENA_HASURA_historic_fixtures {
  localteam_id_j?:     number
  visitorteam_id_j?:   number
  lineup_j?:           BenchDatum[]
  formations_j?:       Formations
  substitutions_j?:    HistFixtures_Substitue[]
  home_coach_j?:       LocalCoachData
  away_coach_j?:       LocalCoachData
  events_j?:           EventsDatum[]
}

export interface BETARENA_HASURA_lineups_query {
  scores_football_seasons_details?: BETARENA_HASURA_scores_football_seasons_details[]
  historic_fixtures_aggregate?:     BETARENA_HASURA_historic_fixtures_aggregate
  historic_fixtures?:               BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
  // NOTE: translations
  player_positions_translations?:   BETARENA_HASURA_player_positions_translations[]
  scores_general_translations?:     BETARENA_HASURA_scores_general_translations[]
  scores_fixture_lineup_translations?: BETARENA_HASURA_scores_fixture_lineup_translations[]
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

export interface Fixture_Lineups {

  // NOTE: Starting Lineups Before Match (fixture_lineups):
  home?: Team_Lineup
  away?: Team_Lineup

  // NOTE: Starting Lineups During the Match:
  // NOTE: LIVE DATA FROM FIREBASE
  // NOTE: Only this data is in Real Time, on every event the data needs to be compared 
  // NOTE: with the existing one and added the correspondent symbols.
  // NOTE: Endpoint: livescore_now

  events?: EventsDatum[]
  team_ratings?: HistFixturesTeamsRating

  // NOTE: Starting Lineups After the Match:
  sub_icon?: string          // Sub icon (minute of the sub) : historic_fixtures/events
  injured_icon?: string      // Injured icon : historic_fixtures/events/injured
  yellow_card_icon?: string  // Yellow card icon (number indication when more than one) : historic_fixtures/lineup/stats/cards
  red_card_icon?: string     // Red card icon : historic_fixtures/lineup/stats/cards
  goal_icon?: string         // Goal icon (number indication when more than one) : historic_fixtures/lineup/stats/goals

} export interface Team_Lineup {
  team_name?:     string
  team_logo?:     string
  coach_name?:    string
  lineup?:        Fixture_Player[] // historic_fixtures/lineup*
  formation?:     Formations
  substitutions?: Sub_Player[]
} export interface Fixture_Player extends BenchDatum {
  player_avatar?:  string   // scores_football_players/data/image_path
} export interface Sub_Player extends HistFixtures_Substitue {
  player_avatar?:  string   // scores_football_players/data/image_path
}