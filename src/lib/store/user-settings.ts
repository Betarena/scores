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

import { dlog } from '$lib/utils/debug.js';
import { writable } from 'svelte/store';

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

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Initializer of `svelte/stores` method.
 *  ⚡️ Uses `localStorage` persistance.
 * @param { string } key
 *  💠 Target `key` to use for `svelte-stores` / `localStorage`.
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
            localStore: IUserSetting = methods.parseLocalStorage()
          ;

          // ╭─────
          // │ CHECK
          // │ > absent localstorage object.
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
          // │ > force users to have '_this_' object data property.
          // ╰─────
          if (localStore.userguide_id_opt_out == null)
            localStore.userguide_id_opt_out = [];
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
        ): IUserSetting =>
        {
          // [🐞]
          // console.log('localStorage.getItem(key)', localStorage.getItem(key));

          const
            localStore = localStorage.getItem(key)
          ;

          return JSON.parse
          (
            localStore ?? '{}'
          ) as IUserSetting
          ;
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
          const localStore: IUserSetting = methods.parseLocalStorage();

          if (localStore.userguide_id_opt_out.includes(id))

            localStore.userguide_id_opt_out = localStore.userguide_id_opt_out
              .filter
              (
                x => {return x != id}
              );

          else

            localStore.userguide_id_opt_out.push(id);

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
            localStore: IUserSetting = methods.parseLocalStorage()
          ;

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
         *  📣 Update `user` with _latest_ **main balance** `data`.
         * @param { number } newBalance
         *  💠 **[required]** **Latest** `user` balance information for _main_.
         * @return { void }
         */
        userUpdateBTABalance:
        (
          newBalance: number
        ): void =>
        {
          const
            localStore: IUserSetting = methods.parseLocalStorage()
          ;

          if (!localStore.user?.scores_user_data) return;

          // ╭─────
          // │ CHECK
          // │ > for invalid balance type.
          // ╰─────
          if (newBalance == undefined || isNaN(newBalance)) newBalance = 0;

          localStore.user.scores_user_data.main_balance = newBalance;

          // ╭─────
          // │ NOTE:
          // │ > Approach Num.1
          // ╰─────
          /*
            localStorage.setItem
            (
              key,
              JSON.stringify
              (
                localStore
              )
            );
            update
            (
              s =>
              (
                {
                  ...s,
                  user: localStore.user
                }
              )
            );
          */

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
         *  📣 Update `user` with _latest_ **investor balance** `data`.
         * @param { InvestorData } data
         *  💠 **[required]** **Latest** `user` balance information for _investor_.
         * @return { void }
         */
        userUpdateBTABalance2:
        (
          data: InvestorData
        ): void =>
        {
          const
            localStore: IUserSetting = methods.parseLocalStorage()
          ;

          if (!localStore.user) return;

          localStore.user.scores_user_data!.investor_balance = data;

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
         *  📣 Update `user` with _latest_ database data.
         * @param { BetarenaUser } data
         *  💠 **[required]** **Latest** snapshot of `user` data.
         * @return { void }
         */
        updateUserData:
        (
          data: BetarenaUser
        ): void =>
        {
          const
            localStore: IUserSetting = methods.parseLocalStorage()
          ;

          if (!localStore.user) return;

          // [🐞]
          dlog
          (
            '🚏 checkpoint ➤ updateUserData(..)',
            true
          );

          localStore.user.scores_user_data = data;

          // ╭─────
          // │ CHECK
          // │ > for 'null' value for 'main_balance'.
          // ╰─────
          if
          (
            localStore.user.scores_user_data.main_balance == undefined
            || isNaN(localStore.user.scores_user_data.main_balance)
          )
          {
            // [🐞]
            dlog
            (
              '🚏 checkpoint ➤ updateUserData if_M_0',
              true
            );
            localStore.user.scores_user_data.main_balance = 0
          }

          // ╭─────
          // │ CHECK
          // │ > for 'null' / non-empty value of `userguide_opt_out`.
          // ╰─────
          if (localStore.user.scores_user_data.userguide_id_opt_out != null)
            localStore.userguide_id_opt_out = localStore.user.scores_user_data.userguide_id_opt_out;
          ;

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
         * @param { 'lang' | 'lang-user' | 'geo-bookmaker' | 'theme' | 'geoJs' | 'user-avatar' | 'user-name' | 'user-wallet' | 'user-object' } dataTarget
         *  💠 **[required]** Target data to update.
         * @param { any } dataPoint
         *  💠 **[required]** Target data value to update.
         * @return { void }
         */
        updateData:
        (
          dataTarget: 'lang' | 'lang-user' | 'geo-bookmaker' | 'theme' | 'geoJs' | 'user-avatar' | 'user-name' | 'user-wallet' | 'user-object',
          dataPoint?: any,
        ): void =>
        {
          const
            localStore: IUserSetting = methods.parseLocalStorage()
          ;

          if (dataTarget == 'lang')
            localStore.lang = dataPoint;
          else if (dataTarget == 'geo-bookmaker')
            localStore.country_bookmaker = dataPoint;
          else if (dataTarget == 'theme')
            localStore.theme
              = localStore.theme == 'Dark'
                ? 'Light'
                : 'Dark'
            ;
          else if (dataTarget == 'geoJs')
            localStore.geoJs = dataPoint;
          else if (dataTarget == 'user-object')
            localStore.user = dataPoint;
          ;

          if (localStore.user?.scores_user_data && dataTarget == 'lang-user')
            localStore.user.scores_user_data.lang = dataPoint;
          else if (localStore.user?.scores_user_data && dataTarget == 'user-avatar')
            localStore.user.scores_user_data.profile_photo = dataPoint;
          else if (localStore.user?.scores_user_data && dataTarget == 'user-name')
            localStore.user.scores_user_data.username = dataPoint;
          else if (localStore.user?.scores_user_data && dataTarget == 'user-wallet')
            localStore.user.scores_user_data.web3_wallet_addr = dataPoint;
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
            localStore: IUserSetting = methods.parseLocalStorage()
          ;

          if (dataPoint == 'geo-bookmaker')
            return localStore.country_bookmaker;
          else if (dataPoint == 'lang')
            return localStore.lang;
          else if (dataPoint == 'lang-user')
            return localStore.user?.scores_user_data?.lang;
          else if (dataPoint == 'uid')
            return localStore.user?.firebase_user_data?.uid;
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
            localStore: IUserSetting = methods.parseLocalStorage(),
            /**
             * @description
             *  📣 Target `user` data.
             */
            data
              = {
                lang: localStore.lang,
                geo: localStore.country_bookmaker,
                user: undefined
              }
          ;

          if (localStore.user)
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
