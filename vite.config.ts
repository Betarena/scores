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

import { sveltekit } from "@sveltejs/kit/vite";
import fs from "fs-extra";
import path from "path";
import { table } from "table";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

import { partytownVite } from "@qwik.dev/partytown/utils";
import { visualizer } from "rollup-plugin-visualizer";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

import { isSSR } from "./.vite/env.ts";
import { sveltekitCssPurge } from "./.vite/sveltekit-build-css-unused.2.ts";
import { sveltekitSsrOrCsrBuild } from "./.vite/sveltekit-build-env.ts";
import { sveltekitBuildMinifyPlugin } from "./.vite/sveltekit-build-minify.ts";
import { buildSizePlugin } from "./.vite/sveltekit-build-size.ts";

import { dependencies, version } from "./package.json";

import type { TemplateType } from "rollup-plugin-visualizer/dist/plugin/template-types";

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const /**
   * @description
   * 📝 Vite configuration options object
   */
  objViteConfigOptions = {
    /**
     * @description
     * 📝 Plugin configuration options
     */
    objPluginConfig: {
      cssInjectedByJsPlugin: {
        isEnabled: false,
        outputPath: "./static/css/one-css-chunk.css",
      },
      partytown: {
        // ╭─────
        // │ NOTE:
        // │ |: Disabled because already added manually to 'static/~partytown' folder.
        // ╰─────
        isEnabled: false,
      },
      visualizer: {
        isEnabled: true,
        objConfig: {
          type: "treemap", // options: 'sunburst' | 'treemap' | 'network' | 'raw-data' | 'list' | 'flamegraph'
        } as { type: TemplateType },
      },
      _customBuildSizePlugin: {
        isEnabled: true,
      },
      _customSveltekitSsrOrCsrPlugin: {
        isEnabled: true,
      },
      _customSveltekitPurgeCssPlugin: {
        isEnabled: false,
      },
      _customSveltekitBuildMinifyPlugin: {
        isEnabled: true,
      },
    },
    /**
     * @description
     * 📝 Meta configuration options
     */
    objMetaConfig: {
      outputMetricsPath: "./.output/metrics",
    },
  },
  /**
   * @description
   * 📝 Object counter for file-types encountered during build.
   */
  objBuildFileCounter = {
    svelteFiles: 0,
    jsFiles: 0,
    cssFiles: 0,
    totalFiles: 0,
  },
  // ╭─────
  // │ NOTE:
  // │ |: destructuring assignment
  // ╰─────
  [dateCurrent] = [
    new Date().toISOString().split("T")[0] +
      `_` +
      new Date().getHours().toString().padStart(2, "0") +
      `-` +
      new Date().getMinutes().toString().padStart(2, "0") +
      `-` +
      new Date().getSeconds().toString().padStart(2, "0"),
  ];
// #endregion ➤ 📌 VARIABLES

