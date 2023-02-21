import { gql } from 'graphql-request';

/**
 * [ℹ] GET current seasons
 */
export const REDIS_CACHE_FIXTURE_ABOUT_DATA_0 = gql`
	query REDIS_CACHE_FIXTURE_ABOUT_DATA_0
	@cached(ttl: 300) {
		scores_football_seasons_details(
			where: { is_current_season: { _eq: true } }
		) {
			id
		}
	}
`;

/**
 * [ℹ] Fixtures / About Widget (MAIN)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Pagination Required (but not entirely necessary?)
 * [ℹ] _0 dependent
 */
export const REDIS_CACHE_FIXTURE_ABOUT_DATA_1 = gql`
	query REDIS_CACHE_FIXTURE_ABOUT_DATA_1(
		$limit: Int
		$offset: Int
		$seasonIds: [Int!]
	) @cached(ttl: 300) {
		# [ℹ] pagination based
		historic_fixtures_aggregate(
			where: { season_id: { _in: $seasonIds } }
		) {
			aggregate {
				totalCount: count
			}
		}

		historic_fixtures(
			order_by: { fixture_day: asc, id: asc }
			limit: $limit
			offset: $offset
			where: { season_id: { _in: $seasonIds } }
		) {
			id
			league_id
			season_id
			seo_fixtures
			seo_fixtures_pt
			seo_fixtures_br
			seo_fixtures_es
			seo_fixtures_ro
			seo_fixtures_se
		}
	}
`;

/**
 * [ℹ] Fixtures / About Widget (#2)
 * [ℹ] TRANSLATION
 */
export const REDIS_CACHE_FIXTURE_ABOUT_DATA_2 = gql`
	query REDIS_CACHE_FIXTURE_ABOUT_DATA_2
	@cached(ttl: 300) {
		# [ℹ] unecessary to paginate
		scores_general_translations {
			lang
			widgets_no_data_available
		}
		scores_fixture_about_translations {
			lang
			translations
		}
	}
`;

/**
 * ====================
 * [ℹ] Surgical Queries
 * [ℹ] HASURA DIRECT
 * ====================
 */

/**
 * [ℹ] GET Target Fixture - About
 */
export const REDIS_CACHE_FIXTURE_ABOUT_DATA_3 = gql`
	query REDIS_CACHE_FIXTURE_ABOUT_DATA_3(
		$fixture_id: Int!
	) @cached(ttl: 300) {
		historic_fixtures(
			where: { id: { _eq: $fixture_id } }
		) {
			id
			league_id
			season_id
			seo_fixtures
			seo_fixtures_pt
			seo_fixtures_br
			seo_fixtures_es
			seo_fixtures_ro
			seo_fixtures_se
			seo_fixtures_it
		}
	}
`;
