import type { AuthorsTagsMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
import { writable } from "svelte/store";
interface CreateArticleStore
{
  tags: AuthorsTagsMain[],
  seo: {
    title: string,
    description: string,
  },
  view: "editor" | "preview",
}
function articleStore()
{

  let state = {
    tags: [] as AuthorsTagsMain[],
    seo: {
      title: "",
      description: "",
    },
    view: "editor" as "editor" | "preview",
  }

  const { subscribe, set, update } = writable<CreateArticleStore>(state);

  subscribe((newState) =>
  {
    state = { tags: newState.tags, seo: newState.seo, view: newState.view };
  })

  return {
    subscribe,
    set,
    update,
    get: () => state,
  };
}

export const create_article_store = articleStore();
