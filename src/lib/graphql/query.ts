// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the TRANSLATIONS from the DB
 * for the website-platform
*/
 export const GET_FOOTER_DATA = gql`
 query GET_FOOTER_DATA @cached(ttl: 300) {
		scores_footer_translations_dev {
			about_us
			betting_tips
			follow
			lang
			latest_news
			privacy
			subscribe_cta
			subscribe_newsletter
			terms
			type_email
		}
		scores_footer_links_dev {
			about_us
			betting_tips
			latest_news
			privacy
			lang
			terms
			social_networks
		}
    scores_hreflang_dev {
      hreflang
      link
    }
	}
`;


/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get the selected GEO-lang based
 * selected fixture from the DB
*/
export const GET_FEATURED_MATCH_TRANSLATION = gql`
	query GET_FEATURED_MATCH_TRANSLATION @cached(ttl: 300) {
		widget_featured_match_translations {
			assists
			bookmaker
			bet
			fair_odds
			goals
			home_win
			lang
			market
			market_name
			market_type
			matches
			odds
			place_bet
			player
			players
			stake
			rating
			probability
			streams
			type
			value_bet
			vote
			winnings
			widget_title
		}
	}
`;

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get the selected GEO-lang based
 * selected fixture from the DB
*/
 export const GET_ALL_SELECTED_MATCH_FIXTURES = gql`
	query GET_ALL_SELECTED_MATCH_FIXTURES @cached(ttl: 300) {
		widget_featured_match_selection {
			date
			fixture_id	
			game_start
			lang
		}
	}
`;

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get the selected GEO-lang based
 * selected fixture from the DB
 */
export const GET_LANG_SELECTED_FIXTURE = gql`
	query GET_LANG_SELECTED_FIXTURE($lang: String!) @cached(ttl: 300) {
		widget_featured_match_selection(where: { lang: { _eq: $lang } }) {
			date
			fixture_id
			game_start
			lang
		}
		# widget_featured_match_translations_by_pk(lang: $lang) {
		widget_featured_match_translations {
			assists
			bookmaker
			bet
			fair_odds
			goals
			home_win
			lang
			market
			market_name
			market_type
			matches
			odds
			place_bet
			player
			players
			stake
			rating
			probability
			streams
			type
			value_bet
			vote
			winnings
			widget_title
		}
	}
`;

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get all of the combined fixture data,
 * from different tables from PostgresDB
 */
export const GET_ALL_FIXTURE_DATA = gql`
	query GET_ALL_FIXTURE_DATA($id: Int!, $fixture_id: numeric!) @cached(ttl: 300) {
		widget_featured_match_best_player_by_pk(fixture_id: $fixture_id) {
			fixture_id
			game_start_date
			local_team_player_1
			local_team_player_1_appearances
			local_team_player_1_assists
			local_team_player_1_goals
			local_team_player_1_image_path
			local_team_player_2
			local_team_player_2_appearances
			local_team_player_2_assists
			local_team_player_2_goals
			local_team_player_2_image_path
			local_team_rating_player_1
			local_team_rating_player_2
			visitor_team_player_1
			visitor_team_player_1_appearances
			visitor_team_player_1_assists
			visitor_team_player_1_goals
			visitor_team_player_1_image_path
			visitor_team_player_2
			visitor_team_player_2_appearances
			visitor_team_player_2_assists
			visitor_team_player_2_goals
			visitor_team_player_2_image_path
			visitor_team_rating_player_1
			visitor_team_rating_player_2
		}
		widget_featured_match_votes_by_pk(match_id: $fixture_id) {
			match_id
			vote_draw_x
			vote_win_local
			vote_win_visitor
		}
		week_fixtures_by_pk(id: $id) {
			away_team_logo
			away_team_name
			country_flag
			fixture_day
			home_team_logo
			home_team_name
			id
			inserted_at
			league_name
			probabilities
			round_name
			status
			time
			tvstations
			valuebets
		}
	}
`;



/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the TRANSLATIONS from the DB
 * for the scores_livescore
 */
 export const GET_LIVESCORES_TRANSLATIONS = gql`
 query GET_LIVESCORES_TRANSLATIONS @cached(ttl: 300) {
	scores_livescore_football_translations_dev {
		status
		status_abv
		terms
		lang
	  }
	}
`;


/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the Leagues order
 * for the scores_livescore
 */
 export const GET_LIVESCORES_LEAGUES = gql`
 query GET_LIVESCORES_LEAGUES @cached(ttl: 300) {
	leagues_filtered_country_dev {
	  lang
	  leagues
	}
  }
`;
