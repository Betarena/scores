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
   *  📝 Map declaration of 'language' to 'locale'.
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
    )
;
