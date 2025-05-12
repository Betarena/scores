// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // March 5th, 2024                                               │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena // Types // User-Settings                                               │
// │ :│ User-Settings Typescript Declaration
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import type { IBetarenaUser } from "@betarena/scores-lib/types/firebase/firestore.js";
import type { User } from "firebase/auth/dist/auth";

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Interface for `localStorage` data.
 */
export interface Voted_Fixture
{
	fixture_id?: number;
	fixture_vote?: string;
	fixture_vote_val?: string;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Interface for 'authenticated' users.
 */
export interface BetarenaUser
extends
IBetarenaUser
{ }

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Interface for `authenticated` users.
 */
export interface IScoreUser
{
  /**
   * @description
   *  📣 **User** authenticated user `Firebase | Firestore` DB data object
   */
	firebase_user_data?: User;
  /**
   * @description
   *  📣 **User** authenticated user critical data
   */
	scores_user_data?: BetarenaUser;
}

/**
 * @description
 * 📝 Pre-defined and expected logic side-effects.
 */
type ISideEffect =
  | 'IsAnonymous'
  | 'IsAnonymousNew'
  | 'IsAuthenticated'
  | 'LangUpdate'
  | 'UserUpdateDataLanguage'
;

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 INTERFACE
 * @description
 *  📣 Interface for `localStorage` data.
 */
export interface IUserSetting
{
  /**
   * @description
   *  📣 **Client/User** selected lang (overrides serverLang)
   */
  lang?: string;
  /**
   * @description
   *  📣 **Client/User** selected theme
   */
  theme: 'Dark' | 'Light';
  /**
   * @description
   *  📣 **Client/User** selected country bookmaker ISO2
   */
  country_bookmaker?: string;
  /**
   * @description
   *  📣 **Client/User** geoJs object response data
   */
  geoJs?: GeoJsResponse;
  /**
   * @description
   *  📣 **User** authenticated data object
   */
  user?: IScoreUser;
  /**
   * @description
   *  📣 **Client/User** voted fixtures
   */
  voted_fixtures: Voted_Fixture[];
  /**
   * @description
   *  📣 **Client/User** userguides opt-out
   */
  userguide_id_opt_out: number[] | undefined;
  /**
   * @description
   *  📣 **Client/User** userguides opt-in
   */
  objHistory:
  {
    /**
     * @description
     * 📣 **Client/User** selected history
     */
    strContentSelectFeed: 'home' | 'forecast';
  }

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 📌 │ DEFAULT                                                                     │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  /**
   * IMPORTANT CRITICAL
   * @description
   *  📝 Side-effects to be Triggered for Target.
   */
  _SIDE_EFFECTS_: Set < ISideEffect >;
}
