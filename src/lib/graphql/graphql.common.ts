// #region ➤ 📦 Package Imports

import sessionStore from '$lib/store/session.js';
import { B_C_COMP_M_Q_D_S, B_C_COMP_M_Q_D_ST } from "@betarena/scores-lib/dist/graphql/query.competitions.js";
import { SubscriptionClient } from "graphql-subscriptions-client";

import { TableAuthorTagsSubscription0, type ITableAuthorTagsSubscription0Out } from '@betarena/scores-lib/dist/graphql/v8/table.authors.tags.js';
import { TableTransactionsTransactionQueueSubscription0, type ITableTransactionsTransactionQueueSubscription0Out, type ITableTransactionsTransactionQueueSubscription0Var } from '@betarena/scores-lib/dist/graphql/v8/table.transactions.transaction_queue.js';
import type { B_H_COMP_DATA } from "@betarena/scores-lib/types/_HASURA_.js";
import type { B_H_COMP_HIGH_Q } from "@betarena/scores-lib/types/types.competition.highlights.js";
import type { IPageAuthorTagData } from '@betarena/scores-lib/types/v8/preload.authors.js';
import type { Writable } from 'svelte/store';

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
): Promise<void>
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
  // client.request
  // (
  //   {
  //     query
  //   }
  // );

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

            const competitionMap = new Map<number, B_H_COMP_DATA>();
            let openCompetitions: number = 0;

            // ### NOTE:
            // ### loop over competitions data.
            for (const competition of data?.competitions_data ?? [])
            {

              // ### CHECK
              // ### for open competition.
              if (competition?.data?.status == 'pending')
                openCompetitions++;
              ;

              // ### NOTE:
              // ### generate map.
              // ### TODO:
              // ### can be added to 'sessionStore.competition_map' data prop.
              competitionMap.set
                (
                  competition?.id,
                  competition
                );
            }

            sessionStore.updateData
              (
                [
                  ['competitionAllNum', [(competitionMap?.size ?? 0), openCompetitions]],
                  ['competitionLatestMap', competitionMap]
                ]
              );
          }
        },
      }
    );

  sessionStore?.updateData
    (
      [
        ['graphqlListeners', subscription?.unsubscribe]
      ]
    );
}

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
export async function subscribeCompetitionsTargetListen
  (
    competitionId: number
  ): Promise<void>
{
  // get ready
  const GRAPHQL_ENDPOINT = import.meta.env?.VITE_HASURA_DB_WSS ?? '';

  const query: string = B_C_COMP_M_Q_D_ST;

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
  // client.request
  // (
  //   {
  //     query
  //   }
  // );

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
        query,
        variables:
        {
          competitionId
        }
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
            console.log("We got something! 🟥", data);

            const competitionMap = new Map<number, B_H_COMP_DATA>();

            // ### NOTE:
            // ### loop over competitions data.
            for (const competition of data?.competitions_data ?? [])
            {

              // ### NOTE:
              // ### generate map.
              // ### TODO:
              // ### can be added to 'sessionStore.competition_map' data prop.
              competitionMap.set
                (
                  competition?.id,
                  competition
                );
            }

            sessionStore.updateData
              (
                [
                  ['competitionLatestMap', competitionMap]
                ]
              );

          }
        },
      }
    );

  sessionStore?.updateData
    (
      [
        ['graphqlListeners', subscription?.unsubscribe]
      ]
    );

  return;
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Listens/Subsribes to changes in tag followers.
 *
 * @param tagId: number
 * 💠 **[required]** `tag` ID to subscribe.
 * @param tagStore: Writable<IPageAuthorTagData>
 * 💠 **[required]** `tag` store to update.
 * @returns
 * `void`
 */
export  function subscribeTagFollowersListen
  (
    tagId: number,
    tagStore: Writable<IPageAuthorTagData>
  ): {unsubscribe: () => void}
{
  // get ready
  const GRAPHQL_ENDPOINT = import.meta.env?.VITE_HASURA_DB_WSS ?? '';

  const query: string = TableAuthorTagsSubscription0;

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
  // client.request
  // (
  //   {
  //     query
  //   }
  // );

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
        query,
        variables: {tagId}
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
            }: { data: ITableAuthorTagsSubscription0Out; }
          ): void
        {
          if (data)
          {
            console.log("We got something!", data);

            // ### NOTE:
            // ### update tag store.
            tagStore.update
              (
                (tagStoreData) =>
                {
                  return {...tagStoreData, followers: data.authors_tags_by_pk?.followers};
                }
              );
          }
        },
      }
    );


  sessionStore?.updateData
    (
      [
        ['graphqlListeners', subscription?.unsubscribe]
      ]
  );
  return subscription;
}

/**
 * @summary
 * 🔹 HELPER | IMPORTANT
 *
 * @description
 * 📌 Listens/Subsribes to changes in transaction history by revolut ID.
 *
 * @param revolutId: string
 * 💠 **[required]** `revolut` ID to subscribe.
 * @param depositStore: Writable<IPageTransactionData>
 * 💠 **[required]** `depositStore` store to update.
 * @returns
 * `void`
 */
export  function subscribeRevolutTransactionListen
  (
    revolutId: string,
    depositStore: Writable<{
      amount: number | string,
      rate: number | null,
      failed?: boolean,
      status?: string,
    }>
  ): {unsubscribe: () => void}
{
  // get ready
  const GRAPHQL_ENDPOINT = import.meta.env?.VITE_HASURA_DB_WSS ?? '';

  const query: string = TableTransactionsTransactionQueueSubscription0;
  const variables: ITableTransactionsTransactionQueueSubscription0Var = {refId: revolutId};

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
  // client.request
  // (
  //   {
  //     query
  //   }
  // );

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
        query,
        variables
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
            }: { data: ITableTransactionsTransactionQueueSubscription0Out; }
          ): void
        {
          if (data)
          {
            console.log("We got something!", data);

            // ### NOTE:
            // ### update tag store.
            depositStore.update
              (
                (depositStoreData) =>
                {
                  const queue = data?.transactions_transaction_queue;
                  const queue_data = queue?.[0].data;
                  const status = queue_data?.payments?.length ? queue_data.payments.at(-1).state : queue_data?.state
                  return {...depositStoreData, status};
                }
              );
          }
        },
      }
    );


  sessionStore?.updateData
    (
      [
        ['graphqlListeners', subscription?.unsubscribe]
      ]
  );
  return subscription;
}

// #endregion ➤ 🛠️ METHODS