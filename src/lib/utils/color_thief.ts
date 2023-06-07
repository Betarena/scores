// ~~~~~~~~~~~~~~~~~~~~~
// COLOR-THIEF MODULE
// ~~~~~~~~~~~~~~~~~~~~~

import { dev } from '$app/environment';

import ColorThief from 'colorthief/dist/color-thief.mjs';

const colorThief = new ColorThief();

export const rgbToHex = 
(
  r, 
  g, 
  b
  ) =>
	'#' +
	[r, g, b]
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

export function getImageBgColor
(
	imgURL: string,
	imageVar: string
) 
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
        const colorValues =	colorThief.getColor(img);

        // convert RGB => HEX;
        const hexColor: string = rgbToHex
        (
          colorValues[0],
          colorValues[1],
          colorValues[2]
        );

        // pass this values as a `CSS :root` variable, accessible to all the website,
        const doc = document.documentElement;
        doc.style.setProperty
        (
          imageVar,
          `${hexColor}`
        );
		  }
    );
		// [ℹ] declaring the image paramaters & CORS by-pass
		const imageURL = imgURL;
		const googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
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
