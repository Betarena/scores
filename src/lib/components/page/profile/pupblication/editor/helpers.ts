import { Editor } from "@tiptap/core";
import DOMPurify from "dompurify";
import { postv2 } from "$lib/api/utils.js";
import { modalStore } from "$lib/store/modal.js";
import { infoMessages } from "$lib/components/ui/infomessages/infomessages.js";
import { create_article_store } from "./create_article.store.js";
import type { IArticle } from "$lib/components/section/authors/page/helpers.js";
import { goto } from "$app/navigation";
import session from "$lib/store/session.js";
import type { AuthorsAuthorsMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
import { type Writable, writable } from "svelte/store";
import type { IPageAuthorArticleData, IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
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


export async function upsert({ editor, title, author, reload = false, showLoaders = true, id, is_draft = false }: { is_draft?: boolean, editor: Editor, title: string, author: AuthorsAuthorsMain, reload?: boolean, showLoaders?: boolean, id?: number })
{
  const v = DOMPurify.sanitize(editor.getHTML());
  const t = DOMPurify.sanitize(title);
  const images = getAllImages(editor);
  modalStore.update(state => ({ ...state, show: false }));

  const { seo, tags } = create_article_store.get();

  const loadingId = showLoaders && infoMessages.add({ type: "loading", text: "Saving article..." });
  const res = await postv2("/api/data/author/article", {
    content: v,
    title: t,
    id,
    author_id: author.id,
    tags,
    seo,
    images,
    uid: author.uid,
    is_draft,
    status: "published"
  }) as any;
  if (showLoaders && loadingId)
  {
    infoMessages.remove(loadingId);
  }
  if (!showLoaders) return res;
  if (res.success)
  {
    infoMessages.add({ type: "success", text: "Article saved!" });
    if (reload)
    {

      setTimeout(() =>
      {
        goto(`/u/author/publication/${author.permalink}/${session.extract('lang')}?view=articles`, { invalidateAll: true });
      })
    }
  } else
  {
    infoMessages.add({ type: "error", text: "Failed to publish article" });
  }
  return res;
}

export async function deleteArticle(article: IArticle | IPageAuthorArticleData)
{
  modalStore.update(state => ({ ...state, show: false }));
  const loadingId = infoMessages.add({ type: "loading", text: "Deleting article..." });
  const res = await fetch(`/api/data/author/article`, {
    method: "DELETE",
    body: JSON.stringify({ id: article.id, uid: article.author.uid })
  });
  infoMessages.remove(loadingId);
  const data = await res.json();
  if (data.success)
  {
    infoMessages.add({ type: "success", text: "Article deleted!" });
  } else
  {
    infoMessages.add({ type: "error", text: "Failed to delete article" });
  }
  return data
}

export async function publish({ id, status, sportstack }: { id?: number, status: "publish" | "unpublish", sportstack: IPageAuthorAuthorData })
{
  modalStore.update(state => ({ ...state, show: false }));
  const loadingId = infoMessages.add({ type: "loading", text: `${status} article...` });
  const res = await fetch(`/api/data/author/article`, {
    method: "PUT",
    body: JSON.stringify({ id: id, status, uid: sportstack.uid })
  });
  infoMessages.remove(loadingId);
  const data = await res.json();
  if (data.success)
  {
    infoMessages.add({ type: "success", text: `Article ${status}ed!` });
    setTimeout(() =>
    {
      goto(`/u/author/publication/${sportstack.permalink}/${session.extract('lang')}?view=articles`);
    })
  } else
  {
    infoMessages.add({ type: "error", text: `Failed to ${status} article` });
  }
  return data
}

export const articleFilterStore: Writable<{ status: 'published' | 'unpublished' | 'draft' | 'all', sortBy: "sortTitle" | "sortPublishDate" | "sortEditedDate" }> = writable({ status: "all", sortBy: "sortEditedDate" });