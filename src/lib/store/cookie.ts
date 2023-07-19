import cookie from 'cookie';

/**
 * @summary
 * 🔹 HELPER
 * @author
 * @migbash
 * @description
 * ➫ Sets target `cookie` on Scores Platform with specified values.
 * @param
 * { string } cName **[required]** target cookie name.
 * @param
 * { string } cValue **[required]** target cookie associated value.
 * @param
 * { number } expDays **[required]** target cookie days active (TTL).
 */
export function setCookie
(
  cName: string,
  cValue: string,
  expDays: number
): void
{
  const currentDate = new Date();
  currentDate.setTime
  (
    currentDate.getTime() + (expDays * 24 * 60 * 60 * 1000)
  );
  const expires = `expires=${currentDate.toUTCString()}`;
  document.cookie = `${cName}=${cValue}; ${expires}; path=/`;
  return;
}

/**
 * @summary
 * 🔹 HELPER
 * @author
 * @migbash
 * @description
 * ➫ Retrives 'all' cookies present in given 'request' Header.
 * @param
 * { string } cookiesInHeader
 * @returns
 * a `Record < string, string >` of `cookie` values.
 */
export function getCookie
(
  cookiesInHeader: string
): Record < string, string >
{
  const cookies: Record < string, string > = cookie.parse
  (
    cookiesInHeader ?? ''
  );
  return cookies;
}