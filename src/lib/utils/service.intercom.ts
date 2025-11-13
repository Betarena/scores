// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @<author>                                                     │
// │ ➤ Maintainer(s) // @<author>                                                     │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: <insert-module-summary-here>
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { log_v3 } from "./debug.js";

// #endregion ➤ 📦 Package Imports

export class Intercom
{
  constructor() {}

  /**
   * @author
   *  @migbash
   * @description
   *  📝 Toggle Intercom visibility
   * @param { boolean } isEnabled
   *  ❗️ **REQUIRED** Target `isEnabled` flag.
   * @return { void }
   */
  toggle
  (
    isEnabled: boolean
  ): void
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: 'Service: Intercom // Toggle',
      },
    );

    const
      // ╭─────
      // │ NOTE:
      // │ |: destrcurte assignment
      // ╰─────
      [
        instanceIntercomElement
      ] = [
        document.getElementsByClassName('intercom-lightweight-app')[0] as unknown as HTMLElement
      ]
    ;

    if (isEnabled && instanceIntercomElement != undefined)
      instanceIntercomElement.style.display = 'unset';
    ;

    if (!isEnabled && instanceIntercomElement != undefined)
      instanceIntercomElement.style.display = 'none';
    ;

    return;
  }

  /**
   * @author
   *  @migbash
   * @description
   *  📝 Update Intercom user settings
   * @param { object } _
   *  ❗️ **REQUIRED** Target user settings.
   * @return { void }
   */
  update
  (
    {
      uid,
      username,
      email,
      lang,
      competition_number,
    }
  ): void
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: 'Service: Intercom // Update',
        msgs:
        [
          `Updating Intercom settings for user UID » ${uid}`,
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
          api_base: 'https://api-iam.intercom.io',
          app_id: 'yz9qn6p3',
          name: (username ?? ''),
          email: (email ?? `${uid}-unkown@gmail.com`),
          uid,
          lang: (lang ?? 'en'),
          competition_number: (competition_number ?? 0),
        }
    ;

    window.intercomSettings = intercomSettings;

    window.Intercom?.
    (
      'boot',
      {
        ...intercomSettings,
        hide_default_launcher: true
      }
    );
  }
}