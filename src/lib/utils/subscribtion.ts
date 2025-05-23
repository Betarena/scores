// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // 2025-03-06                                                    │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ BETARENA (Module)
// │ |: Common Subscribtion/Event-Driven Logic
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { getInstance } from '$lib/constants/instance.js';
import { handleError, log_error_v1 } from './debug.js';
import { parseObject } from './string.2.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Initialize top level console controller.
 * @return { void }
 */
export function initializeTopLevelConsoleController
(
): void
{
  const
    // eslint-disable-next-line no-console
    log = console.log,
    // eslint-disable-next-line no-console
    groupCollapsed = console.groupCollapsed,
    // eslint-disable-next-line no-console
    group = console.group,
    // eslint-disable-next-line no-console
    debug = console.debug,
    // eslint-disable-next-line no-console
    warn = console.warn,
    // eslint-disable-next-line no-console
    error = console.error
  ;

  window.console.log = function
  (
    message,
    ...args
  ): void
  {
    if (getInstance('logging'))
      log(message, ...args);
    ;

    return;
  }

  window.console.groupCollapsed = function
  (
    ...args
  ): void
  {
    if (getInstance('logging'))
      groupCollapsed( ...args);
    ;

    return;
  }

  window.console.debug = function
  (
    message,
    ...args
  ): void
  {
    if (getInstance('logging'))
      debug(message, ...args);
    ;

    return;
  }

  window.console.group = function
  (
    ...args
  ): void
  {
    if (getInstance('logging'))
      group(...args);
    ;

    return;
  }

  window.console.warn = function
  (
    message,
    ...args
  ): void
  {
    // ╭─────
    // │ NOTE: IMPORTANT |:| Skip known handled errors, otherwise will go into an infinte loop of error logs.
    // ╰─────
    if (new RegExp('(🟦 HANDLED|⚠️ WARNING)').test(message))
    {
      warn(message, ...args);

      return;
    }

    warn(message, ...args);

    return;
  }

  window.console.error = function
  (
    message,
    ...args
  ): void
  {
    // ╭─────
    // │ NOTE: IMPORTANT |:| Skip known handled errors, otherwise will go into an infinte loop of error logs.
    // ╰─────
    if (new RegExp('❌ ERROR').test(message))
    {
      error(message, ...args);

      return;
    }

    const
      /**
       * @description
       * 📝 Parse log of object.
       */
      listMessageError: string[] = []
    ;

    listMessageError.push(parseObject(message));

    // [🐞]
    for (const element of args)
      listMessageError.push(parseObject(element));
    ;

    const
      /**
       * @description
       * 📝 Error message parsing outcome.
       */
      isHandled
        = handleError
        (
          listMessageError.join()
        )
    ;

    if (!isHandled)
      // [🐞]
      log_error_v1
      (
        {
          strErrorMsg: message,
          type: 'error',
          excpetion: listMessageError.join()
        }
      );
    ;

    return;
  }

  return;
}
