// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_LEAGUE_W_STANDINGS_INFO, GET_LEAGUE_W_STANDINGS_INFO_2, GET_TEAM_W_STATS_INFO_3 } from '$lib/graphql/tournaments/standings/query';

import type { 
  BACKEND_tournament_standings_surgical_update,
  BETARENA_HASURA_tournament_standings_query,
  Cache_Single_Tournaments_League_Standings_Info_Data_Response
} from '$lib/models/tournaments/standings/types';
import type { 
  Standing_Team_Total_Away_Home 
} from '$lib/models/tournaments/types';

import fs from 'fs';

// [❗] critical
import Bull from 'bull';
import type { StandingsDatum } from '$lib/models/hasura';
const settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueTourStand = new Bull('cacheQueueTourStand', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    }
  }, 
  settings
);

// [ℹ] global variable
let dataSurgical: BACKEND_tournament_standings_surgical_update = {
  "leagueSeasons": [
    {
      "leagueId": 755,
      "seasonId": 19275
    },
    {
      "leagueId": 1400,
      "seasonId": 20125
    },
    {
      "leagueId": 1169,
      "seasonId": 19842
    },
    {
      "leagueId": 1823,
      "seasonId": 19860
    },
    {
      "leagueId": 348,
      "seasonId": 19325
    },
    {
      "leagueId": 1579,
      "seasonId": 19714
    },
    {
      "leagueId": 770,
      "seasonId": 19421
    },
    {
      "leagueId": 767,
      "seasonId": 19545
    },
    {
      "leagueId": 687,
      "seasonId": 19958
    },
    {
      "leagueId": 184,
      "seasonId": 19808
    },
    {
      "leagueId": 678,
      "seasonId": 19339
    },
    {
      "leagueId": 764,
      "seasonId": 19267
    },
    {
      "leagueId": 1019,
      "seasonId": 19996
    },
    {
      "leagueId": 408,
      "seasonId": 19517
    },
    {
      "leagueId": 453,
      "seasonId": 19692
    },
    {
      "leagueId": 1172,
      "seasonId": 19487
    },
    {
      "leagueId": 402,
      "seasonId": 19561
    },
    {
      "leagueId": 920,
      "seasonId": 19484
    },
    {
      "leagueId": 1158,
      "seasonId": 19885
    },
    {
      "leagueId": 456,
      "seasonId": 19720
    },
    {
      "leagueId": 660,
      "seasonId": 19479
    },
    {
      "leagueId": 2491,
      "seasonId": 19993
    },
    {
      "leagueId": 474,
      "seasonId": 19879
    },
    {
      "leagueId": 265,
      "seasonId": 19796
    },
    {
      "leagueId": 2493,
      "seasonId": 19994
    },
    {
      "leagueId": 1703,
      "seasonId": 19262
    },
    {
      "leagueId": 1508,
      "seasonId": 19553
    },
    {
      "leagueId": 992,
      "seasonId": 19694
    },
    {
      "leagueId": 498,
      "seasonId": 19920
    },
    {
      "leagueId": 271,
      "seasonId": 19686
    },
    {
      "leagueId": 405,
      "seasonId": 19483
    },
    {
      "leagueId": 1073,
      "seasonId": 19349
    },
    {
      "leagueId": 286,
      "seasonId": 19450
    },
    {
      "leagueId": 2451,
      "seasonId": 19259
    },
    {
      "leagueId": 390,
      "seasonId": 19953
    },
    {
      "leagueId": 1161,
      "seasonId": 19884
    },
    {
      "leagueId": 97,
      "seasonId": 19765
    },
    {
      "leagueId": 1249,
      "seasonId": 19984
    },
    {
      "leagueId": 803,
      "seasonId": 19549
    },
    {
      "leagueId": 594,
      "seasonId": 19749
    },
    {
      "leagueId": 1711,
      "seasonId": 19318
    },
    {
      "leagueId": 1554,
      "seasonId": 19454
    },
    {
      "leagueId": 2457,
      "seasonId": 19585
    },
    {
      "leagueId": 1693,
      "seasonId": 19464
    },
    {
      "leagueId": 1701,
      "seasonId": 19597
    },
    {
      "leagueId": 1301,
      "seasonId": 19525
    },
    {
      "leagueId": 1819,
      "seasonId": 19859
    },
    {
      "leagueId": 797,
      "seasonId": 18814
    },
    {
      "leagueId": 1728,
      "seasonId": 19328
    },
    {
      "leagueId": 277,
      "seasonId": 19919
    },
    {
      "leagueId": 241,
      "seasonId": 20204
    },
    {
      "leagueId": 178,
      "seasonId": 20115
    },
    {
      "leagueId": 983,
      "seasonId": 19636
    },
    {
      "leagueId": 657,
      "seasonId": 19453
    },
    {
      "leagueId": 1710,
      "seasonId": 19447
    },
    {
      "leagueId": 696,
      "seasonId": 19391
    },
    {
      "leagueId": 989,
      "seasonId": 19679
    },
    {
      "leagueId": 1341,
      "seasonId": 19504
    },
    {
      "leagueId": 1642,
      "seasonId": 19446
    },
    {
      "leagueId": 699,
      "seasonId": 19523
    },
    {
      "leagueId": 1049,
      "seasonId": 19381
    },
    {
      "leagueId": 190,
      "seasonId": 20078
    },
    {
      "leagueId": 555,
      "seasonId": 19752
    },
    {
      "leagueId": 534,
      "seasonId": 19729
    },
    {
      "leagueId": 229,
      "seasonId": 19732
    },
    {
      "leagueId": 220,
      "seasonId": 19750
    },
    {
      "leagueId": 1224,
      "seasonId": 19637
    },
    {
      "leagueId": 1357,
      "seasonId": 19411
    },
    {
      "leagueId": 648,
      "seasonId": 19434
    },
    {
      "leagueId": 708,
      "seasonId": 19784
    },
    {
      "leagueId": 1565,
      "seasonId": 19482
    },
    {
      "leagueId": 666,
      "seasonId": 19428
    },
    {
      "leagueId": 1407,
      "seasonId": 19463
    },
    {
      "leagueId": 1699,
      "seasonId": 19554
    },
    {
      "leagueId": 1560,
      "seasonId": 20244
    },
    {
      "leagueId": 462,
      "seasonId": 19896
    },
    {
      "leagueId": 1694,
      "seasonId": 19351
    },
    {
      "leagueId": 1636,
      "seasonId": 20144
    },
    {
      "leagueId": 351,
      "seasonId": 19321
    },
    {
      "leagueId": 830,
      "seasonId": 19052
    },
    {
      "leagueId": 531,
      "seasonId": 19728
    },
    {
      "leagueId": 779,
      "seasonId": 19137
    },
    {
      "leagueId": 8,
      "seasonId": 19734
    },
    {
      "leagueId": 1689,
      "seasonId": 19435
    },
    {
      "leagueId": 345,
      "seasonId": 19444
    },
    {
      "leagueId": 1098,
      "seasonId": 19355
    },
    {
      "leagueId": 1333,
      "seasonId": 19529
    },
    {
      "leagueId": 776,
      "seasonId": 19524
    }
  ],
  "teamsList": [
    237829,
    228036,
    22362,
    226081,
    8503,
    230749,
    456,
    6905,
    15277,
    2544,
    239006,
    5615,
    208,
    5783,
    5756,
    3845,
    10661,
    12306,
    6348,
    7216,
    9129,
    261066,
    17579,
    22183,
    1228,
    9966,
    12848,
    9426,
    2538,
    12916,
    261449,
    155526,
    3593,
    235332,
    18063,
    263241,
    133490,
    2356,
    237160,
    5873,
    8912,
    254612,
    4288,
    548,
    346,
    22315,
    3992,
    13312,
    18975,
    13843,
    4036,
    25642,
    15991,
    4076,
    5876,
    585,
    237459,
    15140,
    239503,
    27452,
    69954,
    237290,
    30193,
    237227,
    15163,
    234929,
    260869,
    10458,
    10515,
    260676,
    9085,
    261871,
    7565,
    5705,
    5702,
    237545,
    261874,
    261865,
    258773,
    30117,
    234482,
    239005,
    6272,
    239347,
    239392,
    5625,
    256995,
    246271,
    9891,
    238997,
    3514,
    15205,
    236663,
    232571,
    254320,
    260674,
    12322,
    15153,
    15139,
    149672,
    7931,
    239639,
    12570,
    10493,
    3830,
    6070,
    10982,
    13222,
    228486,
    228036,
    6141,
    262700,
    5829,
    652,
    5335,
    12220,
    9323,
    3444,
    14602,
    138802,
    14627,
    235856,
    14682,
    41,
    236570,
    236564,
    236553,
    128595,
    522,
    605,
    10486,
    8132,
    9917,
    10491,
    10443,
    10435,
    237456,
    3579,
    3246,
    10424,
    237444,
    6740,
    247577,
    10444,
    10473,
    15154,
    237449,
    237454,
    69955,
    178,
    10428,
    10465,
    2673,
    237374,
    3639,
    51,
    238918,
    236774,
    10456,
    237374,
    10444,
    10521,
    7784,
    24048,
    6913,
    10481,
    3599,
    237447,
    10423,
    623,
    234259,
    8378,
    9946,
    6213,
    7189,
    261045,
    128594,
    3408,
    132077,
    22417,
    248279,
    10465,
    230763,
    2837,
    12073,
    15319,
    3300,
    15160,
    6272,
    3992,
    3625,
    2593,
    2852,
    10671,
    27674,
    255445,
    1069,
    9037,
    261064,
    17558,
    248142,
    1797,
    14870,
    256837,
    132584,
    3537,
    262321,
    256829,
    140516,
    3531,
    4406,
    27604,
    11108,
    261859,
    211,
    11360,
    2847,
    255158,
    9208,
    8697,
    611,
    10759,
    8524,
    10661,
    239392,
    5919,
    13264,
    3216,
    8607,
    261027,
    2655,
    5748,
    731,
    247574,
    15154,
    238833,
    261116,
    24049,
    255288,
    15030,
    234485,
    256588,
    239638,
    15763,
    10493,
    260674,
    10495,
    238198,
    226537,
    7571,
    5712,
    5491,
    22502,
    27895,
    226539,
    60401,
    7740,
    10976,
    2860,
    15171,
    15644,
    146475,
    2581,
    237568,
    237450,
    6062,
    30399,
    3658,
    239625,
    76142,
    9563,
    236557,
    10458,
    5615,
    15187,
    15153,
    15341,
    1167,
    24050,
    3221,
    234929,
    7708,
    4448,
    15631,
    1114,
    28053,
    262699,
    27859,
    228036,
    3293,
    3497,
    17802,
    3422,
    6285,
    228582,
    261609,
    226489,
    15121,
    10773,
    255433,
    18045,
    238093,
    238094,
    236563,
    229713,
    8271,
    4092,
    10427,
    12584,
    5476,
    10509,
    178,
    10443,
    239242,
    14825,
    5526,
    10423,
    237452,
    16496,
    237458,
    10436,
    10477,
    15153,
    132918,
    237455,
    7427,
    10436,
    1654,
    10435,
    6318,
    237449,
    607,
    19,
    239050,
    236470,
    239639,
    237448,
    69955,
    10424,
    4270,
    24037,
    1268,
    10433,
    6157,
    132918,
    1479,
    460,
    13996,
    13842,
    14401,
    7289,
    5992,
    234974,
    263278
  ]
}
const cacheTarget = "REDIS CACHE | tournament standings surgical"
const logs = []

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post({ request }): Promise < unknown > {

  // const body = await request.json();
  // if (dev) console.log(body);
  // dataSurgical = JSON.parse(JSON.stringify(body));
  
  // [ℹ] job producers
  const job = await cacheQueueTourStand.add();

  return {
    status: 200,
    body: { 
      job_id: job.id,
      message: "✅ Success \ntournaments_standings cache data updated!"
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  PERSIST CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheData (league_id: number, json_cache: Cache_Single_Tournaments_League_Standings_Info_Data_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('tournament_standings_data', league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache tournament_standings_data', e);
  }
}

async function getCacheData (league_id: string): Promise < Cache_Single_Tournaments_League_Standings_Info_Data_Response | Record < string, never > > {
  try {
    const cached: string = await redis.hget('tournament_standings_data', league_id);

    if (cached) {
      // [🐛] debug;
      if (dev) console.info(`✅ tournament_standings_data cache data retrieved`);
      const parsed: Cache_Single_Tournaments_League_Standings_Info_Data_Response = JSON.parse(cached);
      return parsed;
    }
  } 
  catch (e) {
    console.error("❌ uh-oh! tournament_standings_data cache error", e);
    return
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueTourStand.process(async function (job, done) {
  // console.log(job.data)
  // console.log(job.data.argumentList);

  /* 
  do stuff
  */

  const t0 = performance.now();
  // await surgicalDataUpdate()
  await surgicalDataUpdate_2();
  const t1 = performance.now();

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${((t1 - t0) / 1000).toFixed(2)} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

/**
 * [ℹ] Tournaments Page Data Generation Methods
*/

async function surgicalDataUpdate () {
  
  // [ℹ] get HASURA-DB response;
  const leagueIdsArr = dataSurgical.leagueSeasons.map(a => a.leagueId);

  logs.push(`num. of leagueIds: ${dataSurgical.leagueSeasons.length}`);
  logs.push(`num. of seasonIds: ${dataSurgical.leagueSeasons.length}`);
  logs.push(`num. of teamsIds: ${dataSurgical.teamsList.length}`);

  const VARIABLES_1 = {
    leagueIds: leagueIdsArr,
    teamIds: dataSurgical.teamsList
  }
  
  const t0 = performance.now();
  const queryName = "GET_LEAGUE_W_STANDINGS_INFO";
	const response: BETARENA_HASURA_tournament_standings_query = await initGrapQLClient().request (
    GET_LEAGUE_W_STANDINGS_INFO,
    VARIABLES_1
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  const final_obj_array: Cache_Single_Tournaments_League_Standings_Info_Data_Response[] = []
  // [ℹ] generate per league
  for (const iterator of response.scores_football_leagues_dev) {

    const finalCacheObj: Cache_Single_Tournaments_League_Standings_Info_Data_Response = { }
    finalCacheObj.seasons = []

    finalCacheObj.league_id = iterator.id;

    // [ℹ] get (target) season for (this) leagueId / tournamentId
    const season_target = dataSurgical.leagueSeasons.find(( { leagueId } ) => leagueId == iterator.id).seasonId;

    // TODO: make use of the "current_standings" instead
    const season_standings = response.scores_football_standings_dev
      .find(( { id } ) =>
        id === iterator.id
      );

    // const season_standings_hist = response.scores_football_standings_history_dev
    //   .find(( { id, season_id } ) => 
    //     id === iterator.id && 
    //     season_id === season_target
    //   );

    // [🐛] debug
    // console.log(
    //   `league_id: ${league_target?.id}`,
    //   `season_id: ${season_main?.id}`,
    //   `season standings-length: ${season_standings_hist?.data.length}`)

    const season_standings_teams_list = season_standings?.data
      .find(( { name, season_id } ) => 
        name === "Regular Season" &&
        season_id === season_target
      ).standings?.data;

    // const season_standings_teams_list = season_standings_hist?.data

    const season_gen_list_total: Standing_Team_Total_Away_Home[] = []
    const season_gen_list_home:  Standing_Team_Total_Away_Home[] = []
    const season_gen_list_away:  Standing_Team_Total_Away_Home[] = []
    
    // [ℹ] validation
    if (season_standings_teams_list == undefined ||
        season_standings_teams_list == null) {
      continue;
    }

    // [ℹ] generate (this) season color codes;
    const season_color_codes: {
      [key: number]: string;
    } = { }
    for (const season_team of season_standings_teams_list) {

      const team_pos: number = season_team?.position;

      const team_color_code =
      season_team.result == null && season_team.result == undefined
        ? 'transparent'
        : response.color_codes_league_standings_positions_dev.find(( { sports } ) => sports === "football").color_codes[season_team.result.toString()]

      season_color_codes[team_pos] = team_color_code
    }

    // [ℹ] handling teams info
    for (const season_team of season_standings_teams_list) {

      // [ℹ] skip teams not part of the update
      if (!dataSurgical.teamsList.includes(season_team.team_id)) {
        continue;
      }

      // [ℹ] proceed with team info generation (update)
      const team_logo: string = response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.logo_path;
      const team_name: string =
        response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == null ||
        response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == undefined
          ? season_team?.team_name
          : response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name

      const target_team_stat      = response.scores_team_statistics_dev.find( ({ team_id }) => team_id === season_team.team_id)
      const target_team_stat_hist = response.scores_team_statistics_history_dev.find( ({ team_id, season_id }) => team_id === season_team.team_id && season_id === season_target )

      const team_winP: number = 
        target_team_stat?.winning_probability == null || 
        target_team_stat?.winning_probability == undefined
          ? null
          : target_team_stat?.winning_probability

      const team_home_position: number = 
        season_team?.home?.points == null ||
        season_team?.home?.points == undefined 
          ? null
          : season_standings_teams_list.filter(( { home } ) => home?.points >= season_team?.home?.points).length

      const team_away_position: number = 
        season_team?.away?.points == null ||
        season_team?.away?.points == undefined 
          ? null
          : season_standings_teams_list.filter(( { away } ) => away?.points >= season_team?.away?.points).length

      // [🐛] debug
      // if (team_name === "Manchester City") {
      //   console.log(
      //     `seasons_id: ${season_main?.id}`,
      //     `team_total_position: ${season_team?.position}`,
      //     `team_total_points: ${season_team?.points}`,
      //     `team_home_position: ${team_home_position}`,
      //     `team_home_position verify: ${season_team?.home?.points}`,
      //     `team_away_position: ${team_away_position}`,
      //     `team_away_position verify: ${season_team?.away?.points}`,
      //   )
      // }

      const team_total_color_code = season_team?.position == null ? 'black' : season_color_codes[season_team?.position.toString()]
      const team_home_color_code = team_home_position == null ? 'black' : season_color_codes[team_home_position.toString()]
      const team_away_color_code = team_away_position == null ? 'black' : season_color_codes[team_away_position.toString()]

      const team_total_ov15: number =
        target_team_stat_hist?.data[0].goal_line?.over["1_5"]?.away == null ||
        target_team_stat_hist?.data[0]?.goal_line?.over["1_5"]?.home == null
          ? null
          : (target_team_stat_hist?.data[0].goal_line?.over["1_5"]?.away + target_team_stat_hist?.data[0]?.goal_line?.over["1_5"]?.home) / 2

      const team_total_ov25: number =
        target_team_stat_hist?.data[0].goal_line?.over["2_5"]?.away == null ||
        target_team_stat_hist?.data[0]?.goal_line?.over["2_5"]?.home == null
          ? null
          : (target_team_stat_hist?.data[0].goal_line?.over["2_5"]?.away + target_team_stat_hist?.data[0]?.goal_line?.over["2_5"]?.home) / 2

      const team_total_gavg: number = 
        season_team?.round_name == null ||
        season_team?.overall?.goals_scored == null
          ? null
          : season_team?.overall?.goals_scored / season_team?.round_name;

      const team_home_gavg: number = 
        season_team?.home?.games_played == null ||
        season_team?.home?.goals_scored == null
          ? null
          : season_team?.home?.goals_scored / season_team?.home?.games_played;

      const team_away_gavg: number = 
        season_team?.away?.games_played == null ||
        season_team?.away?.goals_scored == null
          ? null
          : season_team?.away?.goals_scored / season_team?.away?.games_played;
      
      const team_obj_total: Standing_Team_Total_Away_Home = {
        team_logo:      team_logo,
        team_name:      team_name,
        color_code:     team_total_color_code,
        points:         season_team?.points,
        position:       season_team?.position,
        games_played:   season_team?.round_name,
        won:            season_team?.overall?.won,
        draw:           season_team?.overall?.draw,
        lost:           season_team?.overall?.lost,
        gs:             season_team?.overall?.goals_scored,
        ga:             season_team?.overall?.goals_against,
        gavg:           team_total_gavg,
        cavg:           parseInt(target_team_stat_hist?.data[0]?.avg_corners), // [📌 inaccurate with "multi-stage" season case, FIXME: TODO:]
        ycavg:          target_team_stat_hist?.average_yellow_cards,
        ov15:           team_total_ov15,
        ov25:           team_total_ov25,
        winP:           team_winP,
        rf:             season_team?.recent_form
      }

      const team_obj_home: Standing_Team_Total_Away_Home = {
        team_logo:      team_logo,
        team_name:      team_name,
        color_code:     team_home_color_code,
        points:         season_team?.home?.points,
        position:       team_home_position, // season_team?.home?.points
        games_played:   season_team?.home?.games_played,
        won:            season_team?.home?.won,
        draw:           season_team?.home?.draw,
        lost:           season_team?.home?.lost,
        gs:             season_team?.home?.goals_scored,
        ga:             season_team?.home?.goals_against,
        gavg:           team_home_gavg,
        cavg:           null,
        ycavg:          null,
        ov15:           null,
        ov25:           null,
        winP:           team_winP,
        rf:             null
      }

      const team_obj_away: Standing_Team_Total_Away_Home = {
        team_logo:      team_logo,
        team_name:      team_name,
        color_code:     team_away_color_code,
        points:         season_team?.away?.points,
        position:       team_away_position, // season_team?.away?.points
        games_played:   season_team?.away?.games_played,
        won:            season_team?.away?.won,
        draw:           season_team?.away?.draw,
        lost:           season_team?.away?.lost,
        gs:             season_team?.away?.goals_scored,
        ga:             season_team?.away?.goals_against,
        gavg:           team_away_gavg,
        cavg:           null,
        ycavg:          null,
        ov15:           null,
        ov25:           null,
        winP:           team_winP,
        rf:             null
      }

      season_gen_list_total.push(team_obj_total)
      season_gen_list_home.push(team_obj_home)
      season_gen_list_away.push(team_obj_away)
    }
      
    // [ℹ] re-ordering of team-position for each TOTAL | HOME | AWAY view
    const nullPosTotal = season_gen_list_total.filter(( { position } ) => position == null).length
    const nullPosHome  = season_gen_list_home.filter(( { position } ) => position == null).length
    const nullPosAway  = season_gen_list_away.filter(( { position } ) => position == null).length

    if (nullPosTotal == 0) {
      season_gen_list_total.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
    }
    if (nullPosHome == 0) {
      season_gen_list_home.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
    }
    if (nullPosAway == 0) {
      season_gen_list_away.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
    }

    // [ℹ] get existing cached leagues
    const cachedLeague = await getCacheData(finalCacheObj.league_id.toString());

    // [ℹ] validation cache existance
    if (cachedLeague != null) {

      // [ℹ] update target seasonId
      const seasonCacheCheck = cachedLeague.seasons.filter( ({ season_id }) => season_id === season_target).length
      if (seasonCacheCheck == 0) {
        cachedLeague.seasons.push(
          {
            season_id:    season_target,
            total:        season_gen_list_total,
            home:         season_gen_list_home,
            away:         season_gen_list_away
          }
        )
        finalCacheObj.seasons = cachedLeague.seasons

      } 
      // [ℹ] leagueId exists
      else {
        const omitSeasonId = cachedLeague.seasons.filter( ({ season_id }) => season_id !== season_target)
        const omittedSeasonId = cachedLeague.seasons.find( ({ season_id }) => season_id === season_target)
        const omitted_season_gen_list_total = [...new Map((omittedSeasonId.total.concat(season_gen_list_total)).map(item => [item.team_name, item])).values()]
        const omitted_season_gen_list_home = [...new Map((omittedSeasonId.home.concat(season_gen_list_home)).map(item => [item.team_name, item])).values()]
        const omitted_season_gen_list_away = [...new Map((omittedSeasonId.away.concat(season_gen_list_away)).map(item => [item.team_name, item])).values()]

        // [ℹ] re-ordering of team-position for each TOTAL | HOME | AWAY view
        const nullPosTotal = omitted_season_gen_list_total.filter(( { position } ) => position == null).length
        const nullPosHome  = omitted_season_gen_list_home.filter(( { position } ) => position == null).length
        const nullPosAway  = omitted_season_gen_list_away.filter(( { position } ) => position == null).length
    
        if (nullPosTotal == 0) {
          omitted_season_gen_list_total.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
        }
    
        if (nullPosHome == 0) {
          omitted_season_gen_list_home.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
        }
    
        if (nullPosAway == 0) {
          omitted_season_gen_list_away.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
        }

        omitSeasonId.push (
          {
            season_id:    season_target,
            total:        omitted_season_gen_list_total,
            home:         omitted_season_gen_list_home,
            away:         omitted_season_gen_list_away
          }
        )
        finalCacheObj.seasons = omitSeasonId

      }
    } else {
      // [ℹ] data push (sub)
      finalCacheObj.seasons.push (
        {
          season_id:    season_target,
          total:        season_gen_list_total,
          home:         season_gen_list_home,
          away:         season_gen_list_away
        }
      )
    }
        
    final_obj_array.push(finalCacheObj)

    await cacheData (finalCacheObj.league_id , finalCacheObj);
  }

  // [🐛] debug
  const data = JSON.stringify(final_obj_array, null, 4)
  fs.writeFile('./datalog/standingsDataGenerationSurgicalAlt.json', data, err => {
    if (err) {
      console.error(err);
    }
  });

  return
}

async function surgicalDataUpdate_2 () {
  
  // [ℹ] get HASURA-DB response;
  const leagueIdsArr = dataSurgical.leagueSeasons.map(a => a.leagueId);

  logs.push(`num. of leagueIds: ${dataSurgical.leagueSeasons.length}`);
  logs.push(`num. of seasonIds: ${dataSurgical.leagueSeasons.length}`);
  logs.push(`num. of teamsIds: ${dataSurgical.teamsList.length}`);

  const VARIABLES_1 = {
    leagueIds: leagueIdsArr
  }
  
  const t0 = performance.now();
  const queryName = "GET_LEAGUE_W_STANDINGS_INFO_2";
	const response: BETARENA_HASURA_tournament_standings_query = await initGrapQLClient().request (
    GET_LEAGUE_W_STANDINGS_INFO_2,
    VARIABLES_1
  );
  const t1 = performance.now();
  logs.push(`${queryName} completed in: ${((t1 - t0) / 1000).toFixed(2)} sec`);

  const final_obj_array: Cache_Single_Tournaments_League_Standings_Info_Data_Response[] = []

  let teamIdsArr: number[] = []

  // [ℹ] obtain all target teams []
  for (const iterator of response.scores_football_leagues_dev) {
    for (const season_main of iterator.seasons) {

      const season_standings = response.scores_football_standings_history_dev
        .find(( { id, season_id } ) => id === season_main.league_id && season_id === season_main.id)

      const season_standings_teams_list = season_standings?.data

      if (season_standings_teams_list == undefined ||
          season_standings_teams_list == null) {
        continue;
      }

      teamIdsArr = teamIdsArr.concat(season_standings_teams_list.map(a => a.team_id));
    }
  }

  // console.log(teamIdsArr.includes(undefined))
  teamIdsArr = teamIdsArr.filter(element => {
    return element !== undefined
  });

  teamIdsArr = [...new Set(teamIdsArr)]
  logs.push(`num. of teamIdsArr: ${teamIdsArr.length}`);

  const VARIABLES_2 = {
    teamIds: teamIdsArr
  }

  const t2 = performance.now();
  const queryName2 = "GET_TEAM_W_STATS_INFO_3";
	const response_team: BETARENA_HASURA_tournament_standings_query = await initGrapQLClient().request (
    GET_TEAM_W_STATS_INFO_3,
    VARIABLES_2
  );
  const t3 = performance.now();
  logs.push(`${queryName2} completed in: ${((t3 - t2) / 1000).toFixed(2)} sec`);

  // [ℹ] generate per leagueId
  for (const iterator of response.scores_football_leagues_dev) {

    const finalCacheObj: Cache_Single_Tournaments_League_Standings_Info_Data_Response = { }
    finalCacheObj.seasons = []
    finalCacheObj.league_id = iterator.id;

    // [ℹ] get all seasons for (this) league (tournament-id)
    for (const season_main of iterator.seasons) {

      let season_standings_teams_list: StandingsDatum[];

      // [ℹ] check if for "current-season"
      if (season_main.is_current_season) {

        const season_standings = response.scores_football_standings_dev
          .find(( { id } ) =>
            id === iterator.id
          );

        season_standings_teams_list = season_standings?.data
          .find(( { name, season_id } ) => 
            name === "Regular Season" &&
            season_id === season_main.id
          ).standings?.data;

        console.log(`${season_main.id} is_current_season`);
        console.log(`season_standings_teams_list is undefined: ${season_standings_teams_list}`);

      } else {

        const season_standings_hist = response.scores_football_standings_history_dev
          .find(( { id, season_id } ) => 
            id === season_main.league_id && 
            season_id === season_main.id
          );

        season_standings_teams_list = season_standings_hist?.data
      }

      const season_gen_list_total: Standing_Team_Total_Away_Home[] = []
      const season_gen_list_home:  Standing_Team_Total_Away_Home[] = []
      const season_gen_list_away:  Standing_Team_Total_Away_Home[] = []

      if (season_standings_teams_list == undefined ||
          season_standings_teams_list == null) {
        continue;
      }

      // [ℹ] generate (this season) color codes;
      const season_color_codes: {
        [key: number]: string;
      } = { }
      for (const season_team of season_standings_teams_list) {

        const team_pos: number = season_team?.position;

        const team_color_code =
        season_team.result == null && season_team.result == undefined
          ? 'transparent'
          : response.color_codes_league_standings_positions_dev.find(( { sports } ) => sports === "football").color_codes[season_team.result.toString()]

        season_color_codes[team_pos] = team_color_code
      }

      // [🐛] debug
      // console.log(
      // `color-codes: ${season_color_codes}`
      // )

      // [🐛] debug
      // const data = JSON.stringify(season_color_codes, null, 4)
      // fs.appendFile('./datalog/standingsDataGenerationAlt-COLORCODES.json', data, err => {
      //   if (err) {
      //     console.error(err);
      //   }
      // });

      for (const season_team of season_standings_teams_list) {

        const team_logo: string = response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.logo_path;
        const team_name: string =
          response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == null ||
          response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == undefined
            ? season_team?.team_name
            : response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name

        const target_team_stat = response_team.scores_team_statistics_dev.find( ({ team_id }) => team_id === season_team.team_id)
        const target_team_stat_hist = response_team.scores_team_statistics_history_dev.find( ({ team_id, season_id }) => team_id === season_team.team_id && season_id === season_main.id )

        const team_winP: number = 
          target_team_stat?.winning_probability == null || 
          target_team_stat?.winning_probability == undefined
            ? null
            : target_team_stat?.winning_probability

        const team_home_position: number = 
          season_team?.home?.points == null ||
          season_team?.home?.points == undefined 
            ? null
            : season_standings_teams_list.filter(( { home } ) => home?.points >= season_team?.home?.points).length

        const team_away_position: number = 
          season_team?.away?.points == null ||
          season_team?.away?.points == undefined 
            ? null
            : season_standings_teams_list.filter(( { away } ) => away?.points >= season_team?.away?.points).length

        // [🐛] debug
        // if (team_name === "Manchester City") {
        //   console.log(
        //     `seasons_id: ${season_main?.id}`,
        //     `team_total_position: ${season_team?.position}`,
        //     `team_total_points: ${season_team?.points}`,
        //     `team_home_position: ${team_home_position}`,
        //     `team_home_position verify: ${season_team?.home?.points}`,
        //     `team_away_position: ${team_away_position}`,
        //     `team_away_position verify: ${season_team?.away?.points}`,
        //   )
        // }

        const team_total_color_code = season_team?.position == null ? 'black' : season_color_codes[season_team?.position.toString()]
        const team_home_color_code = team_home_position == null ? 'black' : season_color_codes[team_home_position.toString()]
        const team_away_color_code = team_away_position == null ? 'black' : season_color_codes[team_away_position.toString()]

        const team_total_ov15: number =
          target_team_stat_hist?.data[0].goal_line?.over["1_5"]?.away == null ||
          target_team_stat_hist?.data[0]?.goal_line?.over["1_5"]?.home == null
            ? null
            : (target_team_stat_hist?.data[0].goal_line?.over["1_5"]?.away + target_team_stat_hist?.data[0]?.goal_line?.over["1_5"]?.home) / 2

        const team_total_ov25: number =
          target_team_stat_hist?.data[0].goal_line?.over["2_5"]?.away == null ||
          target_team_stat_hist?.data[0]?.goal_line?.over["2_5"]?.home == null
            ? null
            : (target_team_stat_hist?.data[0].goal_line?.over["2_5"]?.away + target_team_stat_hist?.data[0]?.goal_line?.over["2_5"]?.home) / 2

        const team_total_gavg: number = 
          season_team?.round_name == null ||
          season_team?.overall?.goals_scored == null
            ? null
            : season_team?.overall?.goals_scored / season_team?.round_name;

        const team_home_gavg: number = 
          season_team?.home?.games_played == null ||
          season_team?.home?.goals_scored == null
            ? null
            : season_team?.home?.goals_scored / season_team?.home?.games_played;

        const team_away_gavg: number = 
          season_team?.away?.games_played == null ||
          season_team?.away?.goals_scored == null
            ? null
            : season_team?.away?.goals_scored / season_team?.away?.games_played;
        
        const team_obj_total: Standing_Team_Total_Away_Home = {
          team_logo:      team_logo,
          team_name:      team_name,
          color_code:     team_total_color_code,
          points:         season_team?.points,
          position:       season_team?.position,
          games_played:   season_team?.round_name,
          won:            season_team?.overall?.won,
          draw:           season_team?.overall?.draw,
          lost:           season_team?.overall?.lost,
          gs:             season_team?.overall?.goals_scored,
          ga:             season_team?.overall?.goals_against,
          gavg:           team_total_gavg,
          cavg:           parseInt(target_team_stat_hist?.data[0]?.avg_corners), // [📌 inaccurate with "multi-stage" season case, FIXME: TODO:]
          ycavg:          target_team_stat_hist?.average_yellow_cards,
          ov15:           team_total_ov15,
          ov25:           team_total_ov25,
          winP:           team_winP,
          rf:             season_team?.recent_form
        }

        const team_obj_home: Standing_Team_Total_Away_Home = {
          team_logo:      team_logo,
          team_name:      team_name,
          color_code:     team_home_color_code,
          points:         season_team?.home?.points,
          position:       team_home_position, // season_team?.home?.points
          games_played:   season_team?.home?.games_played,
          won:            season_team?.home?.won,
          draw:           season_team?.home?.draw,
          lost:           season_team?.home?.lost,
          gs:             season_team?.home?.goals_scored,
          ga:             season_team?.home?.goals_against,
          gavg:           team_home_gavg,
          cavg:           null,
          ycavg:          null,
          ov15:           null,
          ov25:           null,
          winP:           team_winP,
          rf:             null
        }

        const team_obj_away: Standing_Team_Total_Away_Home = {
          team_logo:      team_logo,
          team_name:      team_name,
          color_code:     team_away_color_code,
          points:         season_team?.away?.points,
          position:       team_away_position, // season_team?.away?.points
          games_played:   season_team?.away?.games_played,
          won:            season_team?.away?.won,
          draw:           season_team?.away?.draw,
          lost:           season_team?.away?.lost,
          gs:             season_team?.away?.goals_scored,
          ga:             season_team?.away?.goals_against,
          gavg:           team_away_gavg,
          cavg:           null,
          ycavg:          null,
          ov15:           null,
          ov25:           null,
          winP:           team_winP,
          rf:             null
        }

        season_gen_list_total.push(team_obj_total)
        season_gen_list_home.push(team_obj_home)
        season_gen_list_away.push(team_obj_away)
      }   
      
      // [ℹ] re-ordering of team-position for each TOTAL | HOME | AWAY view
      const nullPosTotal = season_gen_list_total.filter(( { position } ) => position == null).length
      const nullPosHome  = season_gen_list_home.filter(( { position } ) => position == null).length
      const nullPosAway  = season_gen_list_away.filter(( { position } ) => position == null).length

      if (nullPosTotal == 0) {
        season_gen_list_total.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
      }

      if (nullPosHome == 0) {
        season_gen_list_home.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
      }

      if (nullPosAway == 0) {
        season_gen_list_away.sort((a, b) => parseFloat(a.position.toString()) - parseFloat(b.position.toString()));
      }

      finalCacheObj.seasons.push (
        {
          season_id:    season_main.id,
          total:        season_gen_list_total,
          home:         season_gen_list_home,
          away:         season_gen_list_away
        }
      )

    }

    final_obj_array.push(finalCacheObj)

    await cacheData (finalCacheObj.league_id , finalCacheObj);
  }

  // [🐛] debug
  const data = JSON.stringify(final_obj_array, null, 4)
  fs.writeFile('./datalog/standingsDataGenerationSurgicalAlt_NEW.json', data, err => {
    if (err) {
      console.error(err);
    }
  });

  return
}