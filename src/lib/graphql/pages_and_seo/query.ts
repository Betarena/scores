// ... import necessary libraries;
import { gql } from 'graphql-request';

export const REDIS_CACHE_PAGES_AND_SEO = gql`
  query REDIS_CACHE_PAGES_AND_SEO @cached(ttl: 300) {
    scores_hreflang {
      hreflang
      link
    }
    scores_seo_homepage {
      lang
      main_data
      twitter_card
      opengraph
    }
    scores_seo_tournaments {
      lang
      main_data
      opengraph
      twitter_card
    }
    scores_tournaments {
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