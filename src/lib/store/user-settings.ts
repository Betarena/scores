// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Client 'Svelte/Store' with 'LocalStorage' Persistance                          │
// │ > Used for both Non-Authenticated and Authenticated platform users.              │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { writable } from 'svelte/store';

import sessionStore from '$lib/store/session.js';
import { initUser, logoutUser, updateSelectLang } from '$lib/utils/user.js';
import { setCookie } from './cookie.js';

import type { BetarenaUser, IUserSetting, Voted_Fixture } from '$lib/types/types.user-settings.js';
import type { InvestorData } from '@betarena/scores-lib/types/_FIREBASE_.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   *  📣 Target `data` store.
   */
  userSettings: IUserSetting
    = {
      lang: 'en',
      theme: 'Dark',
      country_bookmaker: undefined,
      geoJs: undefined,
      user: undefined,
      voted_fixtures: [],
      userguide_id_opt_out: []
    }
;

type IDataProp =
  | 'lang'
  | 'lang-user'
  | 'geo-bookmaker'
  | 'theme'
  | 'geoJs'
  | 'user-avatar'
  | 'user-name'
  | 'user-wallet'
  | 'user-object'
  | 'user-scores-data'
  | 'user-main-balance'
  | 'user-investor-balance'
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  - 📣 Initializer of `svelte/stores` method.
 *  - 📣 Uses `localStorage` persistance.
 * @param { string } key
 *  💠 Target `key` to use for `svelte-stores` / `localStorage`.
 * @return
 *  📤 Store logic.
 */
