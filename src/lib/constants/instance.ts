// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: <insert-module-summary-here>
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable prefer-const */

// #region ➤ 📦 Package Imports

import { log_v3 } from '$lib/utils/debug.js';

// #endregion ➤ 📦 Package Imports

export const
  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Dynamic Instance Logic of Enviornment Variables
   * @return { boolean | undefined }
   *  📤 Retrieve Target instance/configuration value
   */
  getInstance
    = (
      strTargetInstance: 'logging' | undefined
    ) =>
    {
      if (strTargetInstance === 'logging')
        return `${import.meta.env.VITE_PROD_LOGS?.toString()}` === 'true';
      ;
      return;
    },
  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Map of (key) 'language' to (value) 'locale'.
   */
  mapLangToLocaleAuthor
    = new Map < string, string > (
      [
        ['pt', 'pt-PT'],
        ['br', 'pt-BR'],
        ['ro', 'ro'],
        ['sv', 'sv'],
        ['it', 'it'],
        ['en', 'en-US'],
        ['fr', 'fr'],
        ['es', 'es-ES'],
      ]
    ),
  /**
   * @author
   *  @migbash
   * @summary
   *  🔷 HELPER
   * @description
   *  📝 Convert the locale to the language
   * @param { string } strLocale
   *  ❗️ **REQUIRED** - locale to convert to platform language
   * @return { string }
   *  📤 Retrieve the language
   */
  convertLocaleToLang = (
    strLocale: string
  ) =>
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ convertLocaleToLang(..) // START',
        msgs:
        [
          `strLocale: ${strLocale}`,
        ]
      }
    );

    if (['pt-BR'].includes(strLocale))
      return 'br';
    else if (['pt, pt-PT, pt-AO, pt-MZ, pt-CV, pt-GW, pt-ST, pt-TL'].includes(strLocale))
      return 'pt';
    else if(['es', 'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-CL', 'es-PE', 'es-VE', 'es-EC', 'es-GT', 'es-CU', 'es-UY', 'es-BO', 'es-DO', 'es-HN', 'es-NI', 'es-SV', 'es-PR', 'es-PA', 'es-PY'].includes(strLocale))
      return 'es';
    else if (['fr', 'fr-FR', 'fr-BE', 'fr-CA', 'fr-CH', 'fr-LU', 'fr-CI', 'fr-MA', 'fr-SN', 'fr-CM', 'fr-TN', 'fr-DZ', 'fr-HT'].includes(strLocale))
      return 'fr';
    else if (['it', 'it-IT', 'it-CH', 'it-SM', 'it-VA'].includes(strLocale))
      return 'it';
    else if (['sv', 'sv-SE', 'sv-FI'].includes(strLocale))
      return 'sv';
    else if (['ro', 'ro-RO', 'ro-MD'].includes(strLocale))
      return 'ro';
    else
      return 'en';
  }
;
