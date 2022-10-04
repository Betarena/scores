import { gql } from 'graphql-request';

export const REDIS_CACHE_PAGES_AND_SEO = gql`
  query REDIS_CACHE_PAGES_AND_SEO 
  @cached
  (ttl: 300) 
  {
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
    scores_endpoints_translations(limit: 10) {
      countries_translation
      lang
      sport
      sports_translation
    }
    scores_football_countries {
      name
    }
    scores_tournaments(limit: 100) {
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
      urls
    }
    historic_fixtures(limit: 50) {
      id
      urls
      status
      venue_name_j: data(path: "$.venue.data.name")
      venue_city_j: data(path: "$.venue.data.city")
    }
  }
`;