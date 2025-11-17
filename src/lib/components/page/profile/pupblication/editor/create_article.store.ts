import { writable } from "svelte/store";
interface ICreateArticleStore
{
  tags: string[],
  seo: {
    title: string,
    description: string,
  },
  access: "free" | "paid",
  rewards_amount?: number,
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
    rewards_amount: 1,
    access: "free",
    view: "editor" as "editor" | "preview",
  }

  const { subscribe, set, update } = writable<ICreateArticleStore>(state);

  subscribe((newState) =>
  {
    state = {access: newState.access, rewards_amount: newState.rewards_amount, tags: newState.tags, seo: newState.seo, view: newState.view, detectedLang: newState.detectedLang };
  })

  return {
    subscribe,
    set,
    update,
    get: () => state,
  };
}

export const create_article_store = articleStore();
