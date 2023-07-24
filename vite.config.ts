import { sveltekit } from '@sveltejs/kit/vite';
import viteCompression from 'vite-plugin-compression';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
// import preload from "vite-plugin-preload";
import { defineConfig } from 'vitest/config';

export default defineConfig
(
  {
    plugins:
    [
      // ### DOC: vite-plugin-chunk-split
      // ### NOTE: IMPORTANT
      // ### Not-working - does not compile correctly.
      // chunkSplitPlugin({ strategy: 'all-in-one' }),
      // ### DOC: vite-plugin-compress
      // progress(),
      // ### DOC: vite-plugin-progress
      // c.compress()
      // viteCompression(),
      // cssInjectedByJsPlugin
      // (
      //   {

      //     relativeCSSInjection: true

          // topExecutionPriority: true,

          // jsAssetsFilterFunction: function customJsAssetsfilterFunction
          // (
          //   outputChunk
          // )
          // {
          //   return outputChunk.fileName == 'index.js';
          // }

          // injectCode: (cssCode, options) => {
          //   return `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('vite-plugin-css-injected-by-js', e);}`
          // }
      //   }
      // ),
      // preload(),
      sveltekit()
    ],
    // DOC: REF: [6]
    // build: {
    //   rollupOptions:
    //   {
    //     output:
    //     {
    //       manualChunks: undefined
    //     }
    //   }
    // },
    // test:
    // {
    //   include: ['src/**/*.{test,spec}.{js,ts}'],
    //   globals: true,
    //   environment: 'jsdom',
    //   // setupFiles: ["src/setuptest.js"],
    // }
  }
);
