// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ [🐞] Scores Common/Global Logic                                                  │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable camelcase */

// #region ➤ 📦 Package Imports

import { dlog, dlogv2 } from './debug.js';

// #endregion ➤ 📦 Package Imports

/**
 * @deprecated
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Determines language (SSR) of platform.
 * @param { string | undefined } pageRouteId
 *  💠 Target page `routeId`.
 * @param { unknown | undefined } pageError
 *  💠 Target page `error` object.
 * @param { string | undefined } pageParamsLang
 *  💠 Target page `params` for `lang`.
 * @return { string }
 *  📤 Target current `platform` language.
 */
export function platfrom_lang_ssr
(
  pageRouteId?: string | undefined | null,
  pageError?: unknown | undefined,
  pageParamsLang?: string | undefined
): string
{
  // [🐞]
  dlogv2
  (
    'platfrom_lang_ssr(..)',
    [
      `🔹 [var] pageRouteId: ${pageRouteId}`,
      `🔹 [var] pageError: ${JSON.stringify(pageError, null, 2)}`,
      `🔹 [var] pageParamsLang: ${pageParamsLang}`
    ]
  );

  // ╭─────
  // │ CHECK
  // │ > cases of 'EN' default.
  // ╰─────
  if (pageRouteId == null && pageError != null) return 'en';

  const
    /**
     * @description
     *  📣 Target detected **language**.
     */
    language: string
    = (pageRouteId?.includes('[[lang=lang]]') || pageRouteId?.includes('[lang=lang]'))
    && pageParamsLang != undefined
      ? pageParamsLang
      : 'en'
  ;

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ platfrom_lang_ssr(..) language ➡️ ${language}`
  );

  return language;
}

/**
 * @deprecated
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Determines `tablet`, `mobile` and `other` viewport changes as a array/tuple of the `x` states
 * @param { number } TABLET_VIEW_INIT
 *  💠 Target viewport/width at which `tablet` is expected to start.
 * @param { number } MOBILE_VIEW_INIT
 *  💠 Target viewport/width at which `mobile` is expected to start.
 * @param { number } OTHER_VIEW
 *  💠 Custom target viewport/width.
 * @return { boolean[] }
 *  📤 An array of boolean's for each respective width.
 */
export function viewport_change
(
  TABLET_VIEW_INIT: number,
  MOBILE_VIEW_INIT: number,
  OTHER_VIEW: number = 0
): boolean[]
{
  const
    width: number = document.documentElement.clientWidth,
    isTabletView: boolean = width <= TABLET_VIEW_INIT,
    isMobileView: boolean = width <= MOBILE_VIEW_INIT,
    isOtherView: boolean = width <= OTHER_VIEW
  ;

  return [
    isTabletView,
    isMobileView,
    isOtherView
  ];
}
