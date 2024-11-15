// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Content Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { entryPageAuthorDataAndSeo, entryTargetDataAuthorSportstack } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js'
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import { ITableAuthorAuthorQuery3Out, ITableAuthorAuthorQuery3Var, TableAuthorAuthorQuery3, TableAuthorAuthorsMutation0, type ITableAuthorAuthorsMutation0Out, type ITableAuthorAuthorsMutation0Var } from "@betarena/scores-lib/dist/graphql/v8/table.authors.authors.js";
import type { IPageAuthorAuthorData, IPageAuthorProfileData, IPageAuthorSportstackData } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import type { IBetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
import { ITableAuthorAuthorQuery2Out, ITableAuthorAuthorQuery2Var, TableAuthorAuthorQuery2 } from '@betarena/scores-lib/dist/graphql/v8/table.authors.authors.js';
import { preloadExitLogic } from '$lib/utils/navigation.js';
import { ERROR_CODE_INVALID } from '$lib/utils/debug.js';

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ MAIN METHODS                                                  │
// ╰──────────────────────────────────────────────────────────────────╯

export async function main
  (
    request: RequestEvent
  )
{

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract url query data.                                   │
        // ╰──────────────────────────────────────────────────────────────────╯

        const searchParams = request.url.searchParams;
        const
          page = searchParams.get('page') || 0,
          permalink = searchParams.get('permalink') || "",
          id = searchParams.get('id') || "",
          user = searchParams.get('user'),
          status = searchParams.get('status') || undefined,
          sortTitle = searchParams.get('sortTitle') || undefined,
          sortPublishDate = searchParams.get('sortPublishDate') || undefined,
          sortEditedDate = searchParams.get('sortEditedDate') || undefined
          ;

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article data.                              │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯
        if (user)
        {
          const data = await getSportstackByUserId(user);
          return json(data)
        }

        if (id)
        {
          const data = await fallbackDataGenerate1(id);
          return json(data || null);
        }
        let options;

        if (sortTitle || sortPublishDate || sortEditedDate || status) options = {};
        if (sortTitle) options.sortTitle = sortTitle as 'desc' | 'asc';
        if (sortPublishDate) options.sortPublishDate = sortPublishDate as 'desc' | 'asc';
        if (sortEditedDate) options.sortEditedDate = sortEditedDate as 'desc' | 'asc';
        if (status) options.filterStatus = status as 'published' | 'unpublished' | 'draft' | 'all';

        const data: IPageAuthorProfileData | undefined = await fallbackDataGenerate0
          (
            page,
            permalink,
            options
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
    optsQuery?: {
      sortTitle?: 'desc' | 'asc';
      sortPublishDate?: 'desc' | 'asc';
      sortEditedDate?: 'desc' | 'asc';
      filterStatus?: 'published' | 'unpublished' | 'draft' | 'all';
    }
): Promise<IPageAuthorSportstackData | undefined>
{

  const dataRes1 = await getSportstackByPermalink(permalink);
  const dataRes0: IPageAuthorProfileData = await entryTargetDataAuthorSportstack({ permalink, page: Number(page), isUsingAuthorData: true, optsQuery });
    (dataRes0 as any).sportstack = dataRes1?.sportstack;
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
 * @param { string } id
 *  💠 Target `sportstacks` by user id
 * @param { number } page
 *  💠  page number.
 * @returns { Promise < AuthorsAuthorsObject > }
 *  📤 Target `sportstacks` data.
 */
async function getSportstackByUserId
  (
    uid: string,
  )
{
  const ql = (await new _GraphQL().wrapQuery<ITableAuthorAuthorQuery2Var, ITableAuthorAuthorQuery2Out>(TableAuthorAuthorQuery2, {
    uid
  })) || [];
  if (ql[0]?.authors_authors)
  {
    return { sportstacks: ql[0].authors_authors }
  }
  return { sportstacks: [] };
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Fallback data generation.
 * @param { string } id
 *  💠 Target `sportstacks` by permalink
 * @param { number } page
 *  💠  page number.
 * @returns { Promise < AuthorsAuthorsObject > }
 *  📤 Target `sportstacks` data.
 */
export async function getSportstackByPermalink
  (
    permalink: string,
  )
{
  const ql = (await new _GraphQL().wrapQuery<ITableAuthorAuthorQuery3Var, ITableAuthorAuthorQuery3Out>(TableAuthorAuthorQuery3, {
    permalink
  })) || [];
  const sportstack = ql[0]?.authors_authors?.[0];
  if (!sportstack) return preloadExitLogic(0, 'sportstack-permalink', ERROR_CODE_INVALID);
  return { sportstacks: sportstack }
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