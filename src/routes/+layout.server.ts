// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: <insert-module-summary-here>
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { main } from '$lib/sveltekit/load/load.main.layout.js';

import type { ServerLoadEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE - [SVELTE-KIT]

/**
 * @type {import('./$types').ServerLoadEvent}
 */
export async function load
(
  event: ServerLoadEvent
): Promise < any >
{
  const
    /**
     * @description
     * 📝 Method Response (0)
     */
    methodRes0
      = await main
      (
        event
      )
  ;

  // ╭─────
  // │ NOTE: WARNING:
  // │ │: commented out due to interferences
  // │ │: with error logs and code-traces.
  // ╰─────
  /*
    setHeaders
    (
      {
        'cache-control': 'public, max-age=3600'
      }
    );
  */

  return methodRes0;
}

// #endregion ➤ 🔄 LIFECYCLE - [SVELTE-KIT]
