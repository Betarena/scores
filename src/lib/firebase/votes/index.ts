import { dev } from '$app/environment'
import { ref, get, child, type Unsubscribe } from 'firebase/database'
import { db_real } from '$lib/firebase/init'

import type { 
  FIREBASE_odds 
} from '$lib/models/firebase'
import type { 
  Tournament_Fixture_Odds 
} from '$lib/models/tournaments/fixtures_odds/types'

/**
 * ==================================
 * [ℹ] SCOREBOARD FIREBASE METHODS 
 * ==================================
*/

export async function get_odds (
  fixture_time: string,
  fixture_id: number
): Promise < FIREBASE_odds[] > {

  const sportbook_array: FIREBASE_odds[] = []

  // [ℹ] [GET] target fixture odds
  // [ℹ] only non-"FT" in THIS method

  const year_: string = new Date(fixture_time).getFullYear().toString();
  const month_: number = new Date(fixture_time).getMonth();
  let new_month_ = (month_ + 1).toString();
  new_month_ = (`0${new_month_}`).slice(-2);
  let day_ = new Date(fixture_time).getDate().toString();
  day_ = (`0${day_}`).slice(-2);

  await get(child(ref(db_real), `odds/${year_}/${new_month_}/${day_}/${fixture_id}`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data: [string, FIREBASE_odds][] = Object.entries(snapshot.val())
      for (const sportbook of data) {
        sportbook[1].sportbook = sportbook[0].toString();
        sportbook_array.push(sportbook[1])
      }
    }
  })

  return sportbook_array
}