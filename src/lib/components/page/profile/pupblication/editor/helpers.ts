import { Editor } from "@tiptap/core";
import DOMPurify from "dompurify";
import { postv2 } from "$lib/api/utils.js";
import { modalStore } from "$lib/store/modal.js";
import { infoMessages } from "$lib/components/ui/infomessages/infomessages.js";
import { create_article_store } from "./create_article.store.js";
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


export async function publish(editor: Editor, title: string, author_id: string | number)
{
  const v = DOMPurify.sanitize(editor.getHTML());
  const t = DOMPurify.sanitize(title);
  const images = getAllImages(editor);
  modalStore.update(state => ({ ...state, show: false }));

  const { seo } = create_article_store.get();

  const loadingId = infoMessages.add({ type: "loading", text: "Publishing article..." });
  const res = await postv2("/api/data/author/article", {
    content: v,
    title: t,
    author_id,
    seo,
    images,
    status: "published"
  }) as any;
  infoMessages.remove(loadingId);
  if (res.success)
  {
    infoMessages.add({ type: "success", text: "Article published!" });
  } else
  {
    infoMessages.add({ type: "error", text: "Failed to publish article" });
  }
}