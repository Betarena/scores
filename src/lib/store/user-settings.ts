// #region ➤ 📦 Package Imports

import { writable } from 'svelte/store';
import { dlog } from '$lib/utils/debug.js';

import type { GeoJsResponse } from '$lib/types/types.geojs.js';
import type { Betarena_User, Scores_User, User_Setting, Voted_Fixture } from '$lib/types/types.scores.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const user_settings: User_Setting =
{
	lang: undefined,
	theme: undefined,
	country_bookmaker: undefined,
	geoJs: undefined,
	user: undefined,
  voted_fixtures: []
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
		user_settings
	);

  // ◼️ NOTE:
  // ◼️ Complementary 'store' added methods.
  const methods =
  {

		/**
		 * @description sets platform localstroage;
		 * check for its existance, otherwise initializes
		 * a default new one
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
            voted_fixtures: []
				  }
      ;
			localStorage.setItem
      (
				key,
				JSON.stringify(exisitng_data)
			);
			set(exisitng_data);
		},

    /**
     * @description
     * TODO: DOC:
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
     * @description
     * TODO: DOC:
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
		 * @description sets platform language;
		 * and updates the svelte store;
		 * @param {string} lang
		 */
		setLang:
    (
      lang: string
    ): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.lang = lang;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
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
			country_bookmaker: string
		): void =>
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.country_bookmaker =	country_bookmaker;
			localStorage.setItem
      (
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
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
      data: Betarena_User
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
        // [🐞]
        dlog
        (
          `🚏 checkpoint ➤ updateUserData if_M_0`,
          true
        );

        localStore.user.scores_user_data.main_balance = 0
      };

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
  }

	return {
		subscribe,
		set,
		update,
    ...methods
	};
}

// #endregion ➤ 🛠️ METHODS

export default createLocalStore('betarena-scores-platform-settings');