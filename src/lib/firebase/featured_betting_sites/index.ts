/**
 * Firebase Methods for Featured Betting Sites
 * Widget on the Betarena Scores Platform
 * ~~~~~~~~~~~~~~~~~
 * ... & methods;
*/
import { db_real } from '$lib/firebase/init'
import { child, get, ref } from 'firebase/database'

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... obtains all of the sportbook details data `real_db` Firebase-DB
 * ... @param userGeoLocation
*/
export async function getAllSportbookDetails(): Promise < any > {

    // ... get all the `sportbook_details` data from `Firebase DB`;
    return get(child(ref(db_real), `sportsbook_details`)).then((snapshot) => {

        // ... existance verifying;
        if (snapshot.exists()) {

            // ... return RAW DATA;
            return snapshot.val()

        // ... else, return `empty`;
        } else {

            // ... return null;
            return;
        }
    })
}