import type { 
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_scores_fixture_voting_translations, 
  BETARENA_HASURA_scores_general_translations, 
  BETARENA_HASURA_widget_featured_match_votes,
  FixtureVotesTranslations,
  WidgetsNoDataAvailable
} from "$lib/models/hasura";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_votes_translation extends FixtureVotesTranslations, WidgetsNoDataAvailable {
  lang?: string
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures extends BETARENA_HASURA_historic_fixtures {
  status_j?: string
}

export interface BETARENA_HASURA_votes_query {
  historic_fixtures?:            BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[];
  widget_featured_match_votes?:  BETARENA_HASURA_widget_featured_match_votes[]
  // NOTE: translations
  scores_general_translations?:  BETARENA_HASURA_scores_general_translations[]
  scores_fixture_voting_translations?: BETARENA_HASURA_scores_fixture_voting_translations[]
}

export interface BETARENA_HASURA_votes_mutation {
  update_widget_featured_match_votes_by_pk: BETARENA_HASURA_widget_featured_match_votes;
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

export interface Fixture_Votes {
  time?:           string
  home_team_logo?: string
  away_team_logo?: string
  match_votes?:    BETARENA_HASURA_widget_featured_match_votes
  _1x2?:           Fixture_Votes_Odds
  probabilities?:  Fixture_Votes_Odds
} export interface Fixture_Votes_Odds {
  home?: number | string
  draw?: number | string
  away?: number | string
}