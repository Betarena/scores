// ... ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... contains the TRANSLATION LANG SELECTED by the USER;
// ... ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import type { GeoJsResponse } from '$lib/models/geojs-types';
import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export type Auth_Type =
	| 'discord'
	| 'email'
	| 'wallet'
	| 'google'
	| 'github';

export interface Betarena_User {
	// [ℹ] default (betarena) specific
	// [ℹ] main user info [DB]
	// email?: string
	lang: string;
	username: string;
	registration_type: Auth_Type[];
	register_date: string;
	profile_photo: string | undefined;
	web3_wallet_addr: string | undefined; // [ℹ] Authenticated User [WEB3]
}

export interface Scores_User {
	firebase_user_data: User;
	scores_user_data: Betarena_User;
}

interface User_Setting {
	lang: string;
	theme: string;
	country_bookmaker: string;
	geoJs: GeoJsResponse;
	user: Scores_User; // [ℹ] Authenticated User
}

const user_settings: User_Setting = {
	lang: undefined,
	theme: undefined,
	country_bookmaker: undefined,
	geoJs: undefined,
	user: undefined
};

/**
 * @description initializer of svelte-stores
 * method, with localstorage persistance for
 * browser-refresh resitant
 * @param {string} key
 * @returns
 */
function createLocalStore(key: string) {
	const { subscribe, set, update } = writable(
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
		useLocalStorage: () => {
			// [ℹ] reset the writable to the localStorage if localStorage already exists,
			const existing: string =
				localStorage.getItem(key);
			// [ℹ] validation of the data existing;
			const exisitng_data: User_Setting = existing
				? // [ℹ] if data exists, then use the existing data;
				  JSON.parse(existing)
				: // [ℹ] otherwise, instantiate default config;
				  {
						lang: 'en',
						theme: 'Light',
						country_bookmaker: undefined,
						geoJs: undefined,
						user: undefined
				  };
			// [ℹ] SET ITEM DATA TO LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(exisitng_data)
			);
			// [ℹ] SET DATA TO SUBSCRIBED METHOD;
			set(exisitng_data);
		},

		/**
		 * @description sets platform language;
		 * and updates the svelte store;
		 * @param {string} lang
		 */
		setLang: (lang: string) => {
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.lang = lang;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// ... update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description sets platform theme;
		 * and updates the svelte store;
		 * @param {string} theme
		 */
		setTheme: (theme: string) => {
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.theme = theme;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// ... update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description sets platform country bookmaker
		 * and updates the svelte store;
		 * @param {string} country_bookmaker
		 */
		setCountryBookmaker: (
			country_bookmaker: string
		) => {
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.country_bookmaker =
				country_bookmaker;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// ... update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description sets GeoJs info object data to localStorage
		 * and updates the svelte store;
		 * @param {GeoJsResponse} GeoJsResponse
		 */
		setGeoJs: (geojs_res: GeoJsResponse) => {
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.geoJs = geojs_res;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// ... update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description adds user to localStorage for user's profile picture
		 * and updates the svelte store;
		 * @param {Scores_User} User
		 */
		signInUser: (user: Scores_User) => {
			// [ℹ] GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// [ℹ] CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// [ℹ] UPDATE THE DATA FOR LANG;
			existing_data.user = user;
			// [ℹ] UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// [ℹ] update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description updates localStorage for user's profile picture;
		 * and updates the svelte store;
		 * @param {string | undefined} profile_pic
		 */
		updateProfilePicture: (
			profile_pic: string | undefined
		) => {
			// [ℹ] GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// [ℹ] CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// [ℹ] UPDATE THE DATA FOR LANG;
			existing_data.user.scores_user_data.profile_photo =
				profile_pic;
			// [ℹ] UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// [ℹ] update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description updates localStorage for user's username
		 * and updates the svelte store;
		 * @param {string} username
		 */
		updateUsername: (username: string) => {
			// [ℹ] GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// [ℹ] CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// [ℹ] UPDATE THE DATA FOR USERNAME;
			existing_data.user.scores_user_data.username =
				username;
			// [ℹ] UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// [ℹ] update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description updates localStorage for user's walletAddress;
		 * and updates the svelte store;
		 * @param {string | undefined} wallet
		 */
		updateWalletAddr: (
			wallet: string | undefined
		) => {
			// [ℹ] GET DATA FROM LOCALSTORAGE();
			const existing: string =
				localStorage.getItem(key);
			// [ℹ] CONVERT TO JSON;
			const existing_data: User_Setting =
				JSON.parse(existing);
			// [ℹ] UPDATE THE DATA FOR WEB3 WALLET;
			existing_data.user.scores_user_data.web3_wallet_addr =
				wallet;
			// [ℹ] UPDATE THE LOCALSTORAGE();
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			// [ℹ] update the `set()` data;
			set(existing_data);
		},

		/**
		 * @description removes user data from localStorage;
		 * and updates the svelte store;
		 */
		signOutUser: () => {
			const existing: string =
				localStorage.getItem(key);
			const existing_data: User_Setting =
				JSON.parse(existing);
			existing_data.user = undefined;
			localStorage.setItem(
				key,
				JSON.stringify(existing_data)
			);
			set(existing_data);
		}
	};
}

// [ℹ] if .localStorage() has the key then it will be used,
// [ℹ] if not the default will be used. Format:
// [ℹ] export const var = createLocalStore(key, default)
export const userBetarenaSettings =
	createLocalStore(
		'betarena-scores-platform-settings'
	);
