// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Page Loader (Server-Side)                                   │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports


import { main } from '$lib/sveltekit/load/load.layout.1.js';
import { dlogv2 } from '$lib/utils/debug.js';
import type { ServerLoadEvent } from '@sveltejs/kit';

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
  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ src/routes/+layout.server.ts',
    [
      `🔹 [var] ➤ request.headers.get('user-agent') :|: ${JSON.stringify([...event.request.headers.entries()], null, 4)}`,
    ],
    false
  );

  // ╭─────
  // │ NOTE: | WARNING:
  // │ > commented out due to interferences
  // │ > with error logs and code-traces.
  // ╰─────
  /*
    setHeaders
    (
      {
        'cache-control': 'public, max-age=3600'
      }
    );
  */

  return await main
  (
    event
  );
}

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]

