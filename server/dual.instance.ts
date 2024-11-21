// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2024-08-29                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module)
// │ |: Middleware Entrypoint
// │ |: DOC: https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import express from 'express';

// @ts-expect-error :: 🐞
import { handler } from './build/handler.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

// [🐞]
console.log(`🚏 checkpoint :: Spinning up Express (Middleware) Server`);

const
  /**
   * @description
   * 📝 express app declaration
   */
  app = express(),
  /**
   * @description
   * 📝 dev mode flag
   */
  dev = process.env.IS_DEV == 'true' ? true : false
;

// [🐞]
console.log(`🔹 [var] :: VITE_HASURA_DB_TOKEN ${process.env?.VITE_HASURA_DB_TOKEN}`);

// #endregion ➤ 📌 VARIABLES

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ │ INTIAILIZATION (MISC.)                                      │
// ╰──────────────────────────────────────────────────────────────────╯

// ╭─────
// │ NOTE: IMPORTANT CRITICAL
// │ :| Let SvelteKit handle everything else,
// │ :| including serving prerendered pages and static assets.
// ╰─────
app.use(handler);

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🚀 │ APP SPIN-UP                                                 │
// ╰──────────────────────────────────────────────────────────────────╯

if (!dev)
{
	// [🐞]
	console.log(`🚏 checkpoint :: Spinning up Production`);
	app.listen
  (
    3000,
    () =>
    {
      // [🐞]
      console.log(`🚏 checkpoint :: Server listening on port 3000`);
      return;
  	}
  );
}
else
{
	// [🐞]
	console.log(`🚏 checkpoint :: Spinning up Staging`);
	app.listen
  (
    5055,
    () =>
    {
      // [🐞]
      console.log(`🚏 checkpoint :: Server listening on port 5055`);
      return;
	  }
  );
}
