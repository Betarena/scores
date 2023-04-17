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
 * @summary [HELPER] method
 * @description instantiates a target date
 * for the current client, applying correct
 * target user timezone;
 * @returns Date
 */
export function clientTimezoneDate() {
  const d = new Date();
  // const timeOffsetInHours = -(new Date()).getTimezoneOffset()/60
  // d.setHours(d.getHours() + timeOffsetInHours)
  console.log('Client Date', d)
  // alternative (option);
  // d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
  return d
}

/**
 * @summary [HELPER] method
 * @description converts a target date to an
 * ISO_string of yyyy-MM-dd format;
 * handles target date to ISO conversion,
 * plus identifies dates of "T00:00:00" 
 * Dates and Adds Z;
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
  // 18/04/2023, 00:34:15
  // Get year, month, and day part from the date
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });
  // Generate yyyy-mm-dd date string
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

/**
 * @summary [HELPER] method
 * @description converts a target Date/string
 * arg. to a proper, handeled user Date Object;
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
 * @description converts a target date string/number
 * arg. to a leading/prefix based "0[...]" string
 * @param {string | number} dateStr
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