import type { 
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_scores_fixture_probabilities_translations,
  BETARENA_HASURA_scores_general_translations, 
  FixtureProbabilitiesDataTranslation, 
  Probabilities,
  WidgetsNoDataAvailable
} from "$lib/models/hasura";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_probabilities_translation extends FixtureProbabilitiesDataTranslation, WidgetsNoDataAvailable {
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

export interface BETARENA_HASURA_probabilities_query {
  historic_fixtures?:            BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[];
  // NOTE: translations
  scores_general_translations?:  BETARENA_HASURA_scores_general_translations[]
  scores_fixture_probabilities_translations?: BETARENA_HASURA_scores_fixture_probabilities_translations[]
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Fixture_Probabilities {
  id?:    number | null
  time?:  string
  probabilites?: Probabilities | null
  odds?:  Fixture_Probabilities_Odds | null
} export interface Fixture_Probabilities_Odds {
  _1x2?: {
    home?: number | string
    draw?: number | string
    away?: number | string
  }
  btts?: number | string
  over_2_5?: number | string
}