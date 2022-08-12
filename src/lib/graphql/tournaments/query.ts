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
    # scores_tournaments_dev {
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
    # scores_football_seasons_details_dev {
    #   data_stats
    #   default_data
    #   end_date
    #   id
    #   is_current_season
    #   league_id
    #   round_data
    #   start_date
    # }
    # scores_widget_league_info_translations_dev {
    #   data
    #   lang
    # }
    # scores_football_leagues_dev {
    #   country
    #   data
    #   name
    #   id
    #   season
    #   seasons
    # }
    # sportsbook_details_dev {
    #   data
    #   lang
    # }

    # # TOURNAMENTS / STANDINGS WIDGET
    # scores_football_standings_dev {
    #   data
    #   id
    #   name
    #   type
    # }
    # scores_football_standings_history_dev {
    #   id
    #   data
    #   name
    #   season_id
    #   type
    # }
    # scores_team_statistics_dev {
    #   average_goals
    #   average_yellow_cards
    #   data
    #   name
    #   team_id
    #   winning_probability
    # }
    # scores_team_statistics_history_dev {
    #   average_goals
    #   average_yellow_cards
    #   data
    #   name
    #   season_id
    #   team_id
    # }
    # color_codes_league_standings_positions_dev {
    #   color_codes
    #   sports
    # }
    # scores_football_teams_dev {
    #   data
    #   id
    #   name
    # }

    scores_widget_standings_translations_dev {
      lang
      translations
    }
    scores_general_translations_dev {
      lang
      widgets_no_data_available
    }

  }
`;