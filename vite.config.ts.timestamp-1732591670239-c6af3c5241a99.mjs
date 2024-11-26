// vite.config.ts
import { sentrySvelteKit } from "file:///workspaces/scores-suite/scores/node_modules/@sentry/sveltekit/cjs/index.server.js";
import { sveltekit } from "file:///workspaces/scores-suite/scores/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { table } from "file:///workspaces/scores-suite/scores/node_modules/table/dist/src/index.js";
import { loadEnv } from "file:///workspaces/scores-suite/scores/node_modules/vite/dist/node/index.js";
import { defineConfig } from "file:///workspaces/scores-suite/scores/node_modules/vitest/dist/config.js";

// package.json
var version = "2.16.0";
var dependencies = {
  "@betarena/ad-engine": "0.0.51",
  "@betarena/scores-lib": "4.0.35",
  "@lukeed/uuid": "2.0.1",
  "@metamask/sdk": "0.1.0",
  "@moralisweb3/client-firebase-auth-utils": "2.18.4",
  "@moralisweb3/client-firebase-evm-auth": "2.18.4",
  "@playwright/test": "1.36.1",
  "@sentry/browser": "7.73.0",
  "@sentry/sveltekit": "7.73.0",
  "@sentry/tracing": "7.49.0",
  "@tiptap/core": "2.7.4",
  "@tiptap/extension-bubble-menu": "2.8.0",
  "@tiptap/extension-image": "2.8.0",
  "@tiptap/extension-link": "2.7.4",
  "@tiptap/extension-placeholder": "2.7.4",
  "@tiptap/pm": "2.7.4",
  "@tiptap/starter-kit": "2.7.4",
  "@types/node": "20.8.5",
  "@walletconnect/web3-provider": "1.8.0",
  "@web3modal/ethers5": "3.5.7",
  boxen: "7.1.1",
  chalk: "5.3.0",
  "chart.js": "4.4.1",
  colorthief: "2.4.0",
  compression: "1.7.4",
  cookie: "0.5.0",
  "device-detector-js": "3.0.3",
  dompurify: "3.1.6",
  dotenv: "16.3.1",
  "email-validator": "2.0.4",
  ethers: "5.7.2",
  express: "4.18.2",
  "express-sslify": "1.2.0",
  firebase: "9.20.0",
  "graphql-request": "5.1.0",
  "graphql-subscriptions-client": "0.16.4",
  "heroku-ssl-redirect": "0.1.1",
  ibantools: "4.3.3",
  ioredis: "5.3.2",
  "lz-string": "1.5.0",
  "masonry-layout": "4.2.2",
  moralis: "2.18.4",
  "request-ip": "3.3.0",
  "svelte-apexcharts": "1.0.2",
  "svelte-easy-crop": "3.0.1",
  table: "6.8.1",
  "ua-parser-js": "1.0.35",
  "unique-username-generator": "1.1.3",
  "vite-plugin-css-injected-by-js": "3.2.1",
  "vite-plugin-preload": "0.3.1",
  "xml-formatter": "2.6.1",
  "cross-env": "7.0.3"
};

