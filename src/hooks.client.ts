// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
// ### 📝 DESCRIPTION                                                         ◼️
// ### Client Hooks (a.k.a SveltKit Middleware)                               ◼️
// ### https://kit.svelte.dev/docs/hooks#shared-hooks                         ◼️
// ### NOTE: | WARNING:                                                       ◼️
// ### only applicable to load(..) lifecycle logic in +page[.server].ts files ◼️
// ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

// #region ➤ 📦 Package Imports

import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlog } from '$lib/utils/debug.js';
import * as Sentry from '@sentry/sveltekit';
import { Replay } from "@sentry/sveltekit";

import type { HandleClientError } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 💠 MISC.

// ### [🐞]
Sentry.init
(
  {
    dsn: import.meta.env.VITE_SENTRY_URL,
    tracesSampleRate: 1.0,
    release: import.meta.env.VITE_SCORES_PKG_VERSION,
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
// ### [🐞]
Sentry.setTags
(
  {
    location: 'client'
  }
);
// ### [🐞]
Sentry.setContext
(
  "📸 Data",
  {
    ...userBetarenaSettings.extractUserDataSnapshot()
  }
);

// ### [🐞]
dlog
(
  `🚏 checkpoint [H] ➤ src/hooks.client.ts`,
  true
);

// #endregion ➤ 💠 MISC.

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📌 Custom `Error` handle logic.
 *  NOTE:
 *  kept as an example.
 * @param param0
 *  `_inherited_types_`
 * @returns
 */
const customErrorHandler: HandleClientError = async (
    {
      error,
      event
    }
  ) =>
  {
    console.error("❌ An error occurred on the client side:", error, event);
    return;
  }
;

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE [SVELTE]

// ◼️◼️◼️ NOTE:
// ◼️◼️◼️ using Sentry with Custom Error Handler.
// export const handleError: HandleClientError = Sentry.handleErrorWithSentry(customErrorHandler);
// ◼️◼️◼️ or, alternatively,
export const handleError: HandleClientError = Sentry.handleErrorWithSentry();

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
