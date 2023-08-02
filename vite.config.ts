import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import viteCompression from 'vite-plugin-compression';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
// import preload from "vite-plugin-preload";
import fs from 'fs';
import { defineConfig } from 'vitest/config';

export default defineConfig
(
  {
    plugins:
    [
      // ◾️ DOC: vite-plugin-chunk-split
      // ◾️ NOTE: IMPORTANT
      // ◾️ does not work - does not compile correctly.
      // chunkSplitPlugin({ strategy: 'all-in-one' }),

      // ◾️ DOC: vite-plugin-progress
      // progress(),

      // ◾️ DOC: vite-plugin-compress
      // c.compress()

      // preload(),

      sveltekit(),
      viteCompression(),

      // ### WARNING:
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
          //   // ### NOTE:
          //   // ### It appears, the 'outputChunk.filename' is of type:
          //   // ### - _app/immutable/chunks/index.088b98a6.js
          //   // ### - _app/immutable/chunks/index.8e8ca4ce.js
          //   // ### etc.
          //   // console.log(outputChunk.fileName);

          //   return outputChunk.fileName == 'index.js';
          // }

          // ### NOTE:
          // ### definitive 'hack' solution for 'single CSS file' output chunk.
          injectCode:
          (
            cssCode,
            options
          ): string =>
          {

            const generateOneCssFile: boolean = false;

            if (generateOneCssFile)
            {
              // ### NOTE:
              // ### the 'cssCode' generated contains some 'formatting' issues.
              // ### remove 1st and last speech marks.
              // ### remove cases of `\n` chars.
              // ### correct custom case of 'ids'/'classes' using the 'forward-slash' in the declaration.
              let cssCodeMod: string = cssCode.slice(1, -1);
              cssCodeMod = cssCodeMod.replace(/\\n/g, "");
              cssCodeMod = cssCodeMod.replace(/\\\\/g,"\\")

              // ### WARNING:
              // ### 'all-css-chunk.css' must exist inside '/static'
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
    ],

    // ### DOC:
    // ### look for reference [6]
    build:
    {
      rollupOptions:
      {
        output:
        {
          // manualChunks: undefined

          // ### SEE:
          // ### https://github.com/vitejs/vite/discussions/9440#discussioncomment-5913798
          manualChunks
          (
            id
          )
          {
            // [🐞]
            // console.log(id);

            // ### NOTE:
            // ### testing for 'per-page' component build split.
            // ### NOTE:
            // ### works well, but at times incosistent.
            // if (id.includes('src/lib/components/_main_'))
            //   return 'M-main-single-chunk';
            // ;
            if (id.includes('src/lib/components/page/home'))
              return 'M-homepage-single-chunk';
            ;
            // if (id.includes('src/lib/store/'))
            //   return 'M-stores-single-chunk';
            // ;
            // if (id.includes('src/lib/firebase/'))
            //   return 'M-firebase-single-chunk';
            // ;
            // if (id.includes('src/'))
            //   return 'M-single-chunk';
            // ;

            // ### NOTE:
            // ### gives error of 'dev' issue [?]
            // if (id.includes('src/lib/utils/'))
            //   return 'M-utils-single-chunk';

            // ### SEE:
            // ### 1st comment - https://stackoverflow.com/a/71578633/8421215
            // if (id.indexOf("react") !== -1) { return; }

            // ### SEE:
            // ### https://github.com/sveltejs/kit/issues/7257#issuecomment-1528962348
            // if (id.includes('@sentry') && !id.includes('@sentry/browser') && !id.includes('@sentry/tracing'))
            //   return 'vendor_sentry'

            // ### NOTE:
            // ### original
            // if (id.includes('node_modules'))
            //   return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }

        }
      }
    },

    // ### NOTE:
    // ### 'vitest' integration
    // test:
    // {
    //   include: ['src/**/*.{test,spec}.{js,ts}'],
    //   globals: true,
    //   environment: 'jsdom',
    //   // setupFiles: ["src/setuptest.js"],
    // }
  }
);
