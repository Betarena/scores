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

import { config } from '$lib/constants/config.js';
import { main } from '$lib/sveltekit/load/load.author.page.article.js';

import type { ServerLoadEvent } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

export const ssr = config.objApp.objComponentConfiguration.get('src/routes/(authors)/a/[...permalink]/+page.server.ts')?.objSveltekitOptions?.isSsr ?? true;
export const csr = config.objApp.objComponentConfiguration.get('src/routes/(authors)/a/[...permalink]/+page.server.ts')?.objSveltekitOptions?.isCsr ?? true;
// export const prerender = false;

// #endregion ➤ 📌 VARIABLES

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
    // ╭─────
    // │ NOTE:
    // │ │: Destructure `object`.
    // ╰─────
    {
      langParam,
      config

    } = await event.parent()
  ;
  event.depends('app:author-article-page');
  return await main
  (
    event,
    {
      langParam,
      config
    }
  );
}

// #endregion ➤ 🔄 LIFECYCLE - [SVELTE-KIT]
