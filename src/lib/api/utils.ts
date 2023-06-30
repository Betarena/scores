/**
 * @summary
 * ◆ HELPER
 * @description
 * ➨ PROXY Fetch type GET
 * @param
 * {string} endpoint
 * @returns
 * an unknown Promise
 */
export async function get
(
	endpoint: string
): Promise < unknown >
{
	// curcanavigate CORS issues
	// endpoint = 'https://cors-anywhere.herokuapp.com/' + endpoint // comment this out before subemission,
  try
  {
    const res: Response = await fetch
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
 * ◆ HELPER
 * @description
 * ➨ PROXY Fetch type POST
 * @param
 * {*} path
 * @param
 * {*} data
 * @returns
 * an unknown Promise
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
