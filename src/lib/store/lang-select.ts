// ... contains the TRANSLATION LANG SELECTED by the USER;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { dev } from '$app/env'
import { writable } from "svelte/store"

/**
 * Description:
 * ~~~~~~~~~~~~~~
 * ... initialize the .localStorage();
 * @param {*} key
 * @returns
*/
function createLocalStore(key) {
    const {
        subscribe,
        set,
        update
    } = writable("");

    return {
        subscribe,
        set,
        update,

        /**
         * Description:
         * ~~~~~~~~~~~~~~~~~
         * [START]
         * Method for rendering the .localStorage() form
         * the start of the page
        */
        useLocalStorage: () => {
            // ...reset the writable to the localStorage if localStorage already exists,
            const existing: string = localStorage.getItem(key);
            // ...
            const data = existing ? existing : 'en';
            // ...
            set(data);
        },

        /**
         * Description:
         * ~~~~~~~~~~~~~~~~~
         * ... method to add the user seleted language
         * to the localStoage & application store
         * [WORKING]
         *
         * @param {*} item
        */
        setLang: (lang: string) => {
            if (dev) console.info("selected lang", lang);
            // ... save back to .localStorage() as a string
            localStorage.setItem(key, lang);
            // ... update and save the data to set({})
            set(lang)
        },

    };
}

// ... if .localStorage() has the key then it will be used,
// ... if not the default will be used. Format:
// export const var = createLocalStore(key, default)
export const langSelect = createLocalStore('betarena-scores-platform-lang');