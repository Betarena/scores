import type { FIREBASE_livescores_now } from "$lib/models/firebase";
import { sessionStore } from "$lib/store/session";
import { dlog, FIREBASE_DEBUG_STYLE, FIREBASE_DEBUG_TAG, FIREBASE_DEBUG_TOGGLE } from "$lib/utils/debug";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { getLivescoresNow } from "./fixtures_odds";
import { db_real } from "./init";

/**
 * @description [LISTEN-DATA-FETCH] method
 * listens to eal-time changes in 
 * Livescores_Now Table on Firebase (REAL-DB);
 * @returns {Promise < Unsubscribe >} Promise < Unsubscribe >
 */
export async function listenRealTimeLivescoresNowChange(
): Promise < Unsubscribe > {

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
  for (const live_fixture of data) {
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