// import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		// target: '#svelte',

		// ... adding vercel support ...
		// adapter: vercel()

		// ... NODE-JS deployment Environment ...
		adapter: node(),

    // ... CSP Support
    // ... https://kit.svelte.dev/docs/configuration#csp
    // ... https://github.com/sveltejs/kit/issues/93
    csp: {
      directives: {
        'script-src': ['self', 'unsafe-inline'],
        'object-src': ['none'],
        'base-uri': ['none'],
      }
    }

		// ... vite-FS-issue:
		// ... https://discord.com/channels/457912077277855764/457912077277855766/908213758277607475
		// vite: {
		//     server: {
		//         fs: {
		//             allow: ['..']
		//         }
		//     }
		// }

		// ... @apollo-client - issue FIX;
		// ... https://github.com/apollographql/apollo-client/issues/8218
		// ... https://discord.com/channels/457912077277855764/819723698415599626/821391561429745675
		// ... https://github.com/FormidableLabs/urql/discussions/1664
		// vite: {
		// 	optimizeDeps: {
		// 		exclude: [
		// 			'@apollo/client/core',
		// 			'@apollo/client',
		// 		]
		// 	}
		// }
	}
};

export default config;
