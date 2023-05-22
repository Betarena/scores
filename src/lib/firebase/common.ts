import { sessionStore } from "$lib/store/session";
import { dlog, FIREBASE_DEBUG_STYLE, FIREBASE_DEBUG_TAG, FIREBASE_DEBUG_TOGGLE } from "$lib/utils/debug";
import type { FIRE_LNNS, FIREBASE_livescores_now } from "@betarena/scores-lib/types/firebase.js";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { getTargetRealDbData } from "./firebase.actions.js";
import { realDb } from "./init";

// #region LIVESCORES_NOW

/**
 * @summary [MAIN]
 * @description common method that listens to 
 * real-time changes in "livescores_now" 
 * Firebase (REAL-DB);
 * @returns {Unsubscribe}
 */
export function listenRealTimeLivescoresNowChange
(
): Unsubscribe 
{

  dlog(`${FIREBASE_DEBUG_TAG} listenRealTimeLivescoresNowChange()`, FIREBASE_DEBUG_TOGGLE, FIREBASE_DEBUG_STYLE);

  const dataRef = ref
  (
    realDb(),
    'livescores_now/'
  );

  const listenEventRef = onValue
  (
    dataRef, 
    (
      snapshot
    ) => 
    {
      if (snapshot.val() != null) 
      {
        const data: [
          string,
          FIREBASE_livescores_now
        ][] = Object.entries(snapshot.val());
        genLiveFixMap(data);
      }
    }
  );

  return listenEventRef
}

/**
 * @summary [MAIN]
 * @description a one-off call to instantly
 * retrieve the "livescroes_now" (db) data;
 * @returns {Promise < void >}
*/
export async function one_off_livescore_call
(
): Promise < void > 
{
  const firebase_real_time = await getTargetRealDbData
  (
    `livescores_now`
  );

  if (firebase_real_time != null) 
  {
    const data: 
    [
      string,
      FIREBASE_livescores_now
    ][] = Object.entries(firebase_real_time);
    genLiveFixMap(data);
  }

}

/**
 * @summary [MAIN]
 * @description checks onValue changes for new 
 * "livescores_now" data changes;
 * @param {[string, FIREBASE_livescores_now][]} data
 * @returns {Promise < void >}
 */
export async function genLiveFixMap
(
  data: [string, FIREBASE_livescores_now][]
): Promise < void > 
{
  // [🐞]
  dlog
  (
    `${FIREBASE_DEBUG_TAG} genLiveFixMap()`, 
    FIREBASE_DEBUG_TOGGLE, 
    FIREBASE_DEBUG_STYLE
  );

  const liveFixturesMap = new Map<number, FIREBASE_livescores_now>();

  for await (const live_fixture of data) 
  {
    const fixture_id = parseInt
    (
      live_fixture[0].toString()
    );

    const fixture_data = live_fixture[1];

    liveFixturesMap.set
    (
      fixture_id,
      fixture_data
    );
  }

  dlog(liveFixturesMap, true)

  sessionStore.updateLivescores
  (
    liveFixturesMap
  )
}

// #endregion LIVESCORES_NOW

// #region LIVESCORES_NOW_SCOREBOARD

/**
 * @summary [MAIN]
 * @description common method that will listen to 
 * real-time changes in "livescores_now_scoreboard" 
 * Firebase (REAL-DB);
 * @returns {Unsubscribe} Unsubscribe
 */
export function listenRealTimeScoreboardAll
(
): Unsubscribe 
{
  console.log('listenRealTimeScoreboardAll | START')
  
  const dbRef = ref
  (
    realDb(),
    'livescores_now_scoreboard'
  );

  const listenEventRef = onValue
  (
    dbRef, 
    (
      snapshot
    ) => 
    {
      if (snapshot.val() != null) 
      {
        const data: 
        [
          string,
          FIRE_LNNS
        ][] = Object.entries(snapshot.val());
        generateLiveScoreboardList(data);
      }
    }
  );

  console.log('listenRealTimeScoreboardAll | END')

  return listenEventRef 
}

/**
 * @summary [MAIN] method
 * @description a one-off call to retrieve the
 * "livescores_now_scoreboard" (db) data;
 * @version 1.0 - init [19/04/2023]
 * @returns {Promise < void >}
*/
export async function onceRealTimeLiveScoreboard 
(
): Promise < void > 
{
  console.log('onceRealTimeLiveScoreboard | START')
  
  const firebaseData = await getTargetRealDbData
  (
    `livescores_now_scoreboard`
  );

  console.log('firebaseData', firebaseData)
  const data: [string, FIRE_LNNS][] = 
    firebaseData != null
      ? Object.entries(firebaseData)
      : []
  ;
  generateLiveScoreboardList(data);

  console.log('onceRealTimeLiveScoreboard | END')
}

/**
 * @summary [HELPER] method
 * @description generates a MAP of livescores-now
 * (scoreboard) data structure;
 * @param {[string, FIRE_LNNS][]} data 
 */
function generateLiveScoreboardList
(
  data: [string, FIRE_LNNS][]
): void
{

  console.log("🔥 REAL-TIME (source)", data);

  const liveFixturesMap = new Map<number, FIRE_LNNS>();

  for (const liveFixture of data) 
  {
    const fixtureId = parseInt
    (
      liveFixture[0].toString()
    );

    const fixtureData = liveFixture[1];

    liveFixturesMap.set
    (
      fixtureId,
      fixtureData
    );
  }

  console.log("🔥 REAL-TIME", liveFixturesMap);

  // [🐞]
  dlog
  (
    liveFixturesMap, 
    true
  )

  sessionStore.updateLivescoreScoreboard
  (
    liveFixturesMap
  )
}

// #endregion LIVESCORES_NOW_SCOREBOARD