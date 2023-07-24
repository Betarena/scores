import { sveltekit } from '@sveltejs/kit/vite';
import viteCompression from 'vite-plugin-compression';
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
      viteCompression(),
      sveltekit()
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
    test:
    {
      include: ['src/**/*.{test,spec}.{js,ts}'],
      globals: true,
      environment: 'jsdom',
      // setupFiles: ["src/setuptest.js"],
    }
  }
);
