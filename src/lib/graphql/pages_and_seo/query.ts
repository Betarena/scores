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
    scores_seo_fixtures {
      lang
      main_data
      opengraph
      sports_type
      twitter_card
    }
    scores_endpoints_translations {
      countries_translation
      lang
      sport
      sports_translation
    }
    scores_football_countries {
      id
      name
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
      urls
    }
    historic_fixtures
    (
      # limit: 50,
      where: {
        id: {
          _eq: 18535246
        }
      }
    ) {
      id
      urls
      publish_status
      away_team_name
      home_team_name
      league_name
      fixture_day
      league_id
      venue_name_j: data(path: "$.venue.data.name")
      venue_city_j: data(path: "$.venue.data.city")
      country_id_j: data(path: "$.league.data.country_id")
    }
  }
`;