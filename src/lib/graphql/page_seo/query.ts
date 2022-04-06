// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL LEAGUE LIST DATA from the DB
*/
export const GET_COMPLETE_PAGES_SEO_DATA = gql`
    query GET_COMPLETE_PAGES_SEO_DATA @cached(ttl: 300) {
        scores_seo_homepage {
            lang
            main_data
            twitter_card
            opengraph
        }
        scores_seo_block_homepage_dev {
            html
            lang
            title
        }
    }
`;