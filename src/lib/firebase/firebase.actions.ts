import { db_real } from '$lib/firebase/init';
import { child, get, onValue, ref } from 'firebase/database';

import type { Tournament_Fixture_Odds } from '$lib/models/tournaments/fixtures_odds/types';
import type { FIREBASE_odds } from '@betarena/scores-lib/types/firebase.js';

/**
 * @summary 
 * [MAIN]
 * @description 
 * generates a MAP of fixtures with their ODDS from real-time DB;
 * @param 
 * {object} fixtures_arr_filter 
 * @returns
 */
export async function getOdds_1
(
	fixtures_arr_filter: {
		date: Date;
		fixtures: Tournament_Fixture_Odds[];
	}[]
): Promise< Map < number, FIREBASE_odds[] > > 
{
	const fixtureOddsMap: Map<number,FIREBASE_odds[]> = new Map<number, FIREBASE_odds[]>();

	// loop over (season) fixtures
	for await (const season_fixture_date_group of fixtures_arr_filter) 
  {
		const year_: string = new Date(season_fixture_date_group.date).getFullYear().toString();
		const month_: number = new Date(season_fixture_date_group.date).getMonth();
		let new_month_ = (month_ + 1).toString();
		new_month_ = `0${new_month_}`.slice(-2);
		let day_ = new Date(season_fixture_date_group.date).getDate().toString();
		day_ = `0${day_}`.slice(-2);

	  // loop over (season) fixtures
		for await (const season_fixture of season_fixture_date_group.fixtures) 
    {
			if (season_fixture.status == 'FT') continue;

			const fixture_id = season_fixture.id;

			get
      (
				child
        (
					ref
          (
            db_real
          ),
					`odds/${year_}/${new_month_}/${day_}/${fixture_id}`
				)
			)
      .then
      (
        (
          snapshot
        ) => 
        {
          if (snapshot.exists()) 
          {
            const sportbook_array: FIREBASE_odds[] = [];
            const data: [string, FIREBASE_odds][] = Object.entries(snapshot.val());
            for (const sportbook of data) 
            {
              sportbook[1].sportbook = sportbook[0].toString();
              sportbook_array.push(sportbook[1]);
            }
            fixtureOddsMap.set
            (
              fixture_id,
              sportbook_array
            );
          }
			  }
      );
		}
	}

	return fixtureOddsMap;
}

/**
 * @summary 
 * [MAIN]
 * @description 
 * obtains array of target FIXTURE odds;
 * @param 
 * {string} fixture_time 
 * @param 
 * {number} fixture_id 
 * @returns
 */
export async function getOdds_2
(
	fixture_time: string,
	fixture_id: number
): Promise < FIREBASE_odds[] > 
{
	const sportbook_array: FIREBASE_odds[] = [];

	const year_: string = new Date(fixture_time).getFullYear().toString();
	const month_: number = new Date(fixture_time).getMonth();
	let new_month_ = (month_ + 1).toString();
	new_month_ = `0${new_month_}`.slice(-2);
	let day_ = new Date(fixture_time).getDate().toString();
	day_ = `0${day_}`.slice(-2);

	await get
  (
		child
    (
			ref
      (
        db_real
      ),
			`odds/${year_}/${new_month_}/${day_}/${fixture_id}`
		)
	)
  .then
  (
    (
      snapshot
    ) => 
    {
      if (snapshot.exists()) 
      {
        const data: [string, FIREBASE_odds][] =	Object.entries(snapshot.val());
        for (const sportbook of data) 
        {
          sportbook[1].sportbook = sportbook[0].toString();
          sportbook_array.push(sportbook[1]);
        }
      }
	  }
  );

	return sportbook_array;
}

/**
 * @summary 
 * [MAIN]
 * @description 
 * simple one-off GET query for the target real DB data path retrieval;
 * @param 
 * {string} path
 * @returns 
 * an unknown object
 */
export async function getTargetRealDbData
(
  path: string
) 
{
  const connectRef = ref
  (
    db_real
  );

  const snapshot = await get
  (
		child
    (
      connectRef, 
      path
    )
	);

  if (snapshot.exists()) return snapshot.val();
  return null;
}

// TEMP
export async function realDbHeartBeat
(
)
{
  const connectedRef = ref
  (
    db_real, 
    ".info/connected"
  );
  onValue
  (
    connectedRef, 
    (
      snap
    ) => 
    {
      if (snap.val() === true) {
        console.log("connected");
      } else {
        console.log("not connected");
      }
    }
  );
}