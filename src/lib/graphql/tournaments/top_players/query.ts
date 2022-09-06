// [ℹ] import necessary libraries;
import { gql } from 'graphql-request';

/**
 * [ℹ] TOURNAMENTS / TOP PLAYER WIDGET
 * [ℹ] WARNING [⚠]
 * [ℹ] LARGE DATA HANDLING (Query)
 * [ℹ] REQUIRES PAGINATION APPROACH
*/
export const REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_DYNAMIC_DATA = gql`
  query REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_DYNAMIC_DATA 
    ($limit: Int, $offset: Int) 
    @cached 
    (ttl: 300)
  {

    # [ℹ] pagination based

    scores_football_seasons_details_aggregate {
      aggregate {
        totalCount: count
      }
    }

    scores_football_seasons_details (
      limit: $limit 
      offset: $offset
    ) {
      id
      league_id
      goalscorers
      assistscorers
      squad
    }
  }
`

/**
 * [ℹ] TOURNAMENTS / TOP PLAYER WIDGET
 * [ℹ] WARNING [⚠]
 * [ℹ] LARGE DATA HANDLING (Query)
 * [ℹ] REQUIRES PAGINATION APPROACH
*/
export const REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_CONST_DATA = gql`
  query REDIS_CACHE_PREP_GET_TOURNAMENTS_TOP_PLAYERS_CONST_DATA 
    @cached 
    (ttl: 300)
  {

    # [ℹ] unecessary to paginate
    
    scores_football_leagues {
      country
      data
      name
      id
      season
      seasons
    }

    scores_football_teams {
      data
      id
      name
    }

    scores_football_players {
      data
      player_id
      common_name
      nationality
    }

  }
`;

/**
 * [ℹ] TOURNAMENTS / TOP PLAYER WIDGET [TRANSLATION]
*/
export const HASURA_BETARENA_QUERY_TOP_PLAYERS_T = gql`
  query HASURA_BETARENA_QUERY_TOP_PLAYERS_T 
    @cached 
    (ttl: 300) 
  {
    # [ℹ] unecessary to paginate
    scores_widget_top_players_translations { 
      lang
      data
    }
    player_positions_translations {
      lang
      position
    }
    scores_general_translations {
      lang
      widgets_no_data_available
    }

  }
`;


/**
 * [ℹ] Surgical Queries 
*/

/**
 * [ℹ] Tournaments / Top_Players Widget 
 * [ℹ] Surgical (#1)
 * [ℹ] Based on League_id's
*/
export const REDIS_CACHE_TOP_PLAYERS_ST_DATA_1 = gql`
  query REDIS_CACHE_TOP_PLAYERS_ST_DATA_1
    (
      $leagueIds: [numeric!]
    )
    @cached 
    (ttl: 300)
  {
    scores_football_leagues (
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
  }
`;

/**
 * [ℹ] Tournaments / Top_Players Widget 
 * [ℹ] Surgical (#2)
 * [ℹ] Based on Season_id's
*/
export const REDIS_CACHE_TOP_PLAYERS_ST_DATA_2 = gql`
  query REDIS_CACHE_TOP_PLAYERS_ST_DATA_2
    (
      $limit: Int,
      $offset: Int,
      $seasonIds: [numeric!]
    )
    @cached 
    (ttl: 300)
  {

    # [ℹ] pagination based

    scores_football_seasons_details_dev_aggregate (
      where: {
        id: {
          _in: $seasonIds
        }
      }
    ) {
      aggregate {
        totalCount: count
      }
    }

    scores_football_seasons_details_dev (
      order_by: {
        id: asc
      },
      limit: $limit,
      offset: $offset,
      where: {
        id: {
          _in: $seasonIds
        }
      }
    ) {
      id
      league_id
      goalscorers
      assistscorers
      squad
    }
  }
`;

/**
 * [ℹ] Tournaments / Top_Players Widget 
 * [ℹ] Surgical (#2)
 * [ℹ] Based on Team_id's & Player_id's
*/
export const REDIS_CACHE_TOP_PLAYERS_ST_DATA_3 = gql`
  query REDIS_CACHE_TOP_PLAYERS_ST_DATA_3
    (
      $teamIds: [numeric!],
      $playerIds: [numeric!]
    )
    @cached 
    (ttl: 300)
  {
    scores_football_teams (
      where: {
        id: {
          _in: $teamIds
        }
      } 
    ) {
      data
      id
      name
    }

    scores_football_players (
      where: {
        player_id: {
          _in: $playerIds
        }
      } 
    ) {
      data
      player_id
      common_name
      nationality
    }
  }
`;