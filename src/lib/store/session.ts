import { writable } from 'svelte/store';

export interface Platform_Session {
	newsletterPopUpShow: boolean; // [ℹ] Email_subscribe.svelte
	selectedSeasonID: number; // [ℹ] Tournament Page Critical [❗]
	fixture_select_view: 'overview' | 'news'; // [ℹ] Fixture Page View Critical [❗]
	auth_show: boolean; // [ℹ] Authenticated Opt
  lang_intent: string | undefined;  // NOTE: used for detecting and pre-loading the data for a TARGET page translation of the current one, programatically
}

// [ℹ] Default State
const seassion_store: Platform_Session = {
	newsletterPopUpShow: false,
	selectedSeasonID: undefined,
	fixture_select_view: 'overview',
	auth_show: false,
  lang_intent: undefined
};

function createLocalStore() {
	const { subscribe, set, update } = writable(
		seassion_store
	);

	return {
		subscribe,
		set,
		update,

		toggleNewsletter: () => {
			seassion_store.newsletterPopUpShow =
				!seassion_store.newsletterPopUpShow;
		}
	};
}

export const sessionStore = createLocalStore();
