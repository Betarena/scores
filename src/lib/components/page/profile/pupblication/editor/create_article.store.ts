import { writable } from "svelte/store";
interface ICreateArticleStore
{
  tags: string[],
  seo: {
    title: string,
    description: string,
  },
  access: "free" | "reward_gated",
  reward_tier_id?: number,
  view: "editor" | "preview",
  detectedLang?: {
    lang: string,
    iso: string,
  },
}
function articleStore()
{

  let state: ICreateArticleStore = {
    tags: [] as string[],
    seo: {
      title: "",
      description: "",
    },
    reward_tier_id: 1,
    access: "free",
    view: "editor" as "editor" | "preview",
  }

  const { subscribe, set, update } = writable<ICreateArticleStore>(state);

  subscribe((newState) =>
  {
    state = {access: newState.access, reward_tier_id: newState.reward_tier_id, tags: newState.tags, seo: newState.seo, view: newState.view, detectedLang: newState.detectedLang };
  })

  return {
    subscribe,
    set,
    update,
    get: () => state,
  };
}

export const create_article_store = articleStore();
