// ===========================
// NOTE: This is a TEMPLATE
// ===========================
// Use this file to guide yourself
// into better structuring and
// developing new methods and
// +server.ts endpoints with SvelteKit
// for retrival and processing
// of target data;
// ===========================

//#region ➤ Package Imports

import { initGrapQLClient } from '$lib/graphql/init';

//#endregion ➤ Package Imports

//#region ➤ [VARIABLES] Imports

const graphQlInstance = initGrapQLClient()
// [ℹ] debug info
const logs = [];

//#endregion ➤ [VARIABLES] Imports

//#region ➤ [METHODS]

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(
  req
): Promise<void> {
  // const X: string = req.url['searchParams'].get('X');
	// const target_season_fixtures = await main(LEAGUE_ID, SEASON_ID);
	// return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

//#endregion ➤ [METHODS]