// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-09-25                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module)
// │ |: Instance Variables Definitions
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import type { IFirebaseFunctionUsernameUpsert } from "@betarena/scores-lib/types/firebase/functions.js";

// #endregion ➤ 📦 Package Imports

type ISettingsState =
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit).
  // ╰─────
  | 'Processing'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit).
  // ╰─────
  | 'ProfileUpdated'
;

type ISettingsErrorState =
  // ╭─────
  // │ NOTE: :|: Widget Error for incorrect `Username` input.
  // ╰─────
  | 'ErrorUsername'
;

type ISettingsErrorStateUsername =
  IFirebaseFunctionUsernameUpsert['response']['error']['cause']['validation']
;

/**
 * @description
 * 📝 Pre-defined and expected logic side-effects.
 */
type ISideEffect =
  | null
;

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📝 Interface for `Profile.Settings` page.
 */
export interface IPageProfileSettings
{
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ STATE                                                                       │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   * 📝 Target **component** `multi-state` **store**, used for general `state` tracking.
   */
  globalState: Set < ISettingsState >;
  /**
   * @description
   * 📝 Target **component** `multi-state` **store**, used for `error/exception` tracking.
   */
  globalStateErrors: Set < ISettingsErrorState >;
  /**
   * @description
   * 📝 Target **component** `multi-state` **store**, used for `error/exception` tracking.
   */
  globalStateErrorUsername: ISettingsErrorStateUsername | null;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 📌 │ DEFAULT                                                                     │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  /**
   * IMPORTANT CRITICAL
   * @description
   *  📝 Side-effects to be Triggered for Target.
   */
  _SIDE_EFFECTS_: Set < ISideEffect >;
};