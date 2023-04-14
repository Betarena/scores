import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// [ℹ] consult https://github.com/sveltejs/svelte-preprocess
	// [ℹ] for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: node(),

    // TODO:
    //#region => CSP (CONFIG) (DISABLED) DOC: REF:[7]

    // NOTE: 'none'	No URLs match.
    // NOTE: 'self'	Refers to the origin site with the same scheme and port number.
    // NOTE: 'unsafe-inline'	Allows the usage of inline scripts or styles.
    // NOTE: 'unsafe-eval'	Allows the usage of eval in scripts.
    // NOTE: 'strict-dynamic'	Informs the browser to trust scripts originating from a root trusted script.

    csp: {
      // [ℹ] hash | nonce | auto
      mode: 'hash',
      directives: {

        // NOTE: is a fallback directive for 
        // the other fetch directives. 
        // Directives that are specified have no 
        // inheritance, yet directives that 
        // are not specified will fall
        // back to the value of default-src.
        'default-src': [
          'self'
        ],

        // NOTE: specifies the locations 
        // from which a script can be 
        // executed from. It is a 
        // fallback directive for other 
        // script-like directives.
        // NOTE: (fallback) -> "default-src"
        'script-src': [
          // [ℹ] development [?];
          // 'https://localhost:3050',
          // 'localhost:*',
          // 'localhost',
          // 'http:',
          // 'http://localhost:3050',
          // [ℹ] main;
          'self',
          'unsafe-inline',
          // 'strict-dynamic',
          // head/script;
          'sha256-A0taZ9Co+tPBq31X8eVCofVvkCzuGw42/YS33C0hXps=', // -> smartlook [#1]
          'sha256-B7gB23m9e7SQIsiYTKcvqLZrER3W1JqURnaN8Jn3Zx0=', // -> google [#2]
          // [ℹ] google/firebase;
          'https://www.googletagmanager.com',
          'https://*.google-analytics.com', // NOTE: (catch-all)
          'https://apis.google.com',
          'https://betarena-rv-6b382.firebaseio.com',
          'https://*.firebaseio.com', // NOTE: (catch-all)
          // [ℹ] smartlook;
          'https://web-sdk.smartlook.com',
          // [ℹ] yandex (csp);
          'https://mc.yandex.ru',
          'https://mc.yandex.az',
          'https://mc.yandex.by',
          'https://mc.yandex.co.il',
          'https://mc.yandex.com',
          'https://mc.yandex.com.am',
          'https://mc.yandex.com.ge',
          'https://mc.yandex.com.tr',
          'https://mc.yandex.ee',
          'https://mc.yandex.fr',
          'https://mc.yandex.kg',
          'https://mc.yandex.kz',
          'https://mc.yandex.lt',
          'https://mc.yandex.lv',
          'https://mc.yandex.md',
          'https://mc.yandex.tj',
          'https://mc.yandex.tm',
          'https://mc.yandex.ua',
          'https://mc.yandex.uz',
          'https://mc.webvisor.com',
          'https://mc.webvisor.org',
          'https://yastatic.net'
        ],
        // 'script-src-elem': [
        //   'self', 
        //   'https://betarena-rv-6b382.firebaseio.com/'
        // ],

        // NOTE: controls from where styles get 
        // applied to a document. This includes 
        // <link> elements, @import rules, 
        // and requests originating from 
        // a Link HTTP response header field.
        // NOTE: (fallback) -> "default-src"
        'style-src': [
          'self',
          'unsafe-inline',
          'https://fonts.googleapis.com'
        ],

        // NOTE: specifies the URLs that 
        // images can be loaded from;
        // [ℹ] (fallback) -> "default-src"
        'img-src': [
          // [ℹ] origin/self;
          'self',
          'data:',
          'blob:',
          'filesystem:',
          'mediastream:',
          'https://betarena.com',
          'https://*.betarena.com',
          // [ℹ] yandex;
          'https://mc.yandex.ru',
          // [ℹ] other;
          'https://cdn.sportmonks.com',
          'https://images1-focus-opensocial.googleusercontent.com',
          // [ℹ] google;
          'https://www.google-analytics.com',
          'https://www.google.com',
          'https://firebasestorage.googleapis.com',
          'https://lh3.googleusercontent.com/',
        ],

        'frame-src': [
          'self',
          // [ℹ] google/firebase;
          'https://betarena-ios.firebaseapp.com',
          'https://*.firebaseio.com' // (catch-all)
          // [ℹ] yandex;
          // 'blob: https://mc.yandex.ru'
        ],

        // NOTE: specifies which URLs to 
        // load fonts from;
        'font-src': [
          'self', 
          // 'data:',
          // [ℹ] google/firebase;
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ],

        // NOTE: provides control over 
        // fetch requests, XHR, 
        // eventsource, beacon and 
        // websockets connections;
        'connect-src': [
          'self',
          // [ℹ] geo-js;
          'https://get.geojs.io',
          // [ℹ] hasura;
          'https://betarena.hasura.app', 
          // [ℹ] google/firebase;
          'https://betarena-rv-6b382.firebaseio.com',
          'wss://*.firebaseio.com', // NOTE: (catch-all)
          'https://*.firebaseio.com', // NOTE: (catch-all)
          'https://www.google-analytics.com',
          'https://identitytoolkit.googleapis.com',
          'https://firestore.googleapis.com',
          'https://stats.g.doubleclick.net',
          'https://securetoken.googleapis.com',
          'https://firebasestorage.googleapis.com',
          'https://lh3.googleusercontent.com/',
          // [ℹ] smartlook;
          'https://manager.eu.smartlook.cloud', // (safari-only)
          'https://web-writer.eu.smartlook.cloud',
          // [ℹ] yandex;
          'https://mc.yandex.ru',
        ],

        // [ℹ] ???
        'object-src': [
          'none'
        ],
        // [ℹ] ???
        'base-uri': [
          'none'
        ],
        // [ℹ] ???
        'worker-src': [
          'self'
        ],
        // [ℹ] ???
        'manifest-src': [
          'self'
        ],
        // [ℹ] ???
        // 'child-src': [
        //   'blob: https://mc.yandex.ru'
        // ],

      }
    }
    
    //#endregion => CSP (CONFIG) (DISABLED)
	}
};
export default config;