<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format |:| V.8.0                                          │
│ ➤ Status |:| 🔒 LOCKED                                                           │
│ ➤ Author(s) |:| @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Betarena (Component) || Authors Content Main                                     │
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

  import { browser } from "$app/environment";
  import { page } from "$app/stores";

  import { get } from "$lib/api/utils.js";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { dlogv2 } from "$lib/utils/debug.js";

  import Button from "$lib/components/ui/Button.svelte";
  import type {
    IPageAuthorTagDataFinal,
    IPageAuthorArticleData,
    IPageAuthorTagData,
    IPageAuthorAuthorData,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import ArticleCard from "../../../common_ui/Article-Card.svelte";
  import ArticleLoader from "../../../common_ui/Article-Loader.svelte";
  import type { ITagsWidgetData, IArticle } from "../../helpers.js";
  import AuthorProfileHeader from "./AuthorProfileHeader.svelte";

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
  export let author, widgetData, translations;

  $: ({ globalState, viewportType } = $sessionStore);
  $: isPWA = globalState.has("IsPWA");
  $: mobile = viewportType === "mobile";
  $: tablet = viewportType === "tablet";

  // $: widgetData = $page.data as
  //   | (IPageAuthorTagDataFinal & {
  //       translations: IPageAuthorTranslationDataFinal;
  //     })
  //   | undefined;
  let currentPage = 1
  $: pageSeo = $page.data.seoTamplate;
  // $: translations = widgetData?.translations;

  /**
   * @description
   * 📝 Interecpted data for `map` instance of `author(s)`.
   */
  $: mapAuthors = new Map(widgetData?.mapAuthor ?? []);
  /**
   * @description
   * 📝 Interecpted data for `map` instance of `tag(s)`.
   */
  $: mapTags = new Map(widgetData?.mapTag ?? []);
  /**
   * @description
   * 📝 Interecpted data for `map` instance of `article(s)`.
   */
  $: mapArticles = new Map(widgetData?.mapArticle ?? []);
  /**
   * @description
   * 📝 Currently selected tag data.
   */

  $: if (browser) updateData(widgetData ?? ({} as ITagsWidgetData), true);

  let
    /**
     * @description
     * 📝 State UI for `Loading Articles`.
     */
    isLoadingArticles = true,
    /**
     * @description
     * 📝 `Map` data for `article(s)`, ready for frontend consumption.
     */
    mapArticlesMod = new Map<number, IArticle>();
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

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Update data for 'content' page.
   * @param { ITagsWidgetData } dataNew
   *  💠 **REQUIRED** New data instance.
   * @returns { void }
   */
  function updateData(dataNew: ITagsWidgetData, reset: boolean = false): void {
    // [🐞]
    dlogv2(
      "updateData(..) // START",
      [`🔹 [var] ➤ dataNew :|: ${dataNew}`],
      true
    );
    if (reset) {
      mapArticles = new Map();
      mapAuthors = new Map();
      mapTags = new Map();
      mapArticlesMod = new Map();
    }

    mapArticles = new Map([...mapArticles, ...dataNew.mapArticle]);
    mapAuthors = new Map([...mapAuthors, ...dataNew.mapAuthor]);
    mapTags = new Map([...mapTags, ...dataNew.mapTag]);

    const /**
       * @description
       * 📝 `Map` article generated from NEW data.
       */
      mapNewArticlesMod = prepareArticles(
        new Map(dataNew.mapArticle),
        new Map(dataNew.mapTag),
        new Map(dataNew.mapAuthor)
      );
    mapArticlesMod = new Map([...mapArticlesMod, ...mapNewArticlesMod]);

    isLoadingArticles = false;

    // [🐞]
    dlogv2("updateData(..) // END", [], true);

    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Prepare article data.
   * @param { Map < number, IPageAuthorArticleData > | null } mapArticle
   *  💠 **REQUIRED** `Map` of article data.
   * @param { Map < number, IPageAuthorTagData > | null } mapTag
   *  💠 **REQUIRED** `Map` of tag data.
   * @param { Map < number, IPageAuthorAuthorData > | null } mapAuthor
   *  💠 **REQUIRED** `Map` of author data.
   * @return { Map < number, IArticle > }
   *  📤 Prepared articles data.
   */
  function prepareArticles(
    mapArticle: Map<number, IPageAuthorArticleData> | null,
    mapTag: Map<number, IPageAuthorTagData> | null,
    mapAuthor: Map<number, IPageAuthorAuthorData> | null
  ): Map<number, IArticle> {
    if (!mapTag || !mapAuthor || !mapArticle) return new Map();

    const /**
       * @description
       * 📝 `Map` of modified article data.
       */
      mapArticleMod = new Map<number, IArticle>();
    // ╭─────
    // │ NOTE: |:| loop through articles and prepare data.
    // ╰─────
    for (const [articleId, articleData] of mapArticle) {
      const /**
         * @description
         * 📝 Prepare article data.
         */
        dataArticle: IArticle = {
          author: mapAuthor.get(articleData.author_id ?? 0) ?? {},
          tags_data: [],
          ...articleData,
        };
      // ╭─────
      // │ NOTE: |:| loop through 'tags' and add final data to `tags_data`.
      // ╰─────
      for (const tagId of articleData.tags ?? []) {
        if (mapTag.has(tagId)) dataArticle.tags_data.push(mapTag.get(tagId)!);
      }

      mapArticleMod.set(articleId, dataArticle);
    }

    return mapArticleMod;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Custom handler for scroll logic.
   * @return { void }
   */
  function scrollHandler(): void {
    if (!isPWA) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5)
      loadMore();
      return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Check for instance of loading more articles.
   * @return { Promise < void > }
   */
  async function loadMore(): Promise<void> {
    // [🐞]
    dlogv2("loadMore(..)", [], true);
    isLoadingArticles = true;
    const
      /**
       * @description
       * 📝 Article length.
       */
      length = mapArticlesMod.size || 0;
    if (length >= widgetData.totalArticlesCount)
      return;

    loadTagArticles(currentPage + 1);

    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Load tag articles.
   * @param { number } [page=0]
   *  💠 **REQUIRED** Number page to request.
   * @return { Promise < void > }
   */
  async function loadTagArticles(page: number = 0): Promise<void> {
    // [🐞]
    dlogv2(
      "loadTagArticles(..) // START",
      [`🔹 [var] ➤ page |:| ${page}`],
      true
    );

    const /**
       * @description
       * 📝 URL to be requested.
       */
      url = `/api/data/author/profile?uid=${author.uid}&page=${page}`;
    const /**
       * @description
       * 📝 Data Response (0).
       */
      dataRes0 = (await get(url)) as ITagsWidgetData;
    updateData(dataRes0);
    currentPage = page;

    // [🐞]
    dlogv2("loadTagArticles(..) // END", [`🔹 [var] ➤ page |:| ${page}`], true);

    if (!dataRes0) return;
    return;
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

<!--
╭─────
│ > User profile info
╰─────
-->

<AuthorProfileHeader {author} />

<!--
╭─────
│ > User articles
╰─────
-->

<div class="content {viewportType}">
  <div class="listArticlesMod">
    {#each [...mapArticlesMod.entries()] as [key, article] (key)}
      <ArticleCard {mobile} {article} {tablet} {translations} />
    {/each}

    {#if isLoadingArticles}
      {#each Array(10) as _item}
        <ArticleLoader {mobile} {tablet} />
      {/each}
    {/if}
  </div>

  {#if !mapArticles.size}
    <div class="no-data">No articles yet</div>
  {/if}

  {#if !isPWA && mapArticlesMod.size}
    <div class="load-more">
      <Button type="outline" on:click={loadMore}>Load More</Button>
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
  .content {
    max-width: 1265px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-top: 28px;

    &.mobile {
      margin-top: 0;
    }
  }

  .listArticlesMod {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .no-data {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    font-weight: 600;
    color: var(--text-color-second);
    font-size: var(--text-size-2xl);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .load-more {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 34px 0;
    background: var(--bg-color);
  }

  .content {
    &.tablet {
      padding: 26px 34px;
      padding-top: 32px;
      padding-inline: 0;
      padding-bottom: 0 !important;
      margin: 0 !important;
      width: 100%;

      &.pwa {
        padding-bottom: 128px !important;
      }

      .add-icon {
        margin-top: 0;
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

      .listArticlesMod {
        margin-top: 0;
        gap: 8px;
      }

      .add-icon {
        margin-top: 0;
      }
    }
  }
</style>
