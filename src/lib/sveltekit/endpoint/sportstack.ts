// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Content Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { entryPageAuthorDataAndSeo, entryTargetDataAuthorSportstack } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js'
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import { TableAuthorAuthorsMutation0, type ITableAuthorAuthorsMutation0Out, type ITableAuthorAuthorsMutation0Var } from "@betarena/scores-lib/dist/graphql/v8/table.authors.authors.js";
import type { IPageAuthorAuthorData, IPageAuthorProfileData, IPageAuthorSportstackData } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import type { IBetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯

export async function main
  (
    request: RequestEvent
  )
{
  return await tryCatchAsync
    (
      async (
      ): Promise<Response> =>
      {
        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract url query data.                                   │
        // ╰──────────────────────────────────────────────────────────────────╯

        const
          page = request.url.searchParams.get('page') || 1,
          permalink = request.url.searchParams.get('permalink') || "",
          id = request.url.searchParams.get('id') || ""
          ;

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article data.                              │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯
        if (id)
        {
          const data = await fallbackDataGenerate1(id);
          return json(data || null);
        }

        const data: IPageAuthorProfileData | undefined = await fallbackDataGenerate0
          (
            page,
            permalink
        )
          ;
        // ▓ [🐞]
        if (data?.seoTamplate)
        {
          // data.seoTamplate = { ...covertSEOTemplate(data, request.url.origin) };
        }
        if (data != undefined) return json(data);


        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article translation.                       │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯


        return json
          (
            null
          );
      },
      (
        ex: unknown
      ): Response =>
      {
        // ▓ [🐞]
        console.error(`💀 Unhandled :: ${ex}`);

        return json
          (
            null
            , {
              status: 400,
              statusText: 'Uh-oh! There has been an error'
            }
          );
      }
    );
}

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN HELPER METHODS                                           │
// ╰──────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fallback data generation.
 * @param { string } permalink
 *  💠 Target `sportstack` link (permalink).
 * @param { number } page
 *  💠  page number.
 * @returns { Promise < IArticleData > }
 *  📤 Target `article` data.
 */
async function fallbackDataGenerate0
  (
    page: string | number,
    permalink: string,
  ): Promise<IPageAuthorSportstackData | undefined>
{
  const dataRes0: IPageAuthorProfileData = await entryTargetDataAuthorSportstack({ permalink, page: Number(page) });
  return dataRes0
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fallback data generation.
 * @param { string } id
 *  💠 Target `sportstack` by id
 * @param { number } page
 *  💠  page number.
 * @returns { Promise < IArticleData > }
 *  📤 Target `article` data.
 */
async function fallbackDataGenerate1
  (
    id: number | string,
  ): Promise<IPageAuthorAuthorData & { owner: IBetarenaUser } | undefined>
{
  const dataRes1 = await entryPageAuthorDataAndSeo({ ids: [Number(id)], cacheAll: true })
  if (dataRes1.length)
  {
    const data = dataRes1[0].get(Number(id)) || {} as IPageAuthorAuthorData;
    const { uid = "" } = data;
    const BetarenUserClass = new Betarena_User_Class();
    const res = (await BetarenUserClass.obtainPublicInformationTargetUsers({ query: {}, body: { user_uids: [uid] } })).success;
    if (!res?.data) return { ...data, owner: {} as IBetarenaUser };
    return { ...data, owner: res.data[0] };
  }
  return
}




/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fallback data generation.
 * @param { string } permalink
 *  💠 Target `article` link (permalink).
 * @returns { Promise < {success: boolean, author: ITableAuthorAuthorsMutation0Out }> }
 *  📤 Target `author` data.
 */

export async function updateSubscribers(
  event: RequestEvent
)
{
  return await tryCatchAsync(async () =>
  {
    const { locals: { user: userstring, betarenaUser }, request } = event;
    const user = await JSON.parse(userstring)
    if (!betarenaUser || betarenaUser === "false") return json(null);
    const { authorId, subscribe } = await request.json();
    const type = subscribe ? 'add' : 'delete';
    const userUid = user['user-uid'];
    const data = await new _GraphQL().wrapQuery
      <
        ITableAuthorAuthorsMutation0Var
        , ITableAuthorAuthorsMutation0Out
      >
      (
        TableAuthorAuthorsMutation0(type)
        , {
          authorId,
          userUid
        }
      );
    return json({ success: true, author: data });

  }) as Promise<Response>
}