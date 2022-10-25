import { dev } from '$app/environment'

import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_HREFLANG_DATA } from '$lib/graphql/query';
import { 
  REDIS_CACHE_LINEUPS_DATA_0, 
  REDIS_CACHE_LINEUPS_DATA_1, 
  REDIS_CACHE_LINEUPS_DATA_2, 
  REDIS_CACHE_LINEUPS_DATA_4
} from '$lib/graphql/fixtures/lineups/query';

import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  BETARENA_HASURA_historic_fixtures
} from '$lib/models/hasura';

import type { 
  BETARENA_HASURA_lineups_query, 
  BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures, 
  BETARENA_HASURA_SURGICAL_JSONB_scores_football_players, 
  Fixture_Lineups, 
  Fixture_Player, 
  REDIS_CACHE_SINGLE_lineups_data, 
  REDIS_CACHE_SINGLE_lineups_translation, 
  Sub_Player, 
  Team_Lineup
} from '$lib/models/fixtures/lineups/types';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const CQ_Fixture_Lineups = new Bull (
  'CQ_Fixture_Lineups', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    },
    settings: settings
  }
);
const cacheQueueProcessName = "CQ_Fixture_Lineups"
const cacheTarget = "REDIS CACHE | fixture lineups (all)" // NOTE: current-seasons ONLY
const cache_data_addr = "fixture_lineups_data"
const cache_trans_addr = "fixture_lineups_trans"
// [ℹ] debug info
let logs = []
let t0;
let t1;

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function POST(): Promise < unknown > {

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    // NOTE: Cache data:
    // Only current_season fixtures should be cached and updated following 
    // the last 2 hours' update fixtures update logic.

    // NOTE: SEO Cache data:
    // => player_name
    // => team_name

    const langArray = await getHrefLang()
    await main_trans_and_seo(langArray)
    await main()

    for (const log of logs) {
      console.log(log)
    }

    return json({
      job_id: cacheTarget + " done!"
    })
  }
  // [ℹ] otherwise prod.
  else {
    // [ℹ] producers [JOBS]
    const job = await CQ_Fixture_Lineups.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }
  
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cache_data (
  league_id: number, 
  json_cache: REDIS_CACHE_SINGLE_lineups_data
) {
  try {
    await redis.hset(cache_data_addr, league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cache_data_addr}`, e);
  }
}

async function cache_translation (
  lang: string, 
  json_cache: REDIS_CACHE_SINGLE_lineups_translation
) {
  try {
    await redis.hset(cache_trans_addr, lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error(`❌ unable to cache ${cache_trans_addr}`, e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

CQ_Fixture_Lineups.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  const langArray = await getHrefLang()
  await main_trans_and_seo(langArray)
  await main()
  const t1 = performance.now();

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main () {

  /**
   * [ℹ] obtain target current season_id's
  */

  const current_seasons = await get_current_seasons()
  // eslint-disable-next-line prefer-const
  let current_seasons_arr: number[] = current_seasons?.scores_football_seasons_details.map(a => a.id)
  if (dev) current_seasons_arr = [19734] // [ℹ] manual update target seasons
  // if (dev) console.log(`current_seasons_arr`, current_seasons_arr)

  /**
   * [ℹ] obtain target historic_fixtures
   * [ℹ] convert to map
  */

  const h_fixtures_arr = await get_target_historic_fixtures(current_seasons_arr)
  const historic_fixtures_map = await generate_historic_fixtures_map(h_fixtures_arr)

  /**
   * [ℹ] obtain target football_players
   * [ℹ] convert to map
  */
  let football_player_ids: number[] = []
  for (const fixture of historic_fixtures_map.values()) {
    const lineup_ids = fixture?.lineup_j.map(p => p?.player_id)
    const bench_ids = fixture?.bench_j.map(p => p?.player_id)
    // const subs_ids = [
    //   ...fixture.substitutions_j.map(p => p.player_in_id),
    //   ...fixture.substitutions_j.map(p => p.player_out_id)
    // ]
    football_player_ids = [
      ...new Set(football_player_ids.concat(lineup_ids.concat(bench_ids)))
    ]
  }
  const player_data = await get_target_player_data(football_player_ids)
  const players_map = await generate_players_map(player_data)

  /**
   * [ℹ] data pre-processing
   * [ℹ] & persistance [END]
  */

  const cache_data_arr: Fixture_Lineups[] = []

  for (const [key, value] of historic_fixtures_map.entries()) {

    const fixture_id = value?.id;
    const home_team_id = value?.localteam_id_j;
    const away_team_id = value?.visitorteam_id_j;
    const status = value?.status_j;

    // [ℹ] home-team-vital-info
    const home_team_name = value?.home_team_name || null;
    const home_team_logo = value?.home_team_logo || null;
    const home_team_coach_name = value?.home_coach_j?.fullname || null;
    const home_team_coach_avatar = value?.home_coach_j?.image_path || null;
    const home_team_short_code = value?.localteam_short_code_j;
    // [ℹ] home-team lineup [init]
    const home_team_lineup: Fixture_Player[] = 
      value?.lineup_j == null 
      || value?.lineup_j.length == 0
        ? []
        : value?.lineup_j
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
      for (const event of value.events_j) {
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
      value?.bench_j == null 
      || value?.bench_j.length == 0
        ? []
        : value?.bench_j
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
      for (const event of value.events_j) {
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
      value?.substitutions_j == null 
      || value?.substitutions_j.length == 0
        ? []
        : value?.substitutions_j
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
    const away_team_name = value?.away_team_name;
    const away_team_logo = value?.away_team_logo;
    const away_team_coach_name = value?.away_coach_j?.fullname || null;
    const away_team_coach_avatar = value?.away_coach_j?.image_path || null;
    const away_team_short_code = value?.visitorteam_short_code_j;
    // [ℹ] away-team lineup [init]
    const away_team_lineup: Fixture_Player[] = 
      value?.lineup_j == null 
      || value?.lineup_j.length == 0
        ? []
        : value?.lineup_j
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
      for (const event of value.events_j) {
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
      value?.bench_j == null 
      || value?.bench_j.length == 0
        ? []
        : value?.bench_j
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
      for (const event of value.events_j) {
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
      value?.substitutions_j == null 
      || value?.substitutions_j.length == 0
        ? []
        : value?.substitutions_j
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
      team_rating:    value?.teams_rating?.home_team || null,
      coach_name:     home_team_coach_name,
      coach_avatar:   home_team_coach_avatar,
      lineup:         home_team_lineup,
      bench:          home_team_bench,
      formation:      value?.formations_j?.localteam_formation,
      substitutions:  home_team_subs
    }

    const away_team_obj: Team_Lineup = {
      team_name:      away_team_name,
      team_logo:      away_team_logo,
      team_short_code: away_team_short_code || away_team_short_code.slice(0, 3).toUpperCase() || null,
      team_rating:    value?.teams_rating?.away_team || null,
      coach_name:     away_team_coach_name,
      coach_avatar:   away_team_coach_avatar,
      lineup:         away_team_lineup,
      bench:          away_team_bench,
      formation:      value?.formations_j?.visitorteam_formation,
      substitutions:  away_team_subs
    }

    // [ℹ] generate [final] fixture object
    const fixture_object: Fixture_Lineups = {
      id: fixture_id,
      status: status,
      home: home_team_obj,
      away: away_team_obj,
      events: value?.events_j,
      team_ratings: value?.teams_rating
    }

    await cache_data(key, fixture_object)

    // [🐞]
    cache_data_arr.push(fixture_object)
  }

  // [🐞]
  if (dev) {
    const data = JSON.stringify(cache_data_arr, null, 4)
    fs.writeFile(`./datalog/${cacheQueueProcessName}.json`, data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return;
}

async function main_trans_and_seo (
  langArray :string[]
) {

  const res = await get_widget_translations()

  const fix_odds_translation_map = new Map <string, REDIS_CACHE_SINGLE_lineups_translation> ()

  /**
   * [ℹ] MAIN 
  */
  for (const lang_ of langArray) {

    const object: REDIS_CACHE_SINGLE_lineups_translation = {}
    object.lang = lang_

    const objectFixLineupTranslation = res.scores_fixture_lineup_translations
      .find(({ lang }) => lang === lang_)

    const objectFixPlayerPosTranslation = res.player_positions_translations
      .find(({ lang }) => lang === lang_)

    const objectFixGeneralTranslation = res.scores_general_translations
      .find(({ lang }) => lang === lang_)

    const mergedObj = {
      ...object, 
      ...objectFixLineupTranslation?.translations,
      ...objectFixPlayerPosTranslation?.position,
      ...objectFixGeneralTranslation?.widgets_no_data_available,
    }

    fix_odds_translation_map.set(lang_, mergedObj)
  }

  // [🐛] debug
  if (dev) {
    const data = JSON.stringify(fix_odds_translation_map.values(), null, 4)
    fs.writeFile('./datalog/main_trans_and_seo.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  // [ℹ] persist data
  t0 = performance.now();
  logs.push(`total lang's: ${fix_odds_translation_map.size}`)
  for (const [key, value] of fix_odds_translation_map.entries()) {
    await cache_translation(key, value);
  }
  t1 = performance.now();
  logs.push(`cache uplaod complete in: ${(t1 - t0) / 1000} sec`);

  return

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function get_current_seasons (
): Promise < BETARENA_HASURA_lineups_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_LINEUPS_DATA_0";
	const response: BETARENA_HASURA_lineups_query = await initGrapQLClient().request (
    REDIS_CACHE_LINEUPS_DATA_0
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}

async function get_target_historic_fixtures (
  seasonIdsArr: number[]
): Promise < BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[] > {

  const limit = 1000;
  let offset = 0;
  let total_limit;

  let h_fixtures_arr: BETARENA_HASURA_historic_fixtures[] = [] 
  let counter = 0

  // [ℹ] obtain target historic_fixtures
  const queryName = "REDIS_CACHE_LINEUPS_DATA_1";
  t0 = performance.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {

    const VARIABLES = {
      limit: limit,
      offset: offset,
      seasonIds: seasonIdsArr
    }
    
    const response: BETARENA_HASURA_lineups_query = await initGrapQLClient().request (
      REDIS_CACHE_LINEUPS_DATA_1,
      VARIABLES
    );

    h_fixtures_arr = h_fixtures_arr.concat(response.historic_fixtures)

    // [ℹ] exit loop
    if (offset >= total_limit) {
      // [🐛] debug
      if (dev) console.log(`exiting loop`)
      logs.push(`total limit: ${total_limit}`)
      logs.push(`fixtures gathered: ${h_fixtures_arr.length}`)
      logs.push(`exiting loop after ${counter} iterations`)
      break;
    }

    total_limit = response.historic_fixtures_aggregate.aggregate.totalCount;
    offset += limit;
    counter++
  }
  t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  // [🐛] debug
  // FIXME: some duplicates [?]
  /*
    const mainArrIds = []
    for (const i of h_fixtures_arr) {
      mainArrIds.push(i.id)
    }
    const duplicates = mainArrIds.filter((e, i, a) => a.indexOf(e) !== i) // [2, 4]
    logs.push(`duplicates: ${duplicates.length}`)

    if (dev) {
      const data = JSON.stringify(duplicates, null, 4)
      await fs.writeFile(`./datalog/duplicates_local_main.json`, data);
    }
  */

  return h_fixtures_arr;
}

async function generate_historic_fixtures_map (
  h_fixtures_arr: BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
): Promise < Map <number, BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures> > {
  const historic_fixtures_map = new Map <number, BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures>()

  // [ℹ] conversion to hashmap
  t0 = performance.now();
  for (const h_fixture of h_fixtures_arr) {
    historic_fixtures_map.set(h_fixture.id, h_fixture);
  }
  t1 = performance.now();
  logs.push(`historic_fixtures_map generated with size: ${historic_fixtures_map.size}`)
  logs.push(`Hashmap conversion completed in: ${(t1 - t0) / 1000} sec`);

  return historic_fixtures_map;
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

async function getHrefLang (
): Promise < string[] > {
  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  return langArray;
}

async function get_widget_translations (
): Promise < BETARENA_HASURA_lineups_query > {

  const t0 = performance.now();
  const queryName = "REDIS_CACHE_LINEUPS_DATA_2";
  const response: BETARENA_HASURA_lineups_query = await initGrapQLClient().request (
    REDIS_CACHE_LINEUPS_DATA_2
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  return response;
}