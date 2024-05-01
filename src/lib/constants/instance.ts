// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Module  Overview                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Code Format │:│ V.8.0                                                 │
// │ ➤ Status    │:│ 🔒 LOCKED                                                        │
// │ ➤ Author(s) │:│ @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module) ││ Instance Variables Definitions                              │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { dev } from "$app/environment";

// #endregion ➤ 📦 Package Imports

// [🐞]
// console.log('📦 [scores-lib] :: process.env.VITE_PROD_LOGS', process.env.VITE_PROD_LOGS);

export const
  /**
   * @description
   * - 📝 `LOGS_SHOW_OVERRIDE` flag. `(default=false)`
   * - IMPORTANT Turns off all 'debugging' console logs for 'scores'.
   * - 📝 overrides (ADMIN) to show logs even in PROD.
   * - 📝 Prevents logs display on `deployments`.
   */
  LOGS_SHOW_OVERRIDE =
    import.meta.env.VITE_PROD_LOGS == undefined
      ? dev
      : import.meta.env.VITE_PROD_LOGS == 'false'
        ? false
        : true
;
