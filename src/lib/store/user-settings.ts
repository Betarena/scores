// ... ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... contains the TRANSLATION LANG SELECTED by the USER;
// ... ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { dev } from '$app/env';
import { writable } from 'svelte/store';

interface User_Setting {
	lang: string;
	theme: string;
	country_bookmaker: string;
}

const user_settings: User_Setting = {
	lang: undefined,
	theme: undefined,
	country_bookmaker: undefined
}

/**
 * Description:
 * ~~~~~~~~~~~~~~
 * ... initialize the .localStorage();
 * ... @param {*} key
 * ... @returns
*/
function createLocalStore(key: any): any {
	
	const { subscribe, set, update } = writable(user_settings);

	return {
		subscribe,
		set,
		update,

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ... [START]
		 * ... Method for rendering the .localStorage() form
		 * ... the start of the page,
		*/
		useLocalStorage: () => {
			// ... reset the writable to the localStorage if localStorage already exists,
			const existing: string = localStorage.getItem(key);
			// ... validation of the data existing;
			const exisitng_data: User_Setting = existing
				? // ... if data exists, then use the existing data;
				  JSON.parse(existing)
				: // ... otherwise, instantiate default config;
				  {
						lang: 'en',
						theme: 'Light',
						country_bookmaker: undefined
				  };
			// ... DEBUGGING;
			if (dev) console.debug('-- exisitng_data --', exisitng_data);
			// ... SET ITEM DATA TO LOCALSTORAGE();
			localStorage.setItem(key, JSON.stringify(exisitng_data));
			// ... SET DATA TO SUBSCRIBED METHOD;
			set(exisitng_data);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * ... method to add the user seleted language
		 * ... to the localStoage & application store
		 * ... [WORKING]
		 *
		 * ... @param {*} lang
		*/
		setLang: (lang: string) => {
			// ... DEBUGGING;
			if (dev) console.info('-- select-lang --', lang);
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
		 * ... method to add the user seleted theme
		 * ... to the localStoage & application store
		 * ... [WORKING]
		 *
		 * ... @param {*} theme
		*/
		setTheme: (theme: string) => {
			// ... DEBUGGING;
			if (dev) console.debug('-- theme-select --', theme);
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
		 * ... method to add the user seleted theme
		 * ... to the localStoage & application store
		 * ... [WORKING]
		 *
		 * ... @param {*} country_bookmaker
		*/
		setCountryBookmaker: (country_bookmaker: string) => {
			// ... DEBUGGING;
			if (dev) console.debug('-- country_bookmaker-select --', country_bookmaker);
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
		}
	};
}

// ... if .localStorage() has the key then it will be used,
// ... if not the default will be used. Format:
// ... export const var = createLocalStore(key, default)
export const userBetarenaSettings = createLocalStore('betarena-scores-platform-settings');