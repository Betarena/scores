// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Authentication Types                                        │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

type IAuthState =
  // ╭─────
  // │ NOTE: :|: Widget is 'Ready' for authentication flow and input.
  // ╰─────
  | 'AuthenticationStart'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit).
  // ╰─────
  | 'Processing'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit) for 'Email' login.
  // ╰─────
  | 'NewEmailRegisterationSent'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit) for 'Email' login.
  // ╰─────
  | 'ExistingEmailLoginSent'
  // ╭─────
  // │ NOTE: :|: Widget is 'Processing' authentication (post-submit) for 'Email' login.
  // ╰─────
  | 'AllowResendEmailLogin'
;

type IAuthErrorState =
  // ╭─────
  // │ NOTE: :|: Widget Error for incorrect `Email` input.
  // ╰─────
  | 'ErrorAuthEmailFormat'
  // ╭─────
  // │ NOTE: :|: Widget Error for invalid `Email` input, due to already existing.
  // ╰─────
  | 'EmailAlreadyInUse'
;

/**
 * @description
 *  📣 Scores Platfrom | Authentication State Interface.
 */
interface IAuthWidget
{
  /**
   * @description
   * 📝 Target **component** `multi-state` **store**, used for general `state` tracking.
   */
  globalState: Set < IAuthState >;
  /**
   * @description
   * 📝 Target **component** `multi-state` **store**, used for `error/exception` tracking.
   */
  globalStateErrors: Set < IAuthErrorState >;
  /**
   * @description
   * 📝 `Email` verification sent date
   */
  sentEmailDate: Date;
}