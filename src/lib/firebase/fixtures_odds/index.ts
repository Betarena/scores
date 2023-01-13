import { db_real } from '$lib/firebase/init'
import type { FIREBASE_odds } from '$lib/models/firebase'
import type { Tournament_Fixture_Odds } from '$lib/models/tournaments/fixtures_odds/types'
import { child, get, ref } from 'firebase/database'

export async function getLivescoresNow(): Promise < unknown > {

  return await get(child(ref(db_real), `livescores_now`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return;
    }
  })
}

export async function getOdds (
  fixtures_arr_filter: {
    date: Date
    fixtures: Tournament_Fixture_Odds[]
  }[]
): Promise < Map<number, FIREBASE_odds[]> > {

  const realTimeOddsListenMap: Map<number, FIREBASE_odds[]> = new Map<number, FIREBASE_odds[]>();

  // [ℹ] iterate over ALL fixtures
  // [ℹ] of SELECTED season
  for await (const season_fixture_date_group of fixtures_arr_filter) {

    // [ℹ] convert the datetime to the correct variables to search for the fixture;
    const year_: string = new Date(season_fixture_date_group.date).getFullYear().toString();
    const month_: number = new Date(season_fixture_date_group.date).getMonth();
    let new_month_ = (month_ + 1).toString();
    new_month_ = (`0${new_month_}`).slice(-2);
    let day_ = new Date(season_fixture_date_group.date).getDate().toString();
    day_ = (`0${day_}`).slice(-2);

    // [ℹ] iterater over fixtures 
    // [ℹ] [BY DATE GROUP]
    // [ℹ] assign "onValue" event-listeners
    for await (const season_fixture of season_fixture_date_group.fixtures) {

      if (season_fixture.status == "FT") {
        continue
      }

      const fixture_id = season_fixture.id;

      get(child(ref(db_real), `odds/${year_}/${new_month_}/${day_}/${fixture_id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const sportbook_array: FIREBASE_odds[] = []
          const data: [string, FIREBASE_odds][] = Object.entries(snapshot.val())
          for (const sportbook of data) {
            sportbook[1].sportbook = sportbook[0].toString();
            sportbook_array.push(sportbook[1])
          }
          realTimeOddsListenMap.set(fixture_id, sportbook_array)
        }
      })
    }
  }

  return realTimeOddsListenMap
}