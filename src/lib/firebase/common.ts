// #region ➤ 📦 Package Imports

import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlog } from '$lib/utils/debug.js';
import { DataSnapshot, onValue, ref, type DatabaseReference, type Unsubscribe } from 'firebase/database';
import { arrayRemove, arrayUnion, doc, DocumentReference, DocumentSnapshot, getDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { getTargetRealDbData } from './firebase.actions.js';
import { db_firestore, db_real } from './init';

import type { BetarenaUser } from '$lib/types/types.scores.js';
import type { FIRE_LNNS, FIRE_LNPI, FIREBASE_livescores_now, FIREBASE_odds } from '@betarena/scores-lib/types/firebase.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

// #region 🔥 USER

/**
 * @description
 * TODO: DOC:
 * @see https://firebase.google.com/docs/firestore/query-data/listen#web-modular-api_3
 * @param
 * { string } uid - Target user UID.
 */
export function userBalanceListen
(
  uid: string
): void
{
  const _unsubscribe: Unsubscribe = onSnapshot
  (
    doc
    (
      db_firestore,
      'betarena_users',
      uid
    ),
    (
      doc
    ): void =>
    {
      const data: BetarenaUser = doc.data();
      userBetarenaSettings.userUpdateBTABalance
      (
        data.main_balance
      );
      userBetarenaSettings.userUpdateBTABalance2
      (
        data.investor_balance
      );
    }
  );
}

/**
 * @description
 * TODO: DOC:
 */
export async function userUpdateBalance
(
  uid: string,
  balanceChng: number
): Promise < void >
{
  const userRef: DocumentReference  = doc
  (
    db_firestore,
    'betarena_users',
    uid
  );

  await updateDoc
  (
    userRef,
    {
      main_balance: balanceChng
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update target **user** balance for **investor wallet**.
 * @param { object } opts
 *  💠 Target method `options`.
 * @param { string } opts.uid
 *  💠 Target `user` (uid) to have balance updated.
 * @param { number } opts.deltaBalance
 *  💠 Target `new balance` to be set.
 * @param { 'tge' | 'total' } opts.type
 *  💠 Target `type` balance being updated.
 * @returns { Promise < void > }
 */
export async function userUpdateInvestorBalance
(
  opts:
  {
    uid: string
    , deltaBalance: number
    , type: 'tge' | 'total'
  }
): Promise < void >
{
  const
    userRef: DocumentReference  = doc
    (
      db_firestore
      , 'betarena_users'
      , opts.uid
    )
  ;

  if (opts.type == 'total')
  {
    await updateDoc
    (
      userRef
      , {
        'investor_balance.grand_total': increment(opts.deltaBalance)
      }
    );
  }
  else
  {
    await updateDoc
    (
      userRef
      , {
        'investor_balance.grand_total': increment(opts.deltaBalance)
        , 'investor_balance.tge_to_claim': increment(opts.deltaBalance)
      }
    );
  }

  return;
}

/**
 * @summary
 *  🟥 MAIN | 🔹 HELPER
 * @description
 *  📌 Toggles target for Betarena `user` of their `userguide` **opt-out**.
 * @returns { Promise < void > }
 */
export async function userToggleUserguideOptOut
(
  uid: string,
  userguideId: number,
  currentOptOuts: number[]
): Promise < void >
{
  const userRef: DocumentReference  = doc
  (
    db_firestore,
    'betarena_users',
    uid
  );

  if (currentOptOuts.includes(userguideId))
  {
    await updateDoc
    (
      userRef,
      {
        userguide_id_opt_out: arrayRemove(userguideId)
      }
    );

    return;
  }

  await updateDoc
  (
    userRef,
    {
      userguide_id_opt_out: arrayUnion(userguideId)
    }
  );

  return;
}

/**
 * @description
 * TODO: DOC:
 */
export async function userDataFetch
(
  uid: string
): Promise < void >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ userDataFetch',
    true
  );

  const docRef: DocumentReference  = doc
  (
    db_firestore,
    'betarena_users',
    uid
  )

    ,docSnap: DocumentSnapshot  = await getDoc
    (
      docRef
    );

  if (!docSnap.exists()) return;

  const userData: BetarenaUser = docSnap.data();

  userBetarenaSettings.updateUserData
  (
    userData
  );
}

// #endregion 🔥 USER

// #region 🔥 PLAYER_IDS

/**
 * @summary
 * [MAIN]
 * @description
 * ➨ one-off request "X" target path (real-db) data;
 * ➨ kickstarts liveMap (player-ids) generation;
 * @returns
 * {Promise < void >}
*/
export async function onceTargetPlayerIds
(
  path: string
): Promise < void >
{
  const firebaseData = await getTargetRealDbData
  (
    path
  ) as FIRE_LNPI;

  sessionStore.updateLivescorePlayerId
  (
    firebaseData.id
  );
}

/**
 * @summary
 * [MAIN]
 * @description
 * ➨ common method that will listen to real-time changes in "livescores_now_scoreboard" Firebase (REAL-DB);
 * @returns
 * {Unsubscribe} Unsubscribe
 */
export function targetPlayerIdsListen
(
  path: string
): Unsubscribe
{
  const dbRef: DatabaseReference = ref
  (
    db_real,
    path
  )

    ,listenEventRef: Unsubscribe = onValue
    (
      dbRef,
      (
        snapshot: DataSnapshot
      ): void =>
      {
        const firebaseData: FIRE_LNPI = snapshot.val();
        sessionStore.updateLivescorePlayerId
        (
          firebaseData.id
        );
      }
    );

  sessionStore.updateFirebaseListener([listenEventRef]);

  return listenEventRef
}

// #endregion 🔥 PLAYER_IDS

// #region 🔥 ODDS

/**
 * @summary
 * [HELPER]
 * @param
 * {number} fixtureId
 * @param
 * {string} fixtureTime
 * @returns
 * a target directory/url to listen to "odds" data to a target fixture;
 */
export function createFixtureOddsPath
(
  fixtureId: number,
  fixtureTime: string
): string
{
  const year_: string = new Date(fixtureTime).getFullYear().toString()
    ,month_: number = new Date(fixtureTime).getMonth();
  let new_month_ = (month_ + 1).toString();
  new_month_ = `0${new_month_}`.slice(-2);
  let day = new Date(fixtureTime).getDate().toString();
  day = `0${day}`.slice(-2);
  return `odds/${year_}/${new_month_}/${day}/${fixtureId}`;
}

/**
 * @summary
 * [MAIN]
 * @description
 * ➨ common method that will listen to real-time changes in "livescores_now_scoreboard" Firebase (REAL-DB);
 * @returns
 * {Unsubscribe} Unsubscribe
 */
export function targetLivescoreNowFixtureOddsListen
(
  path: string
): Unsubscribe
{
  const dbRef: DatabaseReference = ref
  (
    db_real,
    path
  )

    ,listenEventRef: Unsubscribe = onValue
    (
      dbRef,
      (
        snapshot: DataSnapshot
      ): void =>
      {
        const sportbookArray: FIREBASE_odds[] = []

          ,data: [string, FIREBASE_odds][]
        = snapshot.exists()
          ? Object.entries(snapshot.val())
          : []
      ;

        for (const sportbook of data)
        {
          sportbook[1].sportbook = sportbook[0].toString();
          sportbookArray.push(sportbook[1]);
        }

        sessionStore.updateLiveOdds
        (
          sportbookArray
        );
      }
    );

  sessionStore.updateFirebaseListener([listenEventRef]);

  return listenEventRef
}

/**
 * @summary
 * [MAIN]
 * @description
 * ➨ common method that will listen to real-time changes in "livescores_now_scoreboard" Firebase (REAL-DB);
 * @returns
 * {Unsubscribe} Unsubscribe
 */
export function targetLivescoreNowFixtureOddsListenMulti
(
  paths: string[]
): Unsubscribe[]
{
  const listenEventRefsList: Unsubscribe[] = [];

  for (const path of paths)
  {
    const dbRef: DatabaseReference = ref
    (
      db_real,
      path
    )

      ,listenEventRef: Unsubscribe = onValue
      (
        dbRef,
        (
          snapshot: DataSnapshot
        ): void =>
        {
          const data: [string, FIREBASE_odds][]
          = snapshot.exists()
            ? Object.entries(snapshot.val())
            : []

            ,sportbookArray: FIREBASE_odds[] = []

          for (const sportbook of data)
          {
            sportbook[1].sportbook = sportbook[0].toString();
            sportbookArray.push(sportbook[1]);
          }

          sessionStore.updateLiveOddsMap
          (
            parseInt(snapshot.key),
            sportbookArray
          );
        }
      );

    listenEventRefsList.push
    (
      listenEventRef
    );
  }

  sessionStore.updateFirebaseListener(listenEventRefsList);

  return listenEventRefsList
}

/**
 * @summary
 * [MAIN]
 * @description
 * ➨ one-off request "odds" (db) data;
 * ➨ kickstarts liveOddsMap generation;
 * @returns
 * {Promise < void >}
*/
export async function oneOffOddsDataGet
(
  paths: string[]
): Promise < void >
{
  for (const path of paths)
  {
    const firebaseData = await getTargetRealDbData
      (
        path
      )

      ,data: [string, FIREBASE_odds][]
      = firebaseData != null
        ? Object.entries(firebaseData)
        : []

      ,sportbookArray: FIREBASE_odds[] = []

      ,fixtureId = path.split
      (
        '/'
      )
        [path.split('/').length - 1];

    for (const sportbook of data)
    {
      sportbook[1].sportbook = sportbook[0].toString();
      sportbookArray.push(sportbook[1]);
    }

    sessionStore.updateLiveOddsMap
    (
      parseInt(fixtureId),
      sportbookArray
    );
  }

  return;
}

// #endregion 🔥 ODDS

// #region 🔥 LIVESCORES_NOW

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
  const dataRef: DatabaseReference = ref
  (
    db_real,
    'livescores_now/'
  )

    ,listenEventRef: Unsubscribe = onValue
    (
      dataRef,
      (
        snapshot: DataSnapshot
      ): void =>
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

  sessionStore.updateFirebaseListener([listenEventRef]);

  return listenEventRef
}

/**
 * @summary
 * [MAIN]
 * @description
 * ➨ common method that will listen to real-time changes in "livescores_now_scoreboard" Firebase (REAL-DB);
 * @returns
 * {Unsubscribe} Unsubscribe
 */
export function targetLivescoreNowFixtureListen
(
  path: string
): Unsubscribe
{
  const dbRef: DatabaseReference = ref
  (
    db_real,
    path
  )

    ,listenEventRef: Unsubscribe = onValue
    (
      dbRef,
      (
        snapshot: DataSnapshot
      ): void =>
      {
        const firebaseData: FIREBASE_livescores_now = snapshot.val();
        sessionStore.updateLivescoresTarget
        (
          firebaseData
        );
      }
    );

  sessionStore.updateFirebaseListener([listenEventRef]);

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
      'livescores_now'
    )

    ,data: [string, FIREBASE_livescores_now][]
    = firebaseData != null
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
  const liveFixturesMap = new Map<number, FIREBASE_livescores_now>();

  for await (const live_fixture of data)
  {
    const fixture_id = parseInt
      (
        live_fixture[0].toString()
      )

      ,fixture_data = live_fixture[1];

    liveFixturesMap.set
    (
      fixture_id,
      fixture_data
    );
  }

  sessionStore.updateLivescores
  (
    liveFixturesMap
  );
}

// #endregion 🔥 LIVESCORES_NOW

// #region 🔥 LIVESCORES_NOW_SCOREBOARD

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
  const dbRef: DatabaseReference = ref
  (
    db_real,
    'livescores_now_scoreboard'
  )

    ,listenEventRef: Unsubscribe = onValue
    (
      dbRef,
      (
        snapshot:DataSnapshot
      ): void =>
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

  sessionStore.updateFirebaseListener([listenEventRef]);

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
  const firebaseData = await getTargetRealDbData
    (
      'livescores_now_scoreboard'
    )

    ,data: [string, FIRE_LNNS][]
    = firebaseData != null
      ? Object.entries(firebaseData)
      : []
  ;
  generateLiveScoreboardList(data);
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
  const liveFixturesMap = new Map<number, FIRE_LNNS>();

  for (const liveFixture of data)
  {
    const fixtureId = parseInt
      (
        liveFixture[0].toString()
      )

      ,fixtureData = liveFixture[1];

    liveFixturesMap.set
    (
      fixtureId,
      fixtureData
    );
  }

  sessionStore.updateLivescoreScoreboard
  (
    liveFixturesMap
  )
}

// #endregion 🔥 LIVESCORES_NOW_SCOREBOARD

// #endregion ➤ 🛠️ METHODS
