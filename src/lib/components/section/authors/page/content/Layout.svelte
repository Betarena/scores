<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import Tabbar from './../../../../ui/Tabbar.svelte';
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯
  import sessionStore from "$lib/store/session.js";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import { viewportChangeV2 } from "$lib/utils/device.js";
  import ArticleCard from "./ArticleCard.svelte";
  import Add from "./assets/add.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { page } from "$app/stores";
  import {
    fetchArticles,
    prepareArticles,
    type IArticle,
    type ITagsWidgetData,
  } from "../helpers.js";
  import type {
    IPageAuthorTagData,
    IPageAuthorTagDataFinal,
    IPageAuthorTranslationDataFinal,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { get } from "$lib/api/utils.js";

  // #endregion ➤ 📦 Package Imports
  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "content",
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true];

  $: ({ windowWidth, globalState } = $sessionStore);
  $: isPWA = globalState.has("IsPWA");
  $: [mobile, tablet] = viewportChangeV2(
    windowWidth,
    VIEWPORT_MOBILE_INIT[0],
    VIEWPORT_TABLET_INIT[0]
  );
  const categories = [
    { id: "forecasts", name: "Forecasts", permalink: "forecasts" },
    { id: "atp", name: "ATP", permalink: "atp" },
  ];
  const articlesStore: Map<
    string,
    ITagsWidgetData & { articles: IArticle[]; currentPage: number }
  > = new Map();
  $: widgetData = $page.data as IPageAuthorTagDataFinal & {
    translations: IPageAuthorTranslationDataFinal;
  };
  let currentTag;


  $: tags = new Map(widgetData.mapTag);
  $: authors = new Map(widgetData.mapAuthor);
  $: articles = prepareArticles(widgetData.mapArticle, tags, authors);
  $: translations = loadTranslations($sessionStore.serverLang);
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  function selectTag(e: CustomEvent<IPageAuthorTagData>) {
    currentTag = e.detail;
    const tag = articlesStore.get(currentTag.id);
    if (!tag) {
      loadTagArticles({ tag: currentTag });
    } else {
      articles = tag.articles;
    }

  }

  async function loadTagArticles({
    tag,
    page = 0,
  }: {
    tag: IPageAuthorTagData;
    page?: number;
  }) {
    debugger;
    const tagData = articlesStore.get(tag.id);
    const res = await fetchArticles({
      permalink: tag.permalink,
      page,
      lang: $sessionStore.serverLang,
      prevData: tagData,
    });
    if (!res) return;
    articles = [...(tagData?.articles || []), ...res.articles];
    articlesStore.set(currentTag.id, {
      ...res.next,
      articles: articles,
      currentPage: page,
    });
  }

  let prevLang;
  async function loadTranslations(lang: string | undefined) {
    if (!lang || prevLang === lang) return;
    prevLang = lang;
    const res = (await get(
      `/api/data/author/tags?translation=${lang}`
    )) as IPageAuthorTranslationDataFinal;
    return res;
  }

  async function loadMore() {
    const tagData = articlesStore.get(currentTag?.id);
    const length = tagData?.articles.length || 0;
    if (!currentTag || !tagData || length === tagData.totalArticlesCount) return;
    loadTagArticles({tag: currentTag, page: tagData.currentPage + 1});
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<section id={CNAME} class:mobile class:tablet class:pwa={isPWA}>
  <div class="tabbar-wrapper">
    {#if globalState.has("Authenticated")}
      <div class="add-icon">
        <Add size={mobile && tablet ? 20 : 24} />
      </div>
    {/if}
    <Tabbar
      on:select={selectTag}
      data={categories}
      selected={currentTag}
      height={mobile ? 14 : 8}
    />
  </div>
  <div class="content">
    <div class="articles">
      {#each articles as article}
        <ArticleCard {mobile} {article} {tablet} {translations} />
      {/each}
    </div>
    {#if (tablet || mobile) && !isPWA && articles.length}
      <div class="load-more">
        <Button type="outline" on:click={loadMore}>Load More</Button>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    width: fit-content;
    max-width: 100%;
    height: 100% !important;
    min-height: 100% !important;
    background: var(--bg-color);
    display: flex;
    padding-top: 32px;
    padding-right: 0;
    flex-direction: column;
    gap: 24px;

    --text-size-2xl: 38px;
    --text-size-xl: 24px;
    --text-size-l: 20px;
    --text-size-m: 16px;
    --text-size-s: 14px;
    --text-size-xs: 12px;
    --text-button-size: var(--text-size-m);

    .tabbar-wrapper {
      width: 100%;
      background-color: var(--bg-color);
      display: flex;
      align-items: start;
      gap: 16px;
      font-size: var(--text-size-m);

      .add-icon {
        margin-top: 2px;
      }
    }

    .articles {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .load-more {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 34px 0;
      background: var(--bg-color);
    }

    &.tablet {
      padding: 32px 34px;
      padding-bottom: 0 !important;
      margin: 0 !important;
      width: 100%;

      &.pwa {
        padding-bottom: 128px !important;
      }
    }

    &.mobile {
      background: var(--layout-bg-color);
      padding: 0 !important;
      padding-bottom: 128px;
      width: 100%;
      gap: 8px;
      --text-size-2xl: 24px;
      --text-size-l: 16px;
      --text-size-m: 14px;
      --text-size-s: 12px;
      --text-size-xs: 10px;

      .tabbar-wrapper {
        padding: 0px 16px;
        padding-top: 4px;
      }

      .articles {
        margin-top: 0;
        gap: 8px;
      }

      .add-icon {
        margin-top: 0;
      }
    }

    &.tablet {
      .add-icon {
        margin-top: 0;
      }
    }
  }
</style>