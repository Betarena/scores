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
  import { dlogv2 } from "$lib/utils/debug.js";

  import Button from "$lib/components/ui/Button.svelte";

  import type {
    IPageAuthorAuthorData,
    IPageAuthorSportstackData,
    IPageAuthorTagData,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";
  import {
    prepareArticlesMap,
    type IArticle,
    type ITagsWidgetData,
  } from "../../helpers.js";
  import SportstackHeader from "./SportstackHeader.svelte";
  import FollowersList from "../../../common_ui/FollowersList.svelte";
  import ArticlesList from "../../../common_ui/articles/ArticlesList.svelte";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";

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

  export let widgetData: IPageAuthorAuthorData,
    translations: IPageAuthorTranslationDataFinal;
  $: ({ globalState, viewportType } = $sessionStore);
  $: isPWA = globalState.has("IsPWA");
  $: mobile = viewportType === "mobile";
  $: tablet = viewportType === "tablet";

  $: pageSeo = $page.data.seoTamplate;
  $: sportstackData = widgetData?.mapAuthor?.length
    ? widgetData?.mapAuthor[0]
    : ({} as IPageAuthorAuthorData);
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
   * 📝 Categories avaialble.
   */

  $: if (browser) updateData(widgetData ?? {}, true);

  let /**
     * @description
     * 📝 State UI for `Loading Articles`.
     */
    isLoadingArticles = true,
    /**
     * @description
     * 📝 `Map` data for `article(s)`, ready for frontend consumption.
     */
    mapArticlesMod = new Map<number, IArticle>(),
    /**
     * @description
     * 📝 current view mode;
     */
    currentView: "posts" | "people" = "posts",
    /**
     * @description
     * 📝 current page number;
     */
    currentPage = 1;

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
   *  📝 Selects `mode`.
   * @param { CustomEvent<IPageAuthorTagData> } e
   *  💠 **REQUIRED** Event argument.
   * @returns { void }
   */
  function selectMode(e: CustomEvent<{ id: string }>): void {
    // [🐞]
    dlogv2("selectMode(..)", [`🔹 [var] ➤ e :|: ${e}`], true);
    const { id } = e.detail;
    currentView = id as "posts" | "people";
    // selectedTag = e.detail;
    // mapArticlesMod = new Map();
    // if (!mapTagSelectData.has(selectedTag.id ?? 0)) loadTagArticles();
    // else
    //   mapArticlesMod =
    //     mapTagSelectData.get(selectedTag.id ?? 0)?.mapArticlesMod ?? new Map();
    // return;
  }

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
  function updateData(
    dataNew: IPageAuthorSportstackData,
    reset: boolean = false
  ): void {
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
      currentPage = 1;
    }

    mapArticles = new Map([...mapArticles, ...dataNew.mapArticle]);
    mapAuthors = new Map([...mapAuthors, ...dataNew.mapAuthor]);
    mapTags = new Map([...mapTags, ...dataNew.mapTag]);

    const /**
       * @description
       * 📝 `Map` article generated from NEW data.
       */
      mapNewArticlesMod = prepareArticlesMap(
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

    const length = mapArticlesMod.size || 0;
    if (length >= widgetData.totalArticlesCount) return;

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
    isLoadingArticles = true;
    const permalink = sportstackData[1].data?.username
      .toLowerCase()
      .replaceAll(" ", "-");
    const /**
       * @description
       * 📝 URL to be requested.
       */
      url = `/api/data/author/sportstack?permalink=${permalink}&page=${page}`;
    const /**
       * @description
       * 📝 Data Response (0).
       */
      dataRes0 = (await get(url)) as ITagsWidgetData;
    isLoadingArticles = false;
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

<SportstackHeader {sportstackData} {translations} on:select={selectMode} />

<!--
╭─────
│ > Articles view
╰─────
-->
<div class="content {viewportType}">
  {#if currentView === "posts"}
    <ArticlesList
      articles={mapArticlesMod}
      {translations}
      {isLoadingArticles}
    />
  {:else}
    <!--
╭─────
│ > People view
╰─────
-->
    <FollowersList users={[]} {translations} emptyMessage="No people yet" />
  {/if}

  {#if !isPWA && ((currentView === "posts" && mapArticlesMod.size) || (currentView === "people" && 0))}
    <div class="load-more">
      <Button type="outline" on:click={loadMore}>
        <TranslationText text={translations.view_more} fallback="View More" />
      </Button>
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
    width: 100%;
    padding-top: 24px;
    flex-grow: 1;
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
      padding-top: 0;
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

      .add-icon {
        margin-top: 0;
      }
    }
  }
</style>