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
 * @description converts a target date to an
 * ISO_string of yyyy-MM-dd format;
 * @param {Date} date
 * @returns {string} string
 */
export function convert_to_iso(
  date: Date
): string {
  return date.toISOString().slice(0, 10)
}