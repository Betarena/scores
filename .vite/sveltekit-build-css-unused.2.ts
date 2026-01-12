// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ├──────────────────────────────────────────────────────────────────────────────────┤
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // November 11th, 2025 3:18 PM                                   │
// ├──────────────────────────────────────────────────────────────────────────────────┤
// │ 📝 Description                                                                   │
// ├──────────────────────────────────────────────────────────────────────────────────┤
// │ BETARENA (Module)
// │ |: Vite plugin to analyze CSS variable usage in Svelte files.
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import chalk from 'chalk';
import fs from 'fs-extra';
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import sveltePreprocess from "svelte-preprocess";
import { parse, preprocess } from "svelte/compiler";

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { PluginOption } from 'vite';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  /**
   * @description
   */
  strConsolePrefix = chalk.bgCyan(`[_betarea.vite.plugin.sveltekit-purge-css]`),

  preprocessor = sveltePreprocess
    (
      {
        typescript: true,
        scss: true,
      }
    )
;

let
  /**
   * @description
   */
  [
    strDebugLevel,
    strOutputFilePathPrefix,
  ] = [
    'info',
    '.',
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
  strOutputFilePathPrefix = strOutputFilePathPrefix;

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
      strGlobalCssFileContent.matchAll(/\.([A-Za-z0-9_-]+)(?!.*[;%)])/g), // ❗️ innacurate regex for CSS classes
      //
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Map<string, string>(),
    ]
  ;

  extractClassesFromCSS(strGlobalCssFileContent);

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
    │ 🚨 Total (unique) Declared CSS Vars :: ${setDeclaredCssVars.size}
    │ 🚨 Total (unique) Used CSS Vars :: ${setUsedCssVarsInSvelteFiles.size}
    ├──────────────────────────────────────────────────────────────────────────────────┤
    │ 🚨 Total (unique) Declared CSS Class :: ${setDeclaredCssClasses.size}
    │ 🚨 Total (unique) Used CSS Class :: ${setUsedCssClassesInSvelteFiles.size}
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

    transform: async (
      code,
      id,
    ) =>
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
          _setUsedCssVarsInThisFile,
          _setUsedCssClassesInThisFile,
        ] = [
          new Set < string >(),
          await extractClassesFromSvelte(code, id),
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

        _setUsedCssVarsInThisFile.add(element[1]);
        setUsedCssVarsInSvelteFiles.add(element[1]);
      }

      _setUsedCssClassesInThisFile
        .forEach(item => setUsedCssClassesInSvelteFiles.add(item))
      ;

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
        │ 🚨 Total Declared CSS Vars :: ${setDeclaredCssVars.size}
        │ 🚨 Total Used CSS Vars :: ${setUsedCssVarsInSvelteFiles.size}
        ├──────────────────────────────────────────────────────────────────────────────────┤
        │ 🚨 Total Declared CSS Class :: ${setDeclaredCssClasses.size}
        │ 🚨 Total Used CSS Class :: ${setUsedCssClassesInSvelteFiles.size}
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
      // │ |: output file :: used CSS variables
      // ╰─────
      fs.writeFile
      (
        `${strOutputFilePathPrefix}/css-classes-used.json`,
        JSON.stringify(Array.from(setUsedCssClassesInSvelteFiles), null, 4),
        err =>
        {
          if (err) console.error(err);
        }
      );

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

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ HELPER                                                                      │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Extract CSS class names from given CSS text.
 * @param { string } cssText
 *  📝 Extract CSS class names from given CSS text.
 * @return { Set < string > }
 *  📝 Set of extracted CSS class names.
 */
