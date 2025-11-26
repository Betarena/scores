// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // November 23rd, 2025 6:58 PM                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Vite Plugin to Minify SvelteKit Build Output Chunks
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import chalk from "chalk";
import { transform } from 'esbuild';

import type { PluginOption } from "vite";

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   * 📝 Console prefix for logging.
   */
  strConsolePrefix = chalk.bgWhite(`[_betarea.vite.plugin.sveltekit-build-minify]`)
;

// #endregion ➤ 📌 VARIABLES

export function sveltekitBuildMinifyPlugin
(
): PluginOption
{
  return {
    name: '_betarea.vite.plugin.sveltekit-build-minify',
    enforce: 'post',
    async generateBundle
    (
      _,
      bundle,
    )
    {
      // ╭─────
      // │ NOTE:
      // │ |: loop through all generated chunks and minify them using esbuild
      // ╰─────
      for (const fileName of Object.keys(bundle))
      {
        const
          /**
           * @description
           * 📝 instance of 'chunk'
           */
          chunk = bundle[fileName]
        ;

        // ╭─────
        // │ NOTE:
        // │ |: only process JavaScript chunks
        // ╰─────
        if (chunk.type === 'chunk' && fileName.endsWith('.js'))
        {
          // ╭─────
          // │ CHECK:
          // │ |: skip minification for runtime config chunk
          // ╰─────
          if (fileName.includes('__run-time-config'))
          {
            // [🐞]
            console.log(`${strConsolePrefix} Skipping minification for runtime config chunk: ${fileName}`);
            continue;
          }

          // [🐞]
          console.log(`${strConsolePrefix} fileName: ${fileName} ➤ minifying...`);

          const
            result
              = await transform
              (
                chunk.code,
                  {
                  minify: true,
                  legalComments: 'none',
                }
              )
          ;

          chunk.code = result.code;
        }
      }

      return;
    }
  };
}