export default defineConfig(async ({ command, mode, ssrBuild }) => {
  // ╭─────
  // │ NOTE: [🐞]
  // │ │: [step.1] - validating override of local '.env' secrets, by those in 'dotenv-valut'.
  // ╰─────
  console.log(`📜 [1] Loaded using (file): ${process.env.VITE_ENV_TARGET}`);

  // ╭─────
  // │ NOTE: IMPORTANT
  // │ │: inject environment secrets.
  // ╰─────
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  // ╭─────
  // │ NOTE: [🐞]
  // │ │: [step.2] - validating override of local '.env' secrets, by those in 'dotenv-valut'.
  // ╰─────
  console.log(`📜 [2] Loaded using (file): ${process.env.VITE_ENV_TARGET}`);

  // ╭─────
  // │ NOTE: IMPORTANT
  // │ |: Disable logging of 'process.env' values, when 'CI_GITHUB_DEPLOYMENT_STAGING' is set.
  // │ |: This is done for secret(s) protection.
  // ╰─────
  if (process.env.CI_GITHUB_DEPLOYMENT_STAGING == undefined) {
    console.log(
      "📜 [3] Loaded using (file): .env.ci-github-deployment-staging"
    );
    // [🐞]
    console.log(
      `
        // ╭──────────────────────────────────────────────────────────────────────────────────╮
        // │ 🔒 Loaded secrets ⬇️                                                             │
        // ╰──────────────────────────────────────────────────────────────────────────────────╯
        `.replaceAll("  ", "")
    );
    // [🐞]
    console.log(loadEnv(mode, process.cwd()));
  }

  const /**
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
    __PKG_VERSION_AD_ENGINE__ = dependencies["@betarena/ad-engine"];
  // [🐞]
  console.log(
    table([
      ["💮 [project] |:| scores", __PKG_VERSION_SCORES__],
      ["💮 [dependency] |:| @betarena/scores-lib", __PKG_VERSION_SCORES_LIB__],
      ["💮 [dependency] |:| @betarena/ad-engine", __PKG_VERSION_AD_ENGINE__],
      [
        "❓ [condition] |:| uploaded sentry sourcemap",
        process.env?.VITE_SENTRY_UPLOAD_SOURCEMAPS,
      ],
      ["❓ [condition] |:| logging", process.env?.VITE_PROD_LOGS],
      ["📌 [artifact] |:| .env", process.env?.VITE_ENV_TARGET],
      ["📌 [vite] |:| mode", mode],
      ["📌 [vite] |:| command", command],
      ["📌 [vite] |:| ssrBuild", ssrBuild],
    ])
  );

  // ╭─────
  // │ CHECK:
  // │ |: for, metrics output directory exists.
  // ╰─────
  if (command === "build")
    await fs.ensureDir(
      `${objViteConfigOptions.objMetaConfig.outputMetricsPath}/${dateCurrent}`
    );
  const /**
     * @description
     * 📝 Flag indicating if building for SSR
     */
    strGlobalCssFileContent = await fs.readFile("./static/app.css", "utf8");
  return {
    // appType: 'custom',

    define: {
      __PKG_VERSION_SCORES__: `"${__PKG_VERSION_SCORES__}"`,
      __PKG_VERSION_SCORES_LIB__: `"${__PKG_VERSION_SCORES_LIB__}"`,
      __PKG_VERSION_AD_ENGINE__: `"${__PKG_VERSION_AD_ENGINE__}"`,
    },

    plugins: [
      // ╭─────
      // │ NOTE:
      // │ │: using 'vite-plugin-chunk-split' NPM package.
      // ┣─────
      // │ │: ❌ DOES NOT WORK! BREAKS BUILD/COMPILE!
      // ╰─────
      // ╭─────
      // │ NOTE:
      // │ │: using 'vite-plugin-progress' NPM package.
      // ┣─────
      // │ │: ❌ DOES NOT WORK AS ADVERTISED!
      // ╰─────
      // ╭─────
      // │ NOTE:
      // │ │: imported from 'vite-plugin-compress' NPM package.
      // ┣─────
      // │ │: ❌ DOES NOT WORK AS ADVERTISED!
      // ╰─────
      // ╭─────
      // │ NOTE:
      // │ │: imported from 'vite-plugin-compression' NPM package.
      // ┣─────
      // │ │: ❌ DOES NOT WORK AS ADVERTISED!
      // ╰─────
      // ╭─────
      // │ NOTE:
      // │ │: imported from 'vite-plugin-preload' NPM package.
      // ┣─────
      // │ │: ❌ DOES NOT WORK AS ADVERTISED!
      // ╰─────
      // ╭─────
      // │ NOTE: IMPORTANT
      // │ │: imported from '@sentry/sveltekit' NPM package.
      // ┣─────
      // │ │: needs to be placed 'BEFORE' sveltekit compilation.
      // ╰─────
      // sentrySvelteKit
      // (
      //   {
      //     sourceMapsUploadOptions:
      //     {
      //       org: "betarena",
      //       project: "scores-platform",
      //       release: process.env?.npm_package_version ?? version ?? 'v.0.0.0',
      //       uploadSourceMaps: process.env?.VITE_SENTRY_UPLOAD_SOURCEMAPS as unknown as string == 'true' ? true : false
      //     },
      //     autoUploadSourceMaps: process.env?.VITE_SENTRY_UPLOAD_SOURCEMAPS as unknown as string == 'true' ? true : false
      //   }
      // ),
      // ╭─────
      // │ IMPORTANT
      // │ │: official svelte-kit plugin
      // ╰─────
      sveltekit(),
      // ╭─────
      // │ NOTE:
      // │ │: imported from '@erbelion/vite-plugin-sveltekit-purgecss' NPM package.
      // ┣─────
      // │ │: ❔ NOT TESTED YET!
      // ╰─────
      // ╭─────
      // │ NOTE:
      // │ │: imported from 'vite-plugin-lightningcss' NPM package.
      // ┣─────
      // │ │: ❔ NOT TESTED YET!
      // ╰─────
      // ╭─────
      // │ IMPORTANT
      // │ │: Partytown integration plugin
      // ╰─────
      objViteConfigOptions.objPluginConfig.partytown.isEnabled &&
        partytownVite({
          dest: path.join(__dirname, "dist", "~partytown"),
        }),
      // ╭─────
      // │ NOTE:
      // │ │: using 'vite-plugin-css-injected-by-js'
      // │ WARNING:
      // │ │: overrides 'CSS' imported by 'svelte' & 'svelte-kit'
      // │ │: requires to be imported as a '<link ... >' tag in the 'src/app.html' manually.
      // │ IMPORTANT
      // │ │: INSTRUCTIONS:
      // │ │: Please, follow the following steps (to attain google-hack)
      // │ │: [1] Un-comment (below) code-block
      // │ │: [2] Run `npm run build` in command-line for '_this_' root project path.
      // │ │: [3] Validate new `./static/all-one-css-chunk.css` has been generated.
      // │ │: [4] Re-comment (below) code-block.
      // │ │: [5] Copy new `CSS` to `src/app.html > <head> <style> (designated area).
      // │ │: [6] Push to `Production`.
      // ╰─────
      objViteConfigOptions.objPluginConfig.cssInjectedByJsPlugin.isEnabled &&
        cssInjectedByJsPlugin({
          // relativeCSSInjection: true,

          // topExecutionPriority: true,

          // jsAssetsFilterFunction: function customJsAssetsfilterFunction
          // (
          //   outputChunk
          // )
          // {
          // ╭─────
          // │ NOTE:
          // │ |: It appears, the 'outputChunk.filename' is of type:
          // │ |: - _app/immutable/chunks/index.088b98a6.js
          // │ |: - _app/immutable/chunks/index.8e8ca4ce.js
          // ╰─────
          // console.log(outputChunk.fileName);
          //   return outputChunk.fileName == 'index.js';
          // }

          // ╭─────
          // │ NOTE:
          // │ |: 🟩 definitive 'HACK' (solution) for 'single CSS file' output chunk.
          // ╰─────
          injectCode: (cssCode, options): string => {
            // [🐞]
            console.log("🚦 Running cssInjectedByJsPlugin :: injectCode ...");

            // ╭─────
            // │ NOTE:
            // │ |: the 'cssCode' generated contains some 'formatting' issues.
            // │ WARNING: IMPORTANT
            // │ |: remove 1st and last speech marks.
            // │ |: remove cases of `\n` chars.
            // │ |: correct custom case of 'ids'/'classes' using the 'forward-slash' in the declaration.
            // ╰─────
            const cssCodeMod = cssCode
              .slice(1, -1)
              .replace(/\\n/g, "")
              .replace(/\\\\/g, "\\");
            // ╭─────
            // │ NOTE:
            // │ |: output to file-system.
            // ╰─────
            fs.writeFile(
              objViteConfigOptions.objPluginConfig.cssInjectedByJsPlugin
                .outputPath,
              cssCodeMod,
              (err) => {
                if (err) console.error(err);
              }
            );

            return "";

            // return `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('vite-plugin-css-injected-by-js', e);}`
          },
        }),
      // ╭─────
      // │ NOTE:
      // │ │: using 'rollup-plugin-visualizer'
      // │ │: @description: helper for visualizing bundled code output.
      // ╰─────
      objViteConfigOptions.objPluginConfig.visualizer.isEnabled &&
        visualizer({
          // emitFile: true,
          // brotliSize: true,
          // gzipSize: true,
          filename: `${
            objViteConfigOptions.objMetaConfig.outputMetricsPath
          }/${dateCurrent}/${isSSR ? "ssr" : "csr"}.visualizer.stats.${mode}.${
            objViteConfigOptions.objPluginConfig.visualizer.objConfig.type
          }.html`,
          title: "[metrics] scores - vite.visualizer",
          template:
            objViteConfigOptions.objPluginConfig.visualizer.objConfig.type,
        }),
      // ╭─────
      // │ NOTE:
      // │ |: custom 'vite' plugin.
      // │ |: @description: detect 'SSR' or 'CSR' build phase.
      // ╰─────
      objViteConfigOptions.objPluginConfig._customSveltekitSsrOrCsrPlugin
        .isEnabled && sveltekitSsrOrCsrBuild(),
      // ╭─────
      // │ NOTE:
      // │ |: custom 'vite' plugin.
      // │ |: @description: build size output reporting plugin
      // ╰─────
      objViteConfigOptions.objPluginConfig._customBuildSizePlugin.isEnabled &&
        buildSizePlugin("build"),
      // ╭─────
      // │ NOTE:
      // │ |: custom 'vite' plugin.
      // │ |:  @description: (1) analyze 'CSS' variable usage, (2) report unused 'CSS' vars & purge unused 'CSS' vars.
      // ╰─────
      objViteConfigOptions.objPluginConfig._customSveltekitPurgeCssPlugin
        .isEnabled &&
        sveltekitCssPurge({
          strGlobalCssFileContent,
          strOutputFilePathPrefix: `${objViteConfigOptions.objMetaConfig.outputMetricsPath}/${dateCurrent}`,
          _strDebugLevel: "info",
        }),
      // ╭─────
      // │ NOTE:
      // │ │: [CUSTOM] :: lightweight progress indicator plugin.
      // ╰─────
      // progressLite(),
      // ╭─────
      // │ NOTE:
      // │ │: [CUSTOM] :: minify build output plugin.
      // ╰─────
      objViteConfigOptions.objPluginConfig._customSveltekitBuildMinifyPlugin
        .isEnabled && sveltekitBuildMinifyPlugin(),
    ],

    build: {
      // ╭─────
      // │ NOTE: WARNING:
      // │ │: 'cssCodeSplit' gets overridden by 'svelte-kit' plugin.
      // ╰─────
      // cssCodeSplit: false,
      minify: false,
      cssMinify: "lightningcss",

      rollupOptions: {
        output: {
          // ╭─────
          // │ NOTE:
          // │ │: [disabled]
          // ┣─────
          // │ 🔗 read-more :|: https://github.com/vitejs/vite/discussions/9440#discussioncomment-5913798
          // │ 🔗 read-more :|: https://stackoverflow.com/questions/68643743/separating-material-ui-in-vite-rollup-as-a-manual-chunk-to-reduce-chunk-size
          // ╰─────
          // manualChunks: undefined
          manualChunks(id, opt) {
            // [🐞]
            // console.log(id);

            // [🐞]
            objBuildFileCounter.svelteFiles += id.includes(".svelte") ? 1 : 0;
            objBuildFileCounter.jsFiles += id.includes(".js") ? 1 : 0;
            objBuildFileCounter.cssFiles += id.includes(".css") ? 1 : 0;
            objBuildFileCounter.totalFiles += 1;

            // ╭─────
            // │ NOTE:
            // │ |: logging all chunk data to file.
            // ╰─────
            fs.appendFile(
              `${objViteConfigOptions.objMetaConfig.outputMetricsPath}/${dateCurrent}/chunks.json`,
              id + "\n",
              // ╭─────
              // │ NOTE:
              // │ |: alternative approach
              // ╰─────
              // JSON.stringify(opt, null, 4),
              (err) => {
                if (err) console.error(err);
              }
            );

            // ╭─────
            // │ NOTE:
            // │ |: logging all chunk count to file.
            // ╰─────
            fs.writeFile(
              `${objViteConfigOptions.objMetaConfig.outputMetricsPath}/${dateCurrent}/chunks.count.json`,
              JSON.stringify(objBuildFileCounter, null, 4) + "\n",
              // ╭─────
              // │ NOTE:
              // │ |: alternative approach
              // ╰─────
              // JSON.stringify(opt, null, 4),
              (err) => {
                if (err) console.error(err);
              }
            );

            // ╭─────
            // │ IMPORTANT
            // │ |: Run-Time Application Configuration Chunk
            // ╰─────
            if (id.includes("src/lib/constants/config"))
              return "__run-time-config";
            // ╭─────
            // │ IMPORTANT
            // │ |: Application Styles Chunk
            // ╰─────
            if (id.includes("static/app.scss")) return "__app-styles";
            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 💠 │ CHUNKING STRATEGIES - EXPERIMENTAL                                          │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯

            // if (id.includes('src/'))
            //   return 'single-chunk-js';
            // ;
            // if (id.includes('src/lib/components') && id.includes('.css'))
            //   return 'single-chunk-css';
            // ;
            // if (id.includes('src/lib/store/'))
            //   return 'single-chunk-lib-store';
            // ;
            // if (id.includes('src/lib/firebase/'))
            //   return 'single-chunk-lib-firebase';
            // ;
            // if (id.includes('src/lib/utils/'))
            //   return 'single-chunk-lib-utils';
            // ;

            // if (id.includes('src/lib')) // ⮕ Worsens Lightouse Performance (FCP) score
            // if (id.includes('src/lib/components')) // ⮕ (worsens,slightly) Lightouse Performance (FCP) Scores
            // if (id.includes('src/lib') && id.includes('.js')) // ⮕ Worsens Lightouse Performance (FCP) score
            // if (id.includes('src/lib/components') && id.includes('.css')) // ⮕ (worsens,slightly) Lightouse Performance (FCP) Scores
            //   return id
            //     .toString()
            //     .split('src/lib/')[1]
            //     // @ts-expect-error
            //     .replaceAll('/','_')
            //   ;
            // ;

            // ╭──────────────────────────────────────────────────────────────────────────────────╮
            // │ 💠 │ CHUNKING STRATEGIES - NODE_MODULES                                          │
            // ╰──────────────────────────────────────────────────────────────────────────────────╯

            // ╭─────
            // │ NOTE:
            // │ │: 🔗 read-more :|: https://github.com/sveltejs/kit/issues/7257#issuecomment-1528962348
            // ╰─────
            // if (id.includes('@sentry') && !id.includes('@sentry/browser') && !id.includes('@sentry/tracing'))
            //   return 'vendor_sentry'
            // ;

            // ╭─────
            // │ NOTE:
            // │ │: original suggestion
            // │ │: 🔗 read-more :|: https://github.com/vitejs/vite/discussions/9440#discussioncomment-5913798
            // ╰─────
            // if (id.includes('node_modules'))
            //   return id
            //     .toString()
            //     .split('node_modules/')[1]
            //     // .split('/')[0] // [1] option.1
            //     // @ts-expect-error
            //     .replaceAll('/','_') // [2] option.2 // ⮕ (improves) Lightouse Performance (FCP) Scores
            //     .toString()
            //   ;
            // ;

            if (id.includes("node_modules")) {
              // 1. Firebase (firestore, auth, app)
              if (id.includes("firebase")) {
                return "vendor_firebase";
              }

              // 2. Web3 & Crypto (WalletConnect, Ethers, Web3Modal)
              if (
                id.includes("ethers") ||
                id.includes("walletconnect") ||
                id.includes("metamask") ||
                id.includes("@web3modal") ||
                id.includes("@stablelib")
              ) {
                return "vendor_web3";
              }

              // 3. mobiles.json (1.2 MiB)
              if (id.includes("device-detector-js")) {
                return "vendor_device_detector";
              }

              // 4. DotLottie (0.5 MiB)
              if (id.includes("lottie")) {
                return "vendor_lottie";
              }

              // 5. (Chart.js)
              if (id.includes("chart.js")) {
                return "vendor_charts";
              }
            }

            //
          },
        },
      },

      ssrManifest: true,
      reportCompressedSize: true,

      // sourcemap: "hidden"
    },

    // css:
    // {
    //   lightningcss:
    //   {
    //     unusedSymbols: true
    //   }
    // },

    server: {
      host: "0.0.0.0",
      port: 3050,
      // ╭─────
      // │ NOTE:
      // ┣─────
      // │ 🔗 read-more :|: https://stackoverflow.com/questions/73205096/run-sveltekit-dev-with-https
      // ╰─────
      // https:
      // {
      //   key: fs.readFileSync(`${__dirname}/cert/key.pem`),
      //   cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
      // }
    },

    preview: {
      host: "0.0.0.0",
      port: 3050,
    },

    // ╭─────
    // │ NOTE:
    // │ │: [disabled] 'vitest' integration
    // ╰─────
    // test:
    // {
    //   include: ['src/**//*.{test,spec}.{js,ts}'],
    //   globals: true,
    //   environment: 'jsdom',
    //   // setupFiles: ["src/setuptest.js"],
    // }
  };
});
