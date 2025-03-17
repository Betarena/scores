// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-08-29                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena // Components // Presale-Box // Store
// │ |: Component Presale-Box Internal Store
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable max-len */

// #region ➤ 📦 Package Imports

import { writable } from 'svelte/store';

import { dlogv2 } from '$lib/utils/debug.js';

import type { IDataProp, IStoreFooter } from '$lib/types/store.footer.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Store object.
   */
  objectStore: IStoreFooter
    = {
      mapLinks: new Map(),
    }
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
        // │ 🛠️ Main Logic [DEFAULT/EXPECTED]                                                 │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        /**
         * @author
         *  @migbash
         * @summary
         *  - ALWAYS EXPECTED
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
          dlogv2
          (
            {
              strGroupName: '🚏 checkpoint ➤ Store | Footer ➤ updateData(..)',
              msgs: [
                `🔹 [var] ➤ data :|: ${data}`,
              ],
              closed: true
            }
          );

          // ╭─────
          // │ NOTE: |:| Loop through data and update target properties.
          // ╰─────
          for (const iterator of data)
          {
            const
              /**
               * @description
               * 📝 Target data (key) to be updated.
               */
              dataTarget = iterator[0],
              /**
               * @description
               * 📝 Data point to be updated.
               */
              dataPoint = iterator[1]
            ;

            if (dataTarget == 'mapLinks')
              objectStore.mapLinks = dataPoint;
            ;
          }

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
         *  - ALWAYS EXPECTED
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📝 Extracts all data.
         * @returns { IWidgetPresaleBox }
         *  📤 All data.
         */
        extractAll:
        (
        ): IStoreFooter =>
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

export const storeFooter = store();
