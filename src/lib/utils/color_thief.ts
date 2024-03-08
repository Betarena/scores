// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Color Thief Logic                                                    │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { dev } from '$app/environment';

import ColorThief from 'colorthief/dist/color-thief.mjs';

// #endregion ➤ 📦 Package Imports

const colorThief = new ColorThief();

/**
 * 
 * @param r 
 * @param g 
 * @param b 
 * @returns 
 */
export const rgbToHex = (
  r,
  g,
  b
) =>
{
  return '#' + [r, g, b]
    .map
    (
      (
        x
      ) =>
      {
        const hex = x.toString(16);
        return hex.length === 1
          ? `0${hex}`
          : hex
        ;
      }
    )
    .join('')
  ;
}

/**
 *
 * @param imgURL
 * @param imageVar
 */
export function getImageBgColor
(
  imgURL: string,
  imageVar: string
): void
{
  try
  {
    const img = new Image();
    // listen, event to wait for the image to load
    img.addEventListener
    (
      'load',
      () =>
      {
        const colorValues =	colorThief.getColor(img),

          // convert RGB => HEX;
          hexColor: string = rgbToHex
          (
            colorValues[0],
            colorValues[1],
            colorValues[2]
          ),

          // pass this values as a `CSS :root` variable, accessible to all the website,
          doc = document.documentElement;
        doc.style.setProperty
        (
          imageVar,
          `${hexColor}`
        );
		  }
    );
    // [ℹ] declaring the image paramaters & CORS by-pass
    const
      imageURL = imgURL,
      googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='
    ;
    img.crossOrigin = 'Anonymous';
    img.src =	`${googleProxyURL}${encodeURIComponent(imageURL)}`;
  }
  catch (e)
  {
    if (dev)
      console.error
      (
        '-- getImageBgColor() ERR --',
        e
      );
  }
}
