// import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {

	// ... ℹ consult https://github.com/sveltejs/svelte-preprocess
	// ... ℹ for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// ... ℹ NODE-JS deployment Environment ...
		// adapter: vercel()
		adapter: node(),

    // ... ℹ SVELTEKIT-MIDDLEWARE-SUPPORT;
    // vite: {
    //   plugins: [myPlugin],
    // },

    // ... ℹ CSP Support - [PROD / HEROKU ONLY]
    // ... https://developers.google.com/tag-platform/tag-manager/web/csp [GOOGLE-CSP]
    // ... https://yandex.com/support/metrica/code/install-counter-csp.html [YANDEX-CSP]
    // ... [https://github.com/sveltejs/kit/issues/4434]
    csp: {
      mode: 'hash', // ... hash | nonce | auto
      directives: {
        // ... ℹ ultimate-default-fallback;
        // 'default-src': [
        //   '*'
        // ],

        // ... ℹ this defines valid sources for JavaScript.
        // ... ℹ falls back to default-src
        // 'script-src': [
        //   // ... ℹ DEV;
        //   'https://localhost:3050/',
        //   'localhost:*',
        //   'localhost',
        //   'http:',
        //   'http://localhost:3050/',
        //   // ... ℹ main;
        //   'self',             // ... ℹ This matches the scheme, origin and port of the document is was served with.
        //   'strict-dynamic',   // ... ℹ This will allow scripts to load their dependencies without them having to be whitelisted.
        //   'unsafe-inline',    // ... ℹ This will allow inline resources such as scripts and styles.
        //   // ... ℹ google;
        //   // 'https://www.googletagmanager.com',
        //   // 'https://www.google-analytics.com',
        //   // 'https://ssl.google-analytics.com',
        //   // ... ℹ firebase;
        //   // 'https://betarena-rv-6b382.firebaseio.com/',
        //   // 'https://*.firebaseio.com',
        //   // ... ℹ yandex;
        //   // 'https://mc.yandex.ru',
        //   // 'https://mc.yandex.az',
        //   // 'https://mc.yandex.by',
        //   // 'https://mc.yandex.co.il',
        //   // 'https://mc.yandex.com',
        //   // 'https://mc.yandex.com.am',
        //   // 'https://mc.yandex.com.ge',
        //   // 'https://mc.yandex.com.tr',
        //   // 'https://mc.yandex.ee',
        //   // 'https://mc.yandex.fr',
        //   // 'https://mc.yandex.kg',
        //   // 'https://mc.yandex.kz',
        //   // 'https://mc.yandex.lt',
        //   // 'https://mc.yandex.lv',
        //   // 'https://mc.yandex.md',
        //   // 'https://mc.yandex.tj',
        //   // 'https://mc.yandex.tm',
        //   // 'https://mc.yandex.ua',
        //   // 'https://mc.yandex.uz',
        //   // 'https://mc.webvisor.com',
        //   // 'https://mc.webvisor.org',
        //   // 'https://yastatic.net',
        // ],
        // 'script-src-elem': ['self', 
        //                     'https://betarena-rv-6b382.firebaseio.com/'],

        // ... ℹ this defines valid sources for stylesheets.
        // ... ℹ falls back to default-src
        'style-src': [
          'self',
          'unsafe-inline',
          'https://fonts.googleapis.com'
        ],

        // ... ℹ this defines valid sources for images to be loaded.
        // ... ℹ falls back to default-src
        'img-src': [
          // ... ℹ domain ORIGIN;
          'self',
          'https://betarena.com',
          'https://*.betarena.com',
          // ... ℹ yandex
          'https://mc.yandex.ru',
          // ... ℹ other
          'https://cdn.sportmonks.com',
          'https://images1-focus-opensocial.googleusercontent.com',
          // ... ℹ google
          'https://www.google-analytics.com',
        ],

        // ... ℹ
        'object-src': [
          'none'
        ],
        // ... ℹ
        'base-uri': [
          'none'
        ],

        // ... ℹ
        // 'connect-src': [
        //   'https://get.geojs.io', 
        //   'https://betarena.hasura.app', 
        //   'https://betarena-rv-6b382.firebaseio.com/',
        //   'https://mc.yandex.ru',
        //   'https://www.google-analytics.com'
        // ],

        // ... ℹ
        // 'child-src': [
        //   'blob: https://mc.yandex.ru'
        // ],

        // ... ℹ
        // 'frame-src': [
        //   'blob: https://mc.yandex.ru'
        // ]
      }
    }
	}
};

export default config;