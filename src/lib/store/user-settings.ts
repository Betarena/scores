// #region ➤ 📦 Package Imports

import { dlog } from '$lib/utils/debug.js';
import { writable } from 'svelte/store';

import type { BetarenaUser, IUserSetting, Voted_Fixture } from '$lib/types/types.scores.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const userSettings: IUserSetting =
{
	lang: undefined,
	theme: undefined,
	country_bookmaker: undefined,
	geoJs: undefined,
	user: undefined,
  voted_fixtures: [],
  userguide_id_opt_out: []
};

// #endregion ➤ 📌 VARIABLES

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📌 Initializer of `svelte/stores` method.
 *  ⚡️ Uses `localStorage` persistance.
 * @param { string } key
 *  Target `key` to use for `svelte-stores` / `localStorage`.
 * @returns
 */
function createLocalStore
(
  key: string
)
{

  // ◼️◼️◼️ NOTE:
  // ◼️◼️◼️ Default 'svelte/store' exports.
	const
  {
    subscribe,
    set,
    update
  } = writable
  (
		userSettings
	);

  // ◼️◼️◼️ NOTE:
  // ◼️◼️◼️ complementary `store` added methods.
  const methods =
  {

		/**
     * @summary
     *  🟥 MAIN | 🔹 HELPER
		 * @description
     *  📌 Sets platform `localStorage` for target `key`.
     * @returns { void }
		 */
		useLocalStorage:
    (
    ): void =>
    {
			let localStore: IUserSetting = methods.parseLocalStorage();

      // ◼️◼️◼️ CHECK
      // ◼️◼️◼️ absent localstorage object.
      if (localStore == null)
      {
        localStore =
        {
          lang: 'en',
          theme: 'Dark',
          country_bookmaker: undefined,
          geoJs: undefined,
          user: undefined,
          voted_fixtures: [],
          userguide_id_opt_out: [],
        }
      }

      // ◼️◼️◼️ NOTE:
      // ◼️◼️◼️ force users to have '_this_' object data property.
      if (localStore.userguide_id_opt_out == null)
        localStore.userguide_id_opt_out = [];
      ;

			methods.setLocalStorage
      (
        localStore
      );
		},

    /**
     * @summary
     *  🟥 MAIN | 🔹 HELPER | IMPORTANT
     * @description
     *  📌 Retrieves target `localStorage` for target `key`.
     * @returns { IUserSetting }
     *  User `object`.
     */
    parseLocalStorage:
    (
    ): IUserSetting =>
    {
      const localStore: IUserSetting = JSON.parse
      (
        localStorage.getItem
        (
          key
        )
      );
      return localStore;
    },

    /**
     * @summary
     *  🟥 MAIN | 🔹 HELPER | IMPORTANT
     * @description
     *  📌 Persists to `localStorage` target data for target `key`.
     * @returns { void }
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
    },

    /**
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
		 * @description
     *  📌 Updates (via toggle) `svelte-stores` and `client's` data in
     *  `localStorage` for `userguides-op-out`.
		 * @param { number } id
     *  Target **uiserguide** `id`.
     * @returns { void }
		 */
		updateToggleUserGuideOpt:
    (
			id: number
		): void =>
    {
      const localStore: IUserSetting = methods.parseLocalStorage();

      if (localStore?.userguide_id_opt_out?.includes(id))
      {
        localStore.userguide_id_opt_out = localStore?.userguide_id_opt_out
        ?.filter
        (
          x => x != id
        );
      }
      else
      {
        localStore?.userguide_id_opt_out?.push(id);
      }
      localStore.userguide_id_opt_out = [...new Set(localStore?.userguide_id_opt_out)] ?? [];
      methods.setLocalStorage
      (
        localStore
      );
		},

    /**
     * @description
     * TODO: DOC:
     */
		addToVotes:
    (
      vote: Voted_Fixture
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: IUserSetting = JSON.parse(existing);
      if (existing_data.voted_fixtures == undefined)
        existing_data.voted_fixtures = [];
      ;
      existing_data.voted_fixtures.push
      (
        vote
      );
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set
      (
        existing_data
      );
		},

    /**
     * @description
     * TODO: DOC:
     */
    userUpdateBTABalance:
    (
      newBalance: number
    ): void =>
    {
      const localStore: IUserSetting = methods.parseLocalStorage();

      // ### CHECK
      // ### for invalid balance type.
      const if_M_0: boolean =
        newBalance == undefined
        || isNaN(newBalance)
      ;
      if (if_M_0) newBalance = 0;

			localStore.user.scores_user_data.main_balance = newBalance;

      // ◾️ NOTE:
      // ◾️ Approach Num.1
      // localStorage.setItem
      // (
      //   key,
      //   JSON.stringify
      //   (
      //     localStore
      //   )
      // );
      // update
      // (
      //   s =>
      //   (
      //     {
      //       ...s,
      //       user: localStore.user
      //     }
      //   )
      // );

      // ◾️ NOTE:
      // ◾️ Approach Num.2
      methods.setLocalStorage
      (
        localStore
      );
    },

    /**
     * @description
     * TODO: DOC:
     */
    updateUserData:
    (
      data: BetarenaUser
    ): void =>
    {
      const localStore: IUserSetting = methods.parseLocalStorage();

			localStore.user.scores_user_data = data;

      // ### CHECK
      // ### for 'null' value for 'main_balance'.
      const if_M_0: boolean =
        localStore?.user?.scores_user_data?.main_balance == undefined
        || isNaN(localStore?.user?.scores_user_data?.main_balance)
      ;
      if (if_M_0)
      {
        // ### [🐞]
        dlog
        (
          `🚏 checkpoint ➤ updateUserData if_M_0`,
          true
        );

        localStore.user.scores_user_data.main_balance = 0
      }

      // ### CHECK
      // ### for 'null' / non-empty value of `userguide_opt_out`.
      const if_M_1: boolean =
        localStore?.user?.scores_user_data?.userguide_id_opt_out != null
      ;
      if (if_M_1)
        localStore.userguide_id_opt_out = localStore?.user?.scores_user_data?.userguide_id_opt_out;
      ;

      // ◾️ NOTE:
      // ◾️ Approach Num.2
      methods.setLocalStorage
      (
        localStore
      );
    },

    /**
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER | IMPORTANT
     * @param { 'lang' } dataTarget
     *  Target data to update.
     * @param { any } dataPoint
     *  Target data value to update.
     * @returns { void }
     */
    updateData:
    (
      dataTarget: 'lang' | 'lang-user' | 'geo-bookmaker' | 'theme' | 'geoJs' | 'user-avatar' | 'user-name' | 'user-wallet' | 'user-object',
      dataPoint?: any,
    ): void =>
    {
      const localStore: IUserSetting = methods.parseLocalStorage();

      if (dataTarget == 'lang')
			  localStore.lang = dataPoint;
      //
      if (dataTarget == 'lang-user')
			  localStore.user.scores_user_data.lang = dataPoint;
      //
      if (dataTarget == 'geo-bookmaker')
			  localStore.country_bookmaker = dataPoint;
      //
      if (dataTarget == 'theme')
        localStore.theme =
          localStore.theme == 'Dark'
            ? 'Light'
            : 'Dark'
        ;
      //
      if (dataTarget == 'geoJs')
			  localStore.geoJs = dataPoint;
      //
      if (dataTarget == 'user-avatar')
			  localStore.user.scores_user_data.profile_photo = dataPoint;
      //
      if (dataTarget == 'user-name')
			  localStore.user.scores_user_data.username = dataPoint;
      //
      if (dataTarget == 'user-wallet')
			  localStore.user.scores_user_data.web3_wallet_addr = dataPoint;
      //
      if (dataTarget == 'user-object')
			  localStore.user = dataPoint;
      //

			methods.setLocalStorage
      (
        localStore
      );
    },

    /**
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER | IMPORTANT
     * @param { 'geo-bookmaker' | 'user-lang' } dataPoint
     *  Target `data point` to be retrieved.
     * @returns { any }
     *  Target requested `data point`.
     */
    extract:
    (
      dataPoint: 'geo-bookmaker' | 'user-lang'
    ): any =>
    {
			const localStore: IUserSetting = methods.parseLocalStorage();

      if (dataPoint == 'geo-bookmaker')
        return localStore?.country_bookmaker;
      //
      if (dataPoint == 'user-lang')
        return localStore?.lang;
      //

      return;
    },

    /**
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER | IMPORTANT
     * @description
     *  📌 Extracts necessary data in form of an object.
     * @returns { object }
     */
    extractUserDataSnapshot:
    (
    ): object =>
    {
      const localStore: IUserSetting = methods.parseLocalStorage();

      const data: object =
      {
        lang: localStore?.lang,
        geo: localStore?.country_bookmaker,
        user: undefined
      };

      if (localStore?.user)
      {
        data['user-uid'] = localStore?.user?.firebase_user_data?.uid;
        data['user-lang'] = localStore?.user?.scores_user_data?.lang;
      };

      return data;
    }

  };

	return {
		subscribe,
		set,
		update,
    ...methods,
	};
}

// #endregion ➤ 🛠️ METHODS

export default createLocalStore('betarena-scores-platform-settings');