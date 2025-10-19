// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-09-10                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module)
// │ |: Configuration for Vite.
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { sentrySvelteKit } from "@sentry/sveltekit";
import { partytownVite } from '@builder.io/partytown/utils';
import { sveltekit } from '@sveltejs/kit/vite';
import { table } from 'table';
import { defineConfig } from 'vitest/config';
import { loadEnv } from "vite";
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { dependencies, version } from './package.json';

// ╭─────
// │ NOTE: IMPORTANT
// │ ➤ required as part of Google Hack.
// ╰─────
// import viteCompression from 'vite-plugin-compression';
// import fs from 'fs';
// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// #endregion ➤ 📦 Package Imports

const projectRootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig
(
  (
    {
      command,
      mode,
      ssrBuild
    }
  ) =>
  {
    // ╭─────
    // │ NOTE: [🐞]
    // │ ➤ [1] Testing expected override of local '.env' for that of the 'dotenv-valut' injected secrets.
    // ╰─────
    console.log(`📜 [1] Loaded using (file): ${process.env.VITE_ENV_TARGET}`);

    // ╭─────
    // │ NOTE: IMPORTANT
    // │ > inject environment secrets.
    // ╰─────
    process.env =
    {
      ...process.env,
      ...loadEnv(mode, process.cwd())
    };

    // ╭─────
    // │ NOTE: [🐞]
    // │ ➤ [2] Testing expected override of local '.env' for that of the 'dotenv-valut' injected secrets.
    // ╰─────
    console.log(`📜 [2] Loaded using (file): ${process.env.VITE_ENV_TARGET}`);

    console.log('process.env.CI_GITHUB_DEPLOYMENT_STAGING', process.env.CI_GITHUB_DEPLOYMENT_STAGING);

    if (process.env.CI_GITHUB_DEPLOYMENT_STAGING == undefined)
    {
      console.log('📜 [3] Loaded using (file): .env.ci-github-deployment-staging');
      // [🐞]
      console.log
      (
        `
        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🔒 Loaded secrets ⬇️                                                             │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯
        `.replaceAll('  ','')
      );
      // [🐞]
      console.log(loadEnv(mode, process.cwd()));
    }

    const
      /**
       * @description
       * 📝 Scores pacakge version
       * @note
       * Previously used as `VITE_SCORES_PKG_VERSION=v.$(npm pkg get version --workspaces=false | tr -d \\\") npm run [..]`
       * @example
       * => 0.5
       */
      __PKG_VERSION_SCORES__ = version,
      /**
       * @description
       * 📝 Scores-Lib package version
       * @note
       * Previously used as `VITE_SCORES_LIB_PKG_VERSION=v.$(npm info @betarena/scores-lib version | tr -d \\\") npm run [..]`
       * @example
       * => 0.5
       */
      __PKG_VERSION_SCORES_LIB__ = dependencies["@betarena/scores-lib"],
      /**
       * @description
       * 📝 Ad-Engine package version
       * @example
       * => 0.5
       */
      __PKG_VERSION_AD_ENGINE__ = dependencies["@betarena/ad-engine"]
    ;

    // [🐞]
    console.log
    (
      table
      (
        [
          ['💮 [project] |:| scores', __PKG_VERSION_SCORES__],
          ['💮 [dependency] |:| @betarena/scores-lib', __PKG_VERSION_SCORES_LIB__],
          ['💮 [dependency] |:| @betarena/ad-engine', __PKG_VERSION_AD_ENGINE__],
          ['❓ [condition] |:| uploaded sentry sourcemap', process.env?.VITE_SENTRY_UPLOAD_SOURCEMAPS],
          ['❓ [condition] |:| logging', process.env?.VITE_PROD_LOGS],
          ['📌 [artifact] |:| .env', process.env?.VITE_ENV_TARGET],
          ['📌 [vite] |:| mode', mode],
          ['📌 [vite] |:| command', command],
          ['📌 [vite] |:| ssrBuild', ssrBuild],
        ]
      )
    );

    return {

      define:
      {
        __PKG_VERSION_SCORES__: `"${__PKG_VERSION_SCORES__}"`,
        __PKG_VERSION_SCORES_LIB__: `"${__PKG_VERSION_SCORES_LIB__}"`,
        __PKG_VERSION_AD_ENGINE__: `"${__PKG_VERSION_AD_ENGINE__}"`
      },

      plugins:
      [
        // ╭─────
        // │ NOTE: IMPORTANT
        // │ ➤ needs to be placed 'before' sveltekit compilation.
        // ╰─────
        sentrySvelteKit
        (
          {
            sourceMapsUploadOptions:
            {
              org: "betarena",
              project: "scores-platform",
              release: process.env?.npm_package_version ?? version ?? 'v.0.0.0',
              uploadSourceMaps: process.env?.VITE_SENTRY_UPLOAD_SOURCEMAPS as unknown as string == 'true' ? true : false
            },
            autoUploadSourceMaps: process.env?.VITE_SENTRY_UPLOAD_SOURCEMAPS as unknown as string == 'true' ? true : false
          }
        ),

        partytownVite
        (
          {
            dest: join(projectRootDir, 'static', '~partytown')
          }
        ),

        // ╭─────
        // │ NOTE: WARNING:
        // │ ➤ imported from 'vite-plugin-chunk-split'.
        // │ ➤ DOES NOT WORK! BREAKS BUILD/COMPILE!
        // ╰─────
        // chunkSplitPlugin({ strategy: 'all-in-one' }),

        // ╭─────
        // │ NOTE: WARNING:
        // │ ➤ imported from 'vite-plugin-progress'.
        // │ ➤ DOES NOT WORK AS ADVERTISED!
        // ╰─────
        // progress(),

        // ╭─────
        // │ NOTE: WARNING:
        // │ ➤ imported from 'vite-plugin-compress'.
        // │ ➤ DOES NOT WORK AS ADVERTISED!
        // ╰─────
        // c.compress(),

        // ╭─────
        // │ NOTE: WARNING:
        // │ ➤ imported from 'vite-plugin-preload'.
        // │ ➤ DOES NOT WORK AS ADVERTISED!
        // ╰─────
        // preload(),

        // IMPORTANT
        sveltekit(),
        // viteCompression(),

        // ╭─────
        // │ NOTE:
        // │ ➤ imported from 'vite-plugin-css-injected-by-js'.
        // │ WARNING:
        // │ ➤ overrides 'CSS' imported by 'svelte' & 'svelte-kit'
        // │ ➤ requires to be imported a '<link ... >' in the 'src/app.html'
        // │ IMPORTANT
        // │ Please, follow the following steps (to attain google-hack)
        // │ ➤ [1] Uncomment (below) code-block
        // │ ➤ [2] Run `npm run build` in command-line for '_this_' root project path.
        // │ ➤ [3] Validate new `./static/all-one-css-chunk.css` has been generated.
        // │ ➤ [4] Comment (below) code-block.
        // │ ➤ [5] Copy new `CSS` to `src/app.html > <head> <style> (designated area).
        // │ ➤ [6] Push to `Production`.
        // ╰─────
        /*
          cssInjectedByJsPlugin
          (
            {

              // relativeCSSInjection: true,

              // topExecutionPriority: true,

              // jsAssetsFilterFunction: function customJsAssetsfilterFunction
              // (
              //   outputChunk
              // )
              // {

              //   // [🐞]
              //   // ▓ NOTE:
              //   // ▓ It appears, the 'outputChunk.filename' is of type:
              //   // ▓ - _app/immutable/chunks/index.088b98a6.js
              //   // ▓ - _app/immutable/chunks/index.8e8ca4ce.js
              //   // ▓ etc.
              //   // console.log(outputChunk.fileName);

              //   return outputChunk.fileName == 'index.js';
              // }

              // ▓ NOTE:
              // ▓ definitive 'hack' solution for 'single CSS file' output chunk.
              injectCode:
              (
                cssCode,
                options
              ): string =>
              {

                const generateOneCssFile: boolean = false;

                if (generateOneCssFile)
                {
                  // ▓ NOTE:
                  // ▓ the 'cssCode' generated contains some 'formatting' issues.
                  // ▓ remove 1st and last speech marks.
                  // ▓ remove cases of `\n` chars.
                  // ▓ correct custom case of 'ids'/'classes' using the 'forward-slash' in the declaration.
                  let cssCodeMod: string = cssCode.slice(1, -1);
                  cssCodeMod = cssCodeMod.replace(/\\n/g, "");
                  cssCodeMod = cssCodeMod.replace(/\\\\/g,"\\")

                  // ▓ WARNING:
                  // ▓ 'all-css-chunk.css' must exist inside '/static'
                  fs.writeFile
                  (
                    './static/all-css-chunk.css',
                    cssCodeMod,
                    err =>
                    {
                      if (err) console.error(err);
                    }
                  );
                }

                return '';

                // return `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('vite-plugin-css-injected-by-js', e);}`
              }

            }
          ),
        */
      ],

      build:
      {
        // ╭─────
        // │ NOTE:
        // │ ➤ gets overridden by SvelteKit.
        // ╰─────
        // cssCodeSplit: false,

        minify: 'esbuild',
        cssMinify: 'lightningcss',

        // ╭─────
        // │ NOTE:
        // │ ➤ rollup config.
        // ╰─────
        rollupOptions:
        {
          output:
          {
            // ╭─────
            // │ NOTE:
            // │ ➤ [disabled]
            // │ 🔗 read-more :|: https://github.com/vitejs/vite/discussions/9440#discussioncomment-5913798
            // │ 🔗 read-more :|: https://stackoverflow.com/questions/68643743/separating-material-ui-in-vite-rollup-as-a-manual-chunk-to-reduce-chunk-size
            // ╰─────
            // manualChunks: undefined
            manualChunks
            (
              id,
              opt
            )
            {
              // [🐞]
              // console.log(id);

              // fs.appendFile
              // (
              //   './chunks-full.json',
              //   id,
              //   // ╭─────
              //   // │ NOTE:
              //   // │ |: Alternative approach
              //   // ╰─────
              //   // JSON.stringify(opt, null, 4),
              //   err =>
              //   {
              //     if (err) console.error(err);
              //   }
              // );

              // ╭─────
              // │ NOTE:
              // │ ➤ testing for 'per-page' component build split.
              // │ ➤ works well, but at times incosistent, due to CSS.
              // ╰─────
              // if (id.includes('src/lib/components/_main_'))
              //   return 'M-main-single-chunk';
              // ;

              // if (id.includes('src/'))
              //   return 'M-homepage-single-chunk';
              // ;

              // if (id.includes('src/lib/store/'))
              //   return 'M-stores-single-chunk';
              // ;

              // if (id.includes('src/lib/firebase/'))
              //   return 'M-firebase-single-chunk';
              // ;

              // ╭─────
              // │ NOTE:
              // │ ➤ works well, but at times incosistent, supercharged with hardcoded CSS.
              // ╰─────
              // if (id.includes('src/'))
              //   return 'M-single-chunk';
              // ;

              // ╭─────
              // │ NOTE: WARNING:
              // │ ➤ gives error of 'dev' issue [?]
              // ╰─────
              // if (id.includes('src/lib/utils/'))
              //   return 'M-utils-single-chunk';

              // 🔗 read-more :|: (1st comment) https://stackoverflow.com/a/71578633/8421215
              // if (id.indexOf("react") !== -1) { return; }

              // 🔗 read-more :|: https://github.com/sveltejs/kit/issues/7257#issuecomment-1528962348
              // if (id.includes('@sentry') && !id.includes('@sentry/browser') && !id.includes('@sentry/tracing'))
              //   return 'vendor_sentry'

              // ╭─────
              // │ NOTE:
              // │ ➤ original
              // ╰─────
              // if (id.includes('node_modules'))
              //   return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      },

      // ╭─────
      // │ NOTE:
      // │ ➤ [disabled]
      // │ 🔗 read-more :|: https://stackoverflow.com/questions/73205096/run-sveltekit-dev-with-https
      // ╰─────
      // server:
      // {
      //   https:
      //   {
      //     key: fs.readFileSync(`${__dirname}/cert/key.pem`),
      //     cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
      //   }
      // }

      // ╭─────
      // │ NOTE:
      // │ ➤ [disabled] 'vitest' integration
      // ╰─────
      // test:
      // {
      //   include: ['src/**//*.{test,spec}.{js,ts}'],
      //   globals: true,
      //   environment: 'jsdom',
      //   // setupFiles: ["src/setuptest.js"],
      // }
    }
  }
);
