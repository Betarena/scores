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
		target: '#svelte',
		// ... adding vercel support ...
		// adapter: vercel()
		// ... NODE-JS deployment Environment ...
		adapter: node(),
		// ... vite-FS-issue:
		// ... https://discord.com/channels/457912077277855764/457912077277855766/908213758277607475
		// vite: {
        //     server: {
        //         fs: {
        //             allow: ['..']
        //         }
        //     }
        // }
	},
};

export default config;
