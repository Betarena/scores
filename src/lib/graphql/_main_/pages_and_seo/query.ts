import { gql } from 'graphql-request';

/**
 * [ℹ] Complete Page & Seo Query
 * [ℹ] Caching & Sitemap generation
 */
export const REDIS_CACHE_PAGES_AND_SEO = gql`
	query REDIS_CACHE_PAGES_AND_SEO
	@cached(ttl: 300) {
		scores_hreflang {
			hreflang
			link
		}
		scores_seo_homepage {
			lang
			main_data
			twitter_card
			opengraph
		}
		scores_seo_tournaments {
			lang
			main_data
			opengraph
			twitter_card
		}
		scores_seo_fixtures {
			lang
			main_data
			opengraph
			sports_type
			twitter_card
		}
		scores_endpoints_translations {
			countries_translation
			lang
			sport
			sports_translation
		}
		scores_football_countries {
			id
			name
		}
		scores_tournaments {
			author
			country
			date
			id
			tournament_id
			lang
			modified_date
			name
			sport
			status
			title
			type
			widgets
			urls
		}
		historic_fixtures(
			# limit: 50,
			# FIXME: too large of a query for 300k - 2M records
			# FIXME: needs a WHERE clause with "publish_status" for now
			# FIXME: update to include "pagination" + loop one iteration && cache-stream
			# FIXME: of data straight to cache
			where: {
				publish_status: { _eq: "published" }
			}
		) {
			id
			urls
			publish_status
			away_team_name
			home_team_name
			league_name
			fixture_day
			league_id
			venue_name_j: data(
				path: "$.venue.data.name"
			)
			venue_city_j: data(
				path: "$.venue.data.city"
			)
			country_id_j: data(
				path: "$.league.data.country_id"
			)
		}
	}
`;

/**
 * [ℹ] Surgical Target Fixture
 * [ℹ] Caching & Sitemap Update
 */
export const REDIS_CACHE_PAGES_AND_SEO_FIXTURE_TARGET = gql`
	query REDIS_CACHE_PAGES_AND_SEO_FIXTURE_TARGET(
		$fixtureId: Int!
	) @cached(ttl: 300) {
		scores_hreflang {
			hreflang
			link
		}
		scores_seo_fixtures {
			lang
			main_data
			opengraph
			sports_type
			twitter_card
		}
		scores_endpoints_translations {
			countries_translation
			lang
			sport
			sports_translation
		}
		scores_football_countries {
			id
			name
		}
		historic_fixtures(
			# limit: 50,
			where: { id: { _eq: $fixtureId } }
		) {
			id
			urls
			publish_status
			away_team_name
			home_team_name
			league_name
			fixture_day
			league_id
			venue_name_j: data(
				path: "$.venue.data.name"
			)
			venue_city_j: data(
				path: "$.venue.data.city"
			)
			country_id_j: data(
				path: "$.league.data.country_id"
			)
		}
	}
`;
