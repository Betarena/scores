import { IBetarenaUser } from "@betarena/scores-lib/types/_FIREBASE_.js";
import { INotificationsConfigSection } from './types.notifications.js'

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
   *  📣 **Notifications settings** notifications
   */
  notificationSettings: {
    [key: string]: INotificationsConfigSection
  };
}

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
 *  🔹 TYPES
 * @description
 *  📣 Interface for 'authenticated' users.
 */
export interface BetarenaUser
extends
IBetarenaUser,
Pick < IUserSetting, 'userguide_id_opt_out' >
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