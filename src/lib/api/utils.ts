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
export async function get(endpoint:string): Promise < any > {
    // curcanavigate CORS issues
    // endpoint = 'https://cors-anywhere.herokuapp.com/' + endpoint // comment this out before subemission,

	return fetch(endpoint, {
		method: 'GET'
	}).then(response => {
        // ... verify if the response is error-free
        if (!response.ok) {
            console.log('response-data', response)
            throw new Error('Network response was not ok');
        } 
        // ... return the data
        return response.json();
    })
}