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

import { table } from 'table';

import { config } from '$lib/constants/config.js';
import { dlog } from '$lib/utils/debug.js';

import type { HandleClientError } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 📌 VARIABLES

const
  // ╭─────
  // │ NOTE:
  // │ |: destructure assignment
  // ╰─────
  [
    objConfigModule,
  ] = [
    config.objApp.objComponentConfiguration.get('src/hooks.client.ts')!
  ]
;

// #endregion ➤ 📌 VARIABLES

// #region ➤ 💠 MISCELLANEOUS

// [🐞]
dlog
(
  '🚏 checkpoint [H] ➤ src/hooks.client.ts',
  true
);

// [🐞]
dlog
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

// #endregion ➤ 💠 MISCELLANEOUS

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
  console.error
  (
    objConfigModule.mapStrDebugPreifix?.get('customErrorHandler')!,
    error
  );

  return objConfigModule.objError!
}

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE [SVELTE]

// ╭─────
// │ NOTE:
// │ │: Instantiation of custom rrror handler.
// ╰─────
export const handleError: HandleClientError = customErrorHandler;

// #endregion ➤ 🔄 LIFECYCLE [SVELTE]
