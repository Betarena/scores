// #region ➤ 📦 Package Imports

import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlog, dlogv2 } from '$lib/utils/debug.js';
import { checkNull } from '$lib/utils/miscellenous.js';
import { type Unsubscribe } from 'firebase/database';
import { ref as storageRef, getDownloadURL, uploadString } from "firebase/storage"
import { arrayRemove, arrayUnion, doc, DocumentReference, getDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { db_firestore, storage } from './init';

import type { Page } from '@sveltejs/kit';
import type { IBetarenaUserPublic } from '@betarena/scores-lib/types/firebase/firestore.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

export const BetarenaUserHelper = new Betarena_User_Class();

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

// #region 🔥 USER

/**
 * @author
 *  @izobov
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Retrieves `Firebase/Firestore` data for **current user**.
 * @param { string [] } uid
 *  💠 **[required]** Target user **uid**.
 * @return { Promise < void > }
 */
export async function getUserById
  (
    uid: string[]
  )
{
  // [🐞]
  dlog
    (
      '🚏 checkpoint ➤ getUserById(..)',
      true
    );

  const { success } = await BetarenaUserHelper.obtainPublicInformationTargetUsers({
    query: {},
    body: {
      user_uids: uid
    }
  });
  if (!success) return [];
  return success.data
}
/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Retrieves `Firebase/Firestore` data for **current user** and saves.
 * @CUSTOM_WARNING
 *  ❗️❗️ Contains `store` update.
 * @param { string } uid
 *  💠 **[required]** Target user **uid**.
 * @return { Promise < void > }
 */
export async function userDataFetch
  (
    uid: string
): Promise<void>
{
  // [🐞]
  dlog
    (
      '🚏 checkpoint ➤ userDataFetch(..)',
      true
    );

  const
    docRef
      = doc
        (
          db_firestore,
          'betarena_users',
          uid
        ),
    docSnap
      = await getDoc
        (
          docRef
        )
    ;

  if (!docSnap.exists()) return;

  userBetarenaSettings.updateData
    (
      [
        ['user-scores-data', docSnap.data()]
      ]
    );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - 🟥 IMPORTANT
 * @description
 *  📣 Kickstart target user `(uid)` data `(balance)` listen.
 * @CUSTOM_WARNING
 *  ❗️❗️ Contains `store` update.
 * @see https://firebase.google.com/docs/firestore/query-data/listen#web-modular-api_3
 * @param { string } uid
 *  💠 **[required]** Target user UID.
 * @returns { void }
 */
export function userBalanceListen
  (
    uid: string
  ): void
{
  const
    _unsubscribe
      = onSnapshot
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
            const
              data = doc.data()
              ;

            if (data == undefined) return;

            userBetarenaSettings.updateData
              (
                [
                  ['user-main-balance', data.main_balance],
                  ['user-investor-balance', data.investor_balance],
                ]
              );

            return;
          }
        )
    ;

  sessionStore.updateData
    (
      [
        ['firebaseListeners', [_unsubscribe]]
      ]
    );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update `user` platform language preference.
 * @param { string } lang
 *  💠 **[required]** Language to `set`
 * @returns { Promise < void > }
 */
export async function updateSelectLang
(
): Promise<void>
{
  const
    // ╭─────
    // │ NOTE: |:| 📝 Destruct Data (localStorage)
    // ╰─────
    {
      user:
      {
        firebase_user_data:
        {
          uid
        } = {},
        scores_user_data:
        {
          lang
        } = {}
      } = {}
    } = userBetarenaSettings.extractAll(),
    /**
     * @description
     * 📝 Data for `page`
     */
    page = sessionStore.extract<Page>('page'),
    /**
     * @description
     * 📝 Conditional logic bundle simplification
     */
    if_M_0
      = !checkNull(page?.error)
      || checkNull(page?.route.id)
      || !lang
      || !uid
    ;

  if (if_M_0 || !page) return;

  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ updateSelectLang(..)',
      [
        `🔹 [var] ➤ opts.isPageError :|: ${page.error}`,
        `🔹 [var] ➤ opts.routeId :|: ${page.route.id}`,
        `🔹 [var] ➤ lang :|: ${lang}`,
        `🔹 [var] ➤ uid :|: ${uid}`,
      ],
      true
    );

  const
    userRef = doc
      (
        db_firestore,
        'betarena_users',
        uid,
      )
    ;

  await updateDoc
    (
      userRef,
      {
        lang
      }
    );

  return;
}

/**
 * @description
 * TODO: DOC:
 */
