/**
 * FIREBASE FUNCTIONS
 * ------------------
 * & methods;
 */
import { dev } from '$app/environment';
import { child, get, ref } from 'firebase/database';

import { db_real } from './init';

import type { SelectedFixture_LiveOdds_Response } from '$lib/models/featured_match/firebase-real-db-interface';
import type { SelectedFixutre } from '$lib/models/featured_match/response_models';
import { logDevGroup } from '$lib/utils/debug';

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... obtain the data from the `real_db` firebase DB
 * ... according to the users current geo-location
 *
 * @param userGeoLocation
*/
export async function getTargetFixtureOdds (
	fixture_data: SelectedFixutre
): Promise<SelectedFixture_LiveOdds_Response> {
	// ... DEBUGGING;
  if (dev) logDevGroup ("firebase [DEV]", `fixture_data: ${fixture_data}`)
	// ... convert the datetime to the correct variables to search for the fixture;
	const year_: string = new Date(fixture_data.date).getFullYear().toString();
	const month_: number = new Date(fixture_data.date).getMonth();
	// ... apply-correct-month-structure;
	let new_month_ = (month_ + 1).toString();
	new_month_ = (`0${new_month_}`).slice(-2);
	// ... apply-correct-day-structure;
	let day_ = new Date(fixture_data.date).getUTCDate().toString();
	day_ = (`0${day_}`).slice(-2);
	// ... obtain FIXTURE-ID;
	const fixtureId = fixture_data.fixture_id;
	// ... obtain-fixture-language;
	const lang: string = fixture_data.lang;
	// ... obtain-sportbook-details;
	const sportbook_details = await getTargetGeoSportBookDetails(lang);
  if (dev) logDevGroup ("firebase [DEV]", `odds/${year_}/${new_month_}/${day_}/${fixtureId}`)
	// ... return the odds-site info & the odds values;
	return get(child(ref(db_real), `odds/${year_}/${new_month_}/${day_}/${fixtureId}`)).then(
		(snapshot) => {
			// ... check if the data exists (should exist at all times anyway);
			if (snapshot.exists()) {
				// ...
				const fixture_odds = snapshot.val();
				const fixture_odds_keys = Object.keys(snapshot.val());
				// ... get the `sportbook-details` data;
				const map = new Map();
				let count = 0;
				// ... iterate over the data of the `lang` in sportbook details;
				for (const rankedOdd in sportbook_details) {
					// ... iterate over the data of the fixture avaiable ODDS;
					for (const avaiableOdd in fixture_odds_keys) {
						// ...
						const targetFixture = fixture_odds_keys[avaiableOdd];
						const fixtureOdd = fixture_odds[targetFixture];
						// ... check for a match of the odds names;
						if (fixture_odds_keys[avaiableOdd].toString().toLowerCase() == sportbook_details[rankedOdd]['title'].toString().toLowerCase() &&
							fixtureOdd['markets']['1X2FT'] != null &&
							fixtureOdd['markets'] != null &&
							count != 1) {
							// ...
							map.set('fixture_odds', fixtureOdd);
							map.set('fixture_odds_info', sportbook_details[rankedOdd]);
							count = 1;
						}
					}
				}
				// ...
				const obj = Object.fromEntries(map);
				// ... return the response as an Array;
				return obj;
			} else {
				throw new Error(`Data from DB is incorrect: getTargetFixtureOdds() fixture_data ${fixture_data}`);
			}
		}
	);
}


/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... obtain the data from the `real_db` firebase DB
 * ... according to the users current geo-location
 *
 * @param userGeoLocation
*/
export async function getTargetGeoSportBookDetails(lang: string, siteName?: string): Promise<unknown> {
	// ... return the odds-site info & the odds values;
	if (siteName != undefined) {
    if (dev) logDevGroup ("firebase [DEV]", `siteName: ${siteName}`)
		return get(child(ref(db_real), `sportsbook_details/${lang}`)).then((snapshot) => {
			// ... check if the data exists (should exist at all times anyway);
			if (snapshot.exists()) {

				const map = new Map();
				const sportbook_details_ = snapshot.val();

				for (const rankedOdd in sportbook_details_) {
					// ... check for a match of the odds names;
					if (
						siteName.toLowerCase().toString() ==
						sportbook_details_[rankedOdd]['title'].toLowerCase().toString()
					) {
						map.set('betting_site_info', sportbook_details_[rankedOdd]);
					}
				}

				const obj = Object.fromEntries(map);

				// ... return the response as an Array;
				return obj;
			} else {
				throw new Error(`Data from DB is incorrect: getTargetGeoSportBookDetails() lang: ${lang} sitename: ${siteName}`);
			}
		});
	} else {
		return get(child(ref(db_real), `sportsbook_details/${lang}`)).then((snapshot) => {
			// ... check if the data exists (should exist at all times anyway);
			if (snapshot.exists()) {

				// return the response as an Array;
				return snapshot.val();
			} else {
				throw new Error(`Data from DB is incorrect: getTargetGeoSportBookDetails() lang-only: ${getTargetGeoSportBookDetails}`);
			}
		});
	}
}