function createLocalStore
(
  key: string
)
{
  const
    /**
     * @description
     *  📣 Default 'svelte/store' exports.
     */
    {
      subscribe,
      set,
      update
    } = writable
    (
      userSettings
    ),
    /**
     * @description
     *  📣 complementary `store` added methods.
     */
    methods
      = {
        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 Local Helper Logic                                                            │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🟥 MAIN
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *   📣 Instantiate `localStorage` data for target `key`.
         * @return { void }
         */
        useLocalStorage:
        (
        ): void =>
        {
          let
            localStore = methods.parseLocalStorage()
          ;

          // [🐞]
          // console.log('localStore', localStore);

          // ╭─────
          // │ CHECK :|: for absent localstorage object.
          // ╰─────
          if (localStore == null)
            localStore
            = {
                lang: 'en',
                theme: 'Dark',
                country_bookmaker: undefined,
                geoJs: undefined,
                user: undefined,
                voted_fixtures: [],
                userguide_id_opt_out: [],
              }
            ;
          ;

          // ╭─────
          // │ NOTE:
          // │ ➤ force legacy users to have _this_ object data property.
          // │ ➤ necessary for new logic to work better.
          // ╰─────
          if (localStore.userguide_id_opt_out == undefined)
            localStore.userguide_id_opt_out = [];
          ;

          // ╭─────
          // │ CHECK :|: for authenticated user.
          // ╰─────
          if (localStore.user)
            initUser();
          else
            logoutUser();
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
         *   📣 Retrieves target `localStorage` for target `key`.
         * @param { IUserSetting } data
         *  💠 **[required]** Target `user` data to be persisted.
         * @return { IUserSetting }
         *  📤 Target `user` data object.
         */
        parseLocalStorage:
        (
        ): IUserSetting | NullUndef =>
        {
          const
            localStore = localStorage.getItem(key)
          ;

          if (!localStore) return null;

          return JSON.parse
          (
            localStore
          );
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🟥 MAIN
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *   📣 Persists to `localStorage` target data for target `key`.
         * @param { IUserSetting } data
         *  💠 **[required]** Target `user` data to be persisted.
         * @return { void }
         */
        setLocalStorage:
        (
          data: IUserSetting
        ): void =>
        {
          localStorage.setItem
          (
            key,
            JSON.stringify
            (
              data
            )
          );

          set
          (
            data
          );

          return;
        },

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 📣 Main Logic                                                                    │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        /**
         * @author
         *  @migbash
         * @summary
         *  🔹 HELPER
         * @description
         *  📣 Updates `userguides-op-out` preference.
         * @param { number } id
         *  💠 **[required]** Target **uiserguide** `id`.
         * @returns { void }
         */
        updateToggleUserGuideOpt:
        (
          id: number
        ): void =>
        {
          const
            localStore = methods.parseLocalStorage()
          ;

          if (!localStore) return;

          if (localStore.userguide_id_opt_out.includes(id))
            localStore.userguide_id_opt_out
              = localStore.userguide_id_opt_out
                .filter
                (
                  x => {return x != id}
                )
            ;
          else
            localStore.userguide_id_opt_out.push(id);
          ;

          localStore.userguide_id_opt_out = [...new Set(localStore.userguide_id_opt_out)] ?? [];
          methods.setLocalStorage
          (
            localStore
          );
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Update `user` with target vote casting.
         * @param { Voted_Fixture } vote
         *  💠 **[required]** **Latest** `user` vote data.
         * @return { void }
         */
        addToVotes:
        (
          vote: Voted_Fixture
        ): void =>
        {
          const
            localStore = methods.parseLocalStorage()
          ;

          if (!localStore) return;

          if (localStore.voted_fixtures == undefined)
            localStore.voted_fixtures = [];
          ;

          localStore.voted_fixtures.push
          (
            vote
          );

          // ╭─────
          // │ NOTE:
          // │ > Approach Num.2
          // ╰─────
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
          const
            localStore = methods.parseLocalStorage()
          ;

          if (!localStore) return;

          if (dataTarget == 'lang')
          {
            localStore.lang = dataPoint;

            if (localStore.user)
              updateSelectLang();
            ;
          }
          else if (dataTarget == 'geo-bookmaker')
          {
            localStore.country_bookmaker = dataPoint;
          }
          else if (dataTarget == 'theme')
          {
            localStore.theme
              = localStore.theme == 'Dark'
                ? 'Light'
                : 'Dark'
            ;
          }
          else if (dataTarget == 'geoJs')
          {
            localStore.geoJs = dataPoint;
          }
          else if (dataTarget == 'user-object')
          {
            localStore.user = dataPoint;

            if (dataPoint == undefined)
              sessionStore.updateData
              (
                'globalStateAdd',
                'NotAuthenticated'
              );
            ;
          }
          else if (dataTarget == 'user-scores-data')
          {
            localStore.user.scores_user_data = dataPoint as BetarenaUser;

            // ╭─────
            // │ CHECK :|: for 'null' value for 'main_balance'.
            // ╰─────
            if
            (
              localStore.user.scores_user_data.main_balance == undefined
              || isNaN(localStore.user.scores_user_data.main_balance)
            )
              localStore.user.scores_user_data.main_balance = 0;
            ;

            // ╭─────
            // │ CHECK :|: for 'null' / non-empty value of `userguide_opt_out`.
            // ╰─────
            if (localStore.user.scores_user_data.userguide_id_opt_out != null)
              localStore.userguide_id_opt_out = localStore.user.scores_user_data.userguide_id_opt_out;
            ;
          }

          if (localStore.user?.scores_user_data && dataTarget == 'lang-user')
          {
            localStore.user.scores_user_data.lang = dataPoint;
          }
          else if (localStore.user?.scores_user_data && dataTarget == 'user-avatar')
          {
            localStore.user.scores_user_data.profile_photo = dataPoint;
          }
          else if (localStore.user?.scores_user_data && dataTarget == 'user-name')
          {
            localStore.user.scores_user_data.username = dataPoint;
          }
          else if (localStore.user?.scores_user_data && dataTarget == 'user-wallet')
          {
            localStore.user.scores_user_data.web3_wallet_addr = dataPoint;
          }
          else if (localStore.user?.scores_user_data && dataTarget == 'user-main-balance')
          {
            // ╭─────
            // │ CHECK
            // │ > for invalid balance type.
            // ╰─────
            if (dataPoint == undefined || isNaN(dataPoint as number)) dataPoint = 0;

            localStore.user.scores_user_data.main_balance = dataPoint as number;
          }
          else if (localStore.user?.scores_user_data && dataTarget == 'user-investor-balance')
          {
            localStore.user.scores_user_data!.investor_balance = dataPoint as InvestorData;
          }
          ;

          methods.setLocalStorage
          (
            localStore
          );

          setCookie
          (
            'betarenaScoresCookie',
            JSON.stringify(methods.extractUserDataSnapshot()),
            30
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
         *  📣 Extracts **target** `user` data property.
         * @param { 'geo-bookmaker' | 'lang' | 'lang-user' | 'uid' } dataPoint
         *  💠 **[required]** Target `data point` to be retrieved.
         * @return { any }
         *  📤 Requested `data point`.
         */
        extract:
        (
          dataPoint: 'geo-bookmaker' | 'lang' | 'lang-user' | 'uid'
        ): any =>
        {
          const
            localStore = methods.parseLocalStorage()
          ;

          if (dataPoint == 'geo-bookmaker')
            return localStore?.country_bookmaker;
          else if (dataPoint == 'lang')
            return localStore?.lang;
          else if (dataPoint == 'lang-user')
            return localStore?.user?.scores_user_data?.lang;
          else if (dataPoint == 'uid')
            return localStore?.user?.firebase_user_data?.uid;
          ;

          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - IMPORTANT
         * @description
         *  📣 Extracts **target** data batch.
         * @return { object }
         *  📤 Main `data point(s)`.
         */
        extractUserDataSnapshot:
        (
        ): object =>
        {
          const
            localStore = methods.parseLocalStorage(),
            /**
             * @description
             *  📣 Target `user` data.
             */
            data
              = {
                lang: localStore?.lang,
                geo: localStore?.country_bookmaker,
                user: undefined
              }
          ;

          if (localStore?.user)
          {
            data['user-uid'] = localStore.user.firebase_user_data?.uid;
            data['lang-user'] = localStore.user.scores_user_data?.lang;
          }

          return data;
        }
      }
  ;

  return {
    subscribe,
    set,
    update,
    ...methods,
  };
}

// #endregion ➤ 🛠️ METHODS

export default createLocalStore('betarena-scores-platform-settings');
