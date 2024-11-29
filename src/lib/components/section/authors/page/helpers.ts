import type { IPageAuthorArticleData, IPageAuthorTagData, IPageAuthorAuthorData, IPageAuthorTranslationDataFinal, IPageAuthorTagDataFinal } from "@betarena/scores-lib/types/v8/preload.authors.js";
import { get } from "$lib/api/utils.js";

export interface IArticle extends IPageAuthorArticleData
{
  author: IPageAuthorAuthorData;
  tags_data: IPageAuthorTagData[];
}

export function prepareArticles(
  articles: [number, IPageAuthorArticleData][],
  tags_map: Map<number, IPageAuthorTagData>,
  authors: Map<number, IPageAuthorAuthorData>
): IArticle[]
{
  if (!tags_map || !authors || !articles.length) return [];
  const prepared = articles.map(([id, data]) =>
  {
    const preparedArticle: IArticle = {
      author: {} as any,
      tags_data: [],
      ...data,
    } as IArticle;
    if (data.author_id)
    {
      const author = authors.get(data.author_id) as IPageAuthorAuthorData;
      if (author) preparedArticle.author = author;
    }
    if (data.tags?.length)
    {
      const prepared_tags: IPageAuthorTagData[] = [];
      data.tags.forEach((id) =>
      {
        const tag = tags_map.get(id);
        if (tag) prepared_tags.push(tag);
      });
      preparedArticle.tags_data = prepared_tags;
    }
    return preparedArticle;
  });
  return prepared;
}
export interface ITagsWidgetData extends IPageAuthorTagDataFinal
{
  translations: IPageAuthorTranslationDataFinal;
}
export async function fetchArticles({ permalink, lang, page, prevData, url }: { permalink?: string; lang?: string | null; page?: number; prevData?: ITagsWidgetData, url?: string })
{
  const res = (await get(
    url ||
    `/api/data/author/tags?permalinkTag=${permalink}&page=${page}${lang ? `&lang=${lang}` : ""
    }`
  )) as ITagsWidgetData;
  if (!res) return {next: (prevData || {}) as ITagsWidgetData ,  articles: []};
  const prevMap = new Map(prevData?.mapArticle);
  const newArticles = res.mapArticle.filter(([id]) => !prevMap.has(id));
  const next =
  {
    ...res,
    ...prevData,
    mapArticle: [...(prevData?.mapArticle || []), ...newArticles],
    mapAuthor: [...(prevData?.mapAuthor || []), ...res.mapAuthor],
    mapTag: [...(prevData?.mapTag || []), ...res.mapTag],
  } as ITagsWidgetData;
  const articles = prepareArticles(newArticles, new Map(res.mapTag), new Map(res.mapAuthor));
  return { ...res, next, articles };
}

/**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Calcualte target `text` _reading time_, based on `character` amount.
   * @param { string } text
   *  💠 **[required]** Target `direction` to _scroll_.
   * @return { void }
   */
export function readingTime
(
  text: string | null | undefined
): number
{
  if (text == null) return 0;

  const
    /**
     * @description
     *  📣 Hardcoded value for `words per minute`.
     */
    wpm = 225,
    /**
     * @description
     *  📣 Calulate number of `words` in target `text`.
    */
    words = text.trim().split(/\s+/).length,
    /**
     * @description
     *  📣 Calcualted value for `reading time`.
    */
    time = Math.ceil(words / wpm)
  ;

  return time;
}


/**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Prepare article data.
   * @param { Map < number, IPageAuthorArticleData > | null } mapArticle
   *  💠 **REQUIRED** `Map` of article data.
   * @param { Map < number, IPageAuthorTagData > | null } mapTag
   *  💠 **REQUIRED** `Map` of tag data.
   * @param { Map < number, IPageAuthorAuthorData > | null } mapAuthor
   *  💠 **REQUIRED** `Map` of author data.
   * @return { Map < number, IArticle > }
   *  📤 Prepared articles data.
   */
export function prepareArticlesMap(
  mapArticle: Map<number, IPageAuthorArticleData> | null,
  mapTag: Map<number, IPageAuthorTagData> | null,
  mapAuthor: Map<number, IPageAuthorAuthorData> | null
): Map<number, IArticle>
{
  if (!mapTag || !mapAuthor || !mapArticle) return new Map();

  const /**
     * @description
     * 📝 `Map` of modified article data.
     */
    mapArticleMod = new Map<number, IArticle>();
  // ╭─────
  // │ NOTE: |:| loop through articles and prepare data.
  // ╰─────
  for (const [articleId, articleData] of mapArticle)
  {
    const /**
       * @description
       * 📝 Prepare article data.
       */
      dataArticle: IArticle = {
        author: mapAuthor.get(articleData.author_id ?? 0) ?? {},
        tags_data: [],
        ...articleData,
      };
    // ╭─────
    // │ NOTE: |:| loop through 'tags' and add final data to `tags_data`.
    // ╰─────
    for (const tagId of articleData.tags ?? [])
    {
      const tag = mapTag.get(tagId);
      if (tag) dataArticle.tags_data.push(tag);
    }

    mapArticleMod.set(articleId, dataArticle);
  }

  return mapArticleMod;
}