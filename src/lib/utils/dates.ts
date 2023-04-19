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
  const date = new Date();
  // const timeOffsetInHours = -(new Date()).getTimezoneOffset()/60
  // date.setHours(date.getHours() + timeOffsetInHours)
  console.log('Client Date', date)
  // alternative (option);
  // date.setTime( date.getTime() - new Date().getTimezoneOffset()*60*1000 );
  return date
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
export function toISOMod
(
  date: Date | string,
  adjustClientTZ = false,
  showConversion = false
): string {

  if (showConversion) console.log("CONVERSION [FROM]: ", date)

  // check for 'string'
  if (typeof(date) == 'string') {
    // check for 'T00:00:00'
    const validation_0 =
      date.includes('T') 
      && !date.includes('Z')
    ;
    // add, if necessary
    if (validation_0) {
      date = `${date}Z`
    }
    if (showConversion) console.log("CONVERSION [STR]: ", date)
    date = new Date(date)
  }

  if (showConversion) console.log("CONVERSION [TO]: ", date)

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
  // NOTE:WARNING: issues with date adjustedf for user timezone;
  // NOTE:WARNING: when converting a T00:00:00Z string to BRAZIL new Date()
  if (adjustClientTZ)
  {
    const year = date.getFullYear();
    const month = toZeroPrefixDateStr(date.getMonth() + 1);
    const day = toZeroPrefixDateStr(date.getDate());
    formattedDate = `${year}-${month}-${day}`;
  }

  if (showConversion) console.log("CONVERSION [ISO]: ", formattedDate)

  // IMPORTANT yyyy-MM-dd
  return formattedDate;
}

/**
 * @summary [HELPER] method
 * @description converts a target Date/string
 * arg. to a proper, handeled user Date Object;
 * adjusting for missing "Z" string, if necessary;
 * and offsetting for user's current timezone,
 * generating a UTC Date object;
 * @example "2023-12-12", locale: ja-JP => 2023-12-12
 * @param {Date | string} date
 * @returns {Date} string
 */
export function toCorrectDate
(
  date: Date | string,
  offset = true,
  showConversion = false
): Date 
{
  if (showConversion) console.log("CONVERSION toCorrectDate [FROM]: ", date)

  if (typeof(date) == 'string') {
    // check for 'T00:00:00'
    const validation_0 =
      date.includes('T') 
      && !date.includes('Z')
    ;
    // add, if necessary
    if (validation_0) {
      date = `${date}Z`
    }
    date = new Date(date)
  }

  // ignore user's local/machine Timezone;
  // creating essentially a UTC Date object;
  if (offset) 
  {
    const timeOffsetInHours = -(new Date()).getTimezoneOffset()/60
    date.setHours(date.getHours() - timeOffsetInHours)
  }

  if (showConversion) console.log("CONVERSION toCorrectDate [TO]: ", date)

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