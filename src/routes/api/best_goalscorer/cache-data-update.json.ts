
// [ℹ] import $app `modules`;
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
// [ℹ] DECLARING TYPESCRIPT-TYPES imports;
import type { 
  Hasura_Complete_GoalScorers_Type, 
  Cache_Single_Lang_GoalScorers_Translation_Response, 
  Single_Goalscorer_Translations,
  Cache_Single_Geo_GoalScorers_Translation_Response,
  Cache_Goalscorers_General_Lang_Ready
} from '$lib/models/best_goalscorer/types'
import { 
  GET_BEST_GOALSCORERS_DATA 
} from '$lib/graphql/best_goalscorer/query'
import { 
  GET_HREFLANG_DATA 
} from '$lib/graphql/query'

// [❗] critical
import Bull from 'bull';
const cacheQueueGoalscorers = new Bull('cacheQueueGoalscorers', import.meta.env.VITE_REDIS_CONNECTION_URL_BULL.toString()())

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function post(): Promise < unknown > {

  // [🐛] debug
  if (dev) console.log(`ℹ FRONTEND_SCORES_REDIS_best_goalscorers_trigerred at: ${new Date().toDateString()}`)

  // [ℹ] producers [JOBS]
  const job = await cacheQueueGoalscorers.add();

  return {
    status: 200,
    body: { 
      job_id: job.id,
      message: '✅ Success \nBest Goalscorers Cache Updated!'
    }
  }
}

/**
 * [ℹ] Best Goalscorers CACHEING ACTIONS METHODS
*/

async function cacheBestGoalscorersGeoPos (geoPos: string, json_cache: Cache_Single_Geo_GoalScorers_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('best_goalscorer_geo', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.log('❌ unable to cache best_goalscorer_geo for ', geoPos, e);
  }
}

async function cacheBestGoalscorersLang (lang: string, json_cache: Cache_Single_Lang_GoalScorers_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('best_goalscorer_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ best_goalscorer_t lang ', lang, 'cached')
  } 
  catch (e) {
    console.error('❌ unable to cache best_goalscorer_t for ', lang, e);
  }
}

async function deleteBestGoalscorersGeoPos () {
  await redis.del('best_goalscorer_geo')
  return
}

async function deleteBestGoalscorersLang () {
  await redis.del('best_goalscorer_t')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueGoalscorers.process (async (job, done) => {
  // console.log(job.data.argumentList);

  /* 
  do stuff
  */

  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang_dev
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  await bestGoalscorersGeoDataGeneration()
  await bestGoalscorersLangDataGeneration(langArray)

  return "done";
});

/**
 * [ℹ] Featured Betting Sites CACHE GENERATION
*/

async function bestGoalscorersGeoDataGeneration () {

  // await deleteBestGoalscorersGeoPos()

  // [ℹ] ℹ generate best goal scorers data by GEO;
  const response: Array < Cache_Single_Geo_GoalScorers_Translation_Response > = await mainGeo()

  // [ℹ] iterate over EACH SELECTED FIXTURE 
  // [ℹ] & cache => geoPos-by-geoPos;
  for await (const best_goalscorer of response) {
    const userGeo = best_goalscorer.lang
    // [ℹ] cache-response;
    await cacheBestGoalscorersGeoPos(userGeo, best_goalscorer);
  }

}

async function bestGoalscorersLangDataGeneration (langArray: string[]) {

  const finalCacheObj: Cache_Single_Lang_GoalScorers_Translation_Response = {
    top_geo_goalscorer_players: undefined,
    translations: undefined
  }

  // [ℹ] ℹ generate best goal scorers data by GEO;
  const response: Cache_Goalscorers_General_Lang_Ready = await mainLang()

  // deleteBestGoalscorersLang()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj.top_geo_goalscorer_players = response.top_geo_goalscorer_players;
    finalCacheObj.translations = response.translations.find(( { lang } ) => lang_ === lang);

    // [ℹ] persist-cache-response;
    await cacheBestGoalscorersLang(lang_, finalCacheObj);
  }

}

