// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 10-09-2024                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module)
// │ |: IMPORTANT CRITICAL Single Export and Imports All
// │ |: IMPORTANT CRITICAL Independent Global State (1) Listener And (2) Side-Effect Delegator
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { updateSelectLang } from '$lib/firebase/common.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { log_v3 } from '$lib/utils/debug.js';
import { parseObject } from '$lib/utils/string.2.js';
import { helperUserInitialize, logoutUser, herlperUserAnonymousInitialize } from '$lib/utils/user.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📝 Initiates subscribtions for `session` store.
 * @return { void }
 */
export function initiateSubscribtions
(
): (() => void)[]
{
  // [🐞]
  log_v3
  (
    {
      strGroupName: '🚏 checkpoint ➤ Subscription | [SIDE-EFFECT] ➤ initiateSubscribtions(..) // START'
    }
  );

  const
    /**
     * @description
     *  📝 Unsubscribe function.
     */
    unsubscribe: (() => void)[] = []
  ;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ STORES - MAIN (GLOBAL)                                                      │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  unsubscribe.push
  (
    userBetarenaSettings.subscribe
    (
      (
        store
      ) =>
      {
        // ╭─────
        // │ NOTE: IMPORTANT |:| No side-effects, no need to continue, otherwise cluttering the console.
        // ╰─────
        if (store._SIDE_EFFECTS_.size === 0) return;

        // [🐞]
        log_v3
        (
          {
            strGroupName: '🚏 checkpoint ➤ Subscription | [SIDE-EFFECT] ➤ localstorage.subscribe(..) // START',
            msgs: [
              `🔹 [var] ➤ store._SIDE_EFFECTS_.size :|: ${store._SIDE_EFFECTS_.size}}`,
              `🔹 [var] ➤ store._SIDE_EFFECTS_ :|: ${parseObject(store._SIDE_EFFECTS_)}`,
            ],
            closed: true
          }
        );

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🔳 │ GLOABL STATE // SIDE-EFFECTS                                                │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        if (store._SIDE_EFFECTS_.has('LangUpdate'))
          sessionStore.updateData
          (
            [
              ['lang', store.lang]
            ]
          );
        ;

        if (store._SIDE_EFFECTS_.has('IsAnonymousNew'))
          herlperUserAnonymousInitialize();
        ;

        if (store._SIDE_EFFECTS_.has('IsAnonymous'))
          logoutUser();
        ;

        if (store._SIDE_EFFECTS_.has('IsAuthenticated'))
          helperUserInitialize();
        ;

        if (store._SIDE_EFFECTS_.has('UserUpdateDataLanguage'))
          updateSelectLang();
        ;

        // ╭─────
        // │ IMPORTANT CRITICAL
        // ╰─────
        userBetarenaSettings.clearSideEffects();

        return;
      }
    )
  );

  return unsubscribe;
}
