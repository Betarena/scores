import type {
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_historic_fixtures_aggregate,
  BETARENA_HASURA_scores_football_seasons_details,
  BETARENA_HASURA_scores_general_translations,
  BETARENA_HASURA_scores_incidents_translations,
  EventsDatum,
  IncidentsTranslations,
  Scores,
  WidgetsNoDataAvailable
} from "$lib/models/hasura"
import type { FIXTURE_STATUS_TYPES } from "$lib/models/sportmonks"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_incidents_translation extends IncidentsTranslations, WidgetsNoDataAvailable {
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
  localteam_id_j?:      number
  visitorteam_id_j?:    number
  status_j?:            string
  events_j?:            EventsDatum[]
  scores_j?:            Scores
}

export interface BETARENA_HASURA_incidents_query {
  scores_football_seasons_details: BETARENA_HASURA_scores_football_seasons_details[]
  historic_fixtures_aggregate:     BETARENA_HASURA_historic_fixtures_aggregate
  historic_fixtures:               BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
  // NOTE: translations
  scores_general_translations?:    BETARENA_HASURA_scores_general_translations[]
  scores_incidents_translations:   BETARENA_HASURA_scores_incidents_translations[]
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
*/

export interface Fixture_Incidents extends EventsDatum {
  // NOTE:IMPORTANT The fixture_incident widget is only available once the fixture starts. 
  // NOTE:IMPORTANT If there are fixtures without incidents, the widget should not be shown.

  id?:          number
  status?:      FIXTURE_STATUS_TYPES
  score_post?:  Fixture_Scorebaord_Scores // [hasura] JSON($path) historic_fixtures/data/scores
  home?:        Incident_Team  // home-team events-only
  away?:        Incident_Team  // away-team events-only
  events?:      EventsDatum[]

  // NOTE: DURING the fixture:
  // NOTE: Frebase endpoint
  // livescore_now/events/data

  // NOTE: AFTER the fixture is ended:
  // NOTE: Hasura endpoint Prod:
  // historic_fixtures/events/data
} export interface Incident_Team {
  team_name?:     string
  team_logo?:     string
  team_id?:       number
} export interface Fixture_Scorebaord_Scores {
  ht_score?: string
  ft_score?: string
  et_score?: string
  ps_score?: string
}