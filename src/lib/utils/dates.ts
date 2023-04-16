export const MONTH_NAMES_ABBRV = [
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

export const WEEK_DAYS_ABBRV = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

export const WEEK_DAYS_ABBRV_1 = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat'
];

export const WEEK_DAYS_ABBRV_2 = [
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat',
  'Sun'
];

export const monthNames = [
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

/**
 * @summary converts a target date to an
 * ISO_string of yyyy-MM-dd format;
 * @description handles target date to ISO conversion,
 * plus identifies dates of "T00:00:00" Dates;
 * @param {Date | string} date
 * @returns {string} string
 */
export function toCorrectISO(
  date: Date | string
): string {
  // check for 'string'
  if (typeof(date) == 'string') {
    // check for 'T00:00:00'
    const validation_0 =
      date.includes('T00:00:00') 
      && !date.includes('T00:00:00Z')
    ;
    // add, if necessary
    if (validation_0) {
      date = `${date}Z`
    }
    date = new Date(date)
  }
  // return yyyy-MM-dd
  return date.toISOString().slice(0, 10)
}

/**
 * @summary [HELPER] method
 * @description converts a target date/string
 * argument to a proper, handeled user Date Object;
 * @param {Date | string} date
 * @returns {Date} string
 */
export function toCorrectDate(
  date: Date | string
): Date {
  if (typeof(date) == 'string') {
    // check for 'T00:00:00'
    const validation_0 =
      date.includes('T00:00:00') 
      && !date.includes('T00:00:00Z')
    ;
    // add, if necessary
    if (validation_0) {
      date = `${date}Z`
    }
    date = new Date(date)
  }
  // return Date Object
  return date;
}

/**
 * @summary [HELPER] method
 * @description converts a target string
 * arugment to a leading/prefix based "0[...]" string
 * @param {string} dateStr
 * @returns {string} string
 */
export function toZeroPrefixDateStr(
  dateStr: string | number
): string {
  dateStr = `0${dateStr}`
  return dateStr
    .slice(-2)
    .split(' ')
    .join('')
  ;
}