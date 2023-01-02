import type {
  BETARENA_HASURA_football_h2h,
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_scores_fixtures_h2h_translations,
  BETARENA_HASURA_scores_general_translations,
  FixtureProbabilitiesDataTranslation, WidgetsNoDataAvailable
} from "$lib/models/hasura";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_h2h_translation 
  extends 
    FixtureProbabilitiesDataTranslation, 
    WidgetsNoDataAvailable {
  lang?: string
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures 
extends 
  BETARENA_HASURA_historic_fixtures {
  localteam_id_j?:     number
  visitorteam_id_j?:   number
}

export interface BETARENA_HASURA_head_2_head_query {
  historic_fixtures?:            BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[];
  football_h2h?:                 BETARENA_HASURA_football_h2h[];
  // NOTE: translations
  scores_general_translations?:  BETARENA_HASURA_scores_general_translations[]
  scores_fixtures_h2h_translations?: BETARENA_HASURA_scores_fixtures_h2h_translations[]
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Fixture_Head_2_Head {
  id?:    number | null
  data?:  BETARENA_HASURA_football_h2h
}