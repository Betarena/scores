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
// │ |: 🔗 read-more :: https://kit.svelte.dev/docs/types#app
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import type { IBetarenaUserCookie } from "./types.cookie.js";

// #endregion ➤ 📦 Package Imports

/**
 * @description
 * 📝 Pre-defined and expected logic side-effects.
 */
type ISettingsState =
  // ╭─────
  // │ NOTE: :: Widget is 'Processing' authentication (post-submit).
  // ╰─────
  | 'IsAnonymousNewBurner'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit).
  // ╰─────
  | 'IsAnonymousNew'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit).
  // ╰─────
  | 'IsAnonymousReturning'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit).
  // ╰─────
  | 'IsBetarenaUser'
;

declare global
{
	namespace App
  {
		// interface PageData {}
		// interface Platform {}

    interface Error
    {
			message: string;
			errorId: string;
		}

    interface Locals
    {
      /**
       * @description
       * 📝 User UID
       */
      uid?: string | null;
      /**
       * @description
       * 📝 User (type: Betarena)
       * 📝 Visitor/User
       */
			user: IBetarenaUserCookie;
      /**
       * @description
       * 📝 Locals override '<html lang=[..]>' value
       */
      strLocaleOverride?: string;
      /**
       * @description
       */
      setState?: Set < ISettingsState >;
		}
  }
}

export { };
