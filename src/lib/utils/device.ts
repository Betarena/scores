// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Device Logic                                                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import DeviceDetector from 'device-detector-js';
import parser from 'ua-parser-js';

import { dlogv2 } from '$lib/utils/debug';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Detect device used from target `User-Agent` data.
 * @param { string } userAgent
 *  💠 **[required]** Target `user-agent` string.
 * @see https://discord.com/channels/457912077277855764/1067871458233159750
 * @see https://discord.com/channels/457912077277855764/1067529519294070885/1067827869004341319
 * @returns { string }
 *  📤 Target `device` type.
 */
export function detectDeviceWithUA
(
  userAgent: string
): string
{
  let
    /**
     * @description
     *  📣 Target `device type`.
     */
    deviceType: string = 'mobile'
  ;

  const
    /**
     * @description
     *  📣 Using `ua-parser-js` module.
     */
    parsedUA = parser(userAgent),
    /**
     * @description
     *  📣 Using 'device-detector-js' module.
     */
    parsedUA2
      = new DeviceDetector().parse
      (
        userAgent
      )
  ;

  // [🐞]
  dlogv2
  (
    'detectDeviceWithUA(..)',
    [
      `🔹 [var] ➤ detectDeviceWithUA(..) parsedUA ${JSON.stringify(parsedUA, null, 4)}`,
      `🔹 [var] ➤ detectDeviceWithUA(..) parsedUA2 ${JSON.stringify(parsedUA2, null, 4)}`,
      `🔹 [var] ➤ detectDeviceWithUA(..) deviceType ${deviceType}`,
    ],
    false
  );

  deviceType = (parsedUA.device.type ?? 'mobile');
  deviceType = (parsedUA2.device?.type ?? 'mobile');

  return deviceType;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Identifies wether `PWA` is running.
 * @return { boolean }
 *  📤 Wether `app` is running in `PWA` mode.
 */
export function isPWA
(
): boolean
{
  return ['fullscreen', 'standalone', 'minimal-ui']
    .some
    (
      (displayMode) => {return window.matchMedia('(display-mode: ' + displayMode + ')').matches}
    )
  ;
}
