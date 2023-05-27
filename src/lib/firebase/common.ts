import { sessionStore } from "$lib/store/session";
import { dlog, FIREBASE_DEBUG_STYLE, FIREBASE_DEBUG_TAG, FIREBASE_DEBUG_TOGGLE } from "$lib/utils/debug";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { getTargetRealDbData } from "./firebase.actions.js";
import { db_real } from "./init";

import type { FIRE_LNNS, FIREBASE_livescores_now } from "@betarena/scores-lib/types/firebase.js";

// #region LIVESCORES_NOW

/**
 * @summary 
 * [MAIN]
 * @description 
 * ➨ listens to events changes in "livescores_now"
 * @returns 
 * {Unsubscribe}
 */
export function listenRealTimeLivescoresNowChange
(
): Unsubscribe 
{

  // [🐞]
  dlog
  (
    `${FIREBASE_DEBUG_TAG} listenRealTimeLivescoresNowChange()`, 
    FIREBASE_DEBUG_TOGGLE, 
    FIREBASE_DEBUG_STYLE
  );

  const dataRef = ref
  (
    db_real,
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
 * @summary 
 * [MAIN]
 * @description
 * ➨ one-off request "livescores_now" (db) data;
 * ➨ kickstarts liveMap generation;
 * @returns 
 * {Promise < void >}
*/
export async function one_off_livescore_call
(
): Promise < void > 
{
  const firebaseData = await getTargetRealDbData
  (
    `livescores_now`
  );

  const data: [string, FIREBASE_livescores_now][] = 
    firebaseData != null
      ? Object.entries(firebaseData)
      : []
  ;

  genLiveFixMap(data);
}


/**
 * @summary 
 * [MAIN]
 * @description
 * ➨ one-off request "X" target path (real-db) data;
 * ➨ kickstarts liveMap generation;
 * @returns 
 * {Promise < void >}
*/
export async function onceTargetLivescoreNowFixtureGet
(
  path: string
): Promise < void > 
{
  const firebaseData: FIREBASE_livescores_now = await getTargetRealDbData
  (
    path
  );
  sessionStore.updateLivescoresTarget
  (
    firebaseData
  );
}

/**
 * @summary 
 * [MAIN]
 * @description common method that will listen to 
 * real-time changes in "livescores_now_scoreboard" 
 * Firebase (REAL-DB);
 * @returns {Unsubscribe} Unsubscribe
 */
export function targetLivescoreNowFixtureListen
(
  path: string
): Unsubscribe 
{
  console.log('targetLivescoreNowFixtureListen | START')
  
  const dbRef = ref
  (
    db_real,
    path
  );

  const listenEventRef = onValue
  (
    dbRef, 
    (
      snapshot
    ) => 
    {
      const firebaseData: FIREBASE_livescores_now = snapshot.val();
      sessionStore.updateLivescoresTarget
      (
        firebaseData
      );
    }
  );

  console.log('targetLivescoreNowFixtureListen | END')

  return listenEventRef 
}

/**
 * @summary 
 * [MAIN]
 * @description
 * ➨ generates a liveMap and stores in svelte-store (session);
 * @param 
 * {[string, FIREBASE_livescores_now][]} data
 * @returns 
 * {Promise < void >}
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

  // [🐞]
  dlog
  (
    liveFixturesMap, 
    true
  );

  sessionStore.updateLivescores
  (
    liveFixturesMap
  );
}

// #endregion LIVESCORES_NOW

// #region LIVESCORES_NOW_SCOREBOARD

/**
 * @summary 
 * [MAIN]
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
    db_real,
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
 * @summary 
 * [MAIN]
 * @description 
 * ➨ one-off request "livescores_now_scoreboard" (db) data;
 * @version 
 * 1.0 - init [19/04/2023]
 * @returns 
 * {Promise < void >}
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
 * @summary 
 * [HELPER]
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