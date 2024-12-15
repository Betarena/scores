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
        // import.meta.env.VITE_PROD_LOGS == undefined
        //  ? dev
        //  : import.meta.env.VITE_PROD_LOGS == 'false'
        //    ? false
        //    : true
        return import.meta.env.VITE_PROD_LOGS === 'true';
      ;
      return;
    }
;
