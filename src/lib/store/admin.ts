// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Client 'Svelte/Store'                                                          │
// │ > Main Scores Platform Admin Session ('Ephermal') Store                          │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable max-len */

// #region ➤ 📦 Package Imports

import { passByValue } from '@betarena/scores-lib/dist/functions/func.common.js';
import { writable } from 'svelte/store';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  storeObject: IAdminControl
  = {
    admin: false,
    termsWithoutTranslation: new Set()
  }
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

function createLocalStore
(
)
{
  const
    {
      subscribe
      , set
      , update
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

      /**
       * @author
       *  @migbash
       * @summary
       *  - 🟥 MAIN
       *  - 🔹 HELPER
       * @description
       *  📣 Sets platform `localStorage` for target `key`.
       * @returns { void }
       */
      useLocalStorage:
      (
      ): void =>
      {
        let
          localStore: IAdminControl = methods.parseLocalStorage()
        ;

        if (localStore == null)
          localStore
          = {
              admin: false,
              termsWithoutTranslation: new Set()
            }
          ;
        ;

        methods.setLocalStorage
        (
          localStore
        );

        return;
      },

      /**
       * @author
       *  @migbash
       * @summary
       *  - 🟥 MAIN
       *  - 🔹 HELPER
       *  - IMPORTANT
       * @description
       *  📣 Retrieves target `localStorage` for target `key`.
       * @return { IAdminControl }
       *  📤 Admin store `object`.
       */
      parseLocalStorage:
      (
      ): IAdminControl =>
      {
        const
          localStore: IAdminControl = JSON.parse
          (
            localStorage.getItem
            (
              'scoresAdmin'
            ) ?? 'null'
          )
        ;

        if (localStore)
          // localStore.termsWithoutTranslation = new Set(...(localStore.termsWithoutTranslation ?? []));
          localStore.termsWithoutTranslation = new Set();
        //

        return localStore;
      },

      /**
       * @author
       *  @migbash
       * @summary
       *  - 🟥 MAIN
       *  - 🔹 HELPER
       *  - IMPORTANT
       * @description
       *  📣 Persists to `localStorage` target data for target `key`.
       * @return { void }
       */
      setLocalStorage:
      (
        data: IAdminControl
      ): void =>
      {
        const
          dataDeepCopy: IAdminControl = passByValue(data)
        ;

        dataDeepCopy.termsWithoutTranslation = [...data.termsWithoutTranslation] as unknown as Set < string >;

        localStorage.setItem
        (
          'scoresAdmin'
          , JSON.stringify
          (
            dataDeepCopy
          )
        );

        storeObject.admin = data.admin;
        storeObject.termsWithoutTranslation = data.termsWithoutTranslation;

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
       *  - 🟥 MAIN
       *  - 🔹 HELPER
       *  - IMPORTANT
       * @description
       *  📣 Persists to `localStorage` target data for target `key`.
       * @param { boolean } newState
       *  💠 **[required]** New `admin` state.
       * @return { void }
       */
      toggleAdminState:
      (
        newState: boolean
      ): void =>
      {
        const
          localStore: IAdminControl = methods.parseLocalStorage()
        ;

        localStore.admin = newState

        methods.setLocalStorage(localStore);

        return;
      },

      /**
       * @author
       *  @migbash
       * @summary
       *  - 🟥 MAIN
       *  - 🔹 HELPER
       *  - IMPORTANT
       * @description
       *  📣 Persists to `localStorage` target data for target `key`.
       * @param { string } text
       *  💠 **[required]** Target **non-translated** text.
       * @return { void }
       */
      updateNoTextTranslations:
      (
        text: string
      ): void =>
      {
        storeObject.termsWithoutTranslation.add(text);
        set(storeObject);
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

export const scoresAdminStore = createLocalStore();
