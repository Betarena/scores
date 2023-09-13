import { dlog } from "./debug.js";

export const MONTH_NAMES_ABBRV: string[] =
[
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
];

export const WEEK_DAYS_ABBRV: string[] =
[
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

export const WEEK_DAYS_ABBRV_1: string[] =
[
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat'
];

export const WEEK_DAYS_ABBRV_2: string[] =
[
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat',
  'Sun'
];

export const monthNames: string[] =
[
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
];

export const weekDays: string[] =
[
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

/**
 * @summary
 * [HELPER]
 * @param
 * {number} num
 * @returns
 * a date string with an ordinal suffix value;
 */
export const getOrdinalNum =
(
  num: number
): string =>
{
  let selector: number;
  const ordinalStr: string[] = ['th', 'st', 'nd', 'rd', '']

  selector = num % 10;
  if (num <= 0) selector = 4;
  if ((num > 3 && num < 21) || num % 10 > 3) selector = 0;

  const ordinalConStr =  `${num} ${ordinalStr[selector]}`

  return ordinalConStr;
};

/**
 * @summary
 * 🔹 HELPER

 * @description
 * 📌 Instantiates target `date` for the current client,
 * applying correct target user timezone;
 *
 * @returns
 * a JavaScript Date object;
 */
export function clientTimezoneDate
(
): Date
{
  const date = new Date();

  // ### [STASH] [1]
  // const timeOffsetInHours = -(new Date()).getTimezoneOffset()/60
  // date.setHours(date.getHours() + timeOffsetInHours)

  // ### [STASH] [2]
  // date.setTime( date.getTime() - new Date().getTimezoneOffset()*60*1000 );

  // [🐞]
  dlog
  (
    `🔹 [var] ➤ date ${date}`,
    true
  );

  return date;
}

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 *
 * 📌 Converts target date to an ISO_string of `yyyy-MM-dd` format.
 *
 * ⚡️ Handles dates of `T00:00:00` format and adds in (timezone) `Z`.
 *
 * ⚡️ Handles dates of `T00:00:00+` format and removes the `+` and adds `Z`.
 *
 * @param
 * { Date | string } date - Target date to 'process'.
 *
 * @param
 * { boolean } [adjustClientTZ=false] - Wether to 'adjust' date to that of the 'user' timezone.
 *
 * @param
 * { boolean } [showConversion=false] - [🐞] Wether to show date conversion process, for debug.
 *
 * @returns
 * an ISO Date string of `yyyy-MM-dd` format.
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
    console.log("CONVERSION [FROM]: ", date)
  ;

  // ### NOTE: CHECK
  // ### Check for date of typeof 'string'
  if (typeof(date) == 'string')
  {
    // ### NOTE: CHECK
    // ### Check for 'T00:00:00'
    // ### without the 'Z'
    // ### without the '+'
    const if_M_0 =
      date.includes('T')
      && !date.includes('Z')
      && !date.includes('+')
    ;
    // ### Add, if necessary.
    if (if_M_0) date = `${date}Z`;

    // [🐞]
    if (showConversion)
      console.log("CONVERSION [STR]: ", date)
    ;

    date = new Date(date)
  }

  // [🐞]
  if (showConversion)
    console.log("CONVERSION [TO]: ", date)
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
    const year: number = date.getFullYear();
    const month: string = toZeroPrefixDateStr(date.getMonth() + 1);
    const day: string = toZeroPrefixDateStr(date.getDate());
    formattedDate = `${year}-${month}-${day}`;
  }

  // [🐞]
  if (showConversion)
    console.log("CONVERSION [ISO]: ", formattedDate)
  ;

  // IMPORTANT yyyy-MM-dd
  return formattedDate;
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 converts target Date/string to JS Date Object.
 * (⚡️) adjusting for missing "Z" string, if necessary.
 * (⚡️) offsetting for user's current timezone, generating a UTC Date object.
 *
 * @overload
 * offset = true (default) -> converts Date to userClient Timezone;
 *
 * @overload
 * showConversion = false (default)
 *
 * @example
 * [1] "2023-12-12", locale: ja-JP => 2023-12-12
 *
 * @example
 * [2] "2023-06-05T23:00:00+00:00" (string), => 2023-06-05 (Date)
 *
 * @param
 * { Date | string } date - Target date to be handeled.
 *
 * @param
 * { boolean } offset - Wether to offset data or not, in according to client timezone.
 *
 * @param
 * { boolean } showConversion - [🐞] Wether to show conversion of dates or not.
 *
 * @returns
 * a date object.
 */
export function toCorrectDate
(
  date: Date | string,
  offset: boolean = true,
  showConversion: boolean = false
): Date
{
  if (showConversion) console.log("CONVERSION toCorrectDate [FROM]: ", date)

  if (typeof(date) == 'string')
  {
    // check for 'TXX:YY:SS'
    const if_M0 =
      date.includes('T')
      && !date.includes('Z')
      && !date.includes('+')
    ;
    // add, if necessary the Z
    if (if_M0)
    {
      date = `${date}Z`
    }
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

  if (showConversion) console.log("CONVERSION toCorrectDate [TO]: ", date)

  return date;
}

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 *
 * 📌 Converts Target Date of type 'string/number' to a
 * leading/prefix based `0[..]` string.
 *
 * @param
 * { string | number } dateStr - Target date.
 *
 * @returns
 * a `zero-prefixed` date string.
 */
export function toZeroPrefixDateStr
(
  dateStr: string | number
): string
{
  dateStr = `0${dateStr}`
  return dateStr
    .slice(-2)
    .split(' ')
    .join('')
  ;
}

/**
 * @summary
 * 🔹 HELPER
 *
 * @description
 *
 * 📌 Simple method to generate a `new Date()`
 * using offsets in `hour`, `days`, `months`, years.
 *
 * @param
 * { number } [offsetDays] - Wether to offset date by `(+/-)X` days.
 *
 * @param
 * { number } [offsetMonths] - Wether to offset date by `(+/-)X` months.
 *
 * @returns
 * A target `Date`.
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
 * @summary
 * 🔹 HELPER
 *
 * @description
 *
 * 📌 Calculates number of days in a target month, of a target year values.
 *
 * @param
 * { number } month - Target month `number` i.e. `0 - 11`
 *
 * @param
 * { number } year - Target year `number`
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
 * @description
 * TODO: DOC:
 */
export function daysDiffNum
(
  date1: Date,
  date2: Date
): number
{
  const _timeDiff: number = date2.getTime() - date1.getTime();
  const dateDiff: number = (_timeDiff / (1000 * 3600 * 24));
  return dateDiff < 0 ? -dateDiff : dateDiff;
}