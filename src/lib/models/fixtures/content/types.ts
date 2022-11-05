import type { 
  BETARENA_HASURA_external_content,
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_historic_fixtures_aggregate,
  BETARENA_HASURA_scores_fixture_stats_translations,
  BETARENA_HASURA_scores_football_seasons_details,
  BETARENA_HASURA_scores_general_translations,
  FixtureStatsTranslations,
  StatsDatum,
  WidgetsNoDataAvailable
} from "$lib/models/hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_content_data extends Fixture_Content {
  // empty
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_content_query {
  scores_football_seasons_details:  BETARENA_HASURA_scores_football_seasons_details[]
  historic_fixtures_aggregate:      BETARENA_HASURA_historic_fixtures_aggregate
  historic_fixtures:                BETARENA_HASURA_historic_fixtures[]
  external_content_aggregate:       BETARENA_HASURA_historic_fixtures_aggregate
  external_content:                 BETARENA_HASURA_external_content[]
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Fixture_Content extends BETARENA_HASURA_external_content {
  // empty
}