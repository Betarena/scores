import { Editor } from "@tiptap/core";
import DOMPurify from "dompurify";
import { postv2 } from "$lib/api/utils.js";
import { modalStore } from "$lib/store/modal.js";
import { infoMessages } from "$lib/components/ui/infomessages/infomessages.js";
import { create_article_store } from "./create_article.store.js";
import type { IArticle } from "$lib/components/section/authors/page/helpers.js";
import { goto } from "$app/navigation";
import session from "$lib/store/session.js";
import type { AuthorsAuthorsMain, TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
import { type Writable, writable } from "svelte/store";
import type { IPageAuthorArticleData, IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
import { detectLanguage } from "$lib/utils/translation.js";
import { promiseValidUrlCheck } from "$lib/utils/navigation.js";
export function getAllImages(editor: Editor)
{
  const json = editor.getJSON();
  const images: string[] = [];
  const findImages = (node) =>
  {
    if (node.type === 'image')
    {
      images.push(node.attrs.src);
    }
    if (node.content)
    {
      node.content.forEach(findImages);
    }
  };
  json.content?.forEach(findImages);
  return images;
}


export async function upsert({ editor, title, author, reload = false, showLoaders = true, id, translations }: {
  translations: TranslationSportstacksSectionDataJSONSchema
  | undefined, editor: Editor, title: string, author: AuthorsAuthorsMain, reload?: boolean, showLoaders?: boolean, id?: number
})
{
  const sanitizedValue = DOMPurify.sanitize(editor.getHTML());
  const sanitizedTitle = DOMPurify.sanitize(title);
  const images = getAllImages(editor);

  const { seo, tags, detectedLang } = create_article_store.get();
  const text_content = editor.getHTML();
  const detectedLangFromText = detectLanguage(text_content);
  let locale = detectedLang;
  const isNewPt = detectedLangFromText.lang === "br";
  const isPreviousPt = ["pt", "br"].includes(detectedLang?.lang || "");
  if ((detectedLangFromText.lang !== detectedLang?.lang && isNewPt !== isPreviousPt) || !detectedLang)
  {
    create_article_store.update(state => ({ ...state, detectedLang: detectedLangFromText }));
    locale = detectedLangFromText;
  }

  const loadingId = showLoaders && infoMessages.add({ type: "loading", text: translations?.saving || "Saving article..." });
  const res = await postv2("/api/data/author/article", {
    content: sanitizedValue,
    title: sanitizedTitle,
    id,
    author_id: author.id,
    tags,
    seo,
    images,
    uid: author.uid,
    locale,
  }) as any;
  if (showLoaders && loadingId)
  {
    infoMessages.remove(loadingId);
  }

  if (!showLoaders) return res;
  if (res.success)
  {
    infoMessages.add({ type: "success", text: translations?.article_saved || "Article saved!" });
    if (reload)
    {

      setTimeout(() =>
      {
        goto(`/u/author/publication/${author.permalink}/${session.extract('lang')}?view=articles`, { invalidateAll: true });
      })
    }
  } else
  {
    infoMessages.add({ type: "error", text: translations?.failed_save || "Failed to save article" });
  }
  return res;
}

export async function deleteArticle(article: IArticle | IPageAuthorArticleData, translations: TranslationSportstacksSectionDataJSONSchema | undefined)
{
  modalStore.update(state => ({ ...state, show: false }));
  const loadingId = infoMessages.add({ type: "loading", text: translations?.deleting || "Deleting article..." });

  const res = await fetch(`/api/data/author/article`, {
    method: "DELETE",
    body: JSON.stringify({ id: article.id, uid: article.author.uid })
  });
  infoMessages.remove(loadingId);
  const data = await res.json();
  if (data.success)
  {
    infoMessages.add({ type: "success", text: translations?.article_deleted || "Article deleted!" });
  } else
  {
    infoMessages.add({ type: "error", text: translations?.failed_delete || "Failed to delete article" });
  }
  return data
}

export async function publish({ id, status, sportstack, redirect = true, translations }: { translations: TranslationSportstacksSectionDataJSONSchema | undefined, id?: number, status: "publish" | "unpublish", sportstack: IPageAuthorAuthorData, redirect?: boolean })
{
  modalStore.update(state => ({ ...state, show: false }));
  const loadingId = infoMessages.add({ type: "loading", text: translations?.saving || `${status} article...`, autoHide: false });
  const res = await fetch(`/api/data/author/article`, {
    method: "PUT",
    body: JSON.stringify({ id, status, uid: sportstack.uid })
  });
  const data = await res.json();
  if (data.success)
  {
    await checkArticle(data.permalink);
    infoMessages.remove(loadingId);
    infoMessages.add({ type: "success", text: status === "publish" ? translations?.article_published || "Article published!" : translations?.article_unpublished || "Article unpublished!" });
    if (redirect)
    {

      setTimeout(() =>
      {
        goto(`/u/author/publication/${sportstack.permalink}/${session.extract('lang')}?view=articles`);
      }, 500);
    }

  } else
  {
    infoMessages.remove(loadingId);
    infoMessages.add({ type: "error", text: translations?.failed_save || `Failed to ${status} article` });
  }
  return data
}

function delay(ms: number)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkArticle(permalink: string)
{
  const check = await promiseValidUrlCheck(fetch, { authorArticleUrl: permalink });
  if (check.isValid)
  {
    return true
  }

  await delay(1000 * 2);
  return checkArticle(permalink);
}


export interface IArticleFilter
{
  status: 'published' | 'unpublished' | 'draft' | 'all',
  sortBy: "sortTitle" | "sortPublishDate" | "sortEditedDate"
}
export const articleFilterStore: Writable<IArticleFilter> = writable({ status: "all", sortBy: "sortPublishDate" });