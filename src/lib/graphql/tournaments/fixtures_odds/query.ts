import { gql } from 'graphql-request';

/**
 * [ℹ] Tournaments / Fixtures_Odds Widget (MAIN)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Pagination Required
*/
export const REDIS_CACHE_FIXTURES_ODDS_DATA_1 = gql`
  query REDIS_CACHE_FIXTURES_ODDS_DATA_1 
    (
      $start_date: timestamp,
      $end_date: timestamp,
      $limit: Int,
      $offset: Int
    ) 
    @cached 
    (ttl: 300)
  {

    # [ℹ] pagination based

    historic_fixtures_aggregate (
      where: {
        fixture_day: {
          _gte: $start_date, 
          _lte: $end_date
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
        fixture_day: {
          _gte: $start_date, 
          _lte: $end_date
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
    }
  }
`;

/**
 * [ℹ] Tournaments / Fixtures_Odds Widget (#1)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Target Data (season_id's) Used
*/
export const REDIS_CACHE_FIXTURES_ODDS_DATA_2 = gql`
  query REDIS_CACHE_FIXTURES_ODDS_DATA_2 
    (
      $seasonIds: [numeric!]
    )
    @cached 
    (ttl: 300)
  {

    # [ℹ] unecessary to paginate
    # [ℹ] limited to target data
    
    scores_football_seasons_details (
      where: {
        id: {
          _in: $seasonIds
        }
      }
    ) {
      id
      league_id
      round_data
      default_data
    }

  }
`;

/**
 * [ℹ] Tournaments / Fixtures_Odds Widget (#2)
 * [ℹ] TRANSLATION
*/
export const REDIS_CACHE_FIXTURES_ODDS_DATA_3 = gql`
  query REDIS_CACHE_FIXTURES_ODDS_DATA_3 
    @cached 
    (ttl: 300) 
  {
    # [ℹ] unecessary to paginate
    scores_widget_football_fixtures_odds_translations {
      lang
      translations
    }
    scores_livescore_football_translations {
      lang
      status_abv
    }
    scores_general_translations {
      lang
      countries
      widgets_no_data_available
      weekdays
      months
    }
  }
`;


/**
 * [ℹ] Surgical Queries 
*/

/**
 * [ℹ] Tournaments / Fixtures_Odds Widget 
 * [ℹ] Surgical (#1)
 * [ℹ] Based on Fixture_Id's
*/
export const REDIS_CACHE_FIXTURES_ODDS_ST_DATA_1 = gql`
  query REDIS_CACHE_FIXTURES_ODDS_ST_DATA_1 
    (
      $fixtureIds: [Int!]
    )
    @cached 
    (ttl: 300)
  {

    # [ℹ] unecessary to paginate
    # [ℹ] limited to target data
    
    historic_fixtures (
      where: {
        id: {
          _in: $fixtureIds
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
    }

  }
`;


/**
 * [ℹ] Surgical Queries
 * [ℹ] Season Id Based
*/
export const REDIS_CACHE_FIXTURES_ODDS_DATA_4 = gql`
  query REDIS_CACHE_FIXTURES_ODDS_DATA_4 
    (
      $season_id: Int
    ) 
    @cached 
    (ttl: 300)
  {

    # [ℹ] pagination based

    historic_fixtures (
      order_by: {
        fixture_day: asc,
        id: asc
      },
      where: {
        season_id: {
          _eq: $season_id
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
    }
  }
`;
