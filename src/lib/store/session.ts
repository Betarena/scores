import { dev } from '$app/environment';
import { writable } from 'svelte/store';

export interface Platform_Session {
  newsletterPopUpShow: boolean // [ℹ] Email_subscribe.svelte
  selectedSeasonID:    number  // [ℹ] Tournament Page Critical [❗]
}

const seassion_store: Platform_Session = {
  newsletterPopUpShow: false,
  selectedSeasonID: undefined
};

function createLocalStore () {

  const { subscribe, set, update } = writable(seassion_store);

  return {
		subscribe,
		set,
		update,

    toggleNewsletter: () => {
      seassion_store.newsletterPopUpShow = !seassion_store.newsletterPopUpShow;
    }
  }

}

export const sessionStore = createLocalStore();