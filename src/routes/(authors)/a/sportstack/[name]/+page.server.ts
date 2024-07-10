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

import { main } from '$lib/sveltekit/load/load.sportstack.js';
import { dlogv2 } from '$lib/utils/debug.js';

import type { ServerLoadEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE [SVELTE]

/**
 * @type {import('./$types').PageLoad}
 */
export async function load
  (
    { params, fetch, parent }: ServerLoadEvent
  ): Promise<any>
{

  const
    {
      langParam
    } = await parent()
    ;

  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ src/routes/(authors)/a/sportstack/[username]/+page.server.ts',
      [
        `🔹 [var] ➤ langParam :|: ${langParam}`,
      ],
      true
  );
  const {
    name = ""
  } = params;

  console.log("SERER PAGE")

  return main
    ({
      name,
      fetch,
      langParam
      }
    );
}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
