// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // November 11th, 2025 3:18 PM                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Vite plugin to analyze CSS variable usage in Svelte files.
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import chalk from 'chalk';
import fs from 'fs-extra';

import type { PluginOption } from 'vite';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   */
  strConsolePrefix = chalk.bgCyan(`[_betarea.vite.plugin.sveltekit-purge-css]`)
;

let
  /**
   * @description
   */
  [
    strDebugLevel
  ] = [
    'info'
  ]
;

// #endregion ➤ 📌 VARIABLES

function log
(
  message: string,
  level: 'info' | 'warn' | 'error' | 'none' = 'info',
): void
{
  if (level === 'none') return;

  console.log('');

  if (level === 'error')
    console
      .log(`${strConsolePrefix} ${message}`)
    ;
  else if (level === 'warn' && (strDebugLevel === 'info' || strDebugLevel === 'warn'))
    console
      .log(`${strConsolePrefix} ${message}`)
    ;
  else if (level === 'info' && strDebugLevel === 'info')
    console
      .log(`${strConsolePrefix} ${message}`)
    ;
  ;

  return;
}

/**
 * @author
 *  @migbash
 * @description
 *  📝 Vite plugin to analyze CSS variable usage in Svelte files
 * @param param0
 *  ❗️ **REQUIRED** Object containing:
 *  - strGlobalCssFileContent: string - The content of the global CSS file to analyze.
 *  - strOutputFilePathPrefix?: string - Optional prefix for output file paths. Default is './css-variables-unused.json'.
 * @return { PluginOption }
 *  📤 Vite plugin option object.
 */
