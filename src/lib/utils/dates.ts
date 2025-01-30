// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Date Logic                                                  │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

import type { TranslationAuthorPublicationDateDataTimeAgo } from "@betarena/scores-lib/types/v8/_HASURA-0.js";

export const
  MONTH_NAMES_ABBRV: string[]
    = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
  WEEK_DAYS_ABBRV: string[]
    = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ],
  WEEK_DAYS_ABBRV_1: string[]
    = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thur',
      'Fri',
      'Sat'
    ],
  WEEK_DAYS_ABBRV_2: string[]
    = [
      'Mon',
      'Tue',
      'Wed',
      'Thur',
      'Fri',
      'Sat',
      'Sun'
    ],
  monthNames: string[]
    = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
  weekDays: string[]
    = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ]
;

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Applies a `suffix` to target `number` of its **oridinal type**.
 * @example
 *  => getOrdinalNum(5) => `5th`.
 *  => getOrdinalNum(4) => `4th`.
 *  => getOrdinalNum(1) => `1st`.
 * @param { number } num
 *  💠 **[required]** Target **ordinal** `value`.
 * @return { string }
 *  📤 A `number` expressed as `string` with an ordinal suffix value.
 */
export const getOrdinalNum = (
  num: number
): string =>
{
  let selector: number;
  const ordinalStr: string[] = ['th', 'st', 'nd', 'rd', ''];

  selector = num % 10;
  if (num <= 0) selector = 4;
  if ((num > 3 && num < 21) || num % 10 > 3) selector = 0;

  const ordinalConStr =  `${num} ${ordinalStr[selector]}`

  return ordinalConStr;
};

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Instantiates target `date` for the current client, applying correct target user timezone;
 * @return { Date }
 *  📤 Target `Date`
 */
