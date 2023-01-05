import { gql } from 'graphql-request';

/** 
 * ====================
 * [ℹ] Surgical Queries
 * [ℹ] HASURA DIRECT
 * ====================
*/

/**
 * [ℹ] GET Target Fixture [main] [DATA]
*/
export const REDIS_CACHE_FIXTURE_HEAD_2_HEAD_0 = gql`
  query REDIS_CACHE_FIXTURE_HEAD_2_HEAD_0
  (
    $fixture_id: Int!
  ) 
  @cached
  (ttl: 300)
  {
    historic_fixtures (
      where: {
        id: {
          _eq: $fixture_id
        }
      }
    ) {
      id
      league_id
      season_id
      time
      # [alt V1]
      # data
      # [alt V2]
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
    }
  }
`;

/**
 * [ℹ] GET Target Fixture [main] [DATA]
*/
export const REDIS_CACHE_FIXTURE_HEAD_2_HEAD_1 = gql`
  query REDIS_CACHE_FIXTURE_HEAD_2_HEAD_1
  (
    $team_ids: String!,
    $team_ids_arr: [numeric!]
  ) 
  @cached
  (ttl: 300)
  {
    football_h2h (
      where: {
        team_ids: {
          _eq: $team_ids
        }
      }
    ) {
      team_ids
      data
      last_5_data
      wins_draws
      yellow_cards_avg
      overs
      btts
    }
    scores_football_teams (
      where: {
        id: {
          _in: $team_ids_arr
        }
      }
    )
    { # [ℹ] BY TEAM ID
      id
      name
      data
    }
  }
`;

/**
 * [ℹ] GET Target Fixture [main] [TRANSLATION]
*/
export const REDIS_CACHE_FIXTURE_HEAD_2_HEAD_2 = gql`
  query REDIS_CACHE_FIXTURE_HEAD_2_HEAD_2
  (
    $lang: String!
  ) 
  @cached
  (ttl: 300)
  {
    scores_general_translations (
      where: {
        lang: {
          _eq: $lang
        }
      } 
    ) {
      lang
      countries
      widgets_no_data_available
      weekdays
      months
    }
    scores_fixtures_h2h_translations (
      where: {
        lang: {
          _eq: $lang
        }
      } 
    ) {
      lang
      translations
    }
  }
`;