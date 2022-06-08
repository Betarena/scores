// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL LEAGUE LIST DATA from the DB
*/
export const GET_COMPLETE_PAGES_AND_SEO_DATA = gql`
  query GET_COMPLETE_PAGES_AND_SEO_DATA @cached(ttl: 300) {
    scores_hreflang_dev {
      hreflang
      link
    }
    scores_seo_homepage_dev {
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
    scores_seo_tournaments_dev {
      lang
      main_data
      opengraph
      twitter_card
    }
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
  }
`;