export function clientTimezoneDate
(
): Date
{
  const date = new Date();

  // ╭─────
  // │ NOTE:
  // │ > [STASH] [1]
  // ╰─────
  // const timeOffsetInHours = -(new Date()).getTimezoneOffset()/60
  // date.setHours(date.getHours() + timeOffsetInHours)

  // ╭─────
  // │ NOTE:
  // │ > [STASH] [2]
  // ╰─────
  // date.setTime( date.getTime() - new Date().getTimezoneOffset()*60*1000 );

  // [🐞]
  // dlog
  // (
  //   `🔹 [var] ➤ date ${date}`,
  //   true
  // );

  return date;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Converts target date to an ISO_string of `yyyy-MM-dd` format.
 *  - ⚡️ Handles dates of `T00:00:00` format and adds in (timezone) `Z`.
 *  - ⚡️ Handles dates of `T00:00:00+` format and removes the `+` and adds `Z`.
 * @param { Date | string } date
 *  💠 **[required]** Target date to 'process'.
 * @param { boolean } [adjustClientTZ=false]
 *  💠 **[required]** Wether to 'adjust' date to that of the 'user' timezone.
 * @param { boolean } [showConversion=false]
 *  💠 **[required]** Wether to show date conversion process, for debug.
 * @return { string }
 *  📤 A `ISO Date` string of `yyyy-MM-dd` format.
 */
export function toISOMod
(
  date: Date | string,
  adjustClientTZ: boolean = false,
  showConversion: boolean = false
): string
{
  // [🐞]
  if (showConversion)
    console.log('CONVERSION [FROM]: ', date)
    ;

  // ### NOTE: CHECK
  // ### Check for date of typeof 'string'
  if (typeof(date) == 'string')
  {
    // ### NOTE: CHECK
    // ### Check for 'T00:00:00'
    // ### without the 'Z'
    // ### without the '+'
    const if_M_0
      = date.includes('T')
      && !date.includes('Z')
      && !date.includes('+')
    ;
    // ### Add, if necessary.
    if (if_M_0) date = `${date}Z`;

    // [🐞]
    if (showConversion)
      console.log('CONVERSION [STR]: ', date)
      ;

    date = new Date(date)
  }

  // [🐞]
  if (showConversion)
    console.log('CONVERSION [TO]: ', date)
    ;

  let formattedDate: string;

  // alternative (option)
  // NOTE: simply converts toIsoString(),
  // NOTE: with disregard for user's timezone;
  formattedDate = date.toISOString().substring(0, 10);

  // alternative (option)
  // NOTE:WARNING: issues with locales (JP) and anomalies;
  // NOTE:WARNING: converting the target date-object to local date structure;
  // const year = date.toLocaleString("default", { year: "numeric" });
  // const month = date.toLocaleString("default", { month: "2-digit" });
  // const day = date.toLocaleString("default", { day: "2-digit" });
  // const formattedDate = `${year}-${month}-${day}`;

  // alternative (option)
  // uses client TZ to construct ISO string;
  // NOTE:WARNING: issues with date adjustedf for user timezone;
  // NOTE:WARNING: when converting a T00:00:00Z string to BRAZIL new Date()
  if (adjustClientTZ)
  {
    const year: number = date.getFullYear(),
      month: string = toZeroPrefixDateStr(date.getMonth() + 1),
      day: string = toZeroPrefixDateStr(date.getDate());
    formattedDate = `${year}-${month}-${day}`;
  }

  // [🐞]
  if (showConversion)
    console.log('CONVERSION [ISO]: ', formattedDate)
    ;

  // IMPORTANT yyyy-MM-dd
  return formattedDate;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @description
 *  📣 converts target Date/string to JS Date Object.
 *  - ⚡️ adjusting for missing "Z" string, if necessary.
 *  - ⚡️ offsetting for user's current timezone, generating a UTC Date object.
 * @overload
 *  offset = true (default) -> converts Date to userClient Timezone;
 * @overload
 *  showConversion = false (default)
 * @example
 *  [1] "2023-12-12", locale: ja-JP => 2023-12-12
 *  [2] "2023-06-05T23:00:00+00:00" (string), => 2023-06-05 (Date)
 * @param { Date | string } date
 *  💠 **[required]** Target date to be handeled.
 * @param { boolean } [offset = true]
 *  💠 **[required]** Wether to offset data or not, in according to client timezone. (`default` = true)
 * @param { boolean } [showConversion = false]
 *  💠 **[required]** Wether to show conversion of dates or not. (`default` = false)
 * @return { Date }
 *  📤 A date object.
 */
export function toCorrectDate
(
  date: Date | string,
  offset: boolean = true,
  showConversion: boolean = false
): Date
{
  if (showConversion) console.log('CONVERSION toCorrectDate [FROM]: ', date)

  if (typeof(date) == 'string')
  {
    // check for 'TXX:YY:SS'
    const if_M0
      = date.includes('T')
      && !date.includes('Z')
      && !date.includes('+')
    ;
    // add, if necessary the Z
    if (if_M0)

      date = `${date}Z`

    date = new Date(date)
  }

  // ### NOTE:
  // ### ignore user's local/machine Timezone;
  // ### creating essentially a UTC Date object;
  // ### by reverting the client timezone offset value;
  if (offset)
  {
    const timeOffsetInHours: number = -(new Date()).getTimezoneOffset()/60
    date.setHours(date.getHours() - timeOffsetInHours)
  }

  if (showConversion) console.log('CONVERSION toCorrectDate [TO]: ', date)

  return date;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Converts Target Date of type 'string/number' to a leading/prefix based `0[..]` string.
 * @param { string | number } dateStr
 *  💠 **[required]** Target `date` value.
 * @return { string }
 *  📤 zero-prefixed date string.
 */
export function toZeroPrefixDateStr
(
  dateStr: string | number
): string
{
  const newDateStr = `0${dateStr}`;
  if (newDateStr.length > 2) return `${dateStr}`;
  return newDateStr
    .slice(-2)
    .split(' ')
    .join('')
  ;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Generate a `new Date()` using offsets in `hour`, `days`, `months`, `years`.
 * @param { number } [offsetDays=0]
 *  💠 [optional] Wether to offset date by `(+/-)X` days. (`default` = 0)
 * @param { number } [offsetMonths=0]
 *  💠 [optional] Wether to offset date by `(+/-)X` months. (`default` = 0)
 * @return { Date }
 *  📤 Target `Date`.
 */
export function targetDate
(
  offsetDays: number = 0,
  offsetMonths: number = 0
): Date
{
  const newDate: Date = new Date();
  if (offsetDays != 0)
    newDate.setDate(newDate.getDate() + offsetDays);
  ;
  return newDate;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Calculates `number` of days in a target mont & year.
 * @param { number } month
 *  💠 **[required]** Target month `number` i.e. `0 - 11`.
 * @param { number } year
 *  💠 **[required]** Target year `number`.
 * @return { number }
 *  📤 Target `number`.
 */
export function daysInMonth
(
  month: number,
  year: number
): number
{
  return new Date(year, month, 0).getDate();
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Calculates difference between 2 dates.
 * @param { Date } date1
 *  💠 **[required]** Target **first** `date` value.
 * @param { Date } date2
 *  💠 **[required]** Target **second** `date` value.
 * @return { number }
 *  📤 Target `number`.
 */
export function daysDiffNum
(
  date1: Date,
  date2: Date
): number
{
  const
    _timeDiff: number = date2.getTime() - date1.getTime(),
    dateDiff: number = (_timeDiff / (1000 * 3600 * 24))
  ;
  return dateDiff < 0 ? -dateDiff : dateDiff;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Conversion of **target** date to specific `dd/MM/yy` format.
 * @CUSTOM_TAGS
 *  Handle `null | undefined`.
 * @param { string | null } date
 *  💠 **[required]** Target `date` to be formated to.
 * @return { string }
 *  📤 Target formatted date.
 */
export function ddMMyyFormat
(
  date: string | null
): string
{
  if (date == null || date == '') return '-';

  return toZeroPrefixDateStr(new Date(date).getDate())
    + '/'
    + toZeroPrefixDateStr(new Date(date).getMonth() + 1)
    + '/'
    + (new Date(date).getFullYear()).toString().substr(-2)
  ;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Breaks down dates into respective countdown fields.
 * @param { number } dateDiff
 *  💠 **[required]** Target `date` difference.
 * @return { [ number, number, number, number, number ] }
 *  📤 Tuple data consisting of [total-hours, days, hours, minutes, seconds]
 */
export function breakdownDates
(
  dateDiff: number
): [number, number, number, number, number]
{
  return [
    /**
     * @description
     *  📣 Number of `seconds` from target date.
     */
    Math.floor((dateDiff / 1000) % 60),
    /**
     * @description
     *  📣 Number of `minutes` from target date.
     */
    Math.floor((dateDiff / 1000 / 60) % 60),
    /**
     * @description
     *  📣 Number of `hours` from target date.
     */
    Math.floor((dateDiff / (1000 * 60 * 60)) % 24),
    /**
     * @description
     *  📣 Number of `days` from target date.
     */
    Math.floor((dateDiff / (1000 * 60 * 60 * 24))),
    /**
     *  📣 Number of `hours` from target date.
     */
    Math.floor(dateDiff / (1000 * 60 * 60))
  ];
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Converts date to strings like '1 hour ago'.
 * @param { string | null } datestring
 *  💠 **[required]** Target `date`.
 * @return { string }
 *  📤 Target `string` .
 */
export function timeAgo(datestring: string | null | undefined, translation
  = {} as TranslationAuthorPublicationDateDataTimeAgo): string
{
  if (!datestring) return '';
  const now = new Date();
  const date = new Date(datestring);
  const months = now.getMonth() - date.getMonth();
  const years = now.getFullYear() - date.getFullYear();
  const dateDiff = now.getTime() - date.getTime();
  const minutes = Math.floor(dateDiff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const { just_now, minutes: tminutes, one_minute, one_day, hours: thours, one_hour, one_month, one_week, months: tmonths} = translation;
  if (minutes < 1) return just_now || 'just now';
  if (minutes === 1) return one_minute || '1 minute ago';
  if (hours < 1 && minutes > 1) return tminutes?.replace("{minutes}", `${minutes}`) || `${minutes} minute ago`;
  if (hours === 1) return one_hour || '1 hour ago';
  if (days < 1 && hours > 1) return thours?.replace("{hours}", `${hours}`) || `${hours} hour ago`;
  if (days === 1 ) return one_day || '1 day ago';
  if (days === 7) return one_week || '1 week ago';
  if (days < 30 && !months) return translation.days?.replace("{days}", `${days}`) ||`${days} day${days > 1 ? 's' : ''} ago`;
  if (months === 1) return one_month || '1 month ago';
  if (months > 1 && !years) return tmonths?.replace("{months}", `${months}`) || `${months} months ago`;

  return `${ddMMyyFormat(date.toDateString())} ${toZeroPrefixDateStr(date.getHours())}:${toZeroPrefixDateStr(date.getMinutes())}`;

}

