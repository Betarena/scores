// [ℹ] import necessary libraries;
import { gql } from 'graphql-request';

/**
 * [ℹ] GET HASURA league based data
*/
export const GET_LEAGUE_W_STANDINGS_INFO = gql`
  query GET_LEAGUE_W_STANDINGS_INFO
    (
      $leagueIds: [numeric!],
      $teamIds: [numeric!],
    )
    @cached 
    (ttl: 300)
  {
    scores_football_leagues_dev (
      where: {
        id: {
          _in: $leagueIds
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_standings_dev (
      where: {
        id: {
          _in: $leagueIds
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      data
      id
      name
      type
    }
    scores_football_standings_history_dev (
      where: {
        id: {
          _in: $leagueIds
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      id
      data
      name
      season_id
      type
    }

    scores_football_teams_dev (
      where: {
        id: {
          _in: $teamIds
        }
      }
    )
    { # [ℹ] BY TEAM ID
      data
      id
      name
    }
    scores_team_statistics_dev (
      where: {
        team_id: {
          _in: $teamIds
        }
      }
    )
    { # [ℹ] BY TEAM ID
      average_goals
      average_yellow_cards
      data
      name
      team_id
      winning_probability
    }
    scores_team_statistics_history_dev (
      where: {
        team_id: {
          _in: $teamIds
        }
      }
    )
    { # [ℹ] BY TEAM ID
      average_goals
      average_yellow_cards
      data
      name
      season_id
      team_id
    }

    # [ℹ] other data
    color_codes_league_standings_positions_dev {
      color_codes
      sports
    }
    scores_widget_standings_translations_dev {
      lang
      translations
    }
    
  }
`;

/**
 * [ℹ] TEST #2
*/
export const GET_LEAGUE_W_STANDINGS_INFO_2 = gql`
  query GET_LEAGUE_W_STANDINGS_INFO_2
    (
      $leagueIds: [numeric!]
    )
    @cached 
    (ttl: 300)
  {
    scores_football_leagues_dev (
      where: {
        id: {
          _in: $leagueIds
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      country
      data
      name
      id
      season
      seasons
    }
    scores_football_standings_dev (
      where: {
        id: {
          _in: $leagueIds
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      data
      id
      name
      type
    }
    scores_football_standings_history_dev (
      where: {
        id: {
          _in: $leagueIds
        }
      }
    )
    { # [ℹ] BY LEAGUE ID
      id
      data
      name
      season_id
      type
    }

    # [ℹ] other data
    color_codes_league_standings_positions_dev {
      color_codes
      sports
    }
    scores_widget_standings_translations_dev {
      lang
      translations
    }
    
  }
`;

export const GET_TEAM_W_STATS_INFO_3 = gql`
  query GET_TEAM_W_STATS_INFO_3
    (
      $teamIds: [numeric!]
    )
    @cached 
    (ttl: 300)
  {
    scores_football_teams_dev (
      where: {
        id: {
          _in: $teamIds
        }
      }
    )
    { # [ℹ] BY TEAM ID
      data
      id
      name
    }
    scores_team_statistics_dev (
      where: {
        team_id: {
          _in: $teamIds
        }
      }
    )
    { # [ℹ] BY TEAM ID
      average_goals
      average_yellow_cards
      data
      name
      team_id
      winning_probability
    }
    scores_team_statistics_history_dev (
      where: {
        team_id: {
          _in: $teamIds
        }
      }
    )
    { # [ℹ] BY TEAM ID
      average_goals
      average_yellow_cards
      data
      name
      season_id
      team_id
    }
  }
`;