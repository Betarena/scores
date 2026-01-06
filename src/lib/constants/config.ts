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
  | 'local-mini'
  | 'local.v2'
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
  | 'cdn-partytown-fix'
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
      // │ |: "env/production/typical" :: true
      // ╰─────
      isServiceWorkerEnabled: false,
      // ╭─────
      // │ NOTE:
      // │ |: Configuration Settings for :: Partytown
      // ╰─────
      objServiceWorkerPartytown:
        (
        ) =>
        {
          return {
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
                      var proxyUrl = new URL('https://betarena.com/partytown-proxy');
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
                    // 'Intercom', // uncomment if 'cdn-partytown' loading is used for Intercom
                  ],
                };
              </script>
            `,
          }
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
          // ┣─────
          // │ |: "env/production/typical" :: true
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
      // │ |: "env/production/typical" :: true
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
                // │ |: Enable Preload for '<link rel=preload [..]>' tags
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
                    // │ |: Toggle inline HTML <head> resource link(s) injection
                    // ┣─────
                    // │ EXAMPLE [0]
                    // │  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" />
                    // │    ⬇becomes⬇
                    // │  <style> {inlined CSS content} </style>
                    // ┣─────
                    // │ NOTE:
                    // │ |: Needed to reduce number of HTTP requests for resources.
                    // ╰─────
                    isInjectionEnabled: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Skip (exclude) injection of matching '<link href="*" [..]>'
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
                    // │ |: Toggle inline single line injection
                    // ┣─────
                    // │ EXAMPLE [0]
                    // │  removes line breaks (\n) from inlined styles
                    // ┣─────
                    // │ WARNING: [disabled] [enabling will not do anything]
                    // ╰─────
                    isInjectionInlineSingleLineEnabled: false,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle inline Head Styles Injection (compression-js-logic)
                    // ┣─────
                    // │ EXAMPLE [0]
                    // │  <style> {inlined CSS content} </style>
                    // │    ⬇becomes⬇
                    // │  <style> {inlined CSS content (compressed)} </style>
                    // ┣─────
                    // │ NOTE: WARNING:
                    // │ |: Compressed injection will ONLY resolve at 'document-load-time' (client-side-rendering).
                    // │ |: This may cause FOUC (Flash of Unstyled Content) in some cases.
                    // ╰─────
                    isInjectionCompressed: false,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Skip (exclude) compression of matching '<link href="*" [..]>'
                    // ╰─────
                    setInjectionCompressedExclude: new Set
                      (
                        [
                          '__app-styles'
                        ]
                      ),
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle image preload injection in HTML Head
                    // ┣─────
                    // │ EXAMPLE [0]
                    // │  loop over ALL '<img src="*">' tags found in 'pre-loaded' data & inject as 'preload' links.
                    // │    ⬇becomes⬇
                    // │  <link rel="preload" as="image" href="*" fetchpriority="high" />
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
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: true,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'purged'    :: Purged stylesheets (critical CSS inlined, rest loaded async)
                        // │ |: -> 'standard'  :: Standard stylesheets
                        // ╰─────
                        strLoadingType: 'purged' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: WEBSITE-STYLESHEETS :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
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
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: true,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'local' :: Locally hosted fonts
                        // │ |: -> 'local-mini' :: Locally hosted fonts (mini version)
                        // │ |: -> 'cdn'   :: 3rd-Party fonts loaded via CDN
                        // ╰─────
                        strLoadingType: 'local-mini' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: WEBSITE-FONTS :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
                        // ╰─────
                        objLoadingOptions:
                        {
                          'local': `
                            <link
                              href="template/html.head.fonts.local.html"
                            />
                          `,
                          'local-mini': `
                              <link
                                href="template/html.head.fonts.local.mini.html"
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
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: true,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
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
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: true,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'local'         :: Locally hosted scripts
                        // │ |: -> 'local.v2'      :: Locally hosted scripts (version 2)
                        // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                        // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                        // │ |: -> 'cdn-partytown-fix' :: 3rd-Party scripts loaded via CDN with Partytown (fixed)
                        // ╰─────
                        strLoadingType: 'local.v2' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-TWITTER :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
                        // ╰─────
                        objLoadingOptions:
                        {
                          'local': `
                            <link
                              href="scripts/service.twitter.js"
                              as="script"
                            />
                          `,
                          'local.v2': `
                            <link
                              href="template/html.head.twitter.local.html"
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
                          'cdn-partytown-fix': `
                          <link
                            href="template/html.head.twitter.cdn.partytown.fix.html"
                          />
                        `
                        } as Record < ILoadingType, string >,
                      },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: PostHog
                    // ╰─────
                    posthog:
                      {
                        // ╭─────
                        // │ NOTE:
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: false,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                        // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                        // ╰─────
                        strLoadingType: 'cdn-partytown' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-POSTHOG :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
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
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: true,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                        // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                        // ╰─────
                        strLoadingType: 'cdn-partytown' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-FACEBOOK :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
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
                        } as Record < ILoadingType, string >,
                      },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: LinkedIn
                    // ╰─────
                    linkedin:
                      {
                        // ╭─────
                        // │ NOTE:
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: true,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                        // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                        // ╰─────
                        strLoadingType: 'cdn-partytown' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-LINKEDIN :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
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
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: false,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                        // │ |: -> 'cdn-partytown' :: 3rd-Party scripts loaded via CDN with Partytown
                        // ╰─────
                        strLoadingType: 'cdn-partytown' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-INTERCOM :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
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
                        } as Record < ILoadingType, string >,
                      },
                    // ╭─────
                    // │ NOTE:
                    // │ |: Dynamic Server Injection for :: PWA
                    // ╰─────
                    pwa:
                      {
                        // ╭─────
                        // │ NOTE:
                        // │ |: toggle injection
                        // ╰─────
                        isEnabled: true,
                        // ╭─────
                        // │ NOTE:
                        // │ |: select injection option
                        // ┣─────
                        // │ |: Available Options:
                        // │ |: -> 'cdn'           :: 3rd-Party scripts loaded via CDN
                        // ╰─────
                        strLoadingType: 'cdn' as ILoadingType,
                        // ╭─────
                        // │ NOTE: IMPORTANT
                        // │ |: HTML Head Injection Point Identifier
                        // ╰─────
                        strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: WEBSITE-PWA :: INJECTED HERE DYNAMICALLY -->`,
                        // ╭─────
                        // │ NOTE:
                        // │ |: loading options, determined by 'strLoadingType'
                        // ╰─────
                        objLoadingOptions:
                        {
                          'cdn': `
                            <link
                              href="template/html.head.pwa.cdn.html"
                            />
                          `,
                        } as Record < ILoadingType, string >,
                      }
                  },
                // ╭──────────────────────────────────────────────────────────────────────────────────╮
                // │ 💠 │ configuration // resolve.setHeaders(..)                                     │
                // ╰──────────────────────────────────────────────────────────────────────────────────╯
                // ╭─────
                // │ NOTE:
                // │ |: Enable setting 'Cookie' headers
                // ┣─────
                // │ |: "env/production/typical" :: true
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
                // │ |: sveltekit route :: configuration
                // ╰─────
                objSveltekitOptions:
                  {
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle 'server-side-redndering'
                    // ╰─────
                    isSsr: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle 'client-side-rendering'
                    // ╰─────
                    isCsr: true,
                    // ╭─────
                    // │ NOTE:
                    // │ |: Toggle 'pre-rendering'
                    // ╰─────
                    // isPrerender: false,
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
                // │ |: svelte component :: toggle 'hidden' state
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle 'hidden' state
                // ╰─────
                isHidden: false,
                // ╭─────
                // │ NOTE:
                // │ |: Delay in ms before initializing Betarena/Ad-Engine
                // │ WARNING:
                // │ |: This is a global delay affecting ALL Ad units on the website.
                // ┣─────
                // │ |: "env/production/typical" :: 10000 ms
                // ╰─────
                intBetarenaAdEngineDelayMs: 10000,
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
                // │ |: svelte component :: toggle use of 'dynamic-import'
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle 'hidden' state
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
                // │ |: svelte component :: toggle use of 'dynamic-import'
                // ┣─────
                // │ |: "env/production/typical" :: true
                // ┣─────
                // │ |: TODO:
                // │ |: enable (1) dynamic import and (2) test performance impact
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle 'hidden' state
                // ┣─────
                // │ |: "env/production/typical" :: false
                // ┣─────
                // │ |: NOTE:
                // │ |: ⫸ true [⭐️]
                // │ |:   ↳ [0] Hidden to avoid Flash of Splash Screen.
                // │ |:   ↳ [1] Showed improvement in lighthouse performance score
                // ╰─────
                isHidden: true,
              }
            ],
            [
              'src/lib/components/misc/banner/Banner-Offline-Alert.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle use of 'dynamic-import'
                // ┣─────
                // │ |: "env/production/typical" :: true
                // ┣─────
                // │ |: TODO:
                // │ |: disable (1) dynamic import and (2) test performance impact
                // ╰─────
                isDynamicImport: true,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle 'hidden' state
                // ╰─────
                isHidden: false,
              }
            ],
            [
              'src/lib/components/misc/banner/Banner-Platform-Alert.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle use of 'dynamic-import'
                // ┣─────
                // │ |: "env/production/typical" :: true
                // ┣─────
                // │ |: TODO:
                // │ |: disable (1) dynamic import and (2) test performance impact
                // ╰─────
                isDynamicImport: true,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle 'hidden' state
                // ╰─────
                isHidden: false,
              }
            ],
            [
              'src/lib/components/misc/modal/Modal-Email-Subscribe.svelte',
              {
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle use of 'dynamic-import'
                // ┣─────
                // │ |: "env/production/typical" :: true
                // ┣─────
                // │ |: TODO:
                // │ |: disable (1) dynamic import and (2) test performance impact
                // ╰─────
                isDynamicImport: true,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle 'hidden' state
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
                // │ |: svelte component :: toggle use of 'dynamic-import'
                // ┣─────
                // │ |: "env/production/typical" :: false
                // ┣─────
                // │ |: TODO:
                // │ |: enable (1) dynamic import and (2) test performance impact
                // ╰─────
                isDynamicImport: false,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle 'hidden' state
                // ╰─────
                isHidden: false,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: toggle use of 'SEO-BOX'
                // ┣─────
                // │ |: "env/production/typical" :: TRUE/FALSE
                // ┣─────
                // │ |: IMPORTANT CRITICAL
                // │ |: depends_on 'intComponentConfigVersion':
                // │ |: ⫸ 'intComponentConfigVersion == 1' supports 'isSeoBoxEnabled == false' [⭐️]
                // │ |: ⫸ 'intComponentConfigVersion == 2' requires 'isSeoBoxEnabled == true' to function properly
                // ╰─────
                isSeoBoxEnabled: false,
                // ╭─────
                // │ NOTE:
                // │ |: svelte component :: component configuration version
                // ┣─────
                // │ |: "env/production/typical" :: 1 [⭐️]
                // ┣─────
                // │ |: Available Options:
                // │ │: 1 - (best) [⭐️] skips use of {#await} blocks for 'data-fetching/processing'
                // │ │: 2 - (original configuration) uses {#await} blocks for 'data-fetching/processing'
                // ╰─────
                intComponentConfigVersion: 1,
              }
            ]
          ]
        )
    },
}