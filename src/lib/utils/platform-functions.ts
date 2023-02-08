/**
 * Simple GLOBALLY used method
 * for determining the current platfrom
 * language for Server-Side Rendering (SSR)
 * applications
 * 
 * @param page_route_id 
 * @param page_error 
 * @param page_params_lang 
 * @returns 
*/
export function platfrom_lang_ssr (
  page_route_id?: string | undefined,
  page_error?: unknown | undefined,
  page_params_lang?: string | undefined,
): string {
  // NOTE: default (EN)
  let server_side_language = 'en'
  // [ℹ] validation (#1)
  const validation_1 = page_route_id != null && !page_error
  if (!validation_1) return server_side_language
  // [ℹ] validation (#2)
  server_side_language =
    page_route_id.includes("[lang=lang]")
      ? page_params_lang
      : 'en'
  ;
  return server_side_language;
}

/**
 * Simple method that will return boolean for
 * the TABLET and MOBILE viewport changes
 * as a array/tuple
 * 
 * @param TABLET_VIEW 
 * @param MOBILE_VIEW 
 * @returns 
*/
export function viewport_change (
  TABLET_VIEW: number,
  MOBILE_VIEW: number
) {
  const w = document.documentElement.clientWidth;
  const tabletExclusive =
    w >= TABLET_VIEW
      ? false
      : true;
  const mobileExclusive =
    w <= MOBILE_VIEW
      ? true
      : false;
  return [tabletExclusive, mobileExclusive]
}