// vite.config.ts
var vite_config_default = defineConfig(
  ({
    command,
    mode,
    ssrBuild
  }) => {
    var _a, _b, _c, _d, _e, _f;
    process.env = {
      ...process.env,
      ...loadEnv(mode, process.cwd())
    };
    const __PKG_VERSION_SCORES__ = version, __PKG_VERSION_SCORES_LIB__ = dependencies["@betarena/scores-lib"], __PKG_VERSION_AD_ENGINE__ = dependencies["@betarena/ad-engine"];
    console.log(
      table(
        [
          ["\u{1F4AE} [project] |:| scores", __PKG_VERSION_SCORES__],
          ["\u{1F4AE} [dependency] |:| @betarena/scores-lib", __PKG_VERSION_SCORES_LIB__],
          ["\u{1F4AE} [dependency] |:| @betarena/ad-engine", __PKG_VERSION_AD_ENGINE__],
          ["\u2753 [condition] |:| uploaded sentry sourcemap", (_a = process.env) == null ? void 0 : _a.VITE_SENTRY_UPLOAD_SOURCEMAPS],
          ["\u2753 [condition] |:| logging", (_b = process.env) == null ? void 0 : _b.VITE_PROD_LOGS],
          ["\u{1F4CC} [artifact] |:| .env", (_c = process.env) == null ? void 0 : _c.VITE_ENV_TARGET],
          ["\u{1F4CC} [vite] |:| mode", mode],
          ["\u{1F4CC} [vite] |:| command", command],
          ["\u{1F4CC} [vite] |:| ssrBuild", ssrBuild]
        ]
      )
    );
    return {
      define: {
        __PKG_VERSION_SCORES__: `"${__PKG_VERSION_SCORES__}"`,
        __PKG_VERSION_SCORES_LIB__: `"${__PKG_VERSION_SCORES_LIB__}"`,
        __PKG_VERSION_AD_ENGINE__: `"${__PKG_VERSION_AD_ENGINE__}"`
      },
      plugins: [
        // ╭─────
        // │ NOTE: IMPORTANT
        // │ ➤ needs to be placed 'before' sveltekit compilation.
        // ╰─────
        sentrySvelteKit(
          {
            sourceMapsUploadOptions: {
              org: "betarena",
              project: "scores-platform",
              release: ((_d = process.env) == null ? void 0 : _d.npm_package_version) ?? version ?? "v.0.0.0",
              uploadSourceMaps: ((_e = process.env) == null ? void 0 : _e.VITE_SENTRY_UPLOAD_SOURCEMAPS) == "true" ? true : false
            },
            autoUploadSourceMaps: ((_f = process.env) == null ? void 0 : _f.VITE_SENTRY_UPLOAD_SOURCEMAPS) == "true" ? true : false
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
        sveltekit()
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
      build: {
        // ╭─────
        // │ NOTE:
        // │ ➤ gets overridden by SvelteKit.
        // ╰─────
        // cssCodeSplit: false,
        minify: "esbuild",
        cssMinify: "lightningcss",
        // ╭─────
        // │ NOTE:
        // │ ➤ rollup config.
        // ╰─────
        rollupOptions: {
          output: {
            // manualChunks: undefined
            // 🔗 read-more :|: https://github.com/vitejs/vite/discussions/9440#discussioncomment-5913798
            // 🔗 read-more :|: https://stackoverflow.com/questions/68643743/separating-material-ui-in-vite-rollup-as-a-manual-chunk-to-reduce-chunk-size
            manualChunks(id, opt) {
              if (id.includes("src/"))
                return "M-homepage-single-chunk";
              ;
            }
          }
        }
      }
      // 🔗 read-more :|: https://stackoverflow.com/questions/73205096/run-sveltekit-dev-with-https
      /*
        server:
        {
          https:
          {
            key: fs.readFileSync(`${__dirname}/cert/key.pem`),
            cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
          }
        }
      */
      // ╭─────
      // │ NOTE:
      // │ ➤ (disabled) 'vitest' integration
      // ╰─────
      /*
        test:
        {
          include: ['src/**/
      /*.{test,spec}.{js,ts}'],
          globals: true,
          environment: 'jsdom',
          // setupFiles: ["src/setuptest.js"],
        }
      */
    };
  }
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvc2NvcmVzLXN1aXRlL3Njb3Jlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvc2NvcmVzLXN1aXRlL3Njb3Jlcy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9zY29yZXMtc3VpdGUvc2NvcmVzL3ZpdGUuY29uZmlnLnRzXCI7Ly8gXHUyNTZEXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTZFXG4vLyBcdTI1MDIgXHVEODNEXHVEQ0NDIEhpZ2ggT3JkZXIgT3ZlcnZpZXcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1MjUwMlxuLy8gXHUyNTIzXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTJCXG4vLyBcdTI1MDIgXHUyN0E0IENvZGUgRm9ybWF0ICAgLy8gVi44LjAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTI1MDJcbi8vIFx1MjUwMiBcdTI3QTQgU3RhdHVzICAgICAgICAvLyBcdUQ4M0RcdUREMTIgTE9DS0VEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTI1MDJcbi8vIFx1MjUwMiBcdTI3QTQgQXV0aG9yKHMpICAgICAvLyBAbWlnYmFzaCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx1MjUwMlxuLy8gXHUyNTAyIFx1MjdBNCBNYWludGFpbmVyKHMpIC8vIEBtaWdiYXNoICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHUyNTAyXG4vLyBcdTI1MDIgXHUyN0E0IENyZWF0ZWQgb24gICAgLy8gMjAyNC0wOS0xMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTI1MDJcbi8vIFx1MjUyM1x1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUyQlxuLy8gXHUyNTAyIFx1RDgzRFx1RENERCBEZXNjcmlwdGlvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTI1MDJcbi8vIFx1MjUyM1x1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUyQlxuLy8gXHUyNTAyIEJldGFyZW5hIChNb2R1bGUpXG4vLyBcdTI1MDIgfDogQ29uZmlndXJhdGlvbiBmb3IgVml0ZS5cbi8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjU2RlxuXG4vLyAjcmVnaW9uIFx1MjdBNCBcdUQ4M0RcdURDRTYgUGFja2FnZSBJbXBvcnRzXG5cbmltcG9ydCB7IHNlbnRyeVN2ZWx0ZUtpdCB9IGZyb20gXCJAc2VudHJ5L3N2ZWx0ZWtpdFwiO1xuaW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJztcbmltcG9ydCB7IHRhYmxlIH0gZnJvbSAndGFibGUnO1xuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcblxuaW1wb3J0IHsgZGVwZW5kZW5jaWVzLCB2ZXJzaW9uIH0gZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xuXG4vLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFx1MjUwMiBOT1RFOiBJTVBPUlRBTlRcbi8vIFx1MjUwMiBcdTI3QTQgcmVxdWlyZWQgYXMgcGFydCBvZiBHb29nbGUgSGFjay5cbi8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XG4vLyBpbXBvcnQgZnMgZnJvbSAnZnMnO1xuLy8gaW1wb3J0IGNzc0luamVjdGVkQnlKc1BsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzXCI7XG5cbi8vICNlbmRyZWdpb24gXHUyN0E0IFx1RDgzRFx1RENFNiBQYWNrYWdlIEltcG9ydHNcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnXG4oXG4gIChcbiAgICB7XG4gICAgICBjb21tYW5kLFxuICAgICAgbW9kZSxcbiAgICAgIHNzckJ1aWxkXG4gICAgfVxuICApID0+XG4gIHtcbiAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvLyBcdTI1MDIgTk9URTogW1x1RDgzRFx1REMxRV1cbiAgICAvLyBcdTI1MDIgXHUyN0E0IFtwYXJ0LTFdIFRlc3RpbmcgZm9yIG92ZXJyaWRlIG9mIGxvY2FsIC5lbnYgZm9yIHRoYXQgb2YgdGhlIGRvdGVudi12YWx1dCBpbmplY3RlZCBzZWNyZXRzLlxuICAgIC8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIGNvbnNvbGUubG9nKFtKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5WSVRFX0VOVl9UQVJHRVQpXSlcblxuICAgIC8vIFx1MjU2RFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIFx1MjUwMiBOT1RFOiBJTVBPUlRBTlRcbiAgICAvLyBcdTI1MDIgPiBpbmplY3QgZW52aXJvbm1lbnQgc2VjcmV0cy5cbiAgICAvLyBcdTI1NzBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBwcm9jZXNzLmVudiA9XG4gICAge1xuICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICAuLi5sb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXG4gICAgfTtcblxuICAgIC8vIFx1MjU2RFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIFx1MjUwMiBOT1RFOiBbXHVEODNEXHVEQzFFXVxuICAgIC8vIFx1MjUwMiBcdTI3QTQgW3BhcnQtMl0gVGVzdGluZyBmb3Igb3ZlcnJpZGUgb2YgbG9jYWwgLmVudiBmb3IgdGhhdCBvZiB0aGUgZG90ZW52LXZhbHV0IGluamVjdGVkIHNlY3JldHMuXG4gICAgLy8gXHUyNTcwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gY29uc29sZS5sb2coW0pTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlZJVEVfRU5WX1RBUkdFVCldKVxuICAgIC8vIGNvbnNvbGUubG9nKFtKU09OLnN0cmluZ2lmeShsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpKV0pXG5cbiAgICBjb25zdFxuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIFx1RDgzRFx1RENERCBTY29yZXMgcGFjYWtnZSB2ZXJzaW9uXG4gICAgICAgKiBAbm90ZVxuICAgICAgICogUHJldmlvdXNseSB1c2VkIGFzIGBWSVRFX1NDT1JFU19QS0dfVkVSU0lPTj12LiQobnBtIHBrZyBnZXQgdmVyc2lvbiAtLXdvcmtzcGFjZXM9ZmFsc2UgfCB0ciAtZCBcXFxcXFxcIikgbnBtIHJ1biBbLi5dYFxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqID0+IDAuNVxuICAgICAgICovXG4gICAgICBfX1BLR19WRVJTSU9OX1NDT1JFU19fID0gdmVyc2lvbixcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBcdUQ4M0RcdURDREQgU2NvcmVzLUxpYiBwYWNrYWdlIHZlcnNpb25cbiAgICAgICAqIEBub3RlXG4gICAgICAgKiBQcmV2aW91c2x5IHVzZWQgYXMgYFZJVEVfU0NPUkVTX0xJQl9QS0dfVkVSU0lPTj12LiQobnBtIGluZm8gQGJldGFyZW5hL3Njb3Jlcy1saWIgdmVyc2lvbiB8IHRyIC1kIFxcXFxcXFwiKSBucG0gcnVuIFsuLl1gXG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICogPT4gMC41XG4gICAgICAgKi9cbiAgICAgIF9fUEtHX1ZFUlNJT05fU0NPUkVTX0xJQl9fID0gZGVwZW5kZW5jaWVzW1wiQGJldGFyZW5hL3Njb3Jlcy1saWJcIl0sXG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogXHVEODNEXHVEQ0REIEFkLUVuZ2luZSBwYWNrYWdlIHZlcnNpb25cbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKiA9PiAwLjVcbiAgICAgICAqL1xuICAgICAgX19QS0dfVkVSU0lPTl9BRF9FTkdJTkVfXyA9IGRlcGVuZGVuY2llc1tcIkBiZXRhcmVuYS9hZC1lbmdpbmVcIl1cbiAgICA7XG5cbiAgICAvLyBbXHVEODNEXHVEQzFFXVxuICAgIGNvbnNvbGUubG9nXG4gICAgKFxuICAgICAgdGFibGVcbiAgICAgIChcbiAgICAgICAgW1xuICAgICAgICAgIFsnXHVEODNEXHVEQ0FFIFtwcm9qZWN0XSB8Onwgc2NvcmVzJywgX19QS0dfVkVSU0lPTl9TQ09SRVNfX10sXG4gICAgICAgICAgWydcdUQ4M0RcdURDQUUgW2RlcGVuZGVuY3ldIHw6fCBAYmV0YXJlbmEvc2NvcmVzLWxpYicsIF9fUEtHX1ZFUlNJT05fU0NPUkVTX0xJQl9fXSxcbiAgICAgICAgICBbJ1x1RDgzRFx1RENBRSBbZGVwZW5kZW5jeV0gfDp8IEBiZXRhcmVuYS9hZC1lbmdpbmUnLCBfX1BLR19WRVJTSU9OX0FEX0VOR0lORV9fXSxcbiAgICAgICAgICBbJ1x1Mjc1MyBbY29uZGl0aW9uXSB8OnwgdXBsb2FkZWQgc2VudHJ5IHNvdXJjZW1hcCcsIHByb2Nlc3MuZW52Py5WSVRFX1NFTlRSWV9VUExPQURfU09VUkNFTUFQU10sXG4gICAgICAgICAgWydcdTI3NTMgW2NvbmRpdGlvbl0gfDp8IGxvZ2dpbmcnLCBwcm9jZXNzLmVudj8uVklURV9QUk9EX0xPR1NdLFxuICAgICAgICAgIFsnXHVEODNEXHVEQ0NDIFthcnRpZmFjdF0gfDp8IC5lbnYnLCBwcm9jZXNzLmVudj8uVklURV9FTlZfVEFSR0VUXSxcbiAgICAgICAgICBbJ1x1RDgzRFx1RENDQyBbdml0ZV0gfDp8IG1vZGUnLCBtb2RlXSxcbiAgICAgICAgICBbJ1x1RDgzRFx1RENDQyBbdml0ZV0gfDp8IGNvbW1hbmQnLCBjb21tYW5kXSxcbiAgICAgICAgICBbJ1x1RDgzRFx1RENDQyBbdml0ZV0gfDp8IHNzckJ1aWxkJywgc3NyQnVpbGRdLFxuICAgICAgICBdXG4gICAgICApXG4gICAgKTtcblxuICAgIHJldHVybiB7XG5cbiAgICAgIGRlZmluZTpcbiAgICAgIHtcbiAgICAgICAgX19QS0dfVkVSU0lPTl9TQ09SRVNfXzogYFwiJHtfX1BLR19WRVJTSU9OX1NDT1JFU19ffVwiYCxcbiAgICAgICAgX19QS0dfVkVSU0lPTl9TQ09SRVNfTElCX186IGBcIiR7X19QS0dfVkVSU0lPTl9TQ09SRVNfTElCX199XCJgLFxuICAgICAgICBfX1BLR19WRVJTSU9OX0FEX0VOR0lORV9fOiBgXCIke19fUEtHX1ZFUlNJT05fQURfRU5HSU5FX199XCJgXG4gICAgICB9LFxuXG4gICAgICBwbHVnaW5zOlxuICAgICAgW1xuICAgICAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgLy8gXHUyNTAyIE5PVEU6IElNUE9SVEFOVFxuICAgICAgICAvLyBcdTI1MDIgXHUyN0E0IG5lZWRzIHRvIGJlIHBsYWNlZCAnYmVmb3JlJyBzdmVsdGVraXQgY29tcGlsYXRpb24uXG4gICAgICAgIC8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICBzZW50cnlTdmVsdGVLaXRcbiAgICAgICAgKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNvdXJjZU1hcHNVcGxvYWRPcHRpb25zOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvcmc6IFwiYmV0YXJlbmFcIixcbiAgICAgICAgICAgICAgcHJvamVjdDogXCJzY29yZXMtcGxhdGZvcm1cIixcbiAgICAgICAgICAgICAgcmVsZWFzZTogcHJvY2Vzcy5lbnY/Lm5wbV9wYWNrYWdlX3ZlcnNpb24gPz8gdmVyc2lvbiA/PyAndi4wLjAuMCcsXG4gICAgICAgICAgICAgIHVwbG9hZFNvdXJjZU1hcHM6IHByb2Nlc3MuZW52Py5WSVRFX1NFTlRSWV9VUExPQURfU09VUkNFTUFQUyBhcyB1bmtub3duIGFzIHN0cmluZyA9PSAndHJ1ZScgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRvVXBsb2FkU291cmNlTWFwczogcHJvY2Vzcy5lbnY/LlZJVEVfU0VOVFJZX1VQTE9BRF9TT1VSQ0VNQVBTIGFzIHVua25vd24gYXMgc3RyaW5nID09ICd0cnVlJyA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgKSxcblxuICAgICAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgLy8gXHUyNTAyIE5PVEU6IFdBUk5JTkc6XG4gICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgaW1wb3J0ZWQgZnJvbSAndml0ZS1wbHVnaW4tY2h1bmstc3BsaXQnLlxuICAgICAgICAvLyBcdTI1MDIgXHUyN0E0IERPRVMgTk9UIFdPUkshIEJSRUFLUyBCVUlMRC9DT01QSUxFIVxuICAgICAgICAvLyBcdTI1NzBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgLy8gY2h1bmtTcGxpdFBsdWdpbih7IHN0cmF0ZWd5OiAnYWxsLWluLW9uZScgfSksXG5cbiAgICAgICAgLy8gXHUyNTZEXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgIC8vIFx1MjUwMiBOT1RFOiBXQVJOSU5HOlxuICAgICAgICAvLyBcdTI1MDIgXHUyN0E0IGltcG9ydGVkIGZyb20gJ3ZpdGUtcGx1Z2luLXByb2dyZXNzJy5cbiAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCBET0VTIE5PVCBXT1JLIEFTIEFEVkVSVElTRUQhXG4gICAgICAgIC8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICAvLyBwcm9ncmVzcygpLFxuXG4gICAgICAgIC8vIFx1MjU2RFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICAvLyBcdTI1MDIgTk9URTogV0FSTklORzpcbiAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCBpbXBvcnRlZCBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzcycuXG4gICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgRE9FUyBOT1QgV09SSyBBUyBBRFZFUlRJU0VEIVxuICAgICAgICAvLyBcdTI1NzBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgLy8gYy5jb21wcmVzcygpLFxuXG4gICAgICAgIC8vIFx1MjU2RFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICAvLyBcdTI1MDIgTk9URTogV0FSTklORzpcbiAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCBpbXBvcnRlZCBmcm9tICd2aXRlLXBsdWdpbi1wcmVsb2FkJy5cbiAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCBET0VTIE5PVCBXT1JLIEFTIEFEVkVSVElTRUQhXG4gICAgICAgIC8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICAvLyBwcmVsb2FkKCksXG5cbiAgICAgICAgLy8gSU1QT1JUQU5UXG4gICAgICAgIHN2ZWx0ZWtpdCgpLFxuICAgICAgICAvLyB2aXRlQ29tcHJlc3Npb24oKSxcblxuICAgICAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgLy8gXHUyNTAyIE5PVEU6XG4gICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgaW1wb3J0ZWQgZnJvbSAndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJy5cbiAgICAgICAgLy8gXHUyNTAyIFdBUk5JTkc6XG4gICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgb3ZlcnJpZGVzICdDU1MnIGltcG9ydGVkIGJ5ICdzdmVsdGUnICYgJ3N2ZWx0ZS1raXQnXG4gICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgcmVxdWlyZXMgdG8gYmUgaW1wb3J0ZWQgYSAnPGxpbmsgLi4uID4nIGluIHRoZSAnc3JjL2FwcC5odG1sJ1xuICAgICAgICAvLyBcdTI1MDIgSU1QT1JUQU5UXG4gICAgICAgIC8vIFx1MjUwMiBQbGVhc2UsIGZvbGxvdyB0aGUgZm9sbG93aW5nIHN0ZXBzICh0byBhdHRhaW4gZ29vZ2xlLWhhY2spXG4gICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgWzFdIFVuY29tbWVudCAoYmVsb3cpIGNvZGUtYmxvY2tcbiAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCBbMl0gUnVuIGBucG0gcnVuIGJ1aWxkYCBpbiBjb21tYW5kLWxpbmUgZm9yICdfdGhpc18nIHJvb3QgcHJvamVjdCBwYXRoLlxuICAgICAgICAvLyBcdTI1MDIgXHUyN0E0IFszXSBWYWxpZGF0ZSBuZXcgYC4vc3RhdGljL2FsbC1vbmUtY3NzLWNodW5rLmNzc2AgaGFzIGJlZW4gZ2VuZXJhdGVkLlxuICAgICAgICAvLyBcdTI1MDIgXHUyN0E0IFs0XSBDb21tZW50IChiZWxvdykgY29kZS1ibG9jay5cbiAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCBbNV0gQ29weSBuZXcgYENTU2AgdG8gYHNyYy9hcHAuaHRtbCA+IDxoZWFkPiA8c3R5bGU+IChkZXNpZ25hdGVkIGFyZWEpLlxuICAgICAgICAvLyBcdTI1MDIgXHUyN0E0IFs2XSBQdXNoIHRvIGBQcm9kdWN0aW9uYC5cbiAgICAgICAgLy8gXHUyNTcwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgIC8qXG4gICAgICAgICAgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luXG4gICAgICAgICAgKFxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgIC8vIHJlbGF0aXZlQ1NTSW5qZWN0aW9uOiB0cnVlLFxuXG4gICAgICAgICAgICAgIC8vIHRvcEV4ZWN1dGlvblByaW9yaXR5OiB0cnVlLFxuXG4gICAgICAgICAgICAgIC8vIGpzQXNzZXRzRmlsdGVyRnVuY3Rpb246IGZ1bmN0aW9uIGN1c3RvbUpzQXNzZXRzZmlsdGVyRnVuY3Rpb25cbiAgICAgICAgICAgICAgLy8gKFxuICAgICAgICAgICAgICAvLyAgIG91dHB1dENodW5rXG4gICAgICAgICAgICAgIC8vIClcbiAgICAgICAgICAgICAgLy8ge1xuXG4gICAgICAgICAgICAgIC8vICAgLy8gW1x1RDgzRFx1REMxRV1cbiAgICAgICAgICAgICAgLy8gICAvLyBcdTI1OTMgTk9URTpcbiAgICAgICAgICAgICAgLy8gICAvLyBcdTI1OTMgSXQgYXBwZWFycywgdGhlICdvdXRwdXRDaHVuay5maWxlbmFtZScgaXMgb2YgdHlwZTpcbiAgICAgICAgICAgICAgLy8gICAvLyBcdTI1OTMgLSBfYXBwL2ltbXV0YWJsZS9jaHVua3MvaW5kZXguMDg4Yjk4YTYuanNcbiAgICAgICAgICAgICAgLy8gICAvLyBcdTI1OTMgLSBfYXBwL2ltbXV0YWJsZS9jaHVua3MvaW5kZXguOGU4Y2E0Y2UuanNcbiAgICAgICAgICAgICAgLy8gICAvLyBcdTI1OTMgZXRjLlxuICAgICAgICAgICAgICAvLyAgIC8vIGNvbnNvbGUubG9nKG91dHB1dENodW5rLmZpbGVOYW1lKTtcblxuICAgICAgICAgICAgICAvLyAgIHJldHVybiBvdXRwdXRDaHVuay5maWxlTmFtZSA9PSAnaW5kZXguanMnO1xuICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgLy8gXHUyNTkzIE5PVEU6XG4gICAgICAgICAgICAgIC8vIFx1MjU5MyBkZWZpbml0aXZlICdoYWNrJyBzb2x1dGlvbiBmb3IgJ3NpbmdsZSBDU1MgZmlsZScgb3V0cHV0IGNodW5rLlxuICAgICAgICAgICAgICBpbmplY3RDb2RlOlxuICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgY3NzQ29kZSxcbiAgICAgICAgICAgICAgICBvcHRpb25zXG4gICAgICAgICAgICAgICk6IHN0cmluZyA9PlxuICAgICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZU9uZUNzc0ZpbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChnZW5lcmF0ZU9uZUNzc0ZpbGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgLy8gXHUyNTkzIE5PVEU6XG4gICAgICAgICAgICAgICAgICAvLyBcdTI1OTMgdGhlICdjc3NDb2RlJyBnZW5lcmF0ZWQgY29udGFpbnMgc29tZSAnZm9ybWF0dGluZycgaXNzdWVzLlxuICAgICAgICAgICAgICAgICAgLy8gXHUyNTkzIHJlbW92ZSAxc3QgYW5kIGxhc3Qgc3BlZWNoIG1hcmtzLlxuICAgICAgICAgICAgICAgICAgLy8gXHUyNTkzIHJlbW92ZSBjYXNlcyBvZiBgXFxuYCBjaGFycy5cbiAgICAgICAgICAgICAgICAgIC8vIFx1MjU5MyBjb3JyZWN0IGN1c3RvbSBjYXNlIG9mICdpZHMnLydjbGFzc2VzJyB1c2luZyB0aGUgJ2ZvcndhcmQtc2xhc2gnIGluIHRoZSBkZWNsYXJhdGlvbi5cbiAgICAgICAgICAgICAgICAgIGxldCBjc3NDb2RlTW9kOiBzdHJpbmcgPSBjc3NDb2RlLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgICAgICAgICAgIGNzc0NvZGVNb2QgPSBjc3NDb2RlTW9kLnJlcGxhY2UoL1xcXFxuL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgY3NzQ29kZU1vZCA9IGNzc0NvZGVNb2QucmVwbGFjZSgvXFxcXFxcXFwvZyxcIlxcXFxcIilcblxuICAgICAgICAgICAgICAgICAgLy8gXHUyNTkzIFdBUk5JTkc6XG4gICAgICAgICAgICAgICAgICAvLyBcdTI1OTMgJ2FsbC1jc3MtY2h1bmsuY3NzJyBtdXN0IGV4aXN0IGluc2lkZSAnL3N0YXRpYydcbiAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVxuICAgICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICAnLi9zdGF0aWMvYWxsLWNzcy1jaHVuay5jc3MnLFxuICAgICAgICAgICAgICAgICAgICBjc3NDb2RlTW9kLFxuICAgICAgICAgICAgICAgICAgICBlcnIgPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gYHRyeXtpZih0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcpe3ZhciBlbGVtZW50U3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO2VsZW1lbnRTdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgke2Nzc0NvZGV9KSk7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtZW50U3R5bGUpO319Y2F0Y2goZSl7Y29uc29sZS5lcnJvcigndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJywgZSk7fWBcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKSxcbiAgICAgICAgKi9cbiAgICAgIF0sXG5cbiAgICAgIGJ1aWxkOlxuICAgICAge1xuICAgICAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgLy8gXHUyNTAyIE5PVEU6XG4gICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgZ2V0cyBvdmVycmlkZGVuIGJ5IFN2ZWx0ZUtpdC5cbiAgICAgICAgLy8gXHUyNTcwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgIC8vIGNzc0NvZGVTcGxpdDogZmFsc2UsXG5cbiAgICAgICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgICAgIGNzc01pbmlmeTogJ2xpZ2h0bmluZ2NzcycsXG5cbiAgICAgICAgLy8gXHUyNTZEXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgIC8vIFx1MjUwMiBOT1RFOlxuICAgICAgICAvLyBcdTI1MDIgXHUyN0E0IHJvbGx1cCBjb25maWcuXG4gICAgICAgIC8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICByb2xsdXBPcHRpb25zOlxuICAgICAgICB7XG4gICAgICAgICAgb3V0cHV0OlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIG1hbnVhbENodW5rczogdW5kZWZpbmVkXG5cbiAgICAgICAgICAgIC8vIFx1RDgzRFx1REQxNyByZWFkLW1vcmUgOnw6IGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS9kaXNjdXNzaW9ucy85NDQwI2Rpc2N1c3Npb25jb21tZW50LTU5MTM3OThcbiAgICAgICAgICAgIC8vIFx1RDgzRFx1REQxNyByZWFkLW1vcmUgOnw6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4NjQzNzQzL3NlcGFyYXRpbmctbWF0ZXJpYWwtdWktaW4tdml0ZS1yb2xsdXAtYXMtYS1tYW51YWwtY2h1bmstdG8tcmVkdWNlLWNodW5rLXNpemVcbiAgICAgICAgICAgIG1hbnVhbENodW5rc1xuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgb3B0XG4gICAgICAgICAgICApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIFtcdUQ4M0RcdURDMUVdXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcblxuICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIGZzLmFwcGVuZEZpbGVcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAnLi9jaHVua3MtZnVsbC5qc29uJyxcbiAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgZXJyID0+XG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZnMuYXBwZW5kRmlsZVxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICcuL2NodW5rcy1mdWxsLmpzb24nLFxuICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkob3B0LCBudWxsLCA0KSxcbiAgICAgICAgICAgICAgICAgIGVyciA9PlxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgICAgICAgLy8gXHUyNTAyIE5PVEU6XG4gICAgICAgICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgdGVzdGluZyBmb3IgJ3Blci1wYWdlJyBjb21wb25lbnQgYnVpbGQgc3BsaXQuXG4gICAgICAgICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgd29ya3Mgd2VsbCwgYnV0IGF0IHRpbWVzIGluY29zaXN0ZW50LCBkdWUgdG8gQ1NTLlxuICAgICAgICAgICAgICAvLyBcdTI1NzBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgICAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdzcmMvbGliL2NvbXBvbmVudHMvX21haW5fJykpXG4gICAgICAgICAgICAgIC8vICAgcmV0dXJuICdNLW1haW4tc2luZ2xlLWNodW5rJztcbiAgICAgICAgICAgICAgLy8gO1xuXG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnc3JjLycpKVxuICAgICAgICAgICAgICAgIHJldHVybiAnTS1ob21lcGFnZS1zaW5nbGUtY2h1bmsnO1xuICAgICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdzcmMvbGliL3N0b3JlLycpKVxuICAgICAgICAgICAgICAvLyAgIHJldHVybiAnTS1zdG9yZXMtc2luZ2xlLWNodW5rJztcbiAgICAgICAgICAgICAgLy8gO1xuXG4gICAgICAgICAgICAgIC8vIGlmIChpZC5pbmNsdWRlcygnc3JjL2xpYi9maXJlYmFzZS8nKSlcbiAgICAgICAgICAgICAgLy8gICByZXR1cm4gJ00tZmlyZWJhc2Utc2luZ2xlLWNodW5rJztcbiAgICAgICAgICAgICAgLy8gO1xuXG4gICAgICAgICAgICAgIC8vIFx1MjU2RFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICAgICAgICAvLyBcdTI1MDIgTk9URTpcbiAgICAgICAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCB3b3JrcyB3ZWxsLCBidXQgYXQgdGltZXMgaW5jb3Npc3RlbnQsIHN1cGVyY2hhcmdlZCB3aXRoIGhhcmRjb2RlZCBDU1MuXG4gICAgICAgICAgICAgIC8vIFx1MjU3MFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICAgICAgICAvLyBpZiAoaWQuaW5jbHVkZXMoJ3NyYy8nKSlcbiAgICAgICAgICAgICAgLy8gICByZXR1cm4gJ00tc2luZ2xlLWNodW5rJztcbiAgICAgICAgICAgICAgLy8gO1xuXG4gICAgICAgICAgICAgIC8vIFx1MjU2RFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICAgICAgICAvLyBcdTI1MDIgTk9URTogV0FSTklORzpcbiAgICAgICAgICAgICAgLy8gXHUyNTAyIFx1MjdBNCBnaXZlcyBlcnJvciBvZiAnZGV2JyBpc3N1ZSBbP11cbiAgICAgICAgICAgICAgLy8gXHUyNTcwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgICAgICAgIC8vIGlmIChpZC5pbmNsdWRlcygnc3JjL2xpYi91dGlscy8nKSlcbiAgICAgICAgICAgICAgLy8gICByZXR1cm4gJ00tdXRpbHMtc2luZ2xlLWNodW5rJztcblxuICAgICAgICAgICAgICAvLyBcdUQ4M0RcdUREMTcgcmVhZC1tb3JlIDp8OiAoMXN0IGNvbW1lbnQpIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83MTU3ODYzMy84NDIxMjE1XG4gICAgICAgICAgICAgIC8vIGlmIChpZC5pbmRleE9mKFwicmVhY3RcIikgIT09IC0xKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgIC8vIFx1RDgzRFx1REQxNyByZWFkLW1vcmUgOnw6IGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9raXQvaXNzdWVzLzcyNTcjaXNzdWVjb21tZW50LTE1Mjg5NjIzNDhcbiAgICAgICAgICAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdAc2VudHJ5JykgJiYgIWlkLmluY2x1ZGVzKCdAc2VudHJ5L2Jyb3dzZXInKSAmJiAhaWQuaW5jbHVkZXMoJ0BzZW50cnkvdHJhY2luZycpKVxuICAgICAgICAgICAgICAvLyAgIHJldHVybiAndmVuZG9yX3NlbnRyeSdcblxuICAgICAgICAgICAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgICAgICAgLy8gXHUyNTAyIE5PVEU6XG4gICAgICAgICAgICAgIC8vIFx1MjUwMiBcdTI3QTQgb3JpZ2luYWxcbiAgICAgICAgICAgICAgLy8gXHUyNTcwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgICAgICAgIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpXG4gICAgICAgICAgICAgIC8vICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBcdUQ4M0RcdUREMTcgcmVhZC1tb3JlIDp8OiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzIwNTA5Ni9ydW4tc3ZlbHRla2l0LWRldi13aXRoLWh0dHBzXG4gICAgICAvKlxuICAgICAgICBzZXJ2ZXI6XG4gICAgICAgIHtcbiAgICAgICAgICBodHRwczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2NlcnQva2V5LnBlbWApLFxuICAgICAgICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vY2VydC9jZXJ0LnBlbWApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAqL1xuXG4gICAgICAvLyBcdTI1NkRcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgIC8vIFx1MjUwMiBOT1RFOlxuICAgICAgLy8gXHUyNTAyIFx1MjdBNCAoZGlzYWJsZWQpICd2aXRlc3QnIGludGVncmF0aW9uXG4gICAgICAvLyBcdTI1NzBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgIC8qXG4gICAgICAgIHRlc3Q6XG4gICAgICAgIHtcbiAgICAgICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8vKi57dGVzdCxzcGVjfS57anMsdHN9J10sXG4gICAgICAgICAgZ2xvYmFsczogdHJ1ZSxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICAgICAgICAvLyBzZXR1cEZpbGVzOiBbXCJzcmMvc2V0dXB0ZXN0LmpzXCJdLFxuICAgICAgICB9XG4gICAgICAqL1xuICAgIH1cbiAgfVxuKTtcbiIsICJ7XG5cdFwibmFtZVwiOiBcImJldGFyZW5hLXNjb3Jlcy1wbGF0Zm9ybVwiLFxuXHRcInZlcnNpb25cIjogXCIyLjE2LjBcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIkJldGFyZW5hIE9mZmljaWFsIFNjb3JlcyBQbGF0Zm9ybSAoUFdBKVwiLFxuXHRcImF1dGhvclwiOiBcIm1pZ2Jhc2hcIixcblx0XCJsaWNlbnNlXCI6IFwiSVNDXCIsXG5cdFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuXHRcImVuZ2luZXNcIjoge1xuXHRcdFwibm9kZVwiOiBcInYxOC4xOS4wXCIsXG5cdFx0XCJucG1cIjogXCIxMC4yLjNcIlxuXHR9LFxuXHRcImVuZ2luZVN0cmljdFwiOiB0cnVlLFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwicHJlcGFyZVwiOiBcImlzLWNpIHx8IGh1c2t5IGluc3RhbGxcIixcblx0XHRcInN0YXJ0XCI6IFwiY3Jvc3MtZW52IE5PREVfT1BUSU9OUz0nLXIgZG90ZW52L2NvbmZpZycgbm9kZSBidWlsZC9pbmRleC5qc1wiLFxuXHRcdFwiYnVpbGRcIjogXCJjcm9zcy1lbnYgTk9ERV9PUFRJT05TPSctciBkb3RlbnYvY29uZmlnIC0tbWF4LW9sZC1zcGFjZS1zaXplPTgxOTInIFZJVEVfU0VOVFJZX1VQTE9BRF9TT1VSQ0VNQVBTPXRydWUgdml0ZSBidWlsZFwiLFxuXHRcdFwiYnVpbGQtMlwiOiBcImNyb3NzLWVudiBOT0RFX09QVElPTlM9Jy1yIGRvdGVudi9jb25maWcgLS1tYXgtb2xkLXNwYWNlLXNpemU9ODE5MicgVklURV9TRU5UUllfVVBMT0FEX1NPVVJDRU1BUFM9dHJ1ZSB2aXRlIGJ1aWxkXCIsXG5cdFx0XCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0fDp8aW50ZWdyYXRpb24gJiYgbnBtIHJ1biB0ZXN0fDp8dW5pdFwiLFxuXHRcdFwic3ZlbHRlLWNoZWNrXCI6IFwic3ZlbHRlLWNoZWNrIC0tdHNjb25maWcgLi90c2NvbmZpZy5qc29uXCIsXG5cdFx0XCJzdmVsdGUtY2hlY2t8Onx3YXRjaFwiOiBcInN2ZWx0ZS1jaGVjayAtLXRzY29uZmlnIC4vdHNjb25maWcuanNvbiAtLXdhdGNoXCIsXG5cdFx0XCJwcmV0dGllcnw6fGVzbGludHw6fGxpbnRcIjogXCJwcmV0dGllciAtLWlnbm9yZS1wYXRoIC5naXRpZ25vcmUgLS1jaGVjayAtLXBsdWdpbi1zZWFyY2gtZGlyPS4gLiAmJiBlc2xpbnQgLS1pZ25vcmUtcGF0aCAuZ2l0aWdub3JlIC5cIixcblx0XHRcInByZXR0aWVyfDp8Zm9ybWF0XCI6IFwicHJldHRpZXIgLS1pZ25vcmUtcGF0aCAuZ2l0aWdub3JlIC0td3JpdGUgLS1wbHVnaW4tc2VhcmNoLWRpcj0uIC5cIixcblx0XHRcInByZXR0aWVyfDp8Zm9ybWF0fDp8c3JjXCI6IFwicHJldHRpZXIgLS1pZ25vcmUtcGF0aCAuZ2l0aWdub3JlIC0td3JpdGUgLS1wbHVnaW4tc2VhcmNoLWRpcj0uIC4vc3JjXCIsXG5cdFx0XCJzdmVsdGVraXR8OnxkZWJ1Z1wiOiBcImNyb3NzLWVudiBOT0RFX09QVElPTlM9Jy0taW5zcGVjdCcgdml0ZSBkZXYgLS1ob3N0IC0tcG9ydCAzMDUwXCIsXG5cdFx0XCJzdmVsdGVraXR8OnxkZWJ1Z3w6fGJ1bGxcIjogXCJjcm9zcy1lbnYgTk9ERV9ERUJVRz0nYnVsbCcgdml0ZSBwcmV2aWV3IC0taG9zdCAtLXBvcnQgNTAwMFwiLFxuXHRcdFwic3ZlbHRla2l0fDp8ZGVidWd8OnxwcmV2aWV3XCI6IFwiY3Jvc3MtZW52IE5PREVfT1BUSU9OUz0nLS1pbnNwZWN0JyB2aXRlIHByZXZpZXcgLS1ob3N0IC0tcG9ydCA0MTczXCIsXG5cdFx0XCJzdmVsdGVraXR8OnxkZXZcIjogXCJjcm9zcy1lbnYgTk9ERV9PUFRJT05TPSctciBkb3RlbnYvY29uZmlnJyB2aXRlIGRldiAtLWhvc3QgLS1wb3J0IDMwNTAgLS1mb3JjZVwiLFxuXHRcdFwic3ZlbHRla2l0fDp8ZGV2fDp8MS1jbGlja1wiOiBcInJtIC1yZiAuLy5zdmVsdGUta2l0LyAmJiBucG0gcnVuICdwa2d8OnxsaW5rfDp8QGJldGFyZW5hL3Njb3Jlcy1saWInICYmIG5wbSBscyAtLWxpbmsgLS1nbG9iYWwgJiYgbnBtIHJ1biBzYXNzLXdhdGNoICYgbnBtIHJ1biAnc3ZlbHRla2l0fDp8ZGV2J1wiLFxuXHRcdFwic3ZlbHRla2l0fDp8ZGV2fDp8MS1jbGlja3w6fHN0YW5kYXJkXCI6IFwicm0gLXIgLi8uc3ZlbHRlLWtpdC8gJiYgbnBtIHJ1biBzYXNzLXdhdGNoICYgbnBtIHJ1biAnc3ZlbHRla2l0fDp8ZGV2J1wiLFxuXHRcdFwic3ZlbHRla2l0fDp8ZGV2fDp8ZG9ja2VyXCI6IFwidml0ZSBkZXYgLS1ob3N0IC0tcG9ydCA1MDU1XCIsXG5cdFx0XCJzdmVsdGVraXR8OnxkZXZ8Onxkb2NrZXItdXBcIjogXCJkb2NrZXItY29tcG9zZSAtZiBkb2NrZXItY29tcG9zZS5kZXYueW1sIHVwXCIsXG5cdFx0XCJzdmVsdGVraXR8OnxzdGFnaW5nXCI6IFwibnBtIHJ1biBzdmVsdGVraXR8OnxkZXYgLS0gLS1tb2RlIHN0YWdpbmdcIixcblx0XHRcInN2ZWx0ZWtpdHw6fGJ1aWxkXCI6IFwidml0ZSBidWlsZFwiLFxuXHRcdFwic3ZlbHRla2l0fDp8cHJldmlld1wiOiBcInZpdGUgcHJldmlldyAtLWhvc3QgLS1wb3J0IDQxNzNcIixcblx0XHRcInN2ZWx0ZWtpdHw6fHByZXZpZXd8OnwxLWNsaWNrXCI6IFwibWFrZSBwcmV2aWV3LTEtY2xpY2stc3BpblwiLFxuXHRcdFwic3ZlbHRla2l0fDp8c3RhcnRcIjogXCJub2RlIGJ1aWxkL2luZGV4LmpzXCIsXG5cdFx0XCJzdmVsdGVraXR8OnxzdGFydHw6fGRvY2tlclwiOiBcImNyb3NzLWVudiBOT0RFX09QVElPTlM9Jy1yIGRvdGVudi9jb25maWcnIG5vZGUgZHVhbC5pbnN0YW5jZS5qc1wiLFxuXHRcdFwic3ZlbHRla2l0fDp8c3RhcnR8OnxoZXJva3VcIjogXCJub2RlIHNlcnZlci1oZXJva3UuanNcIixcblx0XHRcInBrZ3w6fG5leHR8OnxAYmV0YXJlbmEvc2NvcmVzLWxpYlwiOiBcIm5wbSBpIEBiZXRhcmVuYS9zY29yZXMtbGliQGxhdGVzdFwiLFxuXHRcdFwicGtnfDp8bGlua3w6fEBiZXRhcmVuYS9zY29yZXMtbGliXCI6IFwibnBtIGxpbmsgQGJldGFyZW5hL3Njb3Jlcy1saWJcIixcblx0XHRcInBrZ3w6fG5leHR8OnxAYmV0YXJlbmEvYWQtZW5naW5lXCI6IFwibnBtIGkgQGJldGFyZW5hL2FkLWVuZ2luZUBsYXRlc3RcIixcblx0XHRcInBrZ3w6fGxpbmt8OnxAYmV0YXJlbmEvYWQtZW5naW5lXCI6IFwibnBtIGxpbmsgQGJldGFyZW5hL2FkLWVuZ2luZVwiLFxuXHRcdFwicGtnfDp8bGlua3w6fEBiZXRhcmVuYS1zdWl0ZVwiOiBcIm5wbSBsaW5rIEBiZXRhcmVuYS9zY29yZXMtbGliIEBiZXRhcmVuYS9hZC1lbmdpbmVcIixcblx0XHRcInRlc3R8OnxpbnRlZ3JhdGlvblwiOiBcInBsYXl3cmlnaHQgdGVzdFwiLFxuXHRcdFwidGVzdHw6fGludGVncmF0aW9uLXVpXCI6IFwicGxheXdyaWdodCB0ZXN0IC0tdWlcIixcblx0XHRcInRlc3R8Onx1bml0XCI6IFwidml0ZXN0XCIsXG5cdFx0XCJjb3ZlcmFnZVwiOiBcInZpdGVzdCBydW4gLS1jb3ZlcmFnZVwiLFxuXHRcdFwic2Fzcy13YXRjaFwiOiBcInNhc3MgLS13YXRjaCBzdGF0aWMvYXBwLnNjc3Mgc3RhdGljL2FwcC5jc3NcIixcblx0XHRcInNlcnZlcnw6fGJ1aWxkXCI6IFwidHNjIC0tcHJvamVjdCB0c2NvbmZpZy5zZXJ2ZXIuanNvblwiXG5cdH0sXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcIkBiZXRhcmVuYS9hZC1lbmdpbmVcIjogXCIwLjAuNTFcIixcblx0XHRcIkBiZXRhcmVuYS9zY29yZXMtbGliXCI6IFwiNC4wLjM1XCIsXG5cdFx0XCJAbHVrZWVkL3V1aWRcIjogXCIyLjAuMVwiLFxuXHRcdFwiQG1ldGFtYXNrL3Nka1wiOiBcIjAuMS4wXCIsXG5cdFx0XCJAbW9yYWxpc3dlYjMvY2xpZW50LWZpcmViYXNlLWF1dGgtdXRpbHNcIjogXCIyLjE4LjRcIixcblx0XHRcIkBtb3JhbGlzd2ViMy9jbGllbnQtZmlyZWJhc2UtZXZtLWF1dGhcIjogXCIyLjE4LjRcIixcblx0XHRcIkBwbGF5d3JpZ2h0L3Rlc3RcIjogXCIxLjM2LjFcIixcblx0XHRcIkBzZW50cnkvYnJvd3NlclwiOiBcIjcuNzMuMFwiLFxuXHRcdFwiQHNlbnRyeS9zdmVsdGVraXRcIjogXCI3LjczLjBcIixcblx0XHRcIkBzZW50cnkvdHJhY2luZ1wiOiBcIjcuNDkuMFwiLFxuXHRcdFwiQHRpcHRhcC9jb3JlXCI6IFwiMi43LjRcIixcblx0XHRcIkB0aXB0YXAvZXh0ZW5zaW9uLWJ1YmJsZS1tZW51XCI6IFwiMi44LjBcIixcblx0XHRcIkB0aXB0YXAvZXh0ZW5zaW9uLWltYWdlXCI6IFwiMi44LjBcIixcblx0XHRcIkB0aXB0YXAvZXh0ZW5zaW9uLWxpbmtcIjogXCIyLjcuNFwiLFxuXHRcdFwiQHRpcHRhcC9leHRlbnNpb24tcGxhY2Vob2xkZXJcIjogXCIyLjcuNFwiLFxuXHRcdFwiQHRpcHRhcC9wbVwiOiBcIjIuNy40XCIsXG5cdFx0XCJAdGlwdGFwL3N0YXJ0ZXIta2l0XCI6IFwiMi43LjRcIixcblx0XHRcIkB0eXBlcy9ub2RlXCI6IFwiMjAuOC41XCIsXG5cdFx0XCJAd2FsbGV0Y29ubmVjdC93ZWIzLXByb3ZpZGVyXCI6IFwiMS44LjBcIixcblx0XHRcIkB3ZWIzbW9kYWwvZXRoZXJzNVwiOiBcIjMuNS43XCIsXG5cdFx0XCJib3hlblwiOiBcIjcuMS4xXCIsXG5cdFx0XCJjaGFsa1wiOiBcIjUuMy4wXCIsXG5cdFx0XCJjaGFydC5qc1wiOiBcIjQuNC4xXCIsXG5cdFx0XCJjb2xvcnRoaWVmXCI6IFwiMi40LjBcIixcblx0XHRcImNvbXByZXNzaW9uXCI6IFwiMS43LjRcIixcblx0XHRcImNvb2tpZVwiOiBcIjAuNS4wXCIsXG5cdFx0XCJkZXZpY2UtZGV0ZWN0b3ItanNcIjogXCIzLjAuM1wiLFxuXHRcdFwiZG9tcHVyaWZ5XCI6IFwiMy4xLjZcIixcblx0XHRcImRvdGVudlwiOiBcIjE2LjMuMVwiLFxuXHRcdFwiZW1haWwtdmFsaWRhdG9yXCI6IFwiMi4wLjRcIixcblx0XHRcImV0aGVyc1wiOiBcIjUuNy4yXCIsXG5cdFx0XCJleHByZXNzXCI6IFwiNC4xOC4yXCIsXG5cdFx0XCJleHByZXNzLXNzbGlmeVwiOiBcIjEuMi4wXCIsXG5cdFx0XCJmaXJlYmFzZVwiOiBcIjkuMjAuMFwiLFxuXHRcdFwiZ3JhcGhxbC1yZXF1ZXN0XCI6IFwiNS4xLjBcIixcblx0XHRcImdyYXBocWwtc3Vic2NyaXB0aW9ucy1jbGllbnRcIjogXCIwLjE2LjRcIixcblx0XHRcImhlcm9rdS1zc2wtcmVkaXJlY3RcIjogXCIwLjEuMVwiLFxuXHRcdFwiaWJhbnRvb2xzXCI6IFwiNC4zLjNcIixcblx0XHRcImlvcmVkaXNcIjogXCI1LjMuMlwiLFxuXHRcdFwibHotc3RyaW5nXCI6IFwiMS41LjBcIixcblx0XHRcIm1hc29ucnktbGF5b3V0XCI6IFwiNC4yLjJcIixcblx0XHRcIm1vcmFsaXNcIjogXCIyLjE4LjRcIixcblx0XHRcInJlcXVlc3QtaXBcIjogXCIzLjMuMFwiLFxuXHRcdFwic3ZlbHRlLWFwZXhjaGFydHNcIjogXCIxLjAuMlwiLFxuXHRcdFwic3ZlbHRlLWVhc3ktY3JvcFwiOiBcIjMuMC4xXCIsXG5cdFx0XCJ0YWJsZVwiOiBcIjYuOC4xXCIsXG5cdFx0XCJ1YS1wYXJzZXItanNcIjogXCIxLjAuMzVcIixcblx0XHRcInVuaXF1ZS11c2VybmFtZS1nZW5lcmF0b3JcIjogXCIxLjEuM1wiLFxuXHRcdFwidml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzXCI6IFwiMy4yLjFcIixcblx0XHRcInZpdGUtcGx1Z2luLXByZWxvYWRcIjogXCIwLjMuMVwiLFxuXHRcdFwieG1sLWZvcm1hdHRlclwiOiBcIjIuNi4xXCIsXG5cdFx0XCJjcm9zcy1lbnZcIjogXCI3LjAuM1wiXG5cdH0sXG5cdFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcIkBjb21taXRsaW50L2NsaVwiOiBcIjE3LjguMVwiLFxuXHRcdFwiQGNvbW1pdGxpbnQvY29uZmlnLWNvbnZlbnRpb25hbFwiOiBcIjE3LjguMVwiLFxuXHRcdFwiQHBsYXl3cmlnaHQvdGVzdFwiOiBcIjEuMzYuMVwiLFxuXHRcdFwiQHN2ZWx0ZWpzL2FkYXB0ZXItbm9kZVwiOiBcIjEuMy4xXCIsXG5cdFx0XCJAc3ZlbHRlanMva2l0XCI6IFwiMS4yMi4zXCIsXG5cdFx0XCJAdGVzdGluZy1saWJyYXJ5L2plc3QtZG9tXCI6IFwiNS4xNi41XCIsXG5cdFx0XCJAdGVzdGluZy1saWJyYXJ5L3N2ZWx0ZVwiOiBcIjQuMC4zXCIsXG5cdFx0XCJAdHlwZXMvZXhwcmVzc1wiOiBcIjUuMC4wXCIsXG5cdFx0XCJAdHlwZXMvbWFzb25yeS1sYXlvdXRcIjogXCI0LjIuNVwiLFxuXHRcdFwiQHR5cGVzL3VhLXBhcnNlci1qc1wiOiBcIjAuNy4zNlwiLFxuXHRcdFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCI1LjU5LjFcIixcblx0XHRcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCI1LjU5LjFcIixcblx0XHRcImNvbnZlbnRpb25hbC1jaGFuZ2Vsb2ctY2xpXCI6IFwiNC4xLjBcIixcblx0XHRcImN5cHJlc3NcIjogXCIxMi4xNy4xXCIsXG5cdFx0XCJjei1jb252ZW50aW9uYWwtY2hhbmdlbG9nXCI6IFwiMy4zLjBcIixcblx0XHRcImVzbGludFwiOiBcIjguNTEuMFwiLFxuXHRcdFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIjguOC4wXCIsXG5cdFx0XCJlc2xpbnQtcGx1Z2luLXN2ZWx0ZVwiOiBcIjIuMzQuMFwiLFxuXHRcdFwiaHVza3lcIjogXCI4LjAuM1wiLFxuXHRcdFwiaXMtY2lcIjogXCIzLjAuMVwiLFxuXHRcdFwianNkb21cIjogXCIyMi4xLjBcIixcblx0XHRcIm5vZGUtZmV0Y2hcIjogXCIzLjMuMlwiLFxuXHRcdFwicHJldHRpZXJcIjogXCIyLjguOFwiLFxuXHRcdFwicHJldHRpZXItcGx1Z2luLXN2ZWx0ZVwiOiBcIjIuMTAuMVwiLFxuXHRcdFwic2Fzc1wiOiBcIjEuNjkuNVwiLFxuXHRcdFwic3ZlbHRlXCI6IFwiNC4wLjVcIixcblx0XHRcInN2ZWx0ZS1jaGVja1wiOiBcIjMuNC42XCIsXG5cdFx0XCJzdmVsdGUtZG5kLWFjdGlvblwiOiBcIjAuOS40OVwiLFxuXHRcdFwic3ZlbHRlLXByZXByb2Nlc3NcIjogXCI1LjAuNFwiLFxuXHRcdFwic3ZlbHRlLXNlb1wiOiBcIjEuNS4zXCIsXG5cdFx0XCJ0c2xpYlwiOiBcIjIuNS4wXCIsXG5cdFx0XCJ0eXBlc2NyaXB0XCI6IFwiNS4zLjJcIixcblx0XHRcInZhbGlkYXRlLWJyYW5jaC1uYW1lXCI6IFwiMS4zLjBcIixcblx0XHRcInZpdGVcIjogXCI0LjQuNFwiLFxuXHRcdFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjogXCIwLjUuMVwiLFxuXHRcdFwidml0ZXN0XCI6IFwiMC4zMy4wXCJcblx0fSxcblx0XCJjb25maWdcIjoge1xuXHRcdFwiY29tbWl0aXplblwiOiB7XG5cdFx0XHRcInBhdGhcIjogXCIuL25vZGVfbW9kdWxlcy9jei1jb252ZW50aW9uYWwtY2hhbmdlbG9nXCJcblx0XHR9XG5cdH0sXG5cdFwiY29tbWl0bGludFwiOiB7XG5cdFx0XCJleHRlbmRzXCI6IFtcblx0XHRcdFwiQGNvbW1pdGxpbnQvY29uZmlnLWNvbnZlbnRpb25hbFwiXG5cdFx0XVxuXHR9LFxuXHRcInZhbGlkYXRlLWJyYW5jaC1uYW1lXCI6IHtcblx0XHRcInBhdHRlcm5cIjogXCJeKG1hc3RlcnxtYWlufGRldmVsb3B8ZGV2KXsxfSR8XihmZWF0dXJlfGZpeHxob3RmaXh8cmVsZWFzZXxyZWZhY3RvcnxjaG9yZSkuKyRcIixcblx0XHRcImVycm9yTXNnXCI6IFwiXHUyNzRDIFVoLW9oISBQbGVhc2UgY2hlY2sgcGFja2FnZS5qc29uID4gdmFsaWRhdGUtYnJhbmNoLW5hbWUgZm9yIGFsbG93ZWQgYnJhbmNoIG5hbWVzIVwiXG5cdH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFpQkEsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxpQkFBaUI7QUFDMUIsU0FBUyxhQUFhO0FBQ3RCLFNBQVMsZUFBZTtBQUN4QixTQUFTLG9CQUFvQjs7O0FDbkI1QixjQUFXO0FBZ0RYLG1CQUFnQjtBQUFBLEVBQ2YsdUJBQXVCO0FBQUEsRUFDdkIsd0JBQXdCO0FBQUEsRUFDeEIsZ0JBQWdCO0FBQUEsRUFDaEIsaUJBQWlCO0FBQUEsRUFDakIsMkNBQTJDO0FBQUEsRUFDM0MseUNBQXlDO0FBQUEsRUFDekMsb0JBQW9CO0FBQUEsRUFDcEIsbUJBQW1C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
