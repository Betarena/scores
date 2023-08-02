import { sveltekit } from '@sveltejs/kit/vite';
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
      // ### 'this' plugin removes all 'CSS' from standard
      // ### importing by 'svelte/svelteki' and styles will be missing
      // ### if not imported as a '<link ... >' in the 'src/app.html'
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

    // DOC: REF: [6]
    build: {
      rollupOptions:
      {
        output:
        {
          manualChunks: undefined
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
