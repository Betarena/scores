// [ℹ] import necessary libraries;
import { gql } from 'graphql-request';

/**
 * [ℹ] Tournaments / Fixtures_Odds Widget (MAIN)
 * [ℹ] League_Info Data
*/
export const REDIS_CACHE_LEAGUE_INFO_DATA_1 = gql`
  query REDIS_CACHE_LEAGUE_INFO_DATA_1 
  @cached 
  (ttl: 300) 
  {
    # HREF-LANG => (scores_hreflang) not required;
    # as this WIDGET IS [URL] based;

    # IMPORTANT TOURNAMENTS PAGE WIDGET GENERATION
    scores_tournaments {
      author
      country
      date
      id
      tournament_id
      lang
      name
      sport
      title
      type
      widgets
    }
    scores_football_leagues {
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_seasons_details {
      data_stats
      end_date
      id
      is_current_season
      league_id
      start_date
    }

    # [ℹ] translations
    scores_widget_league_info_translations {
      data
      lang
    }
    widget_league_info_translations {
      lang
      data
    }
  }
`;

/**
 * [ℹ] Tournaments / Fixtures_Odds Widget (MAIN)
 * [ℹ] Sportbook Details Data
*/
export const REDIS_CACHE_LEAGUE_INFO_DATA_2 = gql`
  query REDIS_CACHE_LEAGUE_INFO_DATA_2 
  @cached 
  (ttl: 300) 
  {
    sportsbook_details {
      data
      lang
    }
  }
`;