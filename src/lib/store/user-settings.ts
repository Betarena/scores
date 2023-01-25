// ... ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... contains the TRANSLATION LANG SELECTED by the USER;
// ... ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { dev } from '$app/environment';
import type { GeoJsResponse } from '$lib/models/geojs-types';
import { logDevGroup } from '$lib/utils/debug';
import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export interface Scores_User
  extends User {
  web3_wallet_addr?: string // [ℹ] Authenticated User [WEB3]
}

interface User_Setting {
	lang:               string;
	theme:              string;
	country_bookmaker:  string;
	geoJs:              GeoJsResponse;
  user:               Scores_User // [ℹ] Authenticated User
}

const user_settings: User_Setting = {
	lang: undefined,
	theme: undefined,
	country_bookmaker: undefined,
	geoJs: undefined,
  user: undefined
}

/**
 * Description:
 * ~~~~~~~~~~~~~~
 * ... initialize the .localStorage();
 * ... @param {*} key
 * ... @returns
*/
function createLocalStore(key: string) {
	
	const { subscribe, set, update } = writable(user_settings);

	return {
		subscribe,
		set,
		update,

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ➤ [START]
		 * ➤ Method for rendering the .localStorage() form
		 * ➤ the start of the page,
		*/
		useLocalStorage: () => {
			// [ℹ] reset the writable to the localStorage if localStorage already exists,
			const existing: string = localStorage.getItem(key);
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
			localStorage.setItem(key, JSON.stringify(exisitng_data));
			// [ℹ] SET DATA TO SUBSCRIBED METHOD;
			set(exisitng_data);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ➤ method to add the user seleted language
		 * ➤ to the localStoage & application store
		 * ➤ [WORKING]
		 *
		 * ➤ @param {*} lang
		*/
		setLang: (lang: string) => {
			// ... DEBUGGING;
      if (dev) logDevGroup ("user-settings [DEV]", `selected lang: ${lang}`)
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string = localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting = JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.lang = lang;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(key, JSON.stringify(existing_data));
			// ... update the `set()` data;
			set(existing_data);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ➤ method to add the user seleted theme
		 * ➤ to the localStoage & application store
		 * ➤ [WORKING]
		 *
		 * ➤ @param {*} theme
		*/
		setTheme: (theme: string) => {
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string = localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting = JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.theme = theme;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(key, JSON.stringify(existing_data));
			// ... update the `set()` data;
			set(existing_data);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ➤ method to add the user seleted theme
		 * ➤ to the localStoage & application store
		 * ➤ [WORKING]
		 *
		 * ➤ @param {*} country_bookmaker
		*/
		setCountryBookmaker: (country_bookmaker: string) => {
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string = localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting = JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.country_bookmaker = country_bookmaker;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(key, JSON.stringify(existing_data));
			// ... update the `set()` data;
			set(existing_data);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ➤ method to add the user seleted theme
		 * ➤ to the localStoage & application store
		 * ➤ [WORKING]
		 *
		 * ➤ @param {*} GeoJsResponse
		*/
		setGeoJs: (geojs_res: GeoJsResponse) => {
			// ... GET DATA FROM LOCALSTORAGE();
			const existing: string = localStorage.getItem(key);
			// ... CONVERT TO JSON;
			const existing_data: User_Setting = JSON.parse(existing);
			// ... UPDATE THE DATA FOR LANG;
			existing_data.geoJs = geojs_res;
			// ... UPDATE THE LOCALSTORAGE();
			localStorage.setItem(key, JSON.stringify(existing_data));
			// ... update the `set()` data;
			set(existing_data);
		},

    /**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ➤ method to add the user data
		 * ➤ to the localStoage & application store
		 * ➤ [WORKING]
		 *
		 * ➤ @param {*} User
		*/
    signInUser: (user: User) => {
      // [ℹ] GET DATA FROM LOCALSTORAGE();
      const existing: string = localStorage.getItem(key);
      // [ℹ] CONVERT TO JSON;
      const existing_data: User_Setting = JSON.parse(existing);
      // [ℹ] UPDATE THE DATA FOR LANG;
      existing_data.user = user;
      // [ℹ] UPDATE THE LOCALSTORAGE();
      localStorage.setItem(key, JSON.stringify(existing_data));
      // [ℹ] update the `set()` data;
      set(existing_data);
    },

    /**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ➤ method to remove the user data from
		 * ➤ the localStoage & application store
		 * ➤ [WORKING]
		*/
    signOutUser: () => {
      // [ℹ] GET DATA FROM LOCALSTORAGE();
      const existing: string = localStorage.getItem(key);
      // [ℹ] CONVERT TO JSON;
      const existing_data: User_Setting = JSON.parse(existing);
      // [ℹ] UPDATE THE DATA FOR LANG;
      existing_data.user = undefined;
      // [ℹ] UPDATE THE LOCALSTORAGE();
      localStorage.setItem(key, JSON.stringify(existing_data));
      // [ℹ] update the `set()` data;
      set(existing_data);
    }
	};
}

// ... if .localStorage() has the key then it will be used,
// ... if not the default will be used. Format:
// ... export const var = createLocalStore(key, default)
export const userBetarenaSettings = createLocalStore('betarena-scores-platform-settings');