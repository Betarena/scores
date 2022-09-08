/**
 * Firebase Methods for Featured Betting Sites
 * Widget on the Betarena Scores Platform
 * ~~~~~~~~~~~~~~~~~
 * ... & methods;
*/
import { dev } from '$app/environment'
import { ref, get, child } from 'firebase/database'
import { db_real } from '$lib/firebase/init'
import type { LiveScore_SEO_Game } from '$lib/models/featured_betting_sites/firebase-real-db-interface';

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * ... obtains all of the livescores football details data `real_db` Firebase-DB
*/
export async function getAllLiveScoresFootball(): Promise < LiveScore_SEO_Game[] > {

    // ... get all the `livescores_table_all` data from `Firebase DB`;
    return get(child(ref(db_real), `livescores_table/livescores_today`)).then((snapshot) => {

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