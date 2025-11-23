// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2025-11-10                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (envrionment)
// │ |: IMPORTANT :: SAFE TO COMMIT TO REPOSITORY
// │ |: Configuration for :: Betarena Scores Project
// ╰──────────────────────────────────────────────────────────────────────────────────╯

type ILoadingType =
  // ╭─────
  // │ NOTE:
  // │ |: No scripts/styles
  // ╰─────
  | 'none'
  // ╭─────
  // │ NOTE:
  // │ |: Purged scripts/styles (critical CSS inlined, rest loaded async)
  // ╰─────
  | 'purged'
  // ╭─────
  // │ NOTE:
  // │ |: Standard scripts/styles
  // ╰─────
  | 'standard'
  // ╭─────
  // │ NOTE:
  // │ |: Locally hosted scripts/styles
  // ╰─────
  | 'local'
  // ╭─────
  // │ NOTE:
  // │ |: 3rd-Party scripts loaded locally
  // ╰─────
  | 'cdn'
  // ╭─────
  // │ NOTE:
  // │ |: 3rd-Party scripts loaded via CDN with Partytown
  // ╰─────
  | 'cdn-partytown'
;

export const config = {
  // ╭─────
  // │ NOTE:
  // │ |: Configuration for Debugging Events
  // ╰─────
  objDebug:
    {
      // ╭─────
      // │ NOTE:
      // │ |: Global Debugging Toggle
      // ┣─────
      // │ |: process.env.VITE_PROD_LOGS === 'true' ? false : true,
      // ╰─────
      isEnabled: false,
      // ╭─────
      // │ NOTE:
      // │ |: List of Segments to Override Debugging
      // ╰─────
      listSegmentsOverrideEnabled:
      [
        'instrumentation.server.middleware.ts',
      ],
      // ╭─────
      // │ NOTE:
      // │ |: Meta Configuration for Debugging Events
      // ╰─────
      objMeta:
      {
        'window.on:resize':
        {
          isEnabled: false,
          strLogPrefix: '🚏 checkpoint ➤ window.on:resize(..) event fired',
        },
        'document.on:visibilitychange':
        {
          isEnabled: false,
          strLogPrefix: '🚏 checkpoint ➤ document.on:visibilitychange(..) event fired',
        },
      }
    },
  // ╭─────
  // │ NOTE:
  // │ |: Configuration for Application Features & Services
  // ╰─────
  objApp:
    {
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 💠 │ WEB-WORKERS / SERVICE-WORKERS                                               │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯
      // ╭─────
      // │ NOTE:
      // │ |: Enable Service Worker for PWA Functionality
      // ┣─────
      // │ |: WARNING:
      // │ |: production ➤ 'true'
      // ╰─────
      isServiceWorkerEnabled: false,
      // ╭─────
      // │ NOTE:
      // │ |: Configuration Settings for :: Partytown
      // ╰─────
      objServiceWorkerPartytown:
        {
          // ╭─────
          // │ NOTE:
          // │ |: Toggle (enable/disable)
          // ┣───
          // │ |: WARNING:
          // │ |: production ➤ 'true'
          // ╰─────
          isEnabled: true,
          // ╭─────
          // │ NOTE:
          // │ |: Partytown Configuration Code Sample
          // │ |: Injected in HTML Head
          // ╰─────
          strCodeSampleForPartytownConfig: `
            <script>
              partytown = {
                resolveUrl: function (url, location, type)
                {
                  if (url.hostname === "connect.facebook.net")
                  {
                    var proxyUrl = new URL('https://staging.betarena.com/partytown-proxy');
                    proxyUrl.search = 'url=' + url.href;
                    console.log('Partytown Proxy URL:', proxyUrl.href);
                    return proxyUrl;
                  }
                  return url;
                },
                forward:
                [
                  'fbq',
                  'gtag',
                  'dataLayer.push',
                  // 'Intercom',
                ],
              };
            </script>
          `,
        },
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 💠 │ 3RD-PARTY SERVICES                                                          │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯
      // ╭─────
      // │ NOTE:
      // │ |: Configuration Settings for :: Intercom
      // ╰─────
      objServiceIntercom:
        {
          // ╭─────
          // │ NOTE:
          // │ |: Intercom Integration Toggle (enable/disable)
          // ┣───
          // │ |: WARNING:
          // │ |: production ➤ 'true'
          // ╰─────
          isEnabled: true,
          // ╭─────
          // │ NOTE:
          // │ |: Intercom Configuration Code Sample
          // │ |: Injected in HTML Head
          // ╰─────
          strInjectionCode: `
            <script
              async
              defer
              src="/scripts/service.intercom.js"
            >
            </script>
          `,
        },
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 💠 │ MISCELLENOUS                                                                │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯
      // ╭─────
      // │ NOTE:
      // │ |: Configuration Settings for :: Betarena/Ad-Engine
      // ┣─────
      // │ |: WARNING:
      // │ |: production ➤ 'true'
      // ╰─────
      isBetareAgEngineEnabled: true,
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 💠 │ CONFIGURATION BY COMPONENT                                                  │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯
      // ╭─────
      // │ NOTE:
      // │ |: Configuration Settings for :: Components
      // ╰─────
      objComponentConfiguration: new Map
        (
          [
            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 📌 │ SVELTEKIT // HOOKS                                                          │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯
            [
              'src/hooks.server.ts',
              {
                // ╭──────────────────────────────────────────────────────────────────────────────────╮
                // │ 💠 │ configuration                                                               │
                // ╰──────────────────────────────────────────────────────────────────────────────────╯
                // ╭─────
                // │ NOTE:
                // │ |: Debug Level for Hook Operations
                // ╰─────
                isDebugEnabled: false,
                // ╭─────
                // │ NOTE:
                // │ |: Custom Error Object for Hook Operations
                // ╰─────
                objError:
                  {
                    errorId: '500',
                    message: 'Whoops!',
                  } as App.Error,
                // ╭─────
                // │ NOTE:
                // │ |: Holds target `component(s)` of dynamic nature.
                // ╰─────
                mapStrDebugPreifix: new Map <
                    | 'customErrorHandler',
                    string
                  >
                  (
                    [
                      [ 'customErrorHandler', '🚏 checkpoint ➤ Hooks | src/hooks.server.ts customErrorHandler(..)' ],
                    ]
                  ),
                // ╭─────
                // │ NOTE:
                // │ |: Performance Threshold in ms for Hook Operations
                // ╰─────
                intPerformanceThresholdMs: 1,
                // ╭──────────────────────────────────────────────────────────────────────────────────╮
                // │ 💠 │ configuration // resolve.preload(..)                                        │
                // ╰──────────────────────────────────────────────────────────────────────────────────╯
                // ╭─────
                // │ NOTE:
                // │ |: Enable Preload for 'link rel=preload' tags
                // ╰─────
                isPreload: false,
                // ╭──────────────────────────────────────────────────────────────────────────────────╮
                // │ 💠 │ configuration // resolve.transformPageChunk(..)                             │
                // ╰──────────────────────────────────────────────────────────────────────────────────╯
                // ╭─────
                // │ NOTE:
                // │ |: AB-Testing Injection Configuration of HTML Head Links
                // ╰─────
                objHtmlHeadABTestingInjection:
                  {
                    // ╭─────
                    // │ NOTE:
                    // │ |: Enable inline HTML head links injection
                    // ┣─────
                    // │ |: EXAMPLE
                    // │ <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" />
                    // │ becomes:
                    // │ <style> {inlined CSS content} </style>
                    // ╰─────
                    isInjectionEnabled: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Skip (exlcude) matching '<head> <link href="{.}" >' parsing
                    // ╰─────
                    setInjectionLinkHrefExclude: new Set
                    (
                      [
                        'https://fonts.googleapis.com/', // google fonts
                        '__app-styles', // custom identifier to exclude app styles
                      ]
                    ),
                    // ╭─────
                    // │ NOTE:
                    // │ |: Enable Inline Single Line Styles Injection (compression-js-logic)
                    // ╰─────
                    isInjectionInlineSingleLineEnabled: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Enable Inline Head Styles Injection (compression-js-logic)
                    // ┣─────
                    // │ WARNING:
                    // │ |: This means, compressed injection will ONLY resolve at 'document-load-time' (client-side).
                    // ╰─────
                    isInjectionCompressed: false,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Skip (exclude) Target Head Styles from Inline Compression
                    // ╰─────
                    setInjectionCompressedExclude: new Set
                    (
                      [
                        '__app-styles'
                      ]
                    ),
                    // ╭─────
                    // │ NOTE:
                    // │ |: Enable Image Preload Injection in HTML Head
                    // ╰─────
                    isInjectionImagePreload: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: Website Stylesheets
                    // ╰─────
                    stylesheets:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Stylesheets
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'purged'    :: Purged stylesheets (critical CSS inlined, rest loaded async)
                      // │ |: -> 'standard'  :: Standard stylesheets
                      // ╰─────
                      strLoadingType: 'purged' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: WEBSITE-STYLESHEETS :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'purged': `
                          <link
                            href="css/app.purged.clean.css"
                            rel="stylesheet"
                            text="text/css"
                          />
                        `,
                        'standard': `
                          <link
                            href="app.css"
                            rel="stylesheet"
                            text="text/css"
                          />
                        `,
                      }
                    },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: Website Fonts
                    // ╰─────
                    fonts:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Fonts
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'local' :: Locally hosted fonts
                      // │ |: -> 'cdn'   :: 3rd-Party fonts loaded via CDN
                      // ╰─────
                      strLoadingType: 'cdn' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: WEBSITE-FONTS :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'local': `
                          <link
                            href="template/html.head.fonts.local.html"
                          />
                        `,
                        'cdn': `
                          <link
                            href="template/html.head.fonts.cdn.html"
                          />
                        `,
                      }
                    },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: Google-Tag-Manager
                    // ╰─────
                    googleTagManager:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Fonts
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'local'         :: Locally hosted scripts
                      // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                      // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                      // ╰─────
                      strLoadingType: 'cdn-partytown' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-GOOGLE-ANALYTICS :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'local': `
                          <link
                            href="scripts/service.googletagmanager.js"
                            as="script"
                          />
                        `,
                        'cdn': `
                          <link
                            href="template/html.head.googletagmanager.cdn.html"
                          />
                        `,
                        'cdn-partytown': `
                          <link
                            href="template/html.head.googletagmanager.cdn.partytown.html"
                          />
                        `,
                      } as Record<ILoadingType, string>,
                    },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: Twitter
                    // ╰─────
                    twitter:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Fonts
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'local'         :: Locally hosted scripts
                      // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                      // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                      // ╰─────
                      strLoadingType: 'cdn-partytown' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-TWITTER :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'local': `
                          <link
                            href="scripts/service.twitter.js"
                            as="script"
                          />
                        `,
                        'cdn': `
                          <link
                            href="template/html.head.twitter.cdn.html"
                          />
                        `,
                        'cdn-partytown': `
                          <link
                            href="template/html.head.twitter.cdn.partytown.html"
                          />
                        `,
                      } as Record<ILoadingType, string>,
                    },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: PostHog
                    // ╰─────
                    posthog:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Fonts
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'local'         :: Locally hosted scripts
                      // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                      // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                      // ╰─────
                      strLoadingType: 'cdn-partytown' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-POSTHOG :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'cdn': `
                          <link
                            href="template/html.head.posthog.cdn.html"
                          />
                        `,
                        'cdn-partytown': `
                          <link
                            href="template/html.head.posthog.cdn.partytown.html"
                          />
                        `,
                      } as Record<ILoadingType, string>,
                    },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: Facebook
                    // ╰─────
                    facebook:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Fonts
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'local'         :: Locally hosted scripts
                      // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                      // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                      // ╰─────
                      strLoadingType: 'cdn-partytown' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-FACEBOOK :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'cdn': `
                          <link
                            href="template/html.head.facebook.cdn.html"
                          />
                        `,
                        'cdn-partytown': `
                          <link
                            href="template/html.head.facebook.cdn.partytown.html"
                          />
                        `,
                      } as Record<ILoadingType, string>,
                    },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: LinkedIn
                    // ╰─────
                    linkedin:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Fonts
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'local'         :: Locally hosted scripts
                      // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                      // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                      // ╰─────
                      strLoadingType: 'cdn-partytown' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-LINKEDIN :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'cdn': `
                          <link
                            href="template/html.head.linkedin.cdn.html"
                          />
                        `,
                        'cdn-partytown': `
                          <link
                            href="template/html.head.linkedin.cdn.partytown.html"
                          />
                        `,
                      } as Record<ILoadingType, string>,
                    },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: Intercom
                    // ╰─────
                    intercom:
                    {
                      // ╭─────
                      // │ NOTE:
                      // │ |: Toggle Loading Type for Website Fonts
                      // ╰─────
                      isEnabled: true,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Type Options:
                      // │ |: -> 'local'         :: Locally hosted scripts
                      // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                      // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                      // ╰─────
                      strLoadingType: 'cdn-partytown' as ILoadingType,
                      // ╭─────
                      // │ NOTE:
                      // │ |: HTML Head Injection Point Identifier
                      // ╰─────
                      strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-INTERCOM :: INJECTED HERE DYNAMICALLY -->`,
                      // ╭─────
                      // │ NOTE:
                      // │ |: Loading Options for Website Stylesheets
                      // ╰─────
                      objLoadingOptions:
                      {
                        'cdn': `
                          <link
                            href="template/html.head.intercom.cdn.html"
                          />
                        `,
                        'cdn-partytown': `
                          <link
                            href="template/html.head.intercom.cdn.partytown.html"
                          />
                        `,
                      } as Record<ILoadingType, string>,
                    },
                    // TODO: implement progressier
                    // progressier:
                  },
                // ╭──────────────────────────────────────────────────────────────────────────────────╮
                // │ 💠 │ configuration // resolve.setHeaders(..)                                     │
                // ╰──────────────────────────────────────────────────────────────────────────────────╯
                // ╭─────
                // │ NOTE:
                // │ |: Enable setting 'Cookie' headers
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isHeadersCookieEnabled: true,
              }
            ],
            [
              'src/hooks.client.ts',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Custom Error Object for Hook Operations
                // ╰─────
                objError:
                  {
                    errorId: '500',
                    message: 'Whoops! Client error found!',
                  } as App.Error,
                // ╭─────
                // │ NOTE:
                // │ |: Holds target `component(s)` of dynamic nature.
                // ╰─────
                mapStrDebugPreifix: new Map <
                    | 'customErrorHandler',
                    string
                  >
                  (
                    [
                      [ 'customErrorHandler', '🚏 checkpoint ➤ Hooks | src/hooks.client.ts customErrorHandler(..)' ],
                    ]
                  )
              }
            ],
            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 🤖 │ SVELTEKIT // LAYOUTS - PAGES                                                │
            // ┣──────────────────────────────────────────────────────────────────────────────────┫
            // │ ℹ️ set 'isSsr' to 'false' to disable 'Server-Side-Rendering' (no load()) on route│
            // │ │-> Affects SEO negatively & worsens lighthouse score                            │
            // │ ℹ️ set 'isCsr' to 'false' to disable 'Client-Side-Rendering' (no JS) on route    │
            // │ │-> Improves Performance for User (avg. 90 score on lighthouse performance)      │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯
            [
              'src/routes/(authors)/a/[...permalink]/+page.server.ts',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Configuration for SvelteKit Rendering Options
                // ╰─────
                objSveltekitOptions:
                  {
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle 'SERVER-SIDE-RENDERING' for route
                    // ╰─────
                    isSsr: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle 'SERVER-SIDE-RENDERING' for route
                    // ╰─────
                    isCsr: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle 'SERVER-SIDE-RENDERING' for route
                    // ╰─────
                    isPrerender: false,
                  }
              }
            ],
            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 📌 │ SVELTE // LAYOUTS - PAGES                                                   │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯
            [
              'src/routes/+layout.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'DYNAMIC-IMPORT' svelte component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'HIDDEN' state for component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isHidden: false,
                // ╭─────
                // │ NOTE:
                // │ |: Holds target `component(s)` of dynamic nature.
                // ╰─────
                mapStrDebugPreifix: new Map <
                    | 'beforeNavigate'
                    | 'afterNavigate',
                    string
                  >
                  (
                    [
                      [ 'beforeNavigate', '🚏 checkpoint ➤ src/routes/+layout.svelte beforeNavigate(..)' ],
                      [ 'afterNavigate', '🚏 checkpoint ➤ src/routes/+layout.svelte afterNavigate(..)' ]
                    ]
                  )
              }
            ],
            [
              'src/routes/(authors)/a/[...permalink]/+page.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'DYNAMIC-IMPORT' svelte component
                // ┣───
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'HIDDEN' state for component
                // ┣───
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isHidden: false,
              }
            ],
            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 💠 │ SVELTE // COMPONENTS                                                        │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯
            [
              'src/lib/components/misc/Splash-Screen.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'DYNAMIC-IMPORT' svelte component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'HIDDEN' state for component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isHidden: true,
              }
            ],
            [
              'src/lib/components/misc/banner/Banner-Offline-Alert.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'DYNAMIC-IMPORT' svelte component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isDynamicImport: true,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'HIDDEN' state for component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isHidden: false,
              }
            ],
            [
              'src/lib/components/misc/banner/Banner-Platform-Alert.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'DYNAMIC-IMPORT' svelte component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isDynamicImport: true,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'HIDDEN' state for component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isHidden: false,
              }
            ],
            [
              'src/lib/components/misc/modal/Modal-Email-Subscribe.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'DYNAMIC-IMPORT' svelte component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isDynamicImport: true,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'HIDDEN' state for component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isHidden: false,
              }
            ],
            [
              'src/lib/components/section/authors/page/author/content/Author-Widget.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: Metadata for component
                // ╰─────
                objMeta:
                {
                  cname: 'page/author/content/author-widget',
                  // intDeviceThresholdsInPx: [ 575, 1160 ],
                },
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'DYNAMIC-IMPORT' svelte component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'HIDDEN' state for component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'false'
                // ╰─────
                isHidden: false,
                // ╭─────
                // │ NOTE:
                // │ |: Toggle 'SEO-BOX' svelte component
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 'true'
                // ╰─────
                isSeoBoxEnabled: true,
                // ╭─────
                // │ NOTE:
                // │ |: Component Configuration Version
                // ┣─────
                // │ |: WARNING:
                // │ |: production ➤ 1
                // ┣─────
                // │ |: Available Versions:
                // │ │: 1 - Initial Version, without {#await} blocks for data fetching
                // │ │: 2 - Added {#await} blocks for (ready) data fetching
                // ╰─────
                intComponentConfigVersion: 1,
              }
            ]
          ]
        )
    },
}