import type {
	BETARENA_HASURA_historic_fixtures,
	BETARENA_HASURA_historic_fixtures_aggregate,
	BETARENA_HASURA_scores_fixture_stats_translations,
	BETARENA_HASURA_scores_football_seasons_details,
	BETARENA_HASURA_scores_general_translations,
	FixtureStatsTranslations,
	StatsDatum,
	WidgetsNoDataAvailable
} from '$lib/models/hasura';

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ==========================================
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_statistics_translation
	extends FixtureStatsTranslations,
		WidgetsNoDataAvailable {
	lang?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_statistics_data
	extends Fixture_Statistics {
	// empty
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA
 * ==========================================
 */

export interface BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures
	extends BETARENA_HASURA_historic_fixtures {
	localteam_id_j?: number;
	visitorteam_id_j?: number;
	stats_j?: StatsDatum[];
	status_j?: string;
}

export interface BETARENA_HASURA_statistics_query {
	scores_football_seasons_details: BETARENA_HASURA_scores_football_seasons_details[];
	historic_fixtures_aggregate: BETARENA_HASURA_historic_fixtures_aggregate;
	historic_fixtures: BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[];
	// NOTE: translations
	scores_general_translations?: BETARENA_HASURA_scores_general_translations[];
	scores_fixture_stats_translations: BETARENA_HASURA_scores_fixture_stats_translations[];
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
 */

export interface Fixture_Statistics {
	// NOTE:IMPORTANT The fixture_statistics widget is only available once the fixture starts.
	// NOTE:IMPORTANT If there are fixtures without statistics, the widget should not be shown.

	id?: number;
	status?: string;
	home?: Incident_Team; // [custom] home-team
	away?: Incident_Team; // [custom] away-team
	stats?: StatsDatum[]; // [hasura] stats

	// NOTE: DURING the fixture:
	// NOTE: Frebase endpoint
	// livescore_now/stats/data

	// NOTE: AFTER the fixture is ended:
	// NOTE: Hasura endpoint Prod:
	// historic_fixtures/stats/data
}
export interface Incident_Team {
	team_name?: string;
	team_logo?: string;
	team_id?: number;
}
