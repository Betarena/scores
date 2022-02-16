/**
 * Firebase Methods for Featured Betting Sites
 * Widget on the Betarena Scores Platform
 * ~~~~~~~~~~~~~~~~~
 * ... & methods;
*/
import { dev } from '$app/env'
import { ref, get, child } from 'firebase/database'
import { db_real } from '$lib/firebase/init'
import type { LiveScoreGame } from '$lib/model/response_models';
import type { All_Livescores_Football } from '$lib/model/featured_betting_sites/firebase-real-db-interface';

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... obtains all of the livescores football details data `real_db` Firebase-DB
 * ... @param userGeoLocation
*/
export async function getAllLiveScoresFootball(): Promise < All_Livescores_Football > {

    // ... get all the `livescores_table_all` data from `Firebase DB`;
    return get(child(ref(db_real), `livescores_table_all`)).then((snapshot) => {

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