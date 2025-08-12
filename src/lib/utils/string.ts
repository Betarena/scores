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

import sessionStore from '$lib/store/session.js';
import { checkNull } from '$lib/utils/miscellenous.js';
import { removeDiacritics } from './languages.js';

import type { B_SAP_CTP_D, B_SAP_D3, B_SAP_PP_D } from '@betarena/scores-lib/types/v8/preload.scores.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Clean url `string`, used for app navigation.
 * @param { string | NullUndef } url
 *  💠 **[required]** **url** to be clean.
 * @returns { string }
 *  📤 Cleaned `string` url
 */
export function cleanUrl
(
  url: string | NullUndef
): string
{
  if (url == null) return '';

  url = url
    .replace
    (
      'https://scores.betarena.com',
      ''
    )
    .replace
    (
      'https://betarena.com',
      ''
    )
    .replace
    (
      'https://www.betarena.com',
      ''
    )
  ;

  if (!url.startsWith('/'))
    url = '/'+url;
  ;

  return url;
}

/**
 * @author
 *  @migbash
 * @description
 *  📣 Helper to generate expected canonical url.
 * @param url
 *  💠 **[required]** **url** to be cleaned.
 * @return { string }
 *  📤 Cleaned `string` url
 */
export function helperExpectedCanonicalUrl
(
  url: string | NullUndef
): string
{
  if (url == null) return '';

  url = url
    .replace
    (
      'https://scores.betarena.com',
      'https://betarena.com'
    )
  ;

  return url;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Generates new url for when a `translation` switch occurs.
 * @param { string } lang
 *  💠 **[required]** **current** platform language.
 * @param { B_SAP_D3 } data
 *  💠 **[required]** alternative links for player.
 * @returns { string }
 *  📤 Generated **url**.
 */
export function generateUrlPlayer
(
  lang: string,
  data: B_SAP_PP_D
): string
{
  const
    /**
     * @description
     * - 📌 New url for player.
     */
    newUrl
      = `/${data.alternate_data?.[lang] ?? ''}`.replace
      (
        'https://scores.betarena.com',
        ''
      )
  ;

  return newUrl;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Generates new url for when a `translation` switch occurs.
 * @param { string } lang
 *  💠 **[required]** **current** platform language.
 * @param { B_SAP_D3 } data
 *  💠 **[required]** **translations** for the term "_competitions_".
 * @returns { string }
 *  📤 Generated **url**.
 */
export function generateUrlCompetitions
(
  lang: string,
  data: B_SAP_D3
): string
{
  const competitionTerm = removeDiacritics(data[lang]);

  let
    /**
     * @description
     */
    newUrl: string
      = lang == 'en'
        ? `/${competitionTerm}`
        : `/${lang}/${competitionTerm}`
  ;

  newUrl = newUrl.replace
  (
    'https://scores.betarena.com',
    ''
  );

  if (checkNull(newUrl) || checkNull(competitionTerm)) return '/';

  return newUrl;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Generates new url for when a `translation` switch occurs.
 * @param { string } lang
 *  💠 **[required]** **current** platform language.
 * @param { B_SAP_CTP_D } competitionData
 *  💠 **[required]** **competition data**.
 * @returns { string }
 *  📤 Generated **url**.
 */
export function generateUrlCompetition
(
  lang: string,
  competitionData: B_SAP_CTP_D
): string
{
  let newUrl: string = `/${competitionData.alternate_data?.[lang]}`;

  newUrl = newUrl.replace
  (
    'https://scores.betarena.com',
    ''
  );

  if (checkNull(newUrl)) return '/';

  return newUrl;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Splice a balance `string` double zero from value
 * @param { string | NullUndef } value
 *  💠 **[required]** balace for trimming
 * @returns { string | null }
 *  📤 Balance `string` without `.00` value.
 */
export function spliceBalanceDoubleZero
(
  value: string | NullUndef
): string | null
{
  if (value == null) return null;

  if (value.includes('.00'))
    return value.split('.')[0];
  ;

  return value;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Correct country url asset generation
 * @param { string } value
 *  💠 **[required]** `ISO` value
 * @returns { string }
 *  📤 Correct `ISO` logo asset
 */
export const iso2CountryLogo = (
  value: string
): string =>
{
  return value != undefined
    ? `/assets/flags/${value}.svg`
    : '/assets/flags/EN.svg'
  ;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟥 MAIN
 *  - 🟦 HELPER
 * @description
 *  📣 Language url `string` prefix
 * @returns { string }
 *  📤 Correct `ISO` logo asset
 */
export function langPrefix
(
): string
{
  return sessionStore.extract('lang') == 'en'
    ? '/'
    : `/${sessionStore.extract('lang')}/`
  ;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Shortens a target wallet address.
 * @example
 *  shortenWeb3WalletAddress("0xA43B84b58aC6a21A03391971Bd274fe7Eec378Eb") => 0xA43...378Eb
 * @returns { string | null }
 *  💠 **[required]** `wallet address` string.
 * @returns { string }
 *  📤 Correct `wallet address` shorten
 */
export function shortenWeb3WalletAddress
(
  walletAddress: string | null
): string | null
{
  if (!walletAddress) return null;

  const
    /**
     * @description
     */
    walletStr
      = `
        ${walletAddress.slice(0, 5)}
        ...
        ${walletAddress.slice(-5)}
        `
        .replaceAll('\t', '')
  ;

  return walletStr;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Converts target `number` into a **number with commas** for _thousandths_ separator.
 * @param { number } x
 *  💠 Target `number` to format.
 * @handles
 *  ⭕️ Takes care of `null` / `undefined` cases.
 * @example
 * - null => ''
 * - undefined => ''
 * - 1000 => 1,000
 * - 1000000 => 1,000,000
 * - 5000 => 5,000
 * @return { string }
 *  📤 Formatted `number` (as `string`) for _thousnads_.
 */
export function formatNumberWithCommas
(
  x: number | null | undefined
): string
{
  if (x?.toString().includes('.')) return x.toString();
  return x
    ?.toString()
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    ?? ''
  ;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🔹 HELPER
 *  - ⭐️ IMPORTANT
 * @description
 *  📌 Converts value to a float based value string.
 * @example
 * // returns 20.20
 * toDecimalFix(20.203453)
 * // returns 20.2043
 * toDecimalFix(20.204343, 4)
 * // returns 20.2043
 * toDecimalFix(20.204343, 4, true)
 * // returns 20.2043
 * toDecimalFix(20.204343, 4, true, false)
 * @param { number | null } value
 *  💠 **[required]** Value to mutate for decimal places.
 * @param { number } [dPlaces=2]
 *  💠 **[optional]** Number of decimal places to apply, `deafult = 2`.
 * @param { boolean } [noRoundUp=false]
 *  💠 **[optional]** Wether to perform a `round-up` or not, `deafult = false`.
 * @param { boolean } [removeDot00=true]
 *  💠 **[optional]** Wether to perform a `.00` removal from number (clean), `deafult = true`.
 * @returns { string }
 *  📤 Mutated value, adjusted for decimal places.
 */
export function toDecimalFix
(
  value: number | null | undefined
  , dPlaces: number = 2
  , noRoundUp: boolean = false
  , removeDot00: boolean = true
): string
{
  if (value == null) return '-';

  let _value: string  = value.toString();

  if (noRoundUp && _value.includes('.'))
    _value = _value
      .slice
      (
        0,
        (_value.indexOf('.')) + (dPlaces + 1)
      );
  ;

  _value = parseFloat(_value).toFixed(dPlaces);

  if (removeDot00)
    _value = _value.replace
    (
      '.00',
      ''
    );
  ;

  return _value;
}

// #endregion ➤ 🛠️ METHODS
