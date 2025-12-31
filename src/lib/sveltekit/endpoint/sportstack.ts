// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Content Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

import { ERROR_CODE_INVALID } from '$lib/utils/debug.js';
import { preloadExitLogic } from '$lib/utils/navigation.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { Betarena_User_Class } from '@betarena/scores-lib/dist/classes/class.betarena-user.js';
import { entryPageAuthorDataAndSeo, entryTargetDataAuthorSportstack } from '@betarena/scores-lib/dist/functions/v8/main.preload.authors.js';
import { ITableAuthorAuthorQuery3Out, ITableAuthorAuthorQuery3Var, ITableAuthorAuthorQuery4Out, ITableAuthorAuthorQuery4Var, TableAuthorAuthorQuery3, TableAuthorAuthorQuery4, TableAuthorAuthorsMutation0, type ITableAuthorAuthorsMutation0Out, type ITableAuthorAuthorsMutation0Var } from "@betarena/scores-lib/dist/graphql/v8/table.authors.authors.js";
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import type { IBetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
import type { IPageAuthorAuthorData, IPageAuthorProfileData, IPageAuthorSportstackData, IPageAuthorTagDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
import { json, type RequestEvent } from '@sveltejs/kit';

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
          sortEditedDate = searchParams.get('sortEditedDate') || undefined,
          limitSearch = searchParams.get('limit') || undefined,
          offsetSearch = searchParams.get('offset') || undefined
          ;

  let limit, offset;

  if (limitSearch) limit = Number(limitSearch);
  if (offsetSearch) offset = Number(offsetSearch);

        // ╭──────────────────────────────────────────────────────────────────╮
        // │ NOTE:                                                            │
        // │ 👇 :|: extract target article data.                              │
        // │ TODO:                                                            │
        // │ Add cache logic.                                                 │
        // ╰──────────────────────────────────────────────────────────────────╯
        if (user)
        {
          const data = await getSportstackByUserId(user, limit, offset);
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
  const dataRes0: IPageAuthorProfileData = await entryTargetDataAuthorSportstack({ permalink, cacheCheck: true, page: Number(page), isUsingAuthorData: true, optsQuery });
  (dataRes0 as any).sportstack = dataRes1?.sportstack;
  dataRes0.mapArticle = (dataRes0?.mapArticle ? dataRes0.mapArticle.map(([id, article]) => [id, {...article, data: { title: article.data?.title || "" }}]) : []) as IPageAuthorTagDataFinal['mapArticle'];
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
    const res = (await BetarenUserClass.obtainPublicInformationTargetUsers({ query: {}, body: { user_uids: [uid] } }))?.success;
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
 * @param { number } limit
 *  💠  limit of authors per request.
 * @param { number } offset
 *  💠  count of skip sportstacks.
 * @returns { Promise < AuthorsAuthorsObject > }
 *  📤 Target `sportstacks` data.
 */
async function getSportstackByUserId
  (
    uid: string,
    limit?: number,
    offset?: number
  )
{
  const type = !limit && !offset ? 'all' : 'pagination';
  const ql = (await new _GraphQL().wrapQuery<ITableAuthorAuthorQuery4Var, ITableAuthorAuthorQuery4Out>(TableAuthorAuthorQuery4(type), {
    uid,
    limit,
    offset
  })) || [];
  if (ql[0]?.authors_authors)
  {
    return { sportstacks: ql[0].authors_authors, count: ql[0].authors_authors_aggregate?.aggregate.count }
  }
  return { sportstacks: [], count: 0 };
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
    const
      {
        locals:
        {
          uid
        },
        request
      } = event
    ;

    if (!uid) return json(null);

    const { authorId, subscribe } = await request.json();
    const type = subscribe ? 'add' : 'delete';

    const data = await new _GraphQL().wrapQuery
      <
        ITableAuthorAuthorsMutation0Var
        , ITableAuthorAuthorsMutation0Out
      >
      (
        TableAuthorAuthorsMutation0(type)
        , {
          authorId,
          userUid: uid
        }
      );
    return json({ success: true, author: data });

  }) as Promise<Response>
}