function extractClassesFromCSS
(
  cssText: string
): Set < string >
{
  const
    /**
     * @description
     * 📝 PostCSS root node
     */
    root = postcss.parse(cssText),
    /**
     * @description
     * 📝 Set of CSS class names
     */
    classNames = new Set()
  ;

  root
    .walkRules
    (
      rule =>
      {
        rule.selectors
          .forEach
          (
            selector =>
            {
              selectorParser
                (
                  sel =>
                  {
                    sel.walkClasses
                    (
                      node =>
                      {
                        classNames.add(node.value);
                      }
                    );
                  }
                )
                .processSync
                (
                  selector
                )
              ;
            }
          )
        ;
      }
    )
  ;

  // [🐞]
  // log
  // (
  //   `Extracted CSS Classes: ${classNames.size}`,
  //   'info'
  // );

  // ╭─────
  // │ NOTE:
  // │ |: output file :: unused CSS classes
  // ╰─────
  fs.writeFile
  (
    '.temp/vite/sveltekit-build-css-unused/css-classes-extracted.json',
    JSON.stringify(Array.from(classNames), null, 4),
    err =>
    {
      if (err) console.error(err);
    }
  );

  return classNames;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Extract CSS classes from Svelte component source code.
 * @param { string } source
 *  ❗️ **REQUIRED** Svelte component source code.
 * @param { string } filename
 *  ❗️ **REQUIRED** Svelte component filename.
 * @returns { Promise < Set < string > > }
 *  📤 Set of extracted CSS class names.
 */
async function extractClassesFromSvelte
(
  source: string,
  filename: string
): Promise < Set < string > >
{
  const
    /**
     * @description
     * 📝 Svelte component filename (placeholder)
     */
    processed = await preprocess
      (
        source,
        preprocessor,
        { filename }
      ),
    // ╭─────
    // │ NOTE:
    // │ |: destructure assignments
    // ╰─────
    [
      ast,
      classes
    ] = [
      parse(processed.code),
      new Set<string>()
    ]
  ;

  // ╭─────
  // │ NOTE:
  // │ |: output file :: unused CSS classes
  // ╰─────
  // fs.writeFile
  // (
  //   `.temp/vite/sveltekit-build-css-unused/${filename.split('Volumes/1TB_CORSAIR/projects/betarena/apps/scores')[1].replaceAll('/','_')}`,
  //   JSON.stringify(ast, null, 4),
  //   err =>
  //   {
  //     if (err) console.error(err);
  //   }
  // );

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📝 Recursively walk through Svelte AST nodes to extract CSS classes.
   * @param { any } node
   *  📝 Svelte AST node.
   * @return { void }
   *  📝 No return value.
   */
  function walk
  (
    node: TemplateNode
  ): void
  {
    if (!node) return;

    switch (node.type)
    {
      case "Fragment":
        node.children?.forEach(walk);
        break;
      case "Element":
      case "InlineComponent":
      case "Slot":
        // attributes
        node.attributes.forEach(attr => {
          // class="a b"
          if (attr.type === "Attribute" && attr.name === "class") {
            attr.value
              .filter(v => v.type === "Text")
              .forEach(v =>
                v.data.split(/\s+/).forEach(c => c && classes.add(c))
              );
          }

          // class:active={...}
          if (attr.type === "ClassDirective") {
            classes.add(attr.name);
          }
        });

        node.children?.forEach(walk);
        break;

      case "IfBlock":
        walk(node.consequent);
        walk(node.alternate);
        break;

      case "EachBlock":
        walk(node.body);
        walk(node.fallback);
        break;

      case "AwaitBlock":
        walk(node.pending);
        walk(node.then);
        walk(node.catch);
        break;

      case "KeyBlock":
        walk(node.fragment);
        break;

      default:
        // Text, MustacheTag, etc → ignore
        break;
    }
  }

  walk(ast.html);

  // [🐞]
  // log
  // (
  //   `Extracted Svelte Classes: ${classes.size}`,
  //   'info'
  // );

  // ╭─────
  // │ NOTE:
  // │ |: output file :: unused CSS classes
  // ╰─────
  fs.appendFile
  (
    `${strOutputFilePathPrefix}/extracted-from-svelte-used-classes.txt`,
    `
      ──────────────────────────────────────────────────────────────────────
      file: ${filename.split('scores/')[1]}
      ${JSON.stringify(Array.from(classes).toString(), null, 4)}
    `,
    err =>
    {
      if (err) console.error(err);
    }
  );

  return classes;
}