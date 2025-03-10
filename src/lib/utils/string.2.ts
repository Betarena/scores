// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores String Logic                                                            │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import stringify from 'json-stringify-safe';
import { serializeError } from 'serialize-error';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Strigify `object`, with `circular dependency` cautionary handle.
 * @param { any } obj
 *  💠 **REQUIRED** Object to parse.
 * @return { string }
 *  📤 Parsed object as `string`.
 */
export function parseObject
(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any
): string
{
  try
  {
    if (obj instanceof Error)
      return stringify(serializeError(obj));
    else if (obj instanceof Map || obj instanceof Set)
      return stringify([...obj]);
    else if (typeof obj === 'string')
      return obj;
    else
      return stringify(obj);
    ;
  }
  catch (error)
  {
    return '';
  }
}
