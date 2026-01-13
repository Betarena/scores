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
import dedent from 'dedent';
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
  strConsolePrefix = chalk.bgCyan(`[_betarena.vite.plugin.sveltekit-purge-css]`),
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
    ),
  /**
   * @description
   * 📝 Global object for plugin configuration.
   */
  objGlobal:
  {
    /**
     * @description
     * 📝 Debug level for logging.
     */
    strDebugLevel: string;
    /**
     * @description
     * 📝 Paths for output files.
     */
    objPaths:
    {
      pathToFinalPurgedCssFile: string;
      pathToOutputDebugFiles: string;
    };
    /**
     * @description
     * 📝 Values storage.
     */
    objValues:
    {
      /**
       * @description
       * 📝 Content of the global CSS file.
       * @example
       * :root { --my-variable: #fff; }
       */
      strGlobalCssFileContent?: string;
      /**
       * @description
       * 📝 Set of declared CSS variables.
       */
      objCssGlobal:
      {
        /**
         * @description
         * 📝 Set of declared CSS classes/selectors.
         * @example
         * --my-variable, --another-variable
         */
        setCssVarsDeclared: Set<string>;
        /**
         * @description
         * 📝 Set of used CSS variables.
         * @example
         * --my-variable, --another-variable
        */
        setCssVarsUsed: Set<string>;
        /**
         * @description
         * 📝 Set of used HTML elements.
         * @example
         * div, span, header, footer
         */
        setCssClassesUsed: Set<string>;
        /**
         * @description
         * 📝 Set of declared CSS classes/selectors.
         * @example
         * .my-class, .another-class
         */
        setCssClassesDeclared: Set<string>;
      };
      /**
       * @description
       * 📝 Map of Svelte file extractions.
       * @example
       * { 'MyComponent.svelte': { listClasses: [...], listElements: [...] } }
       */
      mapSvelteFileExtractions: Map<string, { listClasses: Array<string>, listElements: Array<string> }>;
      /**
       * @description
       * 📝 Set of used HTML elements.
       */
      setHtmlElementsUsed: Set<string>;
      /**
       * @description
       * 📝 Map of declared CSS variables to their minified names.
       * @example
       * { '--my-variable': '--a', '--another-variable': '--b' }
       */
      mapShortenedNames: Map<string, string>;
      /**
       * @description
       * 📝 Map of declared CSS variables to their minified names.
       * @example
       * { '--my-variable': '--a', '--another-variable': '--b' }
       */
      mapDeclaredCssVarsToMinifiedNames: Map<string, string>;
    }
  } = {
    strDebugLevel: 'info',
    objPaths:
    {
      pathToFinalPurgedCssFile: '.',
      pathToOutputDebugFiles: '.',
    },
    objValues:
    {
      objCssGlobal:
      {
        setCssVarsDeclared: new Set<string>(),
        setCssVarsUsed: new Set<string>(),
        setCssClassesUsed: new Set<string>(),
        setCssClassesDeclared: new Set<string>(),
      },
      setHtmlElementsUsed: new Set<string>(),
      mapShortenedNames: new Map<string, string>(),
      mapDeclaredCssVarsToMinifiedNames: new Map<string, string>(),
      mapSvelteFileExtractions: new Map(),
    }
  }
;

// #endregion ➤ 📌 VARIABLES

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ MISCELLANEOUS                                                               │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

