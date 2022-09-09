// [ℹ] import necessary libraries;
import { gql } from 'graphql-request';

/**
 * [ℹ] GET ALL LEAGUE INFO FULL DATA from the DB
*/
export const GET_LEAGUE_INFO_FULL_DATA = gql`
  query GET_LEAGUE_INFO_FULL_DATA @cached(ttl: 300) {
    # HREF-LANG => (scores_hreflang) not required;
    # as this WIDGET IS [URL] based;

    # IMPORTANT TOURNAMENTS PAGE WIDGET GENERATION
    # scores_tournaments {
    #   author
    #   country
    #   date
    #   id
    #   tournament_id
    #   lang
    #   modified_date
    #   name
    #   sport
    #   status
    #   title
    #   type
    #   widgets
    # }
    # scores_football_seasons_details {
    #   data_stats
    #   default_data
    #   end_date
    #   id
    #   is_current_season
    #   league_id
    #   round_data
    #   start_date
    # }
    # scores_widget_league_info_translations {
    #   data
    #   lang
    # }
    # scores_football_leagues {
    #   country
    #   data
    #   name
    #   id
    #   season
    #   seasons
    # }
    # sportsbook_details {
    #   data
    #   lang
    # }

    # # TOURNAMENTS / STANDINGS WIDGET
    # scores_football_standings {
    #   data
    #   id
    #   name
    #   type
    # }
    # scores_football_standings_history {
    #   id
    #   data
    #   name
    #   season_id
    #   type
    # }
    # scores_team_statistics {
    #   average_goals
    #   average_yellow_cards
    #   data
    #   name
    #   team_id
    #   winning_probability
    # }
    # scores_team_statistics_history {
    #   average_goals
    #   average_yellow_cards
    #   data
    #   name
    #   season_id
    #   team_id
    # }
    # color_codes_league_standings_positions {
    #   color_codes
    #   sports
    # }
    # scores_football_teams {
    #   data
    #   id
    #   name
    # }

    scores_widget_standings_translations {
      lang
      translations
    }
    scores_general_translations {
      lang
      widgets_no_data_available
    }

  }
`;