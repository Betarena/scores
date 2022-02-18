// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the TRANSLATIONS from the DB
 * for the website-platform
 */
 export const GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES = gql`
    query GET_TRANSLATIONS_DATA_FEATURED_BETTING_SITES @cached(ttl: 300) {
        scores_featured_betting_sites_translations {
            lang
            translations
        }   
    }
`;