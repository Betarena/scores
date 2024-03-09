// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Miscellenous Logic                                          │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 "pause" JavaScript execution for X milliseconds.
 * @param { number } ms
 *  💠 Number of Milliseconds.
 * @return { Promise < void > }
 */
export async function sleep
(
  ms: number
): Promise < void >
{
  // [🐞]
  // eslint-disable-next-line no-console
  console.log('😴 sleeping...');

  return new Promise
  (
    (
      r
    ) =>
    {
      return setTimeout
      (
        r
        , ms
      )
    }
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Copy `text` to client `clipboard`.
 * @NOTE
 *  📌 On `dev` only will work on an `SSL/TLS` address, or `localhost`.
 * @param { string } copyText
 *  💠 **[required]** `text` to copy.
 * @returns { Promise < void > }
 */
export async function copyToClipboard
(
  copyText: string
): Promise < void >
{
  await navigator.clipboard.writeText(copyText);

  // alert('Copied: ' + copyText);

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Generates an `object` from target `Map(..)`.
 * @param { Record < any, any > | null } [record=null]
 *  💠 **[required]** Record data
 * @returns
 *  📤 `object`
 */
export function recordToKeyValueArray
(
  record: Record < any, any > | null = null
): any[][]
{
  if (!record) return [];

  const
    jsonObj = Object.keys(record)
      .map
      (
        (
          key
        ) =>
        {return [key, JSON.parse(record[key])]}
      )
  ;

  return jsonObj;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - TEST
 *  - LAB
 * @description
 *  📣 Generates an `object` from target `Map(..)`.
 * @returns { Promise < void > }
 */
export function cssVarChange
(
): void
{
  let value = 'false';

  setInterval
  (
    () =>
    {
      const currentValue = getComputedStyle(document.documentElement).getPropertyValue('--header-is-mobile');

      // console.log(`🔹 [var] --header-is-mobile: ${currentValue}`)
      // console.log(`🔹 [var] value: ${value}`)

      if (currentValue != value)
      {
        // ### NOTE:
        // ### The css-variable has changed
        value = currentValue;
        // eslint-disable-next-line no-console
        console.log('🔥 Header Is now Mobile!');
      }

      // console.log('📌 Checking')
    },
    500
  );
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 * @description
 *  📌 Lambda `arrow-function` TryCatch` wrapper.
 * @param { any } action
 *  Target function / method execution.
 * @returns { unknown }
 * An unknown return.
 */
export const tryCatch = (
  action: any
): unknown =>
{
  try
  {
    return action();
  }
  catch (ex)
  {
    // [🐞]
    // eslint-disable-next-line no-console
    console.debug
    (
      `🚏 checkpoint ➤ tryCatch error : ❌ ${ex}`
    );

    return null;
  }
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Determine wether target value is `empty` / `null`.
 * @example
 *  => checkNull(undefined) => (output) `true`.
 *  => checkNull("hello") => (output) `false`.
 * @param { any } value
 *  💠 **[required]** Target value that requires testing.
 * @return { boolean }
 *  📤 `Boolean` representing respective identified value state.
 */
export const checkNull = (
  value: any
): boolean =>
{
  return value == undefined
    || value == null
  ;
}
