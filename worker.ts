let throng = require('throng');
let Queue = require("bull");

// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 50;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
  // Connect to the named work queue
  let cacheQueueTourStand = new Queue('work', 'cacheQueueTourStand', 
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
  const cacheTarget = "REDIS CACHE | tournament standings surgical"

  // [ℹ] Example
  /*
    workQueue.process(maxJobsPerWorker, async (job) => {
      // This is an example job that just slowly reports on progress
      // while doing no work. Replace this with your own job logic.
      let progress = 0;

      // throw an error 5% of the time
      if (Math.random() < 0.05) {
        throw new Error("This job failed!")
      }

      while (progress < 100) {
        await sleep(50);
        progress += 1;
        job.progress(progress)
      }

      // A job can return values that will be stored in Redis as JSON
      // This return value is unused in this demo application.
      return { value: "This will be stored" };
    });
  */

  cacheQueueTourStand.process(async function (job, done) {
    // console.log(job.data.argumentList);
    // console.log(job.data)
  
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

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });