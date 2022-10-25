import { dev } from '$app/environment';
import fs from 'fs';
import { performance } from 'perf_hooks';
import { error, json } from '@sveltejs/kit';

import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { REDIS_CACHE_LINEUPS_DATA_3, REDIS_CACHE_LINEUPS_DATA_4 } from '$lib/graphql/fixtures/lineups/query';

import type {
	BETARENA_HASURA_lineups_query,
	BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures,
	BETARENA_HASURA_SURGICAL_JSONB_scores_football_players,
	Fixture_Lineups,
	Fixture_Player,
	REDIS_CACHE_SINGLE_lineups_data,
	Sub_Player,
	Team_Lineup
} from '$lib/models/fixtures/lineups/types';

// [ℹ] debug info
const logs = [];
let t0;
let t1;

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req, res): Promise<unknown> {
	const fixture_id: string = req.url['searchParams'].get('fixture_id');
	const target_season_fixtures = await main(fixture_id);
	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(_fixture_id: string): Promise<REDIS_CACHE_SINGLE_lineups_data | null> {
	// [ℹ] relying on Fixture Id
	// [ℹ] to get Target Fixture
	// [ℹ] and return

	const FIXTURE_ID = parseInt(_fixture_id);

	/**
	 * [ℹ] obtain target historic_fixtures [fixture_id]
  */

	const fixture = await get_target_fixture(FIXTURE_ID);
	// [ℹ] exit
	if (fixture == undefined) {
		return null;
	}

	const fixture_data = fixture[0];

  /**
   * [ℹ] obtain target football_players
   * [ℹ] convert to map
  */
  let football_player_ids: number[] = []
  const lineup_ids = fixture_data?.lineup_j.map(p => p?.player_id)
  const bench_ids = fixture_data?.bench_j.map(p => p?.player_id)
  // const subs_ids = [
  //   ...fixture.substitutions_j.map(p => p.player_in_id),
  //   ...fixture.substitutions_j.map(p => p.player_out_id)
  // ]
  football_player_ids = [
    ...new Set(football_player_ids.concat(lineup_ids.concat(bench_ids)))
  ]
  const player_data = await get_target_player_data(football_player_ids)
  const players_map = await generate_players_map(player_data)

	/**
	 * [ℹ] generate FIXTURE data
  */

  const fixture_id = fixture_data?.id;
  const home_team_id = fixture_data?.localteam_id_j;
  const away_team_id = fixture_data?.visitorteam_id_j;
  const status = fixture_data?.status_j;

  // [ℹ] home-team-vital-info
  const home_team_name = fixture_data?.home_team_name || null;
  const home_team_logo = fixture_data?.home_team_logo || null;
  const home_team_coach_name = fixture_data?.home_coach_j?.fullname || null;
  const home_team_coach_avatar = fixture_data?.home_coach_j?.image_path || null;
  const home_team_short_code = fixture_data?.localteam_short_code_j;
  // [ℹ] home-team lineup [init]
  const home_team_lineup: Fixture_Player[] = 
    fixture_data?.lineup_j == null || fixture_data?.lineup_j.length == 0
      ? []
      : fixture_data?.lineup_j
        .filter(player => player.team_id == home_team_id)    /* filter target HOME_TEAM_ID */
        .map(p => ({
          player_id: p.player_id,
          player_name: p.player_name,
          number: p.number,
          position: p.position,
          formation_position: p.formation_position,
          player_avatar: players_map.get(p.player_id)?.image_path_j || null,
          rating: p?.stats?.rating || null,
          events: undefined
        }) /* extract target players */
      )
  ;
  // [ℹ] home-team lineup [data-injection]
  for (const h_player of home_team_lineup) {
    h_player.events = {
      injured: false,
      yeallow_card: null,
      red_card: null,
      goals: null,
      substitution: null
    }
    for (const event of fixture_data.events_j) {
      if (h_player.player_id == event.player_id) {
        if (event.type == 'yellowcard') {
          h_player.events.yeallow_card =
            h_player.events.yeallow_card == null
              ? 1
              : h_player.events.yeallow_card + 1
          ;
        }
        if (event.type == 'redcard') {
          h_player.events.red_card = 1;
        }
        if (event.type == 'goal' || event.type == 'own-goal') {
          h_player.events.goals =
            h_player.events.goals == null
              ? 1
              : h_player.events.goals + 1
          ;
        }
      }
      if (h_player.player_id == event.related_player_id) {
        if (event.injuried) {
          h_player.events.injured = true;
        }
        if (event.type == 'substitution') {
          h_player.events.substitution = event;
        }
      }
    }
  }
  // [ℹ] home-team bench [init]
  const home_team_bench: Fixture_Player[] = 
    fixture_data?.bench_j == null 
    || fixture_data?.bench_j.length == 0
      ? []
      : fixture_data?.bench_j
        .filter(player => player.team_id == home_team_id)    /* filter target HOME_TEAM_ID */
        .map(p => ({
          player_id: p.player_id,
          player_name: p.player_name,
          number: p.number,
          position: p.position,
          formation_position: p.formation_position,
          player_avatar: players_map.get(p.player_id)?.image_path_j || null,
          rating: p?.stats?.rating || null,
          events: undefined
        }) /* extract target players */
      )
  ;
  // [ℹ] home-team bench [data-injection]
  for (const h_player of home_team_bench) {
    h_player.events = {
      injured: false,
      yeallow_card: null,
      red_card: null,
      goals: null,
      substitution: null
    }
    for (const event of fixture_data.events_j) {
      if (h_player.player_id == event.player_id) {
        if (event.type == 'yellowcard') {
          h_player.events.yeallow_card =
            h_player.events.yeallow_card == null
              ? 1
              : h_player.events.yeallow_card + 1
          ;
        }
        if (event.type == 'redcard') {
          h_player.events.red_card = 1;
        }
        if (event.type == 'goal' || event.type == 'own-goal') {
          h_player.events.goals =
            h_player.events.goals == null
              ? 1
              : h_player.events.goals + 1
          ;
        }
      }
      if (h_player.player_id == event.related_player_id) {
        if (event.injuried) {
          h_player.events.injured = true;
        }
        if (event.type == 'substitution') {
          h_player.events.substitution = event;
        }
      }
    }
  }
  // [ℹ] home-team substituion-detail event
  const home_team_subs: Sub_Player[] = 
    fixture_data?.substitutions_j == null || fixture_data?.substitutions_j.length == 0
      ? []
      : fixture_data?.substitutions_j
        .filter(player => parseInt(player?.team_id) == away_team_id)    /* filter target HOME_TEAM_ID */
        .map(p => ({
          player_in_id: p.player_in_id,
          player_out_id: p.player_out_id,
          player_in_name: p.player_in_name,
          player_out_name: p.player_out_name,
          player_avatar_in: players_map.get(p.player_in_id)?.image_path_j || null,
          player_avatar_out: players_map.get(p.player_out_id)?.image_path_j || null
        })
      )
  ;
  
  // [ℹ] away-team
  const away_team_name = fixture_data?.away_team_name;
  const away_team_logo = fixture_data?.away_team_logo;
  const away_team_coach_name = fixture_data?.away_coach_j?.fullname || null;
  const away_team_coach_avatar = fixture_data?.away_coach_j?.image_path || null;
  const away_team_short_code = fixture_data?.visitorteam_short_code_j;
  // [ℹ] away-team lineup [init]
  const away_team_lineup: Fixture_Player[] = 
    fixture_data?.lineup_j == null || fixture_data?.lineup_j.length == 0
      ? []
      : fixture_data?.lineup_j
        .filter(player => player.team_id == away_team_id)    /* filter target AWAY_TEAM_ID */
        .map(p => ({
          player_id: p.player_id,
          player_name: p.player_name,
          number: p.number,
          position: p.position,
          formation_position: p.formation_position,
          player_avatar: players_map.get(p.player_id)?.image_path_j || null,
          rating: p?.stats?.rating || null,
          events: undefined
        }) /* extract target players */
      )
  ;
  // [ℹ] away-team lineup [data-injection]
  for (const a_player of away_team_lineup) {
    a_player.events = {
      injured: false,
      yeallow_card: null,
      red_card: null,
      goals: null,
      substitution: null
    }
    for (const event of fixture_data.events_j) {
      if (a_player.player_id == event.player_id) {
        if (event.type == 'yellowcard') {
          a_player.events.yeallow_card =
            a_player.events.yeallow_card == null
              ? 1
              : a_player.events.yeallow_card + 1
          ;
        }
        if (event.type == 'redcard') {
          a_player.events.red_card = 1;
        }
        if (event.type == 'goal' || event.type == 'own-goal') {
          a_player.events.goals =
            a_player.events.goals == null
              ? 1
              : a_player.events.goals + 1
          ;
        }
      }
      if (a_player.player_id == event.related_player_id) {
        if (event.injuried) {
          a_player.events.injured = true;
        }
        if (event.type == 'substitution') {
          a_player.events.substitution = event;
        }
      }
    }
  }
  // [ℹ] away-team bench [init]
  const away_team_bench: Fixture_Player[] = 
    fixture_data?.bench_j == null 
    || fixture_data?.bench_j.length == 0
      ? []
      : fixture_data?.bench_j
        .filter(player => player.team_id == home_team_id)    /* filter target HOME_TEAM_ID */
        .map(p => ({
          player_id: p.player_id,
          player_name: p.player_name,
          number: p.number,
          position: p.position,
          formation_position: p.formation_position,
          player_avatar: players_map.get(p.player_id)?.image_path_j || null,
          rating: p?.stats?.rating || null,
          events: undefined
        }) /* extract target players */
      )
  ;
  // [ℹ] away-team bench [data-injection]
  for (const a_player of away_team_bench) {
    a_player.events = {
      injured: false,
      yeallow_card: null,
      red_card: null,
      goals: null,
      substitution: null
    }
    for (const event of fixture_data.events_j) {
      if (a_player.player_id == event.player_id) {
        if (event.type == 'yellowcard') {
          a_player.events.yeallow_card =
            a_player.events.yeallow_card == null
              ? 1
              : a_player.events.yeallow_card + 1
          ;
        }
        if (event.type == 'redcard') {
          a_player.events.red_card = 1;
        }
        if (event.type == 'goal' || event.type == 'own-goal') {
          a_player.events.goals =
            a_player.events.goals == null
              ? 1
              : a_player.events.goals + 1
          ;
        }
      }
      if (a_player.player_id == event.related_player_id) {
        if (event.injuried) {
          a_player.events.injured = true;
        }
        if (event.type == 'substitution') {
          a_player.events.substitution = event;
        }
      }
    }
  }
  // [ℹ] away-team substituion-detail event
  const away_team_subs: Sub_Player[] = 
    fixture_data?.substitutions_j == null || fixture_data?.substitutions_j.length == 0
      ? []
      : fixture_data?.substitutions_j
        .filter(player => parseInt(player?.team_id) == away_team_id)    /* filter target AWAY_TEAM_ID */
        .map(p => ({
          player_in_id: p.player_in_id,
          player_out_id: p.player_out_id,
          player_in_name: p.player_in_name,
          player_out_name: p.player_out_name,
          player_avatar_in: players_map.get(p.player_in_id)?.image_path_j || null,
          player_avatar_out: players_map.get(p.player_out_id)?.image_path_j || null
        })
      )
  ;


  const home_team_obj: Team_Lineup = {
    team_name:      home_team_name,
    team_logo:      home_team_logo,
    team_short_code: home_team_short_code || home_team_name.slice(0, 3).toUpperCase() || null,
    team_rating:    fixture_data?.teams_rating?.home_team || null,
    coach_name:     home_team_coach_name,
    coach_avatar:   home_team_coach_avatar,
    lineup:         home_team_lineup,
    bench:          home_team_bench,
    formation:      fixture_data?.formations_j?.localteam_formation,
    substitutions:  home_team_subs
  }

  const away_team_obj: Team_Lineup = {
    team_name:      away_team_name,
    team_logo:      away_team_logo,
    team_short_code: away_team_short_code || away_team_short_code.slice(0, 3).toUpperCase() || null,
    team_rating:    fixture_data?.teams_rating?.away_team || null,
    coach_name:     away_team_coach_name,
    coach_avatar:   away_team_coach_avatar,
    lineup:         away_team_lineup,
    bench:          away_team_bench,
    formation:      fixture_data?.formations_j?.visitorteam_formation,
    substitutions:  away_team_subs
  }

  // [ℹ] generate [final] fixture object
  const fixture_object: Fixture_Lineups = {
    id: fixture_id,
    status: status,
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

async function get_target_fixture(
	fixture_id: number
): Promise<BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]> {
	// [ℹ] obtain target historic_fixtures [fixture_id]
	const queryName = 'REDIS_CACHE_LINEUPS_DATA_3';
	t0 = performance.now();
	const VARIABLES = {
		fixture_id: fixture_id
	};
	const response: BETARENA_HASURA_lineups_query = await initGrapQLClient().request(
		REDIS_CACHE_LINEUPS_DATA_3,
		VARIABLES
	);
	t1 = performance.now();
	logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

	return response.historic_fixtures;
}

async function get_target_player_data (
  playerIdsArr: number[]
): Promise < BETARENA_HASURA_SURGICAL_JSONB_scores_football_players[] >  {

  const VARIABLES = {
    playerIds: playerIdsArr
  }

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_LINEUPS_DATA_4";
  const response: BETARENA_HASURA_lineups_query = await initGrapQLClient().request (
    REDIS_CACHE_LINEUPS_DATA_4,
    VARIABLES
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response.scores_football_players;
}

async function generate_players_map (
  players_arr: BETARENA_HASURA_SURGICAL_JSONB_scores_football_players[]
): Promise < Map <number, BETARENA_HASURA_SURGICAL_JSONB_scores_football_players> > {
  const players_map = new Map <number, BETARENA_HASURA_SURGICAL_JSONB_scores_football_players>()

  // [ℹ] conversion to hashmap
  t0 = performance.now();
  for (const h_fixture of players_arr) {
    players_map.set(h_fixture.player_id, h_fixture);
  }
  t1 = performance.now();
  logs.push(`players_map generated with size: ${players_map.size}`)
  logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return players_map;
}