import { writable } from "svelte/store";

export const create_article_store = writable({ view: "editor", tags: [], seo: {} });