// #region ➤ 📦 Package Imports

import sessionStore from '$lib/store/session.js';
import { SubscriptionClient } from "graphql-subscriptions-client";

import { TableAuthorTagsSubscription0, type ITableAuthorTagsSubscription0Out } from '@betarena/scores-lib/dist/graphql/v8/table.authors.tags.js';
import type { Writable } from 'svelte/store';
import type { IPageAuthorTagData } from '@betarena/scores-lib/types/v8/preload.authors.js';

// #endregion ➤ 📦 Package Imports

// #region ➤ 🛠️ METHODS

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

// #endregion ➤ 🛠️ METHODS