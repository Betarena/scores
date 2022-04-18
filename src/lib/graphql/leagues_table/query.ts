// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * METHOD / GET
 * ~~~~~~~~~~~~~
 * ... ℹ GET ALL of the LEAGUE TABLE DATA from the DB;
 * ... ℹ for the website-platform;
*/
export const GET_LEAGUES_TABLE_DATA = gql`
	query GET_LEAGUES_TABLE_DATA @cached(ttl: 300) {
    scores_football_leagues_dev {
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_standings_dev {
      data
      id
      name
      type
    }
    scores_football_teams_dev {
      data
      id
      name
    }
    scores_standings_home_widget_translations_dev {
      games
      lang
      points
      title
    }
    color_codes_league_standings_positions_dev {
      color_codes
      sports
    }
    leagues_filtered_country {
      lang
      leagues
    }
	}
`;