// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import { GET_LEAGUE_INFO_FULL_DATA } from '$lib/graphql/tournaments/query';
import { removeDiacritics } from '$lib/utils/languages';
import type { Cache_Single_SportbookDetails_Data_Response, Cache_Single_Tournaments_League_Info_Data_Response, Hasura_League_Info_Widget_Data_Response } from '$lib/models/tournaments/types';

import fs from 'fs';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function get(): Promise< unknown > {
  
  await sportbookDetailsGeneration()
  await leagueInfoGeneration()

  // [ℹ] return, RESPONSE;
	return {
    status: 200,
    body: '✅ Success \nleague_info & sport-book-details cache data updated!'
  }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheTournamentsPageLeagueInfoData (url: string, json_cache: Cache_Single_Tournaments_League_Info_Data_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('league_info', url, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache league_info', e);
  }
}

async function cacheCacheSportbookDetailInfoData (geoPos: string, json_cache: Cache_Single_SportbookDetails_Data_Response) {
  try {
    //[ℹ] persist redis (cache)
    await redis.hset('sportbook_details', geoPos, JSON.stringify(json_cache));
  } 
  catch (e) {
    console.error('❌ unable to cache sportbook_details', e);
  }
}

async function deleteCacheTournamentsPageLeagueInfoData() {
  await redis.del('league_info')
  return
}

async function deleteCacheSportbookDetailInfoData() {
  await redis.del('sportbook_details')
  return
}


/**
 * [ℹ] Tournaments Page Data Generation Methods
*/


async function sportbookDetailsGeneration () {
  
  // [ℹ] get HASURA-DB response;
	const response: Hasura_League_Info_Widget_Data_Response = await initGrapQLClient().request(GET_LEAGUE_INFO_FULL_DATA);

  let finalCacheObj: Cache_Single_SportbookDetails_Data_Response = {
    geoPos: undefined
  }

  deleteCacheSportbookDetailInfoData()

  for (const geoSportbook of response.sportsbook_details) {

    finalCacheObj.geoPos = geoSportbook.lang

    // [ℹ] sportbook-details-info
    for (const [key, value] of Object.entries(geoSportbook.data)) {
      // [ℹ] based on key-value-pair;
      if (geoSportbook.data[key].position.toString() === '1') {
        finalCacheObj = {
          ...value,
          geoPos: geoSportbook.lang
        }
      }
    }

    // [ℹ] persist-cache-response;
    await cacheCacheSportbookDetailInfoData(finalCacheObj.geoPos, finalCacheObj)

  }

}

async function leagueInfoGeneration () {
  
  // [ℹ] get HASURA-DB response;
	const response: Hasura_League_Info_Widget_Data_Response = await initGrapQLClient().request(GET_LEAGUE_INFO_FULL_DATA);

  // const cacheRedisObj = {}

  deleteCacheTournamentsPageLeagueInfoData()

  // [ℹ] generate appropiate URLS
  for (const iterator of response.scores_tournaments) {
    // [ℹ] per LANG

    const finalCacheObj: Cache_Single_Tournaments_League_Info_Data_Response = {
      lang: undefined,
      url: undefined,
      data: {
        name: undefined,
        country: undefined,
        image_path: undefined,
        country_logo: undefined,
        // betting_site_logo?: undefined,
        // beting_cta_link?: undefined,
        seasons: [],
        translation: undefined         
      }
    }

    const tournament_id = iterator.tournament_id;
    // console.log("tournament_id", tournament_id)

    const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');
    const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-').replace(/\./g, '');

    // [ℹ] /{lang}/{sport}/{country}/{league_name} or /{sport}/{country}/{league_name} generation URL
    const url = iterator.lang == 'en' 
      ? '/' + sport + '/' + country + '/' + league_name
      : '/' + lang  + '/' + sport + '/' + country + '/' + league_name

    finalCacheObj.url = url;
    finalCacheObj.lang = lang;

    const targetWidgetTranslation = response.scores_widget_league_info_translations.find(( { lang } ) => lang === iterator.lang).data
    finalCacheObj.data.translation = targetWidgetTranslation

    const league_target = response.scores_football_leagues.find(( { name, id } ) => name === iterator.name && id === tournament_id)
    finalCacheObj.data.image_path = league_target.data.logo_path;
    finalCacheObj.data.country_logo = league_target.country.image_path

    finalCacheObj.data.country = iterator.country;
    finalCacheObj.data.name = iterator.name;

    // [ℹ] issues here;
    finalCacheObj.data.seasons = [] // [ℹ] reset

    // [ℹ] get all seasons for (this) league
    for (const season_main of league_target.seasons) {

      // [ℹ] match target X season from league Z to extra-info-season-data;
      const seasonExtraInfo = response.scores_football_seasons_details.find(( { id } ) => id === season_main.id)

      const num_clubs = seasonExtraInfo?.data_stats === null ? null : seasonExtraInfo?.data_stats.number_of_clubs
      const start_date = seasonExtraInfo?.start_date
      const end_date = seasonExtraInfo?.end_date

      // if (num_clubs != null && 
      //     start_date != null && 
      //     end_date != null) {

        finalCacheObj.data.seasons.push(
          {
            ...season_main,
            number_of_clubs: num_clubs,
            start_date: start_date,
            end_date: end_date
          }
        )

      // }
    }

    await cacheTournamentsPageLeagueInfoData(url, finalCacheObj);

    // [ℹ] persist object; = impossible due to MAX-REQUEST EXCEEDED FREE PLAN
    // cacheRedisObj[finalCacheObj.url] = finalCacheObj
  }

  // [ℹ] persist-cache-response; HMSET()
  // await cacheTournamentsPageLeagueInfoData(cacheRedisObj);

  return
}

// [ℹ] complete set integration of GEO & SEO / TRANSLATION for league-info-widget

/*
  async function otherCompleteGEOandSEO () {
    
      // [ℹ] get HASURA-DB response;
    const response: Hasura_League_Info_Widget_Data_Response = await initGrapQLClient().request(GET_LEAGUE_INFO_FULL_DATA);

    const finalCacheObj: Cache_Single_Tournaments_League_Info_Data_Response = {
      lang: undefined,
      url: undefined,
      data: {
        name: undefined,
        country: undefined,
        image_path: undefined,
        betting_site_logo: undefined,
        beting_cta_link: undefined,
        seasons: []
      }
    }

    // deleteCacheTournamentsPageLeagueInfoData()

    // [ℹ] generate appropiate URLS
    for (const iterator of response.scores_tournaments) {
      // [ℹ] per LANG

      const tournament_id = iterator.tournament_id;

      const lang: string = removeDiacritics(iterator.lang.toString().toLowerCase()).replace(/\s/g,'-');
      const sport: string = removeDiacritics(iterator.sport.toString().toLowerCase()).replace(/\s/g,'-');
      const country: string = removeDiacritics(iterator.country.toString().toLowerCase()).replace(/\s/g,'-');
      const league_name: string = removeDiacritics(iterator.name.toString().toLowerCase()).replace(/\s/g,'-');

      // for (const geoSportbook of response.sportsbook_details) {
        
        // [ℹ] /{lang}/{sport}/{country}/{league_name} or /{sport}/{country}/{league_name} generation URL
        const url = iterator.lang == 'en' 
          // ? '/' + sport + '/' + country + '/' + league_name + "?geoPos=" + geoSportbook.lang
          // : '/' + lang  + '/' + sport + '/' + country + '/' + league_name + "?geoPos=" + geoSportbook.lang
          ? '/' + sport + '/' + country + '/' + league_name
          : '/' + lang  + '/' + sport + '/' + country + '/' + league_name

        finalCacheObj.url = url;
        finalCacheObj.lang = lang;

        // [ℹ] sportbook-details-info
        // for (const [key, value] of Object.entries(geoSportbook.data)) {
        //   // [ℹ] based on key-value-pair;
        //   if (geoSportbook.data[key].position.toString() === '1') {
        //     finalCacheObj.data.beting_cta_link = value.register_link === undefined ? '' : value.register_link
        //     finalCacheObj.data.betting_site_logo = value.image === undefined ? '' : value.image
        //   }
        // }

        const league_target = response.scores_football_leagues.find(( { name, id } ) => name === iterator.name && id === tournament_id)
        finalCacheObj.data.image_path = league_target.data.logo_path;

        finalCacheObj.data.country = country;
        finalCacheObj.data.name = league_name;

        // [ℹ] issues here;
        finalCacheObj.data.seasons = [] // [ℹ] reset

        // [ℹ] get all seasons for (this) league
        for (const season_main of league_target.seasons) {

          // [ℹ] match target X season from league Z to extra-info-season-data;
          const seasonExtraInfo = response.scores_football_seasons_details.find(( { id } ) => id === season_main.id)

          const num_clubs = seasonExtraInfo.data_stats 
          const start_date = seasonExtraInfo.start_date
          const end_date = seasonExtraInfo.end_date

          if (num_clubs != null && 
              start_date != null && 
              end_date != null) {

            finalCacheObj.data.seasons.push(
              {
                ...season_main,
                number_of_clubs: seasonExtraInfo.data_stats.number_of_clubs,
                start_date: seasonExtraInfo.start_date,
                end_date: seasonExtraInfo.end_date
              }
            )
          }
        }

        // globalArrFinal.push(finalCacheObj)
        // console.log(finalCacheObj.data.name)
        
        // const data = JSON.stringify(finalCacheObj, null, 4)
        // fs.appendFile('./test-global-final-asaw-without-geo.json', data, err => {
        //   if (err) {
        //     console.error(err);
        //   }
        //   // file written successfully
        // });


        // [ℹ] persist-cache-response;
        // await cacheTournamentsPageLeagueInfoData(url, finalCacheObj);
      // }

    }

  }
*/