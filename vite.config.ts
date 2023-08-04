import { sveltekit } from '@sveltejs/kit/vite';
// import viteCompression from 'vite-plugin-compression';
// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { defineConfig } from 'vitest/config';

export default defineConfig
(
  {
    plugins:
    [

      // ### NOTE:
      // ### comes from 'vite-plugin-chunk-split'
      // ### WARNING:
      // ### does not work, breaks build
      // chunkSplitPlugin({ strategy: 'all-in-one' }),

      // ### NOTE:
      // ### comes from 'vite-plugin-progress'
      // ### WARNING:
      // ### does not work as expected/advertised [?]
      // progress(),

      // ### NOTE:
      // ### comes from 'vite-plugin-compress'
      // ### WARNING:
      // ### does not work, breaks build
      // c.compress(),

      // ### NOTE:
      // ### comes from 'vite-plugin-preload'
      // ### WARNING:
      // ### does not work as expected/advertised [?]
      // preload(),

      // ### IMPORTANT
      sveltekit(),
      // viteCompression(),
      // ### IMPORTANT

      // ### NOTE:
      // ### comes from 'vite-plugin-css-injected-by-js'
      // ### WARNING:
      // ### overrides 'CSS' imported by 'svelte/+kit'
      // ### requires to be imported a '<link ... >' in the 'src/app.html'
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
      */

    ],

    // ### DOC:
    // ### look for reference [6]
    build:
    {
      // ### NOTE:
      // ### gets overridden by SvelteKit.
      // cssCodeSplit: false,

      // ### NOTE:
      // ### rollup config.
      rollupOptions:
      {
        output:
        {
          manualChunks: undefined

          // ### SEE:
          // ### https://github.com/vitejs/vite/discussions/9440#discussioncomment-5913798
          // ### https://stackoverflow.com/questions/68643743/separating-material-ui-in-vite-rollup-as-a-manual-chunk-to-reduce-chunk-size
          /*
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
              * /

              // ### NOTE:
              // ### testing for 'per-page' component build split.
              // ### NOTE:
              // ### works well, but at times incosistent, due to CSS.
              // if (id.includes('src/lib/components/_main_'))
              //   return 'M-main-single-chunk';
              // ;
              // if (id.includes('src/lib/components/page/home'))
              //   return 'M-homepage-single-chunk';
              // ;
              // if (id.includes('src/lib/store/'))
              //   return 'M-stores-single-chunk';
              // ;
              // if (id.includes('src/lib/firebase/'))
              //   return 'M-firebase-single-chunk';
              // ;
              // ### NOTE:
              // ### works well, but at times incosistent
              // ### supercharged with hardcoded CSS.
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
          */
        }
      }
    },

    // ### NOTE:
    // ### 'vitest' integration (disabled)
    // test:
    // {
    //   include: ['src/**/*.{test,spec}.{js,ts}'],
    //   globals: true,
    //   environment: 'jsdom',
    //   // setupFiles: ["src/setuptest.js"],
    // }
  }
);
