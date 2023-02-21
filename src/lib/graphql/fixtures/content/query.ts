import { gql } from 'graphql-request';

/**
 * [ℹ] GET current seasons
 */
export const REDIS_CACHE_FIXTURE_CONTENT_DATA_0 = gql`
	query REDIS_CACHE_FIXTURE_CONTENT_DATA_0
	@cached(ttl: 300) {
		scores_football_seasons_details(
			where: { is_current_season: { _eq: true } }
		) {
			id
		}
	}
`;

/**
 * [ℹ] Fixtures / Content Widget (MAIN)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Pagination Required (but not necessary?)
 * [ℹ] _0 dependent
 */
export const REDIS_CACHE_FIXTURE_CONTENT_DATA_1 = gql`
	query REDIS_CACHE_FIXTURE_CONTENT_DATA_1(
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
		}
	}
`;

/**
 * [ℹ] Fixtures / Content Widget (#2)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Pagination Required (but not necessary?)
 * [ℹ] _1 dependent
 */
export const REDIS_CACHE_FIXTURE_CONTENT_DATA_2 = gql`
	query REDIS_CACHE_FIXTURE_CONTENT_DATA_2(
		$limit: Int
		$offset: Int
		$gameIds: [Int!]
	) @cached(ttl: 300) {
		# [ℹ] pagination based
		external_content_aggregate(
			where: { gameid: { _in: $gameIds } }
		) {
			aggregate {
				totalCount: count
			}
		}

		external_content(
			order_by: { date: desc, id: desc }
			limit: $limit
			offset: $offset
			where: { gameid: { _in: $gameIds } }
		) {
			id
			source
			title
			lang
			link
			featured_media
			excerpt
			author
			date
			gameid
			category
		}
	}
`;

/**
 * [ℹ] Fixtures / Content Widget (#4)
 * [ℹ] TRANSLATION
 */
export const REDIS_CACHE_FIXTURE_CONTENT_DATA_4 = gql`
	query REDIS_CACHE_FIXTURE_CONTENT_DATA_4
	@cached(ttl: 300) {
		# [ℹ] unecessary to paginate
		scores_general_translations {
			lang
			countries
			widgets_no_data_available
			weekdays
			months
		}
		scores_fixtures_content_translations {
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
 * [ℹ] GET Target Fixture - Content
 */
export const REDIS_CACHE_FIXTURE_CONTENT_DATA_3 = gql`
	query REDIS_CACHE_FIXTURE_CONTENT_DATA_3(
		$gameId: Int!
		$lang: String
	) @cached(ttl: 300) {
		external_content(
			order_by: { date: desc }
			where: {
				gameid: { _eq: $gameId }
				lang: { _eq: $lang }
			}
		) {
			id
			source
			title
			lang
			link
			featured_media
			excerpt
			author
			date
			gameid
			category
		}
	}
`;
