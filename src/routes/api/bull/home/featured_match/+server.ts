
import { dev } from '$app/environment'
import redis from "$lib/redis/init"
import { 
  getTargetFixtureOdds, 
  getTargetGeoSportBookDetails } from "$lib/firebase/index"
import { 
  GET_ALL_FIXTURE_DATA, 
  GET_LANG_SELECTED_FIXTURE, 
  GET_ALL_SELECTED_MATCH_FIXTURES, 
  GET_HREFLANG_DATA, 
  GET_FEATURED_MATCH_TRANSLATION, 
  REDIS_CACHE_FEATURED_MATCH_DATA_1} from "$lib/graphql/query"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'
import { performance } from 'perf_hooks';
import Bull from 'bull';
import { error, json } from '@sveltejs/kit';

import type { 
  Cache_Single_Lang_Featured_Match_Translation_Response, 
  FixtureResponse 
} from "$lib/models/home/featured_match/interface-fixture"
import type { 
  SelectedFixutre, 
  SelectedFixture_AllData, 
  CompleteFixtureData_Response, 
  Featured_Match_Translation_Response, 
  BETARENA_HASURA_featured_match_query
} from "$lib/models/home/featured_match/response_models"
import type { 
  SelectedFixture_LiveOdds_Response
} from "$lib/models/home/featured_match/firebase-real-db-interface"

// ~~~~~~~~~~~~~~~~~~~~~~~~
// [❗] BULL CRITICAL
// ~~~~~~~~~~~~~~~~~~~~~~~~

const settings = {
  stalledInterval: 600000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}
const cacheQueueFeaturedMatch = new Bull (
  'cacheQueueFeaturedMatch', 
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
const cacheQueueProcessName = "cacheQueueFeaturedMatch"
const cacheTarget = "REDIS CACHE | featured match"
let logs = []

let userGeo: string
let WIDGET_SELECTED_FIXTURE_DATA: FixtureResponse = {
    // [ℹ] contains the final-fixture-response-data;
    away_team_logo: undefined,             
    away_team_name: undefined,
    country_flag: undefined,
    fixture_day: undefined,
    home_team_logo: undefined,
    home_team_name: undefined,
    id: undefined,
    inserted_at: undefined,
    league_name: undefined,
    probabilities: {
        home: undefined,
        away: undefined,
        draw: undefined,
    },
    round_name: undefined,
    status: undefined,
    time: undefined,
    tvstations: undefined,
    valuebets: undefined,
    live_odds: undefined,
    match_votes: undefined,
    best_players: undefined,
    // translation: undefined,
    selected_data: undefined,
    league_id: undefined,
    urls: undefined
}

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

    // [ℹ] get KEY platform translations
    const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

    // [ℹ] get-all-exisitng-lang-translations;
    const langArray: string [] = response.scores_hreflang
      .filter(a => a.link)         /* filter for NOT "null" */
      .map(a => a.link)            /* map each LANG */ 

    // [ℹ] push "EN"
    langArray.push('en')

    await featuredMatchGeoDataGeneration()
    await featuredMatchLangDataGeneration(langArray)

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
    const job = await cacheQueueFeaturedMatch.add({});
    console.log(`${cacheQueueProcessName} -> job_id: ${job.id}`)
    return json({
      job_id: job.id
    })
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] CACHING METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheFeaturedMatchGeoPos(geoPos: string, json_cache: FixtureResponse) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('featured_match_geo', geoPos, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ featured_match_geo cached')
  } 
  catch (e) {
    console.log('❌ unable to cache featured_match_geo for ', geoPos, e);
  }
}

