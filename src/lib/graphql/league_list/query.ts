// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL LEAGUE LIST DATA from the DB
*/
export const GET_COMPLETE_LEAGUE_LIST_DATA = gql`
    query GET_COMPLETE_LEAGUE_LIST_DATA @cached(ttl: 300) {
        scores_league_list {
            country_id
            country_name
            image_path
            league_id
            league_name
            logo_path
            type
        }
        leagues_filtered_country {
            lang
            leagues
        }
        scores_leagues_list_translations_dev {
            lang
            translations
        }
    }
`;