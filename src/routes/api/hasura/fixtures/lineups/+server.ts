import { dev } from '$app/environment'
import fs from 'fs';
import { performance } from 'perf_hooks';
import { error, json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { REDIS_CACHE_LINEUPS_DATA_3 } from '$lib/graphql/fixtures/lineups/query';

import type { 
  BETARENA_HASURA_lineups_query, 
  BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures, 
  Fixture_Lineups, 
  REDIS_CACHE_SINGLE_lineups_data, 
  Team_Lineup 
} from '$lib/models/fixtures/lineups/types';

// [ℹ] debug info
const logs = []
let t0;
let t1;

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req, res): Promise < unknown > {
  const fixture_id: string = req.url['searchParams'].get('fixture_id');
  const target_season_fixtures = await main(fixture_id)
  return json(target_season_fixtures)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main (
  _fixture_id: string
): Promise < REDIS_CACHE_SINGLE_lineups_data | null > {

  // [ℹ] relying on Fixture Id
  // [ℹ] to get Target Fixture
  // [ℹ] and return

  const FIXTURE_ID = parseInt(_fixture_id)

  /**
   * [ℹ] obtain target historic_fixtures [fixture_id]
  */

  const fixture = await get_target_fixture(
    FIXTURE_ID
  );
  // [ℹ] exit
  if (fixture == undefined) {
    return null;
  }

  const fixture_data = fixture[0]

  /**
   * [ℹ] generate FIXTURE data 
  */

  // const league_id = fixture_data?.league_id;
  // const fixture_id = fixture_data?.id;
  const home_team_id = fixture_data?.localteam_id_j;
  const away_team_id = fixture_data?.visitorteam_id_j;

  // const fixture_time = fixture_data?.time;

  // [ℹ] home-team
  const home_team_name = fixture_data?.home_team_name || null;
  const home_team_logo = fixture_data?.home_team_logo || null;
  const home_team_coach_name = fixture_data?.home_coach_j?.fullname || null;
  const home_team_lineup = 
    fixture_data?.lineup_j == null || fixture_data?.lineup_j.length == 0
      ? []
      : fixture_data?.lineup_j
        .filter(player => player.team_id == home_team_id)    /* filter target HOME_TEAM_ID */
        .map(p => ({
          player_name: p.player_name,
          number: p.number,
          position: p.position,
          formation_position: p.formation_position
        }) /* extract target players */
      )
  ;
  const home_team_subs = 
    fixture_data?.substitutions_j == null || fixture_data?.substitutions_j.length == 0
      ? []
      : fixture_data?.substitutions_j
        .filter(player => parseInt(player?.team_id) == away_team_id)    /* filter target HOME_TEAM_ID */
        .map(p => ({
          player_in_id: p.player_in_id,
          player_out_id: p.player_out_id,
          player_in_name: p.player_in_name,
          player_out_name: p.player_out_name
        })
      )
  ;
  
  // [ℹ] away-team
  const away_team_name = fixture_data?.away_team_name;
  const away_team_logo = fixture_data?.away_team_logo;
  const away_team_coach_name = fixture_data?.away_coach_j?.fullname || null;
  const away_team_lineup = 
    fixture_data?.lineup_j == null || fixture_data?.lineup_j.length == 0
      ? []
      : fixture_data?.lineup_j
        .filter(player => player.team_id == away_team_id)    /* filter target AWAY_TEAM_ID */
        .map(p => ({
          player_name: p.player_name,
          number: p.number,
          position: p.position,
          formation_position: p.formation_position
        }) /* extract target players */
      )
  ;
  const away_team_subs = 
    fixture_data?.substitutions_j == null || fixture_data?.substitutions_j.length == 0
      ? []
      : fixture_data?.substitutions_j
        .filter(player => parseInt(player?.team_id) == away_team_id)    /* filter target AWAY_TEAM_ID */
        .map(p => ({
          player_in_id: p.player_in_id,
          player_out_id: p.player_out_id,
          player_in_name: p.player_in_name,
          player_out_name: p.player_out_name
        })
      )
  ;

  const home_team_obj: Team_Lineup = {
    team_name:      home_team_name,
    team_logo:      home_team_logo,
    coach_name:     home_team_coach_name,
    lineup:         home_team_lineup,
    formation:      fixture_data?.formations_j,
    substitutions:  home_team_subs
  }

  const away_team_obj: Team_Lineup = {
    team_name:      away_team_name,
    team_logo:      away_team_logo,
    coach_name:     away_team_coach_name,
    lineup:         away_team_lineup,
    formation:      fixture_data?.formations_j,
    substitutions:  away_team_subs
  }

  // [ℹ] generate [final] fixture object
  const fixture_object: Fixture_Lineups = {
    home: home_team_obj,
    away: away_team_obj,
    events: fixture_data?.events_j,
    team_ratings: fixture_data?.teams_rating
  }


  // [ℹ] return fixture
  return fixture_object;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_target_fixture (
  fixture_id: number
): Promise < BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[] > {

  // [ℹ] obtain target historic_fixtures [fixture_id]
  const queryName = "REDIS_CACHE_LINEUPS_DATA_3";
  t0 = performance.now();
  const VARIABLES = {
    fixture_id: fixture_id
  }
  const response: BETARENA_HASURA_lineups_query = await initGrapQLClient().request (
    REDIS_CACHE_LINEUPS_DATA_3,
    VARIABLES
  );
  t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response.historic_fixtures;
}