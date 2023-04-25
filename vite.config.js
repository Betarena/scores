import { sveltekit } from '@sveltejs/kit/vite';
// import viteCompression from 'vite-plugin-compression';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    // NOTE:IMPORTANT not-working - does not compile correctly
    // chunkSplitPlugin({ strategy: 'all-in-one' }), // DOC: vite-plugin-chunk-split
    // progress(), // DOC: vite-plugin-compress
    // c.compress() // DOC: vite-plugin-progress
    // viteCompression(),
    sveltekit()
  ],
  // DOC: REF: [6]
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: undefined
  //     }
  //   }
  // }
};
export default config;