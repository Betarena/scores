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
// │ Betarena (Module)
// │ |: Main Platform 'Svelte/Store' with 'LocalStorage' Persistance
// │ |: Used by (1) 'Non-Authenticated' and (2) 'Authenticated' platform users.
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

// #region ➤ 📦 Package Imports

import { writable } from 'svelte/store';

import { updateButtonOrder, updateDataByKey, updateFollowing, updateHighlightedSpotstack } from '$lib/firebase/common.js';
import { log_v3 } from '$lib/utils/debug.js';
import { parseObject } from '$lib/utils/string.2.js';
import { setCookie } from './cookie.js';

import type { IBetarenaUserCookie } from '$lib/types/types.cookie.js';
import type { BetarenaUser, IUserSetting } from '$lib/types/types.user-settings.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ ⛩️ TYPES

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
  | 'user-buttons-order'
  | 'user-subscriptions'
  | 'user-highlighted-sportstack'
  | 'history-preference-articles-content-feed'
  | 'search_history'
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
  HISTORY_PREFERENCE_ARTICLES_CONTENT_FEED = 'history-preference-articles-content-feed',
  SEARCH_HISTORY = 'search_history'
}

// #endregion ➤ ⛩️ TYPES

// #region ➤ 📌 VARIABLES

let
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
      userguide_id_opt_out: [],
      objHistory:
      {
        strContentSelectFeed: 'home'
    },
      searchHistory: [],
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 📌 │ DEFAULT                                                                     │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯
      _SIDE_EFFECTS_: new Set()
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
 *  - 📣 Initializer of `svelte/stores` method.
 *  - 📣 Uses `localStorage` persistance.
 * @param { string } key
 *  ❗️ **REQUIRED** Target `key` to use for `svelte-stores` / `localStorage`.
 * @return
 *  📤 Store logic.
 */
