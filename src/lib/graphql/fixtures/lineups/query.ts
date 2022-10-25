import { gql } from 'graphql-request';

/**
 * [ℹ] GET current seasons
*/
export const REDIS_CACHE_LINEUPS_DATA_0 = gql`
  query REDIS_CACHE_LINEUPS_DATA_0 
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
 * [ℹ] Fixtures / Lineup Widget (MAIN)
 * [ℹ] Warning [⚠]
 * [ℹ] Large Query
 * [ℹ] Pagination Required
 * [ℹ] _0 dependent
*/
export const REDIS_CACHE_LINEUPS_DATA_1 = gql`
  query REDIS_CACHE_LINEUPS_DATA_1 
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
      teams_rating
      # [alt V1]
      # data
      # [alt V2]
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      lineup_j: data(path: "$.lineup.data")
      bench_j: data(path: "$.bench.data")
      formations_j: data(path: "$.formations")
      substitutions_j: data(path: "$.substitutions.data")
      home_coach_j: data(path: "$.localCoach.data")
      away_coach_j: data(path: "$.visitorCoach.data")
      events_j: data(path: "$.events.data")
      localteam_short_code_j: data(path: "$.localTeam.data.short_code")
      visitorteam_short_code_j: data(path: "$.visitorTeam.data.short_code")
      status_j: data(path: "$.time.status")
    }
  }
`;

/**
 * [ℹ] Tournaments / Top_Players Widget 
 * [ℹ] Surgical (#2)
 * [ℹ] Based on Team_id's & Player_id's
*/
export const REDIS_CACHE_LINEUPS_DATA_4 = gql`
  query REDIS_CACHE_LINEUPS_DATA_4
  (
    $playerIds: [numeric!]
  )
  @cached 
  (ttl: 300)
  {
    scores_football_players (
      where: {
        player_id: {
          _in: $playerIds
        }
      } 
    ) {
      player_id
      image_path_j: data(path: "$.image_path")
    }
  }
`;

/**
 * [ℹ] Fixtures / Lineup Widget (#2)
 * [ℹ] TRANSLATION
*/
export const REDIS_CACHE_LINEUPS_DATA_2 = gql`
  query REDIS_CACHE_LINEUPS_DATA_2 
    @cached 
    (ttl: 300) 
  {
    # [ℹ] unecessary to paginate
    player_positions_translations {
      lang
      position
    }
    scores_general_translations {
      lang
      countries
      widgets_no_data_available
      weekdays
      months
    }
    scores_fixture_lineup_translations {
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
 * [ℹ] MAIN-MIRROR
*/
export const REDIS_CACHE_LINEUPS_DATA_3 = gql`
  query REDIS_CACHE_LINEUPS_DATA_3
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
      teams_rating
      # [alt V1]
      # data
      # [alt V2]
      localteam_id_j: data(path: "$.localteam_id")
      visitorteam_id_j: data(path: "$.visitorteam_id")
      lineup_j:  data(path: "$.lineup.data")
      bench_j: data(path: "$.bench.data")
      formations_j:  data(path: "$.formations")
      substitutions_j: data(path: "$.substitutions.data")
      home_coach_j: data(path: "$.localCoach.data")
      away_coach_j: data(path: "$.visitorCoach.data")
      events_j: data(path: "$.events.data")
      localteam_short_code_j: data(path: "$.localTeam.data.short_code")
      visitorteam_short_code_j: data(path: "$.visitorTeam.data.short_code")
      status_j: data(path: "$.time.status")
    }
  }
`;