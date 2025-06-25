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

import session from '$lib/store/session.js';
import { dlog, dlogv2 } from '$lib/utils/debug';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Detect device used from `User-Agent` data.
 * @param { string } userAgent
 *  💠 **[required]** `user-agent` string.
 * @see https://discord.com/channels/457912077277855764/1067871458233159750
 * @see https://discord.com/channels/457912077277855764/1067529519294070885/1067827869004341319
 * @returns { string }
 *  📤 `device` type.
 */
export function detectDeviceWithUA
(
  userAgent: string
): string
{
  let
    /**
     * @description
     *  📣 `device type`.
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
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Determines initial device type, by the assigned `user-agent` data.
 * @param { string } deviceType
 *  💠 **[required]** `user-agent` detected device.
 * @returns { boolean[] }
 *  📤 `Boolean` array, corresponding to `mobile` and `tablet`.
 */
export function initialDevice
(
  deviceType: string
): boolean[]
{
  let
    isMobileView: boolean,
    isTabletView: boolean
  ;

  if (deviceType == 'mobile')
  {
    isMobileView = true;
    isTabletView = false;
  }
  else if (deviceType == 'tablet')
  {
    isMobileView = true;
    isTabletView = true;
  }
  else if (deviceType == 'desktop')
  {
    isMobileView = false;
    isTabletView = false;
  }

  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ home/Layout.svelte 🖥️',
    true
  );

  return [
    isMobileView!,
    isTabletView!
  ]
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

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  - 📣 Determines `tablet`, `mobile` and `other` viewport changes as a array/tuple of the `x` states.
 *  - 📣 Successor to `viewport_change(..)`.
 * @param { number } currentWidth
 *  💠 **[required]** Current width of `window/document`.
 * @param { number } MOBILE_VIEW_INIT
 *  💠 **[required]** viewport/width at which `mobile` is expected to start.
 * @param { number } TABLET_VIEW_INIT
 *  💠 **[required]** viewport/width at which `tablet` is expected to start.
 * @param { number } [OTHER_VIEW=0]
 *  💠 Custom viewport/width. (`default=0`)
 * @return { boolean[] }
 *  📤 Array of boolean's for each respective width.
 */
export function viewportChangeV2
(
  currentWidth: number,
  MOBILE_VIEW_INIT: number,
  TABLET_VIEW_INIT: number,
  OTHER_VIEW: number = 0,
): boolean[]
{
  const
    isTabletView: boolean = currentWidth <= TABLET_VIEW_INIT,
    isMobileView: boolean = currentWidth <= MOBILE_VIEW_INIT,
    isOtherView: boolean = currentWidth <= OTHER_VIEW
  ;

  return [
    isMobileView,
    isTabletView,
    isOtherView
  ];
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 * @description
 *  📣 Determines wether `user-agent` is a `bot`.
 * @param { string } userAgent
 *  💠 **[required]** `user-agent` string.
 * @returns { boolean }
 *  📤 Wether `user-agent` is a `bot`.
 */
export function isUserAgentBot
(
): boolean
{
  const
    /**
     * @description
     * 📣 `session` data.
     */
    strUserAgent = session.extract<string>('userAgent')
  ;

  if (!strUserAgent)
  {
    // [🐞]
    console.error('No user agent found');
    return false;
  }

  return /bot|googlebot|crawler|spider|robot|crawling/i.test(strUserAgent);
}

/**
 * @author
 * @izobov
 * @summary
 *  - 🔹 HELPER
 * @description
 *  📣 Determines if the app is installed as a PWA.
 * @returns { boolean }
 *  📤 Wether the app is installed as a PWA.
 */
export function isAppInstalled(): boolean {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  const isTWA = document.referrer.startsWith('android-app://');
  return isStandalone || isIOSStandalone || isTWA;
}

/**
 * @author
 * @izobov
 * @summary
 *  - 🔹 HELPER
 * @description
 *  📣 Determines if the device is an Android device.
 * @returns { boolean }
 *  📤 Wether the device is an Android device.
 */
export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}