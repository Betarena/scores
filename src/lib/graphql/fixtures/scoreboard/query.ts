import { gql } from 'graphql-request';

/**
 * [ℹ] GET current seasons
*/
export const REDIS_CACHE_SCOREBOARD_ODDS_DATA_0 = gql`
  query REDIS_CACHE_SCOREBOARD_ODDS_DATA_0 
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
 * [ℹ] Fixtures / Scoreboard Widget (MAIN)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Pagination Required
 * [ℹ] _0 dependent
*/
export const REDIS_CACHE_SCOREBOARD_ODDS_DATA_1 = gql`
  query REDIS_CACHE_SCOREBOARD_ODDS_DATA_1 
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
      home_team_name
      round_name
      data
      league_id
      tip_link_wp
      fixture_link_wp
      media_link
      season_id
    }
  }
`;