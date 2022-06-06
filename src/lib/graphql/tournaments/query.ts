// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * METHOD / GET
 * ~~~~~~~~~~~~~
 * ... ℹ GET ALL of the LEAGUE TABLE DATA from the DB;
 * ... ℹ for the website-platform;
*/
export const GET_TOURNAMENTS_DATA = gql`
	query GET_TOURNAMENTS_DATA @cached(ttl: 300) {
    scores_tournaments_dev {
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
    }
    # scores_endpoints_translations_dev {
    #   countries_translation
    #   id
    #   lang
    #   sport
    #   sports_translation
    #   title
    #   type
    # }
	}
`;