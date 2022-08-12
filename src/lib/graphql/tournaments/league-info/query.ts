// [ℹ] import necessary libraries;
import { gql } from 'graphql-request';

/**
 * [ℹ] GET ALL LEAGUE INFO FULL DATA from the DB
*/
export const GET_LEAGUE_INFO_FULL_DATA = gql`
  query GET_LEAGUE_INFO_FULL_DATA @cached (ttl: 300) {
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
    scores_football_seasons_details {
      data_stats
      end_date
      id
      is_current_season
      league_id
      start_date
    }
    scores_widget_league_info_translations {
      data
      lang
    }
    scores_football_leagues {
      country
      data
      name
      id
      season
      seasons
    }
    sportsbook_details {
      data
      lang
    }

  }
`;