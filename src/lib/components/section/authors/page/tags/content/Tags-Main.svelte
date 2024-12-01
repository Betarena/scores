<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @izobov                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Authors Tags Main                                                      │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
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
  import { viewportChangeV2 } from "$lib/utils/device";

  import TagsHeader from "./Tags-Header.svelte";
  import TagsLoaderContentMobile from "./loaders/Tags-Loader-Content-Mobile.svelte";
  import TagsLoaderContent from "./loaders/Tags-Loader-Content.svelte";
  import ArticleCard from "./Articels-Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import type {
    IPageAuthorArticleData,
    IPageAuthorAuthorData,
    IPageAuthorTagDataFinal,
    IPageAuthorTagData,
    IPageAuthorTranslationDataFinal,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { get } from "$lib/api/utils.js";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import {
    fetchArticles,
    prepareArticles,
    type ITagsWidgetData,
  } from "../../helpers.js";
  import { page } from "$app/stores";
  import type { IArticle } from "../../../common_ui/helpers.js";
  import { browser } from "$app/environment";

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

  export let /**
     * @augments IArticleData
     */
    widgetData: ITagsWidgetData;
  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "author⮕w⮕tag-content⮕main",
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
  //  /**
  //  * @description
  //  *  📣 infinite scroll threshold  for 💻 TABLET and 📱 MOBILE
  //  */
  // const threshold = 95;
  /**
   * @description
   *  📣 selected language in dropdown to
   * filter articles by language
   *    */
  let selectedLang: string | null = "all";
  /**
   * @description
   *  📣 array of articles that will be rendered
   *    */

  let pendingArticles = false;

  $: ({ windowWidth } = $sessionStore);
  $: [mobile, tablet] = viewportChangeV2(
    windowWidth,
    VIEWPORT_MOBILE_INIT[0],
    VIEWPORT_TABLET_INIT[0]
  );

  // #endregion ➤ 📌 VARIABLES

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * convert widgetData to Map
   *
   * WARNING:
   * triggered by changes in:
   * - `` - **widgetData**
   */
  let tags: Map<number, IPageAuthorTagData> = new Map();
  let authors: Map<number, IPageAuthorTagData> = new Map();
  let currentTag: IPageAuthorTagData = {};
  let articles = [] as IArticle[];
  let prevTagName;
  let pageNumber = 1;
  $: ({ totalArticlesCount } = widgetData);
  $: ({ serverLang } = $sessionStore);
  let translations: IPageAuthorTranslationDataFinal = {};
  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * it reruns loadArticles every time articles has changed
   *
   * WARNING:
   * triggered by changes in:
   * - `` - **articles**
   */
  $: if (browser) loadTranslations(serverLang);
  $: if (prevTagName !== $page.params.name) {
    translations = widgetData.translations;
    reloadData(widgetData);
    prevTagName = $page.params.name;
  }

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

  function reloadData(data) {
    tags = new Map(data.mapTag);
    authors = new Map(data.mapAuthor);
    articles = prepareArticles(data.mapArticle, tags, authors);
    currentTag = tags.get(data.tagId) as IPageAuthorTagData || {};
    pageNumber = 1;
  }
  async function loadArticles() {
    if (!currentTag?.permalink) return;
    if (articles.length >= totalArticlesCount) return;
    pendingArticles = true;
    const res = await fetchArticles({
      permalink: currentTag?.permalink,
      page: pageNumber,
      lang: sessionStore.extract("lang"),
      prevData: {...widgetData, mapArticle: articles.map(a => ([a.id, a])) as [number, IPageAuthorArticleData][]},
    });
    articles = [...articles, ...res.articles];
    pendingArticles = false;
    totalArticlesCount = res.totalArticlesCount;
    pageNumber++;
  }

  async function filter(e: CustomEvent<string>) {
    const lang = e.detail;
    selectedLang = lang === "all" ? null : lang;
    pendingArticles = true;
    articles = [];
    const res = (await get(
      `/api/data/author/tags?permalinkTag=${currentTag.permalink}${
        selectedLang ? `&lang=${selectedLang}` : ""
      }`
    )) as IPageAuthorTagDataFinal;
    if (!res) return pendingArticles = false;
    widgetData = {
      ...widgetData,
      ...res,
      mapTag: [...widgetData.mapTag, ...res.mapTag],
    };
    reloadData(widgetData);
    totalArticlesCount = res.totalArticlesCount;
    pendingArticles = false;
  }
  let prevLang;
  async function loadTranslations(lang: string | undefined) {
    if (!lang || prevLang === lang) return;
    prevLang = lang;
    const res = (await get(
      `/api/data/author/tags?translation=${lang}`
    )) as IPageAuthorTranslationDataFinal;
    translations = { ...res };
    const ev = new CustomEvent("translations", { detail: lang });
    filter(ev);
  }

  function scrollHandler() {
    if (pendingArticles || (!mobile && !tablet)) return;
    if (articles.length >= totalArticlesCount) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
      loadArticles();
    }
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<svelte:window on:scroll={scrollHandler} />

<div id={CNAME} class="tags-main" class:tablet class:mobile>
  <TagsHeader
    tag={currentTag}
    {translations}
    {totalArticlesCount}
    {mobile}
    {tablet}
    on:filter={filter}
  />
  {#if !mobile}
    <div class="splitter" />
  {/if}
  <div class="articles" class:mobile>
    {#each articles as article (article?.id)}
      {#if article}
        <ArticleCard {article} {tablet} {mobile} {translations} />
      {/if}
    {/each}
    {#if pendingArticles}
      {#each Array(10) as _item}
        {#if mobile}
          <TagsLoaderContentMobile />
        {:else}
          <TagsLoaderContent />
        {/if}
      {/each}
    {/if}
  </div>
  {#if !mobile && !tablet}
    <div class="section-footer">
      <div class="page-info">
        {articles.length}/{totalArticlesCount}
        <TranslationText
          key={`unknown`}
          text={translations.articles}
          fallback={"articles"}
        />
      </div>
      {#if articles.length < totalArticlesCount}
        <Button type="outline" on:click={() => loadArticles()}
          ><TranslationText
            key={`unknown`}
            text={translations.view_more}
            fallback={"View more"}
          /></Button
        >
      {/if}
    </div>
  {/if}
</div>

<!--
 ╭──────────────────────────────────────────────────────────────────────────────────╮
 │ 🌊 Svelte Component CSS/SCSS                                                     │
 ┣──────────────────────────────────────────────────────────────────────────────────┫
 │ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
 │         │ values by typing/CTRL+SPACE                                            │
 │ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
 ╰──────────────────────────────────────────────────────────────────────────────────╯
 -->

<style lang="scss">
  .tags-main {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
    height: 100%;
    --text-size-2xl: 38px;
    --text-size-xl: 24px;
    --text-size-l: 20px;
    --text-size-m: 16px;
    --text-size-s: 14px;
    --text-size-xs: 12px;
    --text-button-size: var(--text-size-m);

    .splitter {
      height: 1px;
      width: 100%;
      background: var(--border-color-light);
    }

    .articles {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
    }

    .section-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .page-info {
        color: var(--text-color-second);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
      }
    }

    &.mobile {
      --text-size-2xl: 24px;
      --text-size-l: 16px;
      --text-size-m: 14px;
      --text-size-s: 12px;
      --text-size-xs: 10px;
      gap: 0;

      .articles {
        gap: 40px;
      }

      .section-footer {
        padding: 0 24px;
      }
    }
  }
</style>