function createLocalStore
(
  key: string
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
      userSettings
    ),
    /**
     * @description
     *  📣 complementary `store` added methods.
     */
    methods
      = {

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🟦 │ Local Helper Logic                                                          │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        /**
         * @author
         *  @migbash
         * @summary_tags
         *  - ♦️ IMPORTANT
         *  - 🔹 HELPER
         * @description
         *  📝 Instantiate `localStorage` data for target `key`.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ useLocalStorage();
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Initializes `localStorage` data.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : void
         *  [X]──────────────────────────────────────────────────────────────────
         * @return { void }
         */
        useLocalStorage:
        (
          strLang: string = 'en'
        ): void =>
        {
          let
            /**
             * @description
             * 📝 Target `localStorage` data.
             */
            localStore = methods.parseLocalStorage()
          ;

          // ╭─────
          // │ CHECK:
          // │ │: for absent localstorage object, create one.
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
                searchHistory: [],
                objHistory:
                {
                  strContentSelectFeed: 'home'
                },
                _SIDE_EFFECTS_: new Set(['IsAnonymousNew'])
              }
            ;
          ;

          localStore = methods.validateLocalStorage
          (
            localStore
          );

          // ╭─────
          // │ NOTE:
          // │ |: Initialize user data.
          // ╰─────
          if (localStore.user)
            localStore._SIDE_EFFECTS_.add('IsAuthenticated');
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
         *  - 🟥 IMPORTANT CRITICAL
         *  - 🔹 HELPER
         * @description
         *   📝 Validates and patches up `localStorage` for errors and versioning migration.
         */
        validateLocalStorage:
        (
          data: IUserSetting
        ): IUserSetting =>
        {
          // ╭─────
          // │ CHECK :|: for absent localstorage._SIDE_EFFECTS_ (in earlier user versions)
          // ╰─────
          data._SIDE_EFFECTS_ = new Set();
          // ╭─────
          // │ NOTE: IMPORTANT
          // │ │: force legacy users to have _this_ object data property.
          // │ │: necessary for new logic to work better.
          // ╰─────
          if (data.userguide_id_opt_out == undefined)
            data.userguide_id_opt_out = [];
          ;
          // ╭─────
          // │ NOTE: IMPORTANT
          // │ │: force legacy users to have _this_ object data property.
          // │ │: necessary for new logic to work better.
          // ╰─────
          data.objHistory = data.objHistory ?? { strContentSelectFeed: 'home' };
          return data;
        },

        /**
         * @author
         *  @migbash
         * @summary_tags
         *  - ♦️ IMPORTANT
         *  - 🔹 HELPER
         * @description
         *  📝 Retrieves target `localStorage` for target `key`.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ parseLocalStorage();
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Retrieves `user` data from `localStorage`.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : IUserSetting | NullUndef
         *  [X]──────────────────────────────────────────────────────────────────
         * @return { IUserSetting | NullUndef }
         *  📤 Target `user` data object.
         */
        parseLocalStorage:
        (
        ): IUserSetting | NullUndef =>
        {
          const
            /**
             * @description
             * 📣 Target `localStorage` data.
             */
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
         * @summary_tags
         *  - ♦️ IMPORTANT
         *  - 🔹 HELPER
         * @description
         *  📝 Persists to `localStorage` target data for target `key`.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ setLocalStorage
         *  │ (
         *  │   {
         *  │     lang: 'en',
         *  │     theme: 'Dark',
         *  │     country_bookmaker: 'PT',
         *  │     ...
         *  │   } as IUserSetting
         *  │ );
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Persists `user` data to `localStorage`.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : void
         *  [X]──────────────────────────────────────────────────────────────────
         * @param { IUserSetting } data
         *  ❗️ **REQUIRED** `user` data to be persisted.
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
            parseObject
            (
              data
            )
          );

          userSettings = data;

          set
          (
            data
          );

          return;
        },

        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 📣 │ Main Logic                                                                  │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯

        /**
         * @author
         *  @migbash
         * @summary_tags
         *  - 🔹 HELPER
         *  - ♦️ IMPORTANT & CRITICAL
         * @error_handle_notice
         *  🔰 HANDLED
         *    │: Error is caught & handled.
         * @description
         *  📝 Update **target** `list` data of target `properties` to update.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ updateData
         *  │ (
         *  │   [
         *  │     ['lang', 'en'],
         *  │     ['geo-bookmaker', 'PT'],
         *  │     ['theme', 'Dark'],
         *  │   ]
         *  │ );
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Updates `lang`, `geo-bookmaker` and `theme` properties.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : void
         *  [X]──────────────────────────────────────────────────────────────────
         * @param { [IDataProp, any][] } data
         *  ❗️ **REQUIRED** Target data to update.
         * @return { void }
         */
        updateData:
        (
          data: [IDataProp, any][]
        ): void =>
        {
          // [🐞]
          log_v3
          (
            {
              strGroupName: '🚏 checkpoint ➤ Store | LocalStorage ➤ updateData(..) // START',
              msgs: [
                `🔹 [var] ➤ data :: ${parseObject(data)}`,
              ],
              closed: true
            }
          );

          // ╭─────
          // │ IMPORTANT CRITICAL
          // ╰─────
          if (userSettings._SIDE_EFFECTS_.size > 0)
          {
            // eslint-disable-next-line no-console
            console.warn('[WARNING] ➤ userSettings._SIDE_EFFECTS_ is not empty, but no side-effects were triggered.', userSettings._SIDE_EFFECTS_);
            userSettings._SIDE_EFFECTS_ = new Set();
          }

          const
            /**
             * @description
             * 📝 Follow-up action.
             */
            setSideEffects: IUserSetting['_SIDE_EFFECTS_'] = new Set(),
            /**
             * @description
             * 📝 Target `localStorage` data.
             */
            objOldDataSnapshot = methods.extractUserDataSnapshot()
          ;

          // ╭─────
          // │ NOTE:
          // │ |: Loop through data to update.
          // ╰─────
          for (const iterator of data)
          {
            const
              /**
               * @description
               */
              dataTarget = iterator[0],
              /**
               * @description
               */
              scores_user = userSettings.user?.scores_user_data
            ;

            let
              /**
               * @description
               */
              dataPoint = iterator[1]
            ;

            // ╭─────
            // │ NOTE:
            // │ |: Standard User (non-authenticated) data update.
            // ╰─────
            switch (dataTarget as DataPropEnum)
            {
              case DataPropEnum.LANG:
              {
                userSettings.lang = dataPoint;
                if (userSettings.user?.scores_user_data)
                  data.push(['lang-user', dataPoint]);
                ;
                setSideEffects.add('LangUpdate');
                break;
              }
              case DataPropEnum.THEME:
              {
                userSettings.theme
                  = userSettings.theme == 'Dark'
                    ? 'Light'
                    : 'Dark'
                ;
                document.body.classList.toggle('dark-mode');
                document.body.classList.toggle('light-mode');
                break;
              }
              case DataPropEnum.GEO_JS:
              {
                userSettings.geoJs = dataPoint;
                break;
              }
              case DataPropEnum.USER_OBJECT:
              {
                if (userSettings.user == undefined)
                  setSideEffects.add('IsAuthenticated');
                ;
                userSettings.user = dataPoint;
                if (dataPoint == undefined)
                  setSideEffects.add('IsAnonymous');
                ;
                break;
              }
              case DataPropEnum.USER_SCORES_DATA:
              {
                (userSettings.user ??= {});

                userSettings.user.scores_user_data = dataPoint as BetarenaUser;

                // ╭─────
                // │ CHECK:
                // │ │: for 'null' value for 'main_balance'.
                // ╰─────
                if
                (
                  userSettings.user.scores_user_data.main_balance == undefined
                  || isNaN(userSettings.user.scores_user_data.main_balance)
                )
                  userSettings.user.scores_user_data.main_balance = 0;
                ;

                // ╭─────
                // │ CHECK:
                // │ │: for 'null' / non-empty value of `userguide_opt_out`.
                // ╰─────
                if (userSettings.user.scores_user_data.userguide_id_opt_out != null)
                  userSettings.userguide_id_opt_out = userSettings.user.scores_user_data.userguide_id_opt_out;
                ;

                break;
              }
              case DataPropEnum.HISTORY_PREFERENCE_ARTICLES_CONTENT_FEED:
              {
                userSettings.objHistory.strContentSelectFeed = dataPoint as IUserSetting['objHistory']['strContentSelectFeed'];
                break;
                }
              case DataPropEnum.SEARCH_HISTORY:
              {
                userSettings.searchHistory = dataPoint as IUserSetting['searchHistory'];
                break;
              }
              default: break;
            }

            // ╭─────
            // │ NOTE:
            // │ |: User (authenticated) data update.
            // ╰─────
            if (!scores_user) continue;

            switch (dataTarget as DataPropEnum)
            {
              case DataPropEnum.LANG_USER:
              {
                scores_user.lang = dataPoint;
                setSideEffects.add('UserUpdateDataLanguage');
                break;
              }
              case DataPropEnum.USER_AVATAR:
              {
                scores_user.profile_photo = dataPoint;
                break;
              }
              case DataPropEnum.USER_NAME:
              {
                scores_user.username = dataPoint;
                break;
              }
              case DataPropEnum.USER_NAME2:
              {
                scores_user.name = dataPoint;
                break;
              }
              case DataPropEnum.USER_ABOUT:
              {
                scores_user.about = dataPoint;
                break;
              }
              case DataPropEnum.USER_WALLET:
              {
                scores_user.web3_wallet_addr = dataPoint;
                break;
              }
              case DataPropEnum.USER_MAIN_BALANCE:
              {
                // ╭─────
                // │ CHECK:
                // │ │: for invalid balance type.
                // ╰─────
                if (dataPoint == undefined || isNaN(dataPoint as number))
                  dataPoint = 0;
                ;
                scores_user.main_balance = dataPoint as number;
                break;
              }
              case DataPropEnum.USER_INVESTOR_BALANCE:
              {
                scores_user.investor_balance = dataPoint;
                break;
              }
              case DataPropEnum.USER_SUBSCRIPTION:
              {
                const
                  // ╭─────
                  // │ NOTE:
                  // │ |: Destruction of `dataPoint` object.
                  // ╰─────
                  {
                    target,
                    id,
                    follow
                  } = dataPoint as { target: string, id: string, follow: boolean }
                ;

                if (!id) return;

                const
                  /**
                   * @description
                   * 📝 Updated field.
                   */
                  updated_field
                    = updateDataByKey
                    (
                      {
                        obj: scores_user,
                        field: 'subscriptions',
                        key: target,
                        add: follow,
                        id
                      }
                    )
                ;

                updateFollowing
                (
                  id,
                  'subscriptions',
                  target as any,
                  follow
                );

                if (!scores_user.subscriptions)
                  scores_user.subscriptions = {};
                ;

                scores_user.subscriptions[target] = updated_field;

                break;
              }
              case DataPropEnum.USER_FOLLOWING:
              {
                const
                  // ╭─────
                  // │ NOTE:
                  // │ |: Destruction of `dataPoint` object.
                  // ╰─────
                  {
                    target,
                    id,
                    follow
                  } = dataPoint as { target: string, id: string, follow: boolean }
                ;

                if (!id) return;

                const updated_field = updateDataByKey({ obj: scores_user, field: 'following', key: target, id, add: follow })

                updateFollowing(id, 'following', target as any, follow);

                if (!scores_user.following)
                  scores_user.following = {};
                ;

                scores_user.following[target] = updated_field;

                break;
              }
              case DataPropEnum.USER_BUTTONS_ORDER:
              {
                // @ts-expect-error :|: 🚧
                scores_user.buttons_order = dataPoint as string[];
                updateButtonOrder(dataPoint as string[]);
                break;
              }
              case DataPropEnum.USER_HIGHLIGHTED_SPORTSTACK:
              {
                // @ts-expect-error :|: 🚧
                if (!scores_user.highlights)
                  // @ts-expect-error :|: 🚧
                  scores_user.highlights = {};
                ;
                // @ts-expect-error :|: 🚧
                scores_user.highlights.sportstack = dataPoint as string;
                updateHighlightedSpotstack(dataPoint as string);
                break;
              }
              default: break
            }
          }

          // ╭─────
          // │ IMPORTANT CRITICAL
          // ╰─────
          if (setSideEffects.size > 0)
            userSettings._SIDE_EFFECTS_ = setSideEffects;
          ;

          methods.setLocalStorage
          (
            userSettings
          );

          // ╭─────
          // │ NOTE:
          // │ |: Update cookie data, if necessary.
          // ╰─────
          if (parseObject(objOldDataSnapshot) != parseObject(methods.extractUserDataSnapshot()))
            setCookie
            (
              'betarenaScoresCookie',
              parseObject(methods.extractUserDataSnapshot()),
              30
            );
          ;

          return;
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - 🔹 HELPER
         *  - ♦️ IMPORTANT & CRITICAL
         * @description
         *  📝 Clear all side-effects.
         * @return { void }
         */
        clearSideEffects:
        (
        ): void =>
        {
          userSettings._SIDE_EFFECTS_ = new Set();
          set
          (
            userSettings
          );
          return;
        },

        /**
         * @deprecated
         *  ❗️ Use `extractAll(..)` instead.
         * @author
         *  @migbash
         * @summary_tags
         *  - ♦️ IMPORTANT
         *  - 🔹 HELPER
         * @description
         *  📝 Extracts **target** `user` data property.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ extract < string >
         *  │ (
         *  │   'lang'
         *  │ );
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Retrieves `lang` property from `store`.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : 'en'
         *  [X]──────────────────────────────────────────────────────────────────
         * @param { 'geo-bookmaker' | 'lang' | 'lang-user' | 'uid' } dataPoint
         *  ❗️ **REQUIRED** Target `data point` to be retrieved.
         * @return { Typ1 | NullUndef }
         *  📤 Requested `data point`.
         */
        extract:
        <Typ1>
        (
          dataPoint:
            | 'geo-bookmaker'
            | 'lang'
            | 'lang-user'
            | 'uid'
            | 'user'
        ): Typ1 | NullUndef =>
        {
          const
            /**
             * @description
             * 📣 Target `localStorage` data.
             */
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
          else if (dataPoint === 'search')
            return localStore?.user?.scores_user_data?.search as Typ1 | NullUndef
          ;

          return;
        },

        /**
         * @author
         *  @migbash
         * @summary_tags
         *  - ♦️ IMPORTANT
         *  - 🔹 HELPER
         * @description
         *  📝 Extracts **target** data batch.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ extractUserDataSnapshot();
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Updates `lang`, `geo-bookmaker` and `theme` properties.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : void
         *  [X]──────────────────────────────────────────────────────────────────
         * @return { IBetarenaUserCookie }
         *  📤 Main `data point(s)`.
         */
        extractUserDataSnapshot:
        (
        ): IBetarenaUserCookie =>
        {
          return {
            uid: userSettings.user?.firebase_user_data?.uid,
            lang: userSettings.lang,
            theme: userSettings.theme,
          }
        },

        /**
         * @author
         *  @migbash
         * @summary
         *  - ♦️ IMPORTANT
         *  - 🔹 HELPER
         * @description
         *  📝 Extracts all data.
         * @example
         *  [1]──────────────────────────────────────────────────────────────────
         *  │ extractAll();
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ DESCRIPTION
         *  │ : Retrieves all data.
         *  ┣────────────────────────────────────────────────────────────────────
         *  │ OUTPUT
         *  │ : IUserSetting | NullUndef
         *  [X]──────────────────────────────────────────────────────────────────
         * @returns { IUserSetting | NullUndef }
         *  📤 All data.
         */
        extractAll:
        (
        ): IUserSetting =>
        {
          // @ts-expect-error :: Emtpy object is not allowed, but returned nonetheless.
          return methods.parseLocalStorage() ?? {};
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
