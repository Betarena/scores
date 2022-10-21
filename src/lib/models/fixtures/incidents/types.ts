import type { 
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_historic_fixtures_aggregate,
  BETARENA_HASURA_player_positions_translations,
  BETARENA_HASURA_scores_fixture_lineup_translations,
  BETARENA_HASURA_scores_football_leagues,
  BETARENA_HASURA_scores_football_seasons_details,
  BETARENA_HASURA_scores_general_translations,
  BETARENA_HASURA_scores_incidents_translations,
  BETARENA_HASURA_scores_tournaments,
  DataStats,
  Events,
  Formations,
  IncidentsTranslations,
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
export interface REDIS_CACHE_SINGLE_incidents_translation extends IncidentsTranslations {
  lang?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_incidents_data extends Fixture_Incidents {
  // empty
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures extends BETARENA_HASURA_historic_fixtures {
  events_j?:            Events
}

export interface BETARENA_HASURA_scoreboard_query {
  scores_football_seasons_details: BETARENA_HASURA_scores_football_seasons_details[]
  scores_tournaments:              BETARENA_HASURA_scores_tournaments[]
  historic_fixtures_aggregate:     BETARENA_HASURA_historic_fixtures_aggregate
  historic_fixtures:               BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
  // NOTE: league-img
  scores_football_leagues:         BETARENA_HASURA_scores_football_leagues[]
  // NOTE: translations
  scores_incidents_translations:   BETARENA_HASURA_scores_incidents_translations[]
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

export interface Fixture_Incidents {

  // NOTE:IMPORTANT The fixture_incident widget is only available once the fixture starts. 
  // NOTE:IMPORTANT If there are fixtures without incidents, the widget should not be shown.

  // NOTE: There are different icons that illustrate different incidents in the fixture:
  icon?: string
  time?: string
  score?: string
  // NOTE: goal = A goal has been scored (Icon, time, score, player name, assist player name);
  player_name_assist?: string
  // NOTE: penalty = Penalty has been scored (Icon, time, score, player name );
  // NOTE: missed_penalty = The penalty has been missed (Icon, time, player name );
  pen_type?: 'pen_score' | 'pen_miss'
  // NOTE: own-goal = Own goal (Icon, time, score, player name);
  player_name?: string
  // NOTE: Goal Disallowed (Icon, time, score);
  // NOTE: Goal under review;
  type?: 'Goal Disallowed' | 'Goal Under Review'
  // NOTE: yellowcard = Yellow card is given to a player (Icon, time, player name);
  // NOTE: yellowred = Second yellow card for player resulting in a red (Icon, time, player name);
  // NOTE: redcard = Direct red card (Icon, time, player name);
  cart_type?: 'red' | 'yellow'
  // NOTE: substitution = A player got substituted, and the new player got in (Icon*, time, player name in, player name out);
  player_name_in?: string
  player_name_out?: string
  // NOTE: pen_shootout_goal = Penalty in penalty shootout has been scored (Icon, time, score, player name);
  // NOTE: pen_shootout_miss = Penalty in penalty shootout has been scored (Icon, time, score, player name);
  pen_shootout_type?: 'pen_shootout_score' | 'pen_shootout_miss'

  // NOTE: AFTER the fixture is ended:
  // NOTE: Hasura endpoint Prod:
  // historic_fixtures/events/data

  // NOTE: DURING the fixture:
  // NOTE: Frebase endpoint
  // livescore_now/events/data
}