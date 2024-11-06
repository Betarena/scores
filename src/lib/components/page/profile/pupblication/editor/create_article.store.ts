import { writable } from "svelte/store";
interface CreateArticleStore
{
  tags: any[],
  seo: {
    title: string,
    description: string,
  },
  view: "editor" | "preview",
}
function articleStore()
{

  let state = {
    tags: [] as any[],
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
