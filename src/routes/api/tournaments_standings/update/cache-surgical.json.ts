import { dev } from '$app/env'
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import fs from 'fs';
import { performance } from 'perf_hooks';
import Bull from 'bull';

import { 
  GET_LEAGUE_W_STANDINGS_INFO, 
  GET_LEAGUE_W_STANDINGS_INFO_2, 
  GET_TEAM_W_STATS_INFO_3 
} from '$lib/graphql/tournaments/standings/query';

import type { 
  BACKEND_tournament_standings_surgical_update,
  BETARENA_HASURA_tournament_standings_query,
  Cache_Single_Tournaments_League_Standings_Info_Data_Response,
  Standing_Team_Total_Away_Home
} from '$lib/models/tournaments/standings/types';
import type { 
  BETARENA_HASURA_scores_team_statistics_history,
  StandingsDatum 
} from '$lib/models/hasura';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueTourStand = new Bull (
  'cacheQueueTourStand', 
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
const cacheTarget = "REDIS CACHE | tournament standings surgical"
let logs = []

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function post({ request }): Promise < unknown > {

  const body = await request.json();
  if (dev) console.log(body);
  const dataSurgical = JSON.parse(JSON.stringify(body));
  
  // [ℹ] job producers
  const job = await cacheQueueTourStand.add(dataSurgical);

  console.log(`
    job_id: ${job.id}
  `)

  return {
    status: 200,
    body: { 
      job_id: job.id
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
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

/*
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
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueTourStand.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();
  // await surgicalDataUpdate()
  await surgicalDataUpdate_2(job.data);
  const t1 = performance.now();

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

// cacheQueueTourStand.on('completed', function (job, result) {
//   // Job completed with output result!
//   cacheQueueTourStand.obliterate({ force: true })
// })

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

/*

async function surgicalDataUpdate (dataUpdate: BACKEND_tournament_standings_surgical_update) {
  
  // [ℹ] get HASURA-DB response;
  const leagueIdsArr = dataUpdate.leagueSeasons.map(a => a.leagueId);

  logs.push(`num. of leagueIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of seasonIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of teamsIds: ${dataUpdate.teamsList.length}`);

  const VARIABLES_1 = {
    leagueIds: leagueIdsArr,
    teamIds: dataUpdate.teamsList
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
    const season_target = dataUpdate.leagueSeasons.find(( { leagueId } ) => leagueId == iterator.id).seasonId;

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

*/

async function surgicalDataUpdate_2 (dataUpdate: BACKEND_tournament_standings_surgical_update) { 
  
  // [ℹ] get HASURA-DB response;
  if (dataUpdate === undefined) {
    logs.push(`dataUpdate is undefined`)
    logs.push(`dataUpdate: ${dataUpdate}`)
    console.log("dataUpdate undefined!")
    return;
  }
  if (dataUpdate.leagueSeasons === undefined) {
    logs.push(`dataUpdate.leagueSeasons is undefined`)
    logs.push(`dataUpdate.leagueSeasons: ${dataUpdate?.leagueSeasons}`)
    console.log("dataUpdate.leagueSeasons undefined!")
    return;
  }
  const leagueIdsArr = dataUpdate.leagueSeasons.map(a => a.leagueId);

  logs.push(`num. of leagueIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of seasonIds: ${dataUpdate.leagueSeasons.length}`);
  logs.push(`num. of teamsIds: ${dataUpdate.teamsList.length}`);

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
  logs.push(`${queryName} completed in: ${(t1 - t0) / 1000} sec`);

  const final_obj_array: Cache_Single_Tournaments_League_Standings_Info_Data_Response[] = []

  let teamIdsArr: number[] = []

  // [ℹ] obtain all target teams []
  for (const iterator of response.scores_football_leagues_dev) {
    for (const season_main of iterator.seasons) {

      let season_standings_teams_list: StandingsDatum[];

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
        
      } else {

        const season_standings_hist = response.scores_football_standings_history_dev
        .find(( { id, season_id } ) => 
          id === season_main.league_id && 
          season_id === season_main.id
        );

        season_standings_teams_list = season_standings_hist?.data
      }

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
  logs.push(`${queryName2} completed in: ${(t3 - t2) / 1000} sec`);

  /*
    [ℹ] MAIN  
  */

  // [ℹ] generate standings data per / league_id
  for (const iterator of response.scores_football_leagues_dev) {

    const finalCacheObj: Cache_Single_Tournaments_League_Standings_Info_Data_Response = { }
    finalCacheObj.seasons = []
    finalCacheObj.league_id = iterator.id;

    // [ℹ] get all seasons for (this) league (tournament-id)
    for (const season_main of iterator.seasons) {

      let season_standings_teams_list: StandingsDatum[];
      let seasonCurrent = false;

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

        seasonCurrent = true

        // if (dev) console.log(`${season_main.id} is_current_season`);
        // if (dev) console.log(`season_standings_teams_list} is undefined: ${season_standings_teams_list}`);

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

      // [ℹ] generate (this season) team color-codes;
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
      /*
        console.log(
        `color-codes: ${season_color_codes}`
        )
        const data = JSON.stringify(season_color_codes, null, 4)
        fs.appendFile('./datalog/standingsDataGenerationAlt-COLORCODES.json', data, err => {
          if (err) {
            console.error(err);
          }
        });
      */

      // [ℹ] generate (this season) team equal points (home & away) views;
      const home_view_teams_map = new Map <number, string[]> ()
      const away_view_teams_map = new Map <number, string[]> ()

      for (const season_team of season_standings_teams_list) {

        const team_name = season_team.team_name;
        
        // [ℹ] dealing with positions of "home" teams

        const team_home_position: number = 
          season_team?.home?.points == null ||
          season_team?.home?.points == undefined 
            ? null
            : season_team?.home?.points;

        if (home_view_teams_map.has(team_home_position)) {
          const pos_arr = home_view_teams_map.get(team_home_position);
          pos_arr.push(team_name)
          pos_arr.sort()
          home_view_teams_map.set(team_home_position, pos_arr)
        } 
        else {
          const init_arr = []
          init_arr.push(team_name)
          init_arr.sort()
          home_view_teams_map.set(team_home_position, init_arr)
        }

        // [ℹ] dealing with positions of "away" teams
        
        const team_away_position: number = 
          season_team?.away?.points == null ||
          season_team?.away?.points == undefined 
            ? null
            : season_team?.away?.points;

        if (away_view_teams_map.has(team_away_position)) {
          const pos_arr = away_view_teams_map.get(team_away_position);
          pos_arr.push(team_name)
          pos_arr.sort()
          away_view_teams_map.set(team_away_position, pos_arr)
        } 
        else {
          const init_arr = []
          init_arr.push(team_name)
          init_arr.sort()
          away_view_teams_map.set(team_away_position, init_arr)
        }

      }

      const sortHomeViewAsc = new Map([...home_view_teams_map].sort((a, b) => b[0] - a[0]));
      const sortAwayViewAsc = new Map([...away_view_teams_map].sort((a, b) => b[0] - a[0]));

      let sortHomeViewAscArr = []
      let sortHomeAwayAscArr = []

      for (const [key, value] of sortHomeViewAsc.entries()) {
        sortHomeViewAscArr = sortHomeViewAscArr.concat(value)
      }
      for (const [key, value] of sortAwayViewAsc.entries()) {
        sortHomeAwayAscArr = sortHomeAwayAscArr.concat(value)
      }

      // [ℹ] generate (this season) team view objects (total | home | away);
      for (const season_team of season_standings_teams_list) {

        const team_logo: string = response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.logo_path;
        const team_name: string =
          response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == null ||
          response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == undefined
            ? season_team?.team_name
            : response_team.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name

        const target_team_stat = response_team.scores_team_statistics_dev.find( ({ team_id }) => team_id === season_team.team_id)
        const target_team_stat_hist = response_team.scores_team_statistics_history_dev.find( ({ team_id, season_id }) => team_id === season_team.team_id && season_id === season_main.id )

        let target_team_stats: BETARENA_HASURA_scores_team_statistics_history; // [ℹ] not correct type
        if (seasonCurrent) {
          target_team_stats = target_team_stat;
        }
        else {
          target_team_stats = target_team_stat_hist;
        }

        const team_winP: number = 
          target_team_stat?.winning_probability == null || 
          target_team_stat?.winning_probability == undefined
            ? null
            : target_team_stat?.winning_probability

        const team_home_position: number = 
          sortHomeViewAscArr.indexOf(team_name) + 1;

        const team_away_position: number = 
          sortHomeAwayAscArr.indexOf(team_name) + 1;

        // [🐛] debug
        /*
          if (team_name === "Manchester City") {
            console.log(
              `seasons_id: ${season_main?.id}`,
              `team_total_position: ${season_team?.position}`,
              `team_total_points: ${season_team?.points}`,
              `team_home_position: ${team_home_position}`,
              `team_home_position verify: ${season_team?.home?.points}`,
              `team_away_position: ${team_away_position}`,
              `team_away_position verify: ${season_team?.away?.points}`,
            )
          }
        */

        const team_total_color_code = season_team?.position == null ? 'black' : season_color_codes[season_team?.position.toString()]
        // const team_home_color_code = team_home_position == null ? 'black' : season_color_codes[team_home_position.toString()]
        // const team_away_color_code = team_away_position == null ? 'black' : season_color_codes[team_away_position.toString()]

        const team_total_ov15: number =
          target_team_stats?.data[0].goal_line?.over["1_5"]?.away == null ||
          target_team_stats?.data[0]?.goal_line?.over["1_5"]?.home == null 
            ? null
            : (target_team_stats?.data[0].goal_line?.over["1_5"]?.away + target_team_stats?.data[0]?.goal_line?.over["1_5"]?.home) / 2

        const team_total_ov25: number =
          target_team_stats?.data[0].goal_line?.over["2_5"]?.away == null ||
          target_team_stats?.data[0]?.goal_line?.over["2_5"]?.home == null
            ? null
            : (target_team_stats?.data[0].goal_line?.over["2_5"]?.away + target_team_stats?.data[0]?.goal_line?.over["2_5"]?.home) / 2

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
          games_played:   season_team?.overall?.games_played, // [ℹ] previously, .round_name
          won:            season_team?.overall?.won,
          draw:           season_team?.overall?.draw,
          lost:           season_team?.overall?.lost,
          gs:             season_team?.overall?.goals_scored,
          ga:             season_team?.overall?.goals_against,
          gavg:           team_total_gavg,
          cavg:           parseInt(target_team_stats?.data[0]?.avg_corners), // [📌 inaccurate with "multi-stage" season case, FIXME: TODO:]
          ycavg:          target_team_stats?.average_yellow_cards,
          ov15:           team_total_ov15,
          ov25:           team_total_ov25,
          winP:           team_winP,
          rf:             season_team?.recent_form
        }

        const team_obj_home: Standing_Team_Total_Away_Home = {
          team_logo:      team_logo,
          team_name:      team_name,
          color_code:     team_total_color_code,
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
          color_code:     team_total_color_code,
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
  if (dev) {
    const data = JSON.stringify(final_obj_array, null, 4)
    fs.writeFile('./datalog/standingsDataGenerationSurgicalAlt_NEW.json', data, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  return
}