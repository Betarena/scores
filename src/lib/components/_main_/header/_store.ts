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
  storeObject: INavbarWidget
    = {
      globalState: new Set()
    }
;

type IDataProp =
  | 'globalStateAdd'
  | 'globalStateRemove'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

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
        {
          // ╭─────
          // │ NOTE:
          // │ > Dropdown Logic Toggle Extra
          // ╰─────
          if
          (
            dataPoint as INavbarState == 'UserDropdownActive'
            || dataPoint as INavbarState == 'CurrencyDropdownActive'
            || dataPoint as INavbarState == 'LangDropdownActive'
            || dataPoint as INavbarState == 'MobileNavToggleMenuActive'
            || dataPoint as INavbarState == 'OddsDropdownActive'
          )
            storeObject.globalState.add('BackdropActive');
          ;

          storeObject.globalState.add(dataPoint);
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
       *  🔹 HELPER
       * @description
       *  📣 Closes all dropdowns and updates `state`.
       * @return { void }
       */
      closeAllDropdowns:
      (
      ): void =>
      {
        storeObject.globalState.delete('CurrencyDropdownActive');
        storeObject.globalState.delete('UserDropdownActive');
        storeObject.globalState.delete('LangDropdownActive');
        storeObject.globalState.delete('MobileNavToggleMenuActive');
        storeObject.globalState.delete('BackdropActive');

        set(storeObject);

        return;
      },

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

export const scoresNavbarStore = createLocalStore();
