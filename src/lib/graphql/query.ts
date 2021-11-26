// ... import necessary libraries;
import { gql } from 'graphql-request'

/**
 * Description:
 * ~~~~~~~~~~~~~
 * ... get ALL of the TRANSLATIONS from the DB
 * for the website-platform
*/
export const GET_WEBSITE_ALL_LANG_TRANSLATIONS = gql`
    query GET_WEBSITE_ALL_LANG_TRANSLATIONS {
        scores_header_translations {
            betting_tips_link
            bookmakers
            bookmakers_countries
            content_platform_link
            lang
            odds
            odds_type
            sign_in
            sports
            theme
            theme_options
        }
    }
`;