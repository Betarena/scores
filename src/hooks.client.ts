// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Client Hooks (a.k.a SvelteKit Middleware)                                      │
// │ > 🔗 read-more :|: https://kit.svelte.dev/docs/hooks#shared-hooks                │
// │ > NOTE: | WARNING:                                                               │
// │ > only applicable to load(..) lifecycle logic in +page[.server].ts files         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import * as Sentry from '@sentry/sveltekit';
import { Replay } from '@sentry/sveltekit';
import { table } from 'table';

import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlog } from '$lib/utils/debug.js';

import type { HandleClientError } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 💠 MISC.

// ╭─────
// │ CHECK
// │ > for disabling of Sentry on localhost
// ╰─────
if (import.meta.env.VITE_SENTRY_ENVIRONMENT != 'local')
{
  // [🐞]
  Sentry.init
  (
    {
      dsn: import.meta.env.VITE_SENTRY_URL,
      tracesSampleRate: 1.0,
      release: __PKG_VERSION_SCORES__,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,

      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 0.1,

      // If the entire session is not sampled, use the below sample rate to sample
      // sessions when an error occurs.
      replaysOnErrorSampleRate: 1.0,

      // If you don't want to use Session Replay, just remove the line below:
      integrations:
      [
        new Replay()
      ],
    }
  );
  // [🐞]
  Sentry.setTags
  (
    {
      location: 'client'
    }
  );
  // [🐞]
  Sentry.setContext
  (
    '📸 Data',
    {
      ...userBetarenaSettings.extractUserDataSnapshot()
    }
  );
}

// [🐞]
dlog
(
  '🚏 checkpoint [H] ➤ src/hooks.client.ts',
  true
);
// [🐞]
// eslint-disable-next-line no-console
console.debug
(
  table
  (
    [
      ['💮 [project] |:| scores', __PKG_VERSION_SCORES__],
      ['💮 [dependency] |:| @betarena/scores-lib', __PKG_VERSION_SCORES_LIB__],
      ['💮 [dependency] |:| @betarena/ad-engine', __PKG_VERSION_AD_ENGINE__],
      ['❓ [condition] |:| logging', import.meta.env?.VITE_PROD_LOGS],
      ['📌 [vite] |:| mode', import.meta.env.MODE],
      ['📌 [artifact] |:| .env', import.meta.env?.VITE_ENV_TARGET],
      ['📌 [sentry] |:| environment', import.meta.env?.VITE_SENTRY_ENVIRONMENT],
    ]
  )
);

// #endregion ➤ 💠 MISC.

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Custom `Error` handle logic.
 *  NOTE:
 *  kept as an example.
 * @param param0
 *  `_inherited_types_`
 * @returns { HandleClientError }
 */
const customErrorHandler: HandleClientError = async (
  {
    error,
    // event
  }
): Promise < App.Error > =>
{
  // [🐞]
  // eslint-disable-next-line no-console
  console.error('❌ An error occurred on the client side:', error);

  return {
    message: 'Whoops! Client error found!',
    errorId: '404'
  }
}

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE [SVELTE]

// ╭─────
// │ NOTE:
// │ > using Sentry with Custom Error Handler.
// ╰─────
export const handleError: HandleClientError = Sentry.handleErrorWithSentry(customErrorHandler);
// ╭─────
// │ NOTE:
// │ > or, alternatively:
// ╰─────
// export const handleError: HandleClientError = Sentry.handleErrorWithSentry();

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
