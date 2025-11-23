// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // November 12th, 2025 3:04 PM                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Intercom service for managing Intercom integration and user interactions.
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { tryCatchAsync } from "@betarena/scores-lib/dist/util/common.js";
import { log_v3 } from "./debug.js";

// #endregion ➤ 📦 Package Imports

export class Intercom
{
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 📌 │ VARIABLE(S)                                                                 │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   * 📝 Singleton instance.
   */
  static _instance: any;

  /**
   * @description
   * 📝 Intercom 'is-ready' flag (ie: exists in 'window' global object)
   */
  isReady: boolean = false;
  /**
   * @description
   * 📝 Intercom 'is-booted' flag (ie: has been booted with user data)
   */
  isBooted: boolean = false;
  /**
   * @description
   * 📝 Intercom 'is-UI-present' flag (ie: Intercom UI elements exist in DOM)
   */
  isUIPresent: boolean = false;

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ CONSTRUCTOR                                                                 │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  constructor ()
  {
    if (Intercom._instance)
      return Intercom._instance;
    ;

    this.checkStatus();

    Intercom._instance = this;
  }

  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 📌 │ HELPER METHODS                                                              │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📝 Check Intercom status
   * @return { void }
   */
  checkStatus
  (
  ): void
  {
    tryCatchAsync
    (
      () =>
      {
        if (window == undefined)
          return;
        ;

        let
          // ╭─────
          // │ NOTE:
          // │ |:
          // ╰─────
          [
            isReady,
            isBooted,
            isUIPresent,
          ] = [
            false,
            false,
            false,
          ]
        ;

        isReady =
        (
          typeof window.Intercom === "function"
        );

        isBooted =
        (
          window?.Intercom?.booted === true
        );

        isUIPresent =
        (
          document.querySelector('iframe[id="intercom-frame"]') != null
          &&
          (document.getElementsByClassName('intercom-lightweight-app').length > 0
          || document.querySelector('iframe[id="intercom-launcher-frame"]') != null)
        );

        if
        (
          this.isReady !== isReady
          || this.isBooted !== isBooted
          || this.isUIPresent !== isUIPresent
        )
          // [🐞]
          log_v3
          (
            {
              strGroupName: 'Service: Intercom // Check Status // Status Changed',
              msgs:
              [
                `isReady     » ${isReady}`,
                `isBooted    » ${isBooted}`,
                `isUIPresent » ${isUIPresent}`,
              ]
            },
          );
        ;

        this.isReady = isReady;
        this.isBooted = isBooted;
        this.isUIPresent = isUIPresent;

        return;

       }
    );

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📝 Update Intercom user settings
   * @param { object } _
   *  ❗️ **REQUIRED** Target user settings.
   * @return { void }
   */
  lifecycle
  (
    {
      uid,
      username,
      email,
      lang,
      competition_number,
      currentPageRouteIdVisibility,
      strLifecycleType
    }:
    {
      uid: string | NullUndef,
      username?: string | NullUndef,
      email?: string | NullUndef,
      lang?: string | NullUndef,
      competition_number?: number | NullUndef,
      currentPageRouteIdVisibility: boolean,
      strLifecycleType: 'boot' | 'update'
    }
  ): void
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: 'Service: Intercom // boot(..)',
        msgs:
        [
          `Updating Intercom settings for user UID » ${uid}`,
          `Lifecycle Type » ${strLifecycleType}`,
          `currentPageRouteIdVisibility » ${currentPageRouteIdVisibility}`,
        ]
      },
    );

    const
      /**
       * @description
       *  📝 Intercom settings
       */
      intercomSettings
        = {
          // ╭─────
          // │ NOTE:
          // │ |: Main Fields
          // ╰─────
          api_base: 'https://api-iam.intercom.io',
          app_id: 'yz9qn6p3',
          // ╭─────
          // │ NOTE:
          // │ |: Additional Fields
          // ╰─────
          uid,
          name: (username ?? ''),
          email: (email ?? `${uid}-unkown@gmail.com`),
          lang: (lang ?? 'en'),
          competition_number: (competition_number ?? 0),
        }
    ;

    window.intercomSettings = intercomSettings;

    if (strLifecycleType === 'update' || this.isBooted)
      window.Intercom
      (
        'update',
        {
          hide_default_launcher: currentPageRouteIdVisibility,
          last_request_at: Math.floor(Date.now() / 1000)
        }
      );
    else if (strLifecycleType === 'boot')
      window.Intercom
      (
        'boot',
        {
          ...intercomSettings,
          hide_default_launcher: currentPageRouteIdVisibility
        }
      );
    ;

    return;
  }
}