async function cacheFeaturedMatchLang(lang: string, json_cache: Cache_Single_Lang_Featured_Match_Translation_Response) {
  try {
    // [ℹ] persist redis (cache)
    await redis.hset('featured_match_t', lang, JSON.stringify(json_cache));
    // [🐛] debug
    if (dev) console.debug('✅ featured_match_t lang ', lang, 'cached')
  } 
  catch (e) {
    console.error('❌ unable to cache featured_match_t for ', lang, e);
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] BULL WORKERS 
// ~~~~~~~~~~~~~~~~~~~~~~~~

cacheQueueFeaturedMatch.process (async function (job, done) {
  // console.log(job.data.argumentList);
  // console.log(job.data)

  logs = []
  logs.push(`${job.id}`);

  /* 
  do stuff
  */

  const t0 = performance.now();

  // [ℹ] get KEY platform translations
  const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

  // [ℹ] get-all-exisitng-lang-translations;
  const langArray: string [] = response.scores_hreflang
    .filter(a => a.link)         /* filter for NOT "null" */
    .map(a => a.link)            /* map each LANG */ 

  // [ℹ] push "EN"
  langArray.push('en')

  await featuredMatchGeoDataGeneration()
  await featuredMatchLangDataGeneration(langArray)

  const t1 = performance.now();

  if (dev) console.log(`
    ${cacheTarget} updated!
    completed in: ${(t1 - t0) / 1000} sec
  `)

  logs.push(`${cacheTarget} updated!`);
  logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

  done(null, { logs: logs });

}).catch(err => {
  console.log(err)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function featuredMatchGeoDataGeneration () {

  // [ℹ] clear cache data
  // await deleteCacheFeaturedMatchGeoPos()

  // [ℹ] get all SELECTED FIXTURES from HASURA-DB;
  const response = await getAllMatchSelectedFixtures()

  // [ℹ] iterate over EACH SELECTED FIXTURE 
  // [ℹ] & cache => geoPos-by-geoPos;
  for await (const selected_fixture of response.widget_featured_match_selection) {
    userGeo = selected_fixture.lang
    const response_cache = await getFeaturedMatchData()
    // [ℹ] cache-response;
    await cacheFeaturedMatchGeoPos(userGeo, response_cache);
  }
}

async function featuredMatchLangDataGeneration (langArray: string[]) {

  let finalCacheObj: Cache_Single_Lang_Featured_Match_Translation_Response = undefined

  const response: Featured_Match_Translation_Response = await initGrapQLClient().request(GET_FEATURED_MATCH_TRANSLATION)

  // deleteCacheFeaturedMatchLang()

  // [ℹ] for-each available translation:
  for (const lang_ of langArray) {
    
    finalCacheObj = response.widget_featured_match_translations.find(( { lang } ) => lang_ === lang);

    // [ℹ] persist-cache-response;
    await cacheFeaturedMatchLang(lang_, finalCacheObj);
  }
  
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

// [ℹ] contains all of the `match-selected-fixtures` data;
async function getAllMatchSelectedFixtures(): Promise < SelectedFixture_AllData > {
  // [ℹ] push-GRAPH-QL-request;
  const response = await initGrapQLClient().request(GET_ALL_SELECTED_MATCH_FIXTURES)
  // [ℹ] reutrn response;
  return response
}

// [ℹ] contains the main METHOD for DATA AGGREGATION & ASSIGNING;
async function getFeaturedMatchData(): Promise < FixtureResponse > {

  // [ℹ] obtain the target-selected-fixture [HASURA-DB] [FEATURED-MATCH + TRANSLATION DATA]
  const selectedFixture = await getSelectedFixture(userGeo)

  // [ℹ] [selectedFixture] break-down response;
  const selected_fixture_id = selectedFixture.widget_featured_match_selection[0].fixture_id

  // [ℹ] continue; 
  // [ℹ] create a promise, for obtaining the complete fixture odds data;
  const promise = await get_TargetFixtureOddsAndInfo(selectedFixture.widget_featured_match_selection[0])

  // [ℹ] continue; 
  // [ℹ] get the complete fixture data in one JSON Object;
  const completeData = await get_CompleteFixtureData(selected_fixture_id)

  // [ℹ] continue;
  // [ℹ] get the fixtures tournaments URLS data;
  const fixture_league_id = completeData.week_fixtures_by_pk.league_id
  const tournamentsData = await getTargetTournaments(fixture_league_id)

  // [ℹ] [completeData] break-down response;
  WIDGET_SELECTED_FIXTURE_DATA = completeData.week_fixtures_by_pk;
  WIDGET_SELECTED_FIXTURE_DATA.best_players = completeData.widget_featured_match_best_player_by_pk;
  WIDGET_SELECTED_FIXTURE_DATA.match_votes = completeData.widget_featured_match_votes_by_pk;
  WIDGET_SELECTED_FIXTURE_DATA.live_odds = promise;
  // WIDGET_SELECTED_FIXTURE_DATA.translation = selectedFixture.widget_featured_match_translations
  WIDGET_SELECTED_FIXTURE_DATA.selected_data = selectedFixture.widget_featured_match_selection[0]
  WIDGET_SELECTED_FIXTURE_DATA.urls = tournamentsData.scores_tournaments[0]?.urls || null;

  // [ℹ] continue; 
  // [ℹ] get the fixture value-bets;
  // [ℹ] handles `WIDGET_SELECTED_FIXTURE_DATA.valuebets`
  if (WIDGET_SELECTED_FIXTURE_DATA.valuebets != null) {
    await assignValueBetsData();
  }

  // [ℹ] RETURN COMPLETE FEATRUED_MATCH_DATA;
  return WIDGET_SELECTED_FIXTURE_DATA
}

async function getSelectedFixture(lang: string) {
  // [ℹ] declare variables for GRAPH-QL-REQUEST;
  const variables = { 
    lang: lang
  }
  // [ℹ] push-GRAPH-QL-request;
  const response = await initGrapQLClient().request(GET_LANG_SELECTED_FIXTURE, variables)
  // [ℹ] reutrn response;
  return response
}

async function get_CompleteFixtureData(fixture_id: number): Promise < CompleteFixtureData_Response > {
  // [ℹ] declare variables for GRAPH-QL-REQUEST;
  const variables = { 
    id: fixture_id, 
    fixture_id: fixture_id 
  }
  // [ℹ] push-GRAPH-QL-request;
  const response = await initGrapQLClient().request(GET_ALL_FIXTURE_DATA, variables)
  // [ℹ] reutrn response;
  return response;
}

async function get_TargetFixtureOddsAndInfo(selectedFixutreData: SelectedFixutre): Promise < SelectedFixture_LiveOdds_Response > {
  // [ℹ] get the list of the odds for the;
  const response = await getTargetFixtureOdds(selectedFixutreData)
  // [ℹ] return,
  return response
}

async function getTargetTournaments(tournament_id: number): Promise < BETARENA_HASURA_featured_match_query > {
  const variables = { 
    tournament_id: tournament_id
  }
  const response = await initGrapQLClient().request(
    REDIS_CACHE_FEATURED_MATCH_DATA_1, 
    variables
  )
  return response
}

async function assignValueBetsData(): Promise < void > {
  // [ℹ] obtain-target-fixture-bookmaker-site-name;
  const siteName: string = WIDGET_SELECTED_FIXTURE_DATA.valuebets.bookmaker
  // [ℹ] pass-in-sport-book-details-parameters;
  const sportbook_details: any = await getTargetGeoSportBookDetails(
    userGeo,
    siteName
  )
  // [ℹ] check if the data returned exists;
  if (Object.keys(sportbook_details).length === 0) {
    // [ℹ] if not, return `null`;
    WIDGET_SELECTED_FIXTURE_DATA.valuebets = null
    return
  }
  else {
    // [ℹ] otherwise, append the image & the registration link to the data;
    WIDGET_SELECTED_FIXTURE_DATA.valuebets = {
      ...WIDGET_SELECTED_FIXTURE_DATA.valuebets,
      image: sportbook_details.betting_site_info.image,
      link: sportbook_details.betting_site_info.register_link,
    }
  }
}