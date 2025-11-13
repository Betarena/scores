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
// │ |: Configuration for Betarena About Project
// ╰──────────────────────────────────────────────────────────────────────────────────╯

type ILoadingType =
  | 'none'
  // ╭─────
  // │ NOTE:
  // │ |:
  // ╰─────
  | 'purged'
  // ╭─────
  // │ NOTE:
  // │ |:
  // ╰─────
  | 'standard'
  // ╭─────
  // │ NOTE:
  // │ |:
  // ╰─────
  | 'local'
  // ╭─────
  // │ NOTE:
  // │ |:
  // ╰─────
  | 'cdn'
  // ╭─────
  // │ NOTE:
  // │ |:
  // ╰─────
  | 'cdn-partytown'
;

export const config = {
  // ╭─────
  // │ NOTE:
  // │ |: Toggle 'countdown' component
  // ┣───
  // │ |: WARNING:
  // │ |: [production] => true
  // ╰─────
  objDebug:
  {
    isEnabled: false,
      // process.env.VITE_PROD_LOGS === 'true'
      //   ? false
      //   : true,
    listSegmentsOverrideEnabled:
    [
      'instrumentation.server.middleware.ts',
    ]
  },
  // ╭─────
  // │ NOTE:
  // │ |: Toggle 'countdown' component
  // ┣───
  // │ |: WARNING:
  // │ |: [production] => true
  // ╰─────
  objSentry:
  {
    // url: process.env.VITE_SENTRY_URL
  },
  // ╭─────
  // │ NOTE:
  // │ |: Configuration for Lazy Load Components in Application
  // ╰─────
  objApp:
  {
    /**
     * @description
     */
    isServiceWorkerEnabled: true,
    /**
     * @description
     */
    listLazyLoadComponents: new Map
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

            /**
             * @description
             * 📝 Debug Level for Hook Operations
             */
            isDebugEnabled: false,

            /**
             * @description
             * 📝 Performance Threshold in ms for Hook Operations
             */
            intPerformanceThresholdMs: 1,

            customErrorHandler:
            {

            },

            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 💠 │ configuration // resolve.preload(..                                         │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯

            /**
             * @description
             * 📝 Enable Preload for 'link rel=preload' tags
             */
            isPreload: false,

            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 💠 │ configuration // resolve.transformPageChunk(..)                             │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯

            /**
             * @description
             * 📝 AB-Testing Injection Configuration
             */
            objHtmlHeadABTestingInjection:
            {
              /**
               * @description
               *  📝 Enable inline HTML head links injection
               * @example
               *  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" />
               *  -> becomes ->
               *  <style> {inlined CSS content} </style>
               */
              isInjectionEnabled: true,
              /**
               * @description
               *  📝 Skip (exlcude) matching '<head> <link href="{.}" >' parsing
               */
              setInjectionLinkHrefExclude: new Set
              (
                [
                  'https://fonts.googleapis.com/', // google fonts
                  '__app-styles', // custom identifier to exclude app styles
                ]
              ),
              /**
               * @description
               * 📝 Enable Inline Single Line Styles Injection (compression-js-logic)
               */
              isInjectionInlineSingleLineEnabled: true,

              /**
               * @description
               * 📝 Enable Inline Head Styles Injection (compression-js-logic)
               * @note
               * ❗️ WARNING: This means, compressed injection will ONLY resolve at 'document-load-time' (client-side).
               */
              isInjectionCompressed: false,
              /**
               * @description
               * 📝 Skip (exclude) Target Head Styles from Inline Compression
               */
              setInjectionCompressedExclude: new Set
              (
                [
                  '__app-styles'
                ]
              ),

              /**
               * @description
               * 📝 Enable Image Preload Injection in HTML Head
               */
              isInjectionImagePreload: true,

              stylesheets:
              {
                isEnabled: true,
                strLoadingType: 'purged' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: WEBSITE-STYLESHEETS :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForPurged: `
                  <link
                    href="css/app.purged.clean.css"
                    rel="stylesheet"
                    text="text/css"
                  />
                `,
                strCodeSampleForStandard: `
                  <link
                    href="app.css"
                    rel="stylesheet"
                    text="text/css"
                  />
                `,
              },

              fonts:
              {
                isEnabled: true,
                strLoadingType: 'cdn' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: WEBSITE-FONTS :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForLocal: `
                  <link
                    href="template/html.head.fonts.local.html"
                  />
                `,
                strCodeSampleForCdn: `
                  <link
                    href="template/html.head.fonts.cdn.html"
                  />
                `,
              },

              googleTagManager:
              {
                isEnabled: true,
                strLoadingType: 'cdn-partytown' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-GOOGLE-ANALYTICS :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForLocal: `
                  <link
                    href="scripts/service.googletagmanager.js"
                    as="script"
                  />
                `,
                strCodeSampleForCdn: `
                  <link
                    href="template/html.head.googletagmanager.cdn.html"
                  />
                `,
                strCodeSampleForCdnPartytown: `
                  <link
                    href="template/html.head.googletagmanager.cdn.partytown.html"
                  />
                `
              },

              twitter:
              {
                isEnabled: true,
                strLoadingType: 'cdn-partytown' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-TWITTER :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForLocal: `
                  <link
                    href="scripts/service.twitter.js"
                    as="script"
                  />
                `,
                strCodeSampleForCdn: `
                  <link
                    href="template/html.head.twitter.cdn.html"
                  />
                `,
                strCodeSampleForCdnPartytown: `
                  <link
                    href="template/html.head.twitter.cdn.partytown.html"
                  />
                `
              },

              posthog:
              {
                isEnabled: true,
                strLoadingType: 'cdn-partytown' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-POSTHOG :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForCdn: `
                  <link
                    href="template/html.head.posthog.cdn.html"
                  />
                `,
                strCodeSampleForCdnPartytown: `
                  <link
                    href="template/html.head.posthog.cdn.partytown.html"
                  />
                `
              },

              facebook:
              {
                isEnabled: true,
                strLoadingType: 'cdn-partytown' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-FACEBOOK :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForCdn: `
                  <link
                    href="template/html.head.facebook.cdn.html"
                  />
                `,
                strCodeSampleForCdnPartytown: `
                  <link
                    href="template/html.head.facebook.cdn.partytown.html"
                  />
                `
              },

              linkedin:
              {
                isEnabled: true,
                strLoadingType: 'cdn-partytown' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-LINKEDIN :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForCdn: `
                  <link
                    href="template/html.head.linkedin.cdn.html"
                  />
                `,
                strCodeSampleForCdnPartytown: `
                  <link
                    href="template/html.head.linkedin.cdn.partytown.html"
                  />
                `
              },

              intercom:
              {
                isEnabled: true,
                strLoadingType: 'cdn-partytown' as ILoadingType,
                strHtmlHeadForInjection: `<!-- DO-NOT-REMOVE :: 3RD-PARTY-INTERCOM :: INJECTED HERE DYNAMICALLY -->`,
                strCodeSampleForCdn: `
                  <link
                    href="template/html.head.intercom.cdn.html"
                  />
                `,
                strCodeSampleForCdnPartytown: `
                  <link
                    href="template/html.head.intercom.cdn.partytown.html"
                  />
                `
              },

              // progressier: // TODO: implement progressier
            },

            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 💠 │ configuration // resolve.setHeaders(..)                                     │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯

            /**
             * @description
             * 📝 Enable setting 'Cookie' headers
             */
            isHeadersCookieEnabled: true,
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
            objSveltekitOptions:
            {
              isSsr: true,
              isCsr: true,
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
            isDynamicImport: false,
            isHidden: false,
            isBetareAgEngineEnabled: true,
            is3rdPartyIntercomEnabled: false,
            /**
             * @description
             * 📝 Holds target `component(s)` of dynamic nature.
             */
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
            isDynamicImport: false,
            isHidden: false,
          }
        ],
        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 💠 │ SVELTE // COMPONENTS                                                        │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯
        [
          'src/lib/components/misc/Splash-Screen.svelte',
          {
            isHidden: true,
          }
        ],
        [
          'src/lib/components/misc/banner/Banner-Offline-Alert.svelte',
          {
            isDynamicImport: true,
            isHidden: false,
          }
        ],
        [
          'src/lib/components/misc/banner/Banner-Platform-Alert.svelte',
          {
            isDynamicImport: true,
            isHidden: false,
          }
        ],
        [
          'src/lib/components/misc/modal/Modal-Email-Subscribe.svelte',
          {
            isDynamicImport: true,
            isHidden: false,
          }
        ],
        [
          'src/lib/components/section/authors/page/author/content/Author-Widget.svelte',
          {
            objMeta:
            {
              cname: 'page/author/content/author-widget',
              // intDeviceThresholdsInPx: [ 575, 1160 ],
            },
            isDynamicImport: false,
            isHidden: false,
            isSeoBoxEnabled: true,
            intComponentConfigVersion: 1,
          }
        ]
      ]
    )
  },
}