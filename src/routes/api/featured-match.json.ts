
// ... import $app `modules`;
import { amp, browser, dev, mode, prerendering } from '$app/env'

// ... import necessary LIBRARIES & MODULES;
import { getTargetFixtureOdds, getTargetGeoSportBookDetails } from "$lib/firebase/index"
import { GET_ALL_FIXTURE_DATA, GET_LANG_SELECTED_FIXTURE } from "$lib/graphql/query"
import { initGrapQLClient } from '$lib/graphql/init_graphQL'

// ... DECLARING TYPESCRIPT-TYPES imports;
import type { FixtureResponse } from "$lib/model/interface-fixture"
import type { SelectedFixutre, CompleteFixtureData_Response } from "$lib/model/response_models"
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
    // ... extract the 'geo_js';
    if (dev) console.debug('-- req --', req)
    // ...
    userGeo = req.body
    // ... get the USER-GEO-LOCATION
    const response = await getFeaturedMatchData()
    // ... DEBUGGING;
    // if (dev) console.info('-- featured-match.json --', response)
    // ... return, RESPONSE;
    return {
        body: response
    }
}

// ... contains the main METHOD for DATA AGGREGATION & ASSIGNING;
async function getFeaturedMatchData() {
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
        assignValueBetsData();
    }

    // ... RETURN COMPLETE FEATRUED_MATCH_DATA;
    return WIDGET_SELECTED_FIXTURE_DATA
}

// ... [WORKING]
async function getSelectedFixture(lang: string) {
    // ... DEBUGGING;
    console.info('lang', lang)
    // ... declare variables for GRAPH-QL-REQUEST;
    let variables = { 
        lang: lang
    }
    // ... push-GRAPH-QL-request;
    let response = await initGrapQLClient().request(GET_LANG_SELECTED_FIXTURE, variables)
    // ... if `widget_featured_match_selection` is EMPTY;
    if (response.widget_featured_match_selection.length == 0) {
        // ... rerun the method;
        if (dev) console.info('-- uh-oh! re-running getSelectedFixture() --')
        // ... DEFAULT EN VALUE;
        userGeo = 'en'
        variables = { 
        lang: 'en'
    }
    response = await initGrapQLClient().request(GET_LANG_SELECTED_FIXTURE, variables)
    }
    // ... DEBUGGING;
    console.info('-- response getSelectedFixture() --', response)
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