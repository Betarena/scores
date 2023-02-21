/**
 * Firebase Methods for Featured Betting Sites
 * Widget on the Betarena Scores Platform
 * ~~~~~~~~~~~~~~~~~
 * ... & methods;
 */
import { db_real } from '$lib/firebase/init';
import {
	child,
	get,
	ref
} from 'firebase/database';

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... obtains all of the sportbook details data `real_db` Firebase-DB
 * ... @param userGeoLocation
 */
export async function getAllSportbookDetails(): Promise<unknown> {
	// ... get all the `sportbook_details` data from `Firebase DB`;
	return await get(
		child(ref(db_real), `sportsbook_details`)
	).then((snapshot) => {
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			return;
		}
	});
}
