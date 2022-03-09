// import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

// /** @type {import('vite').Plugin} */
// const myPlugin = {
//   name: 'log-request-middleware',
//   configureServer(server) {

//     server.middlewares.use((req, res, next) => {
//       console.log(`Got request ${req.url}`);
//       next();
//     });

//     // ... ℹ https://jaketrent.com/post/https-redirect-node-heroku
//     server.middlewares.use((req, res, next) => {
//       if (req.header('x-forwarded-proto') !== 'https')
//         res.redirect(`https://${req.header('host')}${req.url}`);
//       else
//         next();
//     });

//     // server.middlewares.get('/healthcheck', (req, res) => {
//     //   res.end('ok');
//     // });

//   }
// };

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

    // vite: {
    //   plugins: [myPlugin],
    // },

    // ... CSP Support - [PROD / HEROKU ONLY]
    // ... https://kit.svelte.dev/docs/configuration#csp
    // ... https://github.com/sveltejs/kit/issues/93
    // ...
    // ... https://developers.google.com/tag-platform/tag-manager/web/csp [GOOGLE-CSP]
    // ... https://yandex.com/support/metrica/code/install-counter-csp.html [YANDEX-CSP]
    // ...
    // ... [HELP] - https://stackoverflow.com/questions/30939809/google-analytics-js-and-content-security-policy
    // ... [INFO] - https://web.dev/strict-csp/
    // ... [HELP] - https://stackoverflow.com/questions/31211359/refused-to-load-the-script-because-it-violates-the-following-content-security-po
    // ... [HELP] - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
    // ... [INFO] - https://stackoverflow.com/questions/42922784/what-s-the-purpose-of-the-html-nonce-attribute-for-script-and-style-elements
    // ... [INFO] - https://developers.google.com/web/fundamentals/security/csp/#inline_code_is_considered_harmful
    csp: {
      mode: 'nonce',
      directives: {
        // 'default-src': ['*'],        // ... ultimate-default-fallback;
        // 'script-src-elem': ['self', 
        //                     'https://betarena-rv-6b382.firebaseio.com/'],
        'script-src': ['self', 
                       'strict-dynamic',
                      'unsafe-inline', 
                      'https://www.googletagmanager.com',
                      'https://www.google-analytics.com',
                      'https://ssl.google-analytics.com',
                      'https://betarena-rv-6b382.firebaseio.com/',
                      '*.firebaseio.com',
                      'https://mc.yandex.ru',
                      'https://yastatic.net'], 
        'style-src': ['self',
                      'unsafe-inline',
                      'https://fonts.googleapis.com'],
        'object-src': ['none'],
        'base-uri': ['none'],
        // 'img-src': ['http://*', 
        //             'https://*'],
        // 'connect-src': ['https://get.geojs.io', 
        //                 'https://betarena.hasura.app', 
        //                 'https://betarena-rv-6b382.firebaseio.com/']
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