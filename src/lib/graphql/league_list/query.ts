import { gql } from 'graphql-request';

/**
 * [ℹ] Homepage / League List Widget (#1)
*/
export const REDIS_CACHE_LEAGUE_LIST_DATA_1 = gql`
  query REDIS_CACHE_LEAGUE_LIST_DATA_1 @cached(ttl: 300) {

    leagues_filtered_country {
      lang
      leagues
    }
    scores_league_list {
      country_id
      country_name
      image_path
      league_id
      league_name
      logo_path
      type
    }    
    scores_tournaments {
      id
      tournament_id
      urls
    }

    # [ℹ] translations
    scores_leagues_list_translations {
      lang
      translations
    }
    scores_general_translations {
      lang
      countries
    }

  }
`;