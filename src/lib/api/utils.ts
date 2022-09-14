import { dev } from "$app/environment";
import { logErrorGroup } from "$lib/utils/debug";

/**
 * EXPORT
 * Function / Method
 *
 * Description:
 * Standard FETCH-API GET Method
 *
 * @param endpoint
 * @returns
 */
 export async function get(endpoint: string): Promise< any > {
    // curcanavigate CORS issues
    // endpoint = 'https://cors-anywhere.herokuapp.com/' + endpoint // comment this out before subemission,
    // ...
    return await fetch(endpoint, {
        method: 'GET'
    }).then((response) => {
        // ... verify if the response is error-free
        if (!response.ok) {
          if (dev) logErrorGroup ("utils [DEV]", `response: ${response}`)
          throw new Error('Network response was not ok');
        }
        // ... return the data
        return response.json();
    });
}

/**
 * Function POST
 * Used as a PROXY on the website
 * to handle requests correctly and
 * in-line with the CORS requirements.
 * 
 * A POST request is used to appropietly
 * pass data from the client-to-the-backend.
 * 
 * @param {*} path 
 * @param {*} data 
 * @returns 
*/
export async function post(path, data): Promise < any > {
    // ...
    return await fetch(path, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        // ... verify if the response is error-free
        if (!response.ok) {
          if (dev) logErrorGroup ("utils [DEV]", `response: ${response}`)
          throw new Error('Network response was not ok');
        }
        // ... return the data
        return response.json()
    })
}
