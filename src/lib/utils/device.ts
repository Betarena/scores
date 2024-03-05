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
