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

import { updateButtonOrder, updateDataByKey, updateFollowing, updateHighlightedSpotstack, updateSelectLang } from '$lib/firebase/common.js';
import sessionStore from '$lib/store/session.js';
import { initSportbookData } from '$lib/utils/geo.js';
import { initUser, logoutUser } from '$lib/utils/user.js';
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

export type IDataProp =
  | 'lang'
  | 'lang-user'
  | 'geo-bookmaker'
  | 'theme'
  | 'geoJs'
  | 'user-avatar'
  | 'user-name'
  | 'user-name2'
  | 'user-about'
  | 'user-wallet'
  | 'user-object'
  | 'user-scores-data'
  | 'user-main-balance'
  | 'user-investor-balance'
  | 'user-following'
  | "user-buttons-order"
  | "user-subscriptions"
  | "user-highlighted-sportstack"
  ;

enum DataPropEnum
{
  LANG = 'lang',
  LANG_USER = 'lang-user',
  GEO_BOOKMAKER = 'geo-bookmaker',
  THEME = 'theme',
  GEO_JS = 'geoJs',
  USER_AVATAR = 'user-avatar',
  USER_NAME = 'user-name',
  USER_NAME2 = 'user-name2',
  USER_ABOUT = 'user-about',
  USER_WALLET = 'user-wallet',
  USER_OBJECT = 'user-object',
  USER_SCORES_DATA = 'user-scores-data',
  USER_MAIN_BALANCE = 'user-main-balance',
  USER_INVESTOR_BALANCE = 'user-investor-balance',
  USER_FOLLOWING = 'user-following',
  USER_SUBSCRIPTION = 'user-subscriptions',
  USER_BUTTONS_ORDER = 'user-buttons-order',
  USER_HIGHLIGHTED_SPORTSTACK = 'user-highlighted-sportstack',
}
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
          strLang: string = 'en'
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
                lang: strLang,
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
          // │ CHECK :|: for (non)-authenticated user logic.
          // ╰─────
          if (localStore.user)
          {
            initUser();
          }
          else
          {
            localStore.lang = strLang;
            logoutUser();
          }

          // ╭─────
          // │ CHECK :|: for (non)-authenticated user logic.
          // ╰─────
          if (localStore.country_bookmaker)
            initSportbookData
              (
                localStore.country_bookmaker
              );
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

          if (localStore.userguide_id_opt_out?.includes(id))
            localStore.userguide_id_opt_out
              = localStore.userguide_id_opt_out
                .filter
                (
                  x => { return x != id }
                )
              ;
          else
            localStore.userguide_id_opt_out?.push(id);
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
          const
            localStore = methods.parseLocalStorage()
            ;

          if (!localStore) return;

          for (const iterator of data)
          {
            const
              dataTarget = iterator[0]
              ;
            let
              dataPoint = iterator[1]
              ;

            switch (dataTarget as DataPropEnum)
            {
              case DataPropEnum.LANG:
                localStore.lang = dataPoint;

                if (localStore.user?.scores_user_data)
                  data.push(['lang-user', dataPoint]);
                break;
              case DataPropEnum.GEO_BOOKMAKER:
                localStore.country_bookmaker = dataPoint;
                initSportbookData(dataPoint);
                break;
              case DataPropEnum.THEME:
                localStore.theme = localStore.theme == 'Dark' ? 'Light' : 'Dark';
                document.body.classList.toggle('dark-mode');
                document.body.classList.toggle('light-mode');
                break;
              case DataPropEnum.GEO_JS:
                localStore.geoJs = dataPoint;
                break;
              case DataPropEnum.USER_OBJECT:
                localStore.user = dataPoint;

                if (dataPoint == undefined)
                  sessionStore.updateData([['globalStateAdd', 'NotAuthenticated']]);
                break;
              case DataPropEnum.USER_SCORES_DATA:
                (localStore.user ??= {});

                localStore.user.scores_user_data = dataPoint as BetarenaUser;

                // ╭─────
                // │ CHECK :|: for 'null' value for 'main_balance'.
                // ╰─────
                if (
                  localStore.user.scores_user_data.main_balance == undefined ||
                  isNaN(localStore.user.scores_user_data.main_balance)
                )
                  localStore.user.scores_user_data.main_balance = 0;

                // ╭─────
                // │ CHECK :|: for 'null' / non-empty value of `userguide_opt_out`.
                // ╰─────
                if (localStore.user.scores_user_data.userguide_id_opt_out != null)
                  localStore.userguide_id_opt_out = localStore.user.scores_user_data.userguide_id_opt_out;
                break;

              default: break;
            }

            const scores_user = localStore.user?.scores_user_data;
            if (!scores_user) continue;
            switch (dataTarget as DataPropEnum)
            {
              case DataPropEnum.LANG_USER:
                scores_user.lang = dataPoint;
                updateSelectLang(dataPoint);
                break;
              case DataPropEnum.USER_AVATAR:
                scores_user.profile_photo = dataPoint;
                break;
              case DataPropEnum.USER_NAME:
                scores_user.username = dataPoint;
                break;
              case DataPropEnum.USER_NAME2:
                scores_user.name = dataPoint;
                break;
              case DataPropEnum.USER_ABOUT:
                scores_user.about = dataPoint;
                break;
              case DataPropEnum.USER_WALLET:
                scores_user.web3_wallet_addr = dataPoint;
                break;
              case DataPropEnum.USER_MAIN_BALANCE:
                // ╭─────
                // │ CHECK :|: for invalid balance type.
                // ╰─────
                if (dataPoint == undefined || isNaN(dataPoint as number)) dataPoint = 0;

                scores_user.main_balance = dataPoint as number;
                break;
              case DataPropEnum.USER_INVESTOR_BALANCE:
                scores_user.investor_balance = dataPoint as InvestorData;
                break;
              case DataPropEnum.USER_SUBSCRIPTION: {
                const { target, id, follow } = dataPoint as { target: string, id: string, follow: boolean };
                if (!id) return
                const updated_field = updateDataByKey({ obj: scores_user, field: "subscriptions", key: target, add: follow, id })
                updateFollowing(id, "subscriptions", target as any, follow);
                if (!(scores_user as any).subscriptions)
                {
                  (scores_user as any).subscriptions = {}
                }
                (scores_user as any).subscriptions[target] = updated_field;
                break;
              }
              case DataPropEnum.USER_FOLLOWING: {
                const { target, id, follow } = dataPoint as { target: string, id: string, follow: boolean };
                if (!id) return
                const updated_field = updateDataByKey({ obj: scores_user, field: "following", key: target, id, add: follow })
                updateFollowing(id, "following", target as any, follow);
                if (!(scores_user as any).following)
                {
                  (scores_user as any).following = {}
                }
                (scores_user as any).following[target] = updated_field;
                break;
              }
              case DataPropEnum.USER_BUTTONS_ORDER: {
                (scores_user as any).buttons_order = dataPoint as string[];
                updateButtonOrder(dataPoint as string[]);
                break;
              }
              case DataPropEnum.USER_HIGHLIGHTED_SPORTSTACK: {
                if (!scores_user.highlights)
                {
                  (scores_user as any).highlights = {}
                }
                (scores_user as any).highlights.sportstack = dataPoint as string;
                updateHighlightedSpotstack(dataPoint as string);
                break;
              }
              default: break
            }
          }

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
        <Typ1>
          (
            dataPoint: 'geo-bookmaker' | 'lang' | 'lang-user' | 'uid' | 'user'
          ): Typ1 | NullUndef =>
        {
          const
            localStore = methods.parseLocalStorage()
            ;

          if (dataPoint == 'geo-bookmaker')
            return localStore?.country_bookmaker as Typ1 | NullUndef;
          else if (dataPoint == 'lang')
            return localStore?.lang as Typ1 | NullUndef;
          else if (dataPoint == 'lang-user')
            return localStore?.user?.scores_user_data?.lang as Typ1 | NullUndef;
          else if (dataPoint == 'uid')
            return localStore?.user?.firebase_user_data?.uid as Typ1 | NullUndef;
          else if (dataPoint === 'user')
            return localStore?.user?.scores_user_data as Typ1 | NullUndef;
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
          if (localStore?.theme)
          {
            document.body.classList.toggle('dark-mode', localStore.theme == 'Dark');
            document.body.classList.toggle('light-mode', localStore.theme == 'Light');
          }
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
