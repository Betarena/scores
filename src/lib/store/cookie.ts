/**
 * 
 * @param {string} cName 
 * @param {string} cValue 
 * @param {number} expDays 
 */
export function setCookie
(
  cName: string, 
  cValue: string, 
  expDays: number
) 
{
  const currentDate = new Date();
  currentDate.setTime
  (
    currentDate.getTime() + (expDays * 24 * 60 * 60 * 1000)
  );
  const expires = `expires=${currentDate.toUTCString()}`;
  document.cookie = `${cName}=${cValue}; ${expires}; path=/`;
}