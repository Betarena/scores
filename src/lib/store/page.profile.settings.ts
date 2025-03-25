// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-09-27                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena // Store // Profile-Settings
// │ |: [PAGE] Profile-Settings Store
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable max-len */

// #region ➤ 📦 Package Imports

import { writable } from 'svelte/store';

import { log_v3 } from '$lib/utils/debug.js';

import type { IPageProfileSettings, ISideEffect } from '$lib/types/store.page.profile.settings.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Store object.
   */
  objectStore: IPageProfileSettings
    = {
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 💠 │ STATE                                                                       │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯
      globalState: new Set(),
      globalStateErrors: new Set(),
      globalStateErrorUsername: null,
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 📌 │ DEFAULT                                                                     │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯
      _SIDE_EFFECTS_: new Set()
    }
;

/**
 * @description
 * 📝 Available data properties.
 */
type IDataProp =
  // ╭─────
  // │ NOTE: |:| 📝 States Handle
  // ╰─────
  | 'globalStateAdd'
  | 'globalStateRemove'
  | 'globalSateErrorAdd'
  | 'globalStateErrorRemove'
  | 'globalStateErrorUsername'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📝 Svelte Store Method.
 * @return { any }
 *  📝 Store object.
 */
function store
(
)
{
  const
    // ╭─────
    // │ NOTE: |:| 📝 Default 'svelte/store' exports.
    // ╰─────
    {
      subscribe,
      set,
      update
    } = writable
    (
      objectStore
    ),
    /**
     * @description
     *  📝 Complementary 'store' added methods.
     */
    methods
      = {
        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🛠️ │ Main Logic [DEFAULT] CRITICAL                                               │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📝 Update **target** `list` data of target `properties` to update.
         * @param { [IDataProp, any][] } data
         *  💠 **REQUIRED** Target data to update.
         * @return { void }
         */
        updateData:
        (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: [IDataProp, any][]
        ): void =>
        {
          // [🐞]
          log_v3
          (
            {
              strGroupName: '🚏 checkpoint ➤ Store | Page.PublicPresale ➤ updateData(..)',
              msgs: [
                `🔹 [var] ➤ data :|: ${data}`,
              ],
              closed: true
            }
          );

          const
            /**
             * @description
             * 📝 Follow-up action.
             */
            setSideEffects = new Set< ISideEffect >()
          ;

          // ╭─────
          // │ NOTE: |:| Loop through data and update target properties.
          // ╰─────
          for (const iterator of data)
          {
            const
              /**
               * @description
               * 📝 Data target.
               */
              dataTarget = iterator[0],
              /**
               * @description
               * 📝 Data target.
               */
              dataPoint = iterator[1]
            ;

            if (dataTarget == 'globalStateAdd')
              objectStore.globalState.add(dataPoint);
            else if (dataTarget == 'globalStateRemove')
              objectStore.globalState.delete(dataPoint);
            else if (dataTarget == 'globalSateErrorAdd')
              objectStore.globalStateErrors.add(dataPoint);
            else if (dataTarget == 'globalStateErrorRemove')
              objectStore.globalStateErrors.delete(dataPoint);
            else if (dataTarget == 'globalStateErrorUsername')
              objectStore.globalStateErrorUsername = dataPoint;
            ;
          }

          // ╭─────
          // │ IMPORTANT CRITICAL
          // ╰─────
          if (setSideEffects.size > 0)
            objectStore._SIDE_EFFECTS_ = setSideEffects;
          ;

          set
          (
            objectStore
          );

          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📝 Clear all side-effects.
         * @return { void }
         */
        clearSideEffects:
        (
        ): void =>
        {
          objectStore._SIDE_EFFECTS_ = new Set();
          set
          (
            objectStore
          );
          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📝 Extracts all data.
         * @returns { IPageProfileSettings }
         *  📤 All data.
         */
        extractAll:
        (
        ): IPageProfileSettings =>
        {
          return objectStore;
        }
      }
  ;

  return {
    subscribe,
    set,
    update,
    ...methods
  };
}

// #endregion ➤ 🛠️ METHODS

export const storePageProfileSettings = store();
