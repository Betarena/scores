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
        scores_header_translations_dev {
            theme_options
            theme
            sports
            sign_in
            odds_type
            odds
            more_sports
            lang
            homepage
            betting_tips_link
            bookmakers
            bookmakers_countries
            content_platform_link
            sports_list
        }
        scores_header_links_dev {
            betting_tips
            lang
            latest_news
        }
    }
`;