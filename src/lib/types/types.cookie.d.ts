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
// │ BETARENA (Module)                                                                │
// │ |: <insert-module-summary-here>
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import type { IUserSetting } from "./types.user-settings.js";

// #endregion ➤ 📦 Package Imports

/**
 * @description
 *  - 📣 Critical platform `cookie` data, required for **visitors**.
 */
export interface IBetarenaUserCookie
extends
Pick < IUserSetting, 'lang' | 'theme' >
{
  /**
   * @description
   * 📝 Identifiable unique user id
   */
  uid?: string | null;
}

/**
 * @description
 *  - 📣 Critical platform `cookie` data, required for **visitors**.
 *  - 📣 Fallback store for
 */
interface IBetarenaVisitorMainCookie
{
  isVisitorCookie: true;
}

/**
 * @description
 *  - 📣 Critical platform `cookie` data, required for **users**.
 */
interface IBetarenaUserMainCookie
{
  isAuthCookie: true;
}