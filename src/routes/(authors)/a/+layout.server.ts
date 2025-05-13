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

import { main } from '$lib/sveltekit/load/load.author.layout.js';

import type { ServerLoadEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🔄 LIFECYCLE - [SVELTE-KIT]

/**
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load
(
  event: ServerLoadEvent
): Promise < any >
{
  const
    // ╭─────
    // │ NOTE:
    // │ │: Destructure `object`.
    // ╰─────
    objParentData = await event.parent(),
    /**
     * @description
     * 📝 Method Response (0)
     */
    methodRes0
      = await main
      (
        event,
        objParentData as { langParam: string },
      )
  ;

  event.depends('author:translations');

  return {
    ...objParentData,
    translations: methodRes0,
  };
};

// #endregion ➤ 🔄 LIFECYCLE - [SVELTE-KIT]
