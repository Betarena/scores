/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 PROXY Fetch type GET
 *
 * @param
 * { string } endpoint - Target endpoint / url to fetch data from.
 *
 * @returns
 * An Asynchronous Promise of type `unknown`.
 */
export async function get
(
	endpoint: string,
  _fetch: any = null
): Promise < unknown >
{
	// ### NOTE:
  // ### curcanavigate CORS issues
	// endpoint = 'https://cors-anywhere.herokuapp.com/' + endpoint

  (_fetch ??= fetch)

  try
  {
    const res: Response = await _fetch
    (
      endpoint,
      {
        method: 'GET'
      }
    );

    const resJson: unknown = await res.json();

    if (!res?.ok)
      throw new Error
      (
        'Network response was not ok'
      );
    ;

		return resJson;
  }
  catch (e)
  {
    console.error(e)
    return null;
  }
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 PROXY Fetch type POST
 *
 * @param
 * { string } path - Target endpoint / url to fetch data from.
 *
 * @param
 * { any } data - Target data to pass as `body`.
 *
 * @returns
 * An Asynchronous Promise of type `unknown`.
 */
export async function post
(
	path: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
): Promise < unknown >
{
  try
  {
    const res: Response = await fetch
    (
      path,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        mode: 'cors',
        headers:
        {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    const resJson: unknown = await res.json();

    if (!res?.ok)
      throw new Error
      (
        'Network response was not ok'
      );
    ;

		return resJson;
  }
  catch (e)
  {
    console.error(e)
    return null;
  }
}
