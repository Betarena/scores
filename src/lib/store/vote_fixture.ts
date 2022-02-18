// ... contains the values of the Fixture User Votes;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import { dev } from '$app/env';
import { writable } from 'svelte/store';

export interface fixture {
	fixture_id: number;
	fixture_vote: string;
	fixture_vote_val: string;
	_X_vote: number;
	_1_vote: number;
	_2_vote: number;
}

interface fixtureVoteData {
	fixtureVotes_Array: Array<fixture>;
}

let fixture_vote_list: fixtureVoteData = {
	fixtureVotes_Array: undefined
};

/**
 * Description:
 * ~~~~~~~~~~~~~~
 * ... initialize the .localStorage();
 * @param {*} key
 * @returns
 */
function createLocalStore(key) {
	const { subscribe, set, update } = writable(fixture_vote_list);

	return {
		subscribe,
		set,
		update,

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * Method to add items to cart,
		 * and updating a particular item's
		 * quantity if it already exists in the
		 * .localStorage() cart-array, otherwise,
		 * simply adds the new item to the cart-array.
		 * [WORKING]
		 *
		 * @param {*} item
		 */
		addToVotes: (fixture_Vote: any) => {
			if (dev) console.log('fixture_Vote', fixture_Vote);

			// get the existing data, stored in the .localStorage();
			const existing: string = localStorage.getItem(key);

			// if `existing data` is `none`, create an array;
			// otherwise, convert the .localStorage() string to an array,
			const existingData: fixtureVoteData = existing
				? JSON.parse(existing)
				: {
						fixtureVotes_Array: []
				  };

			let changed = false;
			let object;

			// search for this item in the cart .localStorage() already;
			const newCartMap = existingData.fixtureVotes_Array.map((p) => {
				// if fixture_id already exists,
				if (p.fixture_id === fixture_Vote.fixture_id) {
					// toggle the `changed` variable to `true`;
					changed = true;
				}
				//
				object =
					p.fixture_id === fixture_Vote.fixture_id
						? {
								...p,
								fixture_vote: fixture_Vote.fixture_vote,
								fixture_vote_val: fixture_Vote.fixture_vote_val
						  }
						: p;
				return object;
			});

			// if the item already exists in the .localStorage();
			if (changed) {
				// update the data with new data;
				existingData.fixtureVotes_Array = newCartMap;
			} else {
				// otherwise, add the new item to the cart-array;
				existingData.fixtureVotes_Array.push(fixture_Vote);
			}

			// save back to .localStorage() as a JSON-string;
			localStorage.setItem(key, JSON.stringify(existingData));

			// update and save the data to set({})
			set(existingData);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * [START]
		 * Method for rendering the .localStorage() form
		 * the start of the page
		 */
		useLocalStorage: () => {
			// reset the writable to the localStorage if localStorage already exists,
			const existing: string = localStorage.getItem(key);

			const existingData: fixtureVoteData = existing
				? JSON.parse(existing)
				: {
						fixtureVotes_Array: []
				  };

			set(existingData);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * Method / function to remove
		 * target item from the basket
		 * [WORKING]
		 *
		 * @param {*} sku_num
		 */
		removeItem: (fixture_Vote) => {
			// ... locate the target SKU value item,
			const existing: string = localStorage.getItem(key);

			const existingData: fixtureVoteData = existing
				? JSON.parse(existing)
				: {
						fixtureVotes_Array: []
				  };

			// iterate over array of cart items,
			let i = 0;

			existingData.fixtureVotes_Array.forEach((element) => {
				// ... remove it from the persistance method,
				if (element.fixture_id === fixture_Vote.fixture_id) {
					existingData.fixtureVotes_Array.splice(i, 1);
				}
				i = i + 1;
			});

			localStorage.setItem(key, JSON.stringify(existingData));

			set(existingData);
		},

		/**
		 * Description:
		 * ~~~~~~~~~~~~~~~~~
		 * Method / function to REMOVE ALL
		 * fixture_id's from the list of voted fixtures,
		 */
		removeAllCartItems: () => {
			localStorage.clear();
			set({
				fixtureVotes_Array: []
			});
		}
	};
}

// ... if .localStorage() has the key then it will be used,
// ... if not the default will be used. Format:
// export const var = createLocalStore(key, default)
export const fixtureVote = createLocalStore('betarena-widget-featured-match');
