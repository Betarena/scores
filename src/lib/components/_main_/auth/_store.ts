// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Navbar Store                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable max-len */

// #region ➤ 📦 Package Imports

import { writable } from 'svelte/store';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  storeObject: IAuthWidget
    = {
      globalState: new Set(),
      globalStateErrors: new Set(),
      sentEmailDate: new Date(),
    }
;

type IDataProp =
  | 'globalStateAdd'
  | 'globalStateRemove'
  | 'globalSateErrorAdd'
  | 'globalStateErrorRemove'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @description
 *  📣
 * @return
 */
function createLocalStore
(
)
{
  const
    {
      subscribe,
      set,
      update
    } = writable
    (
      storeObject
    ),
    /**
     * @description
     *  📣 Complementary 'store' added methods.
     */
    methods
    = {

      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 📣 Main Logic                                                                    │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

      /**
       * @author
       *  @migbash
       * @summary
       *  - 🔹 HELPER
       *  - IMPORTANT
       * @description
       *  📣 Update **target** single data property.
       * @param { IDataProp } dataTarget
       *  💠 **[required]** Target data to update.
       * @param { any } dataPoint
       *  💠 **[required]** Target data value to update.
       * @return { void }
       */
      updateData:
      (
        dataTarget: IDataProp,
        dataPoint?: any,
      ): void =>
      {
        if (dataTarget == 'globalStateAdd')
          storeObject.globalState.add(dataPoint);
        else if (dataTarget == 'globalStateRemove')
          storeObject.globalState.delete(dataPoint);
        else if (dataTarget == 'globalSateErrorAdd')
          storeObject.globalStateErrors.add(dataPoint);
        else if (dataTarget == 'globalStateErrorRemove')
          storeObject.globalStateErrors.delete(dataPoint);
        ;

        set
        (
          storeObject
        );

        return;
      },

      /**
       * @author
       *  @migbash
       * @summary
       *  🟦 HELPER
       * @description
       *  📝 Kickstarts email verification `countdown`.
       * @return { void }
       */
      startEmailResendCountdown:
      (
      ): void =>
      {
        // interval1 = setInterval
        // (
        //   (
        //   ) =>
        //   {
        //     const
        //       dateObjDif = (sentEmailDate!).getTime() - Date.parse(new Date().toString())
        //     ;

        //     $: countD_sec = Math.floor((dateObjDif / 1000) % 60).toString();
        //     $: countD_min = Math.floor((dateObjDif / 1000 / 60) % 60).toString();

        //     if (countD_sec.includes('-'))
        //     {
        //       clearInterval(    interval1: NodeJS.Timer)
        //       allowResend = false;
        //     }
        //   },
        //   1000
        // );

        return;
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

export const scoresAuthStore = createLocalStore();
