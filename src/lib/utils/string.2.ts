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
 *  ❗️ **REQUIRED** Object to parse.
 * @param { boolean } [isQuitNested=false]
 *  ❔ **OPTIONAL** If `true`, will not parse nested objects. `(default: false)`
 * @return { string }
 *  📤 Parsed object as `string`.
 */
export function parseObject
(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  isQuitNested: boolean = false
): string
{
  try
  {
    if (obj instanceof Error)
    {
      return stringify(serializeError(obj));
    }
    else if (obj instanceof Map || obj instanceof Set)
    {
      return stringify([...obj]);
    }
    else if (typeof obj === 'string')
    {
      return obj;
    }
    else if (typeof obj === 'object' && !isQuitNested)
    {
      const
        /**
         * @type { object }
         */
        _obj = {}
      ;
      // ╭─────
      // │ NOTE:
      // │ |: Loop over object properties
      // ╰─────
      for (const key in obj)
        _obj[key] = parseObject(obj[key], true);
      ;
      return stringify(_obj);
    }
    else
    {
      return stringify(obj);
    }
  }
  catch (error)
  {
    return '';
  }
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Convert `string` to `object`.
 * @param { string | NullUndef } strObject
 *  ❗️ **REQUIRED** String to parse.
 * @return { T1 | null }
 *  📤 Parsed string as JS object.
 */
export function stringToObject
<
  T1
>
(
  strObject: string | NullUndef
): T1 | null
{
  return JSON.parse
  (
    // @ts-expect-error :: <?>
    strObject ?? null
  );
}
