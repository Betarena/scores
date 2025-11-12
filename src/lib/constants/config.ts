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

export const config = {
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
             * 📝 Enable Inline Head Links Injection
             */
            isHtmlHeadLinksInlineInjection: true,
            /**
             * @description
             * 📝 Skip/Exlcude Target Head Links Parsing
             */
            isHtmlHeadLinkHrefExclude: new Set
            (
              [
                'https://fonts.googleapis.com/',
                '__app-styles',
              ]
            ),
            /**
             * @description
             * 📝 Enable Image Preload Injection in HTML Head
             */
            isHtmlHeadInjectImagePreload: true,

            /**
             * @description
             * 📝 Enable Inline Head Styles Injection (compression-js-logic)
             * @note
             * ❗️ This means, it will resolve at 'document-load-time'.
             */
            isHtmlHeadInlineCompressed: false,
            /**
             * @description
             * 📝 Skip/Exclude Target Head Styles from Inline Compression
             */
            isHtmlHeadInlineCompressedExclude: new Set
            (
              [
                '__app-styles'
              ]
            ),

            /**
             * @description
             * 📝 Enable Font-Face Inline Injection
             * @note
             * Used for debugging purposes mainly, and comparing with/without font-display swap.
             */
            isHtmlHeadFontInjection: 'google-cdn' as
              | 'none'
              | 'google-cdn'
              | 'local',
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