export function sveltekitCssPurge
(
  {
    strGlobalCssFileContent,
    strOutputFilePathPrefix = '.',
    strOutputFileName = 'css-variables-unused.json',
    _strDebugLevel = 'info',
  }:
  {
    strGlobalCssFileContent: string;
    strOutputFilePathPrefix?: string;
    strOutputFileName?: string;
    _strDebugLevel?: string;
  }
): PluginOption
{
  strDebugLevel = _strDebugLevel;

  const
    // ╭─────
    // │ NOTE:
    // │ |: destructure assignments
    // ╰─────
    [
      listAllCssVars,
      listAllCssClasses,
      //
      setDeclaredCssVars,
      setDeclaredCssClasses,
      //
      setUsedCssVarsInSvelteFiles,
      setUsedCssClassesInSvelteFiles,
      //
      mapDeclaredCssVarsToMinifiedNames,
    ] = [
      // strGlobalCssFileContent.matchAll(/--[A-Za-z0-9-]+:\s[A-Za-z0-9-()]+;/g),
      strGlobalCssFileContent.matchAll(/(--[A-Za-z0-9_-]+):\s+.*;/g),
      strGlobalCssFileContent.matchAll(/\.([A-Za-z0-9_-]+)(?!.*[;%)])/g),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Map<string, string>(),
    ]
  ;

  // [🐞]
  // console.log('strGlobalCssFileContent', strGlobalCssFileContent);

  for (const element of listAllCssVars)
  {
    // [🐞]
    // console.log(`${strConsolePrefix} css variable: ${element[1]}`);
    setDeclaredCssVars.add(element[1]);
  }

  for (const element of listAllCssClasses)
  {
    // [🐞]
    // console.log(`${strConsolePrefix} css class: ${element[1]}`);
    setDeclaredCssClasses.add(element[1]);
  }

  // [🐞]
  log
  (
    `
    ╭──────────────────────────────────────────────────────────────────────────────────╮
    │ 🚨 Total Declared CSS Vars :: ${setDeclaredCssVars.size}
    │ 🚨 Total Declared CSS Class :: ${setDeclaredCssClasses.size}
    ╰──────────────────────────────────────────────────────────────────────────────────╯
    `.replaceAll('  ','')
  );

  // ╭─────
  // │ TODO:
  // │ |: minify long variable names,
  // │ |: e.g., '--primary-button-background-color' -> '--a', etc.
  // │ |: apply that to the global CSS file, and to all Svelte files using those variables
  // ╰─────

  return {
    name: '_betarea.vite.plugin.sveltekit-purge-css',
    enforce: 'pre',

    transform
    (
      code,
      id,
    )
    {
      if (!id.endsWith('.svelte'))
        return;
      ;

      const
        // ╭─────
        // │ NOTE:
        // │ |: destructure assignments
        // ╰─────
        [
          _setUsed
        ] = [
          new Set < string >()
        ]
      ;

      // ╭─────
      // │ NOTE:
      // │ |: loop over all matches of 'var(--variable-name[..]' in the code (markup, script, style),
      // │ |: capturing USED CSS variable name
      // ╰─────
      for (const element of code.matchAll(/var\(\s*(--[A-Za-z0-9-_]+)/g))
      {
        //  [🐞]
        // console.log
        // (
        //   `${strConsolePrefix} CSS VAR is USED : ${chalk.green(element[1])}`
        // );

        _setUsed.add(element[1]);
        setUsedCssVarsInSvelteFiles.add(element[1]);
      }

      // ╭─────
      // │ NOTE:
      // │ |: loop over USED CSS variables, to check if they are used in the Svelte file.
      // ╰─────
      // for (const element of setDeclaredCssClasses)
      // {
      //   if (!code.includes(element)) continue;
      //   // [🐞]
      //   console.log
      //   (
      //     `${strConsolePrefix} CSS Class ${chalk.green(element)} is USED in ${chalk.yellow(id)}`
      //   );
      //   setUsedCssClassesInSvelteFiles.add(element);
      // }

      return;
    },

    closeBundle
    (
    )
    {
      // [🐞]
      log
      (
        `
        ╭──────────────────────────────────────────────────────────────────────────────────╮
        │ 🚨 $ Total Declared CSS Vars :: ${setDeclaredCssVars.size}
        │ 🚨 Total Used CSS Vars :: ${setUsedCssVarsInSvelteFiles.size}
        ╰──────────────────────────────────────────────────────────────────────────────────╯
        `.replaceAll('  ',''),
        'info'
      );

      const
        /**
         * @description
         * 📝 List of UNUSED CSS variables
         */
        listUnusedVars = [...setDeclaredCssVars]
          .filter(x => !setUsedCssVarsInSvelteFiles.has(x))
      ;

      // ╭─────
      // │ NOTE:
      // │ |: output file :: unused CSS variables
      // ╰─────
      fs.writeFile
      (
        `${strOutputFilePathPrefix}/${strOutputFileName}`,
        JSON.stringify(listUnusedVars, null, 4),
        err =>
        {
          if (err) console.error(err);
        }
      );

      /**
       * @author
       *  @migbash
       * @summary
       *  🔹 HELPER
       * @description
       *  📝 Mutate the global CSS file to comment out UNUSED CSS variables
       * @note
       *  - mutate/purge the global CSS file to remove unused CSS variables
       *  - output a 'app.purged.css' file with the unused CSS variables removed
       *  - use that file in the build process
       */
      function _helperGlobalCssFileMutate
      (
      ): void
      {
        let
          // ╭─────
          // │ NOTE:
          // │ |: destructure assignments
          // ╰─────
          [
            strModifiedCssCommented,
            strModifiedCssClean,
          ] = [
            strGlobalCssFileContent.toString(),
            strGlobalCssFileContent.toString(),
          ]
        ;

        // ╭─────
        // │ NOTE:
        // │ |: loop over, (1) UNUSED CSS variables and (2) comment them out in the CSS asset
        // ╰─────
        for (const unusedVar of listUnusedVars)
        {
          const
            // ╭─────
            // │ NOTE:
            // │ |: regex to match the CSS variable declaration line
            // ╰─────
            [
              regexVarDeclaration
            ] = [
              new RegExp(`${unusedVar}:.*;`, 'g')
            ]
          ;

          // [🐞]
          // console.log(`${strConsolePrefix} Removing unused CSS var :: ${unusedVar}, ${regexVarDeclaration}`);

          strModifiedCssCommented = strModifiedCssCommented
            .replace
            (
              regexVarDeclaration,
              `/* UNUSED-CSS-VAR: var(--${unusedVar}) */`
              // ''
            )
          ;

          strModifiedCssClean = strModifiedCssClean
            .replace
            (
              regexVarDeclaration,
              ''
            )
          ;
        }

        strModifiedCssClean = strModifiedCssClean
            // .replace
            // (
            //   /\n\s*\n/g,
            //   '\n'
            // )
            .replace
            (
              /\s+/g,
              ''
            )
        ;

        // ╭─────
        // │ NOTE:
        // │ |: output file :: purged CSS with comments
        // ╰─────
        fs.writeFile
        (
          `${strOutputFilePathPrefix}/app.purged.css`,
          strModifiedCssCommented,
          err =>
          {
            if (err) console.error(err);
          }
        );

        // ╭─────
        // │ NOTE:
        // │ |: output file :: purged CSS clean (no comments, no unused vars)
        // ╰─────
        fs.writeFile
        (
          `${strOutputFilePathPrefix}/app.purged.clean.css`,
          strModifiedCssClean,
          err =>
          {
            if (err) console.error(err);
          }
        );
      }

      _helperGlobalCssFileMutate();

      return;
    }
  };
}
