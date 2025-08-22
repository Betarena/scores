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
import { utils as ethersUtils } from 'ethers';
import admin from 'firebase-admin';

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

// Initialize Express JSON middleware
app.use(express.json());

// Initialize Firebase Admin SDK
if (!admin.apps.length)
{
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount)
  {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount))
    });
  }
  else
  {
    console.warn('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
}

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ │ INTIAILIZATION (MISC.)                                      │
// ╰──────────────────────────────────────────────────────────────────╯

// ╭─────
// │ NOTE: IMPORTANT CRITICAL
// │ :| Let SvelteKit handle everything else,
// │ :| including serving prerendered pages and static assets.
// ╰─────
// Authentication route for SIWE
app.post('/auth/siwe', async (req, res) =>
{
  try
  {
    const { message, signature } = req.body ?? {};
    if (!message || !signature)
      return res.status(400).json({ error: 'Missing message or signature' });

    const walletAddress = ethersUtils.verifyMessage(message, signature);
    const token = await admin.auth().createCustomToken(walletAddress, { walletAddress });
    return res.json({ token });
  }
  catch (err)
  {
    console.error(err);
    return res.status(400).json({ error: 'Invalid signature' });
  }
});

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
