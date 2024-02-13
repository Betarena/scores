/**
 * @description
 */
interface IAdminControl
{
  /**
   * @description
   *  📣 Tracks state of platform admin state.
   */
  admin: boolean;
  /**
   * @description
   *  📣 Keeps track of terms without a translation detected on current page.
   */
  termsWithoutTranslation: Set < string >;
}