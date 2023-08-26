// #region ➤ 📦 Package Imports

import sessionStore from '$lib/store/session.js';
import { B_C_COMP_M_Q_D_S } from "@betarena/scores-lib/dist/graphql/query.competitions.js";
import { SubscriptionClient } from "graphql-subscriptions-client";

import type { B_H_COMP_DATA } from "@betarena/scores-lib/types/_HASURA_.js";
import type { B_H_COMP_HIGH_Q } from "@betarena/scores-lib/types/types.competition.highlights.js";

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Listens/Subsribes to changes in competitions data.
 *
 * @returns
 * `void`
 */
export async function subscribeCompetitionsAllListen
(
): Promise < void >
{
  // get ready
  const GRAPHQL_ENDPOINT = import.meta.env?.VITE_HASURA_DB_WSS ?? '';

  const query: string = B_C_COMP_M_Q_D_S;

  // ### NOTE:
  // ### set up the client, which can be reused
  const client = new SubscriptionClient
  (
    GRAPHQL_ENDPOINT,
    {
      reconnect: true,
      // ### NOTE:
      // ### per-authors-documentation:
      // ### only connect when there is a query
      lazy: true,
      connectionParams:
      {
        // ### IMPORTANT
        headers:
        {
          'x-hasura-admin-secret': import.meta.env?.VITE_HASURA_DB_TOKEN ?? ''
        },
      },
      connectionCallback:
      (
        error
      ): void =>
      {
        error && console.error(error);
      },
    }
  );

  // ### NOTE:
  // ### per-authors-documentation:
  // ### make the actual request.
  client.request
  (
    {
      query
    }
  );

  // ### NOTE:
  // ### per-authors-documentation:
  // ### the above doesn't do much though.

  // ### NOTE:
  // ### per-authors-documentation:
  // ### call subscription.unsubscribe() later to clean up
  const subscription = client
  .request
  (
    {
      query
    }
  )
  // ### NOTE:
  // ### so lets actually do something with the response
  .subscribe
  (
    {
      next
      (
        {
          data
        }: { data: B_H_COMP_HIGH_Q; }
      ): void
      {
        if (data)
        {
          console.log("We got something!", data);

          // ### NOTE:
          // ### loop over competitions data.
          const competitionMap = new Map < number, B_H_COMP_DATA >();
          for (const competition of data?.competitions_data ?? [])
          {
            competitionMap.set
            (
              competition?.id,
              competition
            );
          }

          sessionStore.updateCompetitionsLatestMap
          (
            competitionMap
          );

        }
      },
    }
  );
}

// #endregion ➤ 🛠️ METHODS