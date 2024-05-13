<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { userBetarenaSettings } from '$lib/store/user-settings.js';
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
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import { viewportChangeV2 } from "$lib/utils/device.js";
  import ArticleCard from "./ArticleCard.svelte";
  // import Add from "./assets/add.svelte";
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
  import { invalidateAll } from "$app/navigation";
  import ArticleLoader from "./ArticleLoader.svelte";
  import SeoBox from "$lib/components/SEO-Box.svelte";
  import SvelteSeo from "svelte-seo";
  import { tryCatch } from "@betarena/scores-lib/dist/util/common.js";

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
  let articlesStore: Map<
    string,
    ITagsWidgetData & { articles: IArticle[]; currentPage: number }
  > = new Map();
  $: widgetData = $page.data as IPageAuthorTagDataFinal & {
    translations: IPageAuthorTranslationDataFinal;
  };
  $: pageSeo = $page.data.seoTamplate;
  let currentTag;
  let translations: IPageAuthorTranslationDataFinal;
  $: tags = new Map(widgetData.mapTag);
  $: authors = new Map(widgetData.mapAuthor);
  $: articles = prepareArticles(widgetData.mapArticle, tags, authors);
  $: loadTranslations($sessionStore.serverLang);
  $: categories = [tags.get(widgetData.tagId)];
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
    articles = [];
    const tag = articlesStore.get(currentTag.id);
    if (!tag) {
      loadTagArticles({ tag: currentTag });
    } else {
      articles = tag.articles;
    }
  }

  let pendingArticles = true;
  async function loadTagArticles({
    tag,
    page = 0,
  }: {
    tag: IPageAuthorTagData;
    page?: number;
  }) {
    pendingArticles = true;
    const tagData = articlesStore.get(tag.id);
    const followingTags =
      $userBetarenaSettings.user?.scores_user_data?.following?.tags || [];
    const url = `/api/data/author/content?&lang=${
      $sessionStore.serverLang
    }&page=${page}&followingTags=${followingTags.join(",")}`;
    const res = await fetchArticles({
      url,
      prevData: tagData,
    });
    pendingArticles = false;
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
    articlesStore = new Map();
    articles = [];
    pendingArticles = true;
    const res = (await get(
      `/api/data/author/tags?translation=${lang}`
    )) as IPageAuthorTranslationDataFinal;
    translations = res;
    await invalidateAll();
    pendingArticles = false;
  }

  async function loadMore() {
    const tagData = articlesStore.get(currentTag?.id);
    const length = tagData?.articles.length || 0;
    if (!currentTag || !tagData || length === tagData.totalArticlesCount)
      return;
    loadTagArticles({ tag: currentTag, page: tagData.currentPage + 1 });
  }

  function scrollHandler() {
    if (!isPWA && (mobile || tablet)) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
      loadMore();
    }
  }

  // #endregion ➤ 🛠️ METHODS
</script>

{#if pageSeo}
  <SvelteSeo
    title={pageSeo.main_data.title}
    description={pageSeo.main_data.description}
    keywords={pageSeo.main_data.keywords}
    noindex={tryCatch(() => {
      return JSON.parse(pageSeo.main_data.noindex);
    }) ?? false}
    nofollow={tryCatch(() => {
      return JSON.parse(pageSeo.main_data.nofollow);
    }) ?? false}
    canonical={`${$page.url.origin}/a/content`}
    twitter={pageSeo.twitter_card}
    openGraph={pageSeo.opengraph}
  />
{/if}

<SeoBox>
  <h1>{tags.get(widgetData.tagId)?.name}</h1>
  {#each widgetData.mapArticle ?? [] as [_id, article]}
    <h2>{article?.data?.title}</h2>
    <a href={`/a/${article?.permalink}`}>{article?.data?.title}</a>
    {@html article?.data?.content}
  {/each}
  {#each widgetData.mapTag ?? [] as [_id, tag]}
    <a href={`/a/tag/${tag?.permalink}`}>{tag.name}</a>
  {/each}
</SeoBox>
<svelte:window on:scroll={scrollHandler} />
<section id={CNAME} class:mobile class:tablet class:pwa={isPWA}>
  <div class="tabbar-wrapper">
    <!-- {#if globalState.has("Authenticated")}
      <div class="add-icon">
        <Add size={mobile && tablet ? 20 : 24} />
      </div>
    {/if} -->
    {#if categories?.length}
      <Tabbar
        on:select={selectTag}
        data={categories}
        selected={currentTag}
        height={mobile ? 14 : 8}
      />
    {/if}
  </div>
  <div class="content">
    <div class="articles">
      {#each articles as article}
        <ArticleCard {mobile} {article} {tablet} {translations} />
      {/each}
      {#if pendingArticles}
        {#each Array(10) as _item}
          <ArticleLoader {mobile} {tablet} />
        {/each}
      {/if}
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
    :global(svg) {
      width: unset;
    }

    width: fit-content;
    max-width: 100%;
    height: 100% !important;
    min-height: 100% !important;
    background: var(--bg-color);
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 0;
    padding: 0;

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
      width: 824px;
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
      padding: 26px 34px;
      padding-top: 32px;
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
