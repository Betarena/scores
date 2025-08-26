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
  // │ NOTE:
  // │ |: User is a:
  // │ |: [1] first-time visitor (or, using new device),
  // │ |: [2] accesing the 'homepage' from a target language, not '/' path.
  // ┣─────
  // │ |: user data (cookie) is DELETED at the end of the user session.
  // ╰─────
  | 'IsAnonymousNewBurner'
  // ╭─────
  // │ NOTE:
  // │ |: User is a:
  // │ |: [1] first-time visitor (or, using new device),
  // │ |: [2] accesing the 'homepage' from '/' path.
  // ┣─────
  // │ |: user data (cookie) is SET permanently.
  // ╰─────
  | 'IsAnonymousNew'
  // ╭─────
  // │ NOTE:
  // │ |: User is a:
  // │ |: [1] returning visitor (or, using same device),
  // ╰─────
  | 'IsAnonymousReturning'
  // ╭─────
  // │ NOTE:
  // │ |: User is a:
  // │ |: [1] returning visitor (or, using same device),
  // │ |: [2] is a Betarena user.
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
       * 📝 State of currest request expressed as a 'Set()'
       */
      setState?: Set < ISettingsState >;
      /**
       * @description
       * 📝 Current request language
       */
      metadata?:
      {
        /**
         * @description
         * 📝 Set domain value
         */
        domain?: string;
      }
		}
  }
}

export { };
