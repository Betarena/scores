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

import { breakdownDates } from '$lib/utils/dates.js';
import { writable } from 'svelte/store';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  storeObject: IAuthWidget
    = {
      globalState: new Set(),
      globalStateErrors: new Set(),
      resendEmailCountdown: null,
    }
;

type IDataProp =
  | 'globalStateAdd'
  | 'globalStateRemove'
  | 'globalSateErrorAdd'
  | 'globalStateErrorRemove'
  | 'resendEmailCountdown'
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
         *  📣 Update **target** `list` data of target `properties` to update.
         * @param { [IDataProp, any][] } data
         *  💠 **[required]** Target data to update.
         * @return { void }
         */
        updateData:
        (
          data: [IDataProp, any][]
        ): void =>
        {
          for (const iterator of data)
          {
            const
              dataTarget = iterator[0],
              dataPoint = iterator[1]
            ;

            if (dataTarget == 'globalStateAdd')
            {
              if (dataPoint == 'ExistingEmailLoginSent')
              {
                methods.startEmailResendCountdown();
                storeObject.globalState.delete('AuthenticationStart');
              }
              else if (dataPoint == 'NewEmailRegisterationSent')
              {
                storeObject.globalState.delete('AuthenticationStart');
              }
              storeObject.globalState.add(dataPoint);
            }
            else if (dataTarget == 'globalStateRemove')
            {
              storeObject.globalState.delete(dataPoint);
            }
            else if (dataTarget == 'globalSateErrorAdd')
            {
              storeObject.globalStateErrors.add(dataPoint);
            }
            else if (dataTarget == 'globalStateErrorRemove')
            {
              storeObject.globalStateErrors.delete(dataPoint);
            }
            else if (dataTarget == 'resendEmailCountdown')
            {
              storeObject.resendEmailCountdown = dataPoint;
            }
          }

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
          const
            futureDate = new Date()
          ;

          // ╭─────
          // │ NOTE: :|: add 5 min.
          // ╰─────
          futureDate.setMinutes
          (
            futureDate.getMinutes() + 5
          );

          const
            interval = setInterval
            (
              (
              ) =>
              {
                const
                  dateObjDif = breakdownDates(futureDate.getTime() - new Date().getTime());
                ;

                // [🐞]
                // console.log('dateObjDif', dateObjDif);

                methods.updateData
                (
                  [
                    ['resendEmailCountdown', dateObjDif]
                  ]
                );

                if (dateObjDif[0] <= 0 && dateObjDif[1] <= 0)
                {
                  clearInterval(interval);
                  methods.updateData
                  (
                    [
                      ['globalStateAdd', 'AllowResendEmailLogin']
                    ]
                  );
                }

                return;
              },
              1000
            )
          ;

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
