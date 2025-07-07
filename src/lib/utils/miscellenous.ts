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


/**
 * Creates a debounced version of the provided function that delays its execution
 * until after the specified delay has elapsed since the last time it was invoked.
 *
 * @template Args - The types of arguments accepted by the function to debounce.
 * @param fn - The function to debounce.
 * @param delay - The number of milliseconds to wait before invoking `fn` after the last call.
 * @returns A new debounced function with a `.cancel()` method to clear any pending invocation.
 *
 * @example
 * ```ts
 * // Logs only the last message after 300ms
 * const debouncedLog = debounce((msg: string) => console.log(msg), 300);
 * debouncedLog('Hello');
 * debouncedLog('World'); // After 300ms, only "World" is logged
 *
 * // Cancel the pending invocation
 * debouncedLog.cancel();
 * ```
 */
export function debounce<Args extends any[]>(
  fn: (...args: Args) => void,
  delay: number
) {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };

  /**
   * Cancels any pending invocation scheduled by the debounced function.
   */
  debounced.cancel = () => clearTimeout(timeout);

  return debounced;
}
