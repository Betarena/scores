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

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import { get } from '$lib/api/utils.js';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { dlogv2 } from '$lib/utils/debug.js';
  import { viewportChangeV2 } from '$lib/utils/device.js';

  import Button from '$lib/components/ui/Button.svelte';
  import Tabbar from '$lib/components/ui/Tabbar.svelte';
  import ArticleCard from '../../../common_ui/articles/Article-Card.svelte';
  import ArticleLoader from './Article-Loader.svelte';

  import type {
    IPageAuthorArticleData,
    IPageAuthorAuthorData,
    IPageAuthorTagData,
    IPageAuthorTagDataFinal
  } from '@betarena/scores-lib/types/v8/preload.authors.js';
  import type { IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.tags.js';
  import { prepareArticlesMap, type IArticle, type ITagsWidgetData } from '../../helpers.js';

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

  const
    /**
     * @description
     *  📝 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'content',
    /**
     * @description
     *  📝 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📝 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true]
  ;

  $: ({ windowWidth, globalState } = $sessionStore);
  $: isPWA = globalState.has('IsPWA');
  $: [mobile, tablet]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0]
    )
  ;

  $: widgetData = $page.data as IPageAuthorTagDataFinal & {
    translations: IPageAuthorTranslationDataFinal;
  } | undefined;
  $: pageSeo = $page.data.seoTamplate;
  $: translations = widgetData?.translations;

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
  $: selectedTag = mapTags.get(widgetData?.tagId ?? 0);
  /**
   * @description
   * 📝 Categories avaialble.
   */
  $: categories = selectedTag != undefined ? [selectedTag] : [];

  $: if (browser) updateData(widgetData ?? {} as ITagsWidgetData, true);

  let
    /**
     * @description
     * 📝 `Map` where, `key=tagId` and `value=tagData`.
     */
    mapTagSelectData
      = new Map
        <
          number,
          ITagsWidgetData &
          {
            mapArticlesMod: Map < number, IArticle >;
            currentPage: number
          }
        >(),
    /**
     * @description
     * 📝 State UI for `Loading Articles`.
     */
    isLoadingArticles = true,
    /**
     * @description
     * 📝 `Map` data for `article(s)`, ready for frontend consumption.
     */
    mapArticlesMod =  new Map < number, IArticle >()
  ;

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
   *  📝 Selects `tag`.
   * @param { CustomEvent<IPageAuthorTagData> } e
   *  💠 **REQUIRED** Event argument.
   * @returns { void }
   */
  function selectTag
  (
    e: CustomEvent<IPageAuthorTagData>
  ): void
  {
    // [🐞]
    dlogv2
    (
      'selectTag(..)',
      [
        `🔹 [var] ➤ e :|: ${e}`,
      ],
      true
    );

    selectedTag = e.detail;
    mapArticlesMod = new Map();

    if (!mapTagSelectData.has(selectedTag.id ?? 0))
      loadTagArticles();
    else
      mapArticlesMod = mapTagSelectData.get(selectedTag.id ?? 0)?.mapArticlesMod ?? new Map();
    ;

    return;
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
  function updateData
  (
    dataNew: ITagsWidgetData,
    reset: boolean = false
  ): void
  {
    // [🐞]
    dlogv2
    (
      'updateData(..) // START',
      [
        `🔹 [var] ➤ dataNew :|: ${dataNew}`,
      ],
      true
    );

    if (reset)
    {
      mapArticles = new Map();
      mapAuthors = new Map();
      mapTags = new Map();
      mapTagSelectData = new Map();
      mapArticlesMod = new Map();
    }

    mapArticles = new Map([...mapArticles, ...dataNew.mapArticle]);
    mapAuthors = new Map([...mapAuthors, ...dataNew.mapAuthor]);
    mapTags = new Map([...mapTags, ...dataNew.mapTag]);

    const
      /**
       * @description
       * 📝 `Map` article generated from NEW data.
       */
      mapNewArticlesMod
        = prepareArticlesMap
        (
          new Map(dataNew.mapArticle),
          new Map(dataNew.mapTag),
          new Map(dataNew.mapAuthor),
        )
    ;

    mapArticlesMod = new Map([...mapArticlesMod, ...mapNewArticlesMod]);

    if (!mapTagSelectData.has(dataNew.tagId))
      mapTagSelectData.set
      (
        dataNew.tagId,
        {
          ...dataNew,
          mapArticlesMod,
          currentPage: 0,
          totalArticlesCount: dataNew.totalArticlesCount,
        }
      );
    ;

    isLoadingArticles = false;

    // [🐞]
    dlogv2
    (
      'updateData(..) // END',
      [ ],
      true
    );

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
  function scrollHandler
  (
  ): void
  {
    if (!isPWA && (mobile || tablet)) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5)
      loadMore();
    ;

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
  async function loadMore
  (
  ): Promise < void >
  {
    // [🐞]
    dlogv2
    (
      'loadMore(..)',
      [ ],
      true
    );

    const
      /**
       * @description
       * 📝 Selected 'tag' tab data.
       */
      dataTag = mapTagSelectData.get(selectedTag?.id ?? 0),
      /**
       * @description
       * 📝 Article length.
       */
      length = dataTag?.mapArticlesMod.size || 0
    ;

    if (!selectedTag || !dataTag || length === dataTag.totalArticlesCount) return;

    loadTagArticles
    (
      dataTag.currentPage + 1
    );

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
  async function loadTagArticles
  (
    page: number = 0
  ): Promise < void >
  {
    // [🐞]
    dlogv2
    (
      'loadTagArticles(..) // START',
      [
        `🔹 [var] ➤ page |:| ${page}`,
      ],
      true
    );

    const
      /**
       * @description
       * 📝 Following tags.
       */
      followingTags = $userBetarenaSettings.user?.scores_user_data?.following?.tags
    ;

    let
      /**
       * @description
       * 📝 URL to be requested.
       */
      url = `/api/data/author/content?&lang=${$sessionStore.serverLang}&page=${page}`
    ;

    if (followingTags?.length)
      url += `&followingTags=${followingTags.join(',')}`;
    ;

    isLoadingArticles = true;

    const
      /**
       * @description
       * 📝 Data Response (0).
       */
      dataRes0
        = await get
        (
          url
        ) as ITagsWidgetData
    ;

    updateData(dataRes0);

    // [🐞]
    dlogv2
    (
      'loadTagArticles(..) // END',
      [
        `🔹 [var] ➤ page |:| ${page}`,
      ],
      true
    );

    if (!dataRes0) return;

    mapTagSelectData.set
    (
      selectedTag.id!,
      {
        ...dataRes0,
        mapArticlesMod,
        currentPage: page,
      }
    );

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
│ > INSERT-DESCRIPTION
╰─────
-->
<div
  class="tabbar-wrapper"
>
  {#if categories.length}
    <Tabbar
      on:select={selectTag}
      data={categories}
      selected={selectedTag}
      height={mobile ? 14 : 8}
      let:tab
    >
    {tab.name}
  </Tabbar>
  {/if}
</div>

<!--
╭─────
│ > INSERT-DESCRIPTION
╰─────
-->
<div
  class="content"
>
  <div
    class="listArticlesMod"
  >
    {#each [...mapArticlesMod.entries()] as [id,article] (id)}
      <ArticleCard
        {mobile}
        {article}
        {tablet}
        {translations}
      />
    {/each}

    {#if isLoadingArticles}
      {#each Array(10) as _item}
        <ArticleLoader
          {mobile}
          {tablet}
        />
      {/each}
    {/if}
  </div>

  {#if (tablet || mobile) && !isPWA && mapArticlesMod.size}
    <div class="load-more">
      <Button type="outline" on:click={loadMore}>Load More</Button>
    </div>
  {/if}
</div>
