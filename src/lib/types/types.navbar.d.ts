// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Navbar Types                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

type INavbarState =
  | 'MobileNavToggleMenuActive'
  | 'CurrencyDropdownActive'
  | 'OddsDropdownActive'
  | 'UserDropdownActive'
  | 'UpdateZIndex'
  | 'LangDropdownActive'
  | 'BackdropActive'
;

/**
 * @description
 *  📣 Scores Platfrom | Navbar State Interface.
 */
interface INavbarWidget
{
  /**
   * @description
   *  📣 Target **global** `store` state containing multiple **store** states.
   */
  globalState: Set < INavbarState >;
}