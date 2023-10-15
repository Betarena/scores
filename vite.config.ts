// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// ▓▓ 📝 DESCRIPTION                                                        ▓▓
// ▓▓ Vite Configuration                                                    ▓▓
// ▓▓ Read more on https://vitejs.dev/config/                               ▓▓
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

// #region ➤ 📦 Package Imports

import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { table } from 'table';
import { defineConfig } from 'vitest/config';

import { loadEnv } from "vite";
import { version } from './package.json';

// ▓▓ NOTE:
// ▓▓ next-line :: required as part of Google Hack.
// import viteCompression from 'vite-plugin-compression';

// ▓▓ NOTE:
// ▓▓ next-line :: required as part of the establied Google Hack solution.
// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// ▓▓ NOTE:
// ▓▓ next-line :: required as part of Google Hack.
// import fs from 'fs';

// #endregion ➤ 📦 Package Imports

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
    process.env =
    {
      ...process.env,
      ...loadEnv(mode, process.cwd()),
    };

    // ▓▓ [🐞]
    console.log
    (
      table
      (
        [
          ['📣 ENV Scores Version', process.env?.VITE_SCORES_PKG_VERSION],
          ['📣 ENV Sentry Upload Sourcemaps', process.env?.SENTRY_UPLOAD_SOURCEMAPS],
          ['📣 Target .env', process.env?.ENV_TARGET],
          ['📣 Vite Mode', mode],
          ['📣 Vite Command', command],
          ['📣 Vite ssrBuild', ssrBuild],
        ]
      )
    );

    return {

      plugins:
      [
        // ▓▓ NOTE: | IMPORTANT
        // ▓▓ needs to be placed 'before' sveltekit compilation.
        sentrySvelteKit
        (
          {
            sourceMapsUploadOptions:
            {
              org: "betarena",
              project: "scores-platform",
              release: process.env?.VITE_SCORES_PKG_VERSION ?? process.env?.npm_package_version ?? version ?? 'v.0.0.0',
              uploadSourceMaps: process.env?.SENTRY_UPLOAD_SOURCEMAPS as unknown as string == 'true' ? true : false,
            },
            autoUploadSourceMaps: process.env?.SENTRY_UPLOAD_SOURCEMAPS as unknown as string == 'true' ? true : false,
          }
        ),

        // ▓▓ NOTE:
        // ▓▓ comes from 'vite-plugin-chunk-split'
        // ▓▓ WARNING:
        // ▓▓ does not work, breaks build
        // chunkSplitPlugin({ strategy: 'all-in-one' }),

        // ▓▓ NOTE:
        // ▓▓ comes from 'vite-plugin-progress'
        // ▓▓ WARNING:
        // ▓▓ does not work as expected/advertised [?]
        // progress(),

        // ▓▓ NOTE:
        // ▓▓ comes from 'vite-plugin-compress'
        // ▓▓ WARNING:
        // ▓▓ does not work, breaks build
        // c.compress(),

        // ▓▓ NOTE:
        // ▓▓ comes from 'vite-plugin-preload'
        // ▓▓ WARNING:
        // ▓▓ does not work as expected/advertised [?]
        // preload(),

        // ▓▓ IMPORTANT
        sveltekit(),
        // viteCompression(),
        // ▓▓ IMPORTANT

        // ▓▓ NOTE:
        // ▓▓ comes from 'vite-plugin-css-injected-by-js'
        // ▓▓ WARNING:
        // ▓▓ overrides 'CSS' imported by 'svelte/+kit'
        // ▓▓ requires to be imported a '<link ... >' in the 'src/app.html'
        // ▓▓ IMPORTANT
        // ▓▓ IF (below) code-block is uncommented.
        // ▓▓ Please, follow the following steps (to attain google-hack)
        // ▓▓ [1] Uncomment (below) code-block
        // ▓▓ [2] Run `npm run build` in command-line for '_this_' root project path.
        // ▓▓ [3] Validate new `./static/all-one-css-chunk.css` has been generated.
        // ▓▓ [4] Comment (below) code-block.
        // ▓▓▓ [5] Copy new `CSS` to `src/app.html > <head> <style> (designated area).
        // ▓▓ [6] Push to `Production`.
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
            //   // ▓▓ NOTE:
            //   // ▓▓ It appears, the 'outputChunk.filename' is of type:
            //   // ▓▓ - _app/immutable/chunks/index.088b98a6.js
            //   // ▓▓ - _app/immutable/chunks/index.8e8ca4ce.js
            //   // ▓▓ etc.
            //   // console.log(outputChunk.fileName);

            //   return outputChunk.fileName == 'index.js';
            // }

            // ▓▓ NOTE:
            // ▓▓ definitive 'hack' solution for 'single CSS file' output chunk.
            injectCode:
            (
              cssCode,
              options
            ): string =>
            {

              const generateOneCssFile: boolean = false;

              if (generateOneCssFile)
              {
                // ▓▓ NOTE:
                // ▓▓ the 'cssCode' generated contains some 'formatting' issues.
                // ▓▓ remove 1st and last speech marks.
                // ▓▓ remove cases of `\n` chars.
                // ▓▓ correct custom case of 'ids'/'classes' using the 'forward-slash' in the declaration.
                let cssCodeMod: string = cssCode.slice(1, -1);
                cssCodeMod = cssCodeMod.replace(/\\n/g, "");
                cssCodeMod = cssCodeMod.replace(/\\\\/g,"\\")

                // ▓▓ WARNING:
                // ▓▓ 'all-css-chunk.css' must exist inside '/static'
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
        // ▓▓ NOTE:
        // ▓▓ gets overridden by SvelteKit.
        // cssCodeSplit: false,

        minify: 'esbuild',
        cssMinify: 'lightningcss',

        // ▓▓ NOTE:
        // ▓▓ rollup config.
        rollupOptions:
        {
          output:
          {
            // manualChunks: undefined

            // ▓▓ SEE:
            // ▓▓ https://github.com/vitejs/vite/discussions/9440#discussioncomment-5913798
            // ▓▓ https://stackoverflow.com/questions/68643743/separating-material-ui-in-vite-rollup-as-a-manual-chunk-to-reduce-chunk-size
              manualChunks
              (
                id,
                opt
              )
              {
                // [🐞]
                // console.log(id);

                /*
                  fs.appendFile
                  (
                    './chunks-full.json',
                    id,
                    err =>
                    {
                      if (err) console.error(err);
                    }
                  );

                  fs.appendFile
                  (
                    './chunks-full.json',
                    JSON.stringify(opt, null, 4),
                    err =>
                    {
                      if (err) console.error(err);
                    }
                  );
                */

                // ▓▓ NOTE:
                // ▓▓ testing for 'per-page' component build split.
                // ▓▓ NOTE:
                // ▓▓ works well, but at times incosistent, due to CSS.
                // if (id.includes('src/lib/components/_main_'))
                //   return 'M-main-single-chunk';
                // ;
                if (id.includes('src/'))
                  return 'M-homepage-single-chunk';
                ;
                // if (id.includes('src/lib/store/'))
                //   return 'M-stores-single-chunk';
                // ;
                // if (id.includes('src/lib/firebase/'))
                //   return 'M-firebase-single-chunk';
                // ;
                // ▓▓ NOTE:
                // ▓▓ works well, but at times incosistent
                // ▓▓ supercharged with hardcoded CSS.
                // if (id.includes('src/'))
                //   return 'M-single-chunk';
                // ;

                // ▓▓ NOTE:
                // ▓▓ gives error of 'dev' issue [?]
                // if (id.includes('src/lib/utils/'))
                //   return 'M-utils-single-chunk';

                // ▓▓ SEE:
                // ▓▓ 1st comment - https://stackoverflow.com/a/71578633/8421215
                // if (id.indexOf("react") !== -1) { return; }

                // ▓▓ SEE:
                // ▓▓ https://github.com/sveltejs/kit/issues/7257#issuecomment-1528962348
                // if (id.includes('@sentry') && !id.includes('@sentry/browser') && !id.includes('@sentry/tracing'))
                //   return 'vendor_sentry'

                // ▓▓ NOTE:
                // ▓▓ original
                // if (id.includes('node_modules'))
                //   return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
          }
        }
      },

      // ▓▓ NOTE: | STASH
      // ▓▓ 'vitest' integration (disabled)
      // test:
      // {
      //   include: ['src/**/*.{test,spec}.{js,ts}'],
      //   globals: true,
      //   environment: 'jsdom',
      //   // setupFiles: ["src/setuptest.js"],
      // }
    }
  }
);
