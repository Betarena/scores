// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // November 11th, 2025 3:20 PM                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Vite plugin to calculate the size of the build output folder.
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import chalk from 'chalk';
import ffs from 'fast-folder-size';

import type { PluginOption } from 'vite';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   */
  strConsolePrefix = chalk.bgGreen(`[vite.plugin.sveltekit-build-size]`)
;

// #endregion ➤ 📌 VARIABLES

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Convert bytes to a human-readable format.
 * @example
 *  humanReadable(1024); // "1.00 KB"
 * @param { number } bytes
 *  ❗️ **REQUIRED** The number of bytes.
 * @return { string }
 *  📤 The human-readable string representation of the byte size.
 */
function humanReadable
(
  bytes: number
): string
{
  if (bytes === 0)
    return '0 B';
  ;

  const
    // ╭─────
    // │ NOTE:
    // │ |: destructuring assignment
    // ╰─────
    [
      i,
      sizes,
    ] = [
      (Math.floor(Math.log(bytes) / Math.log(1024))),
      ['B', 'KB', 'MB', 'GB', 'TB']
    ]
  ;

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export function buildSizePlugin
(
  buildFolder: string = 'build',
): PluginOption
{
  return {
    name: '_betarena.vite.plugin.sveltekit-build-size',

    closeBundle: () =>
    {
      ffs
      (
        buildFolder,
        (
          err,
          totalBytes
        ) =>
        {
          if (err)
          {
            // [🐞]
            console.error
            (
              'Error calculating folder size:',
              err
            );
            return;
          }

          // [🐞]
          console.log
          (
            `
            ${strConsolePrefix}
            ╭──────────────────────────────────────────────────────────────────────────────────╮
            │ 🚨 Total size of ${buildFolder}: ${humanReadable(totalBytes ?? 0)}
            ╰──────────────────────────────────────────────────────────────────────────────────╯
            `.replaceAll('  ','')
          );

          return;
        }
      );

      return;
    },
  };
}
