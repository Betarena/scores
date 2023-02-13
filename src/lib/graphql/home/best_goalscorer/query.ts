// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the TRANSLATIONS from the DB
 * for the website-platform
 */
export const GET_BEST_GOALSCORERS_DATA = gql`
	query GET_BEST_GOALSCORERS_DATA
	@cached(ttl: 300) {
		scores_best_goalscorers {
			common_name
			goals
			image_path
			league_id
			logo_path
			position
		}
		scores_best_goalscorers_translations {
			lang
			translations
		}
		player_positions_translations {
			lang
			position
		}
		leagues_filtered_country {
			lang
			leagues
		}
	}
`;
