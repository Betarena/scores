import {
  dev
} from '$app/environment'

import redis from "$lib/redis/init"
import {
  initGrapQLClient
} from '$lib/graphql/init_graphQL'
import {
  GET_LIVESCORES_LEAGUES
} from '$lib/graphql/query';
import {
  GET_LIVESCORES_TRANSLATIONS
} from '$lib/graphql/query';

import {
  getAllLiveScoresFootball
} from '$lib/firebase/livescores_football'
import type {
  LiveScore_SEO_Game,
  LiveScore_SEO_Game_Scoped_Lang
} from '$lib/models/featured_betting_sites/firebase-real-db-interface'

import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const CQ_Home_Livescores_All = new Bull(
  'CQ_Home_Livescores_All', {
    redis: {
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(),
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(),
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(),
      tls: {}
    },
    settings: settings
  }
);
const cacheQueueProcessName = "CQ_Home_Livescores_All"
const cacheTarget = "REDIS CACHE | homepage livescores"
let logs = []

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
 */
export async function POST(): Promise < unknown > {

  // [ℹ] dev / local environment
  if (dev) {
    console.log(`
      ${cacheTarget} 
      at: ${new Date().toDateString()}
    `);

    // [ℹ] cache generation #1
    await deleteLiveScores()
    const response: unknown = await getLeaguesOrder()
    cacheLeaguesOrder(response);

    // [ℹ] cache generation #2
    await main_gen_2()

    // [ℹ] cache generation #3
    await deleteTranslations()
    const response3: unknown = await getTranslations()
    cacheTranslations(response3);

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
    const job = await CQ_Home_Livescores_All.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheLeaguesOrder(json_cache: unknown) {
  try {
    await redis.set('live_scores_leagues', JSON.stringify(json_cache));
  } catch (e) {
    console.log("Unable to cache", e);
  }
}

async function cacheFeaturedBettingSiteGeoPos(geoPos: string, json_cache: LiveScore_SEO_Game_Scoped_Lang[]) {
  try {
    await redis.hset('live_scores', geoPos, JSON.stringify(json_cache));
    console.log("Caching live_scores" + geoPos);
  } catch (e) {
    console.log("Unable to cache", geoPos, e);
  }
}

async function cacheTranslations(json_cache: unknown) {
  try {
    await redis.set('live_scores_football_translations', JSON.stringify(json_cache));
  }
  catch (e) {
    console.log("Unable to cache", e);
  }
}

async function deleteLiveScores() {
  await redis.del('live_scores_leagues')
  return
}

async function deleteLiveScores_2() {
  await redis.del('live_scores')
  return
}

async function deleteTranslations() {
  await redis.del('live_scores_football_translations')
  return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

CQ_Home_Livescores_All.process(async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();

  // [ℹ] cache generation #1
  await deleteLiveScores()
  const response: unknown = await getLeaguesOrder()
  cacheLeaguesOrder(response);

  // [ℹ] cache generation #2
  await main_gen_2()

  // [ℹ] cache generation #3
  await deleteTranslations()
  const response3: unknown = await getTranslations()
  cacheTranslations(response3);

  const t1 = performance.now();

  if (dev) console.log(`
    ${cacheTarget} updated!
    completed in: ${(t1 - t0) / 1000} sec
  `)

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, {
    logs: logs
  });

}).catch(err => {
  console.log(err)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getLeaguesOrder(): Promise < unknown > {

  const leagueSort = {};

  return initGrapQLClient().request(GET_LIVESCORES_LEAGUES).then(x => {
    const leagues = x.leagues_filtered_country_dev;
    for (let k = 0; k < leagues.length; k++) {
      if (leagues[k].lang == null) continue;
      for (let i = 0; i < leagues[k].leagues.length; i++) {
        leagues[k].leagues[i].index = i;
      }
      leagueSort[leagues[k].lang] = leagues[k].leagues;
    }
    if (dev) console.info('live_scores leagueSort', Object.keys(leagueSort));

    return leagueSort;
  });

}

async function main_gen_2() {

  const langs: string[] = ['br', 'en', 'es', 'it', 'pt', 'ro'];

  await deleteLiveScores_2()
  const response: LiveScore_SEO_Game[] = await getLiveScores()

  // Aggregate games by language
  for (const l in langs) {
    const lang: string = langs[l];
    const langDate: LiveScore_SEO_Game_Scoped_Lang[] = [];

    for (const g in response) {
      const game = response[g];
      const newGame: LiveScore_SEO_Game_Scoped_Lang = {
        visitorteam: game.visitorteam,
        localteam: game.localteam,
        tip: (game.tips && game.tips[lang]) ? game.tips[lang].link : "",
        link: (game.links && game.links[lang]) ? game.links[lang] : "",
      }
      langDate.push(newGame);
    }

    cacheFeaturedBettingSiteGeoPos(lang, langDate);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] MAIN METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getLiveScores(): Promise < LiveScore_SEO_Game[] > {
  const liveScores: LiveScore_SEO_Game[] = await getAllLiveScoresFootball();
  if (dev) console.info('live_scores', Object.keys(liveScores));
  return liveScores;
}

async function getTranslations(): Promise < any > {
  return initGrapQLClient().request(GET_LIVESCORES_TRANSLATIONS).then(x => {
    return x.scores_livescore_football_translations_dev;
  });
}