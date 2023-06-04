import { writable } from 'svelte/store';

import type { GeoJsResponse } from '$lib/types/types.geojs.js';
import type { Scores_User, User_Setting } from '$lib/types/types.scores.js';

const user_settings: User_Setting = 
{
	lang: undefined,
	theme: undefined,
	country_bookmaker: undefined,
	geoJs: undefined,
	user: undefined
};

/**
 * @description initializer of svelte-stores
 * method, with localStorage persistance for
 * browser-refresh resitant data;
 * @param {string} key
 * @returns
 */
function createLocalStore
(
  key: string
) 
{

	const 
  {
    subscribe, 
    set, 
    update 
  } = writable
  (
		user_settings
	);

	return {
		subscribe,
		set,
		update,

		/**
		 * @description sets platform localstroage;
		 * check for its existance, otherwise initializes
		 * a default new one
		 */
		useLocalStorage: 
    (
    ) => 
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
						user: undefined
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
		 * @description sets platform language;
		 * and updates the svelte store;
		 * @param {string} lang
		 */
		setLang: 
    (
      lang: string
    ) => 
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
		 * @param {string} theme
		 */
		setTheme: 
    (
      theme: string
    ) => 
    {
			const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
			existing_data.theme = theme;
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
		) => 
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
    ) => 
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
    ) => 
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
		) => 
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
    ) => 
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
		) => 
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
		) => 
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
    ) => 
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
     * @description obtains user GEO from localStorage;
     * @returns user target country bookmaker (string);
     */
    getCountryBookmaker:
    (
    ) =>
    {
      const existing: string = localStorage.getItem(key);
			const existing_data: User_Setting =	JSON.parse(existing);
      return existing_data?.country_bookmaker;
    }

	};
}

export const userBetarenaSettings = createLocalStore
(
  'betarena-scores-platform-settings'
);