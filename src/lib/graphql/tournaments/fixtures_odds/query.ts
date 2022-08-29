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

    historic_fixtures_dev_aggregate (
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

    historic_fixtures_dev (
      order_by: {
        fixture_day: asc
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
  query REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_CONST_DATA 
    (
      $seasonIds: [numeric!]
    )
    @cached 
    (ttl: 300)
  {

    # [ℹ] unecessary to paginate
    # [ℹ] limited to target data
    
    scores_football_seasons_details_dev (
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
  query HASURA_BETARENA_QUERY_TOP_PLAYERS_T 
    @cached 
    (ttl: 300) 
  {
    # [ℹ] unecessary to paginate
    scores_widget_football_fixtures_odds_translations_dev {
      lang
      translations
    }
    scores_general_translations_dev {
      lang
      countries
      widgets_no_data_available
      weekdays
      months
    }
  }
`;