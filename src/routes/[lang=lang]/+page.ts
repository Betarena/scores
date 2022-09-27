import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { PageLoad } from './$types';

import { get } from '$lib/api/utils';

/** 
 * @type {import('./$types').PageLoad} 
*/
export async function load ({
  url, 
  params, 
  fetch,
  setHeaders
}): PageLoad {

  let response_IP_2;

  /**
   * ==================
   * [ℹ] Attempt to Identify the USERS IP from "pre-load()"
   * [ℹ] only works in PROD with deployment of 'my_server.js'
  */

  if (!dev) {
    // ⚠❌ does not appear to work
    // const response_IP = await fetch(`/getClientIP`, {
    //   method: 'GET'
    // }).then((r) => r.json());
    // console.log("response_IP: ", response_IP);
    
    // 🤔✅ works ? only on `same-origin-domain-deployment`
    // response_IP_2 = await get(`https://betarena-scores-platform.herokuapp.com/getClientIP`)
    // console.log("response_IP_2: ", response_IP_2);
  }

  // [ℹ] testing-hooks
  // if (dev) console.log("SESSION: ", session);

  /**
   * ==================
   * [ℹ] Ensure URL Check Existance;
   * [disabled]
   * [check-made-as-a-complex-PROMISE]
  */

  /*
    const response_valid_url = await fetch(
      `/api/cache/pages_and_seo/cache-seo.json?url=`+url.pathname, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    // [ℹ] validate URL existance;
    if (!response_valid_url) {
      // [ℹ] otherwise, ERROR;
      return {
        status: 404,
        error: new Error("Uh-oh! This page does not exist!")
      }
    }
  */

  const urlLang: string = params.lang == undefined ? 'en' : params.lang

  /**
   * ==================
   * [ℹ] Loading of (this) page [homepage] SEO-READY DATA; 
   * [disabled]
   * [check-made-as-a-complex-PROMISE]
  */

  /*
    const response_homepage_seo = await fetch(
      '/api/cache/pages_and_seo/cache-seo.json?lang='+urlLang+"&page=homepage", 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_featured_match_seo = await fetch(
      '/api/cache/featured_match/cache-data.json?lang='+urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_featured_betting_sites_seo = await fetch(
      '/api/cache/featured_betting_sites/cache-data.json?lang='+urlLang, 
      {
        method: 'GET' 
      }
    ).then((r) => r.json());

    const response_best_goalscorers_seo = await fetch(
      '/api/cache/best_goalscorer/cache-data.json?lang='+urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_league_list_seo = await fetch(
      '/api/cache/league_list/cache-data.json?lang='+urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_leagues_table_seo = await fetch(
      '/api/cache/leagues_table/cache-data.json?lang='+urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_seo_block_seo = await fetch(
      '/api/cache/seo_block/cache-data.json?lang='+urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_livescores_football = await fetch(
      '/api/cache/live_scores/cache-seo.json?lang='+urlLang, 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_livescores_football_leagues = await fetch(
      '/api/cache/live_scores/cache-data.json', 
      {
        method: 'GET'
      }
    ).then((r) => r.json());

    const response_livescores_football_translations = await fetch('/api/cache/live_scores/cache-translations.json', {
      method: 'GET'
    }).then((r) => r.json());
  */

  /**
   * ==================
   * [ℹ] testing widget GEO data loading experimentation
  */

  /*
    // [ℹ] correct ? not sure... seems to work and pass GB for me
    const userGeoResponse: GeoJsResponse = await getUserLocation()
    console.log("userGeoResponse_s", userGeoResponse.country_code.toLowerCase())

    // ⚠ sometiemes correct on the `console` on client mostly [server-side]
    const userGeoResponse_v2 = await fetch('https://get.geojs.io/v1/ip/geo.json', {
      method: 'GET'
    }).then((r) => r.json());
    console.log("userGeoResponse_s2", userGeoResponse_v2.country_code.toLowerCase())

  */

  // [ℹ] correct ? not sure... seems to work and pass GB for me
  // const userGeoResponse_v3 = await get(`https://get.geojs.io/v1/ip/geo.json`);
  // console.log("userGeoResponse_s3", userGeoResponse_v3.country_code.toLowerCase())

  //  const userGeo: string = userGeoResponse_v3.country_code.toLowerCase()
  /*

    const response_featured_match: FixtureResponse = fetch(
      '/api/cache/featured_match/cache-data.json?geoPos='+userGeo, 
      {
      method: 'GET'
      }
    )

    const response_featured_betting_sites: All_SportBook_Details_Data = fetch(
      '/api/cache/featured_betting_sites/cache-data.json?geoPos='+userGeo, 
      {
      method: 'GET'
      }
    )

    const response_league_list: Cache_Single_Geo_LeagueList_Translation_Response = fetch(
      '/api/cache/league_list/cache-data.json?geoPos='+userGeo, 
      {
      method: 'GET'
      }
    )

    const response_best_goalscorers: Cache_Single_Geo_GoalScorers_Translation_Response = fetch(
      '/api/cache/best_goalscorer/cache-data.json?geoPos='+userGeo, 
      {
      method: 'GET'
      }
    )

    const response_leagues_table: Cache_Single_Geo_Leagues_Table_Translation_Response = fetch(
      '/api/cache/leagues_table/cache-data.json?geoPos='+userGeo, 
      {
      method: 'GET'
      }
    )
  */

  /**
   * [ℹ] =================
   * [ℹ] further API FETCH enhancing via bundeling requests;
   * [ℹ] https://stackoverflow.com/questions/43691808/http-performance-many-small-requests-or-one-big-one
   * [ℹ] https://svelte.dev/repl/ec6f6b61329f4f43ae049464d73d8158?version=3.23.1
   * [ℹ] https://svelte.dev/repl/16b375da9b39417dae837b5006799cb4?version=3.25.0
   * [ℹ] =================
  */

  const urls = [
    '/api/cache/pages_and_seo?lang='+urlLang+"&page=homepage",
    '/api/cache/featured_match?lang='+urlLang,
    '/api/cache/featured_betting_sites?lang='+urlLang,
    '/api/cache/best_goalscorer?lang='+urlLang,
    '/api/cache/league_list?lang='+urlLang,
    '/api/cache/leagues_table?lang='+urlLang,
    '/api/cache/seo_block?lang='+urlLang,
    // [ℹ] page validation check;
    `/api/cache/pages_and_seo?url=`+url.pathname,
    // [ℹ] livescores
    '/api/cache/live_scores?lang='+urlLang, 
    '/api/cache/live_scores?type=geo', 
    '/api/cache/live_scores?type=translations',
    '/api/cache/live_scores?type=tournaments',
    // [ℹ] alt.
    // [ℹ] geo-based cache load
    // '/api/cache/featured_match?geoPos='+'en', 
    // '/api/cache/featured_betting_sites?geoPos='+'en', 
    // '/api/cache/league_list?geoPos='+'en', 
    // '/api/cache/best_goalscorer?geoPos='+'en', 
    // '/api/cache/leagues_table?geoPos='+'en', 
  ];

  const promises = urls.map((url) =>
    fetch(url)
    .then((response) => response.json())
  );

  const data = await Promise.all(promises);

  // [🐛] debug
  // if (dev) console.log("pre-load() data: ", data)

  const response_homepage_seo = data[0]
  const response_featured_match_seo = data[1]
  const response_featured_betting_sites_seo = data[2]
  const response_best_goalscorers_seo = data[3]
  const response_league_list_seo = data[4]
  const response_leagues_table_seo = data[5]
  const response_seo_block_seo = data[6]
  const response_livescores_football = data[8]
  const response_livescores_football_leagues = data[9]
  const response_livescores_football_translations = data[10]
  const response_livescores_football_tournaments = data[11]

  // [ℹ] data-geo real-test [direct widget data]
  // const response_featured_match = data[11]
  // const response_featured_betting_sites = data[12]
  // const response_league_list = data[13]
  // const response_best_goalscorers = data[14]
  // const response_leagues_table = data[15]

  const response_valid_url = data[7]

  /**
   * [ℹ] return(s) 
  */

  if (!response_valid_url) {
    throw error(404, `Uh-oh! This page does not exist!`);
  }

  if (
    response_homepage_seo &&
    response_featured_match_seo &&
    response_featured_betting_sites_seo &&
    response_best_goalscorers_seo &&
    response_league_list_seo &&
    response_leagues_table_seo &&
    response_seo_block_seo &&
    response_livescores_football &&
    response_livescores_football_leagues &&
    response_livescores_football_translations &&
    response_livescores_football_tournaments
  ) {

    // setHeaders({
    //   'cache-control': 'public, max-age=3600'
    // });

    return {

      PAGE_DATA_SEO: response_homepage_seo,
      FEATURED_MATCH_WIDGET_DATA_SEO: response_featured_match_seo,
      FEATURED_BETTING_SITES_WIDGET_DATA_SEO: response_featured_betting_sites_seo,
      BEST_GOAL_SCORERS_DATA_SEO: response_best_goalscorers_seo,
      LEAGUE_LIST_WIDGET_DATA_SEO: response_league_list_seo,
      LEAGUES_TABLE_SCORES_SEO_DATA: response_leagues_table_seo,
      SEO_BLOCK_DATA: response_seo_block_seo,
      LIVE_SCORES_DATA_DATA_SEO : response_livescores_football,
      LIVE_SCORES_DATA_LEAGUES : response_livescores_football_leagues,
      LIVE_SCORES_FOOTBALL_TRANSLATIONS : response_livescores_football_translations,
      LIVESCORES_FOOTBALL_TOURNAMENTS: response_livescores_football_tournaments

      // [ℹ] data-geo real-test [direct widget data]
      
      // FEATURED_MATCH_WIDGET_DATA_MAIN : response_featured_match,
      // FEATURED_BETTING_SITES_WIDGET_DATA : response_featured_betting_sites,
      // BEST_GOAL_SCORERS_DATA : response_best_goalscorers,
      // LEAGUE_LIST_WIDGET_DATA : response_league_list,
      // LEAGUES_TABLE_SCORES_DATA: response_leagues_table
      // SEO_BLOCK_DATA: response_seo_block_seo,

    }
  }
  
  throw error(500, `Uh-oh! There has been an /{lang} page preloading error`);
}