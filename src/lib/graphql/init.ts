/**
 * INSTANTIATE GRAPH-QL REQUEST-CLIENT
 * ~~~~~~~~~~~~~~~~~
 * & methods;
 * - adapted to GitHub Actions SECRETS
 * - adpated to Heroku ENV-VARIABLES
 */
import { GraphQLClient } from 'graphql-request';

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * Create the GRAPH-QL Client;
 * @returns
 */
export function initGrapQLClient(): GraphQLClient {
	const endpoint = import.meta.env?.VITE_HASURA_DB_URL as string;
	const graphQLClient = new GraphQLClient(
		endpoint,
		{
			headers: {
				'x-hasura-admin-secret': `${import.meta.env?.VITE_HASURA_DB_TOKEN as string}`
			}
		}
	);
	return graphQLClient;
}
