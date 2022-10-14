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
      seo_content
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
    scores_widget_tournament_about_translations {
      lang
      data
    }
    scores_general_translations {
      lang
      widgets_no_data_available
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


/**
 * [ℹ] ABOUT WIDGET CHECK POPULATION 
 * [ℹ] format date: "yyyy-MM-dd"
*/
export const REDIS_CACHE_LEAGUE_INFO_DATA_3 = gql`
  query REDIS_CACHE_LEAGUE_INFO_DATA_3
  (
    $_iregex: String
  )
  @cached 
  (ttl: 300) 
  {
    scores_football_seasons_details (
      where: {
        is_current_season: {
          _eq: true
        }, 
        round_data: {
          _cast: {
            String: {
              _iregex: $_iregex
          }
        }
      }
    }) {
      league_id
    }
  }
`;

export const REDIS_CACHE_LEAGUE_INFO_DATA_4 = gql`
  query REDIS_CACHE_LEAGUE_INFO_DATA_4 
  (
    $league_ids_arr: [Int!],
    $league_ids_arr_2: [numeric!]
  )
  @cached 
  (ttl: 300) 
  {
    # HREF-LANG => (scores_hreflang) not required;
    # as this WIDGET IS [URL] based;

    # IMPORTANT TOURNAMENTS PAGE WIDGET GENERATION
    scores_tournaments (
      where: {
        tournament_id: {
          _in: $league_ids_arr
        }
      }
    ) {
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
      seo_content
    }
    scores_football_leagues (
      where: {
        id: {
          _in: $league_ids_arr_2
        }
      }
    ) {
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_seasons_details (
      where: {
        league_id: {
          _in: $league_ids_arr_2
        }
      }
    ) {
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
    scores_widget_tournament_about_translations {
      lang
      data
    }
    scores_general_translations {
      lang
      widgets_no_data_available
    }
  }
`;