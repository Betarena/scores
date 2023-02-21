import type {
	BETARENA_HASURA_historic_fixtures,
	BETARENA_HASURA_historic_fixtures_aggregate,
	BETARENA_HASURA_scores_fixture_about_translations,
	BETARENA_HASURA_scores_football_seasons_details,
	BETARENA_HASURA_scores_general_translations,
	FixtureAboutTranslations,
	WidgetsNoDataAvailable
} from '$lib/models/hasura';

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ==========================================
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_about_translation
	extends FixtureAboutTranslations,
		WidgetsNoDataAvailable {
	lang?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_about_data
	extends Fixture_About {
	// empty
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA
 * ==========================================
 */

export interface BETARENA_HASURA_about_query {
	scores_football_seasons_details: BETARENA_HASURA_scores_football_seasons_details[];
	historic_fixtures_aggregate: BETARENA_HASURA_historic_fixtures_aggregate;
	historic_fixtures: BETARENA_HASURA_historic_fixtures[];
	// NOTE: translations
	scores_general_translations?: BETARENA_HASURA_scores_general_translations[];
	scores_fixture_about_translations: BETARENA_HASURA_scores_fixture_about_translations[];
}

/**
 * ==========================================
 * SPECIFIC COMPONENT PAGE DATA [INTERFACES]
 * ==========================================
 */

export interface Fixture_About
	extends BETARENA_HASURA_historic_fixtures {
	// empty
	seo_data?: string;
}
