/**
 * THis is the ContentLoader
 * INTERFACE
 * ~~~~~~~~~~~~~~~~~~~~~~~~~
 * Documentation:
 * https://github.com/PaulMaly/svelte-content-loader?ref=madewithsvelte.com
 * 
 * How it works? Example;
 * https://github.com/PaulMaly/svelte-content-loader/blob/master/src/ContentLoader.svelte 
*/


/**
 * ContentLoaderProps
 * INTERFACE 
*/
export interface ContentLoaderProps {
    width?: number | string	    // Default - 400	
    height?: number | string	// Default - 130	
    speed?: number	            // Default - 2	
    preserveAspectRatio?: string	// Default - 'xMidYMid meet'	
    primaryColor?: string	        // Default '#f9f9f9'	
    secondaryColor?: string	        // Default - '#ecebeb'	
    uniqueKey?: string	            // randomId() Unique ID, you need to make it consistent for SSR
    animate?: boolean	            // DEfault - true	
    baseUrl?: string	            // empty string	- Required if you're using in your . Defaults to an empty string.
                                    // This prop is common used as: which will fill the SVG attribute with the relative path.
    primaryOpacity?: number	        // Deafult - 1 Background opacity (0 = transparent, 1 = opaque) used to solve an issue in Safari
    secondaryOpacity?: number	    // Default - 1 Background opacity (0 = transparent, 1 = opaque) used to solve an issue in Safari
}