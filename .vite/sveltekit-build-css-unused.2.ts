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
  /**
   * @description
   * 📝 Svelte preprocessor configuration
   */
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
    objPaths,
  ] = [
    'info',
    {
      pathToFinalPurgedCssFile: '.',
      pathToOutputDebugFiles: '.',
    },
    '.',
  ]
;

// #endregion ➤ 📌 VARIABLES

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ MISCELLANEOUS                                                               │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

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

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 🟥 │ MAIN                                                                        │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @description
 *  📝 Vite plugin to analyze CSS variable usage in Svelte files
 * @param param0
 *  ❗️ **REQUIRED** Object containing:
 *  - strGlobalCssFileContent: string - The content of the global CSS file to analyze.
 * @return { PluginOption }
 *  📤 Vite plugin option object.
 */
export function sveltekitCssPurge
(
  {
    strGlobalCssFileContent,
    _objPaths,
    _strDebugLevel = 'info',
  }:
  {
    strGlobalCssFileContent: string;
    _objPaths?:
    {
      pathToFinalPurgedCssFile: string;
      pathToOutputDebugFiles: string;
    };
    _strDebugLevel?: string;
  }
): PluginOption
{
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 📌 │ PREPARATION                                                                 │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  strDebugLevel = _strDebugLevel;
  objPaths = _objPaths ??
    {
      pathToFinalPurgedCssFile: '.',
      pathToOutputDebugFiles: '.',
    }
  ;

  const
    // ╭─────
    // │ NOTE:
    // │ |: destructure assignments
    // ╰─────
    [
      listAllCssVars,
      listAllCssClasses,
      setDeclaredCssVars,
      setDeclaredCssClasses,
      setUsedCssVarsInSvelteFiles,
      setUsedCssClassesInSvelteFiles,
      setUsedElementsInSvelteFiles,
      mapDeclaredCssVarsToMinifiedNames, // TODO: future use
    ] = [
      strGlobalCssFileContent.matchAll(/(--[A-Za-z0-9_-]+):\s+.*;/g),
      extractClassesFromCSS(strGlobalCssFileContent),
      new Set<string>(),
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
    setDeclaredCssVars.add(element[1]);
  ;

  for (const element of listAllCssClasses)
    setDeclaredCssClasses.add(element[1]);
  ;

  // [🐞]
  log
  (
    `
    ╭──────────────────────────────────────────────────────────────────────────────────╮
    │ 🚨 Total (unique) Declared CSS Vars (app.css) :: ${setDeclaredCssVars.size}
    │ 🚨 Total (unique) Used CSS Vars :: ${setUsedCssVarsInSvelteFiles.size}
    ├──────────────────────────────────────────────────────────────────────────────────┤
    │ 🚨 Total (unique) Declared CSS Class (app.css) :: ${setDeclaredCssClasses.size}
    │ 🚨 Total (unique) Used CSS Class :: ${setUsedCssClassesInSvelteFiles.size}
    ├──────────────────────────────────────────────────────────────────────────────────┤
    │ 🚨 Total (unique) HTML Elements :: ${setUsedElementsInSvelteFiles.size}
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
      // [🐞]
      log
      (
        `Processing file :: ${id}`,
        'info'
      );

      /**
       * @author
       *  @migbash
       * @summary
       *  🔹 HELPER
       * @description
       *  📝 Helper to check if a file is a Svelte file based on its extension.
       * @param { string } filename
       *  ❗️ **REQUIRED** Filename to check.
       * @returns
       */
      async function _helperIsSvelteFile
      (
      ): Promise<void>
      {
        const
          // ╭─────
          // │ NOTE:
          // │ |: destructure assignments
          // ╰─────
          [
            _setUsedCssVarsInThisFile,
            {
              setClasses: _setUsedCssClassesInThisFile,
              setElements: _setUsedElementsInThisFile,
            },
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

        _setUsedElementsInThisFile
          .forEach(item => setUsedElementsInSvelteFiles.add(item))
        ;
      }

      if (id.endsWith('.svelte'))
      {
        await _helperIsSvelteFile();
        // return {
        //   code: code
        //     .replace
        //     (
        //       /@import\s+['"]\.\.\/style\/app\.scss['"];/,
        //       `@import '../style/app.purged.css';`
        //     ),
        //   map: null
        // };
      }
      else if (id.endsWith('.css'))
        return {
          code: purgeCSS(code, setUsedCssClassesInSvelteFiles),
          map: null,
        };
      ;

      return;
    },

    // generateBundle
    // (
    //   _,
    //   bundle
    // )
    // {
    //   // ╭─────
    //   // │ NOTE:
    //   // │ |: purge CSS classes from CSS assets based on used classes in Svelte files
    //   // ╰─────
    //   for (const file of Object.values(bundle))
    //   {
    //     console.log(`${strConsolePrefix} Processing asset :: ${file.fileName}`);

    //     if (file.type === "asset" && file.fileName.endsWith(".css"))
    //       file.source = purgeCSS(file.source as string, setUsedCssClassesInSvelteFiles);
    //     ;
    //   }
    // },

    closeBundle
    (
    )
    {
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 📝 │ REPORTING                                                                   │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

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
        ├──────────────────────────────────────────────────────────────────────────────────┤
        │ 🚨 Total (unique) HTML Elements :: ${setUsedElementsInSvelteFiles.size}
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
      // │ |: output file :: [debugging]
      // ╰─────
      fs.writeFile
      (
        `${objPaths.pathToOutputDebugFiles}/svelte-debug.json`,
        JSON.stringify
        (
          {
            listUnusedVars,
            setUsedElementsInSvelteFiles: Array.from(setUsedElementsInSvelteFiles),
            setUsedCssClassesInSvelteFiles: Array.from(setUsedCssClassesInSvelteFiles),
          }
          , null, 4),
        err =>
        {
          if (err) console.error(err);
        }
      );

      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 📌 │ MUTATE GLOBAL CSS FILE                                                      │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

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
            .replace
            (
              /\n\s*\n/g,
              '\n'
            )
            // .replace
            // (
            //   /\s+/g,
            //   ''
            // )
        ;

        // ╭─────
        // │ NOTE:
        // │ |: output file :: purged CSS with comments
        // ╰─────
        fs.writeFile
        (
          `${objPaths.pathToOutputDebugFiles}/app.purged.css`,
          strModifiedCssCommented,
          err =>
          {
            if (err) console.error(err);
          }
        );

        purgeCSS
        (
          strModifiedCssClean,
          setUsedCssClassesInSvelteFiles,
          setUsedElementsInSvelteFiles
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
    classNames = new Set<string>()
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
    `${objPaths.pathToOutputDebugFiles}/css-classes-extracted.json`,
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
 *  ❗️ **REQUIRED** svelte component source code.
 * @param { string } filename
 *  ❗️ **REQUIRED** svelte component filename.
 * @returns { Promise < { setClasses: Set<string>, setElements: Set<string> } > }
 *  📤 Set of extracted CSS class names.
 */
async function extractClassesFromSvelte
(
  source: string,
  filename: string,
): Promise < { setClasses: Set<string>, setElements: Set<string> } >
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
      setClasses,
      setElements,
    ] = [
      parse(processed.code),
      new Set<string>(),
      new Set<string>(),
    ]
  ;

  // ╭─────
  // │ NOTE:
  // │ |: output file :: unused CSS classes
  // ╰─────
  fs.writeFile
  (
    `.temp/vite/sveltekit-build-css-unused/${filename.split('scores/')[1]?.replaceAll('/','_')}`,
    JSON.stringify(ast, null, 4),
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
      {
        node.children?.forEach(walk);
        break;
      }
      case "Element":
      case "InlineComponent":
      case "Slot":
      {
        if (node.name[0] === node.name[0].toLowerCase()) {
          setElements.add(node.name);
        }

        // attributes
        node.attributes.forEach
        (
          attr =>
          {
            // class="a b"
            if (attr.type === "Attribute" && attr.name === "class")
            {
              attr.value
                .filter
                (
                  v => v.type === "Text"
                )
                .forEach
                (
                  v => v.data
                    .split(/\s+/)
                    .forEach(c => c && setClasses.add(c))
                )
              ;
            }

            // class:active={...}
            if (attr.type === "ClassDirective")
              setClasses.add(attr.name);
            ;
          }
        );

        node.children?.forEach(walk);

        break;
      }
      case "IfBlock":
      {
        walk(node.consequent);
        walk(node.alternate);
        node.children?.forEach(walk);
        break;
      }
      case "EachBlock":
      {
        walk(node.body);
        walk(node.fallback);
        break;
      }
      case "AwaitBlock":
      {
        walk(node.pending);
        walk(node.then);
        walk(node.catch);
        break;
      }
      case "KeyBlock":
      {
        walk(node.fragment);
        break;
      }
      default:
      {
        // Text, MustacheTag, etc → ignore
        break;
      }
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
    `${objPaths.pathToOutputDebugFiles}/extracted-from-svelte-used-classes.txt`,
    `
      ──────────────────────────────────────────────────────────────────────
      file: ${filename.split('scores/')[1]}
      elements: ${JSON.stringify(Array.from(setElements).toString(), null, 4)}
      classes: ${JSON.stringify(Array.from(setClasses).toString(), null, 4)}
    `,
    err =>
    {
      if (err) console.error(err);
    }
  );

  return {
    setClasses,
    setElements,
  };
}

/**
 * @description
 * @param selector
 * @param setUsedCssClassesInSvelteFiles
 * @returns
 */
function selectorUsesUsedClass
(
  selector: string,
  setUsedCssClassesInSvelteFiles: Set<string>
): boolean
{
  let keep = false;

  selectorParser
  (
    sel =>
    {
      sel.walkClasses
      (
        node =>
        {
          if (setUsedCssClassesInSvelteFiles.has(node.value)) {
            keep = true;
          }
        }
      );
    }
  )
  .processSync
  (
    selector
  );

  return keep;
}

/**
 * @description
 * @param cssText
 * @param setUsedCssClassesInSvelteFiles
 * @returns
 */
function purgeCSS
(
  cssText: string,
  setUsedCssClassesInSvelteFiles: Set<string>,
  setUsedElementsInSvelteFiles?: Set<string>,
): string
{
  const
    root = postcss.parse(cssText)
  ;

  console.log('setUsedElementsInSvelteFiles', setUsedElementsInSvelteFiles?.size);

  root
    .walkRules
    (
      rule =>
      {
        // [🐞]
        console.log(`${strConsolePrefix} Processing CSS Rule :: ${rule.selector}`);

        if ([...(setUsedElementsInSvelteFiles ?? []), ':root', '*', 'html', 'body'].includes(rule.selector))
          return;
        ;

        const
          /**
           * @description
           * 📝 Kept selectors after filtering
           */
          keptSelectors = rule.selectors
            .filter
            (
              sel =>
                selectorUsesUsedClass(sel, setUsedCssClassesInSvelteFiles)
            )
        ;

        // ╭─────
        // │ NOTE:
        // │ |: if no selectors are kept, remove the entire rule
        // ╰─────
        if (keptSelectors.length === 0)
          rule.remove();
        else
          rule.selectors = keptSelectors;
        ;
      }
    )
  ;

  root
    .walkComments
    (
      comment =>
      {
        if (!comment.text.includes('region'))
          comment.remove();
        ;
      }
    )
  ;

  // ╭─────
  // │ NOTE:
  // │ |: output file :: purged CSS
  // ╰─────
  fs.writeFile
  (
    objPaths.pathToFinalPurgedCssFile,
    root.toString(),
    err =>
    {
      if (err) console.error(err);
    }
  );

  return root.toString();
}