// ~~~~~~~~~~~~~~~~~~~~~
// COLOR-THIEF MODULE
// ~~~~~~~~~~~~~~~~~~~~~

import { dev } from '$app/environment';
import ColorThief from 'colorthief/dist/color-thief.mjs';

// [ℹ] declaring a new instance of `ColorThief`;
const colorThief = new ColorThief();

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~~~~
 * A function-method to convert the
 * [x,a,c] of RBG values to `#HEX` values
 * @param r
 * @param g
 * @param b
 * @returns (# a singel #HEX-Color Value)
*/
export const rgbToHex = (r, g, b) =>
  '#' + [r, g, b]
  .map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  })
  .join('');

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~~~~
 * a function-method to obtain the main
 * `primary` color of the image
 * and place it on the background
 * container to keep the image the same size
 * @param imgURL
*/
export function getImageBgColor(imgURL: string, imageVar: string) {

  try {
    // instantiate the image Type;
    const img = new Image();
    // listen, event to wait for the image to load
    img.addEventListener('load', function () {
      // get the array of RGB values,
      const colorValues = colorThief.getColor(img);
      // convert the RGB values to HEX value,
      const hexColor: string = rgbToHex(colorValues[0], colorValues[1], colorValues[2]);
      // pass this values as a `CSS :root` variable, accessible to all the website,
      const doc = document.documentElement;
      doc.style.setProperty(imageVar, `${hexColor}`);
    });
    // [ℹ] declaring the image paramaters & CORS by-pass
    const imageURL = imgURL;
    const googleProxyURL =
      'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(imageURL);
  }
  catch (e) {
    if (dev) console.error('-- getImageBgColor() ERR --', e);
  }
}