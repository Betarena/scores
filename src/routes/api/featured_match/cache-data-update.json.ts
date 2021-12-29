
// ... import $app `modules`;
import { dev } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { getTargetFixtureOdds, getTargetGeoSportBookDetails } from "$lib/firebase/index"
import { GET_ALL_FIXTURE_DATA, GET_LANG_SELECTED_FIXTURE, GET_ALL_SELECTED_MATCH_FIXTURES } from "$lib/graphql/query"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { FixtureResponse } from "$lib/model/interface-fixture"
import type { SelectedFixutre, SelectedFixture_AllData, CompleteFixtureData_Response } from "$lib/model/response_models"
import type { SelectedFixture_LiveOdds_Response } from "$lib/model/firebase-real-db-interface"

// ... server-variables;
let userGeo: string

// ... declaring component INSTANCED & VARIABLES;
let WIDGET_SELECTED_FIXTURE_DATA: FixtureResponse = {
    // ... contains the final-fixture-response-data;
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
    translation: undefined,
    selected_data: undefined
}

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/

export async function post(req, res): Promise < any > {
    // ... DEBUGGING;
    if (dev) console.debug('-- updating featured_match_widget_cache --')
    // ... clear the cache data for `featured_match_data`
    await deleteCacheFeaturedMatch()
    // ... get all of the SELECTED FIXTURES from HASURA;
    const response = await getAllMatchSelectedFixtures()
    // ... iterate over EACH SELECTED FIXTURE, lang, by lang;
    for await (const selected_fixture of response.widget_featured_match_selection) {
        userGeo = selected_fixture.lang
        const response_cache = await getFeaturedMatchData()
        // ... cache-response;
        await cacheFeaturedMatchGeoPos(userGeo, response_cache);
    }
    // ... DEBUGGING;
    // if (dev) console.info('-- featured-match.json --', response)
    // ... return, RESPONSE;
    return {
        status: 200,
        body: 'Success! Featured Match Data Updated!'
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//     CACHING w/ REDIS
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - cacheFeaturedMatchGeoPos(geoPos, json_cache)
// - deleteCacheFeaturedMatch()
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function cacheFeaturedMatchGeoPos(geoPos: string, json_cache: FixtureResponse) {
    // ... TRY;
    try {
      //... store (cache) featured_match response,
      await redis.hset('featured_match', geoPos, JSON.stringify(json_cache));
    } 
    // ... CATCH, ERROR;
    catch (e) {
      console.log("Unable to cache", geoPos, e);
    }
}

async function deleteCacheFeaturedMatch() {
    await redis.del('featured_match')
    return
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  STANDARD API FALLBACK
// ~~~~~~~~~~~~~~~~~~~~~~~~
// - getAllMatchSelectedFixtures()
// - getFeaturedMatchData()
// - getSelectedFixture(userGeoLang: string)
// - get_CompleteFixtureData(fixture_id: number)
// - get_TargetFixtureOddsAndInfo(selectedFixutreData: SelectedFixutre)
// - assignValueBetsData()
// ~~~~~~~~~~~~~~~~~~~~~~~~

// ... contains all of the `match-selected-fixtures` data;
async function getAllMatchSelectedFixtures(): Promise < SelectedFixture_AllData > {
    // ... DEBUGGING;
    if (dev) console.info('-- getting all of the selected-match-fixtures --')
    // ... push-GRAPH-QL-request;
    const response = await initGrapQLClient().request(GET_ALL_SELECTED_MATCH_FIXTURES)
    // ... DEBUGGING;
    if (dev) console.info('-- response getAllMatchSelectedFixtures() --', response)
    // ... reutrn response;
    return response
}

// ... contains the main METHOD for DATA AGGREGATION & ASSIGNING;
async function getFeaturedMatchData(): Promise < FixtureResponse > {
    // ... obtain the target-selected-fixture [HASURA-DB] [FEATURED-MATCH + TRANSLATION DATA]
    const selectedFixture = await getSelectedFixture(userGeo)
    // ... [selectedFixture] break-down response;
    const selected_fixture_id = selectedFixture.widget_featured_match_selection[0].fixture_id

    // ... continue; 
    // ... create a promise, for obtaining the complete fixture odds data;
    const promise = await get_TargetFixtureOddsAndInfo(selectedFixture.widget_featured_match_selection[0])

    // ... continue; 
    // ... get the complete fixture data in one JSON Object;
    const completeData = await get_CompleteFixtureData(selected_fixture_id)
    // ... [completeData] break-down response;
    // ...
    WIDGET_SELECTED_FIXTURE_DATA = completeData.week_fixtures_by_pk
    // ...
    WIDGET_SELECTED_FIXTURE_DATA.best_players = completeData.widget_featured_match_best_player_by_pk
    // ...
    WIDGET_SELECTED_FIXTURE_DATA.match_votes = completeData.widget_featured_match_votes_by_pk
    // ... 
    WIDGET_SELECTED_FIXTURE_DATA.live_odds = promise
    // ... 
    WIDGET_SELECTED_FIXTURE_DATA.translation = selectedFixture.widget_featured_match_translations
    // ... 
    WIDGET_SELECTED_FIXTURE_DATA.selected_data = selectedFixture.widget_featured_match_selection[0]

    // ... continue; 
    // ... get the fixture value-bets;
    // ... handles `WIDGET_SELECTED_FIXTURE_DATA.valuebets`
    if (WIDGET_SELECTED_FIXTURE_DATA.valuebets != null) {
        await assignValueBetsData();
    }

    // ... RETURN COMPLETE FEATRUED_MATCH_DATA;
    return WIDGET_SELECTED_FIXTURE_DATA
}

// ... [WORKING]
async function getSelectedFixture(lang: string) {
    // ... DEBUGGING;
    if (dev) console.info('lang', lang)
    // ... declare variables for GRAPH-QL-REQUEST;
    const variables = { 
        lang: lang
    }
    // ... push-GRAPH-QL-request;
    const response = await initGrapQLClient().request(GET_LANG_SELECTED_FIXTURE, variables)
    // ... DEBUGGING;
    if (dev) console.info('-- response getSelectedFixture() --', response)
    // ... reutrn response;
    return response
}

// ... [WORKING]
async function get_CompleteFixtureData(fixture_id: number): Promise < CompleteFixtureData_Response > {
    // ... DEBUGGING;
    if (dev) console.info('-- fixture_id --', fixture_id)
    // ... declare variables for GRAPH-QL-REQUEST;
    const variables = { 
        id: fixture_id, 
        fixture_id: fixture_id 
    }
    // ... push-GRAPH-QL-request;
    const response = await initGrapQLClient().request(GET_ALL_FIXTURE_DATA, variables)
    // ... DEBUGGING;
    if (dev) console.info('-- response get_CompleteFixtureData() --', response)
    // ... reutrn response;
    return response;
}

// ... [WORKING]
async function get_TargetFixtureOddsAndInfo(selectedFixutreData: SelectedFixutre): Promise < SelectedFixture_LiveOdds_Response > {
    // ... get the list of the odds for the;
    const response = await getTargetFixtureOdds(selectedFixutreData)
    // ... return,
    return response
}

// ... [WORKING]
async function assignValueBetsData(): Promise < void > {
    // ... obtain-target-fixture-bookmaker-site-name;
    const siteName: string = WIDGET_SELECTED_FIXTURE_DATA.valuebets.bookmaker
    // ... pass-in-sport-book-details-parameters;
    const sportbook_details: any = await getTargetGeoSportBookDetails(
        userGeo,
        siteName
    )
    // ... check if the data returned exists;
    if (Object.keys(sportbook_details).length === 0) {
        // ... if not, return `null`;
        WIDGET_SELECTED_FIXTURE_DATA.valuebets = null
        return
    }
    else {
        // ... otherwise, append the image & the registration link to the data;
        WIDGET_SELECTED_FIXTURE_DATA.valuebets = {
            ...WIDGET_SELECTED_FIXTURE_DATA.valuebets,
            image: sportbook_details.betting_site_info.image,
            link: sportbook_details.betting_site_info.register_link,
        }
    }
}