export async function userUpdateBalance
  (
    uid: string,
    balanceChng: number
): Promise<void>
{
  const userRef: DocumentReference = doc
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
): Promise<void>
{
  const
    userRef: DocumentReference = doc
      (
        db_firestore
        , 'betarena_users'
        , opts.uid
      )
    ;

  if (opts.type == 'total')

    await updateDoc
      (
        userRef
        , {
          'investor_balance.grand_total': increment(opts.deltaBalance)
        }
      );

  else

    await updateDoc
      (
        userRef
        , {
          'investor_balance.grand_total': increment(opts.deltaBalance),
          'investor_balance.tge_to_claim': increment(opts.deltaBalance)
        }
      );


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
): Promise<void>
{
  const userRef: DocumentReference = doc
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

// #endregion 🔥 USER



/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update field by key.
 * @param { "subscriptions" | "following" } field
 *  💠 **[required]** field in user firebase to update
 * @param { string } key
 *  💠 **[required]** id for target
 * @param {[key: string]: any} obj
 *  💠 **[required]** source obj
 * @param {boolean} add
 *  💠 **[required]** action type
 * @param {boolean} id
 *  💠 **[required]** id to add or remove
 * @returns { Promise < void > }
 */

export function updateDataByKey({ field = "", key = "", obj, add = true, id })
{
  const current_field = obj[field] || {};
  let current_target: string[] = current_field[key] || [];
  if (add && !current_target.includes(id))
  {
    current_target.push(id);
    // [TODO] hasura push id to tag.followers
  }
  if (!add)
  {
    current_target = current_target.filter(i => i !== id);
    // [TODO] hasura remove id from tag.followers
  }
  return current_target
}
/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update `user`susbscriptions and followings.
 * @param { string } target_id
 *  💠 **[required]** id for target
 * @param { "subscriptions" | "following" } field
 *  💠 **[required]** field in user firebase to update
 * @param {"tags" | "authors"} obj
 *  💠 **[required]** target for updates
 * @param {boolean} follow
 *  💠 **[required]** action type
 * @returns { Promise < void > }
 */
export async function updateFollowing
  (
    target_id: string,
    field: "subscriptions" | "following",
    target: "tags" | "authors",
    follow: boolean,
  ): Promise<void>
{
  const
    /**
     * @description
     * 📝 Data point
     */
    uid = userBetarenaSettings.extract('uid') as string | undefined | null,
    user = userBetarenaSettings.extract('user'),
    /**
     * @description
     * 📝 Data for `page`
     */
    page = sessionStore.extract<Page>('page') as Page,
    /**
     * @description
     * 📝 Conditional logic bundle simplification
     */
    if_M_0
      = !checkNull(page.error)
      || checkNull(page.route.id)
      || !target_id
      || !target
      || !uid
      || !user
    ;

  if (if_M_0) return;

  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ updateFollowing(..)',
      [
        `🔹 [var] ➤ opts.isPageError :|: ${page.error}`,
        `🔹 [var] ➤ opts.routeId :|: ${page.route.id}`,
        `🔹 [var] ➤ target_id :|: ${target_id}`,
        `🔹 [var] ➤ target :|: ${target}`,
        `🔹 [var] ➤ follow :|: ${follow}`,
        `🔹 [var] ➤ uid :|: ${uid}`,
      ],
      true
    );

  const current_field = user[field] || {};
  const current_target: string[] = updateDataByKey({ obj: user, field, key: target, add: follow, id: target_id });
  if (target === "authors")
  {
    await BetarenaUserHelper.updateUsersFollowers({
      query: {},
      body: {

        uidToUpdate: target_id,
        uidNewFollower: uid,
        type: field === "subscriptions" ? "subscriber" : "follower",
        action: follow ? "add" : "remove"
      }
    })
    return
  }
  current_field[target] = current_target;
  const data = {};
  data[field] = current_field;
  const userRef = doc
    (
      db_firestore,
      'betarena_users',
      uid,
    )
    ;

  await updateDoc
    (
      userRef,
      data
  );
  return;
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update `user` platform subscriptions.
 * @param { {[key:string]: (string | number)[]} } subscriptions
 *  💠 **[required]** Following object
 * @returns { Promise < void > }
 */
export async function updateSubscriptions
  (
    subscriptions: { [key: string]: (string | number)[] }
  ): Promise<void>
{
  const
    /**
     * @description
    * 📝 Data point
    */
    uid = userBetarenaSettings.extract('uid') as string | undefined | null,
    /**
     * @description
     * 📝 Data for `page`
     */
    page = sessionStore.extract<Page>('page') as Page,
    /**
     * @description
     * 📝 Conditional logic bundle simplification
     */
    if_M_0
      = !checkNull(page.error)
      || checkNull(page.route.id)
      || !subscriptions
      || !uid
    ;

  if (if_M_0) return;

  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ updateSubscriptions(..)',
      [
        `🔹 [var] ➤ opts.isPageError :|: ${page.error}`,
        `🔹 [var] ➤ opts.routeId :|: ${page.route.id}`,
        `🔹 [var] ➤ following :|: ${subscriptions}`,
        `🔹 [var] ➤ uid :|: ${uid}`,
      ],
      true
    );

  const
    userRef = doc
      (
        db_firestore,
        'betarena_users',
        uid,
      )
    ;

  await updateDoc
    (
      userRef,
      {
        subscriptions
      }
    );

  return;
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update `user` platform buttons order in mobile view.
 * @param { string[] } order
 *  💠 **[required]** Following object
 * @returns { Promise < void > }
 */
export async function updateButtonOrder
  (
    order: string[]
): Promise<void>
{
  const
    /**
     * @description
     * 📝 Data point
     */
    uid = userBetarenaSettings.extract('uid') as string | undefined | null,
    /**
     * @description
     * 📝 Conditional logic bundle simplification
     */
    if_M_0
      = !order
      || !uid
    ;

  if (if_M_0) return;

  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ updateButtonOrder(..)',
      [
        `🔹 [var] ➤ buttuns order :|: ${order}`,
        `🔹 [var] ➤ uid :|: ${uid}`,
      ],
      true
    );

  const
    userRef = doc
      (
        db_firestore,
        'betarena_users',
        uid,
      )
    ;

  await updateDoc
    (
      userRef,
      {
        buttons_order: order
      }
    );
  return;
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update `user` highlighted sportstack
 * @param { string } id
 *  💠 **[required]** Following object
 * @returns { Promise < void > }
 */
export async function updateHighlightedSpotstack
  (
    id: string
  ): Promise<void>
{
  const
    /**
     * @description
     * 📝 Data point
     */
    uid = userBetarenaSettings.extract('uid') as string | undefined | null,
    /**
     * @description
     * 📝 Conditional logic bundle simplification
     */
    if_M_0
      = !id
      || !uid
    ;

  if (if_M_0) return;

  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ updateButtonOrder(..)',
      [
        `🔹 [var] ➤ sportstack id :|: ${id}`,
        `🔹 [var] ➤ uid :|: ${uid}`,
      ],
      true
    );

  const
    userRef = doc
      (
        db_firestore,
        'betarena_users',
        uid,
      )
    ;

  await updateDoc
    (
      userRef,
      {
        highlights: {
          sportstack: id
        }
      }
    );
  return;
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Uplaod images to firebase
 * @param { string } img
 *  💠 **[required]** file to upload
 * @param { string } targetPath
 *  💠 **[required]** target path to upload imange
 * @returns { Promise < string > }
 *  return url of uploaded image
 */
export async function uploadImage
  (
    img: string,
    targetPath: string
  ): Promise<string>
{
  const sRef = storageRef
    (
      storage,
      targetPath
    );
  await uploadString
    (
      sRef,
      img,
      'data_url'
    )

  // [🐞]
  dlog
    (
      '🟢 Uploaded file!'
    );

  // const url = await snapshot.ref.fullPath;
  const url = await getDownloadURL(sRef);

  // [🐞]
  dlog
    (
      url,
      true
    );

  return url;
}

/**
 * Listens for real-time updates to a specific user's document in the "betarena_users_public" collection in Firestore.
 * This function is designed to facilitate real-time responsiveness in applications by providing immediate updates
 * whenever the specified user's document changes.
 *
 * @param {string} uid - The unique identifier for the user whose document updates you want to listen to.
 * @param {(data: BetarenaUser) => void} cb - A callback function that is called with the updated data
 * whenever the user's document changes. The data is passed as a parameter to this callback.
 *
 * @returns {Unsubscribe} A function that can be called to unsubscribe from the document updates,
 * effectively stopping further invocation of the callback function when the document changes.
 *
 * @example
 * const unsubscribe = listenRealTimeUserUpdates("user123", (data) => {
 *   console.log("Updated user data:", data);
 * });
 * // To stop listening for updates:
 * unsubscribe();
 */
export function listenRealTimeUserUpdates
  (
    uid: string,
    cb: (data: IBetarenaUserPublic) => void
  ): Unsubscribe
{
  const docRef = doc(db_firestore, "betarena_users_public", uid);
  const unsubscribe = onSnapshot(docRef, (doc) =>
  {
    if (doc.exists())
    {
      const data = doc.data() as IBetarenaUserPublic;
      cb(data);
    }
  });

  return unsubscribe;
}

// #endregion ➤ 🛠️ METHODS