/**
 * [ℹ] Best Goalscorers Methods
*/

async function mainGeo(): Promise < Array < Cache_Single_Geo_GoalScorers_Translation_Response >> {

  const response: Hasura_Complete_GoalScorers_Type = await initGrapQLClient().request(GET_BEST_GOALSCORERS_DATA);

  const finalObj: Array < Cache_Single_Geo_GoalScorers_Translation_Response > = []

  // [ℹ] for-each country-filtered-league-list,
  for (const country_leagues of response.leagues_filtered_country) {

    const goalscorerObj: Cache_Single_Geo_GoalScorers_Translation_Response = {
      lang: undefined,
      top_geo_goalscorer_players: []
    }

    // [ℹ] ℹ declare language [GEO];
    goalscorerObj.lang = country_leagues.lang
    
    // [ℹ] ℹ iterate over each country-league;
    for await (const country_league of country_leagues.leagues) {

      // [ℹ] ℹ iterate over each top-goal-scorer;
      for (const player of response.scores_best_goalscorers) {

        // [ℹ] ℹ match_league_ids && match correct-lang;
        if (player.league_id.toString() === country_league.league_id.toString()) {
          // [ℹ] ℹ add player to the list of GEO players;
          goalscorerObj.top_geo_goalscorer_players.push(player)
        }

        // [ℹ] ℹ terminating condition;
        if (goalscorerObj.top_geo_goalscorer_players != undefined && 
            goalscorerObj.top_geo_goalscorer_players.length > 20) {
          break;
        }
      }

      // [ℹ] ℹ terminating condition;
      if (goalscorerObj.top_geo_goalscorer_players != undefined && 
          goalscorerObj.top_geo_goalscorer_players.length > 20) {
        break;
      }
    }

    // [ℹ] ℹ sort data OBJECT [descending order];
    goalscorerObj.top_geo_goalscorer_players.sort((a, b) => b.goals - a.goals);

    let counterPos = 0;

    // [ℹ] ℹ add extra parameter;
    for await (const player of goalscorerObj.top_geo_goalscorer_players) {
      counterPos = counterPos + 1;
      player.pos_num = counterPos;
    }

    // [ℹ] ℹ push to final object;
    finalObj.push(goalscorerObj);
  }

  return finalObj
}

async function mainLang(): Promise < Cache_Goalscorers_General_Lang_Ready > {
  
  const response: Hasura_Complete_GoalScorers_Type = await initGrapQLClient().request(GET_BEST_GOALSCORERS_DATA);

  const goalscorerObj: Cache_Goalscorers_General_Lang_Ready = {
    top_geo_goalscorer_players: [],
    translations: []
  }

  // [ℹ] filter and remove unecessary player-data;
  goalscorerObj.top_geo_goalscorer_players = response.scores_best_goalscorers.map(( { goals, image_path, league_id, logo_path, position, ...rest} ) => {
    return rest;
  });

  // [ℹ] generate translations for OBJECT;
  for (const pos_translation of response.player_positions_translations_dev) {

    // [ℹ] generate new empty LANG object;
    const newObject: Single_Goalscorer_Translations = {
      lang: undefined,
      positions_translations: undefined,
      widget_translations: undefined
    } // NOTE: potential issue

    // [ℹ] add data correctly;
    newObject.lang = pos_translation.lang.toString()
    newObject.positions_translations = pos_translation.position

    // [ℹ] add in the new translation;
    for (const widget_translation of response.scores_best_goalscorers_translations) {
      // [ℹ] validation LANG;
      if (widget_translation.lang.toString() == newObject.lang) {
        // [ℹ] add the widget translation;
        newObject.widget_translations = widget_translation.translations
      }
    }

    // [ℹ] push to final object;
    goalscorerObj.translations.push(newObject)
  }

  return goalscorerObj
}