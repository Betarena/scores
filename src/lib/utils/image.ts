// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 22.05.2025                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Image module handler
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { config } from '../constants/config.js';
import { log_v3 } from './debug.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 CRITICAL
 *  - 🔷 HELPER
 * @description
 *  📝 Builds image target for using optimizations & transformations.
 * @example
 * ```ts
 * getOptimizedImageUrl
 * (
 *  {
 *    strImageUrl: 'https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/images%2Fexample.png?alt=media&token=xxxx-xxxx-xxxx-xxxx',
 *    intWidth: 800,
 *    intQuality: 80,
 *    strFitType: 'cover',
 *  }
 * );
 *
 * // output: 'https://img.betarena.com/i/images%2Fexample.png?alt=media&token=xxxx-xxxx-xxxx-xxxx&w=800&q=80&fit=cover'
 * ```
 * @param { object } _
 *  ❗️ **REQUIRED** - Instance
 * @param { string } _.strImageUrl
 *  ❗️ **REQUIRED** - Image URL to be optimized.
 * @param { number } _.intWidth
 *  ❔ **OPTIONAL** - Width of the image. `(default=600)`
 * @param { number } _.intQuality
 *  ❔ **OPTIONAL** - Quality of the image. `(default=75)`
 * @param { 'cover' | 'contain' | 'fill' | 'scale-down' } [_.strFitType='cover']
 *  ❔ **OPTIONAL** - Fit of the image. `(default: cover)`
 * @return { string }
 *  📤 Image `url` for desired transformation.
 */
export function getOptimizedImageUrl
(
  {
    strImageUrl = '',
    intWidth = 1000,
    intQuality = 90,
    strFitType = 'cover',
  }:
  {
    strImageUrl: string;
    intWidth?: number;
    intQuality?: number;
    strFitType?:
      | 'cover'
      | 'contain'
      | 'fill'
      | 'scale-down'
    ;
  }
): string
{
  // [🐞]
  log_v3
  (
    {
      strGroupName: '🚏 checkpoint ➤ getOptimizedImageUrl(..) // START',
      msgs: [
        `🔹 [var] ➤ strImageUrl ${strImageUrl}`,
        `🔹 [var] ➤ intWidth ${intWidth}`,
        `🔹 [var] ➤ intQuality ${intQuality}`,
        `🔹 [var] ➤ strFitType ${strFitType}`,
      ],
    }
  );

  if (strImageUrl.startsWith(config.objApp.strImageOptimizationServiceUrl))
    return strImageUrl;
  ;

  if (!strImageUrl.includes('firebasestorage.googleapis.com'))
    return strImageUrl;
  ;

  const
    /**
     * @description
     * 📝 Encoded image URL.
     */
    strImageUrlTrimmed = strImageUrl
      .replace
      (
        'https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/',
        ''
      )
      .replaceAll
      (
        '%2F',
        '/',
      )
      .split('?')[0]
  ;

  return `${config.objApp.strImageOptimizationServiceUrl}/i/${strImageUrlTrimmed}?w=${intWidth}&q=${intQuality}&fit=${strFitType}`;
}
