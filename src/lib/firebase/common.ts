import type { FIREBASE_livescores_now } from "$lib/models/firebase";
import { sessionStore } from "$lib/store/session";
import { dlog, FIREBASE_DEBUG_STYLE, FIREBASE_DEBUG_TAG, FIREBASE_DEBUG_TOGGLE } from "$lib/utils/debug";
import type { FIRE_LNNS } from "@betarena/scores-lib/types/firebase.js";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { getLivescoresNow, getTargetRealDbData } from "./fixtures_odds";
import { db_real } from "./init";

/**
 * @description common method that will listen to 
 * real-time changes in Livescores_Now 
 * Firebase (REAL-DB);
 * @returns {Unsubscribe} Unsubscribe
 */
export function listenRealTimeLivescoresNowChange(
): Unsubscribe {

  dlog(`${FIREBASE_DEBUG_TAG} listenRealTimeLivescoresNowChange()`, FIREBASE_DEBUG_TOGGLE, FIREBASE_DEBUG_STYLE);
  const fixtureRef = ref(
    db_real,
    'livescores_now/'
  );
  const listenEventRef = onValue(fixtureRef, (snapshot) => {
    // [ℹ] break-down-values
    if (snapshot.val() != null) {
      const data: [
        string,
        FIREBASE_livescores_now
      ][] = Object.entries(snapshot.val());
      genLiveFixMap(data);
    }
  });
  return listenEventRef
}

/**
 * @description checks onValue changes for new 
 * Livescores_Now Table data changes;
 * @param {[string, FIREBASE_livescores_now][]} data
 * @returns {Promise < void >} Promise < void >
 */
export async function genLiveFixMap (
  data: [string, FIREBASE_livescores_now][]
): Promise < void > {
  dlog(`${FIREBASE_DEBUG_TAG} genLiveFixMap()`, FIREBASE_DEBUG_TOGGLE, FIREBASE_DEBUG_STYLE);
  const liveFixturesMap = new Map<number, FIREBASE_livescores_now>();
  // [ℹ] generate live-fixtures map
  for await (const live_fixture of data) {
    const fixture_id = parseInt(
      live_fixture[0].toString()
    );
    const fixture_data = live_fixture[1];
    liveFixturesMap.set(
      fixture_id,
      fixture_data
    );
  }
  dlog(liveFixturesMap, true)
  sessionStore.updateLivescores(liveFixturesMap)
}

/**
 * @description a one-off call to retrieve the
 * livescroes_now tabled (db) data for instant
 * update on limited conditions;
 * @returns {Promise < void >} Promise < void >
*/
export async function one_off_livescore_call (
): Promise < void > {
  const firebase_real_time = await getLivescoresNow();
  if (firebase_real_time != null) {
    const data: [
      string,
      FIREBASE_livescores_now
    ][] = Object.entries(firebase_real_time);
    genLiveFixMap(data);
  }
}

/**
 * @summary [MAIN] method
 * @description common method that will listen to 
 * real-time changes in "livescores_now_scoreboard" 
 * Firebase (REAL-DB);
 * @returns {Unsubscribe} Unsubscribe
 */
export function listenRealTimeScoreboardAll
(
): Unsubscribe 
{
  const fixtureRef = ref(
    db_real,
    'livescores_now_scoreboard/'
  );
  const listenEventRef = onValue(
    fixtureRef, 
    (
      snapshot
    ) => {
    if (snapshot.val() != null) {
      const data: [
        string,
        FIRE_LNNS
      ][] = Object.entries(snapshot.val());
      generateLiveScoreboardList(data);
    }
  });
  return listenEventRef
}

/**
 * @summary [MAIN] method
 * @description a one-off call to retrieve the
 * "livescroes_now_fixture_ids" table (db) data;
 * @version 1.0 - init [19/04/2023]
 * @returns {Promise < void >} NaN
*/
export async function onceRealTimeLiveScoreboard 
(
): Promise < void > 
{
  const firebaseData = await getTargetRealDbData
  (
    `livescores_now_scoreboard`
  );
  if (firebaseData != null) 
  {
    const data: [
      string,
      FIRE_LNNS
    ][] = Object.entries(firebaseData);
    console.log("🔥", data);
    generateLiveScoreboardList(data);
  }
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
  const liveFixturesMap = new Map<number, FIRE_LNNS>();
  for (const liveFixture of data) {
    const fixtureId = parseInt(
      liveFixture[0].toString()
    );
    const fixtureData = liveFixture[1];
    liveFixturesMap.set(
      fixtureId,
      fixtureData
    );
  }
  dlog(liveFixturesMap, true)
  sessionStore.updateLivescoreScoreboard(liveFixturesMap)
}