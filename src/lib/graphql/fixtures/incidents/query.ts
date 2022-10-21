import { gql } from 'graphql-request';

/**
 * [ℹ] GET current seasons
*/
export const REDIS_CACHE_FIXTURE_INCIDENTS_DATA_0 = gql`
  query REDIS_CACHE_FIXTURE_INCIDENTS_DATA_0 
    @cached 
    (ttl: 300)
  {
    scores_football_seasons_details (
      where: 
      {
        is_current_season: {
          _eq: true
        }
      }
    ) {
      id
    }
  }
`;

/**
 * [ℹ] Fixtures / Incidents Widget (MAIN)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Pagination Required (but not necessary?)
 * [ℹ] _0 dependent
*/
export const REDIS_CACHE_FIXTURE_INCIDENTS_DATA_1 = gql`
  query REDIS_CACHE_FIXTURE_INCIDENTS_DATA_1 
    (
      $limit: Int,
      $offset: Int,
      $seasonIds: [Int!]
    ) 
    @cached 
    (ttl: 300)
  {

    # [ℹ] pagination based

    historic_fixtures_aggregate (
      where: {
        season_id: {
          _in: $seasonIds
        }
      }
    ) {
      aggregate {
        totalCount: count
      }
    }

    historic_fixtures (
      order_by: {
        fixture_day: asc,
        id: asc
      },
      limit: $limit,
      offset: $offset,
      where: {
        season_id: {
          _in: $seasonIds
        }
      }
    ) {
      id
      fixture_day
      time
      away_team_name
      away_team_logo
      home_team_name
      home_team_logo
      round_name
      league_id
      season_id
      # [alt V1]
      # data
      # [alt V2]
      events_j:  data(path: "$.events.data")
    }
  }
`;

/**
 * [ℹ] Fixtures / Scoreboard Widget (#4)
 * [ℹ] TRANSLATION
*/
export const REDIS_CACHE_FIXTURE_INCIDENTS_DATA_3 = gql`
  query REDIS_CACHE_FIXTURE_INCIDENTS_DATA_3 
    @cached 
    (ttl: 300) 
  {
    # [ℹ] unecessary to paginate
    scores_fixture_scoreboard_translations {
      lang
      translations
    }
  }
`;

/** 
 * ====================
 * [ℹ] Surgical Queries
 * ====================
*/

/**
 * [ℹ] GET Target Fixture 
*/
export const REDIS_CACHE_FIXTURE_INCIDENTS_DATA_4 = gql`
  query REDIS_CACHE_FIXTURE_INCIDENTS_DATA_3
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
      fixture_day
      time
      away_team_name
      away_team_logo
      home_team_name
      home_team_logo
      round_name
      league_id
      season_id
      # [alt V1]
      # data
      # [alt V2]
      stats_j: data(path: "$.stats")
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      time_j: data(path: "$.time")
      round_j: data(path: "$.round")
      scores_j: data(path: "$.scores")
      localteam_short_code_j: data(path: "$.localTeam.data.short_code")
      visitorteam_short_code_j: data(path: "$.visitorTeam.data.short_code")
    }
  }
`;