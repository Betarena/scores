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

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔷 HELPER
 * @description
 *  📝 Builds image target for using optimizations & transformations.
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
    strImageUrl,
    intWidth = 500,
    intQuality = 15,
    strFitType = 'cover'
  }:
  {
    strImageUrl: string;
    intWidth?: number;
    intQuality?: number;
    strFitType?: 'cover' | 'contain' | 'fill' | 'scale-down';
  }
): string
{
  const
    /**
     * @description
     * 📝 Encode the image URL to make it safe for use in a query string.
     */
    encoded = encodeURIComponent
    (
      strImageUrl
    )
  ;

  return `https://img.betarena.com?src=${encoded}&w=${intWidth}&q=${intQuality}&fit=${strFitType}`;
}
