// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_LEAGUE_INFO_FULL_DATA } from '$lib/graphql/tournaments/query';

import type { 
  Cache_Single_Tournaments_League_Standings_Info_Data_Response, 
  Cache_Single_Tournaments_League_Standings_Translation_Data_Response, 
  Hasura_League_Info_Widget_Data_Response, 
  Standing_Team_Total_Away_Home 
} from '$lib/models/tournaments/types';

import fs from 'fs';

// [❗] critical
import Bull from 'bull';

const cacheQueueTourStand = new Bull('cacheQueueTourStand', import.meta.env.VITE_REDIS_CONNECTION_URL.toString())

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise < unknown > {
  
  // [ℹ] job producers
  
  const job = await cacheQueueTourStand.add();

  // [ℹ] should never happen;
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

async function cacheTournamentsStandingsDataAlt (league_id: number, json_cache: Cache_Single_Tournaments_League_Standings_Info_Data_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('tournament_standings_data', league_id, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache tournament_standings_data', e);
  }
}

async function cacheStandingsTranslationData (lang: string, json_cache: Cache_Single_Tournaments_League_Standings_Translation_Data_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('tournament_standings_t', lang, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache tournament_standings_t', e);
  }
}

async function deleteCacheTournamentsStandingsData () {
  await redis.del('tournament_standings_data')
  return
}

async function deleteStandingsTranslationData () {
  await redis.del('tournament_standings_t')
  return
}


// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueTourStand.process (async (job, done) => {
  // console.log(job.data.argumentList);

  /* 
  do stuff
  */

  await standingsDataGenerationAlt()
  await standingsTranslationGeneration()

  return "done";
});


/**
 * [ℹ] Tournaments Page Data Generation Methods
*/

async function standingsDataGenerationAlt () {
  
  // [ℹ] get HASURA-DB response;
	const response: Hasura_League_Info_Widget_Data_Response = await initGrapQLClient().request(GET_LEAGUE_INFO_FULL_DATA);

  deleteCacheTournamentsStandingsData()

  const final_obj_array: Cache_Single_Tournaments_League_Standings_Info_Data_Response[] = []

  // [ℹ] generate appropiate URLS
  for (const iterator of response.scores_football_leagues_dev) {
    // [ℹ] per LANG

    const finalCacheObj: Cache_Single_Tournaments_League_Standings_Info_Data_Response = { }
    finalCacheObj.seasons = []

    // finalCacheObj.url = url;
    finalCacheObj.league_id = iterator.id;

    // [ℹ] get all seasons for (this) league (tournament-id)
    for (const season_main of iterator.seasons) {

      const season_standings = response.scores_football_standings_history_dev
        .find(( { id, season_id } ) => id === season_main.league_id && season_id === season_main.id)

      // [🐛] debug
      // console.log(
      //   `league_id: ${league_target?.id}`,
      //   `season_id: ${season_main?.id}`,
      //   `season standings-length: ${season_standings?.data.length}`)

      const season_standings_teams_list = season_standings?.data

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

        const team_logo: string = response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.logo_path;
        const team_name: string =
          response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == null ||
          response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name == undefined
            ? season_team?.team_name
            : response.scores_football_teams_dev.find(( { id } ) => id === season_team.team_id)?.data?.name

        const target_team_stat = response.scores_team_statistics_dev.find( ({ team_id }) => team_id === season_team.team_id)
        const target_team_stat_hist = response.scores_team_statistics_history_dev.find( ({ team_id, season_id }) => team_id === season_team.team_id && season_id === season_main.id )

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

    await cacheTournamentsStandingsDataAlt (finalCacheObj.league_id , finalCacheObj);
  }

  // [🐛] debug
  // const data = JSON.stringify(final_obj_array, null, 4)
  // fs.writeFile('./datalog/standingsDataGenerationAlt.json', data, err => {
  //   if (err) {
  //     console.error(err);
  //   }
  // });

  return
}

async function standingsTranslationGeneration () {
  
  // [ℹ] get HASURA-DB response;
	const response: Hasura_League_Info_Widget_Data_Response = await initGrapQLClient().request(GET_LEAGUE_INFO_FULL_DATA);

  deleteStandingsTranslationData ()

  const final_obj_array: Cache_Single_Tournaments_League_Standings_Translation_Data_Response[] = []

  // [ℹ] generate appropiate URLS
  for (const iterator of response.scores_widget_standings_translations_dev) {

    // [ℹ] per LANG
    const lang = iterator.lang;

    final_obj_array.push(iterator)

    await cacheStandingsTranslationData(lang, iterator);
  }

  // [🐛] debug
  // const data = JSON.stringify(final_obj_array, null, 4)
  // fs.writeFile('./datalog/standingsTranslationGeneration.json', data, err => {
  //   if (err) {
  //     console.error(err);
  //   }
  // });

  return
}