function log
(
  message: string,
  level:
    | 'debug'
    | 'info'
    | 'warn'
    | 'error' = 'info',
): void
{
  if (level === 'error')
    console
      .log(`${strConsolePrefix} ${message}`)
    ;
  else if (level === 'warn' && (objGlobal.strDebugLevel === 'info' || objGlobal.strDebugLevel === 'warn'))
    console
      .log(`${strConsolePrefix} ${chalk.yellow(message)}`)
    ;
  else if (level === 'info' && objGlobal.strDebugLevel === 'info')
    console
      .log(`${strConsolePrefix} ${message}`)
    ;
  else if (level === 'debug' && objGlobal.strDebugLevel === 'debug')
    console
      .log(`${strConsolePrefix} ${message}`)
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

  (_strDebugLevel ? objGlobal.strDebugLevel = _strDebugLevel : '');
  (_objPaths ? objGlobal.objPaths = _objPaths : '');
  (strGlobalCssFileContent ? objGlobal.objValues.strGlobalCssFileContent = strGlobalCssFileContent : '');

  helperGlobalCssAnalyze();

  // [🐞]
  log
  (
    dedent`\n
    ╭──────────────────────────────────────────────────────────────────────────────────╮
    │ 📌 [variables] Declared :: ${objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.size}
    │ 📌 [variables] Used :: ${objGlobal.objValues.objCssGlobal.setCssVarsUsed.size}
    ├──────────────────────────────────────────────────────────────────────────────────┤
    │ 🔹 [classes] Declared :: ${objGlobal.objValues.objCssGlobal.setCssClassesDeclared.size}
    │ 🔹 [classes] Used :: ${objGlobal.objValues.objCssGlobal.setCssClassesUsed.size}
    ├──────────────────────────────────────────────────────────────────────────────────┤
    │ 💠 [elements] Used :: ${objGlobal.objValues.setHtmlElementsUsed.size}
    ╰──────────────────────────────────────────────────────────────────────────────────╯
    `,
    'info'
  );

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ VITE-LIFECYCLE                                                              │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  return {
    name: '_betarena.vite.plugin.sveltekit-purge-css',
    enforce: 'pre',

    transform: async (
      code,
      id,
    ) =>
    {
      // [🐞]
      log
      (
        `processing file :: ${id}`,
        'debug'
      );

      /**
       * @author
       *  @migbash
       * @summary
       *  🔹 HELPER
       * @description
       *  📝 Helper to check if a file is a Svelte file based on its extension.
       * @return { Promise < string > }
       *  📤 Transformed code if Svelte file, else original code.
       */
      async function _helperIsSvelteFile
      (
      ): Promise < string >
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
            await helperSvelteCssExtract(code, id),
          ]
        ;

        let
          /**
           * @description
           * 📝 Transformed code
           */
          _code = code
        ;

        // ╭─────
        // │ NOTE:
        // │ |: loop over all matches of 'var(--variable-name[..]' in the code (markup, script, style),
        // │ |: capturing USED CSS variable name
        // ╰─────
        for (const element of Array.from(code.matchAll(/var\(\s*(--[A-Za-z0-9-_]+)/g)).sort((a, b) => b[1].length - a[1].length))
        {
          //  [🐞]
          // log
          // (
          //   `CSS VAR is USED : ${chalk.green(element[1])}`
          // );

          _setUsedCssVarsInThisFile.add(element[1]);

          objGlobal.objValues.objCssGlobal.setCssVarsUsed.add(element[1]);

          _code = _code
            .replaceAll
            (
              new RegExp
              (
                `(?<![A-Za-z0-9-])${element[1]}(?![A-Za-z0-9-])`,
                'g'
              ),
              (objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.get(element[1]) ?? element[1])
            )
          ;
        }

        _setUsedCssClassesInThisFile
          .forEach(item => objGlobal.objValues.objCssGlobal.setCssClassesUsed.add(item))
        ;

        _setUsedElementsInThisFile
          .forEach(item => objGlobal.objValues.setHtmlElementsUsed.add(item))
        ;

        return _code;
      }

      if (id.endsWith('.svelte'))
      {
        // ╭─────
        // │ NOTE:
        // │ |: process Svelte file to extract used CSS variables and classes
        // ╰─────
        return {
          code: (await _helperIsSvelteFile())
            // ╭─────
            // │ NOTE:
            // │ |: mutate the global CSS import to use the purged CSS file
            // ╰─────
            // .replace
            // (
            //   /@import\s+['"]\.\.\/style\/app\.scss['"];/,
            //   `@import '../style/app.purged.min.scss';`
            // ),
        };
      }
      // else if (id.endsWith('.css'))
      //   return {
      //     code: helperGlobalCssPurge
      //     (
      //       code,
      //       setCssClassesUsed,
      //       setHtmlElementsUsed,
      //       setCssVarsDeclared,
      //       mapDeclaredCssVarsToMinifiedNames
      //     ),
      //     map: null,
      //   };
      // ;

      return;
    },

    generateBundle
    (
      _,
      bundle
    )
    {
      // ╭─────
      // │ NOTE:
      // │ |: loop over all files in the bundle to purge unused CSS from CSS assets
      // ╰─────
      for (const file of Object.values(bundle))
      {
        // [🐞]
        log(`processing asset :: ${file.fileName}`);

        if (file.type === "asset" && file.fileName.endsWith(".css"))
        {
          // ╭─────
          // │ NOTE:
          // │ |: purge UNUSED CSS classes from the global CSS asset based on used classes in Svelte files
          // ╰─────
          for (const element of file.source?.matchAll(/(--[A-Za-z0-9_-]+)\b/g))
          {
            if (objGlobal.objValues.objCssGlobal.setCssVarsDeclared.has(element[1]))
            {
              // [🐞]
              // log
              // (
              //   `❌ original variable still present :: ${chalk.yellow(element[1])} → ${chalk.green(objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.get(element[1] ?? '') ?? element[1])}`,
              //   'warn' // WARNING: recommended 'debug' level only
              // );
              // file.source = file.source?.toString().replaceAll
              // (
              //   element[1],
              //   (objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.get(element[1]) ?? element[1])
              // );
            }
          }
        }
      }
    },

    closeBundle
    (
    )
    {
      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 📊 │ REPORTING                                                                   │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

      const
        /**
         * @description
         * 📝 List of UNUSED CSS variables
         */
        listCssVarsUnused = [...objGlobal.objValues.objCssGlobal.setCssVarsDeclared]
          .filter(x => !objGlobal.objValues.objCssGlobal.setCssVarsUsed.has(x)),
        /**
         * @description
         * 📝 Final report object
         */
        objFinalReport = {
            'css-vars':
            {
              declared:
              {
                total: objGlobal.objValues.objCssGlobal.setCssVarsDeclared.size,
                list: Array.from(objGlobal.objValues.objCssGlobal.setCssVarsDeclared),
              },
              foundInSvelte:
              {
                total: objGlobal.objValues.objCssGlobal.setCssVarsUsed.size,
                list: Array.from(objGlobal.objValues.objCssGlobal.setCssVarsUsed),
              },
              unused:
              {
                total: listCssVarsUnused.length,
                list: listCssVarsUnused,
              },
              minified:
              {
                total: objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.size,
                list: Array.from(objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.entries()),
              },
            },
            'css-classes':
            {
              declared:
              {
                  total: objGlobal.objValues.objCssGlobal.setCssClassesDeclared.size,
                list: Array.from(objGlobal.objValues.objCssGlobal.setCssClassesDeclared),
              },
              foundInSvelte:
              {
                total: objGlobal.objValues.objCssGlobal.setCssClassesUsed.size,
                list: Array.from(objGlobal.objValues.objCssGlobal.setCssClassesUsed),
              },
            },
            'html-elements':
            {
              foundInSvelte:
              {
                total: objGlobal.objValues.setHtmlElementsUsed.size,
                list: Array.from(objGlobal.objValues.setHtmlElementsUsed),
              },
            },
            'svelte-file-extractions':
            {
              total: objGlobal.objValues.mapSvelteFileExtractions.size,
              list: Array.from(objGlobal.objValues.mapSvelteFileExtractions.entries()),
            },
          }
      ;

      // [🐞]
      log
      (
        dedent`\n
        ╭──────────────────────────────────────────────────────────────────────────────────╮
        │ 📌 [variables] Declared :: ${objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.size}
        │ 📌 [variables] Used :: ${objGlobal.objValues.objCssGlobal.setCssVarsUsed.size}
        │ 📌 [variables] Unused :: ${listCssVarsUnused.length}
        ├──────────────────────────────────────────────────────────────────────────────────┤
        │ 🔹 [classes] Declared :: ${objGlobal.objValues.objCssGlobal.setCssClassesDeclared.size}
        │ 🔹 [classes] Used :: ${objGlobal.objValues.objCssGlobal.setCssClassesUsed.size}
        ├──────────────────────────────────────────────────────────────────────────────────┤
        │ 💠 [elements] Used :: ${objGlobal.objValues.setHtmlElementsUsed.size}
        ╰──────────────────────────────────────────────────────────────────────────────────╯
        `,
        'info'
      );

      // ╭─────
      // │ NOTE:
      // │ |: output file :: [debugging] final report snapshot
      // ╰─────
      fs.writeFile
      (
        `${objGlobal.objPaths.pathToOutputDebugFiles}/debug.variables.snapshot.json`,
        JSON.stringify
        (
          objFinalReport,
          null,
          4
        ),
        err =>
        {
          if (err) console.error(err);
        }
      );

      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 🟥 │ MAIN                                                                        │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

      helperGlobalCssPurge
      (
        {
          listCssVarsUnused
        }
      );

      return;
    }
  };
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ HELPER - SVELTE                                                             │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

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
async function helperSvelteCssExtract
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
  // │ |: output file :: Svelte AST snapshot
  // ╰─────
  fs.writeFile
  (
    `.temp/vite/sveltekit-build-css-unused/${filename.split('scores/')[1]?.replaceAll('/','_')}`,
    JSON.stringify
    (
      ast,
      null,
      4
    ),
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
        // ╭─────
        // │ NOTE:
        // │ |: capture HTML element names (lowercase only)
        // ╰─────
        if (node.name[0] === node.name[0].toLowerCase())
          setElements.add(node.name);
        ;

        // ╭─────
        // │ NOTE:
        // │ |: extract CSS class names from Svelte component attributes
        // ╰─────
        node.attributes.forEach
        (
          attr =>
          {
            // ╭─────
            // │ NOTE:
            // │ |: capture CSS class names from Svelte component attributes
            // │ |: - class="..."
            // ╰─────
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
                    .split
                    (
                      /\s+/
                    )
                    .forEach
                    (
                      c => c && setClasses.add(c)
                    )
                )
              ;
            }

            // ╭─────
            // │ NOTE:
            // │ |: capture CSS class names from Svelte component attributes
            // │ |: - class:className={...}
            // ╰─────
            if (attr.type === "Class")
              setClasses.add(attr.name);
            ;
          }
        );

        node.children
          ?.forEach
          (
            walk
          )
        ;

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
  log
  (
    `Extracted Svelte Classes: ${setClasses.size}`,
    'debug'
  );

  // [🐞]
  objGlobal.objValues.mapSvelteFileExtractions.set
  (
    `${filename.split('scores/')[1]}`,
    {
      listClasses: Array.from(setClasses),
      listElements: Array.from(setElements),
    }
  );

  return {
    setClasses,
    setElements,
  };
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ HELPER - GLOBAL.CSS                                                         │
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
function helperGlobalCssAnalyze
(
): void
{
  const
    /**
     * @description
     * 📝 PostCSS root node
     */
    root = postcss.parse(objGlobal.objValues.strGlobalCssFileContent ?? ''),
    /**
     * @description
     * 📝 Set of extracted CSS class names
     */
    setClasses = new Set<string>()
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
                        setClasses.add(node.value);
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

  // ╭─────
  // │ NOTE:
  // │ |: loop over all matches of 'declared-css-variables' in the global CSS file
  // ╰─────
  for (const element of Array.from(objGlobal.objValues.strGlobalCssFileContent?.matchAll(/(--[A-Za-z0-9_-]+):\s+.*;/g) ?? []))
    objGlobal.objValues.objCssGlobal.setCssVarsDeclared.add(element[1]);
  ;

  // ╭─────
  // │ NOTE:
  // │ |: loop over all 'declared-css-classes/selectors' identified in the global CSS file
  // ╰─────
  for (const element of Array.from(setClasses))
    objGlobal.objValues.objCssGlobal.setCssClassesDeclared.add(element[1]);
  ;

  // ╭─────
  // │ NOTE:
  // │ |: loop over all 'declared-css-variables', generating minified names
  // ╰─────
  for (const cssVar of Array.from(objGlobal.objValues.objCssGlobal.setCssVarsDeclared).sort((a, b) => b.length - a.length))
  {
    let
      /**
       * @description
       * 📝 Shortened CSS variable name
       */
      strCssShort = helperCssVariableShorten
        (
          cssVar
        )
    ;

    // ╭─────
    // │ NOTE:
    // │ │: handle potential name collisions in minified CSS variable names
    // ╰─────
    if (objGlobal.objValues.mapShortenedNames.has(strCssShort))
    {
      // [🐞]
      log
      (
        `variable minification conflict :: ${cssVar} → ${strCssShort}, conlicting ${objGlobal.objValues.mapShortenedNames.get(strCssShort)}`,
        'warn'
      );

      let
        /**
         * @description
         * 📝 ASCII sum of CSS variable name
         */
        intAsciiSum = 0
      ;

      // ╭─────
      // │ NOTE:
      // │ |: compute ASCII sum of CSS variable name to append to minified name for uniqueness
      // ╰─────
      for (var i = 0; i < cssVar.length; i++)
        intAsciiSum += cssVar.charCodeAt(i);
      ;

      strCssShort = `${strCssShort}-${intAsciiSum}`;
    }

    // [🐞]
    objGlobal.objValues.mapShortenedNames
      .set
      (
        strCssShort,
        cssVar
      )
    ;

    objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames
      .set
      (
        cssVar,
        strCssShort
      )
    ;
  }

  return;
}

/**
 * @description
 * @param selector
 * @param setCssClassesUsed
 * @returns
 */
function selectorUsesUsedClass
(
  selector: string,
  setCssClassesUsed: Set<string>
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
          if (setCssClassesUsed.has(node.value)) {
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
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Purge unused CSS from global CSS text based on used classes in Svelte files.
 * @param cssText
 * @param setCssClassesUsed
 * @return { string }
 *  📤 Purged CSS text.
 */
function helperGlobalCssPurge
(
  {
    listCssVarsUnused = []
  }:
  {
    listCssVarsUnused: Array<string>;
  }
): void
{
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🟦 │ HELPER                                                                      │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  let
    // ╭─────
    // │ NOTE:
    // │ |: destructure assignments
    // ╰─────
    [
      strModifiedCssCommented,
      strModifiedCssClean,
    ] = [
      objGlobal.objValues.strGlobalCssFileContent?.toString() ?? '',
      objGlobal.objValues.strGlobalCssFileContent?.toString() ?? '',
    ]
  ;

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📝 Helper to comment out UNUSED CSS variables in the CSS text.
   * @return { void }
   *  📝 No return value.
   */
  function _helperCssVariableUnusedRemove
  (
  ): void
  {
    // ╭─────
    // │ NOTE:
    // │ |: loop over, (1) UNUSED CSS variables and (2) comment them out in the CSS asset
    // ╰─────
    for (const unusedVar of listCssVarsUnused)
    {
      const
        // ╭─────
        // │ NOTE:
        // │ |: regex to match the CSS variable declaration line
        // ╰─────
        [
          instanceRegexVariableDeclaration,
          instanceRegexVariableUsageInGlobalCss,
        ] = [
          new RegExp
          (
            `${unusedVar}:.*;`,
            'g'
          ),
          new RegExp
          (
            `${unusedVar}\\b`,
            'g'
          ),
        ],
        // ╭─────
        // │ NOTE:
        // │ |: check if the variable is used multiple times in the CSS (e.g., in multiple themes)
        // ╰─────
        [
          isConditionVariableDeclarationMatchedMultipleTimes,
        ] = [
          (
            // ╭─────
            // │ CHECK:
            // │ |: if the variable is used multiple times in the CSS (e.g., in multiple themes)
            // ╰─────
            Array.from(strModifiedCssClean.matchAll(instanceRegexVariableUsageInGlobalCss)).length > 1
            &&
            (
              Array.from(strModifiedCssClean.matchAll(instanceRegexVariableDeclaration)).length
              != Array.from(strModifiedCssClean.matchAll(instanceRegexVariableUsageInGlobalCss)).length
            )
          )
        ]
      ;

      // [🐞]
      log
      (
        `processing UNUSED CSS variable :: ${chalk.yellow(unusedVar)}, regex :: ${isConditionVariableDeclarationMatchedMultipleTimes} length ${Array.from(strModifiedCssClean.matchAll(instanceRegexVariableDeclaration)).length + ' / ' + Array.from(strModifiedCssClean.matchAll(instanceRegexVariableUsageInGlobalCss)).length}`,
        'debug' // WARNING: recommended 'debug' level only
      );

      if (isConditionVariableDeclarationMatchedMultipleTimes)
        continue;
      ;

      strModifiedCssCommented = strModifiedCssCommented
        .replace
        (
          instanceRegexVariableDeclaration,
          `/* unused-css-var: ${unusedVar} */`
        )
      ;

      strModifiedCssClean = strModifiedCssClean
        .replace
        (
          instanceRegexVariableDeclaration,
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
    // │ |: output file :: [debug] purged CSS WITH comments
    // ╰─────
    fs.writeFile
    (
      `${objGlobal.objPaths.pathToOutputDebugFiles}/app.purged.with-comments.css`,
      strModifiedCssCommented,
      err =>
      {
        if (err) console.error(err);
      }
    );

    // ╭─────
    // │ NOTE:
    // │ |: output file :: [debug] purged CSS WITHOUT comments
    // ╰─────
    fs.writeFile
    (
      `${objGlobal.objPaths.pathToOutputDebugFiles}/app.purged.clean.css`,
      strModifiedCssClean,
      err =>
      {
        if (err) console.error(err);
      }
    );
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📝 Helper to shorten CSS variable names in the CSS text.
   * @return { void }
   *  📝 No return value.
   */
  function _helperCssVariableShorten
  (
  ): void
  {
    // ╭─────
    // │ NOTE:
    // │ |: loop over all declared CSS variables, replacing with minified names
    // ╰─────
    for (const element of Array.from(objGlobal.objValues.objCssGlobal.setCssVarsDeclared).sort((a, b) => b.length - a.length))
    {
      // ╭─────
      // │ CHECK:
      // │ |: if variable is NOT found in the final CSS
      // ╰─────
      if (!strModifiedCssClean.includes(element))
        continue;
      ;

      // [🐞]
      log
      (
        `css variable replacement :: ${chalk.yellow(element)} → ${chalk.green(objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.get(element) ?? element)}`,
        'debug' // WARNING: recommended 'debug' level only
      );

      strModifiedCssClean = strModifiedCssClean
        .replace
        (
          new RegExp
            (
              `${element}\\b`,
              'g'
            ),
          `${(objGlobal.objValues.mapDeclaredCssVarsToMinifiedNames.get(element) ?? element)}`
        )
      ;
    }
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📝 Helper to batch purge unused CSS classes/selectors from the CSS text.
   * @return { void }
   *  📝 No return value.
   */
  function _helperCssBatchPurge
  (
  ): void
  {
    const
      /**
       * @description
       * 📝 PostCSS root node
       */
      root = postcss.parse(strModifiedCssClean)
    ;

    // ╭─────
    // │ NOTE: CRITICAL
    // │ |: remove unused classes/selectors
    // ╰─────
    root
      .walkRules
      (
        rule =>
        {
          // [🐞]
          log
          (
            `Processing CSS Rule :: ${rule.selector}`,
            'debug'
          );

          if ([...(Array.from(objGlobal.objValues.setHtmlElementsUsed) ?? []), ':root', '*', 'html', 'body'].includes(rule.selector))
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
                  selectorUsesUsedClass
                  (
                    sel,
                    objGlobal.objValues.objCssGlobal.setCssClassesUsed
                  )
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

    // ╭─────
    // │ NOTE: CRITICAL
    // │ |: remove unnecessary comments
    // ╰─────
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
    // │ NOTE: CRITICAL
    // │ |: remove empty at-rules (e.g. @media, @keyframes)
    // ╰─────
    root
      .walkAtRules
      (
        atRule =>
        {
          if (atRule.nodes?.length === 0)
            atRule.remove();
          ;
        }
      )
    ;

    strModifiedCssClean = root.toString();
  }

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🟥 │ MAIN                                                                        │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  _helperCssVariableUnusedRemove();
  _helperCssBatchPurge();
  _helperCssVariableShorten();

  // ╭─────
  // │ NOTE:
  // │ |: output file :: final purged CSS
  // ╰─────
  fs.writeFile
  (
    objGlobal.objPaths.pathToFinalPurgedCssFile,
    strModifiedCssClean,
    err =>
    {
      if (err) console.error(err);
    }
  );

  return;
}

// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 💠 │ HELPER - MISCELLENOUS                                                       │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Shorten a CSS variable name to a minified version.
 * @example
 *  helperCssVariableShorten('--primary-button-background-color') // returns '--pbcb'
 * @param { string } strName
 *  ❗️ **REQUIRED** CSS variable name (e.g., '--primary-button-background-color').
 * @return { string }
 *  📤 Minified CSS variable name (e.g., '--pbcb' for '--primary-button-background-color').
 */
function helperCssVariableShorten
(
  strName: string,
  intOption?: number = 1,
): string
{
  if (!strName.startsWith("--"))
    throw new Error("Not a CSS variable");
  ;

  const
    /**
     * @description
     * 📝 Minified CSS variable name
     */
    strNewName
      = '--' + strName
        .slice
        (
          2
        )
        .replaceAll
        (
          '_',
          '-'
        )
        .split
        (
          "-"
        )
        // ╭─────
        // │ NOTE:
        // │ |: map each part to its first character (or digit)
        // ╰─────
        .map
        (
          part =>
          {
            return part[0];
          }
        )
        .join
        (
          ""
        )
  ;

  // [🐞]
  log
  (
    `minified css variable :: ${chalk.yellow(strName)} → ${chalk.green(strNewName)}`,
    'info'
  );

  return strNewName;
}