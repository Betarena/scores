import { gql } from 'graphql-request';

/**
 * [ℹ] Surgical #1 (MAIN)
 * [ℹ] standings query
 */
export const REDIS_CACHE_LEAGUES_TABLE_DATA_1 = gql`
	query REDIS_CACHE_LEAGUES_TABLE_DATA_1
	@cached(ttl: 300) {
		leagues_filtered_country {
			lang
			leagues
		}
		scores_standings_home_widget_translations {
			games
			lang
			points
			title
		}
		color_codes_league_standings_positions {
			color_codes
			sports
		}
	}
`;

/**
 * [ℹ] Surgical #2 (ALL)
 * [ℹ] standings query
 * [ℹ] Based on League ID
 */
export const REDIS_CACHE_LEAGUES_TABLE_DATA_2 = gql`
	query REDIS_CACHE_LEAGUES_TABLE_DATA_2(
		$leagueIds: [numeric!]
	) @cached(ttl: 300) {
		scores_football_leagues(
			where: { id: { _in: $leagueIds } }
		) {
			# [ℹ] BY LEAGUE ID
			country
			data
			name
			id
			season
			seasons
		}
		scores_football_standings(
			where: { id: { _in: $leagueIds } }
		) {
			# [ℹ] BY LEAGUE ID
			data
			id
			name
			type
		}
	}
`;

/**
 * [ℹ] Surgical #1 (MAIN)
 * [ℹ] standings query
 * [ℹ] Based on Team ID
 */
export const REDIS_CACHE_LEAGUES_TABLE_DATA_3 = gql`
	query REDIS_CACHE_LEAGUES_TABLE_DATA_3(
		$teamIds: [numeric!]
	) @cached(ttl: 300) {
		scores_football_teams(
			where: { id: { _in: $teamIds } }
		) {
			# [ℹ] BY TEAM ID
			data
			id
			name
		}
	}
`;
