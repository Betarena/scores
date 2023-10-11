// #region ➤ 📦 Package Imports

import { dlog } from '$lib/utils/debug.js';
import { writable } from 'svelte/store';

import type { GeoJsResponse } from '$lib/types/types.geojs.js';
import type { BetarenaUser, Scores_User, User_Setting, Voted_Fixture } from '$lib/types/types.scores.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const userSettings: User_Setting =
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
 * @summary
 * [MAIN]
 *
 * @description
 *
 * 📌 Initializer of `svelte/stores` method.
 *
 * ⚡️ Uses `localStorage` persistance.
 *
 * @param
 * { string } key
 *
 * @returns
 */
function createLocalStore
(
  key: string
)
{

  // ◼️ NOTE:
  // ◼️ Default 'svelte/store' exports.
	const
  {
    subscribe,
    set,
    update
  } = writable
  (
		userSettings
	);

  // ### NOTE:
  // ### complementary `store` added methods.
  const methods =
  {

		/**
     * @summary
     *  🟥 MAIN | 🔹 HELPER
		 * @description
     *  📌 Sets platform `localStorage`.
     * @returns { void }
		 */
		useLocalStorage:
    (
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const exisitng_data: User_Setting = existing
				?
				  JSON.parse(existing)
				:
				  {
						lang: 'en',
						theme: 'Light',
						country_bookmaker: undefined,
						geoJs: undefined,
						user: undefined,
            voted_fixtures: [],
            userguide_id_opt_out: [],
				  }
      ;

      if (exisitng_data.userguide_id_opt_out == null)
        exisitng_data.userguide_id_opt_out = [];
      ;

			localStorage.setItem
      (
				key,
				JSON.stringify(exisitng_data)
			);
			set(exisitng_data);
		},

    /**
     * @summary
     *  🟥 MAIN | 🔹 HELPER | IMPORTANT
     * @description
     *  📌 Retrieves target `localStorage`.
     * @returns { User_Setting }
     */
    parseLocalStorage:
    (
    ): User_Setting =>
    {
      const localStore: User_Setting = JSON.parse
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
     *  📌 Persists to `localStorage` target data.
     * @returns { void }
     */
    setLocalStorage:
    (
      data: User_Setting
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
     * @summary
     *  🟥 MAIN | 🔹 HELPER | IMPORTANT
		 * @description
     *  📌 Updates `svelte-stores` and `client's` data in
     *  `localStorage` for platform `language`.
		 * @param { string } lang
		 */
		setLang:
    (
      lang: string
    ): void =>
    {
			const localStore: User_Setting = methods.parseLocalStorage();
			localStore.lang = lang;
			methods.setLocalStorage
      (
        localStore
      );
		},

		/**
		 * @description sets platform theme;
		 * and updates the svelte store;
		 */
		toggleTheme:
    (
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.theme =
        existing_data.theme == 'Dark'
          ? 'Light'
          : 'Dark'
      ;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
		},

		/**
		 * @description sets platform country bookmaker
		 * and updates the svelte store;
		 * @param {string} country_bookmaker
		 */
		setCountryBookmaker:
    (
			countryBookmaker: string
		): void =>
    {
			const localStore: User_Setting = methods.parseLocalStorage();
			localStore.country_bookmaker = countryBookmaker;
      methods.setLocalStorage
      (
        localStore
      );
		},

		/**
		 * @description sets GeoJs info object data to localStorage
		 * and updates the svelte store;
		 * @param {GeoJsResponse} geojs_res
		 */
		setGeoJs:
    (
      geojs_res: GeoJsResponse
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting = JSON.parse(existing);
			existing_data.geoJs = geojs_res;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
		},

		/**
		 * @description adds user to localStorage for user's profile picture
		 * and updates the svelte store;
		 * @param {Scores_User} user
		 */
		signInUser:
    (
      user: Scores_User
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.user = user;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
		},

		/**
		 * @description updates localStorage for
     * user's profile picture; Updates the svelte store;
		 * @param {string | undefined} profile_pic
		 */
		updateProfilePicture:
    (
			profile_pic: string | undefined
		): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.user.scores_user_data.profile_photo = profile_pic;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
		},

		/**
		 * @description updates localStorage for user's username
		 * and updates the svelte store;
		 * @param {string} username
		 */
		updateUsername:
    (
      username: string
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.user.scores_user_data.username = username;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
		},

		/**
		 * @description updates localStorage for user's walletAddress;
		 * and updates the svelte store;
		 * @param {string | undefined} wallet
		 */
		updateWalletAddr:
    (
			wallet: string | undefined
		): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.user.scores_user_data.web3_wallet_addr = wallet;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
		},

    /**
     * @summary
     *  🔹 HELPER
		 * @description updates localStorage for user's platform language;
		 * and updates the svelte store;
		 * @param {string | undefined} wallet
		 */
		updateLang:
    (
			lang: string | undefined
		): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.user.scores_user_data.lang = lang;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
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
      const localStore: User_Setting = methods.parseLocalStorage();

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
		 * @description removes user data from localStorage;
		 * and updates the svelte store;
		 */
		signOutUser:
    (
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting = JSON.parse(existing);
			existing_data.user = undefined;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
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
			const existing_data: User_Setting = JSON.parse(existing);
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
     * @description obtains user GEO from localStorage;
     * @returns user target country bookmaker (string);
     */
    getCountryBookmaker:
    (
    ): string =>
    {
      const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
      return existing_data?.country_bookmaker;
    },

    /**
     * @description
     * TODO: DOC:
     */
    getUserLang:
    (
    ): string =>
    {
      const localStore: User_Setting = methods.parseLocalStorage();
      return localStore?.lang;
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
      const localStore: User_Setting = methods.parseLocalStorage();

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
      const localStore: User_Setting = methods.parseLocalStorage();

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
     * @description
     * TODO: DOC:
     */
    getUserUid:
    (
    ): string =>
    {
      const localStore: User_Setting = methods.parseLocalStorage();
      return localStore?.user?.firebase_user_data?.uid;
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