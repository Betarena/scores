// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Page Loader ('Client-Side')                                 │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { ServerLoadEvent } from '@sveltejs/kit';

import { main } from '$lib/load/load.league.js';
import { dlogv2 } from '$lib/utils/debug.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/**
 * @type {import('./$types').PageLoad}
 */
export async function load
(
  event: ServerLoadEvent
): Promise < any >
{
  const
    {
      langParam
    } = await event.parent()
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/[sport]/[country]/[league_name]/+page.server.ts',
    [
      `🔹 [var] ➤ langParam :|: ${langParam}`,
    ],
    true
  );

  return await main
  (
    event,
    {
      langParam
    }
  );
}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
