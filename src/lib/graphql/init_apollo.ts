/**
 * INSTANTIATE APOLLO CLIENT
 * ------------------
 * & methods; 
*/
import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { setClient } from 'svelte-apollo'

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * Create the Appolo Client;
 * 
 * @param authToken 
 * @returns 
*/
function createApolloClient(authToken: string): ApolloClient < NormalizedCacheObject > {
    // console.log('initialzied-auth-token-4-de-app!')
    const client = new ApolloClient({
        uri: import.meta.env.VITE_HASURA_DB_URL.toString(),
        headers: {
            'x-hasura-admin-secret': `${authToken}`,
        },
        cache: new InMemoryCache()
    });
    return client;
}

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~ 
 * Initialize the Apollo Client;
 * Using (createApolloClient)
*/
export function init_ApolloClient(): void {
    const authToken = import.meta.env.VITE_HASURA_DB_TOKEN.toString()
    const client = createApolloClient(authToken)
    setClient(client)
}