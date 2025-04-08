// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Authenticated User Common Logic                                         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { get } from '$lib/api/utils.js';
import { getUserLocation, getUserLocationFromIP } from '$lib/geo-js/init.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlogv2 } from './debug.js';

import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';
import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @description
 *   📣 get and set user target Geo. Country location using GeoJs.
 * @param { B_NAV_T } data
 *  💠 **[required]** Navbar data
 * @returns { void }
 */
export async function setUserGeoLocation
(
  data: B_NAV_T
): Promise < void >
{
  const if_M_0: boolean
    = userBetarenaSettings.extract('geo-bookmaker') !== undefined
  ;
  if (if_M_0) return;

  let
    /**
     * @description
     */
    geoRes = await getUserLocation(),
    /**
     * @description
     */
    userGeo
      = geoRes.country_code === undefined
        ? undefined
        : geoRes.country_code.toLowerCase()
  ;

  if (userGeo == null)
  {
    geoRes = await getUserLocationFromIP
    (
      '107.189.0.0'
    );
    userGeo = geoRes.country_code!.toLowerCase();
  }

  // ╭─────
  // │ CHECK :|: for existance of GEO available from bookmakers
  // ╰─────
  const
    data0
      =	data.scores_header_translations?.bookmakers_countries
        ?.find
        (
          function
          (
            item
          )
          {
            return (
              item[0].toString().toLowerCase() === userGeo!.toString().toLowerCase()
            );
          }
        )
  ;

  if (data0 == undefined) userGeo = 'en';

  userBetarenaSettings.updateData
  (
    [
      ['geoJs', geoRes],
      ['geo-bookmaker', userGeo.toLocaleLowerCase()]
    ]
  );

  return;
}
