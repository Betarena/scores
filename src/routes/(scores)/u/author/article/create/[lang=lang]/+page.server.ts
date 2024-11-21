import { error } from "@sveltejs/kit";
import type { PageLoad } from "../../edit/[...permalink]/[lang=lang]/$types.js";
import { entryProfileTabAuthorArticleDraftGet } from "@betarena/scores-lib/dist/functions/v8/profile.main.js";
import type { AuthorsArticlesMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";

export const load: PageLoad = async ({ url }) =>
{
  const id = url.searchParams.get("draft");
  let article = {
    content: "",
    title: "",
    tags: []
  } as AuthorsArticlesMain
  try
  {
    if (id)
    {
      const res = await entryProfileTabAuthorArticleDraftGet({ numArticleId: Number(id) }) as any;
      article = res?.article || article;
    }
    return { article }
  } catch (e)
  {
    throw error(500, { message: 'Internal server error' } as App.Error);
  }
};