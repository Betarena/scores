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
      author: {},
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
  